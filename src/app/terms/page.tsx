import { Metadata } from 'next';
import TermsContent from './TermsContent';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'Terms of Service & Course Purchase Policy | Ahsora',
  description:
    'Official terms and conditions, student code of conduct, user agreement, and course purchase policy for Ahsora Med Academy programs.',
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: 'Terms of Service & Course Purchase Policy | Ahsora',
    description:
      'Review the terms of service, payment policies, and intellectual property terms governing Ahsora Med Academy.',
    url: `${SITE_URL}/terms`,
    type: 'website',
  },
};

export default function TermsPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Terms of Service', url: '/terms' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TermsContent />
    </>
  );
}
