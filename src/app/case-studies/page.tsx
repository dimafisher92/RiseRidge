import type { Metadata } from 'next';
import { SectionLabel } from '@/components/SectionLabel';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { StatsBar } from '@/components/StatsBar';
import { CaseStudyCard } from '@/components/CaseStudyCard';
import { CTASection } from '@/components/CTASection';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'SEO Case Studies & Results',
  description:
    'Real results from real clients. See how RiseRidge\'s AI-powered SEO drives revenue growth, organic traffic increases, and ranking improvements for e-commerce and growth-stage businesses.',
  alternates: { canonical: '/case-studies' },
  openGraph: {
    title: 'SEO Case Studies & Results | RiseRidge',
    description: 'Proven results: $21K/day revenue, 255% organic growth, 277% revenue increase. See our AI SEO case studies.',
  },
};

const AGGREGATE_STATS = [
  { value: '$25M+', label: 'Revenue Generated' },
  { value: '3x', label: 'Average ROAS' },
  { value: '250+', label: 'Clients Served' },
  { value: '97%', label: 'Client Retention' },
];

const CASE_STUDIES = [
  {
    tag: 'E-Commerce',
    title: 'Scaling Organic Revenue to $21K/Day in Just 4 Months',
    challenge:
      'A growing e-commerce brand was over-reliant on paid advertising with minimal organic presence. Rising CPCs were eating into margins, and the brand had no sustainable organic traffic strategy. Their site had significant technical debt, thin content, and a fragmented site architecture.',
    solution:
      'RiseRidge deployed our AI automation engine for a comprehensive technical audit, identifying and fixing 400+ critical issues in the first week. We rebuilt site architecture based on AI-driven keyword clustering, implemented strategic content silos, and launched an automated internal linking strategy that distributed authority across high-value pages.',
    results: [
      { value: '$21K/day', label: 'Peak Daily Revenue' },
      { value: '340%', label: 'Organic Traffic Growth' },
      { value: '4 months', label: 'Time to Results' },
    ],
  },
  {
    tag: 'DTC Beauty',
    title: '3x ROAS Through Combined SEO & Content Strategy',
    challenge:
      'A DTC beauty brand was struggling with sky-high customer acquisition costs and diminishing returns from paid channels. Despite having quality products, they were invisible in organic search for key category and informational queries. Content was sporadic and not optimized for search intent.',
    solution:
      'Using our Content Intelligence platform, we built a comprehensive topic authority strategy across skincare education, ingredient guides, and product comparisons. Our AI analyzed top-performing content in the beauty space and generated a 90-day content roadmap. Combined with technical SEO improvements and strategic backlink acquisition, the brand became a topical authority.',
    results: [
      { value: '3x', label: 'ROAS Improvement' },
      { value: '185%', label: 'Organic Sessions Growth' },
      { value: '-42%', label: 'Customer Acquisition Cost' },
    ],
  },
  {
    tag: 'SaaS',
    title: '255% Organic Revenue Increase Year-Over-Year',
    challenge:
      'A B2B SaaS platform had plateaued in organic growth after 3 years. Content had become stale, keyword rankings were declining, and competitors were aggressively investing in SEO. The marketing team was small and couldn\'t keep up with the volume of content needed to compete.',
    solution:
      'RiseRidge performed a full technical overhaul using our AI audit engine, then deployed our Content Intelligence platform for programmatic content creation at scale. We identified 2,000+ keyword opportunities through gap analysis, prioritized by revenue potential, and built automated content workflows that increased output by 12x while maintaining quality and brand voice.',
    results: [
      { value: '255%', label: 'Revenue Growth YoY' },
      { value: '420%', label: 'Top 10 Keywords' },
      { value: '12x', label: 'Content Output' },
    ],
  },
  {
    tag: 'Multi-Location Retail',
    title: '277% Revenue Growth Through Local SEO Optimization',
    challenge:
      'A multi-location retailer with 50+ stores had inconsistent local search presence. Google Business Profiles were incomplete, reviews were unmanaged, and local landing pages were duplicate templates with no unique value. They were losing foot traffic to competitors with stronger local SEO.',
    solution:
      'Our Local SEO Management engine optimized all 50+ Google Business Profiles with unique descriptions, categories, and service area targeting. We built unique, AI-generated local landing pages for each location incorporating local keywords, community content, and structured data. Automated review response and monitoring systems kept engagement high.',
    results: [
      { value: '277%', label: 'Revenue Growth' },
      { value: '50+', label: 'Locations Optimized' },
      { value: '#1-3', label: 'Local Pack Rankings' },
    ],
  },
  {
    tag: 'Restricted Niche',
    title: '969% Organic Traffic Growth in a Restricted Advertising Niche',
    challenge:
      'A brand operating in a restricted advertising niche had extremely limited paid marketing options. With only 1,717 monthly organic sessions and 34 checkouts, the business had almost no scalable growth channel.',
    solution:
      'RiseRidge built a full organic growth strategy tailored to restricted-niche compliance, deploying AI-driven keyword targeting, content authority building, and technical SEO optimization to capture search demand competitors couldn\'t reach through paid channels.',
    results: [
      { value: '+969%', label: 'Organic Sessions' },
      { value: '+1200%', label: 'Checkouts Growth' },
      { value: '$63K–$120K/yr', label: 'Revenue Impact' },
    ],
  },
  {
    tag: 'E-Commerce',
    title: '39% Checkout Growth and $70K+ Annual Revenue in Just 60 Days',
    challenge:
      'An e-commerce brand needed rapid, measurable SEO results to justify shifting budget from paid channels. With a $67 AOV and moderate traffic, even small conversion improvements could meaningfully impact revenue.',
    solution:
      'RiseRidge executed a focused 60-day sprint using AI-powered on-page optimization, add-to-cart funnel improvements, and structured content enhancements. Organic sessions grew 15% while add-to-cart rate improved 9%, compounding into a 39% checkout increase.',
    results: [
      { value: '+39%', label: 'Checkouts Growth' },
      { value: '$44.9K/yr', label: 'Organic Revenue Run-Rate' },
      { value: '60 days', label: 'Time to Results' },
    ],
  },
  {
    tag: 'E-Commerce',
    title: '$115K Annual Revenue Run-Rate from 90 Days of SEO Growth',
    challenge:
      'A DTC e-commerce brand with a $122 AOV needed to reduce dependence on paid acquisition and build a sustainable organic revenue channel. Despite decent add-to-cart rates, organic traffic was underperforming relative to market potential.',
    solution:
      'Over a 90-day engagement, RiseRidge deployed comprehensive technical SEO fixes, AI-driven content strategy, and conversion funnel optimization. Organic sessions grew 93%, add-to-cart rate improved 11%, and reached checkouts increased 140% — all while maintaining the store\'s 2.5% conversion rate and $122 AOV.',
    results: [
      { value: '+93%', label: 'Organic Sessions' },
      { value: '+140%', label: 'Checkouts Growth' },
      { value: '$300K–$400K+/yr', label: 'Total Revenue Impact' },
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Case Studies', href: '/case-studies' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <AnimatedBackground />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan mb-6">
            Proven Results
          </p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-ice">
            Real Results.{' '}
            <span className="text-gradient-blue-cyan">Real Growth.</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            See how RiseRidge&apos;s AI-driven SEO has driven measurable revenue growth for
            e-commerce brands, SaaS platforms, and multi-location businesses.
          </p>
        </div>
      </section>

      {/* Aggregate Stats */}
      <StatsBar stats={AGGREGATE_STATS} />

      {/* Case Studies */}
      <section className="py-24" aria-labelledby="case-studies-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="01" text="Case Studies" />
            <h2 id="case-studies-heading" className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ice">
              Client Success Stories
            </h2>
            <p className="mt-4 text-muted max-w-2xl">
              Each engagement begins with our AI-powered audit and evolves into a customized strategy
              designed to deliver measurable, revenue-impacting results.
            </p>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {CASE_STUDIES.map((study, i) => (
              <CaseStudyCard key={study.title} {...study} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="border-t border-border bg-surface/30 py-24" aria-labelledby="methodology-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="02" text="Methodology" />
            <h2 id="methodology-heading" className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ice">
              How We Drive These Results
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'AI-Powered Audit',
                description: 'Our AI scans your entire digital presence — technical health, content gaps, backlink profile, and competitive landscape — in hours, not weeks.',
              },
              {
                step: '02',
                title: 'Custom Strategy',
                description: 'We combine AI-generated insights with human expertise to build a strategy tailored to your industry, audience, and growth goals.',
              },
              {
                step: '03',
                title: 'Continuous Optimization',
                description: 'Our AI doesn\'t stop after launch. It continuously monitors, adapts, and optimizes your strategy based on real-time performance data.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.15}>
                <div className="rounded-xl border border-border bg-navy/40 p-8 h-full">
                  <span className="font-mono text-4xl font-bold text-electric/20">{item.step}</span>
                  <h3 className="mt-3 font-display font-semibold text-xl text-ice">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        heading="Ready to Be Our Next Success Story?"
        description="Book a free consultation and discover how RiseRidge can drive similar results for your business."
        primaryLabel="Get Your Free Audit"
        secondaryLabel="Explore Our Features"
        secondaryHref="/features"
      />
    </>
  );
}
