export type TechGroup = {
  id: string;
  label: string;
  note: string;
  items: { name: string; level?: 'primary' | 'working' }[];
};

/**
 * Grouped capability, not a logo wall. Positioned as capability areas rather
 * than an inventory, and deliberately technology-agnostic in tone: the product
 * determines the stack.
 */
export const techGroups: TechGroup[] = [
  {
    id: 'product',
    label: 'Product',
    note: 'Interfaces and application layers',
    items: [
      { name: 'Next.js', level: 'primary' },
      { name: 'React', level: 'primary' },
      { name: 'TypeScript', level: 'primary' },
      { name: 'Node.js', level: 'primary' },
      { name: 'Python', level: 'primary' },
      { name: 'Tailwind CSS' },
      { name: 'React Native' },
      { name: 'Flutter' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    note: 'Storage, retrieval and caching',
    items: [
      { name: 'PostgreSQL', level: 'primary' },
      { name: 'MongoDB', level: 'primary' },
      { name: 'Redis' },
      { name: 'Prisma', level: 'primary' },
      { name: 'ChromaDB' },
      { name: 'Vector search' },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    note: 'Model integration and orchestration',
    items: [
      { name: 'LLM APIs', level: 'primary' },
      { name: 'RAG', level: 'primary' },
      { name: 'AI agents' },
      { name: 'Vector search' },
      { name: 'AI workflows', level: 'primary' },
      { name: 'LangChain' },
      { name: 'Gemma / Llama' },
      { name: 'Ollama' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    note: 'Where it runs, and how it is defined',
    items: [
      { name: 'AWS', level: 'primary' },
      { name: 'GCP' },
      { name: 'Docker', level: 'primary' },
      { name: 'Kubernetes', level: 'primary' },
      { name: 'Terraform', level: 'primary' },
      { name: 'CloudFormation' },
      { name: 'Linux' },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    note: 'From commit to running, and after',
    items: [
      { name: 'GitHub Actions', level: 'primary' },
      { name: 'CI/CD', level: 'primary' },
      { name: 'Argo CD' },
      { name: 'Jenkins' },
      { name: 'Monitoring' },
      { name: 'Observability', level: 'primary' },
      { name: 'OpenTelemetry' },
      { name: 'Grafana' },
    ],
  },
];

export const processSteps = [
  {
    index: '01',
    id: 'discover',
    title: 'Discover',
    headline: 'Understand the business problem.',
    detail:
      'Before any code: who uses this, what decision does it change, what does success look like, and what happens if it is late. Most projects that fail were mis-scoped, not mis-built.',
    outputs: ['Problem statement', 'Success criteria', 'Scope and constraints', 'Risk register'],
  },
  {
    index: '02',
    id: 'architect',
    title: 'Architect',
    headline: 'Define product and technical architecture.',
    detail:
      'Data model, boundaries, integrations, deployment topology and the failure modes worth designing for. Written down before implementation, so the build is an execution of a decision rather than a series of them.',
    outputs: ['Data model', 'API contract', 'System diagram', 'Deployment plan'],
  },
  {
    index: '03',
    id: 'build',
    title: 'Build',
    headline: 'Develop with AI assistance and human review.',
    detail:
      'AI-assisted implementation inside a review culture: every change is read, tested and type-checked by a human who owns the design. The model accelerates the work; the judgement stays with the engineer.',
    outputs: ['Reviewed pull requests', 'Automated tests', 'Type and lint gates'],
  },
  {
    index: '04',
    id: 'ship',
    title: 'Ship',
    headline: 'CI/CD, infrastructure, security and deployment.',
    detail:
      'A pipeline where a merge is validated automatically, infrastructure is declared in code, and a release is a versioned change with a defined rollback. The first deploy should be boring.',
    outputs: ['Pipeline with gates', 'Infrastructure as code', 'Deployment and rollback plan'],
  },
  {
    index: '05',
    id: 'operate',
    title: 'Operate',
    headline: 'Monitoring, reliability, performance and maintenance.',
    detail:
      'Instrumented from the first deploy. Alerts that page on real problems, error tracking that groups by cause, and a runbook for the failures you cannot afford to improvise through.',
    outputs: ['Dashboards and alerts', 'Error tracking', 'Runbook'],
  },
  {
    index: '06',
    id: 'scale',
    title: 'Scale',
    headline: 'Improve the system as the product grows.',
    detail:
      'Capacity, cost and architecture revisited against real usage rather than projected usage. What gets optimised is decided by measurement, in the order the measurements point to.',
    outputs: ['Capacity review', 'Cost optimisation', 'Architecture evolution'],
  },
] as const;

export const aiWorkflow = [
  { id: 'problem', label: 'Human problem', detail: 'A person frames the actual problem' },
  { id: 'architecture', label: 'Architecture', detail: 'A person decides the system' },
  { id: 'implementation', label: 'AI-assisted build', detail: 'Faster first drafts, scaffold, boilerplate' },
  { id: 'review', label: 'Code review', detail: 'A human reads every line that ships' },
  { id: 'testing', label: 'Testing', detail: 'Behaviour is asserted, not assumed' },
  { id: 'security', label: 'Security', detail: 'Scanning and threat review' },
  { id: 'deployment', label: 'Deployment', detail: 'Gated, reversible, automated' },
  { id: 'monitoring', label: 'Monitoring', detail: 'Production behaviour observed' },
] as const;

export const aboutFacts = [
  { label: 'Discipline', value: 'AI product, full-stack, cloud' },
  { label: 'Engineering since', value: '2022' },
  { label: 'Based in', value: 'India · working globally' },
  { label: 'Working style', value: 'Async-first, written decisions' },
] as const;

export const workPrinciples = [
  {
    index: '01',
    title: 'Own the whole lifecycle',
    detail:
      'Architecture, implementation, deployment and operation. Handing over an undocumented system is not finishing the work.',
  },
  {
    index: '02',
    title: 'Decisions in writing',
    detail:
      'Architecture choices are recorded with their tradeoffs, so the reasoning survives the person who made it.',
  },
  {
    index: '03',
    title: 'Measure before optimising',
    detail:
      'Performance and cost work starts with a measurement. Guessing where the bottleneck is wastes more time than the bottleneck.',
  },
  {
    index: '04',
    title: 'Boring where boring is correct',
    detail:
      'A predictable architecture that a second engineer can operate beats an elegant one that only you understand.',
  },
  {
    index: '05',
    title: 'No fabricated proof',
    detail:
      'No invented metrics, invented clients or invented testimonials. Work is shown, with its sources.',
  },
  {
    index: '06',
    title: 'Say when something is a bad idea',
    detail:
      'Including when it is the client’s idea. The value of an engineering partner is partly disagreement that arrives early and cheaply.',
  },
] as const;
