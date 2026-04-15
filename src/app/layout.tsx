import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { AuditPopupProvider } from '@/components/AuditPopup';

const inter = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-jetbrains-mono',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://arcwave.io'),
  title: {
    default: 'ArcWave — AI-Driven SEO. Measurable Growth.',
    template: '%s | ArcWave',
  },
  description:
    'ArcWave combines AI-powered SEO infrastructure with hands-on strategic execution to move businesses from invisible to undeniable. Measurable organic search growth.',
  openGraph: {
    title: 'ArcWave — AI-Driven SEO. Measurable Growth.',
    description:
      'AI-Driven SEO. Measurable Growth. We engineer organic search growth that compounds.',
    type: 'website',
    siteName: 'ArcWave',
    locale: 'en_US',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArcWave — AI-Driven SEO. Measurable Growth.',
    description:
      'AI-Driven SEO. Measurable Growth.',
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
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-void text-ice font-body antialiased">
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
