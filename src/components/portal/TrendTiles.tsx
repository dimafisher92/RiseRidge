'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Movement } from '@/lib/portal/trends';

// The dashboard's "what's trending up right now" — one tile per positive mover,
// delta as the headline figure. Purpose-built (rather than reusing StatsBar) so
// each tile can show delta + current + prior together.
export function TrendTiles({ movers }: { movers: Movement[] }) {
  if (movers.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {movers.map((m, i) => (
        <motion.div
          key={m.key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="rounded-[10px] border border-line bg-white p-5 shadow-[0_8px_28px_rgba(21,20,15,0.04)]"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{m.label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold text-forest">
              {m.formattedDelta ?? m.formattedCurrent}
            </span>
            {m.formattedDelta && (
              <ArrowUpRight className="h-5 w-5 text-forest" aria-hidden />
            )}
          </div>
          <p className="mt-1 text-sm text-body tabular-nums">
            {m.formattedCurrent}
            {m.formattedPrior && (
              <span className="text-subtle"> · was {m.formattedPrior}</span>
            )}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
