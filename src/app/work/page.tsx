import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section';
import { CtaBand } from '@/components/sections/cta-band';
import { WorkIndex } from '@/components/case-studies/work-sections';
import { buildMetadata } from '@/lib/metadata';
import { projects } from '@/data/projects';

export const metadata: Metadata = buildMetadata({
  title: 'Work — case studies',
  description:
    'Case studies across AI products, full-stack applications and production infrastructure. Each one states the problem, the decisions, and what shipped.',
  path: '/work',
});

export default function WorkPage() {
  return (
    <>
      <Section aria-labelledby="work-page-title">
        <Container className="pt-32 pb-16 md:pt-40 md:pb-20">
          <SectionHeader
            index="01"
            eyebrow="Case studies"
            title="Work, and what it involved."
            lede="Selected projects with the reasoning left in: the constraint, the decision, the thing that went wrong, and what shipped. No vanity metrics, no client names that cannot be published."
          />
          <p className="t-meta mt-8 text-ink-4">
            {projects.length} case studies
          </p>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="pb-20 md:pb-28">
          <WorkIndex />
        </Container>
      </Section>

      <CtaBand
        eyebrow="Similar work"
        title="Your project does not have to look like these."
        body="These are the closest examples I can publish. The process behind them is the same regardless of the domain."
      />
    </>
  );
}
