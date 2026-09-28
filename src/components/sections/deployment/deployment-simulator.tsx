'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from '@/components/ui/button';
import { stages, closing, failureClosing, SIMULATION_DISCLOSURE } from '@/data/deployment';
import { useDeploymentRun } from './use-deployment-run';
import { DeploymentPipeline, stageStateFor } from './pipeline';
import { DeploymentTerminal } from './terminal';
import { ObservabilityPanel } from './observability';
import { StrategyPanel } from './strategies';
import { DeploymentArchitecture } from './architecture-view';
import { useInView } from '@/components/animations/use-in-view';
import { cn } from '@/lib/utils';

const STATUS_COPY = {
  idle: 'Ready to deploy',
  running: 'Deployment in progress',
  failing: 'Health check failed',
  rollback: 'Rolling back',
  success: 'Deployment successful',
  'rolled-back': 'Rollback completed',
} as const;

const MILESTONES = [
  { percent: 0, label: 'Deployment initialized' },
  { percent: 20, label: 'Dependencies installed' },
  { percent: 30, label: 'Tests running' },
  { percent: 40, label: 'Tests passed' },
  { percent: 50, label: 'Docker image built' },
  { percent: 60, label: 'Image pushed' },
  { percent: 70, label: 'Infrastructure updated' },
  { percent: 80, label: 'Application deployed' },
  { percent: 90, label: 'Health checks passed' },
  { percent: 100, label: 'Production traffic enabled' },
] as const;

