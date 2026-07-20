import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/portal/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type HighlightInput = { label?: unknown; value?: unknown; note?: unknown; positive?: unknown };

// Create a draft report. Reports are free-form: a markdown `body`, an optional
// short `summary`, and a flexible list of headline `highlights` (label + value
// as text — no fixed KPI schema, since the numbers vary week to week).
// Screenshots and publishing are separate calls.
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
  const reportBody = String(body.body ?? '').trim() || null;
  const periodStart = String(body.periodStart ?? '').trim() || null;
  const periodEnd = String(body.periodEnd ?? '').trim() || null;
  const rawHighlights = Array.isArray(body.highlights) ? (body.highlights as HighlightInput[]) : [];

  if (!clientId) return NextResponse.json({ error: 'missing_client' }, { status: 400 });
  if (!title) return NextResponse.json({ error: 'missing_title' }, { status: 400 });

  const highlights = rawHighlights
    .map((h, i) => ({
      label: String(h.label ?? '').trim(),
      value: String(h.value ?? '').trim(),
      note: String(h.note ?? '').trim() || null,
      positive: h.positive !== false,
      sort_order: i,
    }))
    .filter((h) => h.label && h.value);

  const admin = createAdminClient();

  const { data: report, error: rErr } = await admin
    .from('reports')
    .insert({
      client_id: clientId,
      title,
      summary,
      body: reportBody,
      period_start: periodStart,
      period_end: periodEnd,
      status: 'draft',
      created_by: guard.ctx.profile.id,
    })
    .select('id')
    .single();

  if (rErr || !report) {
    return NextResponse.json({ error: 'create_failed', detail: rErr?.message }, { status: 500 });
  }

  if (highlights.length > 0) {
    const rows = highlights.map((h) => ({ ...h, report_id: report.id }));
    const { error: hErr } = await admin.from('report_highlights').insert(rows);
    if (hErr) {
      return NextResponse.json({ error: 'highlights_failed', detail: hErr.message, reportId: report.id }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, reportId: report.id });
}
