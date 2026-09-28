'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  BUDGET_RANGES,
  CURRENT_STAGES,
  PROJECT_TYPES,
  TIMELINES,
  budgetRangeLabel,
  type InquiryDraft,
} from '@/lib/inquiry';
import { siteConfig } from '@/data/site';
import { track } from '@/lib/analytics-client';
import { ButtonLink } from '@/components/ui/button';
import { Container, Section, SectionHeader, Tag } from '@/components/ui/section';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const initialDraft: InquiryDraft = {
  name: '',
  email: '',
  company: '',
  country: '',
  projectType: PROJECT_TYPES[0],
  budget: BUDGET_RANGES[0],
  timeline: TIMELINES[0],
  currentStage: CURRENT_STAGES[0],
  description: '',
  companyWebsite: '',
};

const fieldClass =
  'w-full appearance-none rounded-md border border-line-2 bg-canvas px-3 py-2.5 text-sm text-ink transition-colors duration-200 placeholder:text-ink-4 hover:border-line-3 focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent';

const labelClass = 't-label mb-2 block';

/** Pre-filled WhatsApp click-to-chat. `wa.me` requires the bare number. */
const whatsappUrl = `https://wa.me/${siteConfig.phone.e164}?text=${encodeURIComponent(
  "Hi Kartheek — I'd like to discuss a project.",
)}`;

type Field = keyof InquiryDraft;

