import type { Movement } from '@/lib/portal/trends';

// Data-driven version of the OrganicSalesChart summary table: one row per
// metric with current, prior, and change. Delta is coloured by whether the
// move is *good* (respects higher_is_better), not merely by its sign.
export function MetricTable({ movements }: { movements: Movement[] }) {
  if (movements.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-[10px] border border-line bg-white">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
            <th className="py-3 px-5 font-normal">Metric</th>
            <th className="py-3 px-5 text-right font-normal">Current</th>
            <th className="py-3 px-5 text-right font-normal">Prior</th>
            <th className="py-3 px-5 text-right font-normal">Change</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => (
            <tr key={m.key} className="border-b border-line/60 last:border-0">
              <td className="py-3 px-5 text-sm text-body">{m.label}</td>
              <td className="py-3 px-5 text-right text-sm font-semibold text-ink tabular-nums">
                {m.formattedCurrent}
              </td>
              <td className="py-3 px-5 text-right text-sm text-subtle tabular-nums">
                {m.formattedPrior ?? '—'}
              </td>
              <td
                className="py-3 px-5 text-right text-sm font-semibold tabular-nums"
                style={{ color: m.formattedDelta ? (m.positive ? '#1E3A2E' : '#a23b3b') : undefined }}
              >
                {m.formattedDelta ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
