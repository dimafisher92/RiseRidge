import { requireAdmin } from '@/lib/portal/session';

export const dynamic = 'force-dynamic';

// Defense-in-depth: re-check admin role at the layout level (middleware also
// gates /portal/admin, but never rely on it alone).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
