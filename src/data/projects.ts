/**
 * Case study content model.
 *
 * RULES FOR FUTURE EDITS
 * ----------------------
 * 1. Only state facts that can be verified from a public source. Every project
 *    with a public repository lists it under `sources`, and those links are
 *    rendered on the case study page as a "Sources" block.
 * 2. `result` must describe what was actually built and verified — not a
 *    business outcome you cannot evidence. If you later obtain permission to
 *    publish metrics, add them to `outcomes` and cite the source.
 * 3. `confidential: true` projects must never contain client-identifying detail,
 *    screenshots, or metrics. They render a disclosure notice instead of an
 *    architecture diagram.
 * 4. Entries with `disclosure: 'placeholder'` are awaiting input. Do not
 *    publish invented content to fill them — see TODO_CONTENT.md.
 */

export type ProjectLink = {
  label: string;
  href: string;
  kind: 'live' | 'source';
};

export type Source = {
  label: string;
  href: string;
};

export type ArchitectureNode = {
  id: string;
  label: string;
  sub?: string;
  emphasis?: boolean;
};

export type ArchitectureFlow = {
  id: string;
  title: string;
  caption: string;
  direction: 'down' | 'right';
  nodes: ArchitectureNode[];
};

export type Challenge = {
  title: string;
  detail: string;
};

export type Decision = {
  title: string;
  detail: string;
  tradeoff?: string;
};

export type StackGroup = {
  group: string;
  items: string[];
};

export type Outcome = {
  label: string;
  value: string;
  detail?: string;
};

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  category: string;
  year: string;
  period?: string;
  client: string;
  summary: string;
  abstract: string;
  tags: string[];
  role: string;
  roleDetail: string;
  team?: string;
  featured: boolean;
  confidential?: boolean;
  disclosure?: 'placeholder';
  problem: string;
  context?: string;
  built: string[];
  architecture?: {
    summary: string;
    flows: ArchitectureFlow[];
    notes: string[];
  };
  stack: StackGroup[];
  challenges: Challenge[];
  decisions: Decision[];
  before?: { label: string; items: string[] };
  after?: { label: string; items: string[] };
  outcomes: Outcome[];
  result: string;
  resultNote?: string;
  lessons?: string[];
  links: ProjectLink[];
  sources: Source[];
  updatedAt: string;
};

