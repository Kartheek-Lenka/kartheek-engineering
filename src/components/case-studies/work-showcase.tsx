'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import type { Project } from '@/data/projects';
import { ProjectSchematic } from '@/components/case-studies/project-card';
import { track } from '@/lib/analytics-client';
import { cn } from '@/lib/utils';

/**
 * Work showcase.
 *
 * Deliberately not a grid of equal cards. A grid says "these are all the same
 * kind of thing"; a case-study index says "read this one, then the next" — and
 * lets the differences between the projects do the work. So the projects are
 * laid out as a typographic index and the detail is carried by a panel that
 * tracks the pointer.
 *
 * Motion rules for this section:
 *   1. The index is readable before anything animates. No reveal hides content
 *      a reduced-motion user or a slow connection would never see.
 *   2. Motion is spring-damped, never linear, and never long enough to delay a
 *      click.
 *   3. Pointer input is the only thing that moves the panel — scroll never does,
 *      so the section can never fight the page for the viewport.
 *   4. Everything is reachable by keyboard: focusing a row shows the same panel
 *      hovering shows, and the panel is inert to pointer and to the
 *      accessibility tree.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

type SpringValue = MotionValue<number>;

export function WorkShowcase({
  projects,
  showSummaryInline = false,
  className,
}: {
  projects: Project[];
  /**
   * Coarse pointers cannot hover, so their summary is rendered in flow instead
   * of in the pointer panel. Set by the call site from a media query.
   */
  showSummaryInline?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // Springs give the panel weight. Under reduced motion the spring is stiff
  // enough to be imperceptible, so the panel tracks the pointer exactly.
  const config = reduced
    ? { stiffness: 4000, damping: 400 }
    : { stiffness: 260, damping: 30, mass: 0.6 };
  const x = useSpring(pointerX, config);
  const y = useSpring(pointerY, config);

  // Flip the panel to the other side of the pointer near the right edge so it
  // never leaves the viewport.
  const flip = useTransform<number, number>(x, (value) => (value > 0 ? 1 : -1));

  const active = activeIndex === null ? undefined : projects[activeIndex];

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set(event.clientX - bounds.left);
    pointerY.set(event.clientY - bounds.top);
  }

  return (
    <div ref={containerRef} onPointerMove={onPointerMove} className={cn('relative', className)}>
      <ul className="relative border-t border-line">
        {projects.map((project, index) => (
          <WorkRow
            key={project.slug}
            project={project}
            index={index}
            isActive={activeIndex === index}
            reduced={reduced === true}
            showInlineSummary={showSummaryInline}
            onActivate={() => setActiveIndex(index)}
            onDeactivate={() =>
              setActiveIndex((current) => (current === index ? null : current))
            }
          />
        ))}
      </ul>

      {active ? (
        <PreviewPanel project={active} x={x} y={y} flip={flip} reduced={reduced === true} />
      ) : null}
    </div>
  );
}

function WorkRow({
  project,
  index,
  isActive,
  reduced,
  showInlineSummary,
  onActivate,
  onDeactivate,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  reduced: boolean;
  showInlineSummary: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const isConfidential = project.confidential === true;

  return (
    <li className="border-b border-line" onPointerEnter={onActivate} onPointerLeave={onDeactivate}>
      <motion.div
        initial={false}
        animate={{ backgroundColor: isActive ? 'var(--color-surface)' : 'rgba(0,0,0,0)' }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }}
      >
        <Link
          href={`/work/${project.slug}`}
          onFocus={onActivate}
          onBlur={onDeactivate}
          onClick={() => track({ name: 'case_study_open', project: project.slug })}
          className="work-index-row group flex items-center gap-4 px-2 py-7 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent md:gap-8 md:px-4 md:py-9"
        >
          <span className="t-label w-8 shrink-0 tabular-nums text-ink-4 md:w-10">
            {String(index + 1).padStart(2, '0')}
          </span>

          <span className="min-w-0 flex-1 overflow-hidden">
            <motion.span
              initial={false}
              animate={{ x: isActive && !reduced ? 8 : 0 }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
              className="block"
            >
              <span
                className={cn(
                  't-h2 block text-balance transition-colors duration-300',
                  isActive ? 'text-accent-ink' : 'group-hover:text-accent-ink',
                )}
              >
                {project.title}
              </span>

              <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="t-meta text-ink-3">{project.category}</span>
                <span aria-hidden="true" className="text-ink-4">
                  /
                </span>
                <span className="t-meta tabular-nums text-ink-4">{project.year}</span>
                {isConfidential ? (
                  <span className="t-label rounded-xs border border-line-2 px-1.5 py-0.5 text-ink-3">
                    NDA
                  </span>
                ) : null}
              </span>

              {showInlineSummary ? (
                <span className="t-body-sm mt-4 block max-w-[52ch] text-ink-3">
                  {project.kicker}
                </span>
              ) : (
                // Still announced by a screen reader, just not painted.
                <span className="sr-only">{project.summary}</span>
              )}
            </motion.span>
          </span>

          <span
            aria-hidden="true"
            className="hidden shrink-0 items-center gap-2 text-sm font-medium text-ink-3 transition-colors duration-300 group-hover:text-accent-ink lg:flex"
          >
            {isConfidential ? 'Discuss' : 'Read'}
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="overflow-visible">
              <path
                d="M0 5h16M12 1l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="square"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </svg>
          </span>
        </Link>
      </motion.div>
    </li>
  );
}

function PreviewPanel({
  project,
  x,
  y,
  flip,
  reduced,
}: {
  project: Project;
  x: SpringValue;
  y: SpringValue;
  flip: MotionValue<number>;
  reduced: boolean;
}) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      initial={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduced ? { duration: 0 } : { duration: 0.34, ease: EASE }}
      className="pointer-events-none absolute left-0 top-0 z-30 hidden md:block"
    >
      <div className="-translate-y-1/2">
        <motion.div style={{ x: flip }} className="w-[min(26rem,42vw)] -translate-x-full pl-6">
          <div className="overflow-hidden rounded-lg border border-line-2 bg-canvas-2 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.45)]">
            <ProjectSchematic
              project={project}
              animated={!reduced}
              className="h-40 border-b border-line"
            />
            <div className="flex flex-col gap-3 p-4">
              <p className="t-body-sm text-ink-2">{project.summary}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-3"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
