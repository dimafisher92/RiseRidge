import type { Metadata } from 'next';
import { requireSession } from '@/lib/portal/session';
import { listPublishedReports, getMetricsForReports } from '@/lib/portal/reports';
import { topPositiveMovers } from '@/lib/portal/trends';
import { ReportCard } from '@/components/portal/ReportCard';
import type { ReportMetric } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Reports' };

function periodRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default async function ReportsPage() {
  const { client } = await requireSession();

  if (!client) {
    return (
      <div className="max-w-xl">
        <h1 className="font-display text-3xl font-semibold text-ink">Reports</h1>
        <p className="mt-3 text-body">
          Admins manage reports from the <a className="text-brass underline" href="/portal/admin/">admin area</a>.
        </p>
      </div>
    );
  }

  const reports = await listPublishedReports(client.id);
  const metrics = await getMetricsForReports(reports.map((r) => r.id));

  const byReport = new Map<string, ReportMetric[]>();
  for (const m of metrics) {
    const arr = byReport.get(m.report_id) ?? [];
    arr.push(m);
    byReport.set(m.report_id, arr);
  }

  const highlightFor = (reportId: string): string | null => {
    const top = topPositiveMovers(byReport.get(reportId) ?? [], 1)[0];
    if (!top) return null;
    return top.formattedDelta ? `${top.label} ${top.formattedDelta}` : `${top.label} ${top.formattedCurrent}`;
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass">Report history</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink md:text-4xl">Your reports</h1>
      </header>

      {reports.length === 0 ? (
        <div className="rounded-[10px] border border-line bg-white p-8 text-center text-body">
          No reports yet — your first one is on its way.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {reports.map((r, i) => (
            <ReportCard
              key={r.id}
              id={r.id}
              title={r.title}
              periodLabel={periodRange(r.period_start, r.period_end)}
              highlight={highlightFor(r.id)}
              isLatest={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
