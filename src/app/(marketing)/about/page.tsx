import type { Metadata } from 'next';
import { SectionLabel } from '@/components/SectionLabel';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CTASection } from '@/components/CTASection';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About RiseRidge — AI-Driven SEO Agency',
  description:
    'RiseRidge engineers organic search growth that compounds. AI-powered SEO infrastructure with hands-on strategic execution. Learn about our mission and values.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About RiseRidge — AI-Driven SEO Agency',
    description: 'We engineer organic search growth that compounds. Meet the AI SEO agency built for measurable growth.',
  },
};

const VALUES = [
  {
    title: 'Innovation',
    description: 'We invest heavily in proprietary AI tooling and stay at the cutting edge of search technology. When the landscape shifts, we\'re already there.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: 'Transparency',
    description: 'No black-box promises. We show our work, explain our strategy, and share real-time dashboards so you always know exactly what we\'re doing and why.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  {
    title: 'Results-Driven',
    description: 'We measure success in revenue, not vanity metrics. Every decision we make is aligned with your growth targets and ROI goals.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: 'Partnership',
    description: 'We\'re not just a vendor — we\'re an extension of your team. Your growth is our growth, and we\'re invested in your long-term success.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const DIFFERENTIATORS = [
  {
    title: 'Proprietary AI Technology',
    description: 'We built our own AI-powered SEO platform from the ground up. Unlike agencies using off-the-shelf tools, our technology gives us — and our clients — an unfair advantage.',
  },
  {
    title: 'Data-Driven, Not Opinion-Driven',
    description: 'Every recommendation we make is backed by data. No hunches, no gut feelings — just insights derived from millions of data points processed by our AI.',
  },
  {
    title: 'Speed to Results',
    description: 'Our AI automation engine implements changes faster than any human team. What takes traditional agencies weeks takes us hours, getting you results sooner.',
  },
  {
    title: 'Full-Funnel SEO',
    description: 'We don\'t just drive traffic — we drive revenue. Our strategies are designed around your complete funnel, from awareness to conversion to retention.',
  },
];

const MILESTONES = [
  { year: '2022', title: 'Founded', description: 'RiseRidge launched with a mission to engineer organic search growth that compounds.' },
  { year: '2023', title: 'AI Engine v1', description: 'Released our first AI SEO automation engine, serving 50+ clients.' },
  { year: '2024', title: '$25M+ in Client Revenue', description: 'Crossed $25M in cumulative revenue generated for our clients.' },
  { year: '2025', title: 'LLM Visibility Launch', description: 'Pioneered AI search visibility monitoring across ChatGPT, Claude, Gemini, and Perplexity.' },
  { year: '2026', title: '250+ Clients', description: 'Expanded to serve 250+ e-commerce and growth-stage businesses worldwide.' },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'About', href: '/about' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <AnimatedBackground />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan mb-6">
            About Us
          </p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-ice">
            We Don&apos;t Guess.{' '}
            <span className="text-gradient-blue-cyan">We Navigate.</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            RiseRidge engineers organic search growth that compounds. We combine AI-powered SEO
            infrastructure with hands-on strategic execution to move businesses from invisible to undeniable.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-border py-24" aria-labelledby="mission-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="rounded-2xl border border-electric/30 bg-navy/60 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-electric/10 blur-[100px]" aria-hidden="true" />
              <div className="relative">
                <SectionLabel number="01" text="Mission" />
                <h2 id="mission-heading" className="mt-4 font-display font-semibold text-2xl md:text-4xl text-ice max-w-3xl leading-tight">
                  We help e-commerce and growth-stage businesses{' '}
                  <span className="text-gradient-blue-cyan">dominate organic search</span>{' '}
                  using proprietary AI tooling.
                </h2>
                <p className="mt-6 text-muted leading-relaxed max-w-2xl">
                  In a world of cookie-cutter SEO, we built something different. Our proprietary AI platform
                  doesn&apos;t just recommend changes — it identifies, generates, and deploys optimizations
                  automatically. Your growth arc starts here.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface/30 py-24" aria-labelledby="values-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="02" text="Values" />
            <h2 id="values-heading" className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ice">
              What Drives Us
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="rounded-xl border border-border bg-navy/40 p-8 hover:border-electric/30 transition-all duration-300 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-electric/10 text-electric mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-display font-semibold text-lg text-ice">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose RiseRidge */}
      <section className="py-24" aria-labelledby="why-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="03" text="Differentiators" />
            <h2 id="why-heading" className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ice">
              Why Choose RiseRidge
            </h2>
            <p className="mt-4 text-muted max-w-2xl">
              We&apos;re not another SEO agency. Here&apos;s what makes us fundamentally different.
            </p>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map((diff, i) => (
              <ScrollReveal key={diff.title} delay={i * 0.1}>
                <div className="flex gap-4 items-start p-6 rounded-xl border border-border hover:border-electric/30 transition-all duration-300">
                  <span className="font-mono text-sm text-electric font-bold mt-1">0{i + 1}</span>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-ice">{diff.title}</h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed">{diff.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-border bg-surface/30 py-24" aria-labelledby="timeline-heading">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal>
            <SectionLabel number="04" text="Journey" />
            <h2 id="timeline-heading" className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ice">
              Our Story
            </h2>
          </ScrollReveal>
          <div className="mt-12 relative">
            {/* Timeline line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border" aria-hidden="true" />
            <div className="space-y-8">
              {MILESTONES.map((milestone, i) => (
                <ScrollReveal key={milestone.year} delay={i * 0.1}>
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-navy border border-border flex items-center justify-center relative z-10">
                      <span className="font-mono text-xs text-electric font-bold">{milestone.year}</span>
                    </div>
                    <div className="pt-3">
                      <h3 className="font-display font-semibold text-lg text-ice">{milestone.title}</h3>
                      <p className="mt-1 text-sm text-muted">{milestone.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        heading="Let's Engineer Your Growth Together"
        description="Ready to see what AI-driven SEO can do for your business? Let's talk."
        primaryLabel="Start a Conversation"
        secondaryLabel="View Case Studies"
        secondaryHref="/case-studies"
      />
    </>
  );
}
