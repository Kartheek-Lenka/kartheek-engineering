import type { NextConfig } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kartheek.engineering';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // MDX is rendered through next-mdx-remote from `content/`, not as a route
  // extension, so `mdx` is deliberately not listed here.
  pageExtensions: ['ts', 'tsx'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/portfolio', destination: '/work', permanent: true },
      { source: '/projects', destination: '/work', permanent: true },
      { source: '/blog', destination: '/insights', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
    ];
  },
};

export default nextConfig;

export { siteUrl };
