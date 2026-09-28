'use client';

import { useState } from 'react';
import {
  currencies,
  defaultCurrency,
  nonBaseCurrencies,
  pricingFactors,
  pricingFaqs,
  pricingTiers,
  type CurrencyCode,
} from '@/data/pricing';
import { formatPrice, isIndicative } from '@/lib/pricing';
import { track } from '@/lib/analytics-client';
import { Container, Section, SectionHeader, Tag } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/animations/reveal';
import { CtaBand } from '@/components/sections/cta-band';
import { cn } from '@/lib/utils';

export function Pricing() {
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);
  const indicative = isIndicative(currency);

  return (
    <Section id="pricing" aria-labelledby="pricing-title">
      <Container className="py-20 md:py-28">
          <SectionHeader
            index="11"
            eyebrow="Pricing"
            id="pricing-title"
            title="Starting prices, stated openly."
            lede="You should be able to budget before the first conversation. These are starting figures that define the shape of an engagement — not quotes. Final pricing is fixed in a written proposal once scope is agreed."
          />

        {/* Currency switcher */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div
            role="group"
            aria-label="Display currency"
            className="flex items-center gap-1 rounded-lg border border-line bg-surface/40 p-1"
          >
            {currencies.map((option) => {
              const active = option.code === currency;
              return (
                <button
                  key={option.code}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setCurrency(option.code);
                    track({ name: 'currency_switch', currency: option.code, location: 'pricing' });
                  }}
                  className={cn(
                    'rounded-md px-3 py-1.5 font-mono text-[0.8125rem] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    active
                      ? 'bg-accent text-on-accent'
                      : 'text-ink-3 hover:bg-surface-2 hover:text-ink',
                  )}
                >
                  {option.code}
                </button>
              );
            })}
          </div>

          <p className="t-meta text-ink-4">
            {indicative
              ? `Indicative conversion · ${currency} · rates are static, not live FX`
              : 'Base currency · final price is fixed in the proposal'}
          </p>
        </div>

        {/* Tiers */}
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-2">
          {pricingTiers.map((tier, index) => (
            <Reveal
              key={tier.id}
              delay={index * 50}
              className={cn(
                'flex flex-col gap-5 bg-canvas p-5 transition-colors duration-300 hover:bg-surface md:p-7',
                tier.highlighted && 'bg-surface/40',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="t-h2">{tier.name}</h3>
                  <p className="t-meta mt-2">{tier.position}</p>
                </div>
                {tier.highlighted && <Tag tone="accent">Most common</Tag>}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl tracking-tight text-ink md:text-4xl">
                  {formatPrice(tier.usd, currency, { monthly: tier.monthly })}
                </span>
                <span className="t-meta text-ink-4">{indicative ? 'est.' : 'from'}</span>
              </div>

              <p className="t-body max-w-[46ch]">{tier.summary}</p>

              <ul className="flex flex-col gap-2.5">
                {tier.includes.map((item) => (
                  <li key={item} className="t-body-sm flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] h-px w-2.5 shrink-0 bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <dl className="mt-auto flex flex-col gap-2 border-t border-line pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="t-label">Timeline</dt>
                  <dd className="t-body-sm text-ink-2">{tier.timeline}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="t-label">Best for</dt>
                  <dd className="t-body-sm text-ink-2">{tier.bestFor}</dd>
                </div>
              </dl>

              <ButtonLink
                href="/contact"
                variant={tier.highlighted ? 'primary' : 'secondary'}
                className="self-start"
                data-analytics="pricing_tier"
                data-analytics-location="pricing"
              >
                Scope this
              </ButtonLink>
            </Reveal>
          ))}
        </div>

        {/* What moves the price */}
        <div className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h3 className="t-h2">What moves the number.</h3>
            <p className="t-body mt-4 max-w-[44ch]">
              Starting prices assume a reasonably well-defined scope. These are the factors
              that most often change the final figure — and they are all things we can agree
              before anyone commits to a date.
            </p>
          </div>
          <div className="lg:col-span-7">
            <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
              {pricingFactors.map((factor) => (
                <div key={factor.label} className="flex flex-col gap-1.5 bg-canvas p-4">
                  <dt className="text-sm font-medium text-ink">{factor.label}</dt>
                  <dd className="t-body-sm">{factor.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h3 className="t-h2">Questions worth answering first.</h3>
            <p className="t-body mt-4 max-w-[36ch]">
              If something is not answered here, ask directly — better than an assumption.
            </p>
            <ButtonLink href="/contact" variant="ghost" className="mt-5">
              Ask a question
            </ButtonLink>
          </div>
          <div className="lg:col-span-8">
            <dl className="flex flex-col">
              {pricingFaqs.map((faq) => (
                <div key={faq.q} className="hairline-b py-5 last:border-b-0">
                  <dt className="text-sm font-medium text-ink">{faq.q}</dt>
                  <dd className="t-body mt-2.5 max-w-[62ch]">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {nonBaseCurrencies.length > 0 && (
          <p className="t-meta mt-10 text-ink-4">
            Prices quoted in USD. Converted figures use static indicative rates and are for
            budgeting only.
          </p>
        )}
      </Container>

      <CtaBand
        eyebrow="Next step"
        title="Tell me what you are building."
        body="A short message about the product, the constraint and the deadline is enough to start a useful conversation."
      />
    </Section>
  );
}
