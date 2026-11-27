import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How RiseRidge (Golden Stream Media LLC) collects, uses and shares information on riseridge.io, including the free SEO checker and Microsoft Clarity.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" file="privacy.md" href="/privacy" lastUpdated="November 27, 2026" />;
}
