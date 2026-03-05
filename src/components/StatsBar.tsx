'use client';

import { motion } from 'framer-motion';

const DEFAULT_STATS = [
  { value: '250+', label: 'Clients Served' },
  { value: '3x', label: 'Avg ROAS Increase' },
  { value: '$25M+', label: 'Revenue Generated' },
  { value: '10M+', label: 'Keywords Tracked' },
];

export function StatsBar({ stats = DEFAULT_STATS }: { stats?: { value: string; label: string }[] }) {
  return (
    <section className="border-y border-border bg-surface/50" aria-label="Key statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="px-6 py-8 text-center"
          >
            <div className="font-mono text-2xl md:text-3xl font-bold text-electric">{stat.value}</div>
            <div className="mt-1 text-xs text-muted uppercase tracking-wider font-mono">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
