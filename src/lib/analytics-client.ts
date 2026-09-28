'use client';

/**
 * Privacy-conscious analytics boundary.
 *
 * Design rules:
 *  - No analytics by default. Nothing loads unless a provider is configured.
 *  - No cookies, no fingerprinting, no cross-site identifiers.
 *  - One typed `track()` surface so call sites never touch a vendor SDK.
 *  - The script is loaded with `next/script` after hydration so it never blocks
 *    first paint or the LCP measurement.
 */

export type AnalyticsEvent =
  | { name: 'cta_click'; cta: string; location: string }
  | { name: 'case_study_open'; project: string }
  | { name: 'inquiry_start'; location: string }
  | { name: 'inquiry_submitted'; projectType: string; budget: string }
  | { name: 'inquiry_error'; field?: string }
  | { name: 'calendar_click'; location: string }
  | { name: 'deployment_run'; mode: 'success' | 'failure' | 'partial' }
  | { name: 'architecture_node_open'; node: string }
  | { name: 'insight_read'; article: string };

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
    va?: (event: string, options?: Record<string, unknown>) => void;
  }
}

function provider(): string {
  return process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? 'none';
}

export function analyticsEnabled(): boolean {
  return provider() !== 'none';
}

/** Fire-and-forget. Never throws, never blocks rendering. */
export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  if (!analyticsEnabled()) return;

  const { name, ...rest } = event;
  const props = Object.fromEntries(
    Object.entries(rest as Record<string, unknown>)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]),
  );

  try {
    if (provider() === 'plausible' && typeof window.plausible === 'function') {
      window.plausible(name, { props });
    } else if (provider() === 'vercel' && typeof window.va === 'function') {
      window.va(name, props);
    }
    if (process.env.NODE_ENV === 'development') {
      console.info('[analytics]', name, props);
    }
  } catch {
    // Analytics must never break the page.
  }
}

export function trackPageView(path: string): void {
  track({ name: 'cta_click', cta: 'page_view', location: path });
}
