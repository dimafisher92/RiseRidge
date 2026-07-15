'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { MetricUnit } from '@/lib/supabase/types';

const inputCls =
  'w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-forest focus:outline-none';
const labelCls = 'mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-subtle';

type MetricRow = {
  label: string;
  currentValue: string;
  priorValue: string;
  unit: MetricUnit;
  higherIsBetter: boolean;
  decimals: string;
};

const emptyRow = (): MetricRow => ({
  label: '',
  currentValue: '',
  priorValue: '',
  unit: 'number',
  higherIsBetter: true,
  decimals: '0',
});

export function ReportUploadForm({ clients }: { clients: { id: string; name: string }[] }) {
  const router = useRouter();
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [compareStart, setCompareStart] = useState('');
  const [compareEnd, setCompareEnd] = useState('');
  const [summary, setSummary] = useState('');
  const [metrics, setMetrics] = useState<MetricRow[]>([emptyRow()]);
  const [files, setFiles] = useState<File[]>([]);
  const [publishNow, setPublishNow] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateRow(i: number, patch: Partial<MetricRow>) {
    setMetrics((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!clientId) return setError('Select a client.');
    if (!title.trim()) return setError('Enter a report title.');
    if (!periodStart || !periodEnd) return setError('Set the reporting period.');

    setBusy(true);
    try {
      // 1) create the draft report + metrics
      const createRes = await fetch('/api/portal/admin/reports/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          title,
          summary,
          periodStart,
          periodEnd,
          compareStart,
          compareEnd,
          metrics: metrics
            .filter((m) => m.label.trim())
            .map((m) => ({
              label: m.label,
              currentValue: m.currentValue,
              priorValue: m.priorValue,
              unit: m.unit,
              higherIsBetter: m.higherIsBetter,
              decimals: Number(m.decimals) || 0,
            })),
        }),
      });
      const created = await createRes.json();
      if (!createRes.ok) {
        setError(created.detail || created.error || 'Could not create the report.');
        return;
      }
      const reportId: string = created.reportId;

      // 2) upload screenshots (if any)
      if (files.length > 0) {
        const fd = new FormData();
        files.forEach((f) => fd.append('files', f));
        const upRes = await fetch(`/api/portal/admin/reports/${reportId}/screenshots/`, {
          method: 'POST',
          body: fd,
        });
        if (!upRes.ok) {
          const up = await upRes.json().catch(() => ({}));
          setError(`Report saved, but screenshot upload failed: ${up.detail || up.error || 'unknown error'}.`);
          return;
        }
      }

      // 3) publish (optional)
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
          <input id="r-title" className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="June 2026 Performance" />
        </div>
        <div>
          <label className={labelCls} htmlFor="r-ps">Period start</label>
          <input id="r-ps" type="date" className={inputCls} value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="r-pe">Period end</label>
          <input id="r-pe" type="date" className={inputCls} value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="r-cs">Comparison start (optional)</label>
          <input id="r-cs" type="date" className={inputCls} value={compareStart} onChange={(e) => setCompareStart(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="r-ce">Comparison end (optional)</label>
          <input id="r-ce" type="date" className={inputCls} value={compareEnd} onChange={(e) => setCompareEnd(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="r-summary">Summary</label>
          <textarea id="r-summary" className={`${inputCls} min-h-[90px]`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="A short written summary the client sees first." />
        </div>
      </section>

      {/* Metric rows */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Metrics</h2>
          <button type="button" className="inline-flex items-center gap-1 text-sm text-brass hover:underline" onClick={() => setMetrics((r) => [...r, emptyRow()])}>
            <Plus className="h-4 w-4" aria-hidden /> Add metric
          </button>
        </div>
        <p className="text-xs text-subtle">Enter raw numbers only (e.g. 73896.7, 5.78). Deltas are computed for you.</p>

        <div className="space-y-3">
          {metrics.map((m, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-line p-3 sm:grid-cols-12 sm:items-end">
              <div className="sm:col-span-3">
                <label className={labelCls}>Label</label>
                <input className={inputCls} value={m.label} onChange={(e) => updateRow(i, { label: e.target.value })} placeholder="Total sales" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Current</label>
                <input className={inputCls} inputMode="decimal" value={m.currentValue} onChange={(e) => updateRow(i, { currentValue: e.target.value })} placeholder="73896.7" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Prior</label>
                <input className={inputCls} inputMode="decimal" value={m.priorValue} onChange={(e) => updateRow(i, { priorValue: e.target.value })} placeholder="35409.94" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Unit</label>
                <select className={inputCls} value={m.unit} onChange={(e) => updateRow(i, { unit: e.target.value as MetricUnit })}>
                  <option value="number">Number</option>
                  <option value="currency">Currency</option>
                  <option value="percent">Percent</option>
                  <option value="duration_s">Duration (s)</option>
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className={labelCls}>Dec.</label>
                <input className={inputCls} inputMode="numeric" value={m.decimals} onChange={(e) => updateRow(i, { decimals: e.target.value })} />
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <label className="flex items-center gap-2 text-xs text-body">
                  <input type="checkbox" checked={m.higherIsBetter} onChange={(e) => updateRow(i, { higherIsBetter: e.target.checked })} />
                  Higher is better
                </label>
                {metrics.length > 1 && (
                  <button type="button" aria-label="Remove metric" className="text-subtle hover:text-[#a23b3b]" onClick={() => setMetrics((r) => r.filter((_, idx) => idx !== i))}>
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshots */}
      <section className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-ink">Screenshots</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="block w-full text-sm text-body file:mr-4 file:rounded-lg file:border-0 file:bg-forest file:px-4 file:py-2 file:text-sm file:font-semibold file:text-on-dark hover:file:bg-forest-hover"
        />
        {files.length > 0 && <p className="text-xs text-subtle">{files.length} file(s) selected.</p>}
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
          className="ml-auto inline-flex items-center justify-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-on-dark hover:bg-forest-hover disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {publishNow ? 'Save & publish' : 'Save draft'}
        </button>
      </div>
    </form>
  );
}
