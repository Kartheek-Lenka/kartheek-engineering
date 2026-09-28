'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks, siteConfig } from '@/data/site';
import { ButtonLink } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileNav } from '@/components/mobile-nav';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // The header is sticky, so the compact state keys off window scroll rather
    // than the header's own position.
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-100 w-full transition-[background-color,border-color,backdrop-filter] duration-300 ease-[var(--ease-out-soft)]',
        scrolled
          ? 'hairline-b border-line bg-canvas/85 backdrop-blur-xl backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div
        className={cn(
          'container-page flex items-center justify-between gap-6 transition-[height] duration-300 ease-[var(--ease-out-soft)]',
          scrolled ? 'h-14 md:h-16' : 'h-16 md:h-20',
        )}
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          aria-label={`${siteConfig.name} — home`}
        >
          <span
            aria-hidden="true"
            className="relative flex h-7 w-7 items-center justify-center rounded-[5px] border border-line-2 bg-surface-2 transition-colors duration-200 group-hover:border-line-3"
          >
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none">
              {/* K monogram: stem plus the two diagonals meeting it mid-height. */}
              <path
                d="M4 16V4M15.4 4.4L4 10.4l11.4 5.2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="square"
                strokeLinejoin="miter"
                className="text-ink"
              />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[0.8125rem] font-medium tracking-[-0.01em] text-ink">
              KARTHEEK LENKA
            </span>
            <span
              className={cn(
                't-label mt-1 hidden overflow-hidden transition-all duration-300 ease-[var(--ease-out-soft)] sm:block',
                scrolled ? 'max-h-0 opacity-0' : 'max-h-3 opacity-100',
              )}
            >
              AI Product &amp; Cloud Engineer
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded-md px-3 py-2 text-[0.8125rem] font-medium transition-colors duration-200',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  active ? 'text-ink' : 'text-ink-3 hover:text-ink',
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-3 -bottom-px h-px origin-left bg-accent transition-transform duration-300 ease-[var(--ease-out-expo)]',
                    active ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <ButtonLink
            href="/contact"
            size="sm"
            className="hidden md:inline-flex"
            data-analytics="header_start_project"
            data-analytics-location="header"
          >
            Start a Project
          </ButtonLink>
          <MobileNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
