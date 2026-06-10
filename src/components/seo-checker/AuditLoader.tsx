'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

const STEPS = [
  'Checking your page titles & search preview',
  'Analyzing your content & readability',
  'Inspecting your technical setup',
  'Counting links & images',
  'Scoring your site',
];

// Progressive, cosmetic loader: reveals each step on a timer while the audit
// request is in flight. The final step is held "in progress" until the parent
// swaps in the real report.
export function AuditLoader({ url }: { url: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface/60 p-8">
      <p className="text-center font-mono text-[11px] uppercase tracking-[3px] text-electric">
        Auditing
      </p>
      <p className="mt-2 truncate text-center text-sm text-muted">{url}</p>

      <ul className="mt-8 space-y-4">
        {STEPS.map((step, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <motion.li
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: i <= active ? 1 : 0.35, x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  done ? 'bg-success/15 text-success' : current ? 'bg-electric/15 text-electric' : 'bg-white/5 text-muted'
                }`}
              >
                {done ? (
                  <Check size={14} />
                ) : current ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span className={`text-sm ${i <= active ? 'text-ice' : 'text-muted'}`}>{step}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
