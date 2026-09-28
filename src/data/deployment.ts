/**
 * Deployment simulation content.
 *
 * IMPORTANT: everything here describes an ILLUSTRATIVE deployment flow and an
 * example reference architecture. It is not a claim that any client runs this
 * exact toolchain, and the version number, timings and metric values are
 * simulated. The UI labels this explicitly — see `SIMULATION_DISCLOSURE`.
 */

export const SIMULATION_DISCLOSURE = 'Illustrative deployment flow · simulated data';

export type StageState = 'idle' | 'active' | 'done' | 'failed';

export type Stage = {
  id: string;
  /** Two-digit label used by the mobile timeline. */
  step: string;
  label: string;
  sub: string;
  /** Progress percentage reached when this stage completes. */
  percent: number;
  /** Milliseconds this stage occupies in the run. */
  duration: number;
  /** Explanation shown when the node is selected. */
  about: string;
  log: LogLine[];
};

export type LogLine = {
  text: string;
  kind: 'cmd' | 'info' | 'ok' | 'error' | 'dim';
  /** Milliseconds after the stage starts before this line appears. */
  at: number;
};

const line = (text: string, kind: LogLine['kind'] = 'info', at = 0): LogLine => ({
  text,
  kind,
  at,
});

export const stages: Stage[] = [
  {
    id: 'developer',
    step: '01',
    label: 'Developer',
    sub: 'commit',
    percent: 0,
    duration: 800,
    about:
      'A change lands as a commit behind a pull request. Nothing reaches the cluster without going through review.',
    log: [line('$ git push origin main', 'cmd'), line('→ 1 commit · main · 4f9c1a2', 'dim', 320)],
  },
  {
    id: 'github',
    step: '02',
    label: 'GitHub',
    sub: 'source',
    percent: 8,
    duration: 900,
    about: 'Source control and collaboration. History, review and branch protection live here.',
    log: [
      line('→ Triggering GitHub Actions...', 'info', 120),
      line('✓ Checkout completed', 'ok', 620),
    ],
  },
  {
    id: 'pull-request',
    step: '03',
    label: 'Pull request',
    sub: 'review',
    percent: 14,
    duration: 900,
    about:
      'Automated checks gate the merge. A red check is information, not an obstacle to route around.',
    log: [line('✓ Pull request #142 merged into main', 'ok', 260)],
  },
  {
    id: 'ci',
    step: '04',
    label: 'CI',
    sub: 'workflow',
    percent: 24,
    duration: 1100,
    about: 'Automated validation before deployment. The pipeline runs on every change, not only releases.',
    log: [
      line('→ ci.yml · ubuntu-latest · node 22', 'dim', 120),
      line('✓ Environment resolved · lockfile verified', 'ok', 640),
    ],
  },
  {
    id: 'tests',
    step: '05',
    label: 'Tests',
    sub: 'unit · e2e',
    percent: 46,
    duration: 1500,
    about: 'Catch regressions before production. Fast unit tests first, then the end-to-end path.',
    log: [
      line('→ Running test suites', 'info', 100),
      line('✓ 214 unit tests passed · 2.4s', 'ok', 700),
      line('✓ 18 integration tests passed · 11.2s', 'ok', 1150),
      line('✓ TypeScript validation passed', 'ok', 1420),
    ],
  },
  {
    id: 'security',
    step: '06',
    label: 'Security scan',
    sub: 'deps · SAST',
    percent: 56,
    duration: 1200,
    about: 'Scan dependencies and application artefacts. Findings block the pipeline by policy, not by opinion.',
    log: [
      line('→ Scanning 1,284 dependencies', 'dim', 100),
      line('✓ Dependency scan · 0 critical · 0 high', 'ok', 680),
      line('✓ Static analysis · 0 high severity', 'ok', 980),
    ],
  },
  {
    id: 'docker',
    step: '07',
    label: 'Docker build',
    sub: 'image',
    percent: 66,
    duration: 1300,
    about:
      'Package the application consistently. Multi-stage builds keep the runtime image small and the toolchain out of production.',
    log: [
      line('→ docker buildx build --platform linux/amd64', 'dim', 100),
      line('✓ Layers cached · 4 steps', 'ok', 600),
      line('✓ Image built · 118 MB · sha256:9be41c7', 'ok', 1050),
    ],
  },
  {
    id: 'registry',
    step: '08',
    label: 'Registry',
    sub: 'ECR · GHCR',
    percent: 74,
    duration: 900,
    about: 'Store immutable, versioned application images. Deployment selects a version; it never rebuilds one.',
    log: [line('✓ Image pushed to registry · v1.4.2', 'ok', 380)],
  },
  {
    id: 'infrastructure',
    step: '09',
    label: 'Infrastructure',
    sub: 'Terraform',
    percent: 82,
    duration: 1300,
    about: 'Provision and manage cloud resources. Changes are planned and reviewed before they are applied.',
    log: [
      line('→ terraform plan', 'dim', 100),
      line('✓ Plan: 0 to add · 0 to change · 0 to destroy', 'ok', 780),
      line('✓ Provisioned · ECS service updated to v1.4.2', 'ok', 1120),
    ],
  },
  {
    id: 'deployment',
    step: '10',
    label: 'Deployment',
    sub: 'rollout',
    percent: 88,
    duration: 1200,
    about: 'Release the new version using the strategy chosen for this application. See production strategy below.',
    log: [
      line('→ Rolling update started · 3 tasks', 'info', 120),
      line('✓ Task 1/3 healthy · 1.4.2', 'ok', 620),
      line('✓ Task 2/3 healthy · 1.4.2', 'ok', 900),
      line('✓ Task 3/3 healthy · 1.4.2', 'ok', 1080),
    ],
  },
  {
    id: 'health',
    step: '11',
    label: 'Health checks',
    sub: '/healthz',
    percent: 94,
    duration: 1100,
    about:
      'Verify that the new deployment is actually healthy. A green rollout that fails here has not deployed — it has been caught.',
    log: [
      line('→ GET /healthz · 3 targets', 'dim', 100),
      line('✓ 200 · 41ms · database reachable', 'ok', 700),
    ],
  },
  {
    id: 'traffic',
    step: '12',
    label: 'Traffic',
    sub: 'load balancer',
    percent: 98,
    duration: 800,
    about: 'Expose the healthy deployment to users. Until this step the new version receives no real traffic.',
    log: [line('✓ Traffic switched · 100% → v1.4.2', 'ok', 340)],
  },
  {
    id: 'monitoring',
    step: '13',
    label: 'Monitoring',
    sub: 'observe',
    percent: 100,
    duration: 1000,
    about:
      'Observe the system after release. Logs, metrics and traces are what turn a deployment into an operable system.',
    log: [
      line('→ Arming dashboards and alerts', 'dim', 100),
      line('✓ OpenTelemetry pipeline receiving traces', 'ok', 560),
      line('✓ Error rate within threshold', 'ok', 840),
    ],
  },
];

