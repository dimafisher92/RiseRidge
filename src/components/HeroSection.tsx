'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedBackground } from './AnimatedBackground';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <AnimatedBackground />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan mb-6">
            AI-Powered SEO Agency
          </p>
          <h1 className="font-display font-[800] text-4xl sm:text-5xl md:text-7xl leading-[1.08] text-ice">
            Precision Navigation
            <br />
            <span className="text-gradient-blue-cyan">to the Top</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            RankPilot combines proprietary AI with deep SEO expertise to help e-commerce
            and growth-stage businesses dominate organic search.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/#contact"
            className="rounded-lg bg-electric px-8 py-4 font-body font-medium text-white text-lg transition-all duration-300 hover:bg-signal hover:glow-blue"
          >
            Get Your Free Audit
          </Link>
          <Link
            href="/case-studies"
            className="rounded-lg border border-border px-8 py-4 font-body font-medium text-ice text-lg transition-all duration-300 hover:border-electric hover:text-electric"
          >
            See Our Results
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-muted/30 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-electric" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
