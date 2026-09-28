'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the user's reduced-motion preference reactively.
 *
 * The CSS in globals.css already neutralises transitions as a safety net, but
 * anything driven by JavaScript timers (the deployment simulation, the metric
 * charts) needs to branch on this explicitly.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return prefersReduced;
}