function Select({
  id,
  label,
  optional,
  value,
  options,
  onChange,
  format,
}: {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  format?: (value: string) => string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} {optional ? <span className="text-ink-4">(optional)</span> : null}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {format ? format(option) : option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Contact() {
  const [draft, setDraft] = useState<InquiryDraft>(initialDraft);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const update =
    (field: Field) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setDraft((prev) => ({ ...prev, [field]: event.target.value }));
    };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const payload = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !payload.ok) {
        setStatus('error');
        setMessage(payload.message ?? 'Something went wrong. Please email me directly.');
        track({ name: 'inquiry_error' });
        return;
      }

      setStatus('success');
      track({
        name: 'inquiry_submitted',
        projectType: draft.projectType,
        budget: draft.budget,
      });
    } catch {
      setStatus('error');
      setMessage('The request could not be sent. Please email me directly and I will reply there.');
      track({ name: 'inquiry_error' });
    }
  }

  const pending = status === 'submitting';

  return (
    <Section id="contact" aria-labelledby="contact-title">
      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Pitch */}
          <div className="lg:col-span-5">
            <SectionHeader
              id="contact-title"
              index="12"
              eyebrow="Contact"
              align="start"
              title="Start a conversation."
              lede="Tell me what you are building, what is in the way, and when it needs to work. A short message is enough — I will reply with honest thoughts and a suggested next step."
              className="flex-col items-start"
            />

            <div className="mt-8 flex flex-col gap-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center justify-between gap-4 rounded-lg border border-line-2 bg-surface/40 px-4 py-3.5 transition-colors duration-200 hover:border-line-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                data-analytics="contact_email"
                data-analytics-location="contact"
              >
                <span className="min-w-0">
                  <span className="t-label block">Email</span>
                  <span className="mt-1 block truncate font-mono text-sm text-ink">
                    {siteConfig.email}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-ink-4 transition-transform group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>

              <a
                href={`tel:+${siteConfig.phone.e164}`}
                className="group flex items-center justify-between gap-4 rounded-lg border border-line-2 bg-surface/40 px-4 py-3.5 transition-colors duration-200 hover:border-line-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                data-analytics="contact_phone"
                data-analytics-location="contact"
              >
                <span className="min-w-0">
                  <span className="t-label block">Phone</span>
                  <span className="mt-1 block font-mono text-sm text-ink">
                    {siteConfig.phone.display}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-ink-4 transition-transform group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-lg border border-line-2 bg-surface/40 px-4 py-3.5 transition-colors duration-200 hover:border-line-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                data-analytics="contact_whatsapp"
                data-analytics-location="contact"
              >
                <span className="min-w-0">
                  <span className="t-label block">WhatsApp</span>
                  <span className="mt-1 block font-mono text-sm text-ink">
                    {siteConfig.phone.display}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-ink-4 transition-transform group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>

              {/*
                Pricing is not published on this site. Scope, timeline and
                integrations move the number too much for a static table, so the
                quote comes out of a conversation rather than off a page.
              */}
              <div className="rounded-lg border border-line-2 p-4">
                <p className="t-label">Pricing</p>
                <p className="t-body-sm mt-2.5 text-ink-2">
                  Not published here. Every engagement is scoped and quoted
                  individually, so the number comes out of a conversation. Send a
                  short brief by email, or message the same number on WhatsApp,
                  and you will get a written quote with a fixed price for a
                  defined scope.
                </p>
                <a
                  href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(
                    'Pricing enquiry',
                  )}`}
                  className="t-body-sm mt-3 inline-block font-mono text-ink underline decoration-line-3 underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Request a quote
                </a>
              </div>

              {siteConfig.booking.calendly ? (
                <ButtonLink
                  href={siteConfig.booking.calendly}
                  external
                  variant="secondary"
                  className="w-full justify-between"
                  data-analytics="calendar"
                  data-analytics-location="contact"
                >
                  Book a call
                  <span aria-hidden="true">↗</span>
                </ButtonLink>
              ) : null}

              <div className="flex flex-wrap gap-1.5 pt-1">
                <Tag>Async friendly</Tag>
                <Tag>Reply within 1–2 working days</Tag>
                <Tag>No sales sequence</Tag>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            {status === 'success' ? (
              <div
                role="status"
                className="flex h-full flex-col justify-center gap-4 rounded-xl border border-ok/30 bg-ok-tint p-8"
              >
                <span className="t-label text-ok">Message sent</span>
                <h3 className="t-h2">Thank you — that is enough to start.</h3>
                <p className="t-body max-w-[46ch]">
                  I read every message myself. You will get a reply within one or two working
                  days, including if the answer is that I am not the right fit for this.
                </p>
                <ButtonLink href="/work" variant="secondary" className="mt-2 w-fit">
                  Look at the work while you wait
                </ButtonLink>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                onFocus={() => {
                  if (status === 'idle') track({ name: 'inquiry_start', location: 'contact' });
                }}
                className="rounded-xl border border-line bg-surface/40 p-5 md:p-7"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={draft.name}
                      onChange={update('name')}
                      className={fieldClass}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={draft.email}
                      onChange={update('email')}
                      className={fieldClass}
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className={labelClass}>
                      Company <span className="text-ink-4">(optional)</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={draft.company}
                      onChange={update('company')}
                      className={fieldClass}
                      placeholder="Company or project name"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className={labelClass}>
                      Country <span className="text-ink-4">(optional)</span>
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      autoComplete="country-name"
                      value={draft.country}
                      onChange={update('country')}
                      className={fieldClass}
                      placeholder="Where you are based"
                    />
                  </div>

                  <Select
                    id="projectType"
                    label="What do you need?"
                    value={draft.projectType}
                    options={PROJECT_TYPES}
                    onChange={(value) =>
                      setDraft((prev) => ({ ...prev, projectType: value as InquiryDraft['projectType'] }))
                    }
                  />

                  <Select
                    id="budget"
                    label="Budget range"
                    value={draft.budget}
                    options={BUDGET_RANGES}
                    onChange={(value) =>
                      setDraft((prev) => ({ ...prev, budget: value as InquiryDraft['budget'] }))
                    }
                    format={(value) => budgetRangeLabel(value as InquiryDraft['budget'])}
                  />

                  <Select
                    id="timeline"
                    label="Timeline"
                    value={draft.timeline}
                    options={TIMELINES}
                    onChange={(value) =>
                      setDraft((prev) => ({ ...prev, timeline: value as InquiryDraft['timeline'] }))
                    }
                  />

                  <Select
                    id="currentStage"
                    label="Current stage"
                    value={draft.currentStage}
                    options={CURRENT_STAGES}
                    onChange={(value) =>
                      setDraft((prev) => ({
                        ...prev,
                        currentStage: value as InquiryDraft['currentStage'],
                      }))
                    }
                  />

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className={labelClass}>
                      What are you building, and what is in the way?
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={5}
                      value={draft.description}
                      onChange={update('description')}
                      className={cn(fieldClass, 'resize-y leading-relaxed')}
                      placeholder="The product, the constraint, and the date it needs to work by."
                    />
                  </div>
                </div>

                {/* Honeypot — hidden from users, rejected by the server schema */}
                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-px w-px overflow-hidden"
                >
                  <label htmlFor="companyWebsite">Company website</label>
                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={draft.companyWebsite}
                    onChange={update('companyWebsite')}
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={pending}
                    className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {pending ? 'Sending…' : 'Send message'}
                  </button>
                  <p className="t-meta text-ink-4">No newsletter, no CRM sequence. Just a reply.</p>
                </div>

                {status === 'error' ? (
                  <div role="alert" className="mt-4 rounded-md border border-error/30 bg-error-tint p-4">
                    <p className="t-body-sm text-error">{message}</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="t-body-sm mt-1.5 inline-block font-mono text-error underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
