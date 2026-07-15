import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { listClients } from '@/lib/portal/clients';
import { ReportUploadForm } from '@/components/portal/admin/ReportUploadForm';

export const dynamic = 'force-dynamic';

export default async function NewReportPage() {
  const clients = await listClients();

  return (
    <div className="space-y-6">
      <Link href="/portal/admin/" className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle hover:text-brass">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Admin
      </Link>
      <h1 className="font-display text-3xl font-semibold text-ink">New report</h1>
      {clients.length === 0 ? (
        <p className="text-body">
          Create a <Link href="/portal/admin/clients/new/" className="text-brass underline">client</Link> first.
        </p>
      ) : (
        <ReportUploadForm clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
      )}
    </div>
  );
}
