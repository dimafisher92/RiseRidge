'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const inputCls =
  'w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-forest focus:outline-none';
const labelCls = 'mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-body';

type HighlightRow = { label: string; value: string; note: string; positive: boolean };

const emptyHighlight = (): HighlightRow => ({ label: '', value: '', note: '', positive: true });

export function ReportUploadForm({ clients }: { clients: { id: string; name: string }[] }) {
  const router = useRouter();
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [summary, setSummary] = useState('');
  const [reportBody, setReportBody] = useState('');
  const [highlights, setHighlights] = useState<HighlightRow[]>([emptyHighlight()]);
  const [files, setFiles] = useState<File[]>([]);
  const [publishNow, setPublishNow] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateHighlight(i: number, patch: Partial<HighlightRow>) {
    setHighlights((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!clientId) return setError('Select a client.');
    if (!title.trim()) return setError('Enter a report title.');

    setBusy(true);
    try {
      const createRes = await fetch('/api/portal/admin/reports/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          title,
          summary,
          body: reportBody,
          periodStart,
          periodEnd,
          highlights: highlights
            .filter((h) => h.label.trim() && h.value.trim())
            .map((h) => ({ label: h.label, value: h.value, note: h.note, positive: h.positive })),
        }),
      });
      const created = await createRes.json();
      if (!createRes.ok) {
        setError(created.detail || created.error || 'Could not create the report.');
        return;
      }
      const reportId: string = created.reportId;

      if (files.length > 0) {
        const fd = new FormData();
        files.forEach((f) => fd.append('files', f));
        const upRes = await fetch(`/api/portal/admin/reports/${reportId}/screenshots/`, { method: 'POST', body: fd });
        if (!upRes.ok) {
          const up = await upRes.json().catch(() => ({}));
          setError(`Report saved, but screenshot upload failed: ${up.detail || up.error || 'unknown error'}.`);
          return;
        }
      }

      if (publishNow) {
        const pubRes = await fetch(`/api/portal/admin/reports/${reportId}/publish/`, { method: 'POST' });
        if (!pubRes.ok) {
          setError('Report saved but publishing failed. You can retry from the report.');
          return;
        }
      }

      router.push(`/portal/reports/${reportId}/`);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="r-client">Client</label>
          <select id="r-client" className={inputCls} value={clientId} onChange={(e) => setClientId(e.target.value)}>
            {clients.length === 0 && <option value="">No clients yet</option>}
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="r-title">Title</label>
          <input id="r-title" className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bi-weekly SEO update — July 16" />
        </div>
        <div>
          <label className={labelCls} htmlFor="r-ps">Period start (optional)</label>
          <input id="r-ps" type="date" className={inputCls} value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="r-pe">Period end (optional)</label>
          <input id="r-pe" type="date" className={inputCls} value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="r-summary">Short summary (shown on the dashboard)</label>
          <textarea id="r-summary" className={`${inputCls} min-h-[70px]`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One or two sentences the client sees first." />
        </div>
      </section>

      {/* Highlights — flexible headline numbers */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Highlights</h2>
          <button type="button" className="inline-flex items-center gap-1 text-sm text-brass hover:underline" onClick={() => setHighlights((r) => [...r, emptyHighlight()])}>
            <Plus className="h-4 w-4" aria-hidden /> Add highlight
          </button>
        </div>
        <p className="text-xs text-body">A few key numbers to feature this period — any format (e.g. &ldquo;35,100&rdquo;, &ldquo;+149%&rdquo;, &ldquo;$336,249&rdquo;, &ldquo;position 1.4&rdquo;). Optional.</p>

        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-line p-3 sm:grid-cols-12 sm:items-end">
              <div className="sm:col-span-3">
                <label className={labelCls}>Label</label>
                <input className={inputCls} value={h.label} onChange={(e) => updateHighlight(i, { label: e.target.value })} placeholder="Total Impressions" />
              </div>
              <div className="sm:col-span-3">
                <label className={labelCls}>Value</label>
                <input className={inputCls} value={h.value} onChange={(e) => updateHighlight(i, { value: e.target.value })} placeholder="35,100" />
              </div>
              <div className="sm:col-span-4">
                <label className={labelCls}>Note (optional)</label>
                <input className={inputCls} value={h.note} onChange={(e) => updateHighlight(i, { note: e.target.value })} placeholder="+149% vs prior period" />
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <label className="flex items-center gap-2 text-xs text-body">
                  <input type="checkbox" checked={h.positive} onChange={(e) => updateHighlight(i, { positive: e.target.checked })} />
                  Positive
                </label>
                {highlights.length > 1 && (
                  <button type="button" aria-label="Remove highlight" className="text-subtle hover:text-[#a23b3b]" onClick={() => setHighlights((r) => r.filter((_, idx) => idx !== i))}>
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Body — free-form write-up */}
      <section className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-ink">Report write-up</h2>
        <p className="text-xs text-body">
          Paste or write the full report. Markdown works — use <code className="font-mono">## Heading</code>,
          <code className="font-mono"> - bullet</code>, and <code className="font-mono">**bold**</code>. This is where the flexible,
          week-specific detail goes.
        </p>
        <textarea
          className={`${inputCls} min-h-[280px] font-mono text-[13px] leading-relaxed`}
          value={reportBody}
          onChange={(e) => setReportBody(e.target.value)}
          placeholder={'## Search Performance\n- Total Clicks: 29\n- Total Impressions: 35,100\n- Average Position: 18.5\n\n## Completed Optimizations\n- Title Tags: 85/85 — fully complete\n...'}
        />
      </section>

      {/* Screenshots */}
      <section className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-ink">Screenshots</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="block w-full text-sm text-body file:mr-4 file:rounded-lg file:border-0 file:bg-forest file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-forest-hover"
        />
        {files.length > 0 && <p className="text-xs text-body">{files.length} file(s) selected.</p>}
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-4">
        <label className="flex items-center gap-2 text-sm text-body">
          <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} />
          Publish immediately (client can see it)
        </label>
        {error && <p className="text-sm text-[#a23b3b]">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="ml-auto inline-flex items-center justify-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-hover disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {publishNow ? 'Save & publish' : 'Save draft'}
        </button>
      </div>
    </form>
  );
}
