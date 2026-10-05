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
    id: 'ascend',
    name: 'Ahsora IMAT Ascend',
    price: '€299',
    numericPrice: 299,
    period: 'one-time',
    popular: true,
    badge: 'MOST POPULAR',
    description: 'Essential prep package with video series & full-length timed mock tests',
    features: [
      'Access to IMAT Question Bank (2,500+ Qs)',
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
  if (!input) return ACADEMY_PACKAGES[0]; // default Ascend
  const lower = input.toLowerCase();
  const match = ACADEMY_PACKAGES.find(
    (p) => p.id.toLowerCase() === lower || p.name.toLowerCase() === lower || p.name.toLowerCase().includes(lower)
  );
  return match || ACADEMY_PACKAGES[0];
}

export type StudentTier = 'ascend' | 'mastery' | 'elite';

export function getStudentTier(pkg?: string | null): StudentTier {
  if (!pkg) return 'ascend';
  const id = getPackageByIdOrName(pkg).id;
  if (id === 'elite') return 'elite';
  if (id === 'mastery') return 'mastery';
  return 'ascend';
}

/**
 * Schedule option is locked for ONLY Ascend students.
 * (Mastery & Elite students have full access).
 */
export function isScheduleLocked(pkg?: string | null): boolean {
  return getStudentTier(pkg) === 'ascend';
}

export function canAccessSchedule(pkg?: string | null): boolean {
  return !isScheduleLocked(pkg);
}

/**
 * MedPath Elite is locked for Ascend and Mastery students.
 * (Only Elite students have access).
 */
export function isMedpathLocked(pkg?: string | null): boolean {
  return getStudentTier(pkg) !== 'elite';
}

export function canAccessMedpath(pkg?: string | null): boolean {
  return !isMedpathLocked(pkg);
}

/**
 * Document Vault menu is locked for Ascend and Mastery students.
 * (Only Elite students have access).
 */
export function isDocumentVaultLocked(pkg?: string | null): boolean {
  return getStudentTier(pkg) !== 'elite';
}

export function canAccessDocumentVault(pkg?: string | null): boolean {
  return !isDocumentVaultLocked(pkg);
}

/**
 * Resolves the student's active package with fallback to client storage.
 */
export function resolveEffectivePackage(currentUser?: { email?: string; selectedPackage?: string } | null): string {
  if (currentUser?.selectedPackage) {
    return currentUser.selectedPackage;
  }
  if (typeof window !== 'undefined') {
    try {
      const savedUser = localStorage.getItem('ahsora_currentUser');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.selectedPackage) {
          return parsed.selectedPackage;
        }
      }
    } catch {}

    try {
      const reg = localStorage.getItem('recentRegistration');
      if (reg) {
        const parsed = JSON.parse(reg);
        if (parsed.selectedPackage || parsed.selected_package) {
          return parsed.selectedPackage || parsed.selected_package;
        }
      }
    } catch {}

    try {
      const adminList = localStorage.getItem('adminStudentList');
      if (adminList && currentUser?.email) {
        const list = JSON.parse(adminList);
        const found = list.find((s: any) => s.email && s.email.toLowerCase() === currentUser.email?.toLowerCase());
        if (found && (found.selectedPackage || found.selected_package)) {
          return found.selectedPackage || found.selected_package;
        }
      }
    } catch {}
  }
  return 'Ahsora IMAT Ascend';
}

