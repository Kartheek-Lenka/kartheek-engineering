import { aiWorkflow } from '@/data/technology';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Reveal } from '@/components/animations/reveal';

const DIVIDER = '↓';

export function AiAssisted() {
  const humanOwned = new Set(['problem', 'architecture', 'review', 'security']);

  return (
    <Section id="ai-assisted" aria-labelledby="ai-assisted-title">
      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeader
              index="07"
              id="ai-assisted-title"
              eyebrow="Method"
              align="start"
              title={
                <>
                  AI makes development faster.
                  <br />
                  <span className="text-ink-3">Engineering makes it reliable.</span>
                </>
              }
              className="flex-col items-start"
            />
            <div className="mt-6 flex flex-col gap-4">
              <p className="t-body max-w-[48ch]">
                AI assistance is now part of ordinary engineering work. It is genuinely
                useful: it drafts faster, explains unfamiliar code, and removes a lot of
                mechanical effort. What it does not do is decide whether the data model is
                right, whether the deployment is safe, or whether the thing actually solves
                the problem.
              </p>
              <p className="t-body max-w-[48ch]">
                So the division of labour is explicit. The model accelerates the
                implementation. A person owns the architecture, reads every line that ships,
                and stays accountable for what runs in production.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {aiWorkflow.map((step, index) => {
                  const owned = humanOwned.has(step.id);
                  return (
                    <li
                      key={step.id}
                      className="group relative flex flex-col gap-1.5 bg-canvas p-4 transition-colors duration-300 hover:bg-surface md:p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="t-meta text-ink-4">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`t-label ${owned ? 'text-accent-ink' : 'text-ink-4'}`}
                        >
                          {owned ? 'Human owned' : 'AI assisted'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-ink">{step.label}</span>
                      <span className="t-body-sm text-ink-3">{step.detail}</span>

                      {/* The sequence marker — the only "flow" decoration, and it is text */}
                      {index < aiWorkflow.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute -right-1.5 -bottom-1.5 hidden h-3 w-3 items-center justify-center rounded-full border border-line bg-canvas font-mono text-[0.5rem] text-ink-4 sm:flex"
                        >
                          {DIVIDER}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Reveal>

            <p className="t-meta mt-5 text-ink-4">
              An engineering multiplier, not a replacement for engineering judgement. The
              review, testing and deployment gates stay in place whether or not the
              implementation was drafted by a model.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
