import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/portal/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/portal/site';
import type { MetricUnit } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UNITS: MetricUnit[] = ['number', 'currency', 'percent', 'duration_s'];

type MetricInput = {
  label?: unknown;
  key?: unknown;
  currentValue?: unknown;
  priorValue?: unknown;
  unit?: unknown;
  higherIsBetter?: unknown;
  decimals?: unknown;
};

// Create a draft report and its metric rows. Screenshots and publishing are
// separate calls (upload, then publish).
export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const clientId = String(body.clientId ?? '').trim();
  const title = String(body.title ?? '').trim();
  const summary = String(body.summary ?? '').trim() || null;
  const periodStart = String(body.periodStart ?? '').trim();
  const periodEnd = String(body.periodEnd ?? '').trim();
  const compareStart = String(body.compareStart ?? '').trim() || null;
  const compareEnd = String(body.compareEnd ?? '').trim() || null;
  const rawMetrics = Array.isArray(body.metrics) ? (body.metrics as MetricInput[]) : [];

  if (!clientId) return NextResponse.json({ error: 'missing_client' }, { status: 400 });
  if (!title) return NextResponse.json({ error: 'missing_title' }, { status: 400 });
  if (!periodStart || !periodEnd) return NextResponse.json({ error: 'missing_period' }, { status: 400 });

  // Normalise + validate metric rows.
  const usedKeys = new Set<string>();
  const metrics = [];
  for (let i = 0; i < rawMetrics.length; i++) {
    const m = rawMetrics[i];
    const label = String(m.label ?? '').trim();
    if (!label) continue;
    const current = Number(m.currentValue);
    if (!Number.isFinite(current)) {
      return NextResponse.json({ error: 'invalid_metric', detail: `"${label}" has a non-numeric current value` }, { status: 400 });
    }
    const priorRaw = m.priorValue;
    const prior =
      priorRaw === '' || priorRaw === null || priorRaw === undefined ? null : Number(priorRaw);
    if (prior !== null && !Number.isFinite(prior)) {
      return NextResponse.json({ error: 'invalid_metric', detail: `"${label}" has a non-numeric prior value` }, { status: 400 });
    }
    const unit = (UNITS.includes(m.unit as MetricUnit) ? m.unit : 'number') as MetricUnit;
    let key = String(m.key ?? '').trim() || slugify(label) || `metric-${i + 1}`;
    while (usedKeys.has(key)) key = `${key}-${i + 1}`;
    usedKeys.add(key);

    metrics.push({
      key,
      label,
      current_value: current,
      prior_value: prior,
      unit,
      higher_is_better: m.higherIsBetter !== false,
      decimals: Number.isFinite(Number(m.decimals)) ? Math.max(0, Math.min(4, Number(m.decimals))) : 0,
      sort_order: i,
    });
  }

  const admin = createAdminClient();

  const { data: report, error: rErr } = await admin
    .from('reports')
    .insert({
      client_id: clientId,
      title,
      summary,
      period_start: periodStart,
      period_end: periodEnd,
      compare_start: compareStart,
      compare_end: compareEnd,
      status: 'draft',
      created_by: guard.ctx.profile.id,
    })
    .select('*')
    .single();

  if (rErr || !report) {
    return NextResponse.json({ error: 'create_failed', detail: rErr?.message }, { status: 500 });
  }

  if (metrics.length > 0) {
    const rows = metrics.map((m) => ({ ...m, report_id: report.id }));
    const { error: mErr } = await admin.from('report_metrics').insert(rows);
    if (mErr) {
      return NextResponse.json({ error: 'metrics_failed', detail: mErr.message, reportId: report.id }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, reportId: report.id });
}
