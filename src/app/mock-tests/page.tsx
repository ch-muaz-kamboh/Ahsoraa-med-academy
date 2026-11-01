import { Metadata } from 'next';
import MockTestsContent from './MockTestsContent';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'IMAT Mock Tests & CBT Exam Engine (+1.5 / -0.4 Scoring) | Ahsora',
  description:
    'Practice with 12 full-length Computer-Based Tests (CBT) strictly calibrated to the Italian IMAT format. Synchronized 100-minute timers, +1.5/-0.4 marking penalty, and subject analytics.',
  alternates: {
    canonical: `${SITE_URL}/mock-tests`,
  },
  openGraph: {
    title: 'IMAT Mock Tests & CBT Exam Engine (+1.5 / -0.4 Scoring) | Ahsora',
    description:
      'Practice under realistic IMAT testing conditions. Automated calculation, mistake notebooks, and ranking percentiles.',
    url: `${SITE_URL}/mock-tests`,
    type: 'website',
  },
};

export default function MockTestsPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Mock Tests & CBT Engine', url: '/mock-tests' },
  ]);

  const mockAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ahsora CBT Mock Exam Simulator',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All web browsers',
    description:
      'Computer-Based Testing software simulating the Italian IMAT entrance examination with authentic negative marking (+1.5 / -0.4).',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Free trial mock test available with full review',
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'Ahsora Med Academy',
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mockAppJsonLd) }}
      />
      <MockTestsContent />
    </>
  );
}
