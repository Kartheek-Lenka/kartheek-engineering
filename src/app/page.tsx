import { Hero } from '@/components/sections/hero';
import { Problem } from '@/components/sections/problem';
import { ServicesSection } from '@/components/sections/services';
import { WorkPreview } from '@/components/case-studies/work-sections';
import { DeploymentSection } from '@/components/sections/deployment';
import { Architecture } from '@/components/sections/architecture';
import { Process } from '@/components/sections/process';
import { AiAssisted } from '@/components/sections/ai-assisted';
import { Technology } from '@/components/sections/technology';
import { About, Experience } from '@/components/sections/about';
import { Global } from '@/components/sections/global';
import { Contact } from '@/components/sections/contact';
import { Insights } from '@/components/sections/insights';

/**
 * Homepage.
 *
 * The order is the argument: what is broken, how it is fixed, proof, then the
 * mechanism (delivery, architecture, process), then the person, and how to make
 * contact.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <ServicesSection />
      <WorkPreview />
      <DeploymentSection />
      <Architecture />
      <Process />
      <AiAssisted />
      <Technology />
      <About />
      <Experience />
      <Global />
      <Insights />
      <Contact />
    </>
  );
}
