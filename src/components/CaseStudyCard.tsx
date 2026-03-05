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
      className="rounded-xl border border-border bg-navy/60 p-8 transition-all duration-300 hover:border-electric/40"
    >
      <span className="inline-block rounded-full bg-electric/10 px-3 py-1 font-mono text-xs text-electric uppercase tracking-wider">
        {tag}
      </span>
      <h3 className="mt-4 font-display font-bold text-xl text-ice">{title}</h3>

      <div className="mt-6 space-y-4">
        <div>
          <h4 className="font-mono text-xs text-muted uppercase tracking-wider mb-1">Challenge</h4>
          <p className="text-sm text-muted leading-relaxed">{challenge}</p>
        </div>
        <div>
          <h4 className="font-mono text-xs text-muted uppercase tracking-wider mb-1">Solution</h4>
          <p className="text-sm text-muted leading-relaxed">{solution}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
        {results.map((r) => (
          <div key={r.label} className="text-center">
            <div className="font-mono text-xl font-bold text-gold">{r.value}</div>
            <div className="mt-1 text-[10px] text-muted uppercase tracking-wider font-mono">{r.label}</div>
          </div>
        ))}
      </div>
    </motion.article>
  );
}