export const failLog: LogLine[] = [
  line('✕ GET /healthz · 2 of 3 targets failing', 'error', 0),
  line('✕ Readiness probe timed out · 504', 'error', 420),
  line('! New deployment failed health check — halting rollout', 'error', 900),
];

export const rollbackLog: LogLine[] = [
  line('→ Rollback initiated', 'info', 0),
  line('→ Reverting task definitions to v1.4.1', 'dim', 400),
  line('✓ Task 1/3 healthy · v1.4.1', 'ok', 900),
  line('✓ Task 2/3 healthy · v1.4.1', 'ok', 1250),
  line('✓ Task 3/3 healthy · v1.4.1', 'ok', 1600),
  line('✓ Previous stable version restored', 'ok', 1950),
  line('✓ Production healthy · 100% traffic on v1.4.1', 'ok', 2250),
  line('$ rollback completed', 'cmd', 2500),
];

export const successLog: LogLine[] = [line('$ deployment successful', 'cmd', 0)];

export type Strategy = {
  id: string;
  name: string;
  summary: string;
  detail: string;
  tradeoff: string;
  when: string;
};

export const strategies: Strategy[] = [
  {
    id: 'rolling',
    name: 'Rolling',
    summary: 'Replace instances in batches.',
    detail:
      'Tasks are updated a few at a time, with the service still serving traffic throughout. Cheap and the default for stateless services.',
    tradeoff: 'Two versions run simultaneously, so the change must be backwards compatible with the version still in flight.',
    when: 'Default choice for stateless services where a brief version overlap is harmless.',
  },
  {
    id: 'blue-green',
    name: 'Blue / Green',
    summary: 'Two identical environments, one switch.',
    detail:
      'The new version is deployed to a full parallel environment, verified there, and traffic is switched atomically. Rollback is flipping the switch back.',
    tradeoff: 'Double the infrastructure cost while both environments exist, and a switch is all-or-nothing.',
    when: 'When a failed cutover must be recoverable in seconds, or the environment must be verified before users see it.',
  },
  {
    id: 'canary',
    name: 'Canary',
    summary: 'A small slice of traffic first.',
    detail:
      'The new version receives a small percentage of real traffic, with error rate and latency compared against the stable version before the rollout widens.',
    tradeoff: 'Needs production-like traffic to be meaningful, and requires the ability to compare two versions side by side.',
    when: 'When a regression would affect real users and the blast radius needs to start small.',
  },
  {
    id: 'rollback',
    name: 'Rollback',
    summary: 'The path back, defined in advance.',
    detail:
      'If health checks fail, traffic returns to the previous known-good version automatically. Immutable, versioned images are what make this fast.',
    tradeoff: 'Only as fast as the previous artefact being available and the deployment being reversible — destructive migrations break that guarantee.',
    when: 'Always. A strategy without a rehearsed rollback is not a strategy.',
  },
];

