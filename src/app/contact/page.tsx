import { Metadata } from 'next';
import ContactContent from './ContactContent';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'Contact Ahsora Med Academy | Admissions & IMAT Advisory',
  description:
    'Connect with Ahsora Med Academy admissions advisors. 24/7 WhatsApp guidance, email inquiries, and personalized consultation for studying English medicine in Italy.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact Ahsora Med Academy | Admissions & IMAT Advisory',
    description:
      'Have questions about IMAT preparation, cutoffs, scholarships, or visa procedures? Speak directly with our Italian medical admissions advisory team.',
    url: `${SITE_URL}/contact`,
    type: 'website',
  },
};

export default function ContactPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' },
  ]);

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Ahsora Med Academy',
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: 'Ahsora Med Academy',
      url: SITE_URL,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+39 327 891 2345',
          contactType: 'student support',
          email: 'contact@ahsorameds.com',
          availableLanguage: ['English', 'Italian', 'Urdu', 'Hindi'],
          contactOption: 'TollFree',
          areaServed: 'Worldwide',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactContent />
    </>
  );
}
