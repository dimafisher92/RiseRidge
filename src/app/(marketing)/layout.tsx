import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { AuditPopupProvider } from '@/components/AuditPopup';

// Marketing chrome (nav, footer, booking-popup context, org JSON-LD) lives here
// so the portal route group can render its own app shell without it.
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuditPopupProvider>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <JsonLd type="organization" />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </AuditPopupProvider>
  );
}
