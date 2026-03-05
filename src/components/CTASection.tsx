import Link from 'next/link';

export function CTASection({
  heading = 'Ready to Dominate Search?',
  description = 'Get your free AI-powered SEO audit and discover untapped ranking opportunities.',
  primaryLabel = 'Get Your Free Audit',
  primaryHref = '/#contact',
  secondaryLabel = 'See Our Results',
  secondaryHref = '/case-studies',
}: {
  heading?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-navy py-24" aria-label="Call to action">
      <div className="animated-grid-bg absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-electric/10 blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display font-[800] text-3xl md:text-5xl text-ice">{heading}</h2>
        <p className="mt-4 text-lg text-muted">{description}</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primaryHref}
            className="rounded-lg bg-electric px-8 py-3.5 font-body font-medium text-white transition-all duration-300 hover:bg-signal hover:glow-blue"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="rounded-lg border border-border px-8 py-3.5 font-body font-medium text-ice transition-all duration-300 hover:border-electric hover:text-electric"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
