'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  failLog,
  rollbackLog,
  stages,
  successLog,
  type LogLine,
} from '@/data/deployment';
import { track } from '@/lib/analytics-client';

export type Phase = 'idle' | 'running' | 'failing' | 'rollback' | 'success' | 'rolled-back';

export type RunMode = 'success' | 'failure';

export type LogEntry = LogLine & { key: number };

/**
 * Deployment run state machine.
 *
 * A single scripted timeline per run. Every timer is registered in `timers` and
 * cleared on unmount or restart, so a run can never continue after the section
 * is scrolled away or the component is torn down.
 */
export function useDeploymentRun() {
  const [runId, setRunId] = useState(0);
  const [mode, setMode] = useState<RunMode>('success');
  const [phase, setPhase] = useState<Phase>('idle');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [failedIndex, setFailedIndex] = useState<number | null>(null);
  const [percent, setPercent] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [rollbackProgress, setRollbackProgress] = useState(0);

  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const keyRef = useRef(0);
  const runIdRef = useRef(runId);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    runIdRef.current = runId;
  }, [runId]);

  // On unmount, stop everything.
  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (runId === 0) return;

    let cancelled = false;
    const currentRun = runId;
    const isStale = () => cancelled || runIdRef.current !== currentRun;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        timers.current.push(id);
      });

    const append = (lines: LogLine[]) => {
      if (isStale()) return;
      setLog((previous) => [
        ...previous,
        ...lines.map((line) => ({ ...line, key: (keyRef.current += 1) })),
      ]);
    };

    async function run() {
      setPhase('running');
      setActiveIndex(-1);
      setFailedIndex(null);
      setPercent(0);
      setRollbackProgress(0);
      setLog([]);

      for (let index = 0; index < stages.length; index += 1) {
        const stage = stages[index]!;
        if (isStale()) return;

        setActiveIndex(index);

        // Stage log lines are staggered within the stage's own duration.
        for (const line of stage.log) {
          if (line.at > 0) await sleep(Math.min(line.at, stage.duration));
          if (isStale()) return;
          append([line]);
        }

        const remaining = stage.duration - Math.max(...stage.log.map((l) => l.at), 0);
        if (remaining > 0) await sleep(remaining);
        if (isStale()) return;

        setPercent(stage.percent);

        const isFailurePoint = mode === 'failure' && stage.id === 'health';
        if (!isFailurePoint) continue;

        /* ---------------- failure path ---------------- */
        setPhase('failing');
        setFailedIndex(index);
        setPercent(stage.percent);
        append(failLog);
        track({ name: 'deployment_run', mode: 'partial' });

        await sleep(1500);
        if (isStale()) return;

        setPhase('rollback');
        setRollbackProgress(0);

        // Rollback lines are paced so each state is legible before the next.
        let elapsed = 0;
        for (const line of rollbackLog) {
          const wait = line.at - elapsed;
          if (wait > 0) await sleep(wait);
          if (isStale()) return;
          append([line]);
          elapsed = line.at;
        }

        setRollbackProgress(100);
        await sleep(600);
        if (isStale()) return;

        setPhase('rolled-back');
        track({ name: 'deployment_run', mode: 'failure' });
        return;
      }

      if (isStale()) return;
      setPhase('success');
      append(successLog);
      track({ name: 'deployment_run', mode: 'success' });
    }

    void run();

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [runId, mode, clearTimers]);

  const deploy = useCallback((nextMode: RunMode) => {
    setMode(nextMode);
    setRunId((id) => id + 1);
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setRunId((id) => id + 1);
    setPhase('idle');
    setActiveIndex(-1);
    setFailedIndex(null);
    setPercent(0);
    setLog([]);
    setRollbackProgress(0);
  }, [clearTimers]);

  const isRunning = phase === 'running' || phase === 'failing' || phase === 'rollback';

  return {
    phase,
    isRunning,
    activeIndex,
    failedIndex,
    percent,
    log,
    rollbackProgress,
    deploy,
    reset,
    mode,
  };
}
