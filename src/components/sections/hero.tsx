import Link from 'next/link';
import { ArrowRight, ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/section';
import { HeroVisual } from '@/components/sections/hero-visual';
import { AvailabilityPill } from '@/components/sections/availability-pill';
import { capabilitiesLine, trustSignals } from '@/data/experience';
import { siteConfig } from '@/data/site';
import { CtaBand } from '@/components/sections/cta-band';

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Architectural grid, faded at the edges. Purely structural. */}
      <div
        aria-hidden="true"
        className="grid-field mask-fade-y pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-[0.55]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(120%_100%_at_50%_0%,var(--color-accent-tint)_0%,transparent_62%)]"
      />

      <Container className="relative pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Copy column */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <AvailabilityPill />
              <span className="t-meta text-ink-4">
                {siteConfig.location.city}, {siteConfig.location.region} ·{' '}
                {siteConfig.location.timezoneLabel}
              </span>
            </div>

            <h1 id="hero-title" className="t-display mt-8 text-ink">
              From idea
              <br />
              to <span className="t-editorial text-accent-ink">production</span>.
            </h1>

            <p className="t-lead mt-8 max-w-[52ch]">
              AI product engineering, full-stack development and cloud infrastructure for
              founders and teams building serious software — from the first architecture
              decision through deployment, monitoring and scale.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink
                href="/contact"
                size="lg"
                data-analytics="hero_start_project"
                data-analytics-location="hero"
              >
                Start a Project
                <ArrowRight />
              </ButtonLink>
              <ButtonLink
                href="/work"
                size="lg"
                variant="secondary"
                data-analytics="hero_view_work"
                data-analytics-location="hero"
              >
                View Selected Work
              </ButtonLink>
            </div>

            {/* Capability line — restrained, no icons, no colour */}
            <ul className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-6">
              {capabilitiesLine.map((capability, index) => (
                <li key={capability} className="flex items-center gap-4">
                  <span className="t-label text-ink-2">{capability}</span>
                  {index < capabilitiesLine.length - 1 && (
                    <span aria-hidden="true" className="text-ink-4">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual column */}
          <div className="lg:col-span-5 lg:pt-4">
            <HeroVisual />
          </div>
        </div>
      </Container>

      {/* Trust strip — verifiable facts only, no invented numbers */}
      <div className="relative hairline-t hairline-b bg-canvas-2">
        <Container className="py-8 md:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            <p className="t-label shrink-0">Engineering background</p>
            <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
              {trustSignals.map((signal) => (
                <li key={signal.label} className="flex flex-col gap-1">
                  <span className="font-mono text-[0.9375rem] font-medium tracking-tight text-ink">
                    {signal.value}
                  </span>
                  <span className="t-label text-ink-3">{signal.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="t-meta mt-6 text-ink-4">
            <Link
              href="/about"
              className="underline decoration-line-3 underline-offset-4 transition-colors hover:text-ink-2 hover:decoration-accent"
            >
              Full experience, stack and credentials
            </Link>
          </p>
        </Container>
      </div>

      <CtaBand />
    </section>
  );
}
