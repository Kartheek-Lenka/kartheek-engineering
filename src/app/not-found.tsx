import { Container, Section } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { navLinks } from '@/data/site';

/**
 * 404.
 *
 * Not a dead end: restate what the site is, and offer the routes someone
 * probably wanted. A 404 that only says "not found" wastes the visit.
 */
export default function NotFound() {
  return (
    <Section className="pt-32 pb-24 md:pt-44 md:pb-32">
      <Container>
        <div className="max-w-[62ch]">
          <p className="t-label text-accent-ink">404</p>
          <h1 className="t-h1 mt-5 text-balance">This page does not exist.</h1>
          <p className="t-lead mt-6">
            Either the link is wrong or the page moved. Nothing is broken on your side.
          </p>
        </div>

        <div className="mt-14 border-t border-line pt-10">
          <h2 className="t-label">Where you might have been going</h2>
          <ul className="mt-5 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <ButtonLink
                  href={link.href}
                  variant="ghost"
                  className="h-auto w-full justify-between rounded-none px-4 py-4 text-left"
                >
                  {link.label}
                  <span aria-hidden="true">→</span>
                </ButtonLink>
              </li>
            ))}
            <li>
              <ButtonLink
                href="/contact"
                variant="ghost"
                className="h-auto w-full justify-between rounded-none px-4 py-4 text-left"
              >
                Contact
                <span aria-hidden="true">→</span>
              </ButtonLink>
            </li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
