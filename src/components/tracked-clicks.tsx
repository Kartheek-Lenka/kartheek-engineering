'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics-client';

/**
 * Delegated click tracking.
 *
 * One listener on `document` handles every element carrying `data-analytics`.
 * This exists so server components can declare an analytics label as a plain
 * attribute instead of passing a function prop, which would force a client
 * boundary around every CTA on the site.
 *
 * Convention: `data-analytics="cta_name"`, optionally
 * `data-analytics-location="section"`.
 */
export function TrackedClicks() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const element = target.closest<HTMLElement>('[data-analytics]');
      const label = element?.dataset.analytics;
      if (!label) return;

      const location = element.dataset.analyticsLocation;
      if (location) {
        track({ name: 'cta_click', cta: label, location });
      } else {
        track({ name: 'cta_click', cta: label, location: 'unknown' });
      }
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
