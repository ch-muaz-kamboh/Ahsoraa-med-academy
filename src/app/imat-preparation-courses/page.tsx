import { Metadata } from 'next';
import CoursesContent from '../courses/CoursesContent';

export const metadata: Metadata = {
  title: 'IMAT Preparation Courses & Mock Exams | Ahsora',
  description: 'Prepare for the IMAT with Ahsora Meds Academy. Choose between self-paced study or live classes. Access our exact +1.5/-0.4 mock exam engine and analytics.',
  alternates: {
    canonical: 'https://ahsora.com/imat-preparation-courses',
  },
  openGraph: {
    title: 'IMAT Preparation Courses & Mock Exams | Ahsora',
    description: 'Prepare for the IMAT with Ahsora Meds Academy. Choose between self-paced study or live classes. Access our exact +1.5/-0.4 mock exam engine and analytics.',
    url: 'https://ahsora.com/imat-preparation-courses',
    type: 'website',
  },
};

export default function IMATPreparationCoursesPage() {
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
            name: 'IMAT Preparation Courses',
            item: 'https://ahsora.com/imat-preparation-courses'
          }
        ]
      },
      {
        '@type': 'Product',
        name: 'Ahsora IMAT Preparation Courses & Mock Exam Engine',
        description: 'Elite IMAT preparation courses: Ascend, Mastery, and MedPath Elite tiers with custom mock test scoring.',
        brand: {
          '@type': 'Brand',
          name: 'Ahsora Meds Academy'
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'EUR',
          lowPrice: '299',
          highPrice: '1499',
          offerCount: '3'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CoursesContent />
    </>
  );
}
