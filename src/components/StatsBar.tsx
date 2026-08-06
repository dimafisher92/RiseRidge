'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const DEFAULT_STATS = [
  { value: '250+', label: 'Clients served' },
  { value: '3x', label: 'Avg ROAS increase' },
  { value: '$25M+', label: 'Revenue generated' },
  { value: '10M+', label: 'Keywords tracked' },
];

// Splits "$25M+" into prefix "$", number 25, suffix "M+"
function parseValue(v: string) {
  const match = v.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!match) return { prefix: '', target: 0, suffix: v, animate: false };
  const target = parseFloat(match[2].replace(/,/g, ''));
  return { prefix: match[1], target, suffix: match[3], animate: !Number.isNaN(target) };
}

function CountUp({ value }: { value: string }) {
  const { prefix, target, suffix, animate } = parseValue(value);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState(animate ? 0 : target);

  useEffect(() => {
    if (!inView || !animate) return;
    const duration = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, animate, target]);

  const shown = Number.isInteger(target) ? Math.round(display) : display.toFixed(1);

  return (
    <div ref={ref} className="font-display text-4xl md:text-5xl font-semibold text-brass">
      {prefix}{shown}{suffix}
    </div>
  );
}

export function StatsBar({ stats = DEFAULT_STATS }: { stats?: { value: string; label: string }[] }) {
  return (
    <section className="bg-forest" aria-label="Key statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 divide-x divide-line-dark">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="px-6 py-12 text-center"
          >
            <CountUp value={stat.value} />
            <div className="mt-2 text-xs text-on-dark-muted uppercase tracking-[0.18em] font-mono">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
