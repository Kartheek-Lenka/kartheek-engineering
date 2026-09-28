import { Container, Section, SectionHeader } from '@/components/ui/section';
import { DeploymentSimulator } from '@/components/sections/deployment/deployment-simulator';

export function DeploymentSection() {
  return (
    <Section id="deployment" aria-labelledby="deployment-title" className="bg-canvas-2">
      <Container className="py-20 md:py-28">
        <SectionHeader
          index="04"
          id="deployment-title"
          eyebrow="Delivery"
          title="From Git push to production."
          lede="Every application I build is designed around a reliable path from code to production. Run the sequence below — including the part where it goes wrong."
        />

        <DeploymentSimulator />
      </Container>
    </Section>
  );
}
