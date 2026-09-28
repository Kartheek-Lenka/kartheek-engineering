/**
 * Pricing.
 *
 * Every figure is a STARTING FROM price, not a quote. Final pricing depends on
 * scope, complexity, integrations, timeline, infrastructure and support
 * requirements — stated explicitly on the page.
 *
 * Currency handling
 * -----------------
 * USD is the primary display currency and the base for the whole table.
 * Other currencies are INDICATIVE static display values configured in
 * `currencyDisplay`, not live FX rates. They are labelled as indicative in the
 * UI. To use live rates, replace `rate` in lib/pricing.ts with a server-fetched
 * rate table — the formatter already handles it.
 */

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

export type CurrencyDefinition = {
  code: CurrencyCode;
  symbol: string;
  name: string;
  /** Indicative conversion rate from USD. Static — see file header. */
  rate: number;
  locale: string;
};

export const currencies: CurrencyDefinition[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1, locale: 'en-US' },
  { code: 'EUR', symbol: '\u20ac', name: 'Euro', rate: 0.92, locale: 'de-DE' },
  { code: 'GBP', symbol: '\u00a3', name: 'British Pound', rate: 0.79, locale: 'en-GB' },
  { code: 'INR', symbol: '\u20b9', name: 'Indian Rupee', rate: 83.2, locale: 'en-IN' },
];

export const defaultCurrency: CurrencyCode = 'USD';

/** Currencies that are not the base currency are shown as indicative. */
export const nonBaseCurrencies = currencies.filter((c) => c.code !== 'USD');

export type PricingTier = {
  id: string;
  name: string;
  /** Starting price in USD. Monthly tiers use `monthly`. */
  usd: number;
  monthly?: boolean;
  position: string;
  audience: string;
  summary: string;
  includes: string[];
  timeline: string;
  bestFor: string;
  highlighted?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    usd: 1500,
    position: 'For smaller product builds',
    audience: 'Founders validating a first version',
    summary:
      'A focused build: a landing experience that converts, or a small internal tool that removes a manual process.',
    includes: [
      'Single clear objective, scoped in writing',
      'Responsive build with a design system',
      'Up to one integration (email, payments, analytics or a third-party API)',
      'Deployment to a managed host',
      'Handover documentation',
    ],
    timeline: 'Typically 2–4 weeks',
    bestFor: 'Validation, launch pages, internal tools',
  },
  {
    id: 'product',
    name: 'Product',
    usd: 3000,
    position: 'For production-ready applications',
    audience: 'SaaS and product teams shipping a real application',
    summary:
      'A complete application build: data model, authentication, the workflows users actually do, and an admin surface.',
    includes: [
      'Data model and API contract agreed before build',
      'Authentication, authorisation and an admin surface',
      'Validated, typed boundaries across client and server',
      'CI/CD pipeline with automated checks',
      'Cloud infrastructure as code',
      'Monitoring and error tracking from day one',
    ],
    timeline: 'Typically 6–10 weeks',
    bestFor: 'SaaS MVPs, internal platforms, client portals',
    highlighted: true,
  },
  {
    id: 'ai-product',
    name: 'AI Product',
    usd: 5000,
    position: 'For AI-powered applications',
    audience: 'Teams building AI into a product or a service',
    summary:
      'AI product work end to end: retrieval, model integration, evaluation, cost and latency budgets, and guardrails.',
    includes: [
      'Reference architecture and delivery plan',
      'LLM integration, RAG or agent implementation',
      'Evaluation set with regression checks',
      'Cost and latency budget for shipped behaviour',
      'Guardrails, structured output and fallbacks',
      'Deployed with monitoring',
    ],
    timeline: 'Typically 6–12 weeks',
    bestFor: 'AI assistants, document processing, AI workflows',
  },
  {
    id: 'production-engineering',
    name: 'Production Engineering',
    usd: 2000,
    position: 'For infrastructure and reliability work',
    audience: 'Teams with a product that is live but not dependable',
    summary:
      'An assessment followed by targeted work: what is actually broken, what it will cost, and what to fix first.',
    includes: [
      'Written reliability assessment with ranked findings',
      'CI/CD pipeline and deployment strategy',
      'Observability: logs, metrics, traces, alerts',
      'Containerisation and infrastructure as code',
      'Performance and scaling work, measured before and after',
      'Cloud cost review',
    ],
    timeline: 'Typically 2–6 weeks',
    bestFor: 'Production rescue, scaling, DevOps maturity',
  },
  {
    id: 'engineering-partner',
    name: 'Engineering Partner',
    usd: 1500,
    monthly: true,
    position: 'For ongoing engineering and infrastructure',
    audience: 'Teams that need a reliable owner for the system',
    summary:
      'A monthly capacity block for feature work, infrastructure, incident support and architecture — with a plan agreed in advance.',
    includes: [
      'A monthly plan agreed up front',
      'Predictable capacity rather than hourly billing',
      'Infrastructure maintenance and feature delivery',
      'Priority handling when something breaks',
      'Architecture review and written decisions',
      'Documentation and handover that outlives the engagement',
    ],
    timeline: 'Rolling, minimum 3 months',
    bestFor: 'Teams without a dedicated platform engineer',
  },
];

export const pricingFactors = [
  { label: 'Scope', detail: 'How much is actually being asked for' },
  { label: 'Complexity', detail: 'Integrations, data volume, edge cases' },
  { label: 'Integrations', detail: 'Third-party APIs, payments, AI providers' },
  { label: 'Timeline', detail: 'Urgency and the cadence you need' },
  { label: 'Infrastructure', detail: 'Cloud spend, regions, compliance needs' },
  { label: 'Support', detail: 'Ongoing maintenance and incident cover' },
] as const;

export const pricingFaqs = [
  {
    q: 'Are these fixed prices?',
    a: 'No. Every figure is a starting point that defines the shape of the engagement. After a short scoping conversation you get a written proposal with a fixed price for a defined scope — so the number you approve is the number you pay.',
  },
  {
    q: 'How does payment work?',
    a: 'Typically a deposit to schedule the work, a milestone payment partway through, and the balance on delivery. For ongoing engagements, monthly in advance. Payment methods are agreed in the proposal.',
  },
  {
    q: 'What if my project is smaller or larger?',
    a: 'Both are normal. A smaller scope gets a smaller project; a larger one gets phased delivery with a clear first milestone. The starting prices exist to help you budget, not to constrain the work.',
  },
  {
    q: 'Do you work with clients outside India?',
    a: 'Yes — the majority of engagements are international. Pricing is quoted in USD by default, with EUR, GBP and INR available for budgeting.',
  },
] as const;
