export interface CoursePackage {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  period: string;
  badge?: string;
  popular?: boolean;
  description: string;
  features: string[];
}

export const ACADEMY_PACKAGES: CoursePackage[] = [
  {
    id: 'starter',
    name: 'Ahsora Starter Prep',
    price: '€199',
    numericPrice: 199,
    period: 'one-time',
    description: 'Essential self-study package for early stage medical aspirants',
    features: [
      'Access to IMAT Question Bank (2,500+ Qs)',
      'Basic Performance Analytics & Topic Breakdown',
      'PDF Formula & Biology Revision Sheets',
      'Community Group Access',
    ],
  },
  {
    id: 'ascend',
    name: 'Ahsora IMAT Ascend',
    price: '€299',
    numericPrice: 299,
    period: 'one-time',
    popular: true,
    badge: 'MOST POPULAR',
    description: 'Complete core video series & full-length timed mock tests',
    features: [
      'Everything in Starter Prep',
      'Full IMAT Core Video Lecture Series (120+ Hours)',
      '10 Full-Length Timed CBT Mock Exams',
      'Detailed Step-by-Step Video Explanations',
      'Weekly Group Live Q&A Sessions',
    ],
  },
  {
    id: 'mastery',
    name: 'Ahsora IMAT Mastery',
    price: '€499',
    numericPrice: 499,
    period: 'one-time',
    badge: 'RECOMMENDED FOR TOP RANK',
    description: 'Interactive live classes, priority 1-on-1 doubt clearing & strategy',
    features: [
      'Everything in IMAT Ascend',
      'Live Interactive Masterclasses (3x Weekly)',
      'Priority 1-on-1 Doubt Resolution on WhatsApp',
      'Personalized Weak-Area Focus Plan',
      'Full Past Paper Breakdown (2011 - 2025)',
    ],
  },
  {
    id: 'elite',
    name: 'Ahsora Path Elite',
    price: '€799',
    numericPrice: 799,
    period: 'one-time',
    badge: 'FULL MENTORSHIP & VISA',
    description: 'All-inclusive 1-on-1 mentorship, university application & visa support',
    features: [
      'Everything in IMAT Mastery',
      'Dedicated Senior Medical Student Mentor',
      'Full Italian University Pre-Enrollment & DOV Guidance',
      'Complete Student Visa Document Preparation & Review',
      'Guaranteed Admission & Housing Support in Italy',
    ],
  },
];

export function getPackageByIdOrName(input?: string | null): CoursePackage {
  if (!input) return ACADEMY_PACKAGES[1]; // default Ascend
  const lower = input.toLowerCase();
  const match = ACADEMY_PACKAGES.find(
    (p) => p.id.toLowerCase() === lower || p.name.toLowerCase() === lower || p.name.toLowerCase().includes(lower)
  );
  return match || ACADEMY_PACKAGES[1];
}
