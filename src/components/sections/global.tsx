import { globalFacts } from '@/data/experience';
import { capabilitiesLine } from '@/data/experience';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Reveal } from '@/components/animations/reveal';
import { CtaBand } from '@/components/sections/cta-band';

/**
 * Global.
 *
 * A world map would need a data source and add nothing. Instead: a timezone
 * band rendered with CSS grid, plus the operational facts that actually decide
 * whether remote collaboration works.
 */
export function Global() {
  return (
    <Section id="global" aria-labelledby="global-title" className="bg-canvas-2">
      <Container className="py-20 md:py-28">
        <SectionHeader
          index="11"
          id="global-title"
          eyebrow="Working together"
          title="Remote, across timezones, with written decisions."
          lede="The majority of client work is international. That works when the working agreements are explicit rather than assumed."
        />

        {/* Timezone band */}
        <Reveal className="mt-14">
          <div className="rounded-xl border border-line bg-surface/40 p-5 md:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="t-h4">Working window</h3>
              <p className="t-meta text-ink-4">IST · UTC+5:30</p>
            </div>

            {/* The band: a proportion bar plus hour ticks. No map library, no SVG map. */}
            <div className="mt-6" role="img" aria-label="Overlap between IST working hours and client timezones across the day">
              <div className="relative h-10 overflow-hidden rounded-md border border-line bg-inset">
                <div className="absolute inset-y-0 left-0 w-[62.5%] bg-accent-tint" />
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-[37.5%] w-px bg-accent/60"
                />
                <div className="absolute inset-y-0 left-[50%] w-px bg-accent/60" />
                <div className="relative flex h-full items-center">
                  <div className="grid w-full grid-cols-6 text-center font-mono text-[0.625rem] text-ink-4">
                    {['00', '04', '08', '12', '16', '20'].map((hour) => (
                      <span key={hour}>{hour}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                {[
                  { label: 'Client morning', detail: 'UK · EU mornings overlap directly' },
                  { label: 'US overlap', detail: 'One reliable US window, agreed per project' },
                  { label: 'Asia-Pacific', detail: 'Same-day handover in practice' },
                ].map((slot) => (
                  <span key={slot.label} className="t-meta text-ink-4">
                    <span className="text-ink-2">{slot.label}</span> — {slot.detail}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Operational facts */}
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {globalFacts.map((fact, index) => (
            <Reveal key={fact.label} delay={index * 40} className="flex flex-col gap-2 bg-canvas p-5 md:p-6">
              <h3 className="text-sm font-medium text-ink">{fact.label}</h3>
              <p className="t-body-sm max-w-[38ch]">{fact.detail}</p>
            </Reveal>
          ))}
        </div>

        {/* Capabilities */}
        <Reveal className="mt-10">
          <p className="t-body max-w-[72ch]">
            <span className="text-ink-3">In practice, that means:</span> a written proposal
            before any work starts, decisions recorded rather than assumed, status you can
            read without booking a call, and documentation written for an international team
            rather than for whoever happens to be in the room.
          </p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {capabilitiesLine.map((capability) => (
              <li
                key={capability}
                className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] tracking-wide text-ink-3"
              >
                {capability}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      <CtaBand
        eyebrow="Working together"
        title="Different timezone does not have to mean slow."
        body="Send the context in writing. You will get a considered response, not a calendar link."
      />
    </Section>
  );
}
