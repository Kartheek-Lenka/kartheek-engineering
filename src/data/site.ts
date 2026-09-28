/**
 * Site-wide configuration.
 *
 * Everything brand- or environment-specific that is not editorial content lives
 * here so it can be changed in one place. See README > Content editing.
 */

export const siteConfig = {
  name: 'Kartheek Lenka',
  role: 'AI Product Engineer · Full-Stack Engineer · Cloud/DevOps Engineer',
  shortRole: 'AI Product & Cloud Engineer',
  domain: 'kartheek.engineering',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kartheek.engineering',
  locale: 'en',
  email: 'kartheeklenka1234@gmail.com',
  location: {
    city: 'Andhra Pradesh',
    region: 'India',
    timezone: 'Asia/Kolkata',
    timezoneLabel: 'IST (UTC+5:30)',
    utcOffset: 5.5,
  },
  social: {
    github: 'https://github.com/Kartheek-Lenka',
    linkedin: 'https://www.linkedin.com/in/kartheek-devops/',
    linkedinAlt: 'https://www.linkedin.com/in/kartheek-lenka-1576b2239',
  },
  availability: {
    // Static, honest statement. Not a live status feed.
    label: 'Available for selected projects',
    detail: 'Taking on one new product engagement at a time.',
  },
  /**
   * Discovery call scheduling. Both are intentionally empty by default so no
   * fake availability is ever advertised. Set one in .env.local to enable the
   * booking CTA (see components/sections/contact.tsx).
   */
  booking: {
    calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? '',
    cal: process.env.NEXT_PUBLIC_CAL_URL ?? '',
  },
} as const;

export const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/process', label: 'Process' },
  { href: '/about', label: 'About' },
  { href: '/insights', label: 'Insights' },
] as const;

export const footerNav = {
  work: [
    { href: '/work', label: 'Selected work' },
    { href: '/work/paatam', label: 'PAATAM' },
    { href: '/work/jiangsu-national-nickel', label: 'Jiangsu National Nickel' },
    { href: '/work/terraform-aws-production', label: 'AWS infrastructure' },
  ],
  services: [
    { href: '/services#ai-product-engineering', label: 'AI product engineering' },
    { href: '/services#full-stack-product-development', label: 'Full-stack development' },
    { href: '/services#cloud-devops', label: 'Cloud & DevOps' },
    { href: '/services#production-engineering', label: 'Production engineering' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/process', label: 'Process' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/insights', label: 'Insights' },
    { href: '/contact', label: 'Contact' },
  ],
} as const;

export default siteConfig;
