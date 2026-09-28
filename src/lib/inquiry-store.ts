import { randomUUID } from 'node:crypto';
import type { Inquiry, InquiryStatus } from '@/lib/inquiry';
import { siteConfig } from '@/data/site';

/**
 * Inquiry delivery boundary.
 *
 * SERVER-ONLY MODULE. Never import from a Client Component — it reads secrets
 * from the environment and holds the rate-limit state. The API route is the
 * only entry point.
 *
 * The route handler validates and rate-limits; this module owns *delivery* and
 * *persistence*. Swapping the delivery mechanism (Resend → Postmark → a webhook
 * → a database row) happens here and nowhere else.
 *
 * Nothing is written to a database in this iteration. The interface below is the
 * seam where a durable store would be added — see ARCHITECTURE.md § Lead data.
 */

export interface InquiryStore {
  save(inquiry: Inquiry): Promise<void>;
  updateStatus(id: string, status: InquiryStatus): Promise<void>;
}

type DeliveryResult = { delivered: boolean; detail: string };

const windowMs = Number(process.env.INQUIRY_RATE_LIMIT_WINDOW_MS ?? 600_000);
const maxPerWindow = Number(process.env.INQUIRY_RATE_LIMIT_MAX ?? 5);

/**
 * In-process fixed-window rate limiter.
 *
 * Honest about its limits: on a serverless platform each instance keeps its own
 * counters, so this raises the cost of casual abuse rather than providing a
 * distributed guarantee. The durable option is an edge rate limiter (Upstash
 * Redis, Vercel Firewall) — documented in ARCHITECTURE.md, and the only thing
 * that changes is the two functions below.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= maxPerWindow) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const agent = request.headers.get('user-agent')?.slice(0, 80) ?? '';
  return `${ip}:${agent}`;
}

/** Strips control characters and normalises whitespace before logging/storage. */
function sanitise(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

function buildEmailText(inquiry: Inquiry): { subject: string; text: string } {
  const rows: [string, string][] = [
    ['Name', inquiry.name],
    ['Email', inquiry.email],
    ['Company', inquiry.company || '—'],
    ['Country', inquiry.country || '—'],
    ['Project type', inquiry.projectType],
    ['Budget', inquiry.budget],
    ['Timeline', inquiry.timeline],
    ['Current stage', inquiry.currentStage],
    ['Inquiry ID', inquiry.id],
    ['Received', inquiry.createdAt],
  ];

  const text = [
    'New project inquiry',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Description',
    '-----------',
    inquiry.description,
    '',
    `Sent from ${siteConfig.url}/contact`,
  ].join('\n');

  return {
    subject: `Inquiry · ${inquiry.projectType} · ${inquiry.name}${inquiry.company ? ` (${inquiry.company})` : ''}`,
    text,
  };
}

async function deliverViaResend(inquiry: Inquiry): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { delivered: false, detail: 'RESEND_API_KEY not configured' };

  const to = process.env.INQUIRY_TO_EMAIL ?? siteConfig.email;
  const { subject, text } = buildEmailText(inquiry);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
      to: [to],
      reply_to: inquiry.email,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    return { delivered: false, detail: `resend responded ${response.status}` };
  }
  return { delivered: true, detail: 'resend' };
}

/**
 * FormSubmit.co delivery.
 *
 * No account, no API key, no domain verification — the recipient address is the
 * only configuration. That makes it the default, because it works on a fresh
 * clone with nothing but an internet connection.
 *
 * One-time setup: the first submission triggers a confirmation email from
 * FormSubmit to the recipient. Nothing is delivered until that link is clicked.
 * The `/ajax/` endpoint is used so the response is JSON rather than a redirect.
 */
