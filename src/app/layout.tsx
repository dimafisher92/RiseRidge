import type { Metadata } from 'next';
import './globals.css';

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RiseRidge — AI-Driven SEO. Measurable Growth.',
    description:
      'AI-Driven SEO. Measurable growth.',
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
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          {...{ nowprocket: '', 'nitro-exclude': '' }}
          type="text/javascript"
          id="sa-dynamic-optimization"
          data-uuid="f60d7650-5656-471b-bfe1-581cfb6aa360"
          src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vc2VvLnJpc2VyaWRnZS5pby9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gImY2MGQ3NjUwLTU2NTYtNDcxYi1iZmUxLTU4MWNmYjZhYTM2MCI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="
        ></script>
      </head>
      <body className="bg-canvas text-body font-body antialiased">{children}</body>
    </html>
  );
}
