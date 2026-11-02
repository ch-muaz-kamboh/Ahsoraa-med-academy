/**
 * SEO & Structured Data (JSON-LD) Core Constants and Helpers
 * Ahsora Med Academy
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahsorameds.com';
export const SITE_NAME = 'Ahsora Med Academy';
export const SITE_TAGLINE = 'Study Medicine in Italy in English | Premier IMAT Preparation & Admissions Platform';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/icon.png`;

export const OFFICIAL_SOCIAL_LINKS = [
  'https://www.instagram.com/imat.ahsorameds',
  'https://www.facebook.com/share/1G62YBEV2U/',
  'https://www.facebook.com/share/g/1CTfwgZzpN/',
  'https://www.youtube.com/@AhsoraMedsAcademy',
  'https://wa.me/393333444479',
];

/**
 * Global EducationalOrganization Schema
 * Strongly grounds E-E-A-T for Google and AI Answer Engines (ChatGPT, Perplexity, Gemini)
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Ahsora Med Academy',
    alternateName: ['Ahsora', 'Ahsora Meds', 'Ahsora Academy'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/ahsora-logo.png`,
      caption: 'Ahsora Med Academy Official Logo',
    },
    image: `${SITE_URL}/ahsora-emblem.png`,
    description:
      'Premier European medical admissions academy specialized in English-taught Medicine and Surgery (LM41) in Italy, IMAT preparation courses, 100-minute CBT mock exams, and DSU scholarship mentorship.',
    email: 'ahsoramedsacademy@gmail.com',
    telephone: '+39 327 891 2345',
    sameAs: OFFICIAL_SOCIAL_LINKS,
    founder: {
      '@type': 'Person',
      name: 'Dr. Ahsan Jahangir',
      jobTitle: 'Founder & Academic Director',
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'University of Messina (Università degli Studi di Messina)',
        location: 'Messina, Sicily, Italy',
      },
      description:
        'Final-year Medicine & Surgery student at University of Messina and founder of Ahsora Med Academy.',
    },
    areaServed: [
      { '@type': 'Country', name: 'Italy' },
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'Pakistan' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Turkey' },
      { '@type': 'Country', name: 'Iran' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    knowsAbout: [
      'IMAT (International Medical Admissions Test)',
      'Italian Public Medical Universities (LM41)',
      'Universitaly Pre-Enrolment & MUR Decree',
      'DSU Regional Scholarships (EDISU, ER.GO, DiSCo, ALiSEO)',
      'Italy National Student Visa Type D',
      'CIMEA and Declaration of Value (DOV)',
    ],
  };
}

/**
 * Global WebSite Schema with Sitelinks Searchbox
 */
export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Ahsora Med Academy',
    description:
      'The #1 IMAT preparation platform and Italian medical school admissions mentorship ecosystem.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/medical-universities-italy?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * BreadcrumbList Schema generator
 */
export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
    })),
  };
}

/**
 * FAQPage Schema generator for rich snippet FAQ search results
 */
export function getFaqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}
