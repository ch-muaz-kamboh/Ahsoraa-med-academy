import { Metadata } from 'next';
import HomeContent from './HomeContent';
import { SITE_URL, getBreadcrumbJsonLd, getFaqJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  title: 'Ahsora Meds Academy | IMAT 2027 Preparation & Italian Admissions',
  description:
    'The premier IMAT preparation platform for students aiming to study Medicine in Italy in English. Access live classes, +1.5/-0.4 scoring mock exams, and full admissions consultancy.',
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: 'Ahsora Meds Academy | IMAT 2027 Preparation & Italian Admissions',
    description:
      'The premier IMAT preparation platform for students aiming to study Medicine in Italy in English. Access live classes, +1.5/-0.4 scoring mock exams, and full admissions consultancy.',
    url: `${SITE_URL}/`,
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Ahsora Meds Academy — Study Medicine in Italy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahsora Meds Academy | IMAT 2027 Preparation & Italian Admissions',
    description:
      'The premier IMAT preparation platform for students aiming to study Medicine in Italy in English. Access live classes, +1.5/-0.4 scoring mock exams, and full admissions consultancy.',
    images: ['/icon.png'],
  },
};

export default function HomePage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
  ]);

  const homeFaqs = [
    {
      q: 'What is the IMAT and why is it required for Italy?',
      a: 'The IMAT (International Medical Admissions Test) is a single, 100-minute entrance exam required by Italian public universities for admission into English-taught Medicine & Surgery (MD, LM41) degrees. It evaluates Biology, Chemistry, Physics & Math, Reading Skills, and Knowledge Acquired in Studies.',
    },
    {
      q: 'How does IMAT scoring and negative marking work?',
      a: 'The IMAT consists of 60 multiple-choice questions scored out of 90 total points. Candidates receive +1.5 points for every correct answer, a penalty of -0.4 points for every incorrect answer, and 0 points for questions left blank.',
    },
    {
      q: 'What IMAT preparation packages does Ahsora Med Academy offer?',
      a: 'Ahsora Med Academy provides three targeted tiers: Ascend (self-paced digital course with 2,800+ question bank and CBT mock tests), Mastery (live classes, syllabus bootcamps, and mentor Q&A), and MedPath Elite (full-cycle admissions consultancy including Universitaly pre-enrolment, DSU scholarships, and visa filing).',
    },
    {
      q: 'Can non-EU international students study medicine in Italy in English?',
      a: 'Yes. Over 17 Italian public universities reserve specific non-EU quotas for international applicants. Tuition fees range from €156 to €4,000 annually based on family income (ISEE-Parificato), and students are eligible for 100% regional DSU scholarships.',
    },
    {
      q: 'Are Italian English medical degrees recognized worldwide (USMLE, PLAB, AMC)?',
      a: 'Yes. Italian public university medical degrees (Laurea Magistrale a Ciclo Unico in Medicina e Chirurgia - LM-41) are EU-accredited, listed in the World Directory of Medical Schools (WDOMS), and fully qualify graduates to sit the USMLE (USA), PLAB/UKMLA (United Kingdom), and AMC (Australia).',
    },
  ];

  const faqJsonLd = getFaqJsonLd(homeFaqs);

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ahsora IMAT Preparation Courses & Study Packages',
    description: 'Comprehensive IMAT preparation programs: Ascend (Self-Paced), Mastery (Live Interactive), and MedPath Elite (Full Mentorship).',
    itemListElement: [
      {
        '@type': 'Course',
        position: 1,
        name: 'IMAT Ascend — Self-Paced Mastery',
        description: 'Complete digital syllabus library, 2,800+ categorized question bank, and 12 CBT mock exams with negative marking.',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Ahsora Med Academy',
          url: SITE_URL,
        },
      },
      {
        '@type': 'Course',
        position: 2,
        name: 'IMAT Mastery — Live Interactive Class Cohort',
        description: 'Live interactive classes across Biology, Chemistry, Physics & Math, recorded video archive, doubt clearance, and analytics.',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Ahsora Med Academy',
          url: SITE_URL,
        },
      },
      {
        '@type': 'Course',
        position: 3,
        name: 'MedPath Elite — Full Exam & Medical Admissions Consultancy',
        description: 'Complete IMAT coaching plus personalized 1-on-1 Italian medical admissions mentorship: Universitaly, CIMEA/DOV, DSU scholarships, and Type D student visa.',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Ahsora Med Academy',
          url: SITE_URL,
        },
      },
    ],
  };

  const knowledgePanelJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Ahsora Meds Academy',
    url: 'https://ahsorameds.com',
    logo: 'https://ahsorameds.com/ahsora-logo.png',
    description: 'IMAT preparation platform and medical admissions consultancy for English-taught medicine in Italy.',
    sameAs: [
      'https://www.instagram.com/imat.ahsorameds',
      'https://www.facebook.com/share/1G62YBEV2U/',
      'https://www.facebook.com/share/g/1CTfwgZzpN/',
      'https://t.me/ahsoramedsacademy',
      'https://whatsapp.com/channel/0029Vb8YFTkKWEKpUsrmy946',
      'https://youtube.com/@ahsoramedsacademy',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+39-333-344-4479',
      contactType: 'Customer Support',
      availableLanguage: ['English', 'Italian'],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(knowledgePanelJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <HomeContent />
    </>
  );
}
