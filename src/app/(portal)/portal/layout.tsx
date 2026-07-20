import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { PortalNav, type PortalNavItem } from '@/components/portal/PortalNav';
import { SignOutButton } from '@/components/portal/SignOutButton';
import { requireSession } from '@/lib/portal/session';

export const dynamic = 'force-dynamic';

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { profile, client } = await requireSession();
  const isAdmin = profile.role === 'admin';

  const items: PortalNavItem[] = [
    { href: '/portal/dashboard/', label: 'Dashboard' },
    { href: '/portal/reports/', label: 'Reports' },
    ...(isAdmin ? [{ href: '/portal/admin/', label: 'Admin' }] : []),
  ];

  const accountName = client?.name ?? (isAdmin ? 'RiseRidge Admin' : profile.full_name ?? 'Your account');

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar (desktop) */}
      <aside className="no-print hidden w-60 shrink-0 flex-col bg-forest px-5 py-6 md:flex">
        <Link href="/portal/dashboard/" aria-label="Portal home" className="mb-8 inline-block">
          <Logo onDark />
        </Link>
        <PortalNav items={items} />
        <div className="mt-auto pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-on-dark/75">
          {isAdmin ? 'Admin workspace' : 'Client portal'}
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print flex h-16 items-center justify-between border-b border-line bg-white px-6">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold text-ink">{accountName}</p>
          </div>
          <SignOutButton />
        </header>

        {/* Mobile nav */}
        <div className="no-print border-b border-line bg-white px-4 py-2 md:hidden">
          <PortalNav items={items} variant="top" />
        </div>

        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
