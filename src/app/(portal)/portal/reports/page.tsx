import type { Metadata } from 'next';
import { requireSession } from '@/lib/portal/session';
import { listPublishedReports, getHighlightsForReports } from '@/lib/portal/reports';
import { ReportCard } from '@/components/portal/ReportCard';
import type { ReportHighlight } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Reports' };

function periodRange(start: string | null, end: string | null) {
  if (!start || !end) return '';
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
          Admins manage reports from the <a className="text-brass-text underline" href="/portal/admin/">admin area</a>.
        </p>
      </div>
    );
  }

  const reports = await listPublishedReports(client.id);
  const highlights = await getHighlightsForReports(reports.map((r) => r.id));

  const firstHighlight = new Map<string, ReportHighlight>();
  for (const h of highlights) {
    if (!firstHighlight.has(h.report_id)) firstHighlight.set(h.report_id, h);
  }

  const teaser = (reportId: string): string | null => {
    const h = firstHighlight.get(reportId);
    return h ? `${h.label}: ${h.value}` : null;
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass-text">Report history</p>
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
              periodLabel={periodRange(r.period_start, r.period_end) || 'Report'}
              highlight={teaser(r.id)}
              isLatest={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
