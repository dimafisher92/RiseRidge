import Link from 'next/link';
import { HeroSection } from '@/components/HeroSection';
import { StatsBar } from '@/components/StatsBar';
import { SectionLabel } from '@/components/SectionLabel';
import { FeatureCard } from '@/components/FeatureCard';
import { CTASection } from '@/components/CTASection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { JsonLd } from '@/components/JsonLd';

const SERVICES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'AI SEO Automation',
    description: 'Our AI engine identifies technical issues, generates optimized fixes, and deploys changes automatically — no manual intervention needed.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Content Intelligence',
    description: 'AI-powered content creation, topic clusters, and editorial planning that builds topical authority and drives organic traffic.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Rank Tracking & Analytics',
    description: 'Real-time keyword position monitoring, competitor tracking, and actionable insights powered by AI-driven analytics.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: 'Technical SEO Audits',
    description: 'Comprehensive site audits with 24/7 monitoring, issue detection, and automated resolution for peak search performance.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Audit',
    description: 'We deploy our AI to scan your entire digital presence — technical health, content gaps, backlink profile, and competitive landscape.',
  },
  {
    number: '02',
    title: 'Strategize',
    description: 'Our team builds a data-driven roadmap combining AI automation with expert strategy, tailored to your industry and growth goals.',
  },
  {
    number: '03',
    title: 'Dominate',
    description: 'Watch your rankings climb as our AI continuously optimizes, monitors, and adapts your SEO strategy in real-time.',
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd type="website" />

      {/* Hero */}
      <HeroSection />

      {/* Stats */}
      <StatsBar />

      {/* Services Overview */}
      <section className="py-24" aria-labelledby="services-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="01" text="Services" />
            <h2 id="services-heading" className="mt-4 font-display font-[800] text-3xl md:text-4xl text-ice">
              AI-Powered SEO Solutions
            </h2>
            <p className="mt-4 text-muted max-w-2xl">
              From technical audits to content strategy, our AI-powered toolkit handles every aspect of your organic growth.
            </p>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, i) => (
              <FeatureCard key={service.title} {...service} index={i} />
            ))}
          </div>
          <ScrollReveal delay={0.3} className="mt-8 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-sm text-electric hover:text-signal transition-colors font-medium"
            >
              Explore all features
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-surface/30 py-24" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="02" text="Process" />
            <h2 id="process-heading" className="mt-4 font-display font-[800] text-3xl md:text-4xl text-ice">
              How It Works
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.15}>
                <div className="relative p-8 rounded-xl border border-border bg-navy/40 hover:border-electric/30 transition-all duration-300">
                  <span className="font-mono text-4xl font-bold text-electric/20">{step.number}</span>
                  <h3 className="mt-2 font-display font-bold text-xl text-ice">{step.title}</h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-24" aria-labelledby="featured-case-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="03" text="Results" />
            <h2 id="featured-case-heading" className="mt-4 font-display font-[800] text-3xl md:text-4xl text-ice">
              Proven Results
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-12 rounded-2xl border border-border bg-navy/60 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block rounded-full bg-electric/10 px-3 py-1 font-mono text-xs text-electric uppercase tracking-wider">
                  E-Commerce
                </span>
                <h3 className="mt-4 font-display font-bold text-2xl text-ice">
                  Scaled Organic Revenue to $21K/Day in 4 Months
                </h3>
                <p className="mt-4 text-muted leading-relaxed">
                  An e-commerce brand over-reliant on paid ads partnered with RankPilot. We deployed our AI automation engine for a full technical overhaul, rebuilt site architecture, and implemented strategic content clusters.
                </p>
                <Link
                  href="/case-studies"
                  className="mt-6 inline-flex items-center gap-2 text-sm text-electric hover:text-signal transition-colors font-medium"
                >
                  Read all case studies
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '$21K/day', label: 'Peak Revenue' },
                  { value: '340%', label: 'Traffic Growth' },
                  { value: '4 mo', label: 'Time to Results' },
                  { value: '#1-3', label: 'Avg Position' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-surface/80 p-5 text-center border border-border">
                    <div className="font-mono text-xl font-bold text-gold">{stat.value}</div>
                    <div className="mt-1 text-[10px] text-muted uppercase tracking-wider font-mono">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-t border-border py-16" aria-label="Trusted by leading brands">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-xs text-muted uppercase tracking-widest font-mono mb-8">
            Trusted by Growth-Stage Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
            {['TechScale', 'GrowthLab', 'NovaBrand', 'PixelForge', 'DataCore', 'ShopNova'].map((name) => (
              <div key={name} className="font-display font-bold text-xl text-ice/60">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
