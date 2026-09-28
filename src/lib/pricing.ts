import { currencies, defaultCurrency, type CurrencyCode, type CurrencyDefinition } from '@/data/pricing';

export function getCurrency(code: CurrencyCode): CurrencyDefinition {
  return currencies.find((c) => c.code === code) ?? currencies[0]!;
}

/**
 * Formats a USD amount into the requested display currency.
 *
 * The conversion uses the static indicative rates in data/pricing.ts — not live
 * FX. Callers must present non-USD figures as indicative (see the disclaimer in
 * the pricing section). To move to live rates, replace the `rate` lookup below
 * with a value fetched server-side and passed in.
 */
export function formatPrice(
  usdAmount: number,
  code: CurrencyCode = defaultCurrency,
  options: { monthly?: boolean } = {},
): string {
  const currency = getCurrency(code);
  const converted = usdAmount * currency.rate;

  // Round to a readable figure rather than to cents: these are starting prices.
  const rounded =
    converted >= 1000 ? Math.round(converted / 100) * 100 : Math.round(converted / 50) * 50;

  const formatted = new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(rounded);

  return options.monthly ? `${formatted}/mo` : formatted;
}

export function isIndicative(code: CurrencyCode): boolean {
  return code !== 'USD';
}
