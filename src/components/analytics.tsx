import Script from 'next/script';

/**
 * Loads the configured analytics script after hydration.
 *
 * Renders nothing when no provider is configured, which is the default. Both
 * supported providers are cookie-free and privacy-preserving.
 */
export default function Analytics() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? 'none';
  if (provider === 'none') return null;

  if (provider === 'plausible') {
    const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
    if (!domain) return null;
    return (
      <Script
        strategy="afterInteractive"
        data-domain={domain}
        src="https://plausible.io/js/script.js"
        // Plausible is cookieless and does not require consent in most regimes.
        {...({ 'data-keepalive': 'true' } as Record<string, string>)}
      />
    );
  }

  if (provider === 'vercel') {
    return (
      <>
        <Script
          strategy="afterInteractive"
          src="/_vercel/insights/script.js"
          {...({ 'data-keepalive': 'true' } as Record<string, string>)}
        />
      </>
    );
  }

  const custom = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;
  if (!custom) return null;
  return <Script strategy="afterInteractive" src={custom} />;
}
