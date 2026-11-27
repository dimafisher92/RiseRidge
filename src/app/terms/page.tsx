import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms for using riseridge.io and the free SEO checker, operated by Golden Stream Media LLC (RiseRidge). Results vary and are not guaranteed.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return <LegalPage title="Terms of Service" file="terms.md" href="/terms" lastUpdated="November 27, 2026" />;
}
