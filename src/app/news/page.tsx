import { Metadata } from 'next';
import NewsContent from './NewsContent';

export const metadata: Metadata = {
  title: 'IMAT News & Updates: Italian Medical Universities Admissions | Ahsora',
  description: 'Read the latest news on the IMAT 2027 exam, official MUR decree announcements, Universitaly registration deadlines, and Italian medical school cut-offs.',
  alternates: {
    canonical: 'https://ahsorameds.com/imat-news-and-updates',
  },
  openGraph: {
    title: 'IMAT News & Updates: Italian Medical Universities Admissions | Ahsora',
    description: 'Read the latest news on the IMAT 2027 exam, official MUR decree announcements, Universitaly registration deadlines, and Italian medical school cut-offs.',
    url: 'https://ahsorameds.com/imat-news-and-updates',
    type: 'website',
  },
};

export default function NewsPage() {
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
            item: 'https://ahsorameds.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'News & Guides',
            item: 'https://ahsorameds.com/imat-news-and-updates',
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'IMAT News & Updates: Italian Medical Universities Admissions | Ahsora',
        description: 'Read the latest news on the IMAT 2027 exam, official MUR decree announcements, Universitaly registration deadlines, and Italian medical school cut-offs.',
        url: 'https://ahsorameds.com/imat-news-and-updates',
        publisher: {
          '@type': 'EducationalOrganization',
          name: 'Ahsora Meds Academy',
          url: 'https://ahsorameds.com',
          logo: 'https://ahsorameds.com/icon.png',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsContent />
    </>
  );
}
