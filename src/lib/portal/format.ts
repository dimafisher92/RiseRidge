import type { MetricUnit } from '@/lib/supabase/types';

// Render a raw stored number in its unit. Values are always stored numerically
// (e.g. 73896.7, 5.78) and formatted at display time — never stored as strings.
export function formatValue(value: number, unit: MetricUnit, decimals = 0): string {
  switch (unit) {
    case 'currency':
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    case 'percent':
      return `${value.toFixed(decimals)}%`;
    case 'duration_s': {
      const total = Math.round(value);
      if (total < 60) return `${total}s`;
      const m = Math.floor(total / 60);
      const s = total % 60;
      return s ? `${m}m ${s}s` : `${m}m`;
    }
    case 'number':
    default:
      return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
  }
}

// A signed percentage delta like "+109%" / "-4%". Small magnitudes keep one
// decimal so a 3.2% move doesn't round to 3%.
export function formatDeltaPct(deltaPct: number | null): string | null {
  if (deltaPct === null || !Number.isFinite(deltaPct)) return null;
  const pct = deltaPct * 100;
  const sign = pct > 0 ? '+' : '';
  const rounded = Math.abs(pct) < 10 ? Math.round(pct * 10) / 10 : Math.round(pct);
  return `${sign}${rounded}%`;
}
