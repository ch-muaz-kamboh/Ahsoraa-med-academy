import { Metadata } from 'next';
import ResourcesContent from '../resources/ResourcesContent';
import { getResourceDocuments } from '@/lib/cms-store';
import { SITE_URL } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'Free IMAT Past Papers & Official Answer Keys (2011-2026) | Ahsora',
  description: "Download official IMAT past papers in PDF format with verified answer keys completely free. Access Ahsora's library of syllabus notes, cheat sheets, and MCQs.",
  alternates: {
    canonical: `${SITE_URL}/imat-past-papers-and-resources`,
  },
  openGraph: {
    title: 'Free IMAT Past Papers & Official Answer Keys (2011-2026) | Ahsora',
    description: "Download official IMAT past papers in PDF format with verified answer keys completely free. Access Ahsora's library of syllabus notes, cheat sheets, and MCQs.",
    url: `${SITE_URL}/imat-past-papers-and-resources`,
    type: 'website',
  },
};

export default function IMATPastPapersAndResourcesPage() {
  const initialDocuments = getResourceDocuments();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free IMAT Past Papers & Official Answer Keys (2011-2026)',
    description: "Download official IMAT past papers in PDF format with verified answer keys completely free.",
    url: `${SITE_URL}/imat-past-papers-and-resources`,
    provider: {
      '@type': 'Organization',
      name: 'Ahsora Meds Academy',
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResourcesContent initialDocuments={initialDocuments} />
    </>
  );
}
