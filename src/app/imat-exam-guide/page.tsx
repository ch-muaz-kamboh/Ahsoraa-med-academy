import { Metadata } from 'next';
import IMATContent from '../imat/IMATContent';
import { SITE_URL } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'IMAT 2027 Exam Guide: Syllabus, Scoring & Dates | Ahsora',
  description: 'The ultimate guide to the International Medical Admissions Test (IMAT). Learn the 60-question syllabus, +1.5/-0.4 scoring penalty, and 2027 registration dates.',
  alternates: {
    canonical: `${SITE_URL}/imat-exam-guide`,
  },
  openGraph: {
    title: 'IMAT 2027 Exam Guide: Syllabus, Scoring & Dates | Ahsora',
    description: 'The ultimate guide to the International Medical Admissions Test (IMAT). Learn the 60-question syllabus, +1.5/-0.4 scoring penalty, and 2027 registration dates.',
    url: `${SITE_URL}/imat-exam-guide`,
    type: 'website',
  },
};

export default function IMATExamGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'IMAT Exam Guide',
            item: `${SITE_URL}/imat-exam-guide`
          }
        ]
      },
      {
        '@type': 'Course',
        name: 'IMAT Italy Medical Entrance Prep',
        description: 'Complete IMAT preparation with live teaching, mock exams, and analytics.',
        provider: {
          '@type': 'Organization',
          name: 'Ahsora Med Academy',
          sameAs: SITE_URL
        },
        hasCourseInstance: [
          {
            '@type': 'CourseInstance',
            courseMode: 'Online',
            courseWorkload: 'PT150H'
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IMATContent />
    </>
  );
}
