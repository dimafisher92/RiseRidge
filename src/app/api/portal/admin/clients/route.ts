import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/portal/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSiteUrl, slugify } from '@/lib/portal/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A GoTrue invite fails when the email already belongs to an account. Detect
// that case so callers can react (roll back / clear message) rather than
// treating it as a generic send failure.
function isEmailInUse(err: unknown): boolean {
  const e = err as { code?: string; status?: number; message?: string } | null;
  return (
    e?.code === 'email_exists' ||
    e?.status === 422 ||
    /already .*(registered|exists)/i.test(e?.message ?? '')
  );
}

// Create a client account and invite its first user by email.
export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.contactEmail ?? '').trim();
  const fullName = String(body.fullName ?? '').trim();
  const slackUrl = String(body.slackChannelUrl ?? '').trim() || null;
  const slug = String(body.slug ?? '').trim() || slugify(name);

  if (!name) return NextResponse.json({ error: 'missing_name' }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  if (!slug) return NextResponse.json({ error: 'invalid_slug' }, { status: 400 });

  const admin = createAdminClient();

  const { data: client, error: cErr } = await admin
    .from('clients')
    .insert({ name, slug, slack_channel_url: slackUrl })
    .select('*')
    .single();

  if (cErr || !client) {
    const dup = cErr?.code === '23505';
    return NextResponse.json(
      { error: dup ? 'slug_taken' : 'create_failed', detail: cErr?.message },
      { status: dup ? 409 : 500 },
    );
  }

  const redirectTo = `${getSiteUrl()}/auth/callback/?next=/portal/dashboard/`;
  const { error: iErr } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { role: 'client', client_id: client.id, full_name: fullName || null },
    redirectTo,
  });

  if (iErr) {
    // The email already belongs to an account (e.g. this admin's own email). We
    // can't create a second account or downgrade the existing one, so undo the
    // orphan client row and tell the admin to use a different email.
    if (isEmailInUse(iErr)) {
      await admin.from('clients').delete().eq('id', client.id);
      return NextResponse.json({ error: 'email_in_use' }, { status: 409 });
    }
    // Other invite failures (e.g. email delivery) — keep the client so the invite
    // can be retried from the manage page, but surface that it didn't send.
    return NextResponse.json({ ok: true, clientId: client.id, invited: false, inviteError: iErr.message });
  }

  return NextResponse.json({ ok: true, clientId: client.id, invited: true });
}
