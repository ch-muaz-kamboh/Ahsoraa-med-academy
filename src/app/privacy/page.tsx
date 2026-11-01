import { Metadata } from 'next';
import PrivacyContent from './PrivacyContent';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'Privacy Policy & GDPR Compliance | Ahsora',
  description:
    'Ahsora Med Academy privacy policy, student data security measures, cookie policies, and GDPR / international privacy standards.',
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy & GDPR Compliance | Ahsora',
    description:
      'How Ahsora Med Academy protects your personal information, consultation records, and student application data.',
    url: `${SITE_URL}/privacy`,
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PrivacyContent />
    </>
  );
}