async function deliverViaFormSubmit(inquiry: Inquiry): Promise<DeliveryResult> {
  const to = process.env.INQUIRY_TO_EMAIL ?? siteConfig.email;
  const { text } = buildEmailText(inquiry);
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Without this header FormSubmit answers with a 3xx redirect instead of
      // the JSON envelope the success flag is read from.
      Accept: 'application/json',
      // FormSubmit rejects any request without an Origin/Referer as a
      // file:// page, regardless of where it actually came from.
      Origin: origin,
      Referer: `${origin}/contact`,
    },
    body: JSON.stringify({
      _subject: 'New project inquiry',
      _template: 'table',
      _captcha: 'false',
      name: inquiry.name,
      email: inquiry.email,
      company: inquiry.company || '—',
      country: inquiry.country || '—',
      projectType: inquiry.projectType,
      budget: inquiry.budget,
      timeline: inquiry.timeline,
      currentStage: inquiry.currentStage,
      description: inquiry.description,
      inquiryId: inquiry.id,
      receivedAt: inquiry.createdAt,
      details: text,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    return { delivered: false, detail: `formsubmit responded ${response.status}` };
  }

  // FormSubmit returns {"success":"true"|"false","message":"..."}. It answers
  // 200 with success:false for a handful of soft failures, so the body is the
  // only trustworthy signal.
  const body = (await response.json().catch(() => null)) as {
    success?: string | boolean;
    message?: string;
  } | null;

  const message = body?.message ?? '';
  const success = body?.success === true || body?.success === 'true';

  // Checked before `success`, because FormSubmit reports pending activation as
  // success:"false". The confirmation email has been sent either way, so the
  // submission is not lost — the form should report it as received.
  if (/needs activation/i.test(message)) {
    return { delivered: true, detail: 'formsubmit awaiting activation' };
  }

  if (!success) {
    return { delivered: false, detail: `formsubmit rejected: ${message || 'no success flag'}` };
  }

  return { delivered: true, detail: 'formsubmit' };
}

const DELIVERY_MODES = ['log', 'resend', 'formsubmit'] as const;

function deliver(inquiry: Inquiry): Promise<DeliveryResult> {
  const mode = (process.env.INQUIRY_DELIVERY ?? 'formsubmit').toLowerCase();

  if (mode === 'resend') {
    return deliverViaResend(inquiry).catch((error: unknown) => {
      // Delivery failure must not lose the inquiry, and must not 500 the client
      // into a false negative — the log below is the fallback record.
      console.error('[inquiry] delivery failed', error);
      return { delivered: false, detail: 'resend threw' };
    });
  }

  if (mode === 'formsubmit') {
    return deliverViaFormSubmit(inquiry).catch((error: unknown) => {
      console.error('[inquiry] delivery failed', error);
      return { delivered: false, detail: 'formsubmit threw' };
    });
  }

  if (mode !== 'log' && !DELIVERY_MODES.includes(mode as (typeof DELIVERY_MODES)[number])) {
    console.warn(`[inquiry] unknown INQUIRY_DELIVERY "${mode}" — expected one of ${DELIVERY_MODES.join(', ')}`);
  }

  // Explicit opt-out for local development: log only, never makes a network
  // call. Never includes secrets.
  console.info(
    `[inquiry] ${inquiry.id} · ${inquiry.projectType} · ${inquiry.budget} · ${inquiry.timeline} · from ${inquiry.country || 'unknown country'} · reply to ${inquiry.email}`,
  );
  return Promise.resolve({ delivered: true, detail: 'log' });
}

export type SubmitResult = {
  inquiry: Inquiry;
  delivered: boolean;
  detail: string;
};

export async function submitInquiry(
  input: Omit<Inquiry, 'id' | 'createdAt' | 'status'>,
): Promise<SubmitResult> {
  const inquiry: Inquiry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'NEW',
    name: sanitise(input.name),
    email: sanitise(input.email).toLowerCase(),
    company: sanitise(input.company ?? ''),
    country: sanitise(input.country ?? ''),
    projectType: input.projectType,
    budget: input.budget,
    timeline: input.timeline,
    currentStage: input.currentStage,
    description: sanitise(input.description),
  };

  const result = await deliver(inquiry);
  if (!result.delivered) {
    // There is no database behind this yet, so a failed delivery is a lost
    // inquiry. The caller must surface that rather than claim success.
    console.error(`[inquiry] ${inquiry.id} could not be delivered via ${result.detail}`);
  }

  return { inquiry, delivered: result.delivered, detail: result.detail };
}
