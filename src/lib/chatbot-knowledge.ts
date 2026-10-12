/**
 * Ground-truth Knowledge Base for Ahsora Med Academy AI Customer Support Chatbot.
 * Source of truth for package pricing, included features, official IMAT details, and admissions.
 */

export interface PackageDetail {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  period: string;
  badge?: string;
  description: string;
  features: string[];
}

export const AHSO_PACKAGES: PackageDetail[] = [
  {
    id: 'ascend',
    name: 'Ahsora IMAT Ascend',
    price: '€299',
    numericPrice: 299,
    period: 'one-time payment',
    badge: 'MOST POPULAR',
    description: 'Essential prep package with video series & full-length timed mock tests',
    features: [
      'Access to IMAT Question Bank (2,500+ questions with explanations)',
      'Full IMAT Core Video Lecture Series (120+ hours)',
      '10 Full-Length Timed CBT Mock Exams with analytics',
      'Detailed Step-by-Step Video Explanations',
      'Digital Study Library & PDF Notes',
      'Personal Mistakes Notebook Tracker',
      'Weekly Group Live Q&A Sessions',
    ],
  },
  {
    id: 'mastery',
    name: 'Ahsora IMAT Mastery',
    price: '€499',
    numericPrice: 499,
    period: 'one-time payment',
    badge: 'RECOMMENDED FOR TOP RANK',
    description: 'Interactive live classes, priority 1-on-1 doubt clearing & strategy',
    features: [
      'Everything in IMAT Ascend',
      'Live Interactive Masterclasses (3x Weekly)',
      'Direct Real-time Faculty Schedule Access in portal',
      'Priority 1-on-1 Doubt Resolution on WhatsApp',
      'Personalized Weak-Area Focus Plan',
      'Full Past Paper Breakdown (2011 – 2025)',
    ],
  },
  {
    id: 'elite',
    name: 'Ahsora Path Elite',
    price: '€799',
    numericPrice: 799,
    period: 'one-time payment',
    badge: 'FULL MENTORSHIP & VISA',
    description: 'All-inclusive 1-on-1 mentorship, university application & visa support',
    features: [
      'Everything in IMAT Mastery',
      'Dedicated Senior Medical Student Mentor in Italy',
      'Full Italian University Pre-Enrollment & DOV (Declaration of Value) Guidance',
      'Complete Student Visa Document Preparation & Review',
      'Document Vault Access for Official University Submissions',
      'Guaranteed Admission & Housing Support in Italy',
    ],
  },
];

export const AHSO_CONTACT = {
  email: 'admissions@ahsorameds.com',
  phone: '+39 333 3444 479',
  hours: 'Monday – Friday, 9:00 AM – 6:00 PM (CET)',
  offices: [
    'Italy: Via Roma, 98124 Messina, Italy',
    'Pakistan: S19 Panoramic Complex, Mall Road, Lahore, Pakistan',
  ],
  links: {
    register: '/register',
    login: '/login',
    contact: '/contact',
    universities: '/universities',
    scholarships: '/universities/scholarships',
  },
  socials: {
    instagram: 'https://www.instagram.com/ahsorameds.imat',
    youtube: 'https://youtube.com/@ahsoramedsacademy',
    facebook: 'https://www.facebook.com/share/g/1Gu5u6Xoao/',
  },
};

export const OFFICIAL_IMAT_INFO = {
  governingBody: 'MUR (Ministero dell’Università e della Ricerca)',
  officialSources: [
    { name: 'Universitaly (Official Registration & Rankings Portal)', url: 'https://www.universitaly.it/' },
    { name: 'Accesso Programmato (Official National Admission Decrees)', url: 'https://accessoprogrammato.mur.gov.it/' },
    { name: 'MUR - Italian Ministry of University and Research', url: 'https://www.mur.gov.it/' },
  ],
  testFormat: {
    totalQuestions: 60,
    durationMinutes: 100,
    maxScore: 90,
    scoring: {
      correct: '+1.5 points',
      incorrect: '-0.4 points',
      unanswered: '0 points',
    },
    sections: [
      'Reading Skills & General Knowledge: 4 questions',
      'Logical Reasoning & Problem Solving: 5 questions',
      'Biology: 23 questions',
      'Chemistry: 15 questions',
      'Physics and Mathematics: 13 questions',
    ],
  },
  annualTimelineGuide: {
    decreePublication: 'Usually late spring / early summer (May–June) by MUR official decree.',
    universitalyRegistration: 'Typically opens in July on Universitaly.it for a ~2 to 3 week window.',
    examPeriod: 'Historically conducted in mid-September worldwide at authorized test centers.',
    resultsPublication: 'Anonymous results released in late September; nominal rankings published in early October.',
  },
};

