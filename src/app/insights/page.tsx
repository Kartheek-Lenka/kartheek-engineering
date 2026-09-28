import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section';
import { CtaBand } from '@/components/sections/cta-band';
import { InsightsIndex } from '@/components/sections/insights';
import { buildMetadata } from '@/lib/metadata';
import { getAllInsights } from '@/lib/insights';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Insights — engineering notes',
    description:
      'Notes on AI product engineering, deployment reliability, cloud infrastructure and the decisions that do not fit in a case study.',
    path: '/insights',
  });
}

export default async function InsightsPage() {
  const insights = await getAllInsights();

  return (
    <>
      <Section aria-labelledby="insights-page-title">
        <Container className="pt-32 pb-16 md:pt-40 md:pb-20">
          <SectionHeader
            index="01"
            eyebrow="Insights"
            title="Engineering notes."
            lede="Most of what I have learned was expensive to learn, and none of it fits in a project summary. This is where the reasoning goes: what broke, what it cost, and what I changed afterwards."
          />
          <p className="t-meta mt-8 text-ink-4">
            {insights.length} {insights.length === 1 ? 'article' : 'articles'}
          </p>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="pb-20 md:pb-28">
          <InsightsIndex />
        </Container>
      </Section>

      <CtaBand
        eyebrow="Beyond the writing"
        title="Reading about it is the cheap part."
        body="If any of this describes a problem you currently have, that is usually a conversation worth having."
      />
    </>
  );
}
