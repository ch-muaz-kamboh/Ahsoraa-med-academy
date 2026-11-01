import { Metadata } from 'next';
import AboutContent from './AboutContent';
import { SITE_URL, getBreadcrumbJsonLd, getFaqJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'About Ahsora Med Academy | Italian Medical Admissions Mentorship',
  description:
    'Learn about Ahsora Med Academy, founded by a final-year medical student at the University of Messina, Italy. Transparent, student-first IMAT coaching and Italian university guidance.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'About Ahsora Med Academy | Italian Medical Admissions Mentorship',
    description:
      'Founded by a final-year medical student at University of Messina. Discover our teaching method, expert faculty, and mission to democratize medical education in Italy.',
    url: `${SITE_URL}/about`,
    type: 'website',
  },
};

export default function AboutPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
  ]);

  const aboutFaqs = [
    {
      q: 'Who founded Ahsora Med Academy?',
      a: 'Ahsora Med Academy was founded by a final-year Medicine and Surgery student currently studying at the University of Messina, Italy — one of the public medical universities that admits students through the IMAT.',
    },
    {
      q: 'Why was Ahsora created?',
      a: 'Ahsora was created because the founder experienced firsthand the lack of structured, honest guidance during their own IMAT preparation journey. The academy exists to give the next student a clearer, more supported path.',
    },
    {
      q: 'What is the founder’s background?',
      a: 'The founder is a final-year Medicine and Surgery student at the University of Messina, Italy with direct, current experience of the IMAT exam, Italian university admissions, and life as an international medical student in Italy.',
    },
    {
      q: 'Is Ahsora accredited or affiliated with a university?',
      a: 'Ahsora Med Academy is an independent educational academy. It is not formally affiliated with or accredited by a university. It is founded and operated by someone currently studying medicine at an Italian public university.',
    },
    {
      q: 'Who teaches Ahsora programmes?',
      a: 'Ahsora programmes are taught by qualified instructors with subject expertise relevant to the IMAT syllabus. The founder’s academic experience shapes the method; live teaching is delivered by the faculty team.',
    },
    {
      q: 'Does Ahsora guarantee admission, scholarships or visas?',
      a: 'No. Ahsora provides preparation, structured guidance and application support. Admission, scholarship and visa decisions are made by universities and relevant government authorities — never by Ahsora.',
    },
  ];

  const faqJsonLd = getFaqJsonLd(aboutFaqs);

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Ahsora Med Academy',
    url: `${SITE_URL}/about`,
    description:
      'About Ahsora Med Academy: our origins, founder story, faculty standards, and educational philosophy for Italian medical school admissions.',
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: 'Ahsora Med Academy',
      url: SITE_URL,
      founder: {
        '@type': 'Person',
        name: 'Dr. Ahsan Jahangir',
        jobTitle: 'Founder',
        alumniOf: 'University of Messina',
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AboutContent />
    </>
  );
}
