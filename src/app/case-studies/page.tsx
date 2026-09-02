import type { Metadata } from 'next';
import { SectionLabel } from '@/components/SectionLabel';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { StatsBar } from '@/components/StatsBar';
import { CaseStudyCard } from '@/components/CaseStudyCard';
import {
  FeaturedCaseStudy,
  EvidenceCard,
  CaseStudyTable,
  CaseStudyStatGrid,
} from '@/components/FeaturedCaseStudy';
import { ComparisonBarsChart, PositionTrendChart } from '@/components/CaseStudyCharts';
import { CTASection } from '@/components/CTASection';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'SEO Case Studies & Results',
  description:
    'Real results from real clients. See how RiseRidge\'s AI-powered SEO drives revenue growth, organic traffic increases, and ranking improvements — including +102% organic revenue across two Shopify stores and 71 phone calls for a local auto-glass shop.',
  alternates: { canonical: '/case-studies' },
  openGraph: {
    title: 'SEO Case Studies & Results | RiseRidge',
    description: 'Proven results: +102% Shopify organic revenue, page-one rankings for local service, $21K/day peak revenue. See our AI SEO case studies.',
  },
};

const AGGREGATE_STATS = [
  { value: '$25M+', label: 'Revenue Generated' },
  { value: '3x', label: 'Average ROAS' },
  { value: '250+', label: 'Clients Served' },
  { value: '97%', label: 'Client Retention' },
];

const SHOPIFY_STUDY = {
  number: '01',
  category: 'E-Commerce · Two Shopify Stores',
  headingId: 'featured-shopify',
  title: '“Is it the ads — or the SEO?” We doubled organic revenue and proved it.',
  intro:
    'A DTC travel-bag store runs two Shopify stores — an English/US flagship and a Spanish/LATAM sister site. The founder asked a fair question: how much of the recent growth was really SEO, and how much was simply a bigger ad budget? We answered with numbers advertising cannot produce — every figure below is drawn from Google Search Console and Shopify’s organic-only channel, which structurally exclude paid traffic.',
  sections: [
    {
      heading: 'The Challenge',
      body:
        'Growth was climbing, but paid and organic were tangled together in the reporting, so the SEO investment couldn’t be defended on its own merits. A near-identical third domain used for Google Ads was also splitting ranking power with the flagship. We needed to isolate organic performance and prove causation, not just correlation.',
    },
    {
      heading: 'What We Did',
      body:
        'On the flagship: 221 on-page fixes across all 54 pages, product & review schema on 7 product pages, and full internal linking (46/46) funnelling authority to the money page. On the Spanish store: a full technical audit, semantic foundation (28/28), canonicals (5/5), Open Graph, and four LATAM-targeted blog posts. We also pointed canonicals plus a site-wide noindex from the ads store to the flagship — so paid protects, rather than cannibalises, organic.',
    },
    {
      heading: 'The Clearest Proof It’s SEO',
      body:
        'Rich product snippets (price + “In Stock” shown directly in Google) exist only because we deployed structured data. That single change took product-snippet impressions from 866 to 34,257 and clicks from 48 to 1,943. No ad budget can generate an organic rich snippet — it is earned purely through on-page SEO.',
    },
  ],
  metrics: [
    { value: '+102%', label: 'Flagship Organic Revenue' },
    { value: '+106% / +189%', label: 'Organic Clicks · EN / ES' },
    { value: '34,257', label: 'Rich-Snippet Impressions' },
  ],
};

