'use client';

import { useEffect, useRef, useState } from 'react';
import { metrics, type Metric } from '@/data/deployment';
import { useReducedMotion } from '@/components/animations/use-reduced-motion';
import type { Phase } from './use-deployment-run';
import { cn } from '@/lib/utils';

const POINTS = 28;
const TICK_MS = 220;

/** Seeded generator so a given run renders identically across SSR and client. */
function series(seed: number, length: number): number[] {
  const values: number[] = [];
  let state = seed;
  for (let index = 0; index < length; index += 1) {
    state = (state * 1103515245 + 12345) % 2147483648;
    values.push(state / 2147483648);
  }
  return values;
}

/**
 * Observability panel.
 *
 * Behaviour: flat while idle, a settling ramp after a successful deployment, a
 * spike and recovery after a failed one — and then it STOPS. The interval is
 * cleared once the series settles, so an idle page never burns a timer and the
 * DOM is never continuously churning.
 */
export function ObservabilityPanel({ phase }: { phase: Phase }) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const settled = phase === 'success';
  const failed = phase === 'rolled-back' || phase === 'rollback';
  const active = phase === 'running' || phase === 'failing';

  // Target number of ticks for the current phase.
  const target = settled || failed ? (reduced ? 1 : 12) : active ? (reduced ? 1 : 6) : 0;

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (target === 0) {
      setTick(0);
      return;
    }

    timerRef.current = setInterval(() => {
      setTick((current) => {
        if (current + 1 >= target) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return target;
        }
        return current + 1;
      });
    }, TICK_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [target, reduced]);

  const base = buildSeries(tick, settled, failed, active);

  return (
    <div className="rounded-lg border border-line bg-inset p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="t-label">Post-deploy observability</span>
        <span className="t-meta text-ink-4">
          {settled
            ? 'stable'
            : failed
              ? 'recovered'
              : active
                ? 'settling'
                : 'idle'}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map((metric) => (
          <MetricSpark key={metric.id} metric={metric} values={base[metric.id] ?? []} />
        ))}
      </div>

      <p className="t-meta mt-5 text-ink-4">
        Simulated values for illustration. Series are illustrative only — not production
        metrics from a live system.
      </p>
    </div>
  );
}

function buildSeries(
  tick: number,
  settled: boolean,
  failed: boolean,
  active: boolean,
): Record<string, number[]> {
  const result: Record<string, number[]> = {};

  for (const metric of metrics) {
    const noise = series(metric.seed, POINTS);
    const progress = tick / 12;

    let values: number[];

    if (settled) {
      // Ramp in and settle to a low-variance band.
      values = noise.map((value, index) => {
        const ramp = Math.min(1, progress * 1.6);
        const settle = 0.55 + 0.45 * Math.min(1, progress);
        const baseline = 0.3 + 0.18 * Math.sin(index / 5) + (value - 0.5) * 0.22 * settle;
        return baseline * ramp;
      });
    } else if (failed) {
      // Spike, then recover toward the settled band.
      values = noise.map((value) => {
        const spike = Math.exp(-Math.pow((progress - 0.35) * 4, 2)) * 0.5;
        const recovery = Math.min(1, progress * 1.1);
        const baseline = (0.28 + (value - 0.5) * 0.18) * recovery;
        return Math.min(1, baseline + spike * (0.4 + value * 0.6));
      });
    } else if (active) {
      values = noise.map((value) => (0.3 + (value - 0.5) * 0.5) * Math.min(1, progress + 0.2));
    } else {
      values = noise.map(() => 0.04);
    }

    result[metric.id] = values;
  }

  return result;
}

function MetricSpark({ metric, values }: { metric: Metric; values: number[] }) {
  const width = 120;
  const height = 30;

  const path = values.length
    ? values
        .map((value, index) => {
          const x = (index / (POINTS - 1)) * width;
          const y = height - Math.max(0.02, Math.min(1, value)) * (height - 3) - 1.5;
          return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ')
    : '';

  const displayValue = displayFor(metric, values);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="t-label">{metric.label}</span>
        <span
          className={cn(
            'font-mono text-[0.8125rem] tabular-nums',
            metric.tone === 'good' ? 'text-ok' : 'text-ink',
          )}
        >
          {displayValue}
          <span className="ml-0.5 text-ink-4">{metric.unit}</span>
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-8 w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1={height - 1.5}
          x2={width}
          y2={height - 1.5}
          stroke="var(--color-line)"
          strokeWidth="1"
        />
        {path && (
          <>
            <path
              d={`${path} L${width} ${height} L0 ${height} Z`}
              fill="var(--color-accent-tint)"
              className="transition-opacity duration-300"
            />
            <path
              d={path}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>
    </div>
  );
}

function displayFor(metric: Metric, values: number[]): string {
  if (values.length === 0) return '—';
  const last = values[values.length - 1] ?? 0;
  const scaled = last * (metric.id === 'rps' ? 4200 : metric.id === 'errors' ? 1 : 100);

  if (metric.id === 'rps') return Math.round(scaled).toLocaleString('en-US');
  if (metric.id === 'errors') return scaled.toFixed(2);
  if (metric.id === 'latency') return String(Math.round(120 + scaled * 0.4));
  return String(Math.round(scaled));
}
