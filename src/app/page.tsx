import Link from 'next/link';
import Image from 'next/image';
import { HeroSection } from '@/components/HeroSection';
import { StatsBar } from '@/components/StatsBar';
import { SectionLabel } from '@/components/SectionLabel';
import { CTASection } from '@/components/CTASection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { JsonLd } from '@/components/JsonLd';
import { FAQ } from '@/components/FAQ';
import TestimonialsSection from '@/components/ui/testimonial-v2';
import { VideoTestimonials } from '@/components/VideoTestimonials';

const SERVICES = [
  {
    number: '01',
    icon: (
      <svg viewBox="0 0 60 32" width="56" height="30" aria-hidden="true">
        <circle cx="30" cy="16" r="13" fill="none" stroke="#1E3A2E" strokeWidth="2" />
        <circle cx="30" cy="16" r="4" fill="#A9874E" />
      </svg>
    ),
    title: 'AI SEO Automation',
    description: 'Our engine identifies technical issues, generates optimized fixes, and deploys changes automatically — no manual intervention needed.',
  },
  {
    number: '02',
    icon: (
      <svg viewBox="0 0 60 32" width="56" height="30" aria-hidden="true">
        <polyline points="2,28 18,16 30,21 46,5 58,12" fill="none" stroke="#1E3A2E" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
    title: 'Content Intelligence',
    description: 'AI-powered content creation, topic clusters, and editorial planning that builds topical authority and drives organic traffic.',
  },
  {
    number: '03',
    icon: (
      <svg viewBox="0 0 60 32" width="56" height="30" aria-hidden="true">
        <rect x="2" y="20" width="9" height="10" fill="#1E3A2E" />
        <rect x="15" y="14" width="9" height="16" fill="#1E3A2E" />
        <rect x="28" y="8" width="9" height="22" fill="#1E3A2E" />
        <rect x="41" y="3" width="9" height="27" fill="#A9874E" />
      </svg>
    ),
    title: 'Rank Tracking & Analytics',
    description: 'Real-time keyword position monitoring, competitor tracking, and actionable insights powered by AI-driven analytics.',
  },
  {
    number: '04',
    icon: (
      <svg viewBox="0 0 60 32" width="40" height="30" aria-hidden="true">
        <circle cx="24" cy="14" r="10" fill="none" stroke="#1E3A2E" strokeWidth="2" />
        <line x1="31" y1="21" x2="40" y2="30" stroke="#A9874E" strokeWidth="2.5" strokeLinecap="round" />
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

/**
 * Client logos.
 *
 * `mode` picks the monochrome treatment so every mark reads at the same weight
 * on the warm panel background:
 *   - 'mask'  → flattened to a solid silhouette. Only for single-tone marks;
 *               it is the only option for light/white marks, which would vanish
 *               under multiply.
 *   - 'blend' → desaturated and multiplied into the panel. Keeps internal detail
 *               (knocked-out type, illustrations) and makes baked-in white
 *               backgrounds disappear instead of showing as a white box.
 * `box` is tuned per aspect ratio so squarer marks are not dwarfed by the wide
 * wordmarks; all of them are centred in a shared 48px row.
 */
const LOGOS = [
  { src: '/logo1.webp',  alt: 'The Sharp Firm',           w: 615, h: 100, box: 'h-7',  mode: 'mask'  },
  { src: '/logo2.avif',  alt: 'Ortfolia',                 w: 120, h: 30,  box: 'h-8',  mode: 'blend' },
  { src: '/logo3.avif',  alt: 'ZPackbag',                 w: 500, h: 104, box: 'h-7',  mode: 'blend' },
  { src: '/logo4.avif',  alt: 'The Almighty Tools',       w: 500, h: 84,  box: 'h-7',  mode: 'blend' },
  { src: '/logo5.webp',  alt: 'try Bello',                w: 180, h: 47,  box: 'h-9',  mode: 'mask'  },
  { src: '/logo6.png',   alt: 'Tenxpr',                   w: 253, h: 35,  box: 'h-6',  mode: 'blend' },
  { src: '/logo10.png',  alt: 'SnapTax',                  w: 257, h: 75,  box: 'h-9',  mode: 'blend' },
  { src: '/logo11.avif', alt: 'DropperBottles.com',       w: 222, h: 98,  box: 'h-11', mode: 'blend' },
  { src: '/logo12.avif', alt: 'omGhee',                   w: 172, h: 60,  box: 'h-10', mode: 'blend' },
  { src: '/logo13.avif', alt: 'Grazly',                   w: 202, h: 80,  box: 'h-10', mode: 'blend' },
  { src: '/logo14.avif', alt: 'The Safe Dog Chew Company', w: 190, h: 64, box: 'h-10', mode: 'blend' },
];

export default function HomePage() {
  return (
    <>
      <JsonLd type="website" />
      <JsonLd type="service" />

      {/* Hero */}
      <HeroSection />

      {/* Award + Trusted brands */}
      <section className="border-y border-line bg-panel py-16" aria-label="Award-winning and trusted by leading brands">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-[10.5px] text-subtle uppercase tracking-[0.2em] font-mono mb-10">
            Trusted by growth-stage brands
          </p>

          {/* Award badge */}
          <ScrollReveal className="flex justify-center mb-12">
            <div className="flex items-center gap-6 rounded-[6px] border border-line bg-white p-5 pr-10 shadow-[0_10px_34px_rgba(21,20,15,0.05)] hover:shadow-[0_16px_44px_rgba(21,20,15,0.10)] transition-all duration-[400ms]">
              <div className="relative h-48 w-[140px] shrink-0 overflow-hidden rounded-[5px] border border-line">
                <Image
                  src="/award2.png"
                  alt="TOP USA Awards trophy presented to RiseRidge"
                  fill
                  sizes="140px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
                  Award-winning
                </span>
                <p className="mt-2 font-display font-semibold text-ink text-xl">
                  TOP 100 USA Entrepreneurs
                </p>
                <p className="mt-1 text-sm text-subtle">TOP USA Awards · 2023</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Client logos */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-12 sm:gap-y-8">
            {LOGOS.map((logo) => (
              <span key={logo.src} className="flex h-12 items-center justify-center">
                <Image
                  src={logo.src}
                  alt={`${logo.alt} logo`}
                  width={logo.w}
                  height={logo.h}
                  className={`w-auto max-w-[42vw] object-contain transition-opacity duration-300 ${logo.box} ${
                    logo.mode === 'mask'
                      ? 'brightness-0 opacity-55 hover:opacity-85'
                      : 'grayscale opacity-55 mix-blend-multiply hover:opacity-85'
                  }`}
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <VideoTestimonials />

      {/* Stats */}
      <StatsBar />

      {/* Services Overview */}
      <section className="py-24" aria-labelledby="services-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel number="01" text="Services" />
              <h2 id="services-heading" className="mt-4 font-display font-medium text-4xl md:text-5xl leading-[1.02] text-ink max-w-xl">
                AI-powered SEO solutions, end to end.
              </h2>
            </div>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-brass transition-colors pb-2 shrink-0"
            >
              Explore all features ↗
            </Link>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <div className="group h-full rounded-[5px] border border-line bg-white p-9 shadow-[0_10px_34px_rgba(21,20,15,0.05)] transition-all duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(21,20,15,0.10)]">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs text-brass">{service.number}</span>
                    {service.icon}
                  </div>
                  <h3 className="mt-6 font-display font-semibold text-3xl text-ink">{service.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-body">{service.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-line bg-panel py-24" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="02" text="Process" />
            <h2 id="process-heading" className="mt-4 font-display font-semibold text-4xl md:text-5xl text-ink">
              How it works
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => {
              const isForest = i === 2;
              return (
                <ScrollReveal key={step.number} delay={i * 0.15}>
                  <div
                    className={`relative h-full rounded-[6px] border p-8 transition-all duration-[400ms] ${
                      isForest
                        ? 'border-forest bg-forest'
                        : 'border-line bg-white shadow-[0_10px_34px_rgba(21,20,15,0.05)]'
                    }`}
                  >
                    <span className="font-mono text-sm text-brass">{step.number}</span>
                    <h3 className={`mt-3 font-display font-semibold text-2xl ${isForest ? 'text-on-dark' : 'text-ink'}`}>
                      {step.title}
                    </h3>
                    <p className={`mt-3 text-sm leading-relaxed ${isForest ? 'text-on-dark-muted' : 'text-body'}`}>
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-24" aria-labelledby="featured-case-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="03" text="Results" />
            <h2 id="featured-case-heading" className="mt-4 font-display font-semibold text-4xl md:text-5xl text-ink">
              Proven results
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-12 rounded-[6px] border border-line bg-white p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-[0_10px_34px_rgba(21,20,15,0.05)]">
              <div>
                <span className="inline-block rounded-full border border-tag-border bg-tag-bg px-3 py-1 font-mono text-[11px] text-forest uppercase tracking-[0.14em]">
                  E-commerce
                </span>
                <h3 className="mt-4 font-display font-semibold text-3xl text-ink leading-tight">
                  Scaled organic revenue to $21K/day in 4 months.
                </h3>
                <p className="mt-4 text-body leading-relaxed">
                  An e-commerce brand over-reliant on paid ads partnered with RiseRidge. We deployed our AI automation engine for a full technical overhaul, rebuilt site architecture, and implemented strategic content clusters.
                </p>
                <Link
                  href="/case-studies"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-brass transition-colors"
                >
                  Read all case studies ↗
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '$21K/day', label: 'Peak revenue' },
                  { value: '340%', label: 'Traffic growth' },
                  { value: '4 mo', label: 'Time to results' },
                  { value: '#1–3', label: 'Avg position' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[6px] bg-panel p-5 text-center border border-line">
                    <div className="font-display text-2xl font-semibold text-brass">{stat.value}</div>
                    <div className="mt-1 text-[10px] text-subtle uppercase tracking-[0.14em] font-mono">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <CTASection />
    </>
  );
}
