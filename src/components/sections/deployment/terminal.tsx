'use client';

import { useEffect, useRef } from 'react';
import type { LogEntry } from './use-deployment-run';
import { cn } from '@/lib/utils';

const MARKERS: Record<LogEntry['kind'], string> = {
  cmd: '$',
  info: '→',
  ok: '✓',
  error: '✕',
  dim: ' ',
};

/**
 * Minimal deployment log.
 *
 * Restrained by design: one neutral type colour, semantic colour only on the
 * status marker. Not a green terminal.
 */
export function DeploymentTerminal({ log }: { log: LogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (log.length === 0) return;
    // Pin the log to its own last line. Deliberately NOT scrollIntoView: that
    // method walks every scrollable ancestor up to the document, so it dragged
    // the whole page down to this section on first paint.
    const viewport = scrollRef.current;
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [log.length]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-line bg-inset">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <span className="t-label">Deployment log</span>
        <span className="t-meta text-ink-4">bash · zsh</span>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-3.5"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Deployment output"
        tabIndex={0}
      >
        {log.length === 0 ? (
          <p className="t-meta text-ink-4">
            Awaiting a deployment run. Press “Deploy v1.4.2” to start.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {log.map((entry) => (
              <li
                key={entry.key}
                className={cn(
                  'flex gap-2.5 font-mono text-[0.75rem] leading-relaxed',
                  entry.kind === 'error' && 'text-error',
                  entry.kind === 'ok' && 'text-ok',
                  entry.kind === 'cmd' && 'text-ink',
                  entry.kind === 'info' && 'text-ink-2',
                  entry.kind === 'dim' && 'text-ink-4',
                )}
              >
                <span aria-hidden="true" className="w-2 shrink-0 select-none opacity-70">
                  {MARKERS[entry.kind]}
                </span>
                <span className="min-w-0 break-words">{entry.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
