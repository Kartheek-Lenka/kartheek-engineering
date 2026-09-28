'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from '@/components/ui/button';
import { services } from '@/data/services';
import { getProject } from '@/data/projects';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics-client';

/**
 * Services as an accordion, not a grid of small cards.
 *
 * Interaction: one open row at a time, so the section reads as a single
 * argument rather than five competing ones. Keyboard accessible via real
 * buttons with aria-expanded / aria-controls.
 */
export function Services() {
  const [openId, setOpenId] = useState<string>(services[0]!.id);

  return (
    <div className="mt-14 border-t border-line">
      {services.map((service) => {
        const isOpen = openId === service.id;
        const panelId = `service-panel-${service.id}`;
        const buttonId = `service-button-${service.id}`;
        const proofProject = service.proof ? getProject(service.proof.slug) : undefined;

        return (
          <div key={service.id} className="hairline-b">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? '' : service.id)}
                className="group flex w-full items-start gap-5 py-7 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent md:gap-8"
              >
                <span className="t-meta w-8 shrink-0 pt-1.5 text-ink-4">{service.index}</span>

                <span className="min-w-0 flex-1">
                  <span className="t-h3 block text-balance transition-colors duration-200 group-hover:text-accent-ink">
                    {service.title}
                  </span>
                  <span
                    className={cn(
                      't-body mt-2 block max-w-[62ch] transition-colors duration-200',
                      isOpen ? 'text-ink-2' : 'text-ink-3',
                    )}
                  >
                    {service.summary}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line-2 text-ink-3 transition-[transform,border-color,color] duration-300 ease-[var(--ease-out-expo)] group-hover:border-line-3 group-hover:text-ink data-[open=true]:rotate-45 data-[open=true]:border-accent data-[open=true]:text-accent-ink"
                  data-open={isOpen}
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                    <path
                      d="M8 2.5v11M2.5 8h11"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-10 pl-13 md:pl-16"
            >
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-5">
                  <p className="t-body max-w-[52ch]">{service.description}</p>

                  {service.proof && proofProject && (
                    <Link
                      href={`/work/${proofProject.slug}`}
                      onClick={() =>
                        track({
                          name: 'case_study_open',
                          project: proofProject.slug,
                        })
                      }
                      className="group mt-7 flex items-center gap-3 rounded-md border border-line-2 bg-surface/50 p-3.5 transition-colors duration-200 hover:border-line-3 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span className="t-label shrink-0 text-accent-ink">Case</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">
                          {service.proof.label}
                        </span>
                      </span>
                      <ArrowRight className="shrink-0 text-ink-4 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </Link>
                  )}
                </div>

                <div className="lg:col-span-4">
                  <h4 className="t-label">Capabilities</h4>
                  <ul className="mt-5 flex flex-col">
                    {service.capabilities.map((capability) => (
                      <li
                        key={capability}
                        className="flex items-start gap-3 border-b border-line py-2.5 last:border-b-0"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.6em] h-px w-3 shrink-0 bg-line-3"
                        />
                        <span className="t-body-sm">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-3">
                  <h4 className="t-label">What you get</h4>
                  <ul className="mt-5 flex flex-col gap-3">
                    {service.deliverables.map((item) => (
                      <li key={item} className="t-body-sm text-ink-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
