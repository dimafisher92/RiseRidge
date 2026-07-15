import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CreateClientForm } from '@/components/portal/admin/CreateClientForm';

export const dynamic = 'force-dynamic';

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <Link href="/portal/admin/" className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle hover:text-brass">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Clients
      </Link>
      <h1 className="font-display text-3xl font-semibold text-ink">New client</h1>
      <p className="max-w-lg text-sm text-body">
        Create a client workspace and send an invite email. The recipient sets their password via the
        invite link and lands on their dashboard.
      </p>
      <CreateClientForm />
    </div>
  );
}