const AUTO_GLASS_STUDY = {
  number: '02',
  category: 'Local Service · Auto Glass · Charlotte, NC',
  headingId: 'featured-auto-glass',
  title: 'From invisible to page one — 71 phone calls in a local shop’s first 90 days.',
  intro:
    'A mobile auto-glass & windshield-repair shop in Charlotte, NC came to us effectively invisible in Google. Every one of its ten pages was missing the titles, descriptions, image labels and structured data search engines rely on — and nothing was being measured at all. We rebuilt the foundation, then turned that visibility into phone calls. Every figure below is drawn from Google Search Console and the business’s Google Business Profile.',
  sections: [
    {
      heading: 'The Challenge',
      body:
        'The site sat in the middle of page two — an average Google position of 15.5, where almost no one looks. An audit surfaced 114 technical faults, a site-health score of zero, empty page titles and descriptions across all ten pages, 39 unlabelled photos, and no analytics connected at all — so no one could see what search was doing for the business.',
    },
    {
      heading: 'What We Did',
      body:
        'We rewrote titles and descriptions on all 10 pages, labelled all 39 images, and coded the shop’s services, phone and Charlotte address into every page as structured data. We cleared 114 technical faults — site health from 0 to 91/100 at a 92% fix rate — connected Search Console, launched six local landing pages, and started a weekly cadence of articles and Google Business posts.',
    },
    {
      heading: 'The Result That Pays the Bills',
      body:
        'Average position climbed from 15.5 to 10.1 — page two to the top of page one — and 519 of the 1,000 terms we track most closely now sit in Google’s top ten. But the number the shop floor feels is this: the Google Business Profile turned 1,747 views into 82 website clicks and 71 phone calls in 90 days, backed by a 5.0 rating across 138 reviews.',
    },
  ],
  metrics: [
    { value: '15.5 → 10.1', label: 'Avg Google Position' },
    { value: '71', label: 'Calls From Listing' },
    { value: '519', label: 'Keywords In Top 10' },
  ],
};

