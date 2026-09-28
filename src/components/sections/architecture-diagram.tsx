'use client';

import { useState } from 'react';
import { useInView } from '@/components/animations/use-in-view';
import { track } from '@/lib/analytics-client';
import { cn } from '@/lib/utils';

type Node = {
  id: string;
  label: string;
  sub: string;
  about: string;
  layer: 'request' | 'build' | 'observe';
};

const NODES: Node[] = [
  {
    id: 'user',
    label: 'User',
    sub: 'browser',
    layer: 'request',
    about:
      'A real user on a real network. Everything below this line is designed for latency, failure and a connection that will drop.',
  },
  {
    id: 'edge',
    label: 'Edge',
    sub: 'CDN · WAF · TLS',
    layer: 'request',
    about:
      'Terminates TLS, serves static assets close to the user, absorbs traffic spikes and blocks obvious attacks before they reach your code.',
  },
  {
    id: 'lb',
    label: 'Load balancer',
    sub: 'health checks',
    layer: 'request',
    about:
      'Distributes traffic across healthy instances and removes instances that fail health checks — so a bad deploy is caught before users meet it.',
  },
  {
    id: 'app',
    label: 'Application',
    sub: 'Next.js · Node · Python',
    layer: 'request',
    about:
      'The product itself. Server-rendered where that helps, client-side where it does not, with the data layer kept behind a validated boundary.',
  },
  {
    id: 'api',
    label: 'API',
    sub: 'REST · server actions',
    layer: 'request',
    about:
      'One contract, validated on the server. A browser is a convenience, not a trust boundary, so every request is re-validated at the edge of the app.',
  },
  {
    id: 'db',
    label: 'Database',
    sub: 'Postgres · MongoDB',
    layer: 'request',
    about:
      'The source of truth. Schema, indexes and migrations designed with the real access patterns in mind, not added after the data arrives.',
  },
  {
    id: 'queue',
    label: 'Queue',
    sub: 'async work',
    layer: 'request',
    about:
      'Anything slow or retryable — email, ingestion, AI calls, exports — leaves the request path so a user never waits for a third party.',
  },
  {
    id: 'workers',
    label: 'Workers',
    sub: 'background jobs',
    layer: 'request',
    about:
      'Long-running and scheduled work, isolated from the web tier with retries, idempotency and dead-letter handling.',
  },
  {
    id: 'github',
    label: 'GitHub',
    sub: 'source of truth',
    layer: 'build',
    about: 'Version control with history, review and branch protection as the control point for what is allowed to ship.',
  },
  {
    id: 'cicd',
    label: 'CI/CD',
    sub: 'Actions · Jenkins',
    layer: 'build',
    about:
      'Every change is validated automatically: types, tests, security scanning, image build. The pipeline is the gate, not a formality.',
  },
  {
    id: 'docker',
    label: 'Docker',
    sub: 'immutable image',
    layer: 'build',
    about:
      'A versioned, reproducible artefact. Multi-stage builds keep the runtime image small and the toolchain out of production.',
  },
  {
    id: 'cloud',
    label: 'Cloud',
    sub: 'AWS · GCP',
    layer: 'build',
    about:
      'Infrastructure declared in Terraform and applied through a reviewed plan, so the environment is reproducible rather than remembered.',
  },
  {
    id: 'logs',
    label: 'Logs',
    sub: 'structured',
    layer: 'observe',
    about: 'Structured, correlated, searchable output — the record of what actually happened.',
  },
  {
    id: 'metrics',
    label: 'Metrics',
    sub: 'rates · saturation',
    layer: 'observe',
    about:
      'Request rate, error rate, duration and saturation. The four signals that tell you whether the system is healthy before anyone complains.',
  },
  {
    id: 'traces',
    label: 'Traces',
    sub: 'request paths',
    layer: 'observe',
    about:
      'Distributed tracing shows where a slow request actually spent its time, instead of which service you suspect.',
  },
  {
    id: 'alerts',
    label: 'Alerts',
    sub: 'actionable only',
    layer: 'observe',
    about:
      'Alerts that page on real user impact. An alert nobody acts on trains the team to ignore the next one.',
  },
];

