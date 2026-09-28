import { Container, Section, SectionHeader } from '@/components/ui/section';
import { processSteps } from '@/data/technology';
import { Reveal } from '@/components/animations/reveal';

/**
 * Process.
 *
 * Deliberately not a row of equal circles or a set of generic cards. The steps
 * alternate visual weight and share a continuous vertical rule, so it reads as
 * one sequence with escalating consequence rather than six parallel activities.
 */
export function Process() {
  return (
    <Section id="process" aria-labelledby="process-title" className="bg-canvas-2">
      <Container className="py-20 md:py-28">
          <SectionHeader
            index="06"
            eyebrow="Process"
            id="process-title"
            title="Six stages, in order, every time."
            lede="The order is the point. Discovery before architecture, architecture before build, shipping before operation — because the cost of a wrong decision rises the further left you are."
          />

        <ol className="mt-16 border-t border-line">
          {processSteps.map((step, index) => (
            <Reveal as="li" key={step.id} delay={index * 40} className="hairline-b">
              <div className="group grid gap-6 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <div className="md:col-span-1">
                  <span className="t-h3 block text-accent-ink transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                    {step.index}
                  </span>
                </div>

                <div className="md:col-span-4">
                  <h3 className="t-h3 text-balance">{step.title}</h3>
                  <p className="t-body mt-2.5 max-w-[34ch] text-ink-2">{step.headline}</p>
                </div>

                <div className="md:col-span-4">
                  <p className="t-body max-w-[48ch]">{step.detail}</p>
                </div>

                <div className="md:col-span-3">
                  <h4 className="t-label">Outputs</h4>
                  <ul className="mt-4 flex flex-col gap-2">
                    {step.outputs.map((output) => (
                      <li key={output} className="t-body-sm flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-[0.6em] h-px w-2.5 shrink-0 bg-line-3"
                        />
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
