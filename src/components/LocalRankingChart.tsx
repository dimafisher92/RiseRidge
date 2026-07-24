'use client';

import { motion } from 'framer-motion';

/**
 * Recreation of a Charlotte, NC auto-glass shop's Google Search Console
 * "average position" trend — the 90-day climb from mid-page-two to the top of
 * page one. Lower number = higher on the page, so the line is plotted higher as
 * performance improves. Built as a responsive, theme-consistent chart (not a
 * screenshot) so it stays crisp and on-brand.
 *
 * Avg position: 15.5 (4 May) -> 12.0 (1 Jun) -> 10.6 (24 Jun) -> 10.1 (21 Jul).
 */

const POINTS = [
  { x: 40, y: 177.7, label: '15.5', xLabel: '4 May', anchor: 'start' as const },
  { x: 230, y: 91.5, label: '12.0', xLabel: '1 Jun', anchor: 'middle' as const },
  { x: 420, y: 57.1, label: '10.6', xLabel: '24 Jun', anchor: 'middle' as const },
  { x: 610, y: 44.8, label: '10.1', xLabel: '21 Jul', anchor: 'end' as const },
];

const LINE_PATH = 'M40,177.7 L230,91.5 L420,57.1 L610,44.8';
const AREA_PATH = 'M40,190 L40,177.7 L230,91.5 L420,57.1 L610,44.8 L610,190 Z';
const PAGE_ONE_Y = 42.3;

const MONTHS = [
  { month: 'May', visits: '69', impressions: '13,138', pos: '14.1' },
  { month: 'June', visits: '90', impressions: '16,252', pos: '11.4' },
  { month: 'July (1–21)', visits: '49', impressions: '10,995', pos: '10.8' },
];

export function LocalRankingChart() {
  return (
    <figure className="rounded-[10px] border border-line bg-white p-6 shadow-[0_10px_34px_rgba(21,20,15,0.05)] sm:p-8">
      <figcaption className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-display text-xl font-semibold text-ink">Average position in Google</h4>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            Search Console &middot; higher is better
          </p>
        </div>
        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-tag-border bg-tag-bg px-3 py-1 font-mono text-[11px] font-semibold text-forest">
          15.5 &rarr; 10.1
        </span>
      </figcaption>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox="0 0 650 210"
          className="h-auto w-full min-w-[420px]"
          role="img"
          aria-label="Average Google position improving from 15.5 in May to 10.1 in July, crossing from page two onto page one."
        >
          {/* Page-one boundary */}
          <line x1="40" y1={PAGE_ONE_Y} x2="610" y2={PAGE_ONE_Y} stroke="#cfe0d4" strokeWidth="1" strokeDasharray="3 4" />
          <text x="40" y={PAGE_ONE_Y - 6} fontFamily="'Space Mono', monospace" fontSize="9" fill="#7A5E2E">
            PAGE ONE · TOP 10
          </text>

          {/* Area + line */}
          <path d={AREA_PATH} fill="#A9874E" opacity="0.10" />
          <motion.path
            d={LINE_PATH}
            fill="none"
            stroke="#A9874E"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          />

          {/* Points, value labels, and x-axis labels */}
          {POINTS.map((p, i) => {
            const isLast = i === POINTS.length - 1;
            return (
              <g key={p.xLabel}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isLast ? 5.5 : 4.5}
                  fill={isLast ? '#1E3A2E' : '#fff'}
                  stroke={isLast ? '#1E3A2E' : '#A9874E'}
                  strokeWidth="2.4"
                />
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor={p.anchor}
                  fontFamily="'Space Mono', monospace"
                  fontSize="11"
                  fontWeight={isLast ? 700 : 400}
                  fill={isLast ? '#1E3A2E' : '#56514a'}
                >
                  {p.label}
                </text>
                <text
                  x={p.x}
                  y="205"
                  textAnchor={p.anchor}
                  fontFamily="'Space Mono', monospace"
                  fontSize="9"
                  fill="#a89e88"
                >
                  {p.xLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Month-by-month summary */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
              <th className="py-2 pr-4 font-normal">Month</th>
              <th className="py-2 px-4 text-right font-normal">Visits</th>
              <th className="py-2 px-4 text-right font-normal">Impressions</th>
              <th className="py-2 pl-4 text-right font-normal">Avg pos.</th>
            </tr>
          </thead>
          <tbody>
            {MONTHS.map((m) => (
              <tr key={m.month} className="border-b border-line/60">
                <td className="py-2.5 pr-4 text-sm text-body">{m.month}</td>
                <td className="py-2.5 px-4 text-right text-sm text-ink tabular-nums">{m.visits}</td>
                <td className="py-2.5 px-4 text-right text-sm text-ink tabular-nums">{m.impressions}</td>
                <td className="py-2.5 pl-4 text-right text-sm font-semibold text-forest tabular-nums">{m.pos}</td>
              </tr>
            ))}
            <tr className="bg-tag-bg/60">
              <td className="py-2.5 pr-4 text-sm font-semibold text-ink">90-day total</td>
              <td className="py-2.5 px-4 text-right text-sm font-semibold text-ink tabular-nums">211</td>
              <td className="py-2.5 px-4 text-right text-sm font-semibold text-ink tabular-nums">41,231</td>
              <td className="py-2.5 pl-4 text-right text-sm font-semibold text-forest tabular-nums">10.1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  );
}
