import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Services } from '@/components/sections/services-accordion';
import { ButtonLink, ArrowRight } from '@/components/ui/button';

export function ServicesSection() {
  return (
    <Section id="services" aria-labelledby="services-heading" className="bg-canvas-2">
      <Container className="py-20 md:py-28">
        <div>
          <SectionHeader
            index="02"
            eyebrow="Services"
            title="Five ways I take responsibility for a system."
            id="services-heading"
            lede="Each engagement covers a different failure mode. Most projects need two of them at once — a product and the infrastructure to run it."
            actions={
              <ButtonLink
                href="/services"
                variant="secondary"
                data-analytics="services_full_detail"
                data-analytics-location="services"
              >
                Full service detail
                <ArrowRight />
              </ButtonLink>
            }
          />
        </div>

        <Services />
      </Container>
    </Section>
  );
}
