import Link from 'next/link';
import { projects, projectCategories } from '@/data/projects';
import { ProjectCard } from '@/components/case-studies/project-card';
import { WorkShowcase } from '@/components/case-studies/work-showcase';
import { Container, Section, SectionHeader, Tag } from '@/components/ui/section';
import { ButtonLink, ArrowRight } from '@/components/ui/button';
import { Reveal } from '@/components/animations/reveal';
import { CtaBand } from '@/components/sections/cta-band';

/** Full work index, used on /work. */
export function WorkIndex() {
  const published = projects.filter((p) => !p.confidential);
  const confidential = projects.filter((p) => p.confidential);

  return (
    <>
      <Container className="py-16 md:py-20">
        <SectionHeader
          eyebrow="Selected work"
          title="Projects, written as engineering reports."
          lede="Each case study covers the problem, the architecture, the decisions and their tradeoffs, and what was actually verified. Every one links to its source."
        />

        <div className="mt-10 flex flex-wrap items-center gap-2">
          <Tag tone="accent">{published.length} published</Tag>
          <Tag>{projectCategories.join(' · ')}</Tag>
          <Tag>Public repositories only</Tag>
        </div>
      </Container>

      <div className="hairline-t">
        <Container className="py-16 md:py-20">
          <WorkShowcase projects={published} />
        </Container>
      </div>

      {confidential.length > 0 && (
        <div className="hairline-t bg-canvas-2">
          <Container className="py-16 md:py-20">
            <h2 className="t-h3">Withheld under NDA</h2>
            <p className="t-body mt-3 max-w-[58ch]">
              Some engagements cannot be published in any detail. These are listed so the
              shape of the work is visible — the specifics are available to discuss
              directly, within what the agreement allows.
            </p>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {confidential.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Container>
        </div>
      )}

      <CtaBand
        eyebrow="Your project"
        title="The next case study could be yours."
        body="If you are building something that has to survive production, the scoping conversation — including what it would cost — is the fastest way to find out whether I am the right person for it."
      />
    </>
  );
}

/** Homepage preview: the featured work only. */
export function WorkPreview() {
  const published = projects.filter((p) => !p.featured && !p.confidential);

  return (
    <Section id="work" aria-labelledby="work-title" className="bg-canvas-2">
      <Container className="py-20 md:py-28">
        <div id="work-title">
          <SectionHeader
            index="03"
            eyebrow="Selected work"
            title="Proof, with the architecture attached."
            lede="Not screenshots — the decisions, the topology, the tradeoffs, and the sources you can verify yourself."
            actions={
              <ButtonLink href="/work" variant="secondary">
                All work
                <ArrowRight />
              </ButtonLink>
            }
          />
        </div>

        {/*
          The featured two get the pointer-tracking index, not a card grid. Two
          projects are too few for a grid to say anything, and the section reads
          better as an index you work through than as two boxes side by side.
        */}
        <div className="mt-14">
          <WorkShowcase projects={projects.filter((p) => p.featured)} showSummaryInline />
        </div>

        <Reveal className="mt-5">
          <Link
            href="/work"
            className="group flex items-center justify-between gap-6 rounded-xl border border-dashed border-line-2 p-5 transition-colors duration-300 hover:border-line-3 hover:bg-surface/40 md:p-6"
          >
            <span className="min-w-0">
              <span className="t-label block">Also in the repository</span>
              <span className="t-body-sm mt-2 block max-w-[52ch] text-ink-3">
                {published.length} further public projects — full-stack applications,
                infrastructure and delivery work.
              </span>
            </span>
            <ArrowRight className="shrink-0 text-ink-4 transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
