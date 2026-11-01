import { Metadata } from 'next';
import ScholarshipsContent from '../medical-universities-italy/scholarships/ScholarshipsContent';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'Italian Medical School Scholarships 2026/2027 (20 Regions DSU Guide) | Ahsora',
  description:
    'Comprehensive guide to regional DSU Italian government scholarships for international medical students. Covers 100% tuition waivers, €7,000+ living stipends, and ISEE-Parificato calculation across all 20 regions.',
  alternates: {
    canonical: `${SITE_URL}/medical-universities-italy/scholarships`,
  },
  openGraph: {
    title: 'Italian Medical School Scholarships 2026/2027 (20 Regions DSU Guide) | Ahsora',
    description:
      'Verified guide to EDISU, ER.GO, DiSCo, ALiSEO, and regional Italian scholarships. Full tuition waivers, meals, and annual cash stipends.',
    url: `${SITE_URL}/medical-universities-italy/scholarships`,
    type: 'website',
  },
};

export default function ScholarshipsLegacyPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Italian Scholarships 2026/2027', url: '/medical-universities-italy/scholarships' },
  ]);

  const scholarshipJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialAid',
    name: 'Italian Regional DSU Medical Scholarships (20 Regions)',
    description:
      'Income-based regional university grants in Italy providing full tuition exemption, free campus canteen meals, free accommodation, and up to €7,500 annual cash stipend.',
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'Italian Ministry of Universities and Research (MUR) & Regional DSU Agencies',
      url: 'https://www.mur.gov.it',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Italy',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(scholarshipJsonLd) }}
      />
      <ScholarshipsContent />
    </>
  );
}
