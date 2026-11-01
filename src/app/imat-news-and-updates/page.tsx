import { Metadata } from 'next';
import NewsContent from '../news/NewsContent';

export const metadata: Metadata = {
  title: 'IMAT News & Updates: Italian Medical Universities Admissions | Ahsora',
  description: 'Read the latest news on the IMAT 2027 exam, official MUR decree announcements, Universitaly registration deadlines, and Italian medical school cut-offs.',
  alternates: {
    canonical: 'https://ahsora.com/imat-news-and-updates',
  },
  openGraph: {
    title: 'IMAT News & Updates: Italian Medical Universities Admissions | Ahsora',
    description: 'Read the latest news on the IMAT 2027 exam, official MUR decree announcements, Universitaly registration deadlines, and Italian medical school cut-offs.',
    url: 'https://ahsora.com/imat-news-and-updates',
    type: 'website',
  },
};

export default function IMATNewsAndUpdatesPage() {
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
            item: 'https://ahsora.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'IMAT News & Updates',
            item: 'https://ahsora.com/imat-news-and-updates',
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'IMAT News & Updates: Italian Medical Universities Admissions | Ahsora',
        description: 'Read the latest news on the IMAT 2027 exam, official MUR decree announcements, Universitaly registration deadlines, and Italian medical school cut-offs.',
        url: 'https://ahsora.com/imat-news-and-updates',
        publisher: {
          '@type': 'EducationalOrganization',
          name: 'Ahsora Meds Academy',
          url: 'https://ahsora.com',
          logo: 'https://ahsora.com/icon.png',
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
