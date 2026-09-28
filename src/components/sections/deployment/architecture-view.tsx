'use client';

import { useState } from 'react';
import { referenceArchitecture } from '@/data/deployment';
import { cn } from '@/lib/utils';

/**
 * Expanded architecture view, revealed by the "View Architecture" control.
 *
 * The point of this view is the relationship between the two paths: a release
 * only counts as done once the observability path is wired, because that is
 * what makes the next failure visible.
 */
export function DeploymentArchitecture() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="deployment-architecture"
        onClick={() => setOpen((value) => !value)}
        className="group inline-flex min-h-11 items-center gap-2.5 rounded-md border border-line-2 bg-surface/50 px-4 text-sm font-medium text-ink transition-colors duration-200 hover:border-line-3 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg
          viewBox="0 0 16 16"
          className={cn(
            'h-3.5 w-3.5 text-ink-3 transition-transform duration-300',
            open && 'rotate-90',
          )}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 3.5 10.5 8 6 12.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {open ? 'Hide architecture' : 'View Architecture'}
      </button>

      <div id="deployment-architecture" hidden={!open} className="mt-5">
        <div className="grid gap-4 lg:grid-cols-2">
          {referenceArchitecture.flows.map((flow) => (
            <div
              key={flow.id}
              className="overflow-hidden rounded-lg border border-line bg-inset p-4 md:p-5"
            >
              <h3 className="t-h4">{flow.title}</h3>
              <p className="t-body-sm mt-1.5 text-ink-3">{flow.caption}</p>

              <ol className="mt-5 flex flex-col">
                {flow.nodes.map((node, index) => (
                  <li key={node.id} className="relative flex gap-3 pb-3 last:pb-0">
                    {index < flow.nodes.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-5 left-[7px] h-full w-px bg-line"
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'relative z-1 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border',
                        node.emphasis
                          ? 'border-accent bg-accent'
                          : 'border-line-3 bg-canvas',
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[0.8125rem] text-ink">
                        {node.label}
                      </span>
                      {node.sub && (
                        <span className="t-meta block text-ink-4">{node.sub}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-3">
          {referenceArchitecture.note}
        </p>
      </div>
    </div>
  );
}
