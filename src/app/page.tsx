import type { Metadata } from 'next';
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
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/data/site';

/**
 * The homepage needs its own metadata. Without an export here it inherited only
 * the root layout defaults, which carry no canonical URL and no Open Graph tags
 * — so the most linked-to page shipped without a canonical and rendered bare in
 * link previews on WhatsApp, Slack and iMessage.
 */
export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — AI Product, Full-Stack & Cloud Engineer`,
  titleAbsolute: true,
  description:
    'From idea to production. AI product engineering, full-stack development and cloud infrastructure for founders and teams building serious software.',
  path: '/',
});

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
