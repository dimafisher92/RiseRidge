import Link from 'next/link';
import { Logo } from './Logo';

const EXPLORE = [
  { href: '/features', label: 'Features' },
  { href: '/rank-on-ai', label: 'Rank on AI' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/blog', label: 'Blog' },
];

const COMPANY = [
  { href: '/about', label: 'About' },
  { href: '/seo-checker', label: 'Free SEO Check' },
  { href: '/case-studies', label: 'Results' },
];

export function Footer() {
  return (
    <footer className="bg-ink text-on-ink-muted" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo size="small" onDark />
            <p className="mt-4 text-sm leading-relaxed max-w-xs text-on-ink-muted">
              AI-driven SEO, engineered for measurable growth. Compounding visibility since 2020.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.16em] uppercase text-brass mb-4">Explore</h4>
            <ul className="space-y-3">
              {EXPLORE.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-on-ink-muted hover:text-brass transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.16em] uppercase text-brass mb-4">Company</h4>
            <ul className="space-y-3">
              {COMPANY.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-on-ink-muted hover:text-brass transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.16em] uppercase text-brass mb-4">Connect</h4>
            <p className="text-sm text-on-ink-muted">hello@riseridge.io</p>
            <div className="mt-4 flex gap-4">
              {[
                { name: 'LinkedIn', path: 'M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.02 8h4.96v12H.02V8zm7.7 0h4.76v1.64h.07c.66-1.26 2.28-2.58 4.7-2.58C21.87 7.06 24 9.58 24 14.24V20h-4.97v-5.09c0-2.15-.77-3.62-2.7-3.62-1.47 0-2.35.99-2.73 1.95-.14.34-.18.82-.18 1.3V20H8.37c.07-12 .05-12 .05-12h-.7z' },
                { name: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { name: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
              ].map(({ name, path }) => (
                <a
                  key={name}
                  href="#"
                  className="text-on-ink-muted hover:text-brass transition-colors duration-200"
                  aria-label={name}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-ink-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] tracking-[0.1em] text-subtle">
            &copy; {new Date().getFullYear()} RiseRidge · riseridge.io
          </p>
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-subtle">
            Privacy · Terms
          </p>
        </div>
      </div>
    </footer>
  );
}
