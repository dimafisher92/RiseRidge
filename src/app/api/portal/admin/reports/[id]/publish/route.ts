import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/portal/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Publish a report so its client can see it.
// Phase 2 will additionally send the "new report" email + write notifications_log here.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('reports')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', params.id)
    .select('id, client_id')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'publish_failed', detail: error?.message }, { status: 500 });
  }

  // TODO(phase 2): trigger new-report email + insert notifications_log(new_report).

  return NextResponse.json({ ok: true });
}
