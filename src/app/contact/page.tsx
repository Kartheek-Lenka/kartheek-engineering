import type { Metadata } from 'next';
import { Container, Section, SectionHeader, Tag } from '@/components/ui/section';
import { Contact } from '@/components/sections/contact';
import { Global } from '@/components/sections/global';
import { buildMetadata } from '@/lib/metadata';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/data/site';
import { processSteps } from '@/data/technology';

export const metadata: Metadata = buildMetadata({
  title: 'Contact — start a conversation',
  description:
    'Tell me what you are building, what is in the way, and when it needs to work. Reach me by email, phone or WhatsApp on +91 75690 67363.',
  path: '/contact',
});

const BOUNDARIES = [
  'I take on work where I can own the outcome, not just a slice of it.',
  'I will tell you if I am not the right fit — usually in the first reply.',
  'I do not take on work I cannot deliver to the standard I would want for my own systems.',
  'No bulk outreach, no automated follow-up sequences, no discovery-call funnel.',
] as const;

/**
 * Pricing is quoted per engagement rather than published, so the factors that
 * move the number are stated instead of the number itself.
 */
const PRICING_FACTORS = [
  { label: 'Scope', detail: 'How much is actually being asked for' },
  { label: 'Complexity', detail: 'Integrations, data volume, edge cases' },
  { label: 'Timeline', detail: 'Urgency and the cadence you need' },
  { label: 'Support', detail: 'Ongoing maintenance and incident cover' },
] as const;

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />

      <Section aria-labelledby="contact-page-title">
        <Container className="pt-32 pb-14 md:pt-40 md:pb-16">
          <SectionHeader
            index="01"
            eyebrow="Contact"
            title="Start a conversation."
            lede="A short message is enough. The useful details are what you are building, what is in the way, and when it needs to work."
          />
          <div className="mt-8 flex flex-wrap gap-1.5">
            <Tag>Reply within 1–2 working days</Tag>
            <Tag>Async friendly</Tag>
            <Tag>No sales sequence</Tag>
          </div>
        </Container>
      </Section>

      <Contact />
      <Global />

      <Section aria-labelledby="pricing-enquiry-title" className="py-20 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <h2 id="pricing-enquiry-title" className="t-h2">
                Pricing, on request.
              </h2>
              <p className="t-body mt-4 max-w-[40ch] text-ink-2">
                There is no price table on this site. Scope, complexity, timeline and the
                support you need after launch move the number too much for a static list, so a
                quote comes out of a conversation instead.
              </p>
              <p className="t-body-sm mt-5 max-w-[42ch] text-ink-4">
                Send a short brief and you will get a written quote with a fixed price for a
                defined scope, what is explicitly out of scope, and a delivery date.
              </p>
            </div>

            <div className="lg:col-span-7">
              <h3 className="t-label">What moves the number</h3>
              <dl className="mt-5 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {PRICING_FACTORS.map((factor) => (
                  <div key={factor.label} className="flex flex-col gap-1.5 bg-canvas p-4">
                    <dt className="text-sm font-medium text-ink">{factor.label}</dt>
                    <dd className="t-body-sm">{factor.detail}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="t-label mt-10">How to reach me</h3>
              <ul className="mt-5 flex flex-col gap-3">
                <li className="hairline-b pb-3">
                  <span className="t-label block">Email</span>
                  <a
                    href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(
                      'Pricing enquiry',
                    )}`}
                    className="mt-1 inline-block break-all font-mono text-sm text-ink underline decoration-line-3 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li className="hairline-b pb-3">
                  <span className="t-label block">Phone</span>
                  <a
                    href={`tel:+${siteConfig.phone.e164}`}
                    className="mt-1 inline-block font-mono text-sm text-ink underline decoration-line-3 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {siteConfig.phone.display}
                  </a>
                </li>
                <li>
                  <span className="t-label block">WhatsApp</span>
                  <a
                    href={`https://wa.me/${siteConfig.phone.e164}?text=${encodeURIComponent(
                      "Hi Kartheek — I'd like to discuss a project and pricing.",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-mono text-sm text-ink underline decoration-line-3 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    Message on WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-20 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="t-h2">What happens next.</h2>
              <p className="t-body mt-4 max-w-[38ch] text-ink-3">
                No discovery-call funnel. The sequence is short and I run it myself.
              </p>
              <div className="mt-5 flex flex-col gap-2 text-ink-4">
                <p className="t-body-sm">Prefer to skip the form?</p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="t-body-sm break-all font-mono text-ink-2 underline decoration-line-3 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {siteConfig.email}
                </a>
                <a
                  href={`tel:+${siteConfig.phone.e164}`}
                  className="t-body-sm font-mono text-ink-2 underline decoration-line-3 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {siteConfig.phone.display}
                </a>
                <a
                  href={`https://wa.me/${siteConfig.phone.e164}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-body-sm w-fit font-mono text-ink-2 underline decoration-line-3 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  WhatsApp the same number
                </a>
              </div>
            </div>
            <div className="lg:col-span-8">
              <ol className="flex flex-col">
                {processSteps.slice(0, 3).map((step) => (
                  <li key={step.id} className="hairline-b py-6 last:border-b-0">
                    <div className="grid gap-3 md:grid-cols-12 md:gap-6">
                      <h3 className="text-sm font-medium text-ink md:col-span-4">
                        {step.title}
                      </h3>
                      <p className="t-body md:col-span-8">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-12">
                <h3 className="t-label">Boundaries, stated up front</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {BOUNDARIES.map((boundary) => (
                    <li key={boundary} className="t-body flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.7em] h-px w-3 shrink-0 bg-accent"
                      />
                      {boundary}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