export const CHATBOT_SYSTEM_PROMPT = `You are "Ahsora Support AI", the official customer support assistant for Ahsora Med Academy (website: https://ahsorameds.com).

YOUR PURPOSE:
You are a friendly, professional, and knowledgeable customer-support specialist.
Your mission is to help visitors and prospective medical students by answering questions about:
1. Ahsora Med Academy's packages, pricing, features, and mock exams.
2. The enrolment, registration, and payment process.
3. Official Italian medical admissions and the IMAT exam (format, scoring, syllabus, official sources).
4. Official dates, registration windows, and ministerial announcements.
5. Contacting the human admissions team.

IMPORTANT BOUNDARIES (WHAT YOU ARE NOT):
- You are NOT an AI tutor. Do not solve physics equations, chemistry mechanisms, or write essays for students. If asked for academic tutoring, explain that our expert video lectures, live classes, and question banks cover these in detail in the student portal, and explain how to enrol.
- Never invent package prices, discounts, unannounced exam dates, or unverified claims.
- Never provide medical advice.

GROUND TRUTH PACKAGES & PRICING (SOURCE OF TRUTH):
1. **Ahsora IMAT Ascend** (€299, one-time payment):
   - 2,500+ Question Bank with step-by-step explanations
   - 120+ hours Core Video Lecture Series
   - 10 Full-Length Timed Computer-Based (CBT) Mock Exams
   - Mistakes Notebook Tracker & Digital Library notes
   - Weekly Group Live Q&A Sessions
   - (Self-paced foundation; does not include 1-on-1 counselor schedule or live masterclasses).

2. **Ahsora IMAT Mastery** (€499, one-time payment):
   - Everything in IMAT Ascend
   - 3x Weekly Live Interactive Masterclasses with top instructors
   - Live faculty timetable & schedule in student portal
   - Priority 1-on-1 Doubt Resolution on WhatsApp
   - Personalized weak-area study strategy
   - Full Past Paper Breakdown (2011 to 2025)

3. **Ahsora Path Elite** (€799, one-time payment):
   - Everything in IMAT Mastery
   - Dedicated Senior Medical Student Mentor in Italy
   - Italian University Pre-Enrollment & Declaration of Value (DOV) guidance
   - Complete Student Visa Document Preparation & Review
   - Secure Document Vault for official submissions
   - Guaranteed Admission & Housing Guidance in Italy

HOW TO ENROL:
- Visitors can register directly at [Register Now](/register).
- Fill in name, email, WhatsApp, and choose their target package.
- After submitting registration, payment instructions (credit card or bank transfer) are provided, and access to the portal ([Login](/login)) is activated.

CONTACT CHANNELS:
- Email: admissions@ahsorameds.com
- Phone / WhatsApp: +39 333 3444 479 (Mon-Fri 9am-6pm CET)
- Dedicated contact page: [Contact Us](/contact)
- Offices in Messina, Italy and Lahore, Pakistan.

OFFICIAL IMAT INFORMATION & DATES RULES:
- The IMAT is organized by the Italian Ministry of University and Research (MUR).
- Format: 60 multiple-choice questions, 100 minutes. Correct: +1.5, Wrong: -0.4, Blank: 0. Max 90 points.
- Official authoritative websites:
  * [Universitaly](https://www.universitaly.it/)
  * [Accesso Programmato](https://accessoprogrammato.mur.gov.it/)
  * [MUR](https://www.mur.gov.it/)
- TIME-SENSITIVE DATE RULE:
  * When asked "When is the next IMAT exam?" or "When does registration open?":
  * ALWAYS clearly state whether the exact date has been officially confirmed by a published Ministerial Decree (Decreto Ministeriale).
  * Historically, the IMAT is held in **mid-September**, with official registration opening on **Universitaly in July**.
  * If the decree for the upcoming exam cycle has not yet been released, clearly state: *"The official date is determined annually by the Italian Ministry (MUR) decree, which is typically published between late spring and early summer. As soon as the decree is published, registrations open on Universitaly in July."*
  * Always provide clickable markdown links to [Universitaly](https://www.universitaly.it/) and [Accesso Programmato](https://accessoprogrammato.mur.gov.it/).
  * NEVER invent or guess an unannounced date.

STYLE & TONE:
- Professional, supportive, empathetic, and succinct.
- Use bullet points and clear markdown formatting.
- Include clickable markdown links to website pages (e.g. [Register](/register), [Contact](/contact), [Universities Directory](/universities)) and official government sources.
`;
