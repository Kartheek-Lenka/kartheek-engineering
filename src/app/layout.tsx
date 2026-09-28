import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google';
import { siteConfig } from '@/data/site';
import { personSchema, professionalServiceSchema, websiteSchema } from '@/lib/schema';
import Analytics from '@/components/analytics';
import { TrackedClicks } from '@/components/tracked-clicks';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { RouteAnnouncer } from '@/components/route-announcer';
import { JsonLd } from '@/components/json-ld';
import '../styles/globals.css';

/**
 * Two type systems, deliberately:
 *   1. Geist (sans) + Geist Mono (mono) — the interface and technical layer.
 *   2. Instrument Serif (italic only) — a single editorial accent on display
 *      headlines, used sparingly. No other serif is loaded anywhere.
 * Both are self-hosted by next/font: no render-blocking request to a font CDN,
 * and `display: swap` keeps text visible on a cold cache.
 */
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
  preload: true,
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  preload: false,
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — AI Product, Full-Stack & Cloud Engineer`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    'From idea to production. AI product engineering, full-stack development and cloud infrastructure for founders and teams building serious software.',
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'technology',
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#08090a' },
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark light',
};

/**
 * Runs before first paint to apply the stored theme. Without this the page
 * renders dark, then snaps to light for anyone who chose light — a visible flash
 * and a CLS-adjacent annoyance.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('kl-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaGraph = [personSchema(), websiteSchema(), professionalServiceSchema()];
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-on-accent"
        >
          Skip to content
        </a>

        <ThemeProvider>
          <div className="relative z-10 flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>

        <RouteAnnouncer />
        <JsonLd data={schemaGraph} />
        <Analytics />
        <TrackedClicks />
      </body>
    </html>
  );
}
