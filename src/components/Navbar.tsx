'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { useAuditPopup } from './AuditPopup';

const NAV_LINKS = [
  { href: '/', label: 'Home', highlight: false },
  { href: '/features', label: 'Features', highlight: false },
  { href: '/rank-on-ai', label: 'Rank on AI', highlight: false },
  { href: '/seo-checker', label: 'Free SEO Check', highlight: true },
  { href: '/case-studies', label: 'Case Studies', highlight: false },
  { href: '/blog', label: 'Blog', highlight: false },
  { href: '/about', label: 'About', highlight: false },
];

export function Navbar() {
  const pathname = usePathname();
  const { open: openAuditPopup } = useAuditPopup();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-line bg-canvas/90 backdrop-blur-xl' : 'bg-transparent'
      }`}
      role="banner"
    >
      {/* Brass scroll-progress bar */}
      <span className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5" aria-label="Main navigation">
        <Logo />

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label, highlight }) => (
            <li key={href}>
              {highlight ? (
                <Link
                  href={href}
                  className={`inline-flex items-center rounded-full border px-3.5 py-1 font-body text-sm font-medium transition-all duration-200 ${
                    pathname === href
                      ? 'border-forest bg-forest/10 text-forest'
                      : 'border-forest/40 text-forest hover:border-forest hover:bg-forest/5'
                  }`}
                  aria-current={pathname === href ? 'page' : undefined}
                >
                  {label}
                </Link>
              ) : (
                <Link
                  href={href}
                  className={`relative font-body text-sm transition-colors duration-200 ${
                    pathname === href
                      ? 'text-brass'
                      : 'text-body hover:text-brass'
                  }`}
                  aria-current={pathname === href ? 'page' : undefined}
                >
                  {label}
                  {pathname === href && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brass rounded-full"
                    />
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={openAuditPopup}
            className="hidden md:inline-flex rounded-[3px] bg-forest px-5 py-2.5 text-sm font-body font-medium text-on-dark transition-all duration-300 hover:bg-forest-hover hover:glow-blue"
          >
            Get Free Audit
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-ink p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-line bg-panel"
          >
            <ul className="flex flex-col gap-1 p-6">
              {NAV_LINKS.map(({ href, label, highlight }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 px-4 rounded-[3px] font-body text-base transition-colors ${
                      highlight
                        ? pathname === href
                          ? 'text-forest bg-forest/10 font-medium'
                          : 'text-forest bg-forest/5 font-medium hover:bg-forest/10'
                        : pathname === href
                        ? 'text-brass bg-tag-bg'
                        : 'text-body hover:text-brass hover:bg-canvas'
                    }`}
                    aria-current={pathname === href ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <button
                  onClick={() => { setMobileOpen(false); openAuditPopup(); }}
                  className="block w-full rounded-[3px] bg-forest px-5 py-3 text-center text-sm font-medium text-on-dark"
                >
                  Get Free Audit
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
