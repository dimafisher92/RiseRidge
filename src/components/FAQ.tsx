'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from './ScrollReveal';
import { JsonLd } from './JsonLd';

const FAQS = [
  {
    q: 'How fast will I see results?',
    a: 'Most clients see early movement within 60–90 days and compounding gains from there. We share a 90-day roadmap up front so you always know what to expect.',
  },
  {
    q: 'Do you require long contracts?',
    a: 'No. We work month-to-month and earn your business every 30 days — no lock-in, cancel anytime.',
  },
  {
    q: 'Who do you work with?',
    a: 'Shopify stores, local businesses, startups, and established brands. If organic search can move your business, we can help.',
  },
  {
    q: 'How is this different from cheap SEO?',
    a: 'A senior-only team, engineering rigour, and editorial craft — with a metric tied to every action. No volume content, no link spam, no juniors learning on your account.',
  },
  {
    q: 'What about AI search like ChatGPT?',
    a: 'Our Rank on AI program tracks and improves how you appear across ChatGPT, Claude, Gemini, and Perplexity — the fastest-growing search surface.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number>(-1);

  return (
    <section className="py-24" aria-labelledby="faq-heading">
      <JsonLd
        type="faq"
        faqs={FAQS.map((item) => ({ question: item.q, answer: item.a }))}
      />
      <div className="mx-auto max-w-[900px] px-6">
        <ScrollReveal className="text-center mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-brass">FAQ</p>
          <h2 id="faq-heading" className="mt-4 font-display font-medium text-4xl md:text-5xl text-ink">
            Questions, answered.
          </h2>
        </ScrollReveal>

        <div>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-t border-line last:border-b">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-5 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-semibold text-2xl text-ink">{item.q}</span>
                  <span className="font-mono text-2xl leading-none text-brass shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[720px] pb-7 text-base leading-relaxed text-body">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