export function DeploymentSimulator() {
  const { phase, isRunning, activeIndex, failedIndex, percent, log, deploy, reset, mode } =
    useDeploymentRun();
  const [selectedId, setSelectedId] = useState<string>('ci');
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.08 });
  const logRegionRef = useRef<HTMLDivElement | null>(null);

  const selectedStage = stages.find((s) => s.id === selectedId) ?? stages[0]!;
  const currentMilestone = [...MILESTONES]
    .reverse()
    .find((m) => percent >= m.percent);

  // Auto-follow the active stage while a run is in progress, unless the visitor
  // has deliberately selected a node.
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    if (pinned || !isRunning || activeIndex < 0) return;
    const stage = stages[activeIndex];
    if (stage) setSelectedId(stage.id);
  }, [activeIndex, isRunning, pinned]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setPinned(true);
  };

  return (
    <div ref={ref} className="mt-14">
      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface/40 p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              'h-2 w-2 rounded-full transition-colors duration-300',
              phase === 'success'
                ? 'bg-ok'
                : phase === 'rolled-back'
                  ? 'bg-ok'
                  : phase === 'failing'
                    ? 'bg-error'
                    : isRunning
                      ? 'bg-accent animate-pulse-dot'
                      : 'bg-idle',
            )}
          />
          <span className="text-sm font-medium text-ink" role="status" aria-live="polite">
            {STATUS_COPY[phase]}
          </span>
          <span className="t-meta text-ink-4">
            {phase === 'idle'
              ? 'v1.4.2'
              : phase === 'rolled-back'
                ? 'v1.4.1'
                : 'v1.4.2'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => deploy('success')}
            disabled={isRunning}
            className="group inline-flex h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-on-accent transition-[background-color,transform,box-shadow] duration-200 hover:bg-accent-hover active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-45"
          >
            {isRunning ? 'Deploying…' : 'Deploy v1.4.2'}
            <ArrowRight />
          </button>
          <button
            type="button"
            onClick={() => deploy('failure')}
            disabled={isRunning}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-line-2 px-4 text-sm font-medium text-ink-2 transition-colors duration-200 hover:border-line-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-45"
          >
            Simulate Failure
          </button>
          {phase !== 'idle' && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center rounded-md px-3 text-sm font-medium text-ink-3 transition-colors duration-200 hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <p className="t-meta mt-3 text-ink-4">
        {SIMULATION_DISCLOSURE} · nothing here touches a real system.
      </p>

      {/* Progress */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-4">
          <span className="t-meta text-ink-2">
            {phase === 'rolled-back' ? 'Rollback' : 'Deploy v1.4.2'}
          </span>
          <span className="font-mono text-sm tabular-nums text-ink">
            {phase === 'rolled-back' ? 'v1.4.1' : String(percent).padStart(3, '0')}%
          </span>
        </div>
        <div
          className="mt-2 h-px w-full overflow-hidden bg-line"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={phase === 'rolled-back' ? 100 : percent}
          aria-label="Deployment progress"
        >
          <div
            className={cn(
              'h-full transition-[width,background-color] duration-500 ease-[var(--ease-out-soft)]',
              phase === 'failing' ? 'bg-error' : 'bg-accent',
            )}
            style={{ width: `${phase === 'rolled-back' ? 100 : percent}%` }}
          />
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span className="t-meta text-ink-3">{currentMilestone?.label ?? 'Ready'}</span>
          <span className="t-meta text-ink-4">
            {mode === 'failure' && phase === 'rolled-back'
              ? 'Rolled back to v1.4.1'
              : `${stages.filter((_, i) => i <= activeIndex).length} of ${stages.length} stages`}
          </span>
        </div>
      </div>

      {/* Pipeline + detail */}
      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <DeploymentPipeline
            activeIndex={activeIndex}
            failedIndex={failedIndex}
            phase={phase}
            percent={percent}
            rollbackProgress={0}
            selectedId={selectedId}
            onSelect={handleSelect}
          />

          {/* Stage detail */}
          <div className="mt-8 min-h-[132px] rounded-lg border border-line bg-surface/40 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-2.5">
                <span className="t-meta text-accent-ink">{selectedStage.step}</span>
                <h3 className="t-h4">{selectedStage.label}</h3>
                <span className="t-meta text-ink-4">{selectedStage.sub}</span>
              </div>
              <span
                className={cn(
                  't-label',
                  stageStateFor(
                    stages.indexOf(selectedStage),
                    activeIndex,
                    failedIndex,
                    phase,
                  ) === 'done'
                    ? 'text-accent-ink'
                    : stageStateFor(
                          stages.indexOf(selectedStage),
                          activeIndex,
                          failedIndex,
                          phase,
                        ) === 'failed'
                      ? 'text-error'
                      : 'text-ink-4',
                )}
              >
                {stateLabel(selectedStage.id, activeIndex, failedIndex, phase)}
              </span>
            </div>
            <p className="t-body mt-3 max-w-[68ch]">{selectedStage.about}</p>
            {pinned && isRunning && (
              <button
                type="button"
                onClick={() => setPinned(false)}
                className="t-meta mt-3 text-ink-4 underline decoration-line-3 underline-offset-4 transition-colors hover:text-ink-2"
              >
                Follow the run again
              </button>
            )}
          </div>
        </div>

        {/* Terminal */}
        <div className="lg:col-span-4">
          <div className="h-[320px] lg:h-[400px]">
            <div ref={logRegionRef} className="h-full">
              <DeploymentTerminal log={log} />
            </div>
          </div>
        </div>
      </div>

      {/* Observability */}
      <div className="mt-4">
        <ObservabilityPanel phase={phase} />
      </div>

      {/* Strategies + architecture */}
      <div className="mt-4 grid gap-4">
        <StrategyPanel />
        <DeploymentArchitecture />
      </div>

      {/* Closing statement */}
      {(phase === 'success' || phase === 'rolled-back') && (
        <div
          className={cn(
            'mt-8 rounded-lg border p-5 md:p-6',
            phase === 'success' ? 'border-accent-tint-2 bg-accent-tint' : 'border-line bg-surface/40',
          )}
          aria-live="polite"
        >
          <div className="grid gap-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <h3 className="t-h3 text-balance">
                {phase === 'success' ? closing.title : failureClosing.title}
              </h3>
              <p className="t-body mt-3 max-w-[62ch]">
                {phase === 'success' ? closing.body : failureClosing.body}
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <a
                href="/contact"
                className="group inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-on-accent transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {phase === 'success' ? closing.cta : failureClosing.cta}
                <ArrowRight />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Idle hint keeps the section from looking broken before interaction */}
      {!inView && phase === 'idle' && <span className="sr-only">Deployment demo, idle</span>}
    </div>
  );
}

function stateLabel(
  id: string,
  activeIndex: number,
  failedIndex: number | null,
  phase: string,
): string {
  const index = stages.findIndex((s) => s.id === id);
  const state = stageStateFor(index, activeIndex, failedIndex, phase);
  if (state === 'failed') return 'Failed';
  if (state === 'done') return phase === 'rolled-back' ? 'Rolled back' : 'Completed';
  if (state === 'active') return 'In progress';
  return 'Pending';
}
