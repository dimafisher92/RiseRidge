'use client';

import { motion } from 'framer-motion';

/**
 * Faithful recreation of the client's Shopify "Total sales (last click) · Organic"
 * report for the travel-bag store — organic-only channel, paid advertising excluded.
 *
 * Current period : Apr 15 – Jul 14, 2026  → $73,896.70
 * Comparison     : Jan 14 – Apr 14, 2026  → $35,409.94  (+109%)
 *
 * Built as a responsive, theme-consistent chart rather than a raster screenshot
 * so it stays crisp on every display and matches the site's design language.
 */

const AXIS_MAX = 80_000;
const CURRENT = 73_896.7;
const PRIOR = 35_409.94;

const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

const GRID_LINES = [80, 60, 40, 20, 0];

const SUMMARY_ROWS = [
  { label: 'Total sales (last click)', current: '$73,896.70', prior: '$35,409.94', delta: '+109%' },
  { label: 'Sessions', current: '11,343', prior: '6,515', delta: '+75%' },
  { label: 'Conversion rate', current: '5.78%', prior: '4.83%', delta: '+19%' },
];

export function OrganicSalesChart() {
  return (
    <figure className="rounded-[10px] border border-line bg-white p-6 shadow-[0_10px_34px_rgba(21,20,15,0.05)] sm:p-8">
      <figcaption className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-display text-xl font-semibold text-ink">Total sales &mdash; last click</h4>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            Shopify &middot; Organic traffic &middot; paid excluded
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-tag-border bg-tag-bg px-3 py-1 font-mono text-[11px] font-semibold text-forest">
          &#8599; +109%
        </span>
      </figcaption>

      {/* Chart plot */}
      <div className="mt-8 flex gap-3">
        {/* Y axis */}
        <div className="flex w-9 flex-col justify-between py-1 text-right font-mono text-[10px] text-subtle">
          {GRID_LINES.map((v) => (
            <span key={v}>${v}K</span>
          ))}
        </div>

        {/* Plot area */}
        <div className="relative flex-1">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {GRID_LINES.map((v) => (
              <div key={v} className="h-px w-full bg-line" />
            ))}
          </div>

          {/* Bars */}
          <div className="relative flex h-56 items-end justify-center gap-6 px-4">
            <Bar
              heightPct={(CURRENT / AXIS_MAX) * 100}
              className="bg-forest"
              value={currency(CURRENT)}
              valueClass="text-forest"
              delay={0.1}
            />
            <Bar
              heightPct={(PRIOR / AXIS_MAX) * 100}
              className="bg-tag-bg border border-tag-border"
              value={currency(PRIOR)}
              valueClass="text-subtle"
              delay={0.25}
            />
          </div>
        </div>
      </div>

      {/* X axis label */}
      <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Organic</p>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-line pt-4 text-[11px] text-body">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-forest" /> Apr 15 &ndash; Jul 14, 2026
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border border-tag-border bg-tag-bg" /> Jan 14 &ndash; Apr 14, 2026
        </span>
      </div>

      {/* Summary table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
              <th className="py-2 pr-4 font-normal">Metric</th>
              <th className="py-2 px-4 text-right font-normal">Apr&ndash;Jul</th>
              <th className="py-2 px-4 text-right font-normal">Prior</th>
              <th className="py-2 pl-4 text-right font-normal">Change</th>
            </tr>
          </thead>
          <tbody>
            {SUMMARY_ROWS.map((row) => (
              <tr key={row.label} className="border-b border-line/60 last:border-0">
                <td className="py-2.5 pr-4 text-sm text-body">{row.label}</td>
                <td className="py-2.5 px-4 text-right text-sm font-semibold text-ink tabular-nums">{row.current}</td>
                <td className="py-2.5 px-4 text-right text-sm text-subtle tabular-nums">{row.prior}</td>
                <td className="py-2.5 pl-4 text-right text-sm font-semibold text-forest tabular-nums">{row.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function Bar({
  heightPct,
  className,
  value,
  valueClass,
  delay,
}: {
  heightPct: number;
  className: string;
  value: string;
  valueClass: string;
  delay: number;
}) {
  return (
    <div className="flex h-full w-24 flex-col items-center justify-end sm:w-32">
      <span className={`mb-2 font-display text-sm font-semibold tabular-nums ${valueClass}`}>{value}</span>
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: `${heightPct}%` }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className={`w-full rounded-t-[3px] ${className}`}
      />
    </div>
  );
}
