import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Section primitive. Owns the vertical rhythm so spacing is a system decision
 * rather than a per-section one.
 */
export function Section({
  children,
  className,
  id,
  as: Tag = 'section',
  'aria-labelledby': ariaLabelledBy,
  bordered = true,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div' | 'article' | 'aside';
  'aria-labelledby'?: string;
  bordered?: boolean;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn('relative scroll-mt-24', bordered && 'hairline-b', className)}
    >
      {children}
    </Tag>
  );
}

export function Container({
  children,
  className,
  size = 'default',
}: {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'wide' | 'narrow';
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 md:px-8 xl:px-12',
        size === 'default' && 'max-w-[1440px]',
        size === 'wide' && 'max-w-[1600px]',
        size === 'narrow' && 'max-w-[880px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section heading block. The eyebrow/index is monospace metadata, the title is
 * display type, the lede is constrained to a readable measure.
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  index,
  align = 'start',
  actions,
  className,
  titleAs = 'h2',
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  index?: string;
  align?: 'start' | 'center';
  actions?: ReactNode;
  className?: string;
  titleAs?: 'h1' | 'h2' | 'h3';
  /** Applied to the title element, so `aria-labelledby` can point at it. */
  id?: string;
}) {
  const Title = titleAs;

  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {(eyebrow || index) && (
          <div className="mb-5 flex items-center gap-3">
            {index && <span className="t-label text-accent-ink">{index}</span>}
            {eyebrow && <span className="t-label">{eyebrow}</span>}
            {(index || eyebrow) && <span aria-hidden="true" className="h-px flex-1 bg-line" />}
          </div>
        )}
        <Title id={id} className="t-h2 text-balance">
          {title}
        </Title>
        {lede && <p className="t-lead mt-6 max-w-[54ch]">{lede}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

/** Small uppercase monospace metadata tag. */
export function Tag({
  children,
  className,
  tone = 'neutral',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'neutral' | 'accent' | 'ok';
}) {
  return (
    <span
      className={cn(
        't-label inline-flex items-center rounded-xs border px-2 py-1',
        tone === 'neutral' && 'border-line-2 text-ink-3',
        tone === 'accent' && 'border-accent-tint-2 bg-accent-tint text-accent-ink',
        tone === 'ok' && 'border-ok/30 bg-ok-tint text-ok',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Key/value data row used across technical blocks. */
export function DataRow({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 border-b border-line py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6',
        className,
      )}
    >
      <dt className="t-label">{label}</dt>
      <dd className="t-body-sm text-ink sm:text-right">{value}</dd>
    </div>
  );
}
