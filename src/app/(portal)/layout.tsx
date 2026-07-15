import type { Metadata } from 'next';

// The portal is private, authenticated surface — keep it out of search indexes.
// (robots.ts also disallows /portal; this is belt-and-suspenders.)
export const metadata: Metadata = {
  title: {
    default: 'Client Portal',
    template: '%s | RiseRidge Portal',
  },
  robots: { index: false, follow: false },
};

// This group-level layout intentionally adds no chrome: the login/auth screens
// render bare, while the authenticated area gets its shell from
// (portal)/portal/layout.tsx.
export default function PortalGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-canvas text-body">{children}</div>;
}
