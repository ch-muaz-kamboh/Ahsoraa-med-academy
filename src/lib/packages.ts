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
    period: 'one-time',
    badge: 'RECOMMENDED FOR TOP RANK',
    description: 'Interactive live classes, priority 1-on-1 doubt clearing & strategy',
    features: [
      'Everything in IMAT Ascend',
      'Live Interactive Masterclasses (3x Weekly)',
      'Direct Real-time Faculty Schedule Access',
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
      'Document Vault for Official University Submissions',
      'Guaranteed Admission & Housing Support in Italy',
    ],
  },
];

export function getPackageByIdOrName(input?: string | null): CoursePackage {
  const base = (() => {
    if (!input) return ACADEMY_PACKAGES[0]; // default Ascend
    const lower = input.toLowerCase().trim();
    const match = ACADEMY_PACKAGES.find(
      (p) => p.id.toLowerCase() === lower || p.name.toLowerCase() === lower || p.name.toLowerCase().includes(lower) || lower.includes(p.id.toLowerCase())
    );
    return match || ACADEMY_PACKAGES[0];
  })();

  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem('ahsora_cms_package_prices');
      if (data) {
        const prices = JSON.parse(data);
        if (Array.isArray(prices)) {
          const dynamic = prices.find((p: any) => p.id === base.id || (p.id === 'ascend' && base.id === 'ascent'));
          if (dynamic && dynamic.price) {
            return {
              ...base,
              price: dynamic.price,
              numericPrice: Number(dynamic.numericPrice) || base.numericPrice,
              badge: dynamic.discountBadge || base.badge,
            };
          }
        }
      }
    } catch {}
  }

  return base;
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
 * Core learning features available for all tiers: Ascend, Mastery, Elite.
 */
export function canAccessLectures(): boolean {
  return true;
}

export function canAccessLibrary(): boolean {
  return true;
}

export function canAccessPracticeBank(): boolean {
  return true;
}

export function canAccessCbtMocks(): boolean {
  return true;
}

/**
 * Saves a student's package mapping in client storage keyed by email.
 */
export function saveStudentPackageMapping(email?: string | null, pkgName?: string, price?: string) {
  if (!email || !pkgName || typeof window === 'undefined') return;
  try {
    const key = 'ahsora_student_packages';
    const existing = localStorage.getItem(key);
    const map = existing ? JSON.parse(existing) : {};
    const normalizedPkg = getPackageByIdOrName(pkgName);
    const cleanEmail = email.toLowerCase().trim();

    map[cleanEmail] = {
      selectedPackage: normalizedPkg.name,
      packagePrice: price || normalizedPkg.price,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(map));

    // Synchronize with ahsora_elite_students:
    // If NOT elite, remove from elite list! If elite, ensure in elite list!
    try {
      const eliteStr = localStorage.getItem('ahsora_elite_students');
      let eliteList = eliteStr ? JSON.parse(eliteStr) : [];
      if (Array.isArray(eliteList)) {
        if (normalizedPkg.id !== 'elite') {
          eliteList = eliteList.filter((s: any) => (s?.email || '').toLowerCase().trim() !== cleanEmail);
          localStorage.setItem('ahsora_elite_students', JSON.stringify(eliteList));
          window.dispatchEvent(new Event('ahsora_elite_updated'));
        } else {
          const already = eliteList.some((s: any) => (s?.email || '').toLowerCase().trim() === cleanEmail);
          if (!already) {
            eliteList.unshift({
              id: `elite-${Date.now()}`,
              studentId: `stu-${Date.now()}`,
              studentName: cleanEmail.split('@')[0],
              email: cleanEmail,
              registeredAt: new Date().toISOString(),
              stages: {
                pre_enrollment: 'pending',
                dov_submission: 'pending',
                university_application: 'pending',
                admission_decision: 'pending',
                visa_process: 'pending',
                housing_arrival: 'pending',
              },
            });
            localStorage.setItem('ahsora_elite_students', JSON.stringify(eliteList));
            window.dispatchEvent(new Event('ahsora_elite_updated'));
          }
        }
      }
    } catch {}
  } catch (e) {
    console.warn('saveStudentPackageMapping error:', e);
  }
}

/**
 * Retrieves a student's package mapping from client storage keyed by email.
 */
export function getStudentPackageMapping(email?: string | null): { selectedPackage: string; packagePrice: string } | null {
  if (!email || typeof window === 'undefined') return null;
  try {
    const key = 'ahsora_student_packages';
    const existing = localStorage.getItem(key);
    if (existing) {
      const map = JSON.parse(existing);
      const cleanEmail = email.toLowerCase().trim();
      const found = map[cleanEmail];
      if (found && found.selectedPackage) {
        return found;
      }
    }
  } catch (e) {
    console.warn('getStudentPackageMapping error:', e);
  }
  return null;
}

/**
 * Resolves the student's active package accurately across all states.
 */
export function resolveEffectivePackage(currentUser?: { email?: string; selectedPackage?: string } | null): string {
  const rawEmail = currentUser?.email;
  const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

  if (typeof window !== 'undefined') {
    // 1. Check persistent package mapping by email (saved upon registration, login, and admin update)
    if (email) {
      const mapped = getStudentPackageMapping(email);
      if (mapped?.selectedPackage) {
        return getPackageByIdOrName(mapped.selectedPackage).name;
      }
    }

    // 2. Check admin student list for this exact email
    try {
      const adminList = localStorage.getItem('adminStudentList');
      if (adminList && email) {
        const list = JSON.parse(adminList);
        if (Array.isArray(list)) {
          const found = list.find((s: any) => s.email && s.email.toLowerCase().trim() === email);
          if (found && (found.selectedPackage || found.selected_package)) {
            return getPackageByIdOrName(found.selectedPackage || found.selected_package).name;
          }
        }
      }
    } catch {}

    // 3. Check recent registration if email matches
    try {
      const reg = localStorage.getItem('recentRegistration');
      if (reg) {
        const parsed = JSON.parse(reg);
        const parsedEmail = (parsed.email || '').toLowerCase().trim();
        if ((!email || parsedEmail === email) && (parsed.selectedPackage || parsed.selected_package)) {
          return getPackageByIdOrName(parsed.selectedPackage || parsed.selected_package).name;
        }
      }
    } catch {}

    // 4. Check saved user in ahsora_currentUser if email matches
    try {
      const savedUser = localStorage.getItem('ahsora_currentUser');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const parsedEmail = (parsed.email || '').toLowerCase().trim();
        if (email && parsedEmail === email && parsed.selectedPackage) {
          return getPackageByIdOrName(parsed.selectedPackage).name;
        }
      }
    } catch {}

    // 5. Check if student email is explicitly in ahsora_elite_students
    if (email) {
      try {
        const eliteStr = localStorage.getItem('ahsora_elite_students');
        if (eliteStr) {
          const eliteList = JSON.parse(eliteStr);
          if (Array.isArray(eliteList)) {
            const isElite = eliteList.some((s: any) => {
              const sEmail = (s?.email || '').toLowerCase().trim();
              return sEmail === email;
            });
            if (isElite) return 'Ahsora Path Elite';
          }
        }
      } catch {}
    }
  }

  // 6. Explicitly passed currentUser selectedPackage
  if (currentUser?.selectedPackage) {
    return getPackageByIdOrName(currentUser.selectedPackage).name;
  }

  return 'Ahsora IMAT Ascend';
}
