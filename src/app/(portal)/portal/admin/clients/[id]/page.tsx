import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getClientById } from '@/lib/portal/clients';
import { listClientUsers } from '@/lib/portal/admin';
import { ManageClientForm } from '@/components/portal/admin/ManageClientForm';

export const dynamic = 'force-dynamic';

export default async function ManageClientPage({ params }: { params: { id: string } }) {
  const client = await getClientById(params.id);
  if (!client) notFound();

  const users = await listClientUsers(params.id);

  return (
    <div className="space-y-6">
      <Link href="/portal/admin/" className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle hover:text-brass">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Clients
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">{client.name}</h1>
        <Link href="/portal/admin/reports/new/" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-body hover:border-brass hover:text-brass">
          New report for this client
        </Link>
      </div>
      <ManageClientForm client={client} users={users} />
    </div>
  );
}
