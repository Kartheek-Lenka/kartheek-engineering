import type { Metadata } from 'next';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { About, Experience } from '@/components/sections/about';
import { Global } from '@/components/sections/global';
import { Technology } from '@/components/sections/technology';
import { CtaBand } from '@/components/sections/cta-band';
import { buildMetadata } from '@/lib/metadata';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = buildMetadata({
  title: `About — ${siteConfig.name}`,
  description:
    'Software engineer working across AI product, full-stack application and cloud engineering. Experience, credentials, and how the work is done.',
  path: '/about',
});

const WHAT_I_VALUE = [
  {
    title: 'Boring, reversible decisions',
    detail:
      'I would rather choose the option that is easy to undo. Reversibility is what makes a fast decision safe, and it matters more than being right the first time.',
  },
  {
    title: 'Written over verbal',
    detail:
      'Decisions, trade-offs and refusals belong in writing. Verbal agreement is how two engineers end up with two different systems.',
  },
  {
    title: 'Say the difficult thing early',
    detail:
      'A timeline that will not hold, a service that does not need to exist, a feature that solves the wrong problem. Cheapest to say in week one.',
  },
  {
    title: 'Ownership past the deploy',
    detail:
      'A launch is not the end of the work. If I built it, I care how it behaves under real traffic three months later.',
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      <Section aria-labelledby="about-page-title">
        <Container className="pt-32 pb-14 md:pt-40 md:pb-16">
          <SectionHeader
            index="01"
            eyebrow="About"
            title="An engineer who takes responsibility for the whole system."
            lede="Based in India, working internationally. Product interface, the data behind it, the infrastructure under that, and the operational work that keeps it dependable."
          />
        </Container>
      </Section>

      <About />
      <Technology />
      <Experience />
      <Global />

      <Section className="py-20 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="t-h2">What I value in the work.</h2>
              <p className="t-body mt-4 max-w-[38ch] text-ink-3">
                Preferences that show up in the decisions, stated so you can judge whether
                they suit you.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {WHAT_I_VALUE.map((item) => (
                  <li key={item.title} className="flex flex-col gap-2 bg-canvas p-5">
                    <h3 className="text-sm font-medium text-ink">{item.title}</h3>
                    <p className="t-body-sm">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Working together"
        title="If that sounds like an engineer you want to work with."
        body="Tell me what you are building. I will tell you honestly whether I am the right person for it."
        secondary={{ href: '/work', label: 'See the work' }}
      />
    </>
  );
}
