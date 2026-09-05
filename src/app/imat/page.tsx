import { Metadata } from 'next';
import IMATContent from './IMATContent';

export const metadata: Metadata = {
  title: 'IMAT 2027 Guide: Exam Date, Syllabus, Scoring & Preparation | Ahsora Med Academy',
  description: 'The complete IMAT guide: exam structure, syllabus, scoring, eligibility, registration, university options and costs. Take a free IMAT mock and explore Ahsora\'s live teaching system.',
};

export default function IMATPage() {
  // Structured data based on the spec
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
            item: 'https://ahsora.com/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'IMAT',
            item: 'https://ahsora.com/imat'
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
          sameAs: 'https://ahsora.com'
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
