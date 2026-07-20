'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const inputCls =
  'w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-forest focus:outline-none';
const labelCls = 'mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-body';

export function CreateClientForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [slackChannelUrl, setSlackChannelUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/portal/admin/clients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contactEmail, fullName, slackChannelUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === 'slug_taken'
            ? 'A client with that slug already exists — try a different name.'
            : data.error === 'invalid_email'
              ? 'Enter a valid contact email.'
              : 'Could not create the client. Please try again.',
        );
        return;
      }
      if (data.invited === false) {
        setNotice('Client created, but the invite email failed to send. You can retry the invite from the client page.');
      }
      router.push(`/portal/admin/clients/${data.clientId}/`);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <div>
        <label className={labelCls} htmlFor="name">Client name</label>
        <input id="name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="TwoPackBag" />
      </div>
      <div>
        <label className={labelCls} htmlFor="contactEmail">Contact email (invite)</label>
        <input id="contactEmail" type="email" className={inputCls} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="owner@company.com" />
      </div>
      <div>
        <label className={labelCls} htmlFor="fullName">Contact name (optional)</label>
        <input id="fullName" className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Marc Fabrega" />
      </div>
      <div>
        <label className={labelCls} htmlFor="slack">Slack channel URL (optional)</label>
        <input id="slack" className={inputCls} value={slackChannelUrl} onChange={(e) => setSlackChannelUrl(e.target.value)} placeholder="https://app.slack.com/client/…" />
      </div>

      {error && <p className="text-sm text-[#a23b3b]">{error}</p>}
      {notice && <p className="text-sm text-forest">{notice}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-on-dark hover:bg-forest-hover disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Create client &amp; send invite
      </button>
    </form>
  );
}
