import type { Report, ReportMetric } from '@/lib/supabase/types';
import { formatDeltaPct, formatValue } from './format';

// A metric enriched with computed movement. `positive` respects
// higher_is_better so a *drop* in a "lower is better" metric (e.g. bounce rate)
// counts as good news.
export type Movement = {
  key: string;
  label: string;
  unit: ReportMetric['unit'];
  decimals: number;
  currentValue: number;
  priorValue: number | null;
  deltaAbs: number | null;
  deltaPct: number | null;
  positive: boolean;
  formattedCurrent: string;
  formattedPrior: string | null;
  formattedDelta: string | null;
};

export function computeMovement(m: ReportMetric): Movement {
  const hasPrior = m.prior_value !== null && m.prior_value !== undefined;
  const deltaAbs = hasPrior ? m.current_value - (m.prior_value as number) : null;
  const deltaPct =
    hasPrior && (m.prior_value as number) !== 0
      ? (m.current_value - (m.prior_value as number)) / Math.abs(m.prior_value as number)
      : null;

  // Direction of "good": align the actual movement with higher_is_better.
  const positive =
    deltaAbs === null
      ? false
      : m.higher_is_better
        ? deltaAbs > 0
        : deltaAbs < 0;

  return {
    key: m.key,
    label: m.label,
    unit: m.unit,
    decimals: m.decimals,
    currentValue: m.current_value,
    priorValue: m.prior_value,
    deltaAbs,
    deltaPct,
    positive,
    formattedCurrent: formatValue(m.current_value, m.unit, m.decimals),
    formattedPrior: hasPrior ? formatValue(m.prior_value as number, m.unit, m.decimals) : null,
    formattedDelta: formatDeltaPct(deltaPct),
  };
}

export function computeMovements(metrics: ReportMetric[]): Movement[] {
  return metrics.map(computeMovement);
}

// Magnitude used to rank movers: prefer relative change; fall back to a scaled
// absolute change when there's no prior (or prior is 0) so brand-new wins still
// surface.
function magnitude(m: Movement): number {
  if (m.deltaPct !== null) return Math.abs(m.deltaPct);
  if (m.deltaAbs !== null && m.currentValue !== 0) return Math.abs(m.deltaAbs) / Math.abs(m.currentValue);
  return 0;
}

// The dashboard's "what's trending up right now": positive movers, biggest first.
export function topPositiveMovers(metrics: ReportMetric[], limit = 4): Movement[] {
  return computeMovements(metrics)
    .filter((m) => m.positive && (m.deltaPct !== null || m.deltaAbs !== null))
    .sort((a, b) => magnitude(b) - magnitude(a))
    .slice(0, limit);
}

// Metrics above a strong-positive threshold (used by the Phase 2 trend-alert
// cron). Threshold is a ratio, e.g. 0.25 for +25%.
export function strongPositiveMovers(metrics: ReportMetric[], threshold: number): Movement[] {
  return computeMovements(metrics)
    .filter((m) => m.positive && m.deltaPct !== null && m.deltaPct >= threshold)
    .sort((a, b) => magnitude(b) - magnitude(a));
}

function periodLabel(report: Pick<Report, 'period_start' | 'period_end'>): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(report.period_start)} – ${fmt(report.period_end)}`;
}

// A one-line, auto-generated highlight from the biggest movers — mirrors the
// buildSummary style in src/lib/seo-checker/scoring.ts.
export function buildDashboardSummary(
  movers: Movement[],
  report: Pick<Report, 'period_start' | 'period_end'>,
): string {
  if (movers.length === 0) {
    return `A steady period (${periodLabel(report)}). No standout gains this time — your metrics are holding.`;
  }
  const phrases = movers
    .slice(0, 3)
    .map((m) => {
      const d = m.formattedDelta ? `${m.formattedDelta} ` : '';
      return `${m.label.toLowerCase()} ${d ? `is up ${m.formattedDelta}` : `reached ${m.formattedCurrent}`}`.replace(
        'up +',
        'up ',
      );
    });
  const joined =
    phrases.length === 1
      ? phrases[0]
      : `${phrases.slice(0, -1).join(', ')} and ${phrases[phrases.length - 1]}`;
  return `Over ${periodLabel(report)}, ${joined} — your strongest gains this period.`;
}
