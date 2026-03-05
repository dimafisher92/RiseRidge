import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rankpilot.ai'),
  title: {
    default: 'RankPilot — AI-Powered SEO Agency',
    template: '%s | RankPilot',
  },
  description:
    'RankPilot combines proprietary AI with deep SEO expertise to help e-commerce and growth-stage businesses dominate organic search. Get measurable ranking results.',
  openGraph: {
    title: 'RankPilot — AI-Powered SEO Agency',
    description:
      'AI-Powered SEO. Precision Navigation to the Top. Dominate organic search with proprietary AI tooling.',
    type: 'website',
    siteName: 'RankPilot',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RankPilot — AI-Powered SEO Agency',
    description:
      'AI-Powered SEO. Precision Navigation to the Top.',
  },
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-void text-ice font-body antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <JsonLd type="organization" />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