const LAYERS: {
  id: Node['layer'];
  label: string;
  caption: string;
  nodes: Node[];
}[] = [
  {
    id: 'request',
    label: 'Request path',
    caption: 'How a request travels through the system, and what happens when it fails.',
    nodes: NODES.filter((n) => n.layer === 'request'),
  },
  {
    id: 'build',
    label: 'Delivery path',
    caption: 'How a commit becomes running infrastructure.',
    nodes: NODES.filter((n) => n.layer === 'build'),
  },
  {
    id: 'observe',
    label: 'Observability path',
    caption: 'How the system tells you the truth about itself afterwards.',
    nodes: NODES.filter((n) => n.layer === 'observe'),
  },
];

export function ArchitectureSection() {
  const [selected, setSelected] = useState<string>('app');
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const selectedNode = NODES.find((n) => n.id === selected) ?? NODES[0]!;

  return (
    <div ref={ref} className="mt-14">
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Diagram */}
        <div className="lg:col-span-7">
          <div className="grid gap-3">
            {LAYERS.map((layer) => (
              <div
                key={layer.id}
                className="rounded-lg border border-line bg-surface/40 p-4 md:p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="t-h4">{layer.label}</h3>
                  <p className="t-meta text-ink-4">{layer.caption}</p>
                </div>

                <ol className="mt-4 flex flex-col">
                  {layer.nodes.map((node, index) => (
                    <li key={node.id} className="relative flex gap-3 pb-2 last:pb-0">
                      {index < layer.nodes.length - 1 && (
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute top-6 left-[7px] h-full w-px transition-colors duration-500',
                            inView ? 'bg-line-2' : 'bg-line',
                          )}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(node.id);
                          track({ name: 'architecture_node_open', node: node.id });
                        }}
                        aria-pressed={selected === node.id}
                        className={cn(
                          'group relative z-1 flex min-h-11 w-full items-center gap-3 rounded-md px-2 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                          selected === node.id ? 'bg-accent-tint' : 'hover:bg-surface-2',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'h-3.5 w-3.5 shrink-0 rounded-full border transition-colors duration-200',
                            selected === node.id
                              ? 'border-accent bg-accent'
                              : 'border-line-3 bg-canvas group-hover:border-line-3',
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-[0.8125rem] text-ink">
                            {node.label}
                          </span>
                          <span className="t-meta block text-ink-4">{node.sub}</span>
                        </span>
                        {inView && selected === node.id && (
                          <span
                            aria-hidden="true"
                            className="h-1 w-1 shrink-0 rounded-full bg-accent animate-pulse-dot"
                          />
                        )}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* Node explanation */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-lg border border-line bg-inset p-5 md:p-6">
            <span className="t-label">Selected node</span>
            <div className="mt-4 flex items-baseline gap-3">
              <h3 className="t-h3">{selectedNode.label}</h3>
              <span className="t-meta text-ink-4">{selectedNode.sub}</span>
            </div>
            <p className="t-body mt-4">{selectedNode.about}</p>

            <div className="mt-6 border-t border-line pt-5">
              <p className="t-label">Design principles</p>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  'Slow work leaves the request path.',
                  'Every boundary validates its input.',
                  'Health checks decide traffic, not optimism.',
                  'If it is not observable, it is not operable.',
                  'Immutable artefacts make rollback cheap.',
                ].map((principle) => (
                  <li key={principle} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-[0.65em] h-px w-3 shrink-0 bg-accent" />
                    <span className="t-body-sm">{principle}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="t-meta mt-6 text-ink-4">
              A reference topology, not a template. The shape of a system follows its load,
              its budget and its risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
