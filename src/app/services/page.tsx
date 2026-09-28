import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, SectionHeader, Tag } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { CtaBand } from '@/components/sections/cta-band';
import { services, problemGaps } from '@/data/services';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Services — AI, full-stack and cloud engineering',
  description:
    'Five ways to work together: AI product engineering, full-stack application development, cloud and DevOps, production engineering, and ongoing engineering partnership.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ])}
      />

      <Section aria-labelledby="services-page-title">
        <Container className="pt-32 pb-14 md:pt-40 md:pb-16">
          <SectionHeader
            index="01"
            eyebrow="Services"
            title="Five ways to work together."
            lede="Scoped so you can tell quickly whether this is the right help. Each one states what I do, what you get, and where it usually sits in the life of a product."
          />
        </Container>
      </Section>

      {services.map((service, index) => (
        <Section
          key={service.id}
          id={service.id}
          aria-labelledby={`${service.id}-title`}
          className={index % 2 === 1 ? 'bg-canvas-2' : undefined}
        >
          <Container className="py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-5">
                <p className="t-label text-accent-ink">{service.index}</p>
                <h2 id={`${service.id}-title`} className="t-h2 mt-5 text-balance">
                  {service.title}
                </h2>
                <p className="t-lead mt-5 max-w-[44ch]">{service.summary}</p>
                <p className="t-body mt-5 max-w-[48ch] text-ink-3">{service.description}</p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <ButtonLink
                    href="/contact"
                    variant="primary"
                    data-analytics="service_scope"
                    data-analytics-location={service.id}
                  >
                    Scope this
                  </ButtonLink>
                  {service.proof && (
                    <Link
                      href={`/work/${service.proof.slug}`}
                      className="group t-body-sm inline-flex items-center gap-1.5 text-ink-3 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      data-analytics="service_proof"
                      data-analytics-location={service.id}
                    >
                      {service.proof.label}
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                  <div className="bg-canvas p-5">
                    <h3 className="t-label text-ink-2">Capabilities</h3>
                    <ul className="mt-4 flex flex-col gap-2">
                      {service.capabilities.map((item) => (
                        <li
                          key={item}
                          className="flex items-center justify-between gap-3 font-mono text-[0.8125rem] text-ink-2"
                        >
                          {item}
                          <span aria-hidden="true" className="h-px w-2 shrink-0 bg-line-3" />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-canvas p-5">
                    <h3 className="t-label text-ink-2">What you get</h3>
                    <ul className="mt-4 flex flex-col gap-3">
                      {service.deliverables.map((item) => (
                        <li key={item} className="t-body-sm flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] h-px w-2.5 shrink-0 bg-accent"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* What clients usually hire me to fix */}
      <Section className="py-20 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="t-h2">What clients usually hire me to fix.</h2>
              <p className="t-body mt-4 max-w-[40ch] text-ink-3">
                These are the recurring shapes. If yours is not listed, the first
                conversation will establish whether I can help.
              </p>
              <ButtonLink href="/process" variant="ghost" className="mt-6">
                How the work runs
              </ButtonLink>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {problemGaps.map((gap) => (
                  <li key={gap.title} className="flex flex-col gap-2 bg-canvas p-5">
                    <h3 className="text-sm font-medium text-ink">{gap.title}</h3>
                    <p className="t-body-sm">{gap.detail}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {services.map((service) => (
                  <Link key={service.id} href={`/services#${service.id}`}>
                    <Tag>{service.shortTitle}</Tag>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Pricing"
        title="Starting prices are published, not hidden behind a form."
        body="Pick a tier to see what a starting budget looks like, then tell me what you actually need."
        secondary={{ href: '/pricing', label: 'See pricing' }}
      />
    </>
  );
}
