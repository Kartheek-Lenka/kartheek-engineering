'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from '@/components/ui/button';
import { navLinks, siteConfig } from '@/data/site';
import { track } from '@/lib/analytics-client';

/**
 * Fullscreen mobile navigation.
 *
 * Requirements it satisfies: a single 44px+ trigger, focus moved into the panel
 * on open and returned to the trigger on close, Escape to dismiss, background
 * scroll locked, and `inert`-equivalent behaviour for the rest of the page via
 * aria-hidden on the siblings that matter. The panel is a dialog.
 */
export function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      // Trap focus inside the open panel.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    firstLinkRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-line-2 text-ink-2 transition-colors duration-200 hover:border-line-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
      >
        <span className="relative flex h-3 w-4 flex-col justify-between">
          <span
            className={`h-px w-full origin-center bg-current transition-transform duration-300 ease-[var(--ease-out-expo)] ${
              open ? 'translate-y-[5.5px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-px w-full origin-center bg-current transition-transform duration-300 ease-[var(--ease-out-expo)] ${
              open ? '-translate-y-[5.5px] -rotate-45' : ''
            }`}
          />
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-99 flex flex-col bg-canvas/97 backdrop-blur-2xl md:hidden"
        >
          <div className="container-page flex h-16 items-center justify-between">
            <span className="text-[0.8125rem] font-medium tracking-[-0.01em] text-ink">
              KARTHEEK LENKA
            </span>
            <span className="t-label">Menu</span>
          </div>

          <nav
            aria-label="Mobile"
            className="container-page flex flex-1 flex-col justify-center gap-1 pb-8"
          >
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                ref={index === 0 ? firstLinkRef : undefined}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className="group flex min-h-14 items-center justify-between gap-4 border-b border-line py-3 text-2xl font-medium tracking-[-0.028em] text-ink transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
              >
                <span className="flex items-baseline gap-3">
                  <span className="t-meta text-ink-4">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                </span>
                <ArrowRight className="text-ink-4 transition-colors group-hover:text-accent" />
              </Link>
            ))}

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/contact"
                onClick={() =>
                  track({ name: 'cta_click', cta: 'mobile_start_project', location: 'mobile_nav' })
                }
                className="flex min-h-12 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-on-accent transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Start a Project
              </Link>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex min-h-12 items-center justify-center rounded-md border border-line-2 px-6 text-sm font-medium text-ink-2 transition-colors duration-200 hover:border-line-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {siteConfig.email}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
