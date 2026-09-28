export type Service = {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  capabilities: string[];
  deliverables: string[];
  /** Links to a representative case study, when one exists. */
  proof?: { slug: string; label: string };
};

export const services: Service[] = [
  {
    id: 'ai-product-engineering',
    index: '01',
    title: 'AI Product Engineering',
    shortTitle: 'AI products',
    summary: 'Build AI-powered products from idea to production — not a demo that dies in a notebook.',
    description:
      'An AI feature is only a product once it is fast enough, cheap enough, evaluable and safe to put in front of a user. That work spans retrieval, model selection, prompt architecture, evaluation, latency and cost control — and it is where most AI prototypes fail. I build the whole path, including the parts that make it boring in the best way.',
    capabilities: [
      'LLM API integration',
      'RAG and retrieval pipelines',
      'AI agents and tool use',
      'AI search and semantic retrieval',
      'Document intelligence and extraction',
      'Structured output and validation',
      'Workflow automation',
      'Local and on-device inference',
      'Model routing and cost control',
      'Evaluation and guardrails',
    ],
    deliverables: [
      'Reference architecture and a scoped delivery plan',
      'Working end-to-end feature set, not isolated demos',
      'Retrieval and prompt design with a written rationale',
      'Evaluation set and regression checks',
      'Cost and latency budget for the shipped behaviour',
    ],
    proof: { slug: 'jiangsu-national-nickel', label: 'Jiangsu National Nickel — international B2B catalogue' },
  },
  {
    id: 'full-stack-product-development',
    index: '02',
    title: 'Full-Stack Product Development',
    shortTitle: 'Full-stack',
    summary: 'Production-ready applications — typed, accessible, authenticated and actually usable.',
    description:
      'The application layer: product interface, business logic, data model, authentication, billing, and the admin surface that keeps the business running. Built as a codebase someone else can pick up, with Server Components where they help, deliberate client boundaries, and validation that lives at the server edge.',
    capabilities: [
      'Next.js and React',
      'TypeScript end to end',
      'Node.js and Python services',
      'API design and integration',
      'PostgreSQL and MongoDB',
      'Authentication and authorisation',
      'Payments and subscriptions',
      'Dashboards and admin tooling',
      'SaaS multi-tenant foundations',
      'Accessibility and internationalisation',
    ],
    deliverables: [
      'Data model and API contract before implementation',
      'Typed, validated boundaries between client, server and data',
      'Authentication and a working admin surface',
      'Responsive, keyboard-accessible interface',
      'Deployment configuration and run documentation',
    ],
    proof: { slug: 'paatam', label: 'PAATAM — bilingual learning platform' },
  },
  {
    id: 'cloud-devops',
    index: '03',
    title: 'Cloud & DevOps',
    shortTitle: 'Cloud & DevOps',
    summary: 'Deploy and operate applications on AWS or GCP, from first instance to production traffic.',
    description:
      'Infrastructure that is declared rather than clicked into existence. Networks, compute, containers, Kubernetes, Terraform, and a pipeline where a merge becomes a reviewable plan and an apply becomes a versioned change. The goal is an environment that another engineer can operate without asking you first.',
    capabilities: [
      'AWS and GCP architecture',
      'VPC and network design',
      'Docker and containerisation',
      'Kubernetes and EKS',
      'Terraform and CloudFormation',
      'CI/CD with GitHub Actions and Jenkins',
      'GitOps with Argo CD',
      'Load balancing and auto scaling',
      'Secrets and access management',
      'Backup and disaster recovery',
    ],
    deliverables: [
      'Infrastructure as Code in a reviewed repository',
      'CI/CD pipeline with automated checks and gated applies',
      'Deployment strategy matched to the application’s risk',
      'Documented network topology and access model',
      'A runbook for the failure modes that matter',
    ],
    proof: { slug: 'terraform-aws-production', label: 'AWS production infrastructure' },
  },
  {
    id: 'production-engineering',
    index: '04',
    title: 'Production Engineering',
    shortTitle: 'Production',
    summary: 'Make an existing system reliable, observable and cheaper to run.',
    description:
      'Most production problems are not bugs. They are systems with no visibility, no ceiling on load, and a cloud bill nobody owns. This work is about finding that out before the users find it for you: instrument the system, put a floor under its failure modes, then fix what the data points at.',
    capabilities: [
      'Observability and instrumentation',
      'Structured logging and tracing',
      'Metrics, dashboards and alerting',
      'Performance profiling and optimisation',
      'Load and capacity planning',
      'Reliability and failure-mode analysis',
      'Security hardening',
      'Cloud cost optimisation',
      'Zero-downtime deployment strategy',
      'Incident response and postmortems',
    ],
    deliverables: [
      'A written reliability assessment with ranked findings',
      'Dashboards and alerts that page on real problems',
      'Performance work measured before and after',
      'A deployment and rollback strategy for your system',
      'A cost review with concrete savings identified',
    ],
    proof: { slug: 'gitops-delivery-pipeline', label: 'GitOps delivery pipeline' },
  },
  {
    id: 'ongoing-engineering',
    index: '05',
    title: 'Ongoing Engineering',
    shortTitle: 'Ongoing',
    summary: 'A technical partner for the teams who need engineering capacity on demand.',
    description:
      'The most valuable engagement is often the one that starts before a project and stays after it. Feature work, infrastructure, incident support and architecture review, delivered inside a predictable monthly rhythm so there is always a known owner for the system.',
    capabilities: [
      'Feature development',
      'Infrastructure maintenance',
      'Incident and production support',
      'Technical debt reduction',
      'Architecture review and advice',
      'Code review and engineering standards',
      'Release and release-notes discipline',
      'Documentation and handover',
    ],
    deliverables: [
      'A monthly plan agreed in advance',
      'A predictable capacity block rather than hourly billing',
      'Engineering decisions written down',
      'Priority handled when something breaks',
      'A handover that does not depend on me being around',
    ],
  },
];

export const problemStages = [
  { id: 'idea', label: 'Idea', note: 'Validated problem, unclear shape' },
  { id: 'code', label: 'Code', note: 'Features built, architecture assumed' },
  { id: 'deployment', label: 'Deployment', note: 'The first environment that matters' },
  { id: 'infrastructure', label: 'Infrastructure', note: 'Networks, compute, data' },
  { id: 'monitoring', label: 'Monitoring', note: 'Knowing before the users tell you' },
  { id: 'scaling', label: 'Scaling', note: 'Holding up under real load' },
] as const;

export const problemGaps = [
  {
    title: 'Nothing runs where it should',
    detail:
      'Environments configured by hand, one engineer able to deploy, and a staging environment that no longer resembles production.',
  },
  {
    title: 'Pipelines fail for the wrong reason',
    detail:
      'A red build means something — but nobody can tell whether it is a test, a dependency, a flaky network or a runner that ran out of disk.',
  },
  {
    title: 'Deployments are events',
    detail:
      'Every release is a small, high-stakes, out-of-hours occasion. That is a signal about the deployment process, not about the team.',
  },
  {
    title: 'Problems are discovered by users',
    detail:
      'No alerts, no traces, no error tracking — so the first notification of an outage is a support email or a one-star review.',
  },
  {
    title: 'Growth is expensive and slow',
    detail:
      'Traffic doubles and the architecture does not. The easy fix is a bigger instance, and the bill grows faster than the product.',
  },
  {
    title: 'Security is a later problem',
    detail:
      'Secrets in environment files, no dependency scanning, no review of what is exposed. Fine until the first audit or incident.',
  },
];
