import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireSession } from '@/lib/portal/session';
import {
  getReportById,
  getReportMetrics,
  getReportScreenshots,
  signScreenshots,
} from '@/lib/portal/reports';
import { getClientById } from '@/lib/portal/clients';
import { computeMovements, topPositiveMovers } from '@/lib/portal/trends';
import { MetricTable } from '@/components/portal/MetricTable';
import { MetricBarChart } from '@/components/portal/MetricBarChart';
import { SlackButton } from '@/components/portal/SlackButton';
import { PrintButton } from '@/components/portal/PrintButton';

export const dynamic = 'force-dynamic';

function periodRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const { client } = await requireSession();

  // RLS ensures a client can only load its own published report; anything else
  // returns null here.
  const report = await getReportById(params.id);
  if (!report) notFound();

  const [metrics, screenshots, reportClient] = await Promise.all([
    getReportMetrics(report.id),
    getReportScreenshots(report.id),
    getClientById(report.client_id),
  ]);
  const signed = await signScreenshots(screenshots);

  const movements = computeMovements(metrics);
  const featured =
    topPositiveMovers(metrics, 1)[0] ?? movements.find((m) => m.priorValue !== null) ?? null;
  const slackUrl = reportClient?.slack_channel_url ?? client?.slack_channel_url ?? null;

  return (
    <article className="print-report mx-auto max-w-4xl space-y-8">
      <div className="no-print">
        <Link
          href="/portal/reports/"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle hover:text-brass"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> All reports
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
            {periodRange(report.period_start, report.period_end)}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink md:text-4xl">{report.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SlackButton url={slackUrl} />
          <PrintButton />
        </div>
      </header>

      {report.summary && (
        <section className="max-w-3xl">
          <p className="text-body leading-relaxed">{report.summary}</p>
        </section>
      )}

      {featured && (
        <section>
          <MetricBarChart movement={featured} />
        </section>
      )}

      {movements.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">All metrics</h2>
          <MetricTable movements={movements} />
        </section>
      )}

      {signed.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-ink">Report screenshots</h2>
          <div className="grid grid-cols-1 gap-6">
            {signed.map((s) =>
              s.signedUrl ? (
                <figure key={s.id} className="overflow-hidden rounded-[10px] border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.signedUrl}
                    alt={s.caption ?? 'Report screenshot'}
                    className="w-full"
                    loading="lazy"
                  />
                  {s.caption && (
                    <figcaption className="border-t border-line px-4 py-2 text-sm text-subtle">
                      {s.caption}
                    </figcaption>
                  )}
                </figure>
              ) : null,
            )}
          </div>
        </section>
      )}

      <div className="no-print flex justify-center pt-4">
        <SlackButton url={slackUrl} label="Have a question? Ask in Slack" />
      </div>
    </article>
  );
}