const CASE_STUDIES = [
  {
    tag: 'Catering & Events',
    title: '+76% Local Map Visibility for a Catering Service Company in 90 Days',
    challenge:
      'A catering service company with an excellent reputation — a flawless 5.0-star rating across 117 reviews — was effectively invisible to anyone who didn\'t already know its name. The website scored just 61/100 on technical health with generic page titles, missing structured data, and over a thousand small issues. Commercial terms like "wedding catering" and "catering services" sat on pages 4–5 of Google, and their Google Maps presence was barely registering.',
    solution:
      'RiseRidge ran a three-phase engagement. First, we rebuilt the technical foundation — 1,100+ fixes across all 67 pages with unique, keyword-rich titles, full structured-data markup, corrected internal links, and full re-indexing. Next, we dominated the local map by optimizing the Google Business Profile, building consistent local signals, and publishing a steady cadence of city-targeted content. Finally, we pushed commercial keywords upward, with many priority terms climbing 20–35 positions in three months.',
    results: [
      { value: '+76%', label: 'Local Map Visibility' },
      { value: '+37%', label: 'Visits From Maps' },
      { value: '61→92', label: 'Site Health Score' },
    ],
  },
  {
    tag: 'Hospitality',
    title: '14.9x More Organic Visitors for a Beachfront Resort in 90 Days',
    challenge:
      'A beachfront resort was almost impossible to discover online — you could only find it on Google if you already knew the exact web address. An audit revealed 1,100+ technical issues blocking crawling and ranking, a website health score of just 50/100 with only ~10 pages optimized, brand-only visibility, and no Search Console or Analytics tracking in place. In a full quarter the site appeared in Google ~3,000 times and earned just 43 visits.',
    solution:
      'RiseRidge deployed an AI-accelerated program across three pillars. We fixed the technical foundation — resolving nearly 2,000 issues, rewriting every title and meta description, bringing all 77 pages to a flawless state, and deploying structured data so Google and AI assistants understand the business. We created discovery content (location and activity guides plus hundreds of Q&A sections), and we built local presence and measurement, connecting Search Console and Analytics and growing the local map score from 1.3 to 3.4.',
    results: [
      { value: '×14.9', label: 'Organic Visitors' },
      { value: '×8.8', label: 'Search Impressions' },
      { value: '50→94', label: 'Site Health Score' },
    ],
  },
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
            See how RiseRidge&apos;s AI-driven SEO has driven measurable growth for
            e-commerce brands, SaaS platforms, hospitality, and local service businesses.
          </p>
        </div>
      </section>

      {/* Aggregate Stats */}
      <StatsBar stats={AGGREGATE_STATS} />

      {/* Featured Case Study 01 — Two Shopify stores */}
      <FeaturedCaseStudy {...SHOPIFY_STUDY}>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EvidenceCard
            title="Total sales — last click"
            subtitle="Shopify · Organic traffic · paid excluded"
            badge="↗ +109%"
          >
            <ComparisonBarsChart
              axisTicks={['$80K', '$60K', '$40K', '$20K', '$0K']}
              max={80000}
              seriesLabel="Organic"
              bars={[
                {
                  value: 35409.94,
                  display: '$35,409.94',
                  caption: 'Jan 14 – Apr 14, 2026',
                },
                {
                  value: 73896.7,
                  display: '$73,896.70',
                  caption: 'Apr 15 – Jul 14, 2026',
                  current: true,
                },
              ]}
            />
          </EvidenceCard>

          <EvidenceCard
            title="Flagship organic channel"
            subtitle="Apr 15 – Jul 14, 2026 vs. prior period"
            footnote="Flagship organic-channel revenue · paid campaigns filtered out"
          >
            <CaseStudyTable
              columns={['Metric', 'Apr–Jul', 'Prior', 'Change']}
              accentColumns={[3]}
              rows={[
                ['Total sales (last click)', '$73,896.70', '$35,409.94', '+109%'],
                ['Sessions', '11,343', '6,515', '+75%'],
                ['Conversion rate', '5.78%', '4.83%', '+19%'],
              ]}
            />
          </EvidenceCard>
        </div>

        <div className="mt-6">
          <EvidenceCard
            title="Both stores at a glance"
            subtitle="Pre-SEO baseline → current period"
            footnote="Organic-only metrics · paid advertising excluded by design"
          >
            <CaseStudyTable
              columns={['Organic-only metric', 'US store (EN)', 'Δ', 'LATAM store (ES)', 'Δ']}
              accentColumns={[2, 4]}
              rows={[
                ['GSC organic clicks', '2,887 → 5,940', '+106%', '397 → 1,149', '+189%'],
                ['GSC organic impressions', '19.7K → 47.3K', '+140%', '3.1K → 9.9K', '+215%'],
                ['Shopify organic revenue', '$35.7K → $72.1K', '+102%', '$12.6K → $21.7K', '+72%'],
                ['Shopify organic sessions', '6,546 → 11,061', '+69%', '3,110 → 6,140', '+97%'],
                ['Avg. position · product page', '7.2 → 4.7', '—', '8.9 → 5.0', '—'],
              ]}
            />
          </EvidenceCard>
        </div>
      </FeaturedCaseStudy>

      {/* Featured Case Study 02 — Local auto glass */}
      <FeaturedCaseStudy {...AUTO_GLASS_STUDY} tone="panel">
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EvidenceCard
            title="Average position in Google"
            subtitle="Search Console · a lower position number is better"
            badge="15.5 → 10.1"
          >
            <PositionTrendChart
              domain={[9.6, 16]}
              threshold={{ value: 10, label: 'Page one · top 10' }}
              points={[
                { value: 15.5, display: '15.5', date: '4 May' },
                { value: 12.0, display: '12.0', date: '1 Jun' },
                { value: 10.6, display: '10.6', date: '24 Jun' },
                { value: 10.1, display: '10.1', date: '21 Jul' },
              ]}
            />
          </EvidenceCard>

          <EvidenceCard
            title="90 days of search performance"
            subtitle="Google Search Console"
            footnote="Organic visits and impressions · brand and non-brand combined"
          >
            <CaseStudyTable
              columns={['Month', 'Visits', 'Impressions', 'Avg pos.']}
              totalRow
              rows={[
                ['May', '69', '13,138', '14.1'],
                ['June', '90', '16,252', '11.4'],
                ['July (1–21)', '49', '10,995', '10.8'],
                ['90-day total', '211', '41,231', '10.1'],
              ]}
            />
          </EvidenceCard>
        </div>

        <div className="mt-6">
          <EvidenceCard title="Google Business Profile" subtitle="90-day window">
            <CaseStudyStatGrid
              stats={[
                { value: '1,747', label: 'Times Seen' },
                { value: '82', label: 'Website Clicks' },
                { value: '71', label: 'Phone Calls' },
                { value: '5.0★', label: '138 Reviews' },
              ]}
            />
          </EvidenceCard>
        </div>
      </FeaturedCaseStudy>

      {/* Case Studies */}
      <section className="py-24" aria-labelledby="case-studies-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="03" text="More Case Studies" />
            <h2 id="case-studies-heading" className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ice">
              More Client Success Stories
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
            <SectionLabel number="04" text="Methodology" />
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
