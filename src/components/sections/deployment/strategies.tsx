'use client';

import { useState } from 'react';
import { strategies } from '@/data/deployment';
import { cn } from '@/lib/utils';

export function StrategyPanel() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="rounded-lg border border-line bg-surface/40">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-5">
        <div className="min-w-0">
          <h3 className="t-h4">Production strategy</h3>
          <p className="t-body-sm mt-1.5 max-w-[62ch]">
            How a new version reaches users. The strategy is a design decision, chosen per
            application from its risk and its tolerance for a failed release — not a
            default applied to everything.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={open}
          onClick={() => setOpen((value) => !value)}
          className="group flex min-h-11 shrink-0 items-center gap-3 rounded-md border border-line-2 px-3.5 transition-colors duration-200 hover:border-line-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="t-label text-ink-2">
            {open ? 'Hide strategies' : 'Show strategies'}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'relative h-5 w-9 rounded-full border transition-colors duration-300',
              open ? 'border-accent bg-accent' : 'border-line-3 bg-surface-2',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-ink transition-transform duration-300 ease-[var(--ease-out-expo)]',
                open ? 'translate-x-4.5' : 'translate-x-0.5',
              )}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-line p-4 md:p-5">
          <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2">
            {strategies.map((strategy) => {
              const isOpen = selected === strategy.id;
              return (
                <li key={strategy.id} className="bg-canvas">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`strategy-${strategy.id}`}
                    onClick={() => setSelected(isOpen ? null : strategy.id)}
                    className="flex w-full items-start justify-between gap-4 p-4 text-left transition-colors duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-ink">
                        {strategy.name}
                      </span>
                      <span className="t-body-sm mt-1 block text-ink-3">
                        {strategy.summary}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-2 text-ink-4 transition-transform duration-300',
                        isOpen && 'rotate-45 border-accent text-accent',
                      )}
                    >
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                        <path
                          d="M6 2v8M2 6h8"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <div id={`strategy-${strategy.id}`} hidden={!isOpen} className="px-4 pb-4">
                    <p className="t-body-sm">{strategy.detail}</p>
                    <dl className="mt-4 flex flex-col gap-2.5 border-t border-line pt-3.5">
                      <div>
                        <dt className="t-label">Tradeoff</dt>
                        <dd className="t-body-sm mt-1">{strategy.tradeoff}</dd>
                      </div>
                      <div>
                        <dt className="t-label">When</dt>
                        <dd className="t-body-sm mt-1">{strategy.when}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
