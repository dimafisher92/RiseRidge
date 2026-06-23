'use client';

import Link from 'next/link';
import { useAuditPopup } from './AuditPopup';

export function CTASection({
  heading = 'Ready to Dominate Search?',
  description = 'Get your free AI-powered SEO audit and discover untapped ranking opportunities.',
  primaryLabel = 'Get Your Free Audit',
  secondaryLabel = 'See Our Results',
  secondaryHref = '/case-studies',
}: {
  heading?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  const { open: openAuditPopup } = useAuditPopup();
  return (
    <section className="relative overflow-hidden bg-ink py-28" aria-label="Call to action">
      <div className="animated-grid-bg absolute inset-0 opacity-[0.15]" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display font-semibold text-4xl md:text-5xl text-on-dark leading-[1.05]">{heading}</h2>
        <p className="mt-5 text-lg text-on-ink-muted">{description}</p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={openAuditPopup}
            className="rounded-[3px] bg-brass px-8 py-3.5 font-body font-medium text-ink transition-all duration-300 hover:bg-brass-hover"
          >
            {primaryLabel}
          </button>
          <Link
            href={secondaryHref}
            className="rounded-[3px] border border-on-dark/25 px-8 py-3.5 font-body font-medium text-on-dark transition-all duration-300 hover:border-brass hover:text-brass"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
