import type { Metadata } from 'next';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Pricing } from '@/components/sections/pricing';
import { buildMetadata } from '@/lib/metadata';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { JsonLd } from '@/components/json-ld';
import { pricingFaqs } from '@/data/pricing';

export const metadata: Metadata = buildMetadata({
  title: 'Pricing — starting prices for engineering work',
  description:
    'Starting prices for foundation, product, AI product, production engineering and ongoing engineering engagements. Quoted in USD, with EUR, GBP and INR for budgeting.',
  path: '/pricing',
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]),
          faqSchema(pricingFaqs.map((faq) => ({ q: faq.q, a: faq.a }))),
        ]}
      />

      <Section aria-labelledby="pricing-page-title">
        <Container className="pt-32 pb-14 md:pt-40 md:pb-16">
          <SectionHeader
            index="01"
            eyebrow="Pricing"
            title="Starting prices, stated openly."
            lede="You should be able to budget before the first conversation. These are starting figures that define the shape of an engagement — not quotes."
          />
        </Container>
      </Section>

      <Pricing />
    </>
  );
}
