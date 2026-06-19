import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { AuditPopupProvider } from '@/components/AuditPopup';

export const metadata: Metadata = {
  metadataBase: new URL('https://riseridge.io'),
  title: {
    default: 'RiseRidge — AI-Driven SEO. Measurable Growth.',
    template: '%s | RiseRidge',
  },
  description:
    'RiseRidge pairs AI-powered SEO infrastructure with hands-on strategy to move businesses from invisible to undeniable — and prove every gain in the numbers.',
  openGraph: {
    title: 'RiseRidge — AI-Driven SEO. Measurable Growth.',
    description:
      'AI-Driven SEO. Measurable growth. We engineer organic search growth that compounds.',
    type: 'website',
    siteName: 'RiseRidge',
    locale: 'en_US',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RiseRidge — AI-Driven SEO. Measurable Growth.',
    description:
      'AI-Driven SEO. Measurable growth.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Hanken+Grotesk:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-canvas text-body font-body antialiased">
        <AuditPopupProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <JsonLd type="organization" />
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </AuditPopupProvider>
      </body>
    </html>
  );
}
