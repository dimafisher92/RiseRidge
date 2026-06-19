'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuditPopup } from './AuditPopup';

const TRUST_PILLS = [
  'Free 20-min audit',
  'Month-to-month, no lock-in',
  'First results in ~90 days',
];

export function HeroSection() {
  const { open: openAuditPopup } = useAuditPopup();

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden pt-28 pb-20">
      {/* Animated ridgeline backdrop */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M0,320 L180,250 L340,300 L520,180 L700,240 L880,120 L1080,210 L1280,90 L1440,160"
          fill="none"
          stroke="#1E3A2E"
          strokeWidth="1.5"
          strokeOpacity="0.18"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M0,360 L200,300 L380,340 L560,250 L760,300 L960,200 L1160,280 L1360,170 L1440,220"
          fill="none"
          stroke="#A9874E"
          strokeWidth="1.5"
          strokeOpacity="0.22"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-brass mb-7">
            AI-Driven SEO Agency · Est 2020
          </p>
          <h1 className="font-display font-semibold leading-[0.98] text-ink text-5xl sm:text-6xl md:text-7xl">
            AI-Driven SEO.
            <br />
            Measurable <span className="italic text-brass">growth.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg md:text-xl text-body leading-relaxed">
            RiseRidge pairs AI-powered SEO infrastructure with hands-on strategy to move
            businesses from invisible to undeniable — and prove every gain in the numbers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={openAuditPopup}
            className="rounded-[3px] bg-forest px-8 py-4 font-body font-medium text-on-dark text-base transition-all duration-300 hover:bg-forest-hover hover:glow-blue"
          >
            Get Your Free Audit
          </button>
          <Link
            href="/case-studies"
            className="rounded-[3px] border border-ink/15 px-8 py-4 font-body font-medium text-ink text-base transition-all duration-300 hover:border-forest hover:text-forest"
          >
            See Our Results ↗
          </Link>
        </motion.div>

        {/* Trust pills */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-body"
        >
          {TRUST_PILLS.map((pill) => (
            <li key={pill} className="inline-flex items-center gap-2">
              <span className="text-brass" aria-hidden="true">✓</span>
              {pill}
            </li>
          ))}
        </motion.ul>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-8 text-sm text-subtle"
        >
          Curious where you stand?{' '}
          <Link
            href="/seo-checker"
            className="font-medium text-forest underline underline-offset-4 decoration-brass/40 hover:text-brass transition-colors"
          >
            Try our free SEO checker
          </Link>{' '}
          — instant results, no sign-up to start.
        </motion.p>
      </div>
    </section>
  );
}
