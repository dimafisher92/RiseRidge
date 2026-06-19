import type { Metadata } from 'next';
import { SectionLabel } from '@/components/SectionLabel';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CTASection } from '@/components/CTASection';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'AI SEO Tools & Features',
  description:
    'Explore RiseRidge\'s AI-powered SEO toolkit: automation engine, content intelligence, rank tracking, technical audits, backlink analysis, LLM visibility monitoring, and more.',
  alternates: { canonical: '/features' },
  openGraph: {
    title: 'AI SEO Tools & Features | RiseRidge',
    description: 'Discover the full suite of AI-powered SEO tools that power our clients\' organic growth.',
  },
};

const FEATURES = [
  {
    number: '01',
    label: 'Automation',
    title: 'AI SEO Automation Engine',
    description: 'Our proprietary AI engine continuously crawls your site, identifies technical SEO issues, generates optimized fixes, and deploys changes automatically. No manual intervention required — just approve and watch your site health improve.',
    capabilities: [
      'Automated technical issue detection and resolution',
      'Smart crawl scheduling based on site priority',
      'One-click deployment of optimization recommendations',
      'Continuous monitoring with instant alerts',
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    number: '02',
    label: 'Content',
    title: 'Content Intelligence',
    description: 'Create SEO-optimized content at scale with AI that understands your brand voice. Build topic clusters, plan editorial calendars, and generate everything from blog posts to product descriptions — all optimized for search intent.',
    capabilities: [
      'AI content writer that mimics your brand style',
      'Topic cluster and content silo builder',
      'Editorial calendar and content planner',
      'On-page SEO scoring and optimization',
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    number: '03',
    label: 'Keywords',
    title: 'Keyword Discovery & Rank Tracking',
    description: 'Uncover high-intent keyword opportunities your competitors are missing. Track positions across search engines in real-time with AI-powered insights that surface actionable opportunities before your competition.',
    capabilities: [
      'High-intent keyword opportunity discovery',
      'Real-time rank tracking across all search engines',
      'Competitor keyword gap analysis',
      'Search intent classification and mapping',
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    number: '04',
    label: 'Technical',
    title: 'Technical Site Audits',
    description: 'Comprehensive technical SEO audits powered by AI that goes beyond surface-level checks. Our engine analyzes core web vitals, crawlability, indexation, structured data, and hundreds of other factors with 24/7 monitoring.',
    capabilities: [
      'Full-site crawl with 300+ technical checks',
      '24/7 uptime and performance monitoring',
      'Core Web Vitals tracking and optimization',
      'Structured data validation and generation',
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    number: '05',
    label: 'Backlinks',
    title: 'Backlink Intelligence',
    description: 'Deep-dive into any backlink profile with AI-powered analysis. Identify link-building opportunities, detect toxic links before they hurt your rankings, and monitor competitor link acquisition strategies in real-time.',
    capabilities: [
      'Complete backlink profile analysis',
      'Toxic link detection and disavow recommendations',
      'Competitor backlink gap analysis',
      'Link-building opportunity discovery',
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    number: '06',
    label: 'Explorer',
    title: 'Site Explorer',
    description: 'Get a 360-degree view of any domain\'s search performance. Analyze competitors, identify ranking opportunities, and monitor performance trends — all from one powerful dashboard powered by real search data.',
    capabilities: [
      'Complete domain analysis and comparison',
      'Top-performing pages and content identification',
      'Organic traffic estimation and trends',
      'Ranking keyword distribution analysis',
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    number: '07',
    label: 'AI Visibility',
    title: 'LLM Visibility Monitor',
    description: 'Monitor how your brand appears across AI search platforms like ChatGPT, Claude, Gemini, and Perplexity. Track visibility scores, sentiment, citation sources, and competitive positioning in the new AI-powered search landscape.',
    capabilities: [
      'Brand mention tracking across all major LLMs',
      'Visibility scoring and sentiment analysis',
      'Citation source identification and optimization',
      'Competitive AI visibility benchmarking',
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: '08',
    label: 'Authority',
    title: 'Domain Authority Metrics',
    description: 'Our proprietary domain authority metric uses real search performance data — organic traffic and ranking keywords — rather than easily manipulated backlink counts. Get an honest, accurate picture of any site\'s true search authority.',
    capabilities: [
      'Proprietary authority metric based on real search data',
      'Manipulation-resistant scoring methodology',
      'Historical authority trend tracking',
      'Industry-specific authority benchmarking',
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    number: '09',
    label: 'Local',
    title: 'Local SEO Management',
    description: 'Manage and optimize your presence across all local search touchpoints. From Google Business Profile optimization to service area targeting, our AI ensures you dominate local search results across every location.',
    capabilities: [
      'Google Business Profile optimization and management',
      'Multi-location listing management at scale',
      'Service area business targeting',
      'Local review monitoring and response management',
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Features', href: '/features' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <AnimatedBackground />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan mb-6">
            Our Toolkit
          </p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-ice">
            AI SEO Tools Built for{' '}
            <span className="text-gradient-blue-cyan">Results</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Nine powerful AI-driven tools that work together to automate, optimize, and scale your organic search performance.
          </p>
        </div>
      </section>

      {/* Feature Blocks */}
      {FEATURES.map((feature, i) => (
        <section
          key={feature.number}
          className={`py-20 border-t border-border ${i % 2 === 1 ? 'bg-surface/30' : ''}`}
          aria-labelledby={`feature-${feature.number}-heading`}
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
              <ScrollReveal className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                <SectionLabel number={feature.number} text={feature.label} />
                <h2 id={`feature-${feature.number}-heading`} className="mt-4 font-display font-semibold text-2xl md:text-3xl text-ice">
                  {feature.title}
                </h2>
                <p className="mt-4 text-muted leading-relaxed">{feature.description}</p>
                <ul className="mt-6 space-y-3">
                  {feature.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-3 text-sm text-muted">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E3A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {cap}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
              <ScrollReveal delay={0.2} className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <div className="rounded-xl border border-border bg-navy/40 p-8 aspect-[4/3] flex flex-col items-center justify-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-electric/10 text-electric">
                    {feature.icon}
                  </div>
                  <span className="font-mono text-xs text-muted uppercase tracking-wider">{feature.title}</span>
                  {/* Decorative mock dashboard */}
                  <div className="w-full max-w-xs space-y-2 mt-4">
                    <div className="h-2 rounded-full bg-electric/20 w-full" />
                    <div className="h-2 rounded-full bg-electric/15 w-4/5" />
                    <div className="h-2 rounded-full bg-electric/10 w-3/5" />
                    <div className="flex gap-2 mt-3">
                      <div className="h-8 rounded bg-electric/10 flex-1" />
                      <div className="h-8 rounded bg-cyan/10 flex-1" />
                      <div className="h-8 rounded bg-gold/10 flex-1" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <CTASection
        heading="Ready to See These Tools in Action?"
        description="Book a demo and discover how RiseRidge's toolkit can transform your organic search performance."
        primaryLabel="Book a Demo"
      />
    </>
  );
}
