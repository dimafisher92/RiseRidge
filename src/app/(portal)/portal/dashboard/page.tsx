import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { requireSession } from '@/lib/portal/session';
import { getLatestPublishedReport, getReportMetrics } from '@/lib/portal/reports';
import { topPositiveMovers, buildDashboardSummary } from '@/lib/portal/trends';
import { TrendTiles } from '@/components/portal/TrendTiles';
import { SlackButton } from '@/components/portal/SlackButton';

export const dynamic = 'force-dynamic';

function periodRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default async function DashboardPage() {
  const { profile, client } = await requireSession();

  // Admins have no client of their own — point them to the admin workspace.
  if (profile.role === 'admin' && !client) {
    return (
      <div className="max-w-xl space-y-4">
        <h1 className="font-display text-3xl font-semibold text-ink">Admin workspace</h1>
        <p className="text-body">
          You&apos;re signed in as an admin. Manage client accounts and publish reports from the admin area.
        </p>
        <Link
          href="/portal/admin/"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-on-dark hover:bg-forest-hover"
        >
          Go to admin <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-xl">
        <h1 className="font-display text-3xl font-semibold text-ink">Welcome</h1>
        <p className="mt-3 text-body">
          Your account isn&apos;t linked to a client workspace yet. Please contact your RiseRidge
          representative.
        </p>
      </div>
    );
  }

  const report = await getLatestPublishedReport(client.id);

  if (!report) {
    return (
      <div className="max-w-xl space-y-4">
        <h1 className="font-display text-3xl font-semibold text-ink">{client.name}</h1>
        <div className="rounded-[10px] border border-line bg-white p-8 text-center">
          <p className="text-body">Your first report is on its way — check back soon.</p>
          <div className="mt-4 flex justify-center">
            <SlackButton url={client.slack_channel_url} />
          </div>
        </div>
      </div>
    );
  }

  const metrics = await getReportMetrics(report.id);
  const movers = topPositiveMovers(metrics, 4);
  const autoSummary = buildDashboardSummary(movers, report);

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass">Dashboard</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink md:text-4xl">{client.name}</h1>
      </header>

      {/* Latest report */}
      <section className="rounded-[10px] border border-line bg-white p-6 shadow-[0_8px_28px_rgba(21,20,15,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-block rounded-full border border-tag-border bg-tag-bg px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-forest">
              Latest report
            </span>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{report.title}</h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
              {periodRange(report.period_start, report.period_end)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Link
              href={`/portal/reports/${report.id}/`}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-on-dark hover:bg-forest-hover"
            >
              View report <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <SlackButton url={client.slack_channel_url} />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="max-w-3xl space-y-3">
        <h2 className="font-display text-xl font-semibold text-ink">Summary</h2>
        {report.summary && <p className="text-body leading-relaxed">{report.summary}</p>}
        <p className="rounded-lg border-l-2 border-brass bg-panel/50 px-4 py-3 text-sm text-body">
          {autoSummary}
        </p>
      </section>

      {/* Trending up */}
      {movers.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-ink">What&apos;s trending up</h2>
          <TrendTiles movers={movers} />
        </section>
      )}
    </div>
  );
}
