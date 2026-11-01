import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseDetailContent from './CourseDetailContent';
import { mockCourses } from '@/lib/mock-data';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo-constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = mockCourses.find((c) => c.slug === slug || c.id === slug) || mockCourses[0];

  if (!course) {
    return {
      title: 'Course Not Found | Ahsora',
      description: 'The requested IMAT preparation course could not be located.',
    };
  }

  const title = `${course.title} — IMAT Preparation | Ahsora`;
  const description = course.description.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/courses/${course.slug || course.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/courses/${course.slug || course.id}`,
      type: 'website',
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = mockCourses.find((c) => c.slug === slug || c.id === slug);

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Courses', url: '/imat-preparation-courses' },
    { name: course?.title || 'Course Details', url: `/courses/${slug}` },
  ]);

  const courseJsonLd = course
    ? {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Ahsora Med Academy',
          url: SITE_URL,
        },
        offers: {
          '@type': 'Offer',
          price: course.price,
          priceCurrency: 'EUR',
          category: course.tier || 'IMAT Preparation',
        },
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {courseJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />
      )}
      <CourseDetailContent params={Promise.resolve({ slug })} />
    </>
  );
}
