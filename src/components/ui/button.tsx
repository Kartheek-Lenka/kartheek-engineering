import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} = {}): string {
  const base =
    'group relative inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-md transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-[var(--ease-out-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 active:translate-y-px select-none';

  const sizes = {
    // 44px minimum touch target on mobile (see DESIGN_SYSTEM.md § Interaction).
    sm: 'h-9 px-3.5 text-[0.8125rem]',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-[0.9375rem]',
  } as const;

  const variants = {
    primary:
      'bg-accent text-on-accent shadow-[0_1px_0_0_rgb(255_255_255/0.12)_inset,0_8px_24px_-12px_rgb(59_107_255/0.9)] hover:bg-accent-hover hover:shadow-[0_1px_0_0_rgb(255_255_255/0.16)_inset,0_12px_28px_-12px_rgb(59_107_255/0.95)]',
    secondary:
      'border border-line-2 bg-surface/60 text-ink backdrop-blur-[2px] hover:border-line-3 hover:bg-surface-2 hover:text-ink',
    ghost: 'text-ink-2 hover:bg-surface-2 hover:text-ink',
    link: 'text-ink underline decoration-line-3 underline-offset-4 hover:decoration-accent',
  } as const;

  return cn(base, sizes[size], variants[variant], className);
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  external?: boolean;
  'aria-label'?: string;
  /**
   * Analytics label, e.g. `pricing_tier`. Tracked by a delegated listener in
   * `TrackedClicks` rather than an inline handler, so `ButtonLink` stays a
   * server component and can be rendered from server-rendered pages.
   */
  'data-analytics'?: string;
};

/**
 * Server component on purpose. Tracking is declarative via `data-analytics` so
 * that server components can render CTAs without pulling in a client boundary.
 */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  external,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props} />
  );
}

/** Small arrow that shifts on hover. The only decorative motion on CTAs. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(
        'h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5',
        className,
      )}
    >
      <path
        d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
