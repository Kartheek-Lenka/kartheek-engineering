import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';
import { projects } from '@/data/projects';
import { getAllInsights } from '@/lib/insights';

/**
 * Sitemap.
 *
 * Only real, published, canonical URLs. Confidential projects are included
 * because their pages exist and carry a disclosure rather than client detail —
 * the alternative is a page that only exists for people who already know the
 * slug, which helps nobody and indexes badly.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/work`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/process`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/insights`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/work/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  const insights = await getAllInsights();
  const insightRoutes: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: `${base}/insights/${insight.slug}`,
    lastModified: new Date(insight.updated ?? insight.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...insightRoutes];
}
