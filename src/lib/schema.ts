import { siteConfig } from '@/data/site';
import { PERSON_ID, SERVICE_ID, WEBSITE_ID, id } from '@/lib/metadata';
import { services } from '@/data/services';

/**
 * Structured data. Person, ProfessionalService, WebSite and Article.
 * Every value is drawn from data/ so the schema cannot drift from the page.
 */

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: siteConfig.name,
    jobTitle: 'AI Product Engineer, Full-Stack Engineer, Cloud/DevOps Engineer',
    description:
      'Software engineer focused on building and operating production-grade applications — AI products, full-stack systems and cloud infrastructure — from the first architecture decision to deployment, monitoring and scale.',
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    image: `${siteConfig.url}/opengraph-image`,
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
    knowsAbout: [
      'AI product engineering',
      'Retrieval-augmented generation',
      'Full-stack application development',
      'Next.js',
      'TypeScript',
      'Cloud architecture',
      'AWS',
      'Docker',
      'Kubernetes',
      'Terraform',
      'CI/CD',
      'Production reliability',
      'Observability',
    ],
    jobTitleDetail: undefined,
    worksFor: {
      '@type': 'Organization',
      name: 'GrowthSchool',
    },
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteConfig.url,
    name: `${siteConfig.name} — ${siteConfig.shortRole}`,
    description:
      'AI product engineering, full-stack development and cloud infrastructure for founders and teams building serious software.',
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  };
}

export function professionalServiceSchema() {
  return {
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: `${siteConfig.name} — ${siteConfig.shortRole}`,
    description:
      'Independent AI product, full-stack and cloud engineering practice. Takes software from first architecture decision through build, deployment, observability and scale.',
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    telephone: `+${siteConfig.phone.e164}`,
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Place', name: 'Europe' },
      { '@type': 'Place', name: 'Middle East' },
      { '@type': 'Place', name: 'Singapore' },
      { '@type': 'Country', name: 'India' },
    ],
    availableLanguage: ['en'],
    employee: { '@id': PERSON_ID },
    founder: { '@id': PERSON_ID },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Engineering services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          serviceType: service.title,
          url: `${siteConfig.url}/services#${service.id}`,
        },
      })),
    },
  };
}

export function faqSchema(entries: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: { '@type': 'Answer', text: entry.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function caseStudySchema(input: {
  slug: string;
  title: string;
  abstract: string;
  category: string;
  year: string;
  updatedAt: string;
  stack: string[];
  liveUrl?: string;
  sourceUrl?: string;
}) {
  return {
    '@type': 'CreativeWork',
    '@id': id(`/work/${input.slug}#case-study`),
    name: input.title,
    headline: input.title,
    description: input.abstract,
    url: `${siteConfig.url}/work/${input.slug}`,
    dateCreated: input.year,
    dateModified: input.updatedAt,
    genre: input.category,
    inLanguage: 'en',
    author: { '@id': PERSON_ID },
    creator: { '@id': PERSON_ID },
    about: input.stack,
    keywords: input.stack.join(', '),
    ...(input.liveUrl ? { url: input.liveUrl } : {}),
    isBasedOn: input.sourceUrl ?? undefined,
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  tags: string[];
}) {
  return {
    '@type': 'Article',
    '@id': id(`/insights/${input.slug}#article`),
    headline: input.title,
    description: input.description,
    url: `${siteConfig.url}/insights/${input.slug}`,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    inLanguage: 'en',
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    keywords: input.tags.join(', '),
    timeRequired: `PT${input.readingTimeMinutes}M`,
    isAccessibleForFree: true,
    mainEntityOfPage: { '@id': `${siteConfig.url}/insights/${input.slug}` },
  };
}

export function breadcrumbListFor(paths: { name: string; path: string }[]) {
  return breadcrumbSchema(paths);
}
