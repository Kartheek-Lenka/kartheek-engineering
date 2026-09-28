import { siteConfig } from '@/data/site';

/**
 * Availability indicator.
 *
 * Deliberately a static statement, not a live status feed — a fabricated
 * "online now" badge is the kind of detail that costs trust when noticed.
 */
export function AvailabilityPill({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border border-line-2 bg-surface/70 py-1.5 pr-3.5 pl-3 ${className}`}
    >
      <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-ok/40" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-ok" />
      </span>
      <span className="t-label text-ink-2">{siteConfig.availability.label}</span>
    </span>
  );
}
