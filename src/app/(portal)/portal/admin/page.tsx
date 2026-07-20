import Link from 'next/link';
import { ArrowRight, Plus, Users } from 'lucide-react';
import { listClients } from '@/lib/portal/clients';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const clients = await listClients();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink md:text-4xl">Clients</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/portal/admin/reports/new/" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brass hover:text-brass">
            <Plus className="h-4 w-4" aria-hidden /> New report
          </Link>
          <Link href="/portal/admin/clients/new/" className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-on-dark hover:bg-forest-hover">
            <Plus className="h-4 w-4" aria-hidden /> New client
          </Link>
        </div>
      </header>

      {clients.length === 0 ? (
        <div className="rounded-[10px] border border-line bg-white p-8 text-center text-body">
          <Users className="mx-auto mb-3 h-6 w-6 text-subtle" aria-hidden />
          No clients yet. Create your first client to send an invite.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-line bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
                <th className="px-5 py-3 font-normal">Client</th>
                <th className="px-5 py-3 font-normal">Status</th>
                <th className="px-5 py-3 font-normal">Slack</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-line/60 last:border-0">
                  <td className="px-5 py-3">
                    <span className="font-medium text-ink">{c.name}</span>
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-body">{c.slug}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={c.status === 'active' ? 'text-forest' : 'text-subtle'}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-subtle">{c.slack_channel_url ? 'linked' : '—'}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/portal/admin/clients/${c.id}/`} className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-brass hover:underline">
                      Manage <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
