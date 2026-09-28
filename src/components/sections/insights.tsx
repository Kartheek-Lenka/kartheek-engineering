import { getAllInsights, type Insight } from '@/lib/insights';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { InsightCard, InsightRow } from '@/components/insights/insight-card';
import { Reveal } from '@/components/animations/reveal';

const PREVIEW_COUNT = 3;

/** Full index, used on /insights. */
export async function InsightsIndex() {
  const insights = await getAllInsights();

  return (
    <>
      <ol className="mt-14 border-t border-line">
        {insights.map((insight: Insight, index: number) => (
          <Reveal as="li" key={insight.slug} delay={index * 40} className="hairline-b block">
            <InsightRow insight={insight} index={index} />
          </Reveal>
        ))}
      </ol>

      {insights.length === 0 && (
        <p className="t-body mt-10 text-ink-3">No published writing yet. Check back shortly.</p>
      )}
    </>
  );
}

/** Compact preview, used on the homepage. */
export async function Insights() {
  const insights = await getAllInsights();
  const preview = insights.slice(0, PREVIEW_COUNT);

  return (
    <Section id="insights" aria-labelledby="insights-title">
      <Container className="py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[52ch]">
            <SectionHeader
              index="13"
              id="insights-title"
              eyebrow="Insights"
              title="Notes from the work."
              lede="Writing about the decisions that do not fit in a case study: what broke, what it cost, and what changed in the system afterwards."
              className="flex-col items-start"
            />
          </div>
          <ButtonLink href="/insights" variant="ghost">
            All writing
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {preview.map((insight, index) => (
            <Reveal key={insight.slug} delay={index * 50} className="flex">
              <InsightCard insight={insight} featured={index === 0} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
