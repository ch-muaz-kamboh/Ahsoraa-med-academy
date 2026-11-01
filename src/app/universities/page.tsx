import { Metadata } from 'next';
import UniversitiesContent from './UniversitiesContent';
import { getDefaultCutoffStore } from '@/lib/cutoff-store';
import { SITE_URL } from '@/lib/seo-constants';

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: '17 IMAT Medical Universities in Italy (2027) | Ahsora',
  description: 'Explore all 17 Italian public medical universities offering English-taught Medicine (LM41). Compare 2027 IMAT cut-offs, EU/Non-EU seat quotas, and tuition.',
  alternates: {
    canonical: `${SITE_URL}/medical-universities-italy`,
  },
  openGraph: {
    title: '17 IMAT Medical Universities in Italy (2027) | Ahsora',
    description: 'Explore all 17 Italian public medical universities offering English-taught Medicine (LM41). Compare 2027 IMAT cut-offs, EU/Non-EU seat quotas, and tuition.',
    url: `${SITE_URL}/medical-universities-italy`,
    type: 'website',
  },
};

export default function UniversitiesPage() {
  const cutoffStore = getDefaultCutoffStore();

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
            name: 'Medical Universities in Italy',
            item: `${SITE_URL}/medical-universities-italy`
          }
        ]
      },
      {
        '@type': 'Dataset',
        name: 'Italian Medical Universities IMAT Cutoff Scores & Seat Quotas (2026/2027)',
        description: 'Complete verified 2026/2027 cutoff scores, admission thresholds, and EU/Non-EU seat distribution for English-taught medicine in Italy.',
        creator: {
          '@type': 'Organization',
          name: 'Ahsora Meds Academy',
          url: SITE_URL
        },
        temporalCoverage: '2023/2027',
        spatialCoverage: 'Italy'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UniversitiesContent initialCutoffStore={cutoffStore} />
    </>
  );
}
