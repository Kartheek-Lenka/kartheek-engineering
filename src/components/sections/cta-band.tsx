import Link from 'next/link';
import { ArrowRight } from '@/components/ui/button';
import { Container } from '@/components/ui/section';
import { Reveal } from '@/components/animations/reveal';

/**
 * The repeated conversion band. Placed at three points in the narrative —
 * after proof, after the deployment demonstration, and before the footer — so
 * the next step is always one scroll away without interrupting the story.
 */
export function CtaBand({
  eyebrow = 'Next step',
  title = 'Have a product in mind?',
  body = 'Tell me what you are building, where you are today, and what needs to happen next. You will get a written reply with a point of view — not a sales sequence.',
  primaryLabel = 'Start a Project',
  secondary,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  primaryLabel?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <div className="relative overflow-hidden bg-canvas-2">
      <div
        aria-hidden="true"
        className="grid-field mask-fade-x pointer-events-none absolute inset-0 opacity-40"
      />
      <Container className="relative py-16 md:py-20">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="t-label">{eyebrow}</p>
            <h2 className="t-h2 mt-5 max-w-[16ch] text-balance">{title}</h2>
            <p className="t-body mt-5 max-w-[56ch]">{body}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
            <Link
              href="/contact"
              data-analytics="cta_band_primary"
              data-analytics-location="cta_band"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-[0.9375rem] font-medium text-on-accent shadow-[0_8px_24px_-12px_rgb(59_107_255/0.9)] transition-[background-color,transform,box-shadow] duration-200 ease-[var(--ease-out-soft)] hover:bg-accent-hover hover:shadow-[0_12px_28px_-12px_rgb(59_107_255/0.95)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {primaryLabel}
              <ArrowRight />
            </Link>
            {secondary && (
              <Link
                href={secondary.href}
                data-analytics="cta_band_secondary"
                data-analytics-location="cta_band"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-line-2 bg-surface/60 px-6 text-[0.9375rem] font-medium text-ink transition-colors duration-200 hover:border-line-3 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
