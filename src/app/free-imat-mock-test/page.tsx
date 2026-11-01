import { Metadata } from 'next';
import FreeMockContent from '../free-mock/FreeMockContent';
import { SITE_URL, getBreadcrumbJsonLd, getFaqJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'Free IMAT Mock Test 2027 | Exact +1.5/-0.4 Scoring | Ahsora',
  description:
    "Practice with Ahsora's authentic, full-length IMAT mock test. Experience 60 questions, a 100-minute timer, and the official +1.5/-0.4 Italian Ministry scoring logic instantly.",
  alternates: {
    canonical: `${SITE_URL}/free-imat-mock-test`,
  },
  openGraph: {
    title: 'Free IMAT Mock Test 2027 | Exact +1.5/-0.4 Scoring | Ahsora',
    description:
      "Practice with Ahsora's authentic, full-length IMAT mock test. Experience 60 questions, a 100-minute timer, and the official +1.5/-0.4 Italian Ministry scoring logic instantly.",
    url: `${SITE_URL}/free-imat-mock-test`,
    type: 'website',
    siteName: 'Ahsora Med Academy',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Ahsora Free IMAT Mock Test Simulator 2027',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free IMAT Mock Test 2027 | Exact +1.5/-0.4 Scoring | Ahsora',
    description:
      "Practice with Ahsora's authentic, full-length IMAT mock test. Experience 60 questions, a 100-minute timer, and the official +1.5/-0.4 Italian Ministry scoring logic instantly.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  keywords: [
    'free imat mock test',
    'imat mock test 2027',
    'free imat practice test',
    'imat exam simulation',
    'imat 60 questions 100 minutes',
    'imat scoring simulator',
    'italian medical school admission test free mock',
    'study medicine in italy mock test',
  ],
};

export default function FreeImatMockTestPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Free IMAT Mock Test', url: '/free-imat-mock-test' },
  ]);

  // SoftwareApplication Schema requested in SEO Dev Handoff
  const softwareApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ahsora Free IMAT Mock Test Simulator',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web browser',
    description:
      'A full-length, 60-question timed diagnostic mock exam for the International Medical Admissions Test (IMAT) featuring official +1.5/-0.4 scoring.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Ahsora Meds Academy',
      url: SITE_URL,
    },
  };

  // Quiz schema for Google rich snippet recognition
  const quizJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: 'Free IMAT Mock Test (2027 Syllabus & Scoring)',
    description:
      'Full-length 60-question diagnostic exam covering Biology, Chemistry, Physics & Mathematics, and Reading Skills & Logical Reasoning with official MUR negative marking.',
    educationalLevel: 'University Entrance Examination',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Ahsora Meds Academy',
      url: SITE_URL,
    },
    isAccessibleForFree: true,
  };

  // FAQPage Schema for Search SERP Rich Snippets
  const faqJsonLd = getFaqJsonLd([
    {
      q: 'Is the Ahsora IMAT mock test completely free?',
      a: 'Yes, the diagnostic IMAT mock exam is 100% free with unlimited attempts and requires no credit card or account to start.',
    },
    {
      q: 'How does scoring work in this IMAT mock test?',
      a: 'The test strictly follows the official Italian Ministry of University and Research (MUR) marking scheme: +1.5 points for each correct answer, -0.4 points penalty for each incorrect answer, and 0 points for unattempted questions, out of a maximum of 90 marks.',
    },
    {
      q: 'How many questions are included and what is the time limit?',
      a: 'The exam contains 60 multiple-choice questions (Biology, Chemistry, Physics & Mathematics, and Reading Skills/Reasoning) to be solved within a realistic 100-minute timed testing interface.',
    },
    {
      q: 'Do I get detailed question solutions after completing the test?',
      a: 'Yes, upon finishing the test, you instantly receive your raw score out of 90, question-by-question explanations, and subject-wise accuracy breakdown.',
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FreeMockContent />
    </>
  );
}
