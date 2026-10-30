import { Metadata } from 'next';
import ResourcesContent from '../resources/ResourcesContent';
import { getResourceDocuments } from '@/lib/cms-store';

export const metadata: Metadata = {
  title: 'Free IMAT Past Papers & Official Answer Keys (2011-2026) | Ahsora',
  description: "Download official IMAT past papers in PDF format with verified answer keys completely free. Access Ahsora's library of syllabus notes, cheat sheets, and MCQs.",
  alternates: {
    canonical: 'https://ahsora.com/imat-past-papers-and-resources',
  },
  openGraph: {
    title: 'Free IMAT Past Papers & Official Answer Keys (2011-2026) | Ahsora',
    description: "Download official IMAT past papers in PDF format with verified answer keys completely free. Access Ahsora's library of syllabus notes, cheat sheets, and MCQs.",
    url: 'https://ahsora.com/imat-past-papers-and-resources',
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
    url: 'https://ahsora.com/imat-past-papers-and-resources',
    provider: {
      '@type': 'Organization',
      name: 'Ahsora Meds Academy',
      url: 'https://ahsora.com',
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
