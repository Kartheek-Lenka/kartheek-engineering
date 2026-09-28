import { Container, Section, SectionHeader } from '@/components/ui/section';
import { ArchitectureSection } from '@/components/sections/architecture-diagram';
import { CtaBand } from '@/components/sections/cta-band';

export function Architecture() {
  return (
    <Section id="architecture" aria-labelledby="architecture-title">
      <Container className="py-20 md:py-28">
        <SectionHeader
          index="05"
          id="architecture-title"
          eyebrow="Architecture"
          title="Engineering beyond the UI."
          lede="Anyone can build an interface. The difference shows up in what happens after the demo ends: how requests move, how releases ship, and how the system tells you something is wrong."
        />

        <ArchitectureSection />

        <CtaBand
          eyebrow="Production"
          title="The half of the work nobody sees is the half that matters."
          body="If your product works in a demo and struggles in production, that gap is exactly what this is about."
          secondary={{ href: '/process', label: 'How I work' }}
        />
      </Container>
    </Section>
  );
}
