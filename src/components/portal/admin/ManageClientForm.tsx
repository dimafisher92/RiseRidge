'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { Client } from '@/lib/supabase/types';
import type { ClientUser } from '@/lib/portal/admin';

const inputCls =
  'w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-forest focus:outline-none';
const labelCls = 'mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-body';
const cardCls = 'rounded-[10px] border border-line bg-white p-6';
const btnCls =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-on-dark hover:bg-forest-hover disabled:opacity-60';
const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm text-body hover:border-brass hover:text-brass disabled:opacity-60';

async function patchClient(clientId: string, payload: Record<string, unknown>) {
  const res = await fetch(`/api/portal/admin/clients/${clientId}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data } as const;
}

export function ManageClientForm({ client, users }: { client: Client; users: ClientUser[] }) {
  const router = useRouter();
  const [name, setName] = useState(client.name);
  const [slack, setSlack] = useState(client.slack_channel_url ?? '');
  const [status, setStatus] = useState<Client['status']>(client.status);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  async function run(key: string, payload: Record<string, unknown>, successText: string) {
    setBusy(key);
    setFeedback(null);
    const { ok, data } = await patchClient(client.id, payload);
    setBusy(null);
    if (!ok) {
      setFeedback({ kind: 'err', text: data.detail || data.error || 'Action failed.' });
      return;
    }
    setFeedback({ kind: 'ok', text: successText });
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-6">
      {feedback && (
        <p className={feedback.kind === 'ok' ? 'text-sm text-forest' : 'text-sm text-[#a23b3b]'}>
          {feedback.text}
        </p>
      )}

      {/* Details */}
      <section className={cardCls}>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Details</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="c-name">Name</label>
            <input id="c-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="c-slack">Slack channel URL</label>
            <input id="c-slack" className={inputCls} value={slack} onChange={(e) => setSlack(e.target.value)} placeholder="https://app.slack.com/client/…" />
          </div>
          <div>
            <label className={labelCls} htmlFor="c-status">Status</label>
            <select id="c-status" className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as Client['status'])}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          <button
            className={btnCls}
            disabled={busy === 'update'}
            onClick={() => run('update', { action: 'update', name, slackChannelUrl: slack, status }, 'Saved.')}
          >
            {busy === 'update' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Save details
          </button>
        </div>
      </section>

      {/* Users */}
      <section className={cardCls}>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Users</h2>
        {users.length === 0 ? (
          <p className="text-sm text-subtle">No users yet.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((u) => (
              <UserRow key={u.id} clientId={client.id} user={u} onDone={() => router.refresh()} />
            ))}
          </ul>
        )}

        <div className="mt-6 border-t border-line pt-6">
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Invite another user</h3>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px] flex-1">
              <label className={labelCls} htmlFor="inv-email">Email</label>
              <input id="inv-email" type="email" className={inputCls} value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="user@company.com" />
            </div>
            <div className="min-w-[160px] flex-1">
              <label className={labelCls} htmlFor="inv-name">Name (optional)</label>
              <input id="inv-name" className={inputCls} value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
            </div>
            <button
              className={btnGhost}
              disabled={busy === 'invite'}
              onClick={() => run('invite', { action: 'invite', email: inviteEmail, fullName: inviteName }, 'Invite sent.')}
            >
              {busy === 'invite' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Send invite
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function UserRow({
  clientId,
  user,
  onDone,
}: {
  clientId: string;
  user: ClientUser;
  onDone: () => void;
}) {
  const [newEmail, setNewEmail] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function act(key: string, payload: Record<string, unknown>, ok: string) {
    setBusy(key);
    setNote(null);
    const res = await patchClient(clientId, payload);
    setBusy(null);
    setNote(res.ok ? ok : res.data.detail || res.data.error || 'Failed.');
    if (res.ok) onDone();
  }

  return (
    <li className="rounded-lg border border-line/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">{user.email ?? '(no email)'}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
            {user.role}
            {user.full_name ? ` · ${user.full_name}` : ''}
          </p>
        </div>
        <button
          className={btnGhost}
          disabled={busy === 'reset' || !user.email}
          onClick={() => act('reset', { action: 'reset_password', email: user.email }, 'Reset email sent.')}
        >
          {busy === 'reset' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Send password reset
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-2">
        <input
          className={`${inputCls} max-w-xs`}
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="new@email.com"
        />
        <button
          className={btnGhost}
          disabled={busy === 'email' || !newEmail}
          onClick={() => act('email', { action: 'change_email', userId: user.id, newEmail }, 'Email change requested.')}
        >
          {busy === 'email' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Change email
        </button>
      </div>
      {note && <p className="mt-2 text-xs text-subtle">{note}</p>}
    </li>
  );
}
