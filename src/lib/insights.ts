import 'server-only';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import { cache } from 'react';
import { readingTime } from './reading-time';

const CONTENT_DIR = join(process.cwd(), 'content', 'insights');

export type InsightFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  featured?: boolean;
  draft?: boolean;
};

export type Insight = InsightFrontmatter & {
  slug: string;
  minutes: number;
};

export type InsightWithBody = Insight & { body: string };

/**
 * Insights content.
 *
 * MDX lives in `content/insights/*.mdx` and is read at request time, then cached
 * for the life of the process. Frontmatter is validated by hand rather than with
 * a schema: there are six files, and a build-time failure is the wrong trade for
 * a portfolio that does not change weekly.
 */
export const getAllInsights = cache(async (): Promise<Insight[]> => {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.mdx'));

  const insights = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(CONTENT_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ''),
        title: String(data.title ?? 'Untitled'),
        description: String(data.description ?? ''),
        date: String(data.date ?? ''),
        updated: data.updated ? String(data.updated) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        featured: Boolean(data.featured),
        draft: Boolean(data.draft),
        minutes: readingTime(content),
      };
    }),
  );

  return insights
    .filter((insight) => !insight.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
});

export const getInsight = cache(async (slug: string): Promise<InsightWithBody | null> => {
  // Reject anything that is not a plain slug before touching the filesystem.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  try {
    const raw = await readFile(join(CONTENT_DIR, `${slug}.mdx`), 'utf8');
    const { data, content } = matter(raw);
    if (data.draft) return null;

    return {
      slug,
      title: String(data.title ?? 'Untitled'),
      description: String(data.description ?? ''),
      date: String(data.date ?? ''),
      updated: data.updated ? String(data.updated) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      featured: Boolean(data.featured),
      draft: false,
      minutes: readingTime(content),
      body: content,
    };
  } catch {
    return null;
  }
});

export async function getAllTags(): Promise<string[]> {
  const insights = await getAllInsights();
  return [...new Set(insights.flatMap((i) => i.tags))].sort();
}

export async function getRelated(slug: string, limit = 2): Promise<Insight[]> {
  const insights = await getAllInsights();
  const current = insights.find((i) => i.slug === slug);
  if (!current) return insights.slice(0, limit);

  const scored = insights
    .filter((i) => i.slug !== slug)
    .map((i) => ({
      insight: i,
      score: i.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || b.insight.date.localeCompare(a.insight.date));

  return scored.slice(0, limit).map((s) => s.insight);
}
