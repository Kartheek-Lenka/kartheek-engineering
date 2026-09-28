import Link from "next/link";
import type { Insight } from "@/lib/insights";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/button";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * One row of the insights index.
 *
 * Renders no list element of its own: the caller supplies the <li> via
 * <Reveal as="li">, so this returning a bare <Link> keeps <li> from nesting
 * inside <li> inside <ol>.
 */
export function InsightRow({
  insight,
  index,
}: {
  insight: Insight;
  index: number;
}) {
  return (
    <Link
      href={`/insights/${insight.slug}`}
      data-analytics="insight_read"
      className="group grid gap-3 py-6 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:grid-cols-12 md:gap-6 md:py-7"
    >
      <div className="flex items-baseline gap-4 md:col-span-2 md:flex-col md:items-start md:gap-1.5">
        <span className="t-meta text-ink-4">
          {String(index + 1).padStart(2, "0")}
        </span>
        <time dateTime={insight.date} className="t-meta text-ink-3">
          {formatDate(insight.date)}
        </time>
      </div>

      <div className="md:col-span-6">
        <h3 className="t-h3 text-balance transition-colors duration-200 group-hover:text-accent-ink">
          {insight.title}
        </h3>
        <p className="t-body mt-2 max-w-[56ch] text-ink-3">
          {insight.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-3">
        <ul className="flex flex-wrap gap-1.5">
          {insight.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-4"
            >
              {tag}
            </li>
          ))}
        </ul>
        <span className="t-meta text-ink-4">{insight.minutes} min</span>
      </div>

      <div className="flex items-center md:col-span-1 md:justify-end">
        <span
          aria-hidden="true"
          className="text-ink-4 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-ink-2"
        >
          <ArrowRight />
        </span>
        <span className="sr-only">Read {insight.title}</span>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */

/** Compact variant for the homepage, which shows only the most recent posts. */
export function InsightCard({
  insight,
  featured,
}: {
  insight: Insight;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col gap-3 bg-canvas p-5 transition-colors duration-300 hover:bg-surface md:p-6",
        featured && "bg-surface/40",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <time dateTime={insight.date} className="t-meta text-ink-4">
          {formatDate(insight.date)}
        </time>
        <span className="t-meta text-ink-4">{insight.minutes} min</span>
      </div>

      <h3 className="t-h3 text-balance">{insight.title}</h3>
      <p className="t-body-sm flex-1">{insight.description}</p>

      <Link
        href={`/insights/${insight.slug}`}
        data-analytics="insight_read"
        className="t-meta mt-1 inline-flex w-fit items-center gap-1.5 text-ink-3 transition-colors duration-200 hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Read
        <span
          aria-hidden="true"
          className="transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    </article>
  );
}
