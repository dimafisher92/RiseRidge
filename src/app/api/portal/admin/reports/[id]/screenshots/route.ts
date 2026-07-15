import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/portal/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { STORAGE_BUCKET } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Upload one or more screenshots for a report to the private Storage bucket and
// record their metadata. Path convention: reports/<client_id>/<report_id>/<uuid>.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();

  const { data: report } = await admin
    .from('reports')
    .select('id, client_id')
    .eq('id', params.id)
    .single();
  if (!report) return NextResponse.json({ error: 'report_not_found' }, { status: 404 });

  const form = await req.formData();
  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  const captions = form.getAll('captions').map((c) => String(c));
  if (files.length === 0) return NextResponse.json({ error: 'no_files' }, { status: 400 });

  // Continue sort order after any existing screenshots.
  const { count } = await admin
    .from('report_screenshots')
    .select('id', { count: 'exact', head: true })
    .eq('report_id', report.id);
  const base = count ?? 0;

  const uploaded: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    const path = `reports/${report.client_id}/${report.id}/${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await admin.storage
      .from(STORAGE_BUCKET)
      .upload(path, buffer, { contentType: file.type || 'image/png', upsert: false });
    if (upErr) {
      return NextResponse.json({ error: 'upload_failed', detail: upErr.message, uploaded }, { status: 500 });
    }

    const caption = (captions[i] ?? '').trim() || null;
    const { error: insErr } = await admin.from('report_screenshots').insert({
      report_id: report.id,
      storage_path: path,
      caption,
      sort_order: base + i,
    });
    if (insErr) {
      return NextResponse.json({ error: 'record_failed', detail: insErr.message, uploaded }, { status: 500 });
    }
    uploaded.push(path);
  }

  return NextResponse.json({ ok: true, count: uploaded.length });
}