export const projects: Project[] = [
  /* ------------------------------------------------------------------ 01 */
  {
    slug: 'paatam',
    title: 'PAATAM',
    kicker: 'A source-first learning platform for Indian government examinations',
    category: 'SaaS · Education platform',
    year: '2026',
    period: 'August – September 2026',
    client: 'Independent product',
    summary:
      'A bilingual (English / Telugu) preparation platform for UPSC, SSC, APPSC and TSPSC that refuses to publish anything it cannot trace to an official source.',
    abstract:
      'PAATAM is a production-shaped learning platform built around a strict fact-verification policy: content only reaches a learner after it has been checked against an official source. The hard part was never the UI — it was building a content pipeline that keeps unverified material out of the database, and a syllabus tree deep enough to hold a full exam without turning into a document store.',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'PostgreSQL', 'Prisma 7', 'Tailwind v4', 'Docker'],
    role: 'Product engineer — architecture, data model, auth, content pipeline',
    roleDetail:
      'Sole engineer. Designed the relational model, the bilingual routing strategy, the signed-cookie session layer and the staged content pipeline; implemented the application and its verification workflow end to end.',
    team: 'Solo build',
    featured: true,
    problem:
      'Indian competitive-exam preparation is dominated by unstructured, untraceable content. Question banks repeat invented questions, dates drift, cutoffs are copied between teachers, and a learner cannot tell whether a fact is authoritative or folkloric. The result is hours of study spent on material that turns out to be wrong, and no way to check.',
    context:
      'The platform treats "source of truth" as a data-model problem rather than an editorial one. Every syllabus node, concept, fact and question carries provenance, and the publishing pipeline has an explicit review gate. Nothing is learner-visible until it clears validation.',
    built: [
      'Syllabus engine: an expandable Paper → Subject → Topic → Subtopic → Concept tree with versioned syllabus data, so a curriculum change does not invalidate a learner’s progress.',
      'Concept pages grounded in primary sources — Indian Polity, the Constitution, Fundamental Rights, Articles 14 / 19 / 21 — each with why it matters, core text, worked examples, common confusions and memory hooks, plus an NCERT reference.',
      'Original practice questions labelled as original and linked to the concepts they test, wired into a mock test rather than a shuffled static bank.',
      'A staged content pipeline (discover → fetch → parse → map → validate → review → publish) where content is a versioned artefact with a human review step, not a hand-edited row.',
      'Bilingual delivery with next-intl across English and Telugu, including localised content fields rather than duplicated records.',
      'Custom session layer: HMAC-SHA256 signed cookies with bcrypt password hashing — no third-party auth dependency to reason about.',
      'Request-level validation with zod and a typed Prisma data layer running against PostgreSQL in Docker.',
    ],
    architecture: {
      summary:
        'A single Next.js application owns the reading experience; the content pipeline runs as scheduled jobs that write through a verification gate before anything becomes learner-visible. Prisma 7 talks to PostgreSQL through a driver adapter, and the whole stack boots from one compose file.',
      flows: [
        {
          id: 'request',
          title: 'Learner request path',
          caption:
            'Server Components fetch straight from the database. No client-side data waterfall, no duplicated cache layer.',
          direction: 'down',
          nodes: [
            { id: 'l1', label: 'Learner', sub: 'en / te' },
            { id: 'l2', label: 'Next.js App Router', sub: 'RSC by default' },
            { id: 'l3', label: 'Session layer', sub: 'HMAC-SHA256 cookie', emphasis: true },
            { id: 'l4', label: 'zod validation', sub: 'server boundary' },
            { id: 'l5', label: 'Prisma 7 client', sub: 'driver adapter' },
            { id: 'l6', label: 'PostgreSQL 16', sub: 'versioned syllabus tree' },
          ],
        },
        {
          id: 'pipeline',
          title: 'Content verification pipeline',
          caption:
            'Six stages between a candidate source and a published concept. The review stage is not optional.',
          direction: 'right',
          nodes: [
            { id: 'c1', label: 'Discover', sub: 'source registry' },
            { id: 'c2', label: 'Fetch', sub: 'raw capture' },
            { id: 'c3', label: 'Parse', sub: 'normalised draft' },
            { id: 'c4', label: 'Map', sub: 'to concepts' },
            { id: 'c5', label: 'Validate', sub: 'automated checks' },
            { id: 'c6', label: 'Review', sub: 'human gate', emphasis: true },
            { id: 'c7', label: 'Publish', sub: 'learner-visible' },
          ],
        },
      ],
      notes: [
        'Content is never written directly into a learner-facing table. It lands in draft, and publishing is a separate, auditable transition.',
        'Syllabus versions mean a curriculum change is a new version, not a destructive edit of a learner’s history.',
        'Prisma 7 conventions are respected: the datasource URL lives in prisma.config.ts and the client is constructed with a driver adapter.',
      ],
    },
    stack: [
      {
        group: 'Product',
        items: ['Next.js 16 (App Router)', 'React 19', 'TypeScript 5.9', 'Tailwind CSS v4', 'Motion'],
      },
      { group: 'Data', items: ['PostgreSQL 16', 'Prisma 7', 'Zod'] },
      {
        group: 'Platform',
        items: ['Docker', 'next-intl', 'HMAC-SHA256 sessions', 'bcryptjs'],
      },
    ],
    challenges: [
      {
        title: 'Making “verified” a property of the data, not a promise',
        detail:
          'A disclaimer in the footer is worthless. Verification had to be structural: provenance travels with the record, publishing is a state transition, and the review step is a job stage that cannot be skipped. Once a concept is published, the system can still answer where every sentence came from.',
      },
      {
        title: 'A syllabus is a tree, not a document',
        detail:
          'Exams nest four to five levels deep and get revised between cycles. Modelling that as free-form content would have made every syllabus change a rewrite. A normalised node tree with explicit versions made the syllabus queryable, diffable and safe to change.',
      },
      {
        title: 'Bilingual content without duplicate records',
        detail:
          'A translation-shaped schema (one row per language) doubles the write path and guarantees drift. Localising the translatable fields on a single record keeps a concept and its translation atomically consistent, so a partially-translated concept is not representable.',
      },
    ],
    decisions: [
      {
        title: 'Signed cookie sessions instead of an auth framework',
        detail:
          'The session payload is small and fully understood, so a dependency that hides the signing behaviour is a liability rather than a convenience. HMAC-SHA256 signed cookies keep the trust boundary visible and auditable.',
        tradeoff:
          'No built-in session store, so revocation is stateless. Acceptable here; a system needing forced logout would add a server-side session table.',
      },
      {
        title: 'Prisma 7 with an explicit driver adapter',
        detail:
          'Following the Prisma 7 conventions rather than the Prisma 6 muscle memory: the datasource URL is configured in prisma.config.ts and the client is constructed with PrismaPg. Connection handling stays explicit and visible in the codebase.',
        tradeoff: 'A little more setup than the legacy initialisation, in exchange for a forward-compatible target.',
      },
      {
        title: 'Original practice questions, clearly labelled',
        detail:
          'Rather than reproducing past-paper questions of uncertain provenance, PAATAM generates original questions and labels them as original practice, grounded in the concept they test. It is a smaller bank, and it is defensible.',
        tradeoff: 'Less content volume, and no illusion of exam-pattern fidelity.',
      },
    ],
    before: {
      label: 'The preparation problem',
      items: [
        'Facts with no traceable source',
        'Invented or recycled “previous year” questions',
        'Dates and cutoffs copied between teachers',
        'No way for a learner to verify a claim',
        'Syllabus revisions handled by re-printing notes',
      ],
    },
    after: {
      label: 'How the platform behaves',
      items: [
        'Every published concept carries its source',
        'Original questions labelled as original, linked to concepts',
        'Syllabus as a versioned tree, not a document',
        'Publish is an auditable transition, not a database write',
        'One record per concept, translations on the record',
      ],
    },
    outcomes: [
      { label: 'Stack', value: 'Next.js 16 · React 19 · TS 5.9' },
      { label: 'Locales', value: 'English · తెలుగు' },
      { label: 'Pipeline stages', value: '7', detail: 'discover → publish' },
      { label: 'Auth', value: 'HMAC-SHA256 cookies' },
    ],
    result:
      'The baseline is complete and verifiable: type checking, linting and the production build all pass, and the database is seeded with a real connected vertical slice — an APPSC Group II exam, its syllabus tree, grounded Fundamental Rights concepts, and an original mock test — so every core screen renders live data rather than fixtures.',
    resultNote:
      'Reported from the project status in the public repository. No adoption or revenue figures are claimed.',
    lessons: [
      'Trust features are usually data-model features wearing a marketing hat.',
      'A “verified” claim without a review gate in the pipeline is a marketing claim.',
      'Versioning the syllabus was cheaper than the alternative of migrating learner progress later.',
    ],
    links: [
      { label: 'Live application', href: 'https://paatam.vercel.app', kind: 'live' },
      { label: 'Source', href: 'https://github.com/Kartheek-Lenka/paatam', kind: 'source' },
    ],
    sources: [
      { label: 'Public repository', href: 'https://github.com/Kartheek-Lenka/paatam' },
      { label: 'Deployed application', href: 'https://paatam.vercel.app' },
    ],
    updatedAt: '2026-09-02',
  },

  /* ------------------------------------------------------------------ 02 */
  {
    slug: 'terraform-aws-production',
    title: 'AWS production infrastructure',
    kicker: 'A production-shaped AWS topology defined entirely in code',
    category: 'Cloud infrastructure · IaC',
    year: '2026',
    period: 'March 2026',
    client: 'Reference implementation',
    summary:
      'VPC, subnets, an application load balancer, an auto scaling group behind a bastion host and a NAT gateway — defined in HCL modules and applied through CI.',
    abstract:
      'This is the infrastructure counterpart to the product work: a repeatable AWS topology where nothing is created by hand in the console. The interesting decisions are the boring ones — private subnets, a bastion for SSH, NAT for egress — and they are the decisions that decide whether a system is operable by a second person.',
    tags: ['Terraform', 'AWS', 'VPC', 'ALB', 'Auto Scaling', 'Nginx', 'GitHub Actions'],
    role: 'Cloud engineer — network design, IaC modules, CI/CD wiring',
    roleDetail:
      'Designed the network topology, wrote the Terraform modules, and wired a GitHub Actions pipeline to plan and apply changes.',
    team: 'Solo build',
    featured: false,
    problem:
      'Most application infrastructure drifts. A security group is opened by hand during an incident, a subnet is resized in the console, an instance is replaced with a hand-built one, and the environment stops matching the code that supposedly describes it. The result is an outage during a routine change, and nobody can say what the system actually is.',
    context:
      'The exercise was to build a production-shaped topology on AWS with Infrastructure as Code, and to make the pipeline able to apply it. The design follows the standard three-tier separation: public edge, private compute, private data — with the only human entry point being a bastion host.',
    built: [
      'A custom VPC with distinct public and private subnets across availability zones.',
      'An application load balancer with a target group in front of the compute tier.',
      'An auto scaling group of private EC2 instances, so capacity is not a manual decision.',
      'A bastion host as the single controlled SSH entry point into the private network.',
      'A NAT gateway giving private instances outbound internet access without exposing them inbound.',
      'Nginx as the application server on the private instances.',
      'Terraform modules split by concern — vpc, ec2, alb, bastion, rds — with a remote backend and separated variables and outputs.',
      'A GitHub Actions pipeline that plans before it applies.',
    ],
    architecture: {
      summary:
        'One ALB in the public subnets terminates client traffic and forwards to an auto scaling group in the private subnets. Instances reach the internet only through the NAT gateway; operators reach the instances only through the bastion. The database tier sits in private subnets with no public route at all.',
      flows: [
        {
          id: 'runtime',
          title: 'Runtime request and access path',
          caption:
            'Exactly one public entry point for clients, and exactly one for operators. Everything else is private.',
          direction: 'down',
          nodes: [
            { id: 'i1', label: 'Internet' },
            { id: 'i2', label: 'Application Load Balancer', sub: 'public subnets', emphasis: true },
            { id: 'i3', label: 'Target group', sub: 'health checks' },
            { id: 'i4', label: 'Auto Scaling Group', sub: 'private EC2 + Nginx' },
            { id: 'i5', label: 'NAT gateway', sub: 'egress only' },
            { id: 'i6', label: 'Operator', sub: 'via bastion host', emphasis: true },
          ],
        },
        {
          id: 'delivery',
          title: 'Change path',
          caption: 'A merge becomes a plan, a plan becomes reviewed output, an apply becomes a new environment.',
          direction: 'right',
          nodes: [
            { id: 'd1', label: 'Git push' },
            { id: 'd2', label: 'GitHub Actions' },
            { id: 'd3', label: 'terraform fmt' },
            { id: 'd4', label: 'terraform validate', emphasis: true },
            { id: 'd5', label: 'terraform plan' },
            { id: 'd6', label: 'Review output' },
            { id: 'd7', label: 'terraform apply', emphasis: true },
          ],
        },
      ],
      notes: [
        'Nothing in this topology is created by hand in the console, which is what makes it reviewable and repeatable.',
        'Private instances can make outbound calls (package installs, API calls) without ever accepting an inbound connection.',
        'The plan output is the review artefact. Applying a change nobody read is the failure mode this pipeline is designed to prevent.',
      ],
    },
    stack: [
      { group: 'Infrastructure', items: ['Terraform (HCL)', 'AWS', 'Nginx'] },
      {
        group: 'Network',
        items: ['VPC', 'Public / private subnets', 'NAT gateway', 'Security groups'],
      },
      {
        group: 'Compute',
        items: ['EC2', 'Application Load Balancer', 'Target group', 'Auto Scaling group'],
      },
      { group: 'Data', items: ['RDS module'] },
      { group: 'Delivery', items: ['Git', 'GitHub Actions', 'Remote state backend'] },
    ],
    challenges: [
      {
        title: 'Making a private subnet actually private',
        detail:
          'The easy mistake is a private subnet that still has a public route, because something needed a package install at 2am. The NAT gateway solves the real need — outbound access without inbound exposure — and removes the excuse for a public route table.',
      },
      {
        title: 'One module per concern, not one giant template',
        detail:
          'vpc, ec2, alb, bastion and rds as separate modules means a change to the load balancer does not require reading the database configuration, and each piece can be reasoned about on its own. The alternative — a single file — is quicker to write and much slower to change safely.',
      },
      {
        title: 'Reviewing infrastructure changes like code',
        detail:
          'A pipeline is only useful if the plan is legible. Wiring fmt, validate and plan into CI means the review artefact is the diff of what will happen, not a hopeful assumption that the apply will do what was intended.',
      },
    ],
    decisions: [
      {
        title: 'Bastion host instead of wide-open SSH',
        detail:
          'Bastion-plus-SSM-style access keeps the private subnets genuinely unreachable from the internet while keeping operator access practical. Security groups describe the path instead of trusting the network to be friendly.',
        tradeoff: 'One more hop for operators, and the bastion itself becomes something that needs patching.',
      },
      {
        title: 'ALB in front of an auto scaling group',
        detail:
          'The load balancer owns health checks and traffic distribution; the auto scaling group owns capacity. Neither has to know about the other’s failure modes, and replacing instances stops being an event.',
        tradeoff: 'Two managed services to pay for and to understand before the first incident.',
      },
      {
        title: 'Remote state, always',
        detail:
          'State in a remote backend is what makes the infrastructure collaborative. Local state means one person can destroy an environment that everyone else is building against.',
        tradeoff: 'Backend locking is a real operational dependency and needs its own access controls.',
      },
    ],
    before: {
      label: 'Hand-built infrastructure',
      items: [
        'Resources created in the console',
        'No record of who changed what, or why',
        'Environment state that code cannot reproduce',
        'Capacity adjusted by hand',
        'SSH reachable from anywhere',
      ],
    },
    after: {
      label: 'Infrastructure as code',
      items: [
        'Every resource declared in HCL modules',
        'fmt / validate / plan enforced in CI',
        'Plan output as the review artefact',
        'Capacity handled by an auto scaling group',
        'SSH reachable only through a bastion',
      ],
    },
    outcomes: [
      { label: 'Modules', value: '5', detail: 'vpc · ec2 · alb · bastion · rds' },
      { label: 'IaC', value: 'Terraform', detail: 'HCL, remote state' },
      { label: 'Pipeline', value: 'GitHub Actions' },
      { label: 'Entry points', value: '2', detail: 'ALB and bastion' },
    ],
    result:
      'A reproducible AWS topology: public and private subnets, an application load balancer over an auto scaling group, a bastion host for controlled access, NAT for private egress, and an RDS module — with fmt, validate and plan wired into GitHub Actions so a change is reviewed before it is applied.',
    resultNote:
      'A reference implementation, presented as infrastructure-as-code. No claim is made about production traffic it has served.',
    lessons: [
      'The private subnet is only private until someone needs a package install. Give them a NAT gateway instead of a public route.',
      'Splitting infrastructure into modules is a change-safety decision, not a tidiness one.',
      'A pipeline whose plan nobody reads is theatre.',
    ],
    links: [
      {
        label: 'Source',
        href: 'https://github.com/Kartheek-Lenka/terraform-aws-prod',
        kind: 'source',
      },
    ],
    sources: [
      { label: 'Public repository', href: 'https://github.com/Kartheek-Lenka/terraform-aws-prod' },
    ],
    updatedAt: '2026-03-17',
  },

  /* ------------------------------------------------------------------ 03 */
  {
    slug: 'gitops-delivery-pipeline',
    title: 'GitOps delivery pipeline',
    kicker: 'Commit to running cluster with no manual step in between',
    category: 'CI/CD · Platform',
    year: '2026',
    period: 'April 2026',
    client: 'Reference implementation',
    summary:
      'Jenkins builds with Docker as the build agent, publishes the artefact, and Argo CD reconciles Kubernetes toward the state declared in Git.',
    abstract:
      'A push-based pipeline gets an image built. GitOps gets the cluster into a known state, repeatedly, without anyone logging in to run a command. The difference matters at 2am, when the question is not "how do I deploy" but "what is the cluster supposed to look like, and does it?"',
    tags: ['Jenkins', 'Docker', 'Kubernetes', 'Argo CD', 'GitOps', 'Java'],
    role: 'Platform engineer — pipeline design, containerisation, GitOps model',
    roleDetail:
      'Installed and configured Jenkins, ran builds inside a Docker agent, wired the artefact into the cluster, and modelled deployment as reconciliation with Argo CD.',
    team: 'Solo build',
    featured: false,
    problem:
      'Push-based delivery leaves the cluster in whatever state the last person left it. Nobody can diff what is running against what is supposed to be running, rollbacks depend on remembering the right command, and every environment drifts a little further from the repository it claims to come from.',
    context:
      'The build was set up as a containerised agent rather than an agent running on the controller. That one decision is what makes the pipeline reproducible: the build environment is declared, versioned and disposable.',
    built: [
      'A Jenkins controller with Docker configured as the build agent, so build environments are declared and reproducible.',
      'A containerised Java service with a Dockerfile — a versioned, immutable artefact instead of a jar copied to a server.',
      'A CI/CD pipeline that builds the image, publishes it, and hands the desired state to the cluster.',
      'Argo CD reconciling Kubernetes against manifests held in Git — the repository is the source of truth for what is running.',
      'Continuous reconciliation rather than imperative deployment: the cluster is pulled toward the declared state on a schedule and on change.',
      'Rollback by reverting a commit, because the previous state is still in Git.',
    ],
    architecture: {
      summary:
        'The build side is push-based: Jenkins produces an immutable image from a merge. The deploy side is pull-based: Argo CD watches Git and moves the cluster toward the declared manifests. No human runs kubectl to change what is running.',
      flows: [
        {
          id: 'build',
          title: 'Build path',
          caption: 'A merge produces an immutable artefact, not a mutated server.',
          direction: 'right',
          nodes: [
            { id: 'b1', label: 'Merge to main' },
            { id: 'b2', label: 'Jenkins', sub: 'controller' },
            { id: 'b3', label: 'Docker agent', sub: 'declarative env', emphasis: true },
            { id: 'b4', label: 'Docker build' },
            { id: 'b5', label: 'Container registry', emphasis: true },
          ],
        },
        {
          id: 'deploy',
          title: 'Reconcile path',
          caption: 'Git holds the desired state. Argo CD moves the cluster toward it, continuously.',
          direction: 'right',
          nodes: [
            { id: 'r1', label: 'Manifests in Git', emphasis: true },
            { id: 'r2', label: 'Argo CD', sub: 'poll + diff' },
            { id: 'r3', label: 'Kubernetes API', emphasis: true },
            { id: 'r4', label: 'Pods running' },
            { id: 'r5', label: 'Drift detected', sub: 'auto-corrected' },
          ],
        },
      ],
      notes: [
        'Building inside a container means the pipeline does not inherit state from the machine that happens to run it.',
        'The registry holds immutable, versioned images. Deployment selects a version; it never rebuilds one.',
        'Drift — someone changing the cluster by hand — is a bug that GitOps makes self-healing, because reconciliation will undo it.',
      ],
    },
    stack: [
      { group: 'CI', items: ['Jenkins', 'Docker agent'] },
      { group: 'CD', items: ['Argo CD', 'GitOps reconciliation', 'Kubernetes'] },
      { group: 'App', items: ['Java service', 'Dockerfile'] },
    ],
    challenges: [
      {
        title: 'Making the build environment reproducible',
        detail:
          'A Jenkins agent running on the controller inherits whatever is installed on that machine, so the same commit can build differently on a different day. Running the build in a Docker agent moves the toolchain into the repository, where it is versioned with the code.',
      },
      {
        title: 'Moving from “deploy” to “reconcile”',
        detail:
          'Imperative deployment asks the cluster to do a thing. Reconciliation states what should be true and lets a controller make it so. The practical difference shows up on rollback and on drift: reverting a commit becomes the rollback, and a hand-edited cluster fixes itself.',
      },
      {
        title: 'Immutable artefacts',
        detail:
          'If the deployed thing is rebuilt at deploy time, two environments running “the same version” may not be the same bits. Building once and promoting a versioned image keeps what is running traceable to what was tested.',
      },
    ],
    decisions: [
      {
        title: 'Docker as the Jenkins build agent',
        detail:
          'The build environment becomes a declared artefact with a version, reproducible on any host that can run Docker. It also means a broken toolchain is fixed by changing a file rather than by remembering what someone installed.',
        tradeoff: 'Docker-in-Docker orchestration needs its own privileges and care in restricted runners.',
      },
      {
        title: 'GitOps for the deploy side, not imperative kubectl',
        detail:
          'Argo CD keeps the desired state in Git and continuously reconciles toward it. The cluster becomes a function of the repository, which is what makes audit and rollback boring instead of heroic.',
        tradeoff: 'An extra controller to run, monitor and keep in sync with the cluster it manages.',
      },
      {
        title: 'Build once, promote by version',
        detail:
          'The image that passed CI is the image that ships. Promotion selects a tag; it does not rebuild, so the artefact under test and the artefact in production are the same artefact.',
        tradeoff: 'Fixing a build means a new version, never an edit in place.',
      },
    ],
    before: {
      label: 'Push-based delivery',
      items: [
        'Cluster state changed by hand',
        'No diff between running and intended',
        'Rollback depends on remembering a command',
        'Build environment inherited from the machine',
        'Environments drift apart',
      ],
    },
    after: {
      label: 'GitOps delivery',
      items: [
        'Desired state declared in Git',
        'Continuous reconciliation by Argo CD',
        'Rollback is a commit revert',
        'Build environment declared in a Dockerfile',
        'Drift detected and corrected automatically',
      ],
    },
    outcomes: [
      { label: 'Build', value: 'Jenkins' },
      { label: 'Build agent', value: 'Docker' },
      { label: 'Deploy', value: 'Argo CD' },
      { label: 'Model', value: 'GitOps' },
    ],
    result:
      'A path from commit to running pod with no manual step: Jenkins orchestrates the build with a containerised agent, the image is published to a registry, and Argo CD reconciles the cluster toward the manifests in Git — so a rollback is a revert, and drift corrects itself.',
    resultNote:
      'A reference implementation of the pipeline pattern. It is presented as an engineering approach, not as a claim about any client environment.',
    lessons: [
      'Rollback design is really failure-mode design. GitOps makes rollback a revert because the history is the record.',
      'A build agent that inherits state is a build that can change without a commit.',
      'The deploy step should be a controller converging on a declaration, not a human typing a command.',
    ],
    links: [
      { label: 'Source', href: 'https://github.com/Kartheek-Lenka/product-service', kind: 'source' },
    ],
    sources: [
      { label: 'Public repository', href: 'https://github.com/Kartheek-Lenka/product-service' },
    ],
    updatedAt: '2026-04-28',
  },

  /* ------------------------------------------------------------------ 04 */
  {
    slug: 'abhiruchi-food-ordering',
    title: 'Abhiruchi food ordering',
    kicker: 'A React front end for browsing menus, cart and checkout',
    category: 'Full-stack application',
    year: '2023',
    period: 'April 2023',
    client: 'Small business product',
    summary:
      'A menu-browsing and ordering front end with JWT-authenticated sessions, cart state in Redux and optional push notifications.',
    abstract:
      'An early full-stack build, and a useful one to look at now: it is where the fundamentals of a real application — session handling, client state, checkout flow, responsive behaviour across three breakpoints — were established. Kept in the portfolio because the progression is the point.',
    tags: ['React', 'Redux', 'React Router', 'JWT', 'Axios', 'Firebase'],
    role: 'Front-end and API integration',
    roleDetail:
      'Built the browsing, cart and checkout experience against a backend API, with JWT-authenticated sessions and responsive layouts for desktop, tablet and mobile.',
    team: 'Solo build',
    featured: false,
    problem:
      'Ordering food from a local restaurant means choosing from a menu, building an order and trusting that it arrives. A PDF menu and a phone call handles that badly — the menu is out of date, the order is transcribed by hand, and there is no record of what anyone ordered.',
    context:
      'The application sits on top of a backend API that owns data, authentication and order state. The front end’s job is to make a menu, a cart and a checkout feel unambiguous on a phone held one-handed.',
    built: [
      'Restaurant and menu browsing with category navigation and item detail.',
      'A cart with state held in Redux, so the basket survives navigation between screens.',
      'JWT-authenticated ordering: the session token is attached to API requests and the session survives a refresh.',
      'A checkout flow designed for one-handed mobile use.',
      'Optional Firebase Cloud Messaging for order-status push notifications.',
      'Responsive layouts across mobile, tablet and desktop rather than a scaled-down desktop.',
    ],
    stack: [
      { group: 'Product', items: ['React', 'Redux', 'React Router'] },
      { group: 'Data & API', items: ['REST API', 'Axios', 'JWT authentication'] },
      { group: 'Delivery', items: ['Firebase Cloud Messaging (optional)', 'Netlify'] },
    ],
    challenges: [
      {
        title: 'Basket state that survives navigation',
        detail:
          'The cart has to be consistent across routes, survive a page refresh, and never be re-fetched from the server. Client state in Redux put the basket in one place, which made the checkout screen a pure function of that state.',
      },
      {
        title: 'Sessions on the client',
        detail:
          'A token that disappears on refresh turns a checkout into a support ticket. Persisting the session and attaching it to every API request — and handling the unauthenticated response explicitly — is what makes the flow feel solid rather than intermittent.',
      },
    ],
    decisions: [
      {
        title: 'Redux for a genuinely shared client state',
        detail:
          'The cart is read and written by several screens at once, which is the case a global store actually solves. Local component state would have meant prop-drilling a basket through every route.',
        tradeoff: 'A store for a small app is more ceremony than a context provider — the trade was made because the cart is touched everywhere.',
      },
      {
        title: 'Mobile-first checkout rather than a desktop layout',
        detail:
          'Most orders come from a phone, so the checkout was designed for a thumb and a small viewport, and the desktop layout was derived from it rather than the other way round.',
        tradeoff: 'Desktop gets the simplified version first, which is the correct order of operations for this traffic profile.',
      },
    ],
    before: {
      label: 'The ordering process',
      items: [
        'A printed or PDF menu that goes stale',
        'Orders taken by phone and transcribed by hand',
        'No record of what was ordered',
        'No notification when an order was ready',
      ],
    },
    after: {
      label: 'The ordering process',
      items: [
        'Live menu with categories and item detail',
        'Cart persisted across the session',
        'Authenticated checkout against an API',
        'Optional push notification on status change',
      ],
    },
    outcomes: [
      { label: 'Year', value: '2023' },
      { label: 'Client state', value: 'Redux' },
      { label: 'Sessions', value: 'JWT' },
      { label: 'Status updates', value: 'FCM (optional)' },
    ],
    result:
      'A working ordering front end: browse a menu, build a cart, authenticate with JWT, check out against a backend API, and optionally receive order-status push notifications. Deployed and publicly reachable.',
    lessons: [
      'Shared state is worth a store exactly when several screens own the same data. Everywhere else it is ceremony.',
      'A session that breaks on refresh reads as an unreliable product, not a technical detail.',
      'Design the phone checkout first when that is where the orders come from.',
    ],
    links: [
      { label: 'Live application', href: 'https://abhiruchi-food-app.netlify.app', kind: 'live' },
      {
        label: 'Source',
        href: 'https://github.com/Kartheek-Lenka/Abhiruchi-Food-App',
        kind: 'source',
      },
    ],
    sources: [
      {
        label: 'Public repository',
        href: 'https://github.com/Kartheek-Lenka/Abhiruchi-Food-App',
      },
      { label: 'Deployed application', href: 'https://abhiruchi-food-app.netlify.app' },
    ],
    updatedAt: '2023-04-03',
  },

  /* ------------------------------------------------------------------ 05 */
  {
    slug: 'enterprise-platform-operations',
    title: 'Enterprise platform operations',
    kicker: 'Platform and infrastructure work inside a scaling education company',
    category: 'Confidential · Internal platform',
    year: '2026',
    client: 'Confidential employer',
    summary:
      'Production and platform engineering work carried out inside a company under NDA. Details are withheld; the shape of the work can be discussed on a call.',
    abstract:
      'This entry is deliberately incomplete. Employer platform work is normally covered by an NDA, and publishing architecture diagrams, topology details or incident history from a live internal system would be a breach of that agreement — so the public version of this case study states only what can be stated, and the rest is available to discuss directly.',
    tags: ['Confidential', 'Platform', 'Infrastructure'],
    role: 'Software engineer — platform and infrastructure',
    roleDetail: 'Awaiting written confirmation of what may be published.',
    featured: false,
    confidential: true,
    disclosure: 'placeholder',
    problem: 'Withheld under NDA.',
    context:
      'Internal platform work is usually the least visible and most consequential engineering a company does: it decides how quickly the rest of the organisation can ship, and what happens when something breaks. It is also the work most tightly bound by confidentiality.',
    built: [],
    stack: [],
    challenges: [
      {
        title: 'Awaiting approved detail',
        detail:
          'The public version of this case study is intentionally withheld. Add architecture, stack and outcomes here once written approval is available from the employer — see TODO_CONTENT.md.',
      },
    ],
    decisions: [],
    outcomes: [],
    result:
      'Withheld. This work is performed under a confidentiality agreement, so no architecture, topology, tooling or incident detail is published here.',
    resultNote:
      'If you need to evaluate this experience, the relevant scope and decisions can be discussed directly on a call, within what the agreement allows.',
    links: [],
    sources: [],
    updatedAt: '2026-09-01',
  },

  /* ------------------------------------------------------------------ 06 */
  {
    slug: 'jiangsu-national-nickel',
    title: 'Jiangsu National Nickel',
    kicker: 'An export-grade B2B site for a Chinese nickel alloy manufacturer',
    category: 'Client delivery · Web platform',
    year: '2022',
    period: '2022 engagement · site live and maintained since',
    client: 'Jiangsu National Nickel Material Technology Co. (delivered via Infosys)',
    summary:
      'A WordPress and WooCommerce platform that lets a China-based nickel alloy manufacturer be found, understood and quoted by buyers who do not read Chinese.',
    abstract:
      'A manufacturer with 35 years of production history was invisible to the international buyers it actually sells to, because its catalogue existed as sales collateral rather than as a structured, indexable site. The work was to turn a product range — bars, pipes, wires, sheets, discs, strips across Hastelloy, Monel, Incoloy and Inconel — into a navigable taxonomy that a buyer searching for a specific grade and form could actually land on, and to put a quote path in front of it.',
    tags: ['WordPress', 'WooCommerce', 'Elementor', 'PHP', 'B2B e-commerce', 'Technical SEO', 'Internationalisation'],
    role: 'Web developer — front-end build, catalogue structure, SEO surface',
    roleDetail:
      'Built and shipped the site for the client during a 2022 engagement at Infosys: page templates, the product and grade taxonomy, the responsive layouts, and the lead-capture path. The site has remained live and under maintenance since.',
    featured: false,
    problem:
      'Jiangsu National Nickel manufactures corrosion- and heat-resistant nickel alloys for aerospace, chemical processing, oil and gas and power generation. That is a business decided by engineers and procurement teams, who search by grade designation and product form — not by brand. A supplier is chosen on whether the buyer can confirm, quickly, that the exact alloy in the exact form is available.',
    context:
      'The constraint that shaped everything: the buyer and the manufacturer are on opposite sides of a language and a search-engine boundary. The catalogue has to be structured for someone who already knows what ERNICR-3 is, and legible to someone who has only just heard of nickel alloys. A brochure-style site serves neither.',
    built: [
      'A product taxonomy organised on the two axes buyers actually search — product form (pipes, bars, sheets, wires, discs, strips) and alloy grade (Hastelloy, Monel, Incoloy, Inconel, ERNICR-3, ERNICRMO-3) — so a grade-plus-form query resolves to a specific page.',
      'Product and grade pages written as reference content rather than marketing copy: composition, applications, properties and the industries each alloy serves, so a procurement decision can be made from the page.',
      'Lead capture built around the real conversion action for this market — a request-for-quote path — with enquiry and contact surfaces wired to the site owner rather than to a generic inbox.',
      'Responsive layouts across the Elementor breakpoint set, including the collapsed mobile navigation, since industrial procurement is frequently done on a phone.',
      'A media pipeline serving modern formats (WebP, AVIF) with a transparent, background-removed brand mark, so the catalogue is not the slowest thing on the page.',
      'An editorial surface — blog, gallery, mission/vision/value — that gives the site the content depth a B2B buyer uses to decide whether a supplier is established.',
      'Translation plumbing (GlotPress) and a Simplified Chinese document language, so the site can be maintained for the domestic audience without forking the content model.',
    ],
    architecture: {
      summary:
        'A managed WordPress platform: WooCommerce owns the product catalogue and enquiry path, Elementor owns the page templates, and a CDN sits in front of the origin. Chosen deliberately over a bespoke build because the client’s team needed to add grades and edit copy without a developer in the loop — the content model is the product here, not the code.',
      flows: [
        {
          id: 'discovery',
          title: 'Buyer discovery path',
          caption:
            'A grade-and-form query resolves through the catalogue taxonomy to a specific product page, then to a quote request.',
          direction: 'down',
          nodes: [
            { id: 'd1', label: 'Buyer', sub: 'search' },
            { id: 'd2', label: 'Catalogue index', sub: 'form × grade' },
            { id: 'd3', label: 'Product / grade page', sub: 'WooCommerce' },
            { id: 'd4', label: 'Application detail', sub: 'reference copy' },
            { id: 'd5', label: 'Quote request', sub: 'enquiry form', emphasis: true },
            { id: 'd6', label: 'Site owner inbox' },
          ],
        },
        {
          id: 'delivery',
          title: 'Publishing and delivery',
          caption:
            'The client team edits content in the CMS; a CDN serves the result. No deploy step in the content path.',
          direction: 'right',
          nodes: [
            { id: 'e1', label: 'CMS editor', sub: 'client team' },
            { id: 'e2', label: 'WordPress 6.7', sub: 'PHP 8.2' },
            { id: 'e3', label: 'WooCommerce 9.7', sub: 'catalogue' },
            { id: 'e4', label: 'Elementor 3.29', sub: 'templates' },
            { id: 'e5', label: 'CDN edge', sub: 'hcdn', emphasis: true },
            { id: 'e6', label: 'Buyer', sub: 'global' },
          ],
        },
      ],
      notes: [
        'The product form × grade matrix is the site’s information architecture. Every page exists to be the answer to a specific version of that question.',
        'A CMS the client can operate was worth more than a faster custom build: the catalogue changes monthly, and a code deploy per new grade would have been a tax on the only thing the site exists to do.',
        'Serving modern image formats keeps the catalogue light, which matters when the buyer is comparing grades across a dozen pages before requesting a quote.',
      ],
    },
    stack: [
      { group: 'Platform', items: ['WordPress 6.7', 'PHP 8.2', 'WooCommerce 9.7'] },
      { group: 'Front end', items: ['Elementor 3.29', 'WebP / AVIF image pipeline'] },
      { group: 'Internationalisation', items: ['GlotPress', 'Simplified Chinese (zh-Hans)'] },
      { group: 'Delivery', items: ['CDN edge (hcdn)', 'TLS', 'Mobile-first responsive layout'] },
    ],
    challenges: [
      {
        title: 'Serving two audiences with opposite levels of knowledge',
        detail:
          'An aerospace procurement engineer searching for ERNICR-3 wants a datasheet-grade page, not marketing prose. A first-time buyer needs to be walked through what nickel alloys are and why corrosion resistance matters. Both land on the same site, so the content has to carry a reference layer and an explanatory layer at the same time — which is why the grade pages carry applications and properties rather than slogans.',
      },
      {
        title: 'A catalogue that has to be searchable, not just browsable',
        detail:
          'Industrial buyers navigate by designation and form. Organising the catalogue as a browsable grid is comfortable for the client and nearly useless for the buyer, who is trying to confirm one specific alloy in one specific form. Making the grade and the form first-class in the structure — rather than in a paragraph of body copy — is what turns a brochure into something findable.',
      },
      {
        title: 'Letting a non-technical team maintain a technical catalogue',
        detail:
          'The client’s staff know the alloys far better than any developer does. Handing them a WordPress editor rather than a ticket queue means the catalogue stays accurate as grades and availability change, which is the difference between a site that ranks and one that goes stale.',
      },
    ],
    decisions: [
      {
        title: 'WordPress and WooCommerce over a bespoke build',
        detail:
          'The site’s real requirement was a content model the client could operate indefinitely. WordPress with WooCommerce gives a product catalogue, an enquiry path and a media library out of the box, and puts a familiar editor in front of a non-technical team.',
        tradeoff:
          'A managed platform constrains what can be done with the template layer, and carries a plugin surface that needs keeping current. For a content site that the client must own outright, that is the right way round.',
      },
      {
        title: 'Quote request as the primary conversion',
        detail:
          'This is B2B manufacturing with negotiated pricing and specification conversation — not a checkout. The site is built to start a conversation about a specific alloy, so the enquiry path is a first-class destination rather than a contact form buried in the footer.',
        tradeoff:
          'No instant checkout means no on-site conversion metric. The trade was made because a hard-coded price on a Hastelloy C276 pipe would be wrong more often than right.',
      },
      {
        title: 'Modern image formats across the catalogue',
        detail:
          'A grade-comparison flow is many images deep, and full-resolution photography is the main cost on a page that is otherwise mostly text. WebP and AVIF, with a background-removed transparent brand mark, cut that weight without visible quality loss.',
        tradeoff: 'A conversion step in the media pipeline, and formats that need a fallback for older browsers.',
      },
    ],
    before: {
      label: 'How the catalogue reached buyers',
      items: [
        'Product range described in sales collateral, not online',
        'A grade-and-form search led to a phone call',
        'No structured pages for individual alloys',
        'English-speaking buyers could not find the supplier',
        'Content updates required a developer',
      ],
    },
    after: {
      label: 'How the catalogue reaches buyers',
      items: [
        'Product form × alloy grade as the site’s structure',
        'A reference page per grade, with applications and properties',
        'Applications served in modern image formats',
        'A quote path wired to the site owner',
        'A CMS the client team runs themselves',
      ],
    },
    outcomes: [
      { label: 'Engagement', value: '2022, via Infosys' },
      { label: 'Status', value: 'Live and maintained' },
      { label: 'Platform', value: 'WordPress · WooCommerce' },
      { label: 'Markets', value: 'Global B2B · zh-Hans' },
    ],
    result:
      'A live, maintained B2B platform that presents the full alloy range as a searchable product-form-by-grade taxonomy, carries per-grade reference content for procurement decisions, and routes every enquiry to a quote conversation with the site owner. Built during a 2022 client engagement and still serving traffic.',
    resultNote:
      'Described from the live site and its published platform. No traffic, ranking or revenue figures are claimed — none are available to verify.',
    lessons: [
      'For B2B, the catalogue structure is the product. A page hierarchy that mirrors how buyers search is worth more than any amount of copy on the homepage.',
      'Handing the client an editor is a feature. Accuracy after handover depends on who can change the content without a deploy.',
      'Manufacturing buyers search a designation. Organise the site around the designation, not around the org chart.',
    ],
    links: [{ label: 'Live site', href: 'https://jiangsunationalnickel.com/', kind: 'live' }],
    sources: [{ label: 'Live site', href: 'https://jiangsunationalnickel.com/' }],
    updatedAt: '2026-09-28',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  previous?: Project;
  next?: Project;
} {
  const published = projects.filter((p) => !p.confidential);
  const index = published.findIndex((p) => p.slug === slug);
  if (index === -1) return {};
  return {
    previous: index > 0 ? published[index - 1] : undefined,
    next: index < published.length - 1 ? published[index + 1] : undefined,
  };
}

export const projectCategories = Array.from(
  new Set(projects.filter((p) => !p.confidential).map((p) => p.category.split(' · ')[0] ?? p.category)),
).sort();
