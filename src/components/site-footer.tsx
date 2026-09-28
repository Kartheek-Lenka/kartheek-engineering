import Link from 'next/link';
import { ArrowRight } from '@/components/ui/button';
import { footerNav, siteConfig } from '@/data/site';
import { Container } from '@/components/ui/section';

const socials = [
  { label: 'LinkedIn', href: siteConfig.social.linkedin, handle: '/in/kartheek-devops' },
  { label: 'GitHub', href: siteConfig.social.github, handle: 'Kartheek-Lenka' },
  { label: 'Email', href: `mailto:${siteConfig.email}`, handle: siteConfig.email },
] as const;

const lifecycle = ['IDEA', 'PRODUCT', 'ENGINEERING', 'CLOUD', 'PRODUCTION', 'SCALE'] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative hairline-t bg-canvas-2">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Identity + positioning */}
          <div className="lg:col-span-5">
            <p className="t-h3 max-w-[18ch] text-balance">
              Take the next step from{' '}
              <span className="t-editorial text-accent-ink">idea</span> to production.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {lifecycle.map((stage, index) => (
                <li key={stage} className="flex items-center gap-6">
                  <span className="t-label">{stage}</span>
                  {index < lifecycle.length - 1 && (
                    <span aria-hidden="true" className="text-ink-4">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-2">
              <Link
                href="/contact"
                className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-ink underline decoration-line-3 underline-offset-[6px] transition-colors duration-200 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Start a project
                <ArrowRight />
              </Link>
              <a
                href={`mailto:${siteConfig.email}`}
                className="t-meta text-ink-3 transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FooterColumn
              title="Work"
              links={footerNav.work.map((l) => ({ href: l.href, label: l.label }))}
            />
            <FooterColumn
              title="Services"
              links={footerNav.services.map((l) => ({ href: l.href, label: l.label }))}
            />
            <FooterColumn
              title="Company"
              links={footerNav.company.map((l) => ({ href: l.href, label: l.label }))}
            />
          </nav>
        </div>

        <div className="mt-16 grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p className="text-sm font-medium text-ink">Kartheek Lenka</p>
            <p className="t-body-sm mt-2 max-w-[34ch] text-ink-3">
              AI product engineering · Full-stack · Cloud · DevOps
            </p>
            <p className="t-meta mt-4 text-ink-4">
              {siteConfig.location.city}, {siteConfig.location.region} ·{' '}
              {siteConfig.location.timezoneLabel}
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-4">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={social.label === 'Email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="group inline-flex items-baseline gap-2 rounded-sm text-sm text-ink-2 transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {social.label}
                  <span className="t-meta max-w-0 overflow-hidden text-ink-4 opacity-0 transition-all duration-300 ease-[var(--ease-out-expo)] group-hover:max-w-52 group-hover:opacity-100 group-focus-visible:max-w-52 group-focus-visible:opacity-100">
                    {social.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="md:col-span-3 md:text-right">
            <p className="t-meta text-ink-4">
              © {year} Kartheek Lenka. All rights reserved.
            </p>
            <p className="t-meta mt-2 text-ink-4">
              Built with Next.js, deployed on Vercel.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="t-label">{title}</h2>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-2 transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span className="relative">
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
