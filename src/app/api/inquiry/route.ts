import { NextResponse } from 'next/server';
import { inquirySchema } from '@/lib/inquiry';
import { checkRateLimit, clientKey, submitInquiry } from '@/lib/inquiry-store';
import { siteConfig } from '@/data/site';

/**
 * POST /api/inquiry
 *
 * Server boundary for the contact form. Order matters:
 *   1. rate limit   — cheap rejection before parsing
 *   2. parse        — Zod is the only source of truth for what is acceptable
 *   3. persist/log  — synchronous, so a failed send is visible rather than silent
 *
 * There is no database yet. Inquiries are logged server-side and optionally
 * delivered by email. See TODO_CONTENT.md for the CRM/persistence decision.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function tooMany(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      ok: false,
      message: `Too many messages from this address. Try again in ${retryAfterSeconds}s.`,
    },
    { status: 429, headers: { 'retry-after': String(retryAfterSeconds) } },
  );
}

export async function POST(request: Request) {
  const key = clientKey(request);

  const limit = checkRateLimit(key);
  if (!limit.allowed) return tooMany(limit.retryAfterSeconds);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Could not read the request body.' },
      { status: 400 },
    );
  }
  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    // Surface the first field error so the form can highlight it, without
    // echoing the whole payload back to the caller.
    const first = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        message: first?.message ?? 'Please check the form and try again.',
        field: first?.path[0] as string | undefined,
      },
      { status: 422 },
    );
  }

  const input = parsed.data;

  // Honeypot filled: return success so a bot does not learn it was detected.
  if (input.companyWebsite) {
    return NextResponse.json({ ok: true, message: 'Thanks — message received.' });
  }

  // The honeypot is a submission concern, not part of the stored record.
  const { companyWebsite: _discard, ...record } = input;

  try {
    // Delivery failures are recorded by the store, not thrown — the inquiry is
    // still built, and the user gets the email fallback in the UI.
    const { inquiry, delivered } = await submitInquiry(record);

    if (!delivered) {
      // Nothing is persisted, so a false success here silently loses the lead.
      // Say so, and point at the address that always works.
      return NextResponse.json(
        {
          ok: false,
          message: `Message could not be delivered. Please email ${siteConfig.email} directly.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { ok: true, id: inquiry.id, message: 'Message received. I will reply shortly.' },
      { status: 201 },
    );
  } catch (error) {
    // The user gets a usable fallback path; the detail stays in the server log.
    console.error('[inquiry] unexpected failure', error);
    return NextResponse.json(
      {
        ok: false,
        message: 'Something went wrong sending that. Please email me directly.',
      },
      { status: 500 },
    );
  }
}
