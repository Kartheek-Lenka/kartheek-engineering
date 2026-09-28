import { aboutFacts, workPrinciples } from '@/data/technology';
import { experience, credentials } from '@/data/experience';
import { siteConfig } from '@/data/site';
import { Container, Section, SectionHeader, Tag } from '@/components/ui/section';
import { Reveal } from '@/components/animations/reveal';

/**
 * About.
 *
 * No stock photography and no invented biography. A typographic profile
 * treatment: monogram, name, role, and facts that are checkable. If a real photo
 * asset is added, it replaces the monogram — see TODO_CONTENT.md.
 */
export function About() {
  return (
    <Section id="about" aria-labelledby="about-title">
      <Container className="py-20 md:py-28">
        <SectionHeader
          index="09"
          id="about-title"
          eyebrow="About"
          title="An engineer who takes responsibility for the whole system."
          lede="Kartheek Lenka is a software engineer focused on building and operating production-grade applications."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Profile column */}
          <div className="lg:col-span-4">
            <Reveal>
              <div className="rounded-xl border border-line bg-surface/40 p-6">
                <div className="flex items-center gap-4">
                  {/* Typographic profile treatment. Replaced by a photo if one exists. */}
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-line-2 bg-inset font-mono text-lg tracking-tight text-ink"
                  >
                    KL
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">Kartheek Lenka</p>
                    <p className="t-label mt-1.5">Engineering since 2022</p>
                  </div>
                </div>

                <dl className="mt-6 flex flex-col">
                  {aboutFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-b-0"
                    >
                      <dt className="t-label">{fact.label}</dt>
                      <dd className="t-body-sm text-right">{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex flex-col gap-2.5">
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-between gap-3 rounded-md border border-line-2 px-3.5 py-2.5 text-sm text-ink-2 transition-colors duration-200 hover:border-line-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    LinkedIn
                    <span aria-hidden="true" className="text-ink-4 transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-between gap-3 rounded-md border border-line-2 px-3.5 py-2.5 text-sm text-ink-2 transition-colors duration-200 hover:border-line-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    GitHub
                    <span aria-hidden="true" className="text-ink-4 transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Narrative column */}
          <div className="lg:col-span-8">
            <Reveal className="flex flex-col gap-5">
              <p className="t-lead max-w-[62ch]">
                I work across the full stack and the full lifecycle: product engineering,
                cloud infrastructure, and the operational work that keeps a system
                dependable once real users depend on it.
              </p>
              <p className="t-body max-w-[62ch]">
                My work has been split between enterprise engineering — building and scaling
                applications inside an organisation with thousands of engineers, where
                release discipline and code review are non-negotiable — and independent
                product work, where the same person who designs the system also deploys it
                and answers the pager. That second context is the more useful one: it is
                very hard to design something you will have to operate yourself at 2am.
              </p>
              <p className="t-body max-w-[62ch]">
                Most of what I take on sits at the boundary between product and
                infrastructure — an AI feature that needs to be affordable and fast enough to
                ship, an application that works but does not survive its first real traffic
                spike, a pipeline that fails for reasons nobody can identify. I am
                comfortable owning that whole boundary rather than one side of it.
              </p>
              <p className="t-body max-w-[62ch]">
                I work asynchronously, write decisions down, and would rather tell you
                something will not work than discover it in production. If a project is a bad
                fit I will say so early, because that is cheaper for both of us.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <h3 className="t-label">How I work</h3>
              <ul className="mt-5 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {workPrinciples.map((principle) => (
                  <li key={principle.index} className="flex flex-col gap-2 bg-canvas p-4">
                    <span className="t-meta text-accent-ink">{principle.index}</span>
                    <span className="text-sm font-medium text-ink">{principle.title}</span>
                    <span className="t-body-sm">{principle.detail}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

export function Experience() {
  return (
    <Section id="experience" aria-labelledby="experience-title" className="bg-canvas-2">
      <Container className="py-20 md:py-28">
        <SectionHeader
          index="10"
          id="experience-title"
          eyebrow="Experience"
          title="Where the engineering happened."
          lede="Roles, dates and focus, stated as they are. No inflated titles and no achievements that cannot be evidenced."
        />

        <ol className="mt-14 border-t border-line">
          {experience.map((role, index) => (
            <Reveal as="li" key={role.id} delay={index * 60} className="hairline-b">
              <div className="grid gap-5 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <div className="md:col-span-3">
                  <p className="t-meta text-ink-2">
                    {role.start} — {role.end ?? 'Present'}
                  </p>
                  <p className="t-meta mt-1.5 text-ink-4">{role.location}</p>
                </div>

                <div className="md:col-span-4">
                  <h3 className="t-h3">{role.organisation}</h3>
                  <p className="t-body mt-1.5 text-ink-2">{role.role}</p>
                  {role.reference && (
                    <a
                      href={role.reference.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-meta mt-3 inline-flex items-center gap-1.5 text-ink-4 transition-colors hover:text-ink-2"
                    >
                      {role.reference.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>

                <div className="md:col-span-5">
                  <p className="t-body max-w-[52ch]">{role.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {role.focus.map((item) => (
                      <li
                        key={item}
                        className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-3"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Credentials — clearly labelled as self-reported where applicable */}
        <div className="mt-16 border-t border-line pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="t-h3">Credentials and recognition</h3>
            <Tag>Self-reported · details on request</Tag>
          </div>
          <p className="t-body mt-3 max-w-[62ch]">
            Listed with the issuing body named so they can be checked. Where a credential is
            a course or a programme completion, that is what it is — not a certification.
          </p>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
            {credentials.map((credential) => (
              <li key={credential.id} className="flex flex-col gap-2 bg-canvas p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="t-label text-accent-ink">{credential.issuer}</span>
                  <span className="t-meta text-ink-4">{credential.year}</span>
                </div>
                <span className="text-sm font-medium text-ink">{credential.label}</span>
                <span className="t-body-sm">{credential.detail}</span>
                {credential.href && (
                  <a
                    href={credential.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-meta mt-1 inline-flex w-fit items-center gap-1.5 text-ink-4 transition-colors hover:text-ink-2"
                  >
                    Source
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
