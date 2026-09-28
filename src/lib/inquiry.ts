import { z } from 'zod';

/**
 * Project inquiry data model.
 *
 * Field set matches PRODUCT_STRATEGY.md § Lead qualification: enough to triage a
 * lead (type, budget, stage, timeline) without collecting data that is not
 * needed to start the conversation.
 */

export const INQUIRY_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  projectType: string;
  budget: string;
  timeline: string;
  currentStage: string;
  description: string;
  createdAt: string;
  status: InquiryStatus;
};

export const PROJECT_TYPES = [
  'AI Product',
  'SaaS',
  'Web Application',
  'Cloud / DevOps',
  'Production Rescue',
  'Ongoing Engineering',
  'Other',
] as const;

export const BUDGET_RANGES = ['<$2k', '$2k–$5k', '$5k–$10k', '$10k–$25k', '$25k+'] as const;

export const TIMELINES = [
  'As soon as possible',
  'Within a month',
  '1–3 months',
  '3–6 months',
  'Just exploring',
] as const;

export const CURRENT_STAGES = [
  'Idea only',
  'Prototype exists',
  'Live product',
  'Scaling / rebuilding',
  'Production problems',
] as const;

const trimmed = (max: number) => z.string().trim().max(max);

export const inquirySchema = z.object({
  name: trimmed(120).min(2, 'Please enter your name.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(200, 'That email address is too long.')
    .pipe(z.email('Please enter a valid email address.')),
  company: trimmed(160).optional().default(''),
  country: trimmed(80).optional().default(''),
  projectType: z.enum(PROJECT_TYPES, { message: 'Please choose a project type.' }),
  budget: z.enum(BUDGET_RANGES, { message: 'Please choose a budget range.' }),
  timeline: z.enum(TIMELINES, { message: 'Please choose a timeline.' }),
  currentStage: z.enum(CURRENT_STAGES, { message: 'Please choose the current stage.' }),
  description: trimmed(4000)
    .min(40, 'Please describe the project in a little more detail — at least 40 characters.')
    .max(4000, 'Please keep the description under 4000 characters.'),
  /**
   * Spam trap. A real user never sees this field; it is hidden from sight and
   * from assistive technology, and removed from the server boundary.
   */
  companyWebsite: z.string().max(0, 'Rejected.').optional().default(''),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/**
 * Mutable shape used by the client form. Kept alongside the schema so the form
 * cannot drift from what the server accepts — the draft is validated by the
 * same `inquirySchema` on submit.
 */
export type InquiryDraft = InquiryInput;

/** Human label for a stored budget range, e.g. `$5k–$10k` -> `USD $5k – $10k`. */
export function budgetRangeLabel(range: (typeof BUDGET_RANGES)[number]): string {
  return range === '<$2k' ? 'Under $2k' : `${range} USD`;
}

export type FieldErrors = Partial<Record<keyof InquiryInput, string>>;

export type InquiryResult =
  | { ok: true; id: string; message: string }
  | { ok: false; message: string; errors?: FieldErrors; field?: string };
