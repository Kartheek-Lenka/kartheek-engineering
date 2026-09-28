import type { ArchitectureFlow } from '@/data/projects';
import { cn } from '@/lib/utils';

/**
 * Case study architecture diagram.
 *
 * A bordered grid of labelled nodes with directional flow between them. No
 * library, no SVG canvas, no client JavaScript — it has to render in the
 * server component pass and stay legible at 320px.
 */
export function CaseStudyDiagram({ flows }: { flows: ArchitectureFlow[] }) {
  return (
    <div className="mt-10 flex flex-col gap-4">
      {flows.map((flow) => (
        <div
          key={flow.id}
          className="rounded-lg border border-line bg-surface/40 p-4 md:p-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="t-h4">{flow.title}</h3>
            <p className="t-meta max-w-[42ch] text-ink-4">{flow.caption}</p>
          </div>

          <ol
            className={cn(
              'mt-5',
              flow.direction === 'down'
                ? 'flex flex-col gap-1.5'
                : 'flex flex-row flex-wrap items-stretch gap-1.5',
            )}
          >
            {flow.nodes.map((node) => (
              <li
                key={node.id}
                className={cn(
                  'flex min-w-0 flex-1 flex-col justify-center gap-0.5 rounded-md border bg-canvas px-3 py-2.5',
                  node.emphasis ? 'border-accent/40 bg-accent-tint' : 'border-line-2',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-[0.8125rem] leading-snug',
                    node.emphasis ? 'text-accent-ink' : 'text-ink',
                  )}
                >
                  {node.label}
                </span>
                {node.sub && <span className="t-meta text-ink-4">{node.sub}</span>}
              </li>
            ))}
          </ol>

          {/* Flow direction is conveyed by the ordered list and the caption;
              the arrow row is decorative reinforcement, hidden from AT. */}
          {flow.nodes.length > 1 && (
            <p aria-hidden="true" className="t-meta mt-3 text-ink-4">
              {flow.direction === 'down'
                ? flow.nodes.map((n) => n.label).join('  ↓  ')
                : flow.nodes.map((n) => n.label).join('  →  ')}
            </p>
          )}

          <span className="sr-only">
            Flow: {flow.nodes.map((n) => n.label).join(' then ')}
          </span>
        </div>
      ))}
    </div>
  );
}
