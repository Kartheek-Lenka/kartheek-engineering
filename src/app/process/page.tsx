import type { Metadata } from 'next';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Process } from '@/components/sections/process';
import { DeploymentSection } from '@/components/sections/deployment';
import { Architecture } from '@/components/sections/architecture';
import { AiAssisted } from '@/components/sections/ai-assisted';
import { CtaBand } from '@/components/sections/cta-band';
import { buildMetadata } from '@/lib/metadata';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = buildMetadata({
  title: 'Process — how the work runs',
  description:
    'Six stages from discovery to operation, in order, every time. What each stage produces, and why the order matters more than the tooling.',
  path: '/process',
});

const EXPECTATIONS = [
  {
    title: 'A written proposal before any work',
    detail:
      'Scope, fixed price, timeline and what is explicitly out of scope. If the number matters before the work starts, it belongs in a document, not a conversation.',
  },
  {
    title: 'Progress you can read without asking',
    detail:
      'A written update on a cadence you set, and a running list of decisions made. Status should never require a meeting to interpret.',
  },
  {
    title: 'Code that outlives the engagement',
    detail:
      'Documentation, a runbook, and a handover that does not depend on me being reachable. You should be able to leave the system in someone else’s hands.',
  },
  {
    title: 'Honest scope boundaries',
    detail:
      'If something is out of scope, I say so while it is cheap to change. A fixed price with a moving definition is not a fixed price.',
  },
] as const;

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Process', path: '/process' },
        ])}
      />

      <Section aria-labelledby="process-page-title">
        <Container className="pt-32 pb-14 md:pt-40 md:pb-16">
          <SectionHeader
            index="01"
            eyebrow="Process"
            title="Six stages, in order, every time."
            lede="The order is the point. Discovery before architecture, architecture before build, shipping before operation — because the cost of a wrong decision rises the further left you are."
          />
        </Container>
      </Section>

      <Process />
      <DeploymentSection />
      <Architecture />
      <AiAssisted />

      <Section className="py-20 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="t-h2">What you can expect.</h2>
              <p className="t-body mt-4 max-w-[38ch] text-ink-3">
                Process is only interesting if it changes something for the person paying
                for the work. These are the commitments that come with the stages.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {EXPECTATIONS.map((item) => (
                  <li key={item.title} className="flex flex-col gap-2 bg-canvas p-5">
                    <h3 className="text-sm font-medium text-ink">{item.title}</h3>
                    <p className="t-body-sm">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Start"
        title="Stage one is a conversation."
        body="Thirty minutes about the product and the constraint is usually enough to know whether the work is worth scoping."
      />
    </>
  );
}
