import { Metadata } from 'next';
import LicensingExamsContent from './LicensingExamsContent';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'Medical Licensing Exams: USMLE, PLAB, AMC & Italian Degree Recognition | Ahsora',
  description:
    'Comprehensive international recognition guide for graduates of Italian English-taught medical schools (LM-41). Routes to residency and medical practice: USMLE (USA), PLAB/UKMLA (UK), AMC (Australia), and FMGE (India).',
  alternates: {
    canonical: `${SITE_URL}/licensing-exams`,
  },
  openGraph: {
    title: 'Medical Licensing Exams: USMLE, PLAB, AMC & Italian Degree Recognition | Ahsora',
    description:
      'Can you practice medicine globally with an Italian MD? Detailed licensing breakdown for US, UK, Australia, Canada, and EU hospitals.',
    url: `${SITE_URL}/licensing-exams`,
    type: 'website',
  },
};

export default function LicensingExamsPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Medical Licensing Exams', url: '/licensing-exams' },
  ]);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Global Medical Licensing Pathways: Practicing with an Italian MD Degree',
    description:
      'Detailed breakdown of international medical licensing exams (USMLE, PLAB, AMC) and ECFMG/GMC accreditation for Italian medical graduates.',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <LicensingExamsContent />
    </>
  );
}
