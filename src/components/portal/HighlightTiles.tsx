'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ReportHighlight } from '@/lib/supabase/types';

// Flexible headline numbers for a report — value is free text (any format), so
// nothing is computed. Positive highlights get the forest/up treatment.
export function HighlightTiles({ highlights }: { highlights: ReportHighlight[] }) {
  if (highlights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {highlights.map((h, i) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="rounded-[10px] border border-line bg-white p-5 shadow-[0_8px_28px_rgba(21,20,15,0.04)]"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-body">{h.label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-display text-3xl font-semibold ${h.positive ? 'text-forest' : 'text-ink'}`}>
              {h.value}
            </span>
            {h.positive && <ArrowUpRight className="h-5 w-5 text-forest" aria-hidden />}
          </div>
          {h.note && <p className="mt-1 text-sm text-body">{h.note}</p>}
        </motion.div>
      ))}
    </div>
  );
}
