import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionLabel } from '@/components/SectionLabel';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { StatsBar } from '@/components/StatsBar';
import { CTASection } from '@/components/CTASection';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Rank on AI Search — LLM Visibility',
  description:
    'Optimize your brand visibility across AI search platforms like ChatGPT, Claude, Gemini, and Perplexity. Monitor, measure, and improve how AI recommends your business.',
  alternates: { canonical: '/rank-on-ai' },
  openGraph: {
    title: 'Rank on AI Search — LLM Visibility | ArcWave',
    description: 'The future of search is AI. Make sure your brand is visible when AI answers questions about your industry.',
  },
};

const AI_STATS = [
  { value: '40%', label: 'Searches via AI by 2026' },
  { value: '4B+', label: 'Monthly AI Search Queries' },
  { value: '62%', label: 'Users Trust AI Answers' },
  { value: '5x', label: 'Growth in AI Search YoY' },
];

const STEPS = [
  {
    number: '01',
    title: 'Monitor',
    description: 'Track how your brand appears across ChatGPT, Claude, Gemini, and Perplexity. Our AI monitors daily query data, analyzes responses, and quantifies your visibility score.',
    details: [
      'Daily brand mention tracking across all major LLMs',
      'Visibility score quantification and trending',
      'Sentiment analysis of AI-generated mentions',
      'Citation source identification',
    ],
  },
  {
    number: '02',
    title: 'Optimize',
    description: 'Implement targeted strategies to improve how AI models understand and recommend your brand. From content structure to entity optimization, we make your brand AI-friendly.',
    details: [
      'Content restructuring for AI comprehension',
      'Entity and knowledge graph optimization',
      'Authority signal amplification',
      'AI-friendly schema markup implementation',
    ],
  },
  {
    number: '03',
    title: 'Measure',
    description: 'Track the impact of optimization efforts with detailed analytics. Compare your AI visibility against competitors and measure ROI from AI-driven referral traffic.',
    details: [
      'Competitive AI visibility benchmarking',
      'AI referral traffic attribution',
      'ROI measurement and reporting',
      'Monthly visibility trend analysis',
    ],
  },
];

const BENEFITS = [
  {
    title: 'First-Mover Advantage',
    description: 'Most businesses haven\'t started optimizing for AI search. Getting ahead now means establishing dominance before your competitors even realize the opportunity.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: 'Beyond Traditional SEO',
    description: 'AI models don\'t just read your meta tags — they understand context, authority, and relevance at a deeper level. Our approach goes beyond traditional SEO to optimize for AI comprehension.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'Measurable Impact',
    description: 'Unlike vague "brand awareness" metrics, our LLM visibility monitoring gives you concrete scores, rankings, and competitive benchmarks you can act on.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: 'Future-Proof Strategy',
    description: 'As AI search continues to grow, brands optimized for LLM visibility will capture an increasing share of high-intent traffic that traditional SEO alone can\'t reach.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function RankOnAIPage() {
  return (
    <>
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Rank on AI', href: '/rank-on-ai' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <AnimatedBackground />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan mb-6">
            The New Frontier
          </p>
          <h1 className="font-display font-[800] text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-ice">
            The Future of Search{' '}
            <span className="text-gradient-blue-cyan">is AI</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Millions of people now use AI assistants like ChatGPT, Claude, Gemini, and Perplexity
            instead of Google. Is your brand visible when AI answers questions about your industry?
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-lg bg-electric px-8 py-3.5 font-body font-medium text-white transition-all duration-300 hover:bg-signal hover:glow-blue"
            >
              Check Your AI Visibility
            </Link>
            <Link
              href="/features"
              className="rounded-lg border border-border px-8 py-3.5 font-body font-medium text-ice transition-all duration-300 hover:border-electric hover:text-electric"
            >
              See Our Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Why It Matters Stats */}
      <StatsBar stats={AI_STATS} />

      {/* Why It Matters */}
      <section className="py-24" aria-labelledby="why-matters-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="01" text="The Shift" />
            <h2 id="why-matters-heading" className="mt-4 font-display font-[800] text-3xl md:text-4xl text-ice">
              Why AI Search Visibility Matters
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="rounded-xl border border-border bg-navy/60 p-8">
                <h3 className="font-display font-bold text-xl text-ice mb-4">The Problem</h3>
                <p className="text-muted leading-relaxed">
                  Traditional SEO focuses on Google&apos;s blue links. But AI assistants synthesize information
                  differently — they don&apos;t show 10 results, they give one answer. If your brand isn&apos;t
                  part of that answer, you&apos;re invisible to a rapidly growing segment of searchers.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'AI assistants give one synthesized answer, not 10 links',
                    'Users trust AI responses more than traditional search ads',
                    'AI search is growing 5x year-over-year',
                    'Most competitors haven\'t started optimizing for AI yet',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="rounded-xl border border-electric/30 bg-navy/60 p-8">
                <h3 className="font-display font-bold text-xl text-ice mb-4">The Opportunity</h3>
                <p className="text-muted leading-relaxed">
                  Brands that optimize for AI visibility now will capture an outsized share of this
                  emerging channel. ArcWave&apos;s LLM Visibility Monitor gives you the tools to
                  track, optimize, and measure your AI search presence.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Monitor brand mentions across ChatGPT, Claude, Gemini, Perplexity',
                    'Track visibility scores and sentiment in real-time',
                    'Identify which sources AI cites — and become one of them',
                    'Benchmark against competitors in AI search results',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How ArcWave Helps — 3-Step Process */}
      <section className="border-t border-border bg-surface/30 py-24" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="02" text="Our Process" />
            <h2 id="process-heading" className="mt-4 font-display font-[800] text-3xl md:text-4xl text-ice">
              How We Improve Your AI Visibility
            </h2>
          </ScrollReveal>
          <div className="mt-12 space-y-8">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.1}>
                <div className="rounded-xl border border-border bg-navy/40 p-8 md:p-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8">
                  <div className="font-mono text-5xl font-bold text-electric/20">{step.number}</div>
                  <div>
                    <h3 className="font-display font-bold text-2xl text-ice">{step.title}</h3>
                    <p className="mt-3 text-muted leading-relaxed">{step.description}</p>
                    <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-sm text-muted">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="03" text="Benefits" />
            <h2 id="benefits-heading" className="mt-4 font-display font-[800] text-3xl md:text-4xl text-ice">
              Why Optimize for AI Search Now
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {BENEFITS.map((benefit, i) => (
              <ScrollReveal key={benefit.title} delay={i * 0.1}>
                <div className="rounded-xl border border-border bg-navy/40 p-8 hover:border-electric/30 transition-all duration-300 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-electric/10 text-electric mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-ice">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{benefit.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        heading="Is Your Brand Visible to AI?"
        description="Get a free AI visibility audit and find out how your brand appears across ChatGPT, Claude, Gemini, and Perplexity."
        primaryLabel="Get Your AI Visibility Report"
        secondaryLabel="Learn About Our Tools"
        secondaryHref="/features"
      />
    </>
  );
}