/* -------------------------------------------------------------------------- */
/* Observability                                                              */
/* -------------------------------------------------------------------------- */

export type Metric = {
  id: string;
  label: string;
  unit: string;
  /** Human-readable stable value once the deployment settles. */
  settled: string;
  /** Polarity used to pick a restrained status colour. */
  tone: 'neutral' | 'good';
  seed: number;
};

export const metrics: Metric[] = [
  { id: 'cpu', label: 'CPU', unit: '%', settled: '38', tone: 'neutral', seed: 17 },
  { id: 'memory', label: 'Memory', unit: '%', settled: '61', tone: 'neutral', seed: 41 },
  { id: 'rps', label: 'Request rate', unit: 'rps', settled: '1,240', tone: 'neutral', seed: 73 },
  { id: 'latency', label: 'Latency p95', unit: 'ms', settled: '142', tone: 'good', seed: 29 },
  { id: 'errors', label: 'Error rate', unit: '%', settled: '0.02', tone: 'good', seed: 53 },
];

export const referenceArchitecture = {
  note: 'One example of how these pieces fit together. The actual topology for a project is designed against its load, budget and risk — this is a reference, not a prescription.',
  flows: [
    {
      id: 'delivery',
      title: 'Delivery path',
      caption: 'A commit becomes a versioned image, and the image is selected — never rebuilt.',
      direction: 'right' as const,
      nodes: [
        { id: 'd1', label: 'Developer', sub: 'pull request' },
        { id: 'd2', label: 'GitHub', sub: 'source of truth' },
        { id: 'd3', label: 'GitHub Actions', sub: 'CI', emphasis: true },
        { id: 'd4', label: 'Docker', sub: 'multi-stage build' },
        { id: 'd5', label: 'ECR / GHCR', sub: 'immutable image', emphasis: true },
        { id: 'd6', label: 'AWS ECS / EKS', sub: 'task definitions' },
        { id: 'd7', label: 'Load balancer', sub: 'health checks' },
        { id: 'd8', label: 'Application', sub: 'v1.4.2', emphasis: true },
        { id: 'd9', label: 'Database', sub: 'RDS · Postgres' },
      ],
    },
    {
      id: 'observability',
      title: 'Observability path',
      caption: 'Every release emits signals. If they are not wired on day one, they never get wired.',
      direction: 'right' as const,
      nodes: [
        { id: 'o1', label: 'Application', sub: 'instrumented' },
        { id: 'o2', label: 'OpenTelemetry', sub: 'traces + spans', emphasis: true },
        { id: 'o3', label: 'CloudWatch', sub: 'metrics + logs' },
        { id: 'o4', label: 'Grafana', sub: 'dashboards' },
        { id: 'o5', label: 'Prometheus', sub: 'scrape + rules' },
        { id: 'o6', label: 'Alerts', sub: 'pager + Slack', emphasis: true },
      ],
    },
  ],
};

export const closing = {
  title: 'Deployment is only the beginning.',
  body: 'I build systems that can be deployed, observed, maintained and scaled — because a system nobody can operate is not finished, it is abandoned.',
  cta: "Let's build yours.",
} as const;

export const failureClosing = {
  title: 'Production engineering includes the bad day.',
  body: 'A deployment that cannot fail back to safety is a deployment that will eventually take the site down. Designing the rollback is designing the system.',
  cta: 'Talk about reliability',
} as const;
