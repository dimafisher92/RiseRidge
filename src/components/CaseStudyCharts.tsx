'use client';

import { motion } from 'framer-motion';

interface ComparisonBar {
  /** Numeric value used for the bar height. */
  value: number;
  /** Formatted value printed above the bar. */
  display: string;
  /** Period the bar covers. */
  caption: string;
  /** The current period is drawn in forest, the baseline in a muted tone. */
  current?: boolean;
}

interface ComparisonBarsChartProps {
  /** Axis labels, top tick first. */
  axisTicks: string[];
  /** Value represented by the top tick. */
  max: number;
  seriesLabel: string;
  bars: ComparisonBar[];
}

export function ComparisonBarsChart({
  axisTicks,
  max,
  seriesLabel,
  bars,
}: ComparisonBarsChartProps) {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
        <span className="h-2 w-2 rounded-full bg-forest" aria-hidden="true" />
        {seriesLabel}
      </div>

      <div className="mt-4 flex">
        <div className="flex h-56 w-14 shrink-0 flex-col justify-between pr-3 text-right font-mono text-[10px] text-subtle">
          {axisTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className="relative h-56 flex-1 border-b border-l border-line">
          {axisTicks.map((tick, i) => (
            <span
              key={tick}
              aria-hidden="true"
              className="absolute left-0 right-0 border-t border-line/60"
              style={{ top: `${(i / (axisTicks.length - 1)) * 100}%` }}
            />
          ))}

          <div className="absolute inset-0 flex items-end justify-around gap-6 px-4">
            {bars.map((bar, i) => (
              <div
                key={bar.caption}
                className="flex h-full max-w-[120px] flex-1 flex-col items-center justify-end"
              >
                <span
                  className={`mb-2 font-mono text-[11px] tabular-nums ${
                    bar.current ? 'text-forest' : 'text-subtle'
                  }`}
                >
                  {bar.display}
                </span>
                <motion.span
                  initial={{ height: 0 }}
                  whileInView={{ height: `${Math.min((bar.value / max) * 100, 100)}%` }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className={`w-full rounded-t-[3px] ${bar.current ? 'bg-forest' : 'bg-forest/25'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-14 shrink-0" aria-hidden="true" />
        <div className="flex flex-1 justify-around gap-6 px-4 pt-3">
          {bars.map((bar) => (
            <span
              key={bar.caption}
              className="max-w-[120px] flex-1 text-center font-mono text-[10px] leading-relaxed text-subtle"
            >
              {bar.caption}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TrendPoint {
  /** Average position — lower is better, so the plot is inverted. */
  value: number;
  display: string;
  date: string;
}

interface PositionTrendChartProps {
  points: TrendPoint[];
  /** [best, worst] position bounding the plot. */
  domain: [number, number];
  /** Optional dashed milestone line, e.g. position 10 = page one. */
  threshold?: { value: number; label: string };
}

// Values are plotted between 12% and 88% of the box so labels never clip.
const TOP_PAD = 12;
const SPAN = 76;

export function PositionTrendChart({ points, domain, threshold }: PositionTrendChartProps) {
  const [best, worst] = domain;
  const toY = (value: number) => TOP_PAD + ((value - best) / (worst - best)) * SPAN;
  const toX = (index: number) => 6 + (index / (points.length - 1)) * 88;

  const line = points.map((point, i) => `${toX(i)},${toY(point.value)}`).join(' ');
  const area = `${toX(0)},100 ${line} ${toX(points.length - 1)},100`;

  return (
    <div>
      <div className="relative h-56">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="position-trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3A2E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1E3A2E" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#position-trend-fill)" />
          <motion.polyline
            points={line}
            fill="none"
            stroke="#1E3A2E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          />
        </svg>

        {threshold && (
          <div
            className="pointer-events-none absolute inset-x-0 flex items-center"
            style={{ top: `${toY(threshold.value)}%` }}
          >
            <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.14em] text-brass">
              {threshold.label}
            </span>
            <span className="h-px flex-1 border-t border-dashed border-brass/60" aria-hidden="true" />
          </div>
        )}

        {points.map((point, i) => (
          <div key={point.date}>
            <motion.span
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.4 }}
              viewport={{ once: true }}
              className={`absolute block rounded-full border-2 border-white ${
                i === points.length - 1 ? 'h-3.5 w-3.5 bg-brass' : 'h-2.5 w-2.5 bg-forest'
              }`}
              style={{
                left: `${toX(i)}%`,
                top: `${toY(point.value)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
              viewport={{ once: true }}
              className={`absolute -translate-x-1/2 whitespace-nowrap font-mono text-[11px] tabular-nums ${
                i === points.length - 1 ? 'text-brass' : 'text-forest'
              }`}
              style={{ left: `${toX(i)}%`, top: `calc(${toY(point.value)}% - 26px)` }}
            >
              {point.display}
            </motion.span>
          </div>
        ))}
      </div>

      <div className="relative mt-3 h-5 border-t border-line pt-3">
        {points.map((point, i) => (
          <span
            key={point.date}
            className="absolute -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-subtle"
            style={{ left: `${toX(i)}%` }}
          >
            {point.date}
          </span>
        ))}
      </div>
    </div>
  );
}
