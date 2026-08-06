'use client';

import { motion } from 'framer-motion';

interface CaseStudyCardProps {
  tag: string;
  title: string;
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
  index?: number;
}

export function CaseStudyCard({ tag, title, challenge, solution, results, index = 0 }: CaseStudyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-[6px] border border-line bg-white p-8 shadow-[0_10px_34px_rgba(21,20,15,0.05)] transition-all duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(21,20,15,0.10)]"
    >
      <span className="inline-block rounded-full border border-tag-border bg-tag-bg px-3 py-1 font-mono text-[11px] text-forest uppercase tracking-[0.14em]">
        {tag}
      </span>
      <h3 className="mt-4 font-display font-semibold text-2xl text-ink leading-snug">{title}</h3>

      <div className="mt-6 space-y-4">
        <div>
          <h4 className="font-mono text-[11px] text-brass uppercase tracking-[0.16em] mb-1">Challenge</h4>
          <p className="text-sm text-body leading-relaxed">{challenge}</p>
        </div>
        <div>
          <h4 className="font-mono text-[11px] text-brass uppercase tracking-[0.16em] mb-1">Solution</h4>
          <p className="text-sm text-body leading-relaxed">{solution}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-6">
        {results.map((r) => (
          <div key={r.label} className="text-center">
            <div className="font-display text-2xl font-semibold text-brass">{r.value}</div>
            <div className="mt-1 text-[10px] text-subtle uppercase tracking-[0.14em] font-mono">{r.label}</div>
          </div>
        ))}
      </div>
    </motion.article>
  );
}
