'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/components/animations/use-in-view';
import { useReducedMotion } from '@/components/animations/use-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * Hero visual: a schematic of the delivery path, not decoration.
 *
 * Behaviour: idle is almost static. A single packet travels the path once the
 * section is in view, and only while visible. Reduced motion renders the same
 * states as a static diagram with no travel and no timers.
 *
 * Performance: SVG + CSS transforms only, no WebGL, no canvas, no per-frame JS.
 * The animation is driven by a CSS transition on a single element.
 */

type Layer = {
  id: string;
  label: string;
  sub: string;
  /** Fraction of the path duration at which this layer lights up. */
  at: number;
};

const LAYERS: Layer[] = [
  { id: 'edge', label: 'Edge', sub: 'CDN · WAF', at: 0.08 },
  { id: 'app', label: 'Application', sub: 'Next.js · API', at: 0.26 },
  { id: 'data', label: 'Data', sub: 'Postgres · Redis', at: 0.46 },
  { id: 'ai', label: 'AI layer', sub: 'Retrieval · models', at: 0.64 },
  { id: 'obs', label: 'Observability', sub: 'Logs · metrics · traces', at: 0.82 },
];

const CYCLE_MS = 5200;

export function HeroVisual() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 });
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    if (!inView) {
      setProgress(0);
      return;
    }

    // Two rAF-driven steps per cycle is enough; the visual reads as a slow,
    // continuous sweep rather than a sequence of discrete jumps.
    const started = performance.now();
    const step = () => {
      const elapsed = (performance.now() - started) % CYCLE_MS;
      setProgress(elapsed / CYCLE_MS);
    };
    step();
    timerRef.current = setInterval(step, 60);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [inView, reduced]);

  return (
    <div ref={ref} className="relative">
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface/50 backdrop-blur-[2px]">
        {/* Header strip */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-line-3" />
              <span className="h-1.5 w-1.5 rounded-full bg-line-3" />
              <span className="h-1.5 w-1.5 rounded-full bg-line-3" />
            </span>
            <span className="t-label">Production path</span>
          </div>
          <span className="t-meta text-ink-4">
            {reduced ? 'static' : `cycle ${Math.round(progress * 100)}%`}
          </span>
        </div>

        <div className="relative px-4 py-5 sm:px-5 sm:py-6">
          <svg
            viewBox="0 0 300 176"
            fill="none"
            className="h-auto w-full"
            role="img"
            aria-label="Schematic: a request travels from the edge layer through the application, data and AI layers, while observability reads signals from every layer."
          >
            <defs>
              <linearGradient id="hero-trace" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.05" />
                <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Horizontal rails */}
            {[36, 70, 104, 138].map((y) => (
              <line
                key={y}
                x1="14"
                y1={y}
                x2="286"
                y2={y}
                stroke="var(--color-line)"
                strokeWidth="1"
              />
            ))}

            {/* Vertical spines */}
            <line
              x1="46"
              y1="24"
              x2="46"
              y2="150"
              stroke="var(--color-line-2)"
              strokeWidth="1"
            />
            <line
              x1="196"
              y1="24"
              x2="196"
              y2="150"
              stroke="var(--color-line)"
              strokeDasharray="3 4"
              strokeWidth="1"
            />

            {/* Node markers */}
            {LAYERS.map((layer, index) => {
              const y = 36 + index * 34;
              const active = progress >= layer.at && progress < layer.at + 0.34;
              const passed = progress >= layer.at + 0.34;
              return (
                <g key={layer.id}>
                  <circle
                    cx="46"
                    cy={y}
                    r="3.5"
                    fill={active || passed ? 'var(--color-accent)' : 'var(--color-surface-3)'}
                    stroke={active ? 'var(--color-accent)' : 'var(--color-line-3)'}
                    strokeWidth="1"
                    className={cn('transition-[fill] duration-500', active && 'animate-pulse-dot')}
                  />
                  <line
                    x1="46"
                    y1={y}
                    x2="196"
                    y2={y}
                    stroke={active ? 'var(--color-accent-tint-2)' : 'var(--color-line)'}
                    strokeWidth="1"
                    className="transition-colors duration-500"
                  />
                  <text
                    x="58"
                    y={y - 6}
                    fill={active ? 'var(--color-ink)' : 'var(--color-ink-2)'}
                    fontSize="8.5"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.02em"
                    className="transition-[fill] duration-500"
                  >
                    {layer.label}
                  </text>
                  <text
                    x="58"
                    y={y + 7}
                    fill="var(--color-ink-4)"
                    fontSize="7"
                    fontFamily="var(--font-mono)"
                    className="transition-opacity duration-500"
                  >
                    {layer.sub}
                  </text>
                  {/* Signal to the observability spine */}
                  <line
                    x1="196"
                    y1={y}
                    x2="238"
                    y2={y}
                    stroke={passed || active ? 'var(--color-accent-tint-2)' : 'var(--color-line)'}
                    strokeWidth="1"
                    className="transition-colors duration-500"
                  />
                </g>
              );
            })}

            {/* Observability collector */}
            <rect
              x="238"
              y="26"
              width="48"
              height="126"
              rx="3"
              fill="var(--color-surface-2)"
              stroke="var(--color-line-2)"
              strokeWidth="1"
            />
            <text
              x="262"
              y="82"
              fill="var(--color-ink-3)"
              fontSize="7"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              transform="rotate(-90 262 82)"
            >
              OBSERVABILITY
            </text>

            {/* Travelling packet */}
            {!reduced && (
              <circle
                cx={46 + progress * 150}
                cy={36 + Math.min(3, Math.floor(progress * 4.2)) * 34}
                r="2.6"
                fill="var(--color-accent)"
                className="transition-[cx,cy] duration-100 ease-linear"
              />
            )}
          </svg>

          {/* Caption layer — real text, not baked into the SVG */}
          <p className="t-body-sm mt-4 max-w-[46ch] text-ink-3">
            One path from the edge to the database, with observability reading signals
            from every layer. That is the shape of the work — not just the interface.
          </p>
        </div>
      </div>

      {/* Corner ticks: precision detail, no glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-line-3"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-line-3"
      />
    </div>
  );
}
