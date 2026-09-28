import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

const BASE = siteConfig.url;

export const PRIMARY_KEYWORDS = [
  'AI product development',
  'AI application development',
  'AI engineer',
  'full-stack development',
  'Next.js development',
  'SaaS development',
  'AWS DevOps',
  'cloud engineering',
  'Terraform',
  'Kubernetes',
  'CI/CD',
  'software development partner',
];

/**
 * International SEO preparation.
 *
 * Localised pages are intentionally NOT built yet — duplicate, untranslated
 * pages are an SEO liability. This table is the wiring so that adding a locale
 * is a content decision, not an architecture change. When `/us`, `/uk` etc. are
 * created, add them to `LOCALIZED_ROUTES`, set `alternates.languages` on the
 * relevant metadata, and the hreflang graph below becomes correct automatically.
 */
export const LOCALES = ['en'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
};

/**
 * Planned locale prefixes. Kept as data (not routes) so nothing is published
 * until real localised content exists. See ARCHITECTURE.md § International SEO.
 */
export const PLANNED_LOCALES = [
  { prefix: '/us', label: 'United States', currency: 'USD', hreflang: 'en-US' },
  { prefix: '/uk', label: 'United Kingdom', currency: 'GBP', hreflang: 'en-GB' },
  { prefix: '/eu', label: 'Europe', currency: 'EUR', hreflang: 'en-IE' },
  { prefix: '/ca', label: 'Canada', currency: 'USD', hreflang: 'en-CA' },
  { prefix: '/au', label: 'Australia', currency: 'USD', hreflang: 'en-AU' },
] as const;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  type = 'website',
  publishedTime,
  modifiedTime,
  noIndex,
}: PageMetaInput): Metadata {
  const canonical = `${BASE}${path}`;

  return {
    title,
    description,
    keywords: keywords ?? PRIMARY_KEYWORDS,
    alternates: {
      canonical,
      types: {
        'application/rss+xml': `${BASE}/insights/rss.xml`,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      url: canonical,
      siteName: `${siteConfig.name} — ${siteConfig.shortRole}`,
      title,
      description,
      locale: 'en_US',
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@Kartheek-Lenka',
    },
  };
}

/** Absolute URL for JSON-LD @id references. */
export function id(path: string): string {
  return `${BASE}${path}#id`;
}

export const PERSON_ID = id('/#person');
export const WEBSITE_ID = id('/#website');
export const SERVICE_ID = id('/#service');
export const ORGANISATION_ID = id('/#organisation');
