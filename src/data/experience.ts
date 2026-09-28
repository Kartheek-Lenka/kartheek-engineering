export type ExperienceEntry = {
  id: string;
  organisation: string;
  role: string;
  start: string;
  end: string | null;
  location: string;
  type: 'employment' | 'engagement';
  summary: string;
  focus: string[];
  /** Verifiable public reference, where one exists. */
  reference?: { label: string; href: string };
};

export const experience: ExperienceEntry[] = [
  {
    id: 'devops-engineer',
    organisation: 'GrowthSchool',
    role: 'DevOps Engineer',
    start: '2024',
    end: null,
    location: 'Bengaluru, India',
    type: 'employment',
    summary:
      'Platform and infrastructure engineering on production systems, with a working focus on CI/CD, AWS, Docker, Kubernetes and infrastructure as code. Deepening Terraform and advanced AWS architecture alongside production delivery work.',
    focus: [
      'CI/CD pipeline design and maintenance',
      'AWS infrastructure and architecture',
      'Docker, Kubernetes and container platforms',
      'Terraform and infrastructure as code',
      'Production deployments and reliability',
    ],
    reference: { label: 'GitHub profile', href: 'https://github.com/Kartheek-Lenka' },
  },
  {
    id: 'infosys',
    organisation: 'Infosys Limited',
    role: 'Software Engineer',
    start: '2022',
    end: null,
    location: 'India',
    type: 'employment',
    summary:
      'Built and scaled enterprise-grade web applications with a focus on performance, security and user experience. Where the fundamentals of production software were learned — enterprise code review, release discipline and systems that other engineers have to maintain.',
    focus: [
      'Enterprise web application development',
      'Performance and security',
      'Code review and release discipline',
      'Cross-team technical collaboration',
    ],
  },
  {
    id: 'independent',
    organisation: 'Independent',
    role: 'Product & Full-Stack Engineer',
    start: '2021',
    end: null,
    location: 'Remote · India',
    type: 'engagement',
    summary:
      'Independent product work across AI, full-stack and cloud — taking projects from a rough idea through architecture, implementation and deployment. This is the practice that most directly serves clients today.',
    focus: [
      'AI product engineering',
      'Full-stack application development',
      'Cloud architecture and deployment',
      'Technical scoping and estimation',
    ],
    reference: { label: 'Public repositories', href: 'https://github.com/Kartheek-Lenka' },
  },
];

export type Credential = {
  id: string;
  label: string;
  issuer: string;
  year: string;
  detail: string;
  verified: 'verified' | 'self-reported';
  href?: string;
};

/**
 * Only items that can be substantiated are listed. Anything unverified is marked
 * as such and rendered with a "self-reported" label rather than omitted quietly,
 * so the trust surface of the page is legible.
 */
export const credentials: Credential[] = [
  {
    id: 'gemma-hackathon',
    label: 'Gemma 4 Good Hackathon',
    issuer: 'Kaggle · Google AI',
    year: '2026',
    detail:
      'Built KisanLens AI, an offline multimodal crop-disease diagnosis product, as an entry in the hackathon.',
    verified: 'self-reported',
    href: 'https://www.kaggle.com/competitions/gemma-4-good-hackathon',
  },
  {
    id: 'genai-skills-boost',
    label: 'Generative AI',
    issuer: 'Google Cloud Skills Boost',
    year: '2025',
    detail: 'Applied generative AI fundamentals — prompting, grounding and applied AI problem-solving.',
    verified: 'self-reported',
  },
  {
    id: 'framer-recognition',
    label: 'Framer recognition',
    issuer: 'Framer',
    year: '2025',
    detail:
      'A site built for a watch brand was featured in Framer’s gallery. Ask for the reference and award details directly.',
    verified: 'self-reported',
  },
];

/** Factual, verifiable signals only. No invented metrics. */
export const trustSignals = [
  { value: '3+', label: 'Years in professional software engineering', detail: 'Since 2022' },
  { value: 'AWS', label: 'Production cloud infrastructure', detail: 'VPC, EC2, ALB, ASG, RDS, S3' },
  { value: 'K8s', label: 'Containers and orchestration', detail: 'Docker, Kubernetes, EKS' },
  { value: 'IaC', label: 'Infrastructure as code', detail: 'Terraform, CloudFormation' },
  { value: 'CI/CD', label: 'Automated delivery pipelines', detail: 'GitHub Actions, Jenkins, GitOps' },
  { value: 'AI', label: 'AI product engineering', detail: 'RAG, agents, local inference' },
] as const;

export const capabilitiesLine = [
  'AI',
  'FULL-STACK',
  'CLOUD',
  'DEVOPS',
  'PRODUCTION',
] as const;

export const globalFacts = [
  {
    label: 'Remote by default',
    detail: 'No office, no relocation. Work happens asynchronously and lands in your timezone.',
  },
  {
    label: 'Async-friendly',
    detail: 'Written decisions, documented handovers and status that does not require a meeting to read.',
  },
  {
    label: 'International projects',
    detail: 'Client work across Europe, North America, the Middle East, South-East Asia and India.',
  },
  {
    label: 'Timezone overlap',
    detail: 'IST (UTC+5:30) with a working window that overlaps the UK, EU and US mornings.',
  },
  {
    label: 'Multiple currencies',
    detail: 'Quoted in USD, with EUR, GBP and INR shown for budgeting.',
  },
  {
    label: 'English-first documentation',
    detail: 'Proposals, runbooks and handovers written to be read by an international team.',
  },
] as const;
