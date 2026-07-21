import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/portal/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSiteUrl } from '@/lib/portal/site';
import type { Client } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Account management actions for a single client:
//   update          — edit name / slack URL / status
//   invite          — invite an additional user to the client
//   reset_password  — send a password-recovery email to a user
//   change_email    — change a user's login email
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const admin = createAdminClient();
  const action = String(body.action ?? '');

  if (action === 'update') {
    const patch: Partial<Client> = {};
    if (typeof body.name === 'string' && body.name.trim()) patch.name = body.name.trim();
    if (typeof body.slackChannelUrl === 'string') patch.slack_channel_url = body.slackChannelUrl.trim() || null;
    if (body.status === 'active' || body.status === 'paused') patch.status = body.status;
    if (typeof body.notifyOptOut === 'boolean') patch.notify_opt_out = body.notifyOptOut;
    if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });

    const { error } = await admin.from('clients').update(patch).eq('id', params.id);
    if (error) return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === 'invite') {
    const email = String(body.email ?? '').trim();
    const fullName = String(body.fullName ?? '').trim();
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    const redirectTo = `${getSiteUrl()}/auth/callback/?next=/portal/dashboard/`;
    const { error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { role: 'client', client_id: params.id, full_name: fullName || null },
      redirectTo,
    });
    if (error) {
      const e = error as { code?: string; status?: number; message?: string };
      if (e.code === 'email_exists' || e.status === 422 || /already .*(registered|exists)/i.test(e.message ?? '')) {
        return NextResponse.json({ error: 'email_in_use' }, { status: 409 });
      }
      return NextResponse.json({ error: 'invite_failed', detail: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === 'reset_password') {
    const email = String(body.email ?? '').trim();
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    const redirectTo = `${getSiteUrl()}/auth/callback/?next=/reset-password/`;
    const { error } = await admin.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return NextResponse.json({ error: 'reset_failed', detail: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === 'change_email') {
    const userId = String(body.userId ?? '').trim();
    const newEmail = String(body.newEmail ?? '').trim();
    if (!userId) return NextResponse.json({ error: 'missing_user' }, { status: 400 });
    if (!EMAIL_RE.test(newEmail)) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    const { error } = await admin.auth.admin.updateUserById(userId, { email: newEmail });
    if (error) return NextResponse.json({ error: 'change_email_failed', detail: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
}
