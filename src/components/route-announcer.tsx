'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Announces client-side navigations to screen readers. Next.js updates the
 * document title but does not move focus, so a keyboard or screen-reader user
 * would otherwise have no signal that the page changed.
 */
export function RouteAnnouncer() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.getElementById('main');
    if (!main) return;
    // Move focus to the top of the new document without scrolling the viewport
    // away from the top of the page.
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      <p>Page loaded</p>
    </div>
  );
}
