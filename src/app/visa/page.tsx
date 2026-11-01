import { Metadata } from 'next';
import VisaContent from './VisaContent';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'Italy Student Visa (Type D) & Universitaly Pre-Enrolment Guide | Ahsora',
  description:
    'Complete step-by-step guide for non-EU international medical students. Italian National Type D Visa requirements, CIMEA Statement of Comparability, Declaration of Value (DOV), sponsor finances, and VFS appointments.',
  alternates: {
    canonical: `${SITE_URL}/visa`,
  },
  openGraph: {
    title: 'Italy Student Visa (Type D) & Universitaly Pre-Enrolment Guide | Ahsora',
    description:
      'Verified checklists for Italian Type D study visa, Universitaly summaries, CIMEA/DOV, and European medical study visas.',
    url: `${SITE_URL}/visa`,
    type: 'website',
  },
};

export default function VisaGuidePage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Visa & Pre-Enrolment Guide', url: '/visa' },
  ]);

  const visaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: 'Italian National Type D Student Visa (Long Stay) Application Guide',
    serviceType: 'Student Visa & Pre-Enrolment Advisory',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Ahsora Med Academy',
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Italy',
    },
    description:
      'Official advisory and checklist for non-EU students applying for university pre-enrolment via Universitaly and Italian National Type D study visas.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(visaJsonLd) }}
      />
      <VisaContent />
    </>
  );
}
