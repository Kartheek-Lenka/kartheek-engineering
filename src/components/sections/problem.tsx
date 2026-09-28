import { problemGaps, problemStages } from '@/data/services';
import { Container, Section, SectionHeader, Tag } from '@/components/ui/section';
import { Reveal } from '@/components/animations/reveal';

export function Problem() {
  return (
    <Section id="problem" aria-labelledby="problem-title">
      <Container className="py-20 md:py-28">
        <SectionHeader
          index="01"
          id="problem-title"
          eyebrow="The problem"
          title={
            <>
              Building the product is
              <br className="hidden sm:block" /> only{' '}
              <span className="t-editorial text-accent-ink">half</span> the problem.
            </>
          }
          lede="Most teams can build an application. Far fewer can get it into production, keep it running, and know what it is doing while it does. That second half is where products die."
        />

        {/* Lifecycle: idea → scale */}
        <Reveal className="mt-16">
          <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
            {problemStages.map((stage, index) => (
              <li
                key={stage.id}
                className="group relative flex flex-col gap-2 bg-canvas p-5 transition-colors duration-300 hover:bg-surface"
              >
                <div className="flex items-center justify-between">
                  <span className="t-meta text-ink-4">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {index < problemStages.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="text-ink-4 transition-colors duration-300 group-hover:text-accent"
                    >
                      →
                    </span>
                  )}
                </div>
                <span className="t-h4 mt-1">{stage.label}</span>
                <span className="t-body-sm text-ink-3">{stage.note}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Where engagements stall */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Reveal>
              <h3 className="t-h3 text-balance">Where the work usually stalls</h3>
              <p className="t-body mt-4 max-w-[44ch]">
                These are not unusual failures. They are the predictable result of a
                product team that was never given a production problem to solve.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <Tag tone="accent">CI/CD</Tag>
                <Tag>Infrastructure</Tag>
                <Tag>Observability</Tag>
                <Tag>Scaling</Tag>
                <Tag>Security</Tag>
              </div>
            </Reveal>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:col-span-8">
            {problemGaps.map((gap, index) => (
              <Reveal
                as="li"
                key={gap.title}
                delay={index * 55}
                className="flex flex-col gap-2.5 bg-canvas p-5 transition-colors duration-300 hover:bg-surface md:p-6"
              >
                <span className="t-meta text-accent-ink">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className="t-h4">{gap.title}</h4>
                <p className="t-body-sm">{gap.detail}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* The positioning turn */}
        <Reveal className="mt-16 border-t border-line pt-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <p className="t-h3 text-balance lg:col-span-5">
              I work on the half that{' '}
              <span className="t-editorial text-accent-ink">actually decides</span> whether
              the product survives contact with real users.
            </p>
            <div className="lg:col-span-7">
              <p className="t-body max-w-[58ch]">
                That means owning the whole lifecycle rather than a slice of it: the
                architecture decision, the implementation, the pipeline that ships it, the
                infrastructure it runs on, and the observability that tells you the truth
                about it. Engagement ends when the system is operable — not when the code
                is handed over.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
