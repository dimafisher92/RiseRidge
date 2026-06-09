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
      <head>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <script {...({ nowprocket: '', 'nitro-exclude': '' } as any)} type="text/javascript" id="sa-dynamic-optimization" data-uuid="69c19330-9b18-47eb-a773-170b1a8b2e2e" src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vc2VvLmdzbWdyb3d0aGFnZW5jeS5jb20vc2NyaXB0cy9keW5hbWljX29wdGltaXphdGlvbi5qcyI7c2NyaXB0LmRhdGFzZXQudXVpZCA9ICI2OWMxOTMzMC05YjE4LTQ3ZWItYTc3My0xNzBiMWE4YjJlMmUiO3NjcmlwdC5pZCA9ICJzYS1keW5hbWljLW9wdGltaXphdGlvbi1sb2FkZXIiO2RvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTs=" />
      </head>
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
