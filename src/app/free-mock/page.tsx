import { Metadata } from 'next';
import FreeMockContent from './FreeMockContent';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'Free IMAT Mock Exam: Test Your Readiness | Ahsora',
  description:
    'Take a free 60-question IMAT diagnostic mock test. Authentic +1.5/-0.4 marking system, 100-minute timed interface, detailed question explanations, and admission likelihood analysis.',
  alternates: {
    canonical: `${SITE_URL}/free-mock`,
  },
  openGraph: {
    title: 'Free IMAT Mock Exam: Test Your Readiness | Ahsora',
    description:
      'Attempt our free full-length IMAT CBT mock test with instant score report and European medical university cutoff benchmarking.',
    url: `${SITE_URL}/free-mock`,
    type: 'website',
  },
};

export default function FreeMockPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Free IMAT Mock Exam', url: '/free-mock' },
  ]);

  const quizJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: 'Free Diagnostic IMAT Examination Simulator',
    description:
      'Full-length 60-question practice test covering Biology, Chemistry, Physics & Mathematics, and Critical Reasoning with official Italian scoring penalties.',
    educationalLevel: 'University Entrance Examination',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Ahsora Med Academy',
      url: SITE_URL,
    },
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <FreeMockContent />
    </>
  );
}
