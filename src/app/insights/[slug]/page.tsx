import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Container, Section, Tag } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd } from '@/components/json-ld';
import { InsightCard } from '@/components/insights/insight-card';
import { CtaBand } from '@/components/sections/cta-band';
import { getAllInsights, getInsight, getRelated } from '@/lib/insights';
import { articleSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/metadata';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const insights = await getAllInsights();
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsight(slug);

  if (!insight) {
    return buildMetadata({
      title: 'Not found',
      description: 'This article does not exist.',
      path: `/insights/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: insight.title,
    description: insight.description,
    path: `/insights/${insight.slug}`,
    keywords: insight.tags,
    type: 'article',
    publishedTime: insight.date,
    modifiedTime: insight.updated ?? insight.date,
  });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default async function InsightPage({ params }: Params) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  const related = await getRelated(insight.slug);

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: insight.title,
          description: insight.description,
          slug: insight.slug,
          publishedAt: insight.date,
          updatedAt: insight.updated,
          readingTimeMinutes: insight.minutes,
          tags: insight.tags,
        })}
      />

      <Section aria-labelledby="article-title" className="border-b border-line">
        <Container className="pt-32 pb-14 md:pt-40 md:pb-16">
          <div className="max-w-[68ch]">
            <p className="t-label text-accent-ink">Insight</p>
            <h1 id="article-title" className="t-h1 mt-5 text-balance">
              {insight.title}
            </h1>
            <p className="t-lead mt-6 max-w-[60ch]">{insight.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <time dateTime={insight.date} className="t-meta text-ink-3">
                {formatDate(insight.date)}
              </time>
              {insight.updated && insight.updated !== insight.date && (
                <span className="t-meta text-ink-4">
                  Updated {formatDate(insight.updated)}
                </span>
              )}
              <span className="t-meta text-ink-4">{insight.minutes} min read</span>
              <ul className="flex flex-wrap gap-1.5">
                {insight.tags.map((tag) => (
                  /* Tag renders its own <span>; wrapping it in an <li> would
                     nest a list item directly inside a list item. */
                  <li key={tag} className="list-none">
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <article className="prose-eng max-w-[70ch] lg:col-span-9">
              <MDXRemote source={insight.body} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </article>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section className="border-t border-line py-20 md:py-24">
          <Container>
            <h2 className="t-h2">Related reading</h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
              {related.map((item) => (
                <InsightCard key={item.slug} insight={item} />
              ))}
            </div>
            <ButtonLink href="/insights" variant="ghost" className="mt-8">
              All insights
            </ButtonLink>
          </Container>
        </Section>
      )}

      <CtaBand
        eyebrow="Working together"
        title="If this sounds like your situation."
        body="Most of the work I take on starts with a problem someone else described as 'just a small fix'."
      />
    </>
  );
}
