'use client';

import { stages, type StageState } from '@/data/deployment';
import { cn } from '@/lib/utils';

export function stageStateFor(
  index: number,
  activeIndex: number,
  failedIndex: number | null,
  phase: string,
): StageState {
  if (failedIndex !== null && index === failedIndex) return 'failed';
  if (failedIndex !== null && index < failedIndex) return 'done';
  if (activeIndex >= index) return 'done';
  if (activeIndex === index - 1 || activeIndex === index) {
    return phase === 'running' && index === activeIndex ? 'active' : 'idle';
  }
  return 'idle';
}

/**
 * The pipeline.
 *
 * Desktop: a horizontal rail with a connecting line that fills as stages
 * complete, plus a travelling packet on the active segment.
 * Mobile: the same nodes, restacked as a vertical numbered timeline.
 *
 * One DOM, two compositions. No duplicated markup, no duplicated state.
 */
export function DeploymentPipeline({
  activeIndex,
  failedIndex,
  phase,
  percent,
  rollbackProgress,
  selectedId,
  onSelect,
}: {
  activeIndex: number;
  failedIndex: number | null;
  phase: string;
  percent: number;
  rollbackProgress: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const overall = phase === 'rolled-back' ? 0 : percent;
  const fill = phase === 'rollback' ? Math.max(rollbackProgress, 0) : overall;

  return (
    <div className="relative">
      {/* Rail — horizontal on desktop */}
      <div className="relative hidden lg:block">
        <div className="absolute top-[13px] right-0 left-0 h-px bg-line" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute top-[13px] left-0 h-px bg-accent transition-[width] duration-500 ease-[var(--ease-out-soft)]"
          style={{ width: `${fill}%` }}
        />
        <ol className="relative grid grid-cols-13 gap-1">
          {stages.map((stage, index) => (
            <li key={stage.id} className="flex flex-col items-center">
              <PipelineNode
                stage={stage}
                index={index}
                state={stageStateFor(index, activeIndex, failedIndex, phase)}
                selected={selectedId === stage.id}
                onSelect={onSelect}
                compact
              />
            </li>
          ))}
        </ol>
      </div>

      {/* Vertical timeline — mobile and tablet */}
      <ol className="relative flex flex-col lg:hidden">
        <div className="absolute top-3 bottom-3 left-[13px] w-px bg-line" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute top-3 left-[13px] w-px bg-accent transition-[height] duration-500 ease-[var(--ease-out-soft)]"
          style={{ height: `${fill}%` }}
        />
        {stages.map((stage, index) => (
          <li key={stage.id} className="relative flex gap-4 pb-1">
            <div className="relative z-1 pt-3.5">
              <PipelineNode
                stage={stage}
                index={index}
                state={stageStateFor(index, activeIndex, failedIndex, phase)}
                selected={selectedId === stage.id}
                onSelect={onSelect}
              />
            </div>
            <button
              type="button"
              onClick={() => onSelect(stage.id)}
              aria-pressed={selectedId === stage.id}
              className="flex min-h-13 flex-1 flex-col justify-center gap-0.5 rounded-md py-3 pr-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="flex items-baseline gap-2">
                <span
                  className={cn(
                    't-meta',
                    stageStateFor(index, activeIndex, failedIndex, phase) === 'failed'
                      ? 'text-error'
                      : stageStateFor(index, activeIndex, failedIndex, phase) === 'done'
                        ? 'text-accent-ink'
                        : 'text-ink-3',
                  )}
                >
                  {stage.step}
                </span>
                <span className="text-sm font-medium text-ink">{stage.label}</span>
              </span>
              <span className="t-meta text-ink-4">{stage.sub}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PipelineNode({
  stage,
  index,
  state,
  selected,
  onSelect,
  compact = false,
}: {
  stage: (typeof stages)[number];
  index: number;
  state: StageState;
  selected: boolean;
  onSelect: (id: string) => void;
  compact?: boolean;
}) {
  const isActive = state === 'active';
  const isDone = state === 'done';
  const isFailed = state === 'failed';

  return (
    <button
      type="button"
      onClick={() => onSelect(stage.id)}
      aria-pressed={selected}
      aria-label={`${stage.label} — ${stage.about}`}
      className={cn(
        'group relative z-2 flex items-center justify-center rounded-full border transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        compact ? 'h-7 w-7' : 'h-7 w-7',
        isDone && 'border-accent bg-accent',
        isActive &&
          'border-accent bg-canvas shadow-[0_0_0_4px_var(--color-accent-tint)]',
        isFailed && 'border-error bg-error',
        !isDone && !isActive && !isFailed && 'border-line-3 bg-canvas group-hover:border-line-3',
        selected && !isActive && 'ring-1 ring-accent ring-offset-2 ring-offset-canvas',
        isActive && 'animate-pulse-dot',
      )}
    >
      <span className="sr-only">{`Stage ${index + 1}: ${stage.label}`}</span>
      {isFailed ? (
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
          <path
            d="M3 3l6 6M9 3l-6 6"
            stroke="var(--color-on-accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ) : isDone ? (
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
          <path
            d="M2.5 6.2 4.8 8.5 9.5 3.8"
            stroke="var(--color-on-accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span
          aria-hidden="true"
          className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-accent' : 'bg-line-3')}
        />
      )}
    </button>
  );
}
