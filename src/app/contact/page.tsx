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
    'Tell me what you are building, what is in the way, and when it needs to work. A short message is enough to start a useful conversation.',
  path: '/contact',
});

const BOUNDARIES = [
  'I take on work where I can own the outcome, not just a slice of it.',
  'I will tell you if I am not the right fit — usually in the first reply.',
  'I do not take on work I cannot deliver to the standard I would want for my own systems.',
  'No bulk outreach, no automated follow-up sequences, no discovery-call funnel.',
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

      <Section className="py-20 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="t-h2">What happens next.</h2>
              <p className="t-body mt-4 max-w-[38ch] text-ink-3">
                No discovery-call funnel. The sequence is short and I run it myself.
              </p>
              <p className="t-body-sm mt-5 max-w-[40ch] text-ink-4">
                Prefer email?{' '}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-ink-2 underline decoration-line-3 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {siteConfig.email}
                </a>
              </p>
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
