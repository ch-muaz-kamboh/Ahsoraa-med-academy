import type { Metadata } from 'next';
import UniversityDetailContent from './UniversityDetailContent';
import { mockUniversities } from '@/lib/mock-data';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo-constants';

function findUniversity(id: string) {
  const lookupKey = decodeURIComponent(id).toLowerCase();
  return (
    mockUniversities.find(
      (u) =>
        u.id.toLowerCase() === lookupKey ||
        u.slug.toLowerCase() === lookupKey ||
        u.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(lookupKey.replace(/[^a-z0-9]/g, '')) ||
        (u.italianName && u.italianName.toLowerCase().replace(/[^a-z0-9]/g, '').includes(lookupKey.replace(/[^a-z0-9]/g, '')))
    ) || mockUniversities[0]
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const university = findUniversity(id);

  if (!university) {
    return {
      title: 'University Not Found | Ahsora',
      description: 'The requested Italian medical school could not be located.',
    };
  }

  const title = `${university.name} Medicine in English (IMAT Cut-offs & Admissions) | Ahsora`;
  const description = `Complete guide to studying medicine in English at ${university.name} in ${university.city}, Italy. 2027 IMAT cutoff scores, seat quotas, tuition fees, and hospital rotations.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/medical-universities-italy/${university.slug || university.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/medical-universities-italy/${university.slug || university.id}`,
      type: 'website',
    },
  };
}

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const university = findUniversity(id);

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Medical Universities in Italy', url: '/medical-universities-italy' },
    { name: university?.name || 'University Details', url: `/medical-universities-italy/${id}` },
  ]);

  const universityJsonLd = university
    ? {
        '@context': 'https://schema.org',
        '@type': 'CollegeOrUniversity',
        name: university.name,
        alternateName: university.italianName,
        address: {
          '@type': 'PostalAddress',
          addressLocality: university.city,
          addressCountry: 'IT',
        },
        description: university.description,
        hasCourse: {
          '@type': 'Course',
          name: 'Medicine and Surgery (LM-41 Single-Cycle MD)',
          courseMode: 'Full-time, In-person',
          inLanguage: 'en',
          educationalCredentialAwarded: 'Laurea Magistrale a Ciclo Unico in Medicina e Chirurgia (MD)',
        },
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {universityJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(universityJsonLd) }}
        />
      )}
      <UniversityDetailContent params={Promise.resolve({ id })} />
    </>
  );
}
