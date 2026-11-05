import Link from 'next/link';
import { SectionLabel } from './SectionLabel';
import { ScrollReveal } from './ScrollReveal';
import { CTASection } from './CTASection';
import { BookingButton } from './BookingButton';
import { JsonLd } from './JsonLd';

// Shared layout for the service landing pages (/ai-seo-agency, /shopify-seo,
// /local-seo). Each page passes its copy; every number about RiseRidge or a
// client must come from content/facts.md.

export interface ServicePageContent {
  path: string;
  breadcrumb: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  // Answer-first summary: what the service is, who it is for, what it delivers.
  answer: string;
  primaryCta: string;
  included: { title: string; description: string }[];
  steps: { title: string; description: string }[];
  proof: {
    client: string;
    period: string;
    stats: { value: string; label: string }[];
  }[];
  fit: string[];
  guides: { href: string; title: string }[];
  faqs: { question: string; answer: string }[];
  cta: { heading: string; description: string; primaryLabel: string };
  schema: { name: string; serviceType: string; description: string };
}

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A9874E" strokeWidth="2" className="mt-1 flex-shrink-0" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function ServicePage({ content }: { content: ServicePageContent }) {
  const c = content;
  return (
    <>
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: c.breadcrumb, href: c.path },
        ]}
      />
      <JsonLd type="service" service={{ ...c.schema, url: `${c.path}/` }} />
      <JsonLd type="faq" faqs={c.faqs} />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-6">{c.eyebrow}</p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-ink">
            {c.title} <span className="text-forest">{c.titleAccent}</span>
          </h1>
          <p className="mt-6 text-lg text-body max-w-3xl leading-relaxed">{c.answer}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <BookingButton className="rounded-[3px] bg-forest px-8 py-3.5 font-body font-medium text-on-dark transition-all duration-300 hover:bg-forest-hover">
              {c.primaryCta}
            </BookingButton>
            <Link
              href="/case-studies"
              className="rounded-[3px] border border-line px-8 py-3.5 text-center font-body font-medium text-ink transition-all duration-300 hover:border-forest hover:text-forest"
            >
              See client results
            </Link>
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
            250+ clients served · 97% client retention · Month-to-month, no lock-in
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="border-t border-line py-20" aria-labelledby="included-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="01" text="What's included" />
            <h2 id="included-heading" className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ink">
              What you get
            </h2>
          </ScrollReveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.included.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.05}>
                <div className="h-full rounded-[5px] border border-line bg-white p-7">
                  <h3 className="font-display font-semibold text-xl text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-panel py-20" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="02" text="How it works" />
            <h2 id="process-heading" className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ink">
              How we work
            </h2>
          </ScrollReveal>
          <ol className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.steps.map((step, i) => (
              <li key={step.title}>
                <ScrollReveal delay={i * 0.05} className="h-full">
                  <div className="h-full rounded-[5px] border border-line bg-white p-7">
                    <span className="font-mono text-xs text-brass">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-3 font-display font-semibold text-xl text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-body">{step.description}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Proof */}
      <section className="py-20" aria-labelledby="proof-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel number="03" text="Results" />
              <h2 id="proof-heading" className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ink">
                Results from client work
              </h2>
              <p className="mt-3 text-sm text-subtle">Clients are anonymized. Figures are from their analytics and Search Console.</p>
            </div>
            <Link href="/case-studies" className="text-sm font-semibold text-forest hover:text-brass transition-colors shrink-0">
              All case studies ↗
            </Link>
          </ScrollReveal>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {c.proof.map((p) => (
              <ScrollReveal key={p.client}>
                <div className="h-full rounded-[5px] border border-forest bg-forest p-8">
                  <h3 className="font-display font-semibold text-xl text-on-dark">{p.client}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-on-dark-muted">{p.period}</p>
                  <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {p.stats.map((s) => (
                      <div key={s.label}>
                        <dt className="sr-only">{s.label}</dt>
                        <dd>
                          <span className="block font-display font-semibold text-3xl text-brass">{s.value}</span>
                          <span className="mt-1 block text-sm text-on-dark-muted">{s.label}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for + guides */}
      <section className="border-t border-line bg-panel py-20" aria-labelledby="fit-heading">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <SectionLabel number="04" text="Fit" />
            <h2 id="fit-heading" className="mt-4 font-display font-semibold text-3xl text-ink">
              Who this is for
            </h2>
            <ul className="mt-6 space-y-3">
              {c.fit.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body">
                  {CHECK}
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel number="05" text="Guides" />
            <h2 className="mt-4 font-display font-semibold text-3xl text-ink">Learn how it works</h2>
            <ul className="mt-6 space-y-3">
              {c.guides.map((g) => (
                <li key={g.href}>
                  <Link href={g.href} className="text-forest underline decoration-brass/40 underline-offset-4 hover:text-brass">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ (static so the answers are in the HTML for search engines and AI) */}
      <section className="py-20" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl px-6">
          <h2 id="faq-heading" className="font-display font-semibold text-3xl md:text-4xl text-ink">
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-8">
            {c.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-display font-semibold text-lg text-ink">{faq.question}</h3>
                <p className="mt-2 text-body leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading={c.cta.heading}
        description={c.cta.description}
        primaryLabel={c.cta.primaryLabel}
        secondaryLabel="See Our Results"
        secondaryHref="/case-studies"
      />
    </>
  );
}
