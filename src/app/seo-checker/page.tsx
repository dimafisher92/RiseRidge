import type { Metadata } from 'next';
import { SectionLabel } from '@/components/SectionLabel';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CTASection } from '@/components/CTASection';
import { JsonLd } from '@/components/JsonLd';
import { SeoChecker } from '@/components/seo-checker/SeoChecker';

export const metadata: Metadata = {
  title: 'Free SEO Website Checker',
  description:
    'Get a free, instant SEO health check for any website. See your score and a plain-English breakdown of what to fix and why it matters for your business — no jargon, no sign-up to start.',
  alternates: { canonical: '/seo-checker' },
  openGraph: {
    title: 'Free SEO Website Checker | ArcWave',
    description:
      'Instantly audit any website and discover what is holding back your search rankings — explained in plain business language.',
  },
};

export default function SeoCheckerPage() {
  return (
    <>
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Free SEO Checker', href: '/seo-checker' },
        ]}
      />

      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20" aria-label="Free SEO checker">
        <AnimatedBackground />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="flex justify-center">
            <SectionLabel number="00" text="Free Tool" />
          </div>
          <h1 className="mt-6 font-display font-[800] text-4xl leading-tight text-ice md:text-6xl">
            Free <span className="text-gradient-blue-cyan">SEO Website Checker</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Enter any website and get an instant SEO health score — with a plain-English breakdown of
            what is working, what is holding you back, and exactly what you gain by fixing it.
          </p>
        </div>
      </section>

      <section className="relative pb-24" aria-label="Run an SEO audit">
        <SeoChecker />
      </section>

      <CTASection
        heading="Turn your report into rankings"
        description="ArcWave fixes every issue in your report and engineers the organic growth that brings real customers."
        primaryLabel="Get Your Free Strategy Call"
        secondaryLabel="See Our Results"
        secondaryHref="/case-studies"
      />
    </>
  );
}
