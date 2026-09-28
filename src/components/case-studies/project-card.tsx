'use client';

import Link from 'next/link';
import type { Project } from '@/data/projects';
import { ArrowRight } from '@/components/ui/button';
import { track } from '@/lib/analytics-client';
import { cn } from '@/lib/utils';

/**
 * Case study card.
 *
 * No stock imagery: these projects have no photography worth using, and a
 * placeholder image would weaken the page. Instead each card carries a
 * generated architectural schematic derived from the project's own stack —
 * the visual is information, not decoration.
 */
export function ProjectCard({
  project,
  size = 'default',
  priority = false,
}: {
  project: Project;
  size?: 'default' | 'wide' | 'compact';
  priority?: boolean;
}) {
  const isConfidential = project.confidential === true;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface/40 transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-soft)] hover:border-line-3 hover:bg-surface-2 focus-within:border-line-3',
        size === 'wide' && 'lg:col-span-2',
        isConfidential && 'border-dashed',
      )}
    >
      <Link
        href={`/work/${project.slug}`}
        className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        onClick={() => track({ name: 'case_study_open', project: project.slug })}
      >
        {/* Schematic */}
        <ProjectSchematic project={project} priority={priority} />

        <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="t-meta text-accent-ink">{project.year}</span>
              <span aria-hidden="true" className="text-ink-4">
                /
              </span>
              <span className="t-label">{project.category}</span>
            </div>
            {isConfidential && (
              <span className="t-label rounded-xs border border-line-2 px-1.5 py-1 text-ink-3">
                NDA
              </span>
            )}
          </div>

          <div>
            <h3
              className={cn(
                't-h3 text-balance transition-colors duration-200 group-hover:text-accent-ink',
                size === 'compact' && 't-h4',
              )}
            >
              {project.title}
            </h3>
            <p className="t-body-sm mt-2 max-w-[52ch]">{project.kicker}</p>
          </div>

          <p className="t-body-sm mt-auto max-w-[58ch] text-ink-3">{project.summary}</p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.slice(0, size === 'compact' ? 3 : 5).map((tag) => (
              <span
                key={tag}
                className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-3"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors duration-200 group-hover:text-accent-ink">
            {isConfidential ? 'Discuss the scope' : 'Read the case study'}
            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}

/**
 * Deterministic schematic. The layout is derived from the project's stack, so a
 * Terraform project and a Flutter project get visibly different diagrams — the
 * card tells you something before you read a word.
 */
export function ProjectSchematic({
  project,
  priority = false,
  animated = false,
  className,
}: {
  project: Project;
  priority?: boolean;
  animated?: boolean;
  className?: string;
}) {
  const seed = project.slug.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const variant = seed % 3;
  const isConfidential = project.confidential === true;

  const bars = useMemoBars(seed, 7);
  const id = `schematic-${project.slug}`;

  return (
    <div
      className={cn(
        'relative overflow-hidden border-b border-line bg-inset',
        !className && size_heights[priority ? 'priority' : 'default'],
        className,
      )}
    >
      <svg
        viewBox="0 0 400 180"
        className={cn('h-full w-full', animated && 'schematic-svg')}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={
          isConfidential
            ? 'Withheld project schematic'
            : `Schematic diagram representing the ${project.title} architecture`
        }
      >
        <defs>
          <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M20 0H0V20"
              fill="none"
              stroke="var(--color-line)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="400" height="180" fill={`url(#${id}-grid)`} />

        {isConfidential ? (
          <g>
            <rect
              x="120"
              y="60"
              width="160"
              height="60"
              rx="4"
              fill="var(--color-surface-2)"
              stroke="var(--color-line-2)"
              strokeDasharray="4 4"
            />
            <text
              x="200"
              y="86"
              fill="var(--color-ink-3)"
              fontSize="9"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              letterSpacing="0.12em"
            >
              ARCHITECTURE
            </text>
            <text
              x="200"
              y="102"
              fill="var(--color-ink-4)"
              fontSize="8"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              letterSpacing="0.08em"
            >
              WITHHELD · NDA
            </text>
          </g>
        ) : (
          <g>
            {variant === 0 && (
              <>
                {/* Layered stack */}
                {bars.slice(0, 5).map((_width, index) => (
                  <g key={index}>
                    <rect
                      x={30 + index * 14}
                      y={140 - index * 20}
                      width={300 - index * 28}
                      height="14"
                      rx="2"
                      fill={index === 2 ? 'var(--color-accent-tint-2)' : 'var(--color-surface-2)'}
                      stroke="var(--color-line-2)"
                    />
                    <line
                      x1={30 + index * 14}
                      y1={147 - index * 20}
                      x2={330 - index * 14}
                      y2={147 - index * 20}
                      stroke={index === 2 ? 'var(--color-accent)' : 'var(--color-line-3)'}
                      strokeWidth="0.8"
                      strokeDasharray="2 6"
                    />
                  </g>
                ))}
              </>
            )}

            {variant === 1 && (
              <>
                {/* Branching topology */}
                <line x1="200" y1="24" x2="200" y2="60" stroke="var(--color-line-2)" />
                <line x1="60" y1="60" x2="340" y2="60" stroke="var(--color-line-2)" />
                {[60, 140, 220, 300].map((x, index) => (
                  <g key={x}>
                    <line x1={x} y1="60" x2={x} y2="88" stroke="var(--color-line-2)" />
                    <rect
                      x={x - 26}
                      y="88"
                      width="52"
                      height="26"
                      rx="3"
                      fill="var(--color-surface-2)"
                      stroke={index === 1 ? 'var(--color-accent)' : 'var(--color-line-2)'}
                    />
                    <line
                      x1={x - 14}
                      y1={98 + (index % 2) * 6}
                      x2={x + 14}
                      y2={98 + (index % 2) * 6}
                      stroke="var(--color-line-3)"
                      strokeWidth="0.8"
                    />
                    <line
                      x1={x - 14}
                      y1={104 + (index % 2) * 6}
                      x2={x + 6}
                      y2={104 + (index % 2) * 6}
                      stroke="var(--color-line-3)"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}
                <line x1="60" y1="114" x2="60" y2="146" stroke="var(--color-line)" />
                <line x1="300" y1="114" x2="300" y2="146" stroke="var(--color-line)" />
                <rect
                  x="170"
                  y="140"
                  width="60"
                  height="20"
                  rx="3"
                  fill="var(--color-surface-3)"
                  stroke="var(--color-line-2)"
                />
              </>
            )}

            {variant === 2 && (
              <>
                {/* Pipeline spine */}
                <line x1="24" y1="90" x2="376" y2="90" stroke="var(--color-line-2)" />
                {bars.slice(0, 6).map((_width, index) => {
                  const x = 34 + index * 56;
                  const active = index === 3;
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy="90"
                        r="5"
                        fill={active ? 'var(--color-accent)' : 'var(--color-surface-2)'}
                        stroke={active ? 'var(--color-accent)' : 'var(--color-line-3)'}
                      />
                      <rect
                        x={x - 12}
                        y={index % 2 === 0 ? 58 : 108}
                        width="24"
                        height="16"
                        rx="2"
                        fill="var(--color-surface-2)"
                        stroke="var(--color-line)"
                      />
                      <line
                        x1={x - 8}
                        y1={index % 2 === 0 ? 66 : 116}
                        x2={x + 8}
                        y2={index % 2 === 0 ? 66 : 116}
                        stroke="var(--color-line-3)"
                        strokeWidth="0.8"
                      />
                    </g>
                  );
                })}
              </>
            )}
          </g>
        )}
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--color-inset)_0%,transparent_38%)]"
      />

      {animated ? <SchematicPulse variant={variant} confidential={isConfidential} /> : null}
    </div>
  );
}

/**
 * Slow travelling highlight over the schematic, used only inside the pointer
 * panel. CSS rather than JS: it is a single pseudo-element animation, so it
 * costs nothing per frame and stops entirely when the panel unmounts.
 */
function SchematicPulse({ variant, confidential }: { variant: number; confidential: boolean }) {
  if (confidential) return null;

  // Nudged per variant so two panels side by side do not pulse in lockstep.
  const delay = variant * -2.1;

  return (
    <div
      aria-hidden="true"
      className="schematic-pulse pointer-events-none absolute inset-0"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

const size_heights = {
  default: 'h-44 md:h-52',
  priority: 'h-56 md:h-72',
} as const;

/**
 * Small deterministic pseudo-random widths for schematic detail. Seeded from the
 * slug so a given project always renders identically — no hydration mismatch.
 */
function useMemoBars(seed: number, count: number): number[] {
  const bars: number[] = [];
  let value = seed;
  for (let index = 0; index < count; index += 1) {
    value = (value * 9301 + 49297) % 233280;
    bars.push(value / 233280);
  }
  return bars;
}
