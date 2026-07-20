'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export type PortalNavItem = { href: string; label: string };

export function PortalNav({
  items,
  variant = 'sidebar',
}: {
  items: PortalNavItem[];
  variant?: 'sidebar' | 'top';
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href) || `${pathname}/` === href;

  if (variant === 'top') {
    return (
      <nav className="flex gap-1 overflow-x-auto">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              'whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors',
              isActive(it.href) ? 'bg-forest text-white' : 'text-body hover:bg-panel',
            )}
          >
            {it.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={cn(
            'block rounded-lg px-3 py-2 text-sm transition-colors',
            isActive(it.href)
              ? 'bg-white/20 font-semibold text-white'
              : 'font-medium text-on-dark hover:bg-white/10 hover:text-white',
          )}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
