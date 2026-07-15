'use client';

import { motion } from 'framer-motion';
import type { Movement } from '@/lib/portal/trends';

// A single before/after two-bar comparison for one headline metric — the
// data-driven generalisation of OrganicSalesChart (no charting library).
export function MetricBarChart({ movement }: { movement: Movement }) {
  if (movement.priorValue === null) return null;

  const max = Math.max(movement.currentValue, movement.priorValue) * 1.1 || 1;
  const currentPct = Math.max((movement.currentValue / max) * 100, 1);
  const priorPct = Math.max((movement.priorValue / max) * 100, 1);

  return (
    <figure className="rounded-[10px] border border-line bg-white p-6 shadow-[0_8px_28px_rgba(21,20,15,0.04)]">
      <figcaption className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-ink">{movement.label}</h3>
        {movement.formattedDelta && (
          <span
            className="inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] font-semibold"
            style={{
              color: movement.positive ? '#1E3A2E' : '#a23b3b',
              borderColor: movement.positive ? '#cfe0d4' : '#e6c9c9',
              backgroundColor: movement.positive ? '#eef4ef' : '#f7ecec',
            }}
          >
            {movement.formattedDelta}
          </span>
        )}
      </figcaption>

      <div className="mt-6 flex h-44 items-end justify-center gap-8">
        <Bar heightPct={currentPct} value={movement.formattedCurrent} tone="current" delay={0.1} />
        <Bar heightPct={priorPct} value={movement.formattedPrior ?? ''} tone="prior" delay={0.2} />
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 border-t border-line pt-4 text-[11px] text-body">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-forest" /> Current
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border border-tag-border bg-tag-bg" /> Prior
        </span>
      </div>
    </figure>
  );
}

function Bar({
  heightPct,
  value,
  tone,
  delay,
}: {
  heightPct: number;
  value: string;
  tone: 'current' | 'prior';
  delay: number;
}) {
  return (
    <div className="flex h-full w-24 flex-col items-center justify-end sm:w-32">
      <span
        className="mb-2 font-display text-sm font-semibold tabular-nums"
        style={{ color: tone === 'current' ? '#1E3A2E' : '#8a8276' }}
      >
        {value}
      </span>
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: `${heightPct}%` }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className={
          tone === 'current'
            ? 'w-full rounded-t-[3px] bg-forest'
            : 'w-full rounded-t-[3px] border border-tag-border bg-tag-bg'
        }
      />
    </div>
  );
}
