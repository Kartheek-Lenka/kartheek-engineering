import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Tag } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd } from '@/components/json-ld';
import { CtaBand } from '@/components/sections/cta-band';
import { CaseStudyDiagram } from '@/components/case-studies/case-study-diagram';
import { getAdjacentProjects, getProject, projects } from '@/data/projects';
import { breadcrumbSchema, caseStudySchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/metadata';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return buildMetadata({
      title: 'Case study not found',
      description: 'This case study does not exist.',
      path: `/work/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${project.title} — case study`,
    description: project.abstract,
    path: `/work/${project.slug}`,
    keywords: project.tags,
    type: 'article',
    publishedTime: project.year,
    modifiedTime: project.updatedAt,
  });
}

function Aside({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="t-label">{label}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const adjacent = getAdjacentProjects(slug);
  const live = project.links.find((link) => link.kind === 'live');
  const source = project.links.find((link) => link.kind === 'source');

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: project.title, path: `/work/${project.slug}` },
          ]),
          caseStudySchema({
            slug: project.slug,
            title: project.title,
            abstract: project.abstract,
            category: project.category,
            year: project.year,
            updatedAt: project.updatedAt,
            stack: project.tags,
            liveUrl: live?.href,
            sourceUrl: source?.href,
          }),
        ]}
      />

      {/* Header */}
      <Section aria-labelledby="case-title" className="border-b border-line">
        <Container className="pt-32 pb-14 md:pt-40 md:pb-16">
          <nav aria-label="Breadcrumb" className="t-meta mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-ink-4">
              <li>
                <Link href="/" className="transition-colors hover:text-ink-2">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/work" className="transition-colors hover:text-ink-2">
                  Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-2" aria-current="page">
                {project.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <p className="t-label text-accent-ink">{project.kicker}</p>
              <h1 id="case-title" className="t-h1 mt-5 text-balance">
                {project.title}
              </h1>
              <p className="t-lead mt-6 max-w-[58ch]">{project.abstract}</p>
            </div>

            <div className="lg:col-span-4">
              <dl className="flex flex-col">
                {[
                  { label: 'Client', value: project.client },
                  { label: 'Role', value: project.role },
                  { label: 'Period', value: project.period ?? project.year },
                  { label: 'Category', value: project.category },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-b-0"
                  >
                    <dt className="t-label">{row.label}</dt>
                    <dd className="t-body-sm text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
                {live && (
                  <ButtonLink
                    href={live.href}
                    external
                    variant="primary"
                    data-analytics="case_live"
                    data-analytics-location="case"
                  >
                    {live.label}
                  </ButtonLink>
                )}
                {source && (
                  <ButtonLink
                    href={source.href}
                    external
                    variant="secondary"
                    data-analytics="case_source"
                    data-analytics-location="case"
                  >
                    {source.label}
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Problem */}
      <Section className="py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <h2 className="t-label">The problem</h2>
            </div>
            <div className="lg:col-span-9">
              <p className="t-lead max-w-[64ch]">{project.problem}</p>
              {project.context && (
                <p className="t-body mt-6 max-w-[64ch]">{project.context}</p>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* What was built */}
      <Section className="py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <h2 className="t-label">What was built</h2>
            </div>
            <div className="lg:col-span-9">
              <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {project.built.map((item) => (
                  <li key={item} className="flex items-start gap-3 bg-canvas p-4">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-2.5 shrink-0 bg-accent" />
                    <span className="t-body-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Architecture — omitted for confidential work */}
      {project.confidential ? (
        <Section className="py-16 md:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-3">
                <h2 className="t-label">Architecture</h2>
              </div>
              <div className="lg:col-span-9">
                <div className="rounded-lg border border-line bg-surface/40 p-6 md:p-8">
                  <Tag tone="accent">Withheld</Tag>
                  <h3 className="t-h3 mt-4 text-balance">
                    Architecture and infrastructure details are not published for this
                    engagement.
                  </h3>
                  <p className="t-body mt-4 max-w-[58ch]">
                    The work involved client production systems under an NDA. The
                    deployment model, the infrastructure and the operational details are
                    described in conversation instead. No diagram is shown here rather than
                    show one that is not accurate.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ) : (
        project.architecture && (
          <Section className="py-16 md:py-20">
            <Container>
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-3">
                  <h2 className="t-label">Architecture</h2>
                </div>
                <div className="lg:col-span-9">
                  <p className="t-lead max-w-[62ch]">{project.architecture.summary}</p>
                  <CaseStudyDiagram flows={project.architecture.flows} />
                  <ul className="mt-8 flex flex-col gap-3">
                    {project.architecture.notes.map((note) => (
                      <li key={note} className="t-body-sm flex items-start gap-3">
                        <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-line-3" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
          </Section>
        )
      )}

      {/* Stack */}
      <Section className="py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <h2 className="t-label">Stack</h2>
            </div>
            <div className="lg:col-span-9">
              <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {project.stack.map((group) => (
                  <div key={group.group} className="bg-canvas p-4">
                    <h3 className="t-label text-ink-2">{group.group}</h3>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-3"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="t-meta mt-5 max-w-[62ch] text-ink-4">{project.roleDetail}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Challenges and decisions */}
      <Section className="py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <h2 className="t-label">Decisions</h2>
              <p className="t-body-sm mt-3 text-ink-4">
                The interesting part of any build is the part where more than one option was
                reasonable.
              </p>
            </div>
            <div className="lg:col-span-9">
              <div className="flex flex-col">
                {project.decisions.map((decision, index) => (
                  <div key={decision.title} className="hairline-b py-6 last:border-b-0">
                    <div className="grid gap-3 md:grid-cols-12 md:gap-6">
                      <h3 className="text-sm font-medium text-ink md:col-span-4">
                        {decision.title}
                      </h3>
                      <div className="md:col-span-8">
                        <p className="t-body">{decision.detail}</p>
                        {decision.tradeoff && (
                          <p className="t-body-sm mt-3 flex items-start gap-2.5 text-ink-3">
                            <span
                              aria-hidden="true"
                              className="mt-[0.6em] h-px w-2.5 shrink-0 bg-line-3"
                            />
                            <span>
                              <span className="text-ink-2">Trade-off:</span> {decision.tradeoff}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="sr-only">Decision {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Before / after */}
      {(project.before || project.after) && (
        <Section className="py-16 md:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-3">
                <h2 className="t-label">Change</h2>
              </div>
              <div className="lg:col-span-9">
                <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
                  {[project.before, project.after].map((block, index) =>
                    block ? (
                      /* Keyed by position, not label: the two blocks are
                         sometimes given the same heading (both are "The
                         ordering process", before and after), and a shared label
                         is a duplicate key. */
                      <div key={index} className="bg-canvas p-5">
                        <h3 className="t-label text-ink-2">{block.label}</h3>
                        <ul className="mt-4 flex flex-col gap-2.5">
                          {block.items.map((item) => (
                            <li key={item} className="t-body-sm flex items-start gap-2.5">
                              <span
                                aria-hidden="true"
                                className="mt-[0.6em] h-px w-2.5 shrink-0 bg-line-3"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <span className="sr-only">
                          {index === 0 ? 'Before' : 'After'}
                        </span>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Outcome */}
      <Section className="py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <Aside label="Outcome">
                <p className="t-body-sm text-ink-4">
                  Stated as engineering outcomes. Business metrics are not published unless
                  the client agreed to them.
                </p>
              </Aside>
            </div>
            <div className="lg:col-span-9">
              <p className="t-lead max-w-[64ch]">{project.result}</p>
              {project.resultNote && (
                <p className="t-body mt-5 max-w-[64ch] text-ink-3">{project.resultNote}</p>
              )}

              <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {project.outcomes.map((outcome) => (
                  <div key={outcome.label} className="bg-canvas p-4">
                    <h3 className="t-label text-ink-2">{outcome.label}</h3>
                    {/* Some projects state a metric, others a detail. Render
                        whichever is present instead of a blank cell. */}
                    {outcome.value ? (
                      <p className="t-h4 mt-2 text-balance">{outcome.value}</p>
                    ) : null}
                    {outcome.detail ? (
                      <p className="t-body-sm mt-2">{outcome.detail}</p>
                    ) : null}
                  </div>
                ))}
              </ul>

              {project.lessons && project.lessons.length > 0 && (
                <div className="mt-10">
                  <h3 className="t-label">What I would do differently</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {project.lessons.map((lesson) => (
                      <li key={lesson} className="t-body flex items-start gap-3">
                        <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Sources */}
      {project.sources.length > 0 && (
        <Section className="py-14 md:py-16">
          <Container>
            <div className="grid gap-6 border-t border-line pt-8 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-3">
                <h2 className="t-label">Sources</h2>
              </div>
              <div className="lg:col-span-9">
                <p className="t-body-sm max-w-[62ch] text-ink-4">
                  Every claim on this page traceable to a public source, or explicitly
                  described as withheld.
                </p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {project.sources.map((source) => (
                    <li key={source.href}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t-body-sm group inline-flex items-center gap-2 text-ink-3 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        {source.label}
                        <span
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-0.5"
                        >
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="t-meta mt-6 text-ink-4">Last updated {project.updatedAt}</p>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Adjacent */}
      {(adjacent.previous || adjacent.next) && (
        <Section className="border-t border-line py-16 md:py-20">
          <Container>
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
              {adjacent.previous ? (
                <Link
                  href={`/work/${adjacent.previous.slug}`}
                  className="group flex flex-col gap-2 bg-canvas p-5 transition-colors duration-300 hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="t-meta text-ink-4">← Previous</span>
                  <span className="t-h4 transition-colors group-hover:text-accent-ink">
                    {adjacent.previous.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden bg-canvas sm:block" aria-hidden="true" />
              )}
              {adjacent.next ? (
                <Link
                  href={`/work/${adjacent.next.slug}`}
                  className="group flex flex-col items-end gap-2 bg-canvas p-5 text-right transition-colors duration-300 hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="t-meta text-ink-4">Next →</span>
                  <span className="t-h4 transition-colors group-hover:text-accent-ink">
                    {adjacent.next.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden bg-canvas sm:block" aria-hidden="true" />
              )}
            </div>
          </Container>
        </Section>
      )}

      <CtaBand
        eyebrow="Next step"
        title="A project like this starts with a message."
        body="Tell me the constraint you are working with and I will tell you honestly whether I can help."
      />
    </>
  );
}
