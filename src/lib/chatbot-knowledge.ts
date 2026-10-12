/**
 * Ground-truth Knowledge Base for Ahsora Med Academy AI Customer Support Chatbot.
 * Source of truth for package pricing, included features, official IMAT details, admissions, and scholarships.
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
      '10 Full-Length Timed CBT Mock Exams with real exam simulator',
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
      'Direct Real-time Faculty Schedule Access in student portal',
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
5. Italian universities, tuition fees, and regional DSU scholarships.
6. Contacting the human admissions team.

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
- The IMAT (International Medical Admissions Test) is organized by the Italian Ministry of University and Research (MUR) for entry into 100% English-taught public medical schools in Italy.
- Format: 60 multiple-choice questions, 100 minutes. Correct: +1.5, Wrong: -0.4, Blank: 0. Max 90 points.
- Subjects: Biology (23 Qs), Chemistry (15 Qs), Physics & Maths (13 Qs), Logical Reasoning (5 Qs), Reading Skills & General Knowledge (4 Qs).
- Eligibility: Minimum 12 years of formal schooling qualifying for university in home country. No minimum high school GPA required.
- Language: 100% in English. No Italian language test required for admission.
- EU vs Non-EU: Non-EU students choose ONE 1st-choice university; EU students participate in national ranking with scorrimenti.
- Test Centres: Authorized university centres in Italy and worldwide (London, New York, Islamabad, Dubai, Riyadh, Ankara, New Delhi, etc.).
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

FOUNDER & ACADEMY BACKGROUND:
- Founder & Academic Director: **Ahsan Jahangir**.
- Background: Final-year Medicine and Surgery student at the **University of Messina, Italy**.
- Why Ahsora was created: Having navigated the IMAT exam and Italian university admissions firsthand without clear mentorship, Ahsan created Ahsora to give future doctors a transparent, structured system.
- Founder access: Ahsora is founder-led. Ahsora IMAT Mastery includes scheduled group guidance sessions with the founder, and Ahsora Path Elite includes defined direct 1-on-1 advisory access.

STYLE & TONE:
- Professional, supportive, empathetic, and succinct.
- Use bullet points and clear markdown formatting.
- Include clickable markdown links to website pages (e.g. [Register](/register), [Contact](/contact), [Universities Directory](/universities)) and official government sources.
`;

/**
 * Intelligent instant knowledge retrieval engine.
 * Ensures that prospective students ALWAYS receive rich, accurate, fully grounded answers
 * even if external AI APIs have network blips, region restrictions, or quota limits.
 */
export function getInstantKnowledgeReply(userQuery: string): string {
  const q = userQuery.toLowerCase().trim();

  // Founder & Story
  if (
    q.includes('founder') ||
    q.includes('who founded') ||
    q.includes('who founds') ||
    q.includes('who started') ||
    q.includes('ahsan') ||
    q.includes('jahangir') ||
    q.includes('story') ||
    q.includes('about ahsora') ||
    q.includes('who is the owner') ||
    q.includes('creator')
  ) {
    return `### About Ahsora Med Academy & Founder

**Ahsora Med Academy** was founded by **Ahsan Jahangir**, a final-year Medicine and Surgery student at the **University of Messina, Italy**.

* **Why Ahsora Was Created:**
  Having experienced the lack of honest, structured guidance during his own IMAT preparation and international student relocation, Ahsan created Ahsora to provide prospective medical students with a proven system—combining rigorous testing, expert instruction, and lived experience.

* **Founder Involvement by Programme:**
  * **Ahsora IMAT Mastery:** Includes scheduled founder group guidance and strategy sessions.
  * **Ahsora Path Elite:** Includes defined direct 1-on-1 advisory access with the founder alongside senior student mentorship, pre-enrollment, and visa support.

Read more about our mission on the [About Page](/about) or connect with our admissions team on WhatsApp at **+39 333 3444 479**!`;
  }

  // 1. Packages & Pricing
  if (
    q.includes('package') ||
    q.includes('price') ||
    q.includes('pricing') ||
    q.includes('cost') ||
    q.includes('fee') ||
    q.includes('how much') ||
    q.includes('offer') ||
    q.includes('tier') ||
    q.includes('ascend') ||
    q.includes('mastery') ||
    q.includes('elite')
  ) {
    return `At **Ahsora Med Academy**, we provide three structured preparation packages tailored for different study needs and admissions journeys:

---

### 1. **Ahsora IMAT Ascend** – €299 *(One-Time Payment)*
*Best for self-paced, foundational preparation.*
* **2,500+ Question Bank** with detailed step-by-step explanations
* **120+ Hours** Core IMAT Video Lecture Series
* **10 Full-Length Timed CBT Mock Exams** (realistic computer-based interface)
* **Mistakes Notebook Tracker** & Digital Study Library
* **Weekly Group Live Q&A Sessions**

---

### 2. **Ahsora IMAT Mastery** – €499 *(One-Time Payment)*
*Recommended for ambitious students targeting top-ranked universities.*
* **Everything in IMAT Ascend**
* **3x Weekly Live Interactive Masterclasses** with top faculty
* **Direct Real-Time Faculty Schedule Access** in the student portal
* **Priority 1-on-1 Doubt Resolution** on WhatsApp
* **Personalized Weak-Area Focus Plan**
* **Full Past Paper Breakdown (2011 – 2025)**

---

### 3. **Ahsora Path Elite** – €799 *(One-Time Payment)*
*All-inclusive: IMAT mastery + end-to-end relocation, visa & university support.*
* **Everything in IMAT Mastery**
* **Dedicated Senior Medical Student Mentor** studying in Italy
* **Complete Italian University Pre-Enrollment & DOV (Declaration of Value) Guidance**
* **Full Student Visa Document Preparation & Review**
* **Document Vault Access** for university submissions
* **Guaranteed Admission & Housing Support** in Italy

👉 Ready to get started? You can enroll directly at [Register Now](/register) or review our [Courses Page](/courses).`;
  }

  // 2. Exam Date & Registration Deadlines
  if (
    q.includes('exam date') ||
    q.includes('when is') ||
    q.includes('next imat') ||
    q.includes('registration open') ||
    q.includes('deadline') ||
    q.includes('timeline') ||
    q.includes('when do') ||
    q.includes('announcement') ||
    q.includes('decree')
  ) {
    return `### Official IMAT Exam Schedule & Registration Timelines

The IMAT (International Medical Admissions Test) is officially organized once per year by the Italian Ministry of University and Research (**MUR**):

* **Official Date Announcement:** The exact test date is established each year by official ministerial decree (*Decreto Ministeriale*), traditionally published between **late spring and early summer (May–June)**.
* **Exam Administration:** Historically, the IMAT exam is conducted worldwide in **mid-September** at accredited international test centers and universities.
* **Registration Window:** Official candidate registration takes place exclusively through the [Universitaly Portal](https://www.universitaly.it/). The registration window typically opens in **July** for approximately 2 to 3 weeks.
* **Results & Rankings:** Anonymous test scores are released in late September, followed by official national ranking lists (*graduatoria nazionale*) in early October.

**Official Ministerial Portals to Monitor:**
* [Universitaly.it](https://www.universitaly.it/)
* [Accesso Programmato MUR](https://accessoprogrammato.mur.gov.it/)
* [MUR Ministry Official](https://www.mur.gov.it/)

💡 *Because registration windows are short and competition is high, early preparation is critical. Start your preparation today at [Register Now](/register).*`;
  }

  // 3. How to Enrol / Register / Payment
  if (
    q.includes('enrol') ||
    q.includes('enroll') ||
    q.includes('register') ||
    q.includes('sign up') ||
    q.includes('payment') ||
    q.includes('how to buy') ||
    q.includes('join') ||
    q.includes('admission')
  ) {
    return `### How to Enrol in Ahsora Med Academy

Enrolling is simple, secure, and takes less than 2 minutes:

1. **Submit Registration:** Visit [Register Now](/register).
2. **Fill in Details:** Enter your name, email, WhatsApp phone number, and select your target package (**Ascend €299**, **Mastery €499**, or **Path Elite €799**).
3. **Complete Payment:** Our admissions desk accepts secure bank transfers and card payments. You will receive immediate payment confirmation and account activation.
4. **Access the Portal:** Log in at [Login](/login) to access your video lectures, question bank, live class schedules, and CBT mock exam simulator!

Need help with registration? Reach out to our admissions team directly on WhatsApp at **+39 333 3444 479** or email [admissions@ahsorameds.com](mailto:admissions@ahsorameds.com).`;
  }

  // 4. Exam Format, Scoring & Syllabus
  if (
    q.includes('format') ||
    q.includes('score') ||
    q.includes('scoring') ||
    q.includes('syllabus') ||
    q.includes('negative') ||
    q.includes('marking') ||
    q.includes('how many questions') ||
    q.includes('biology') ||
    q.includes('chemistry') ||
    q.includes('math') ||
    q.includes('physics')
  ) {
    return `### Official IMAT Test Structure, Syllabus & Scoring

The IMAT (International Medical Admissions Test) is a 100-minute, paper-based exam conducted entirely in English:

* **Total Questions:** 60 Multiple-Choice Questions (5 options each)
* **Duration:** 100 Minutes (single test session)
* **Maximum Score:** 90 Points

**Official MUR Scoring Scheme:**
* **+1.5 points** for each correct answer
* **-0.4 points** penalty for each incorrect answer (negative marking)
* **0 points** for unanswered questions

**Detailed Subject Breakdown:**
1. **Biology (23 Questions · ~38.3% of exam):**
   * Cellular biology, organelles, membrane transport, and enzymes.
   * Bioenergetics: cellular respiration, photosynthesis, ATP cycle.
   * Genetics & Evolution: Mendelian inheritance, DNA replication, transcription, translation, and mutations.
   * Human Anatomy & Physiology: organ systems, nervous, endocrine, circulatory, digestive, respiratory, and urinary systems.
2. **Chemistry (15 Questions · 25.0% of exam):**
   * Atomic structure, electronic configurations, and periodic trends.
   * Chemical bonding: ionic, covalent, metallic, intermolecular forces.
   * Stoichiometry, gas laws, solutions, molarity, and solubility.
   * Chemical equilibria, acids & bases, pH calculations, and redox reactions.
   * Organic chemistry fundamentals: hydrocarbons, functional groups, and biomolecules.
3. **Physics & Mathematics (13 Questions · ~21.7% of exam):**
   * Physics: kinematics, Newton's laws of dynamics, work, energy, thermodynamics, electrostatics, basic DC circuits, optics.
   * Mathematics: algebra, functions, quadratic equations, analytic geometry, trigonometry, probability & basic statistics.
4. **Logical Reasoning & Problem Solving (5 Questions · ~8.3% of exam):**
   * Critical thinking, argument analysis, and numerical problem solving.
5. **Reading Skills & General Knowledge (4 Questions · ~6.7% of exam):**
   * Text comprehension and cultural, scientific, or historical literacy.

Prepare with all 10 timed CBT mock simulations and our 2,500+ question bank on [Ahsora IMAT Packages](/register) or try our [Free Mock](/free-mock).`;
  }

  // 4b. IMAT Test Centres Worldwide
  if (
    q.includes('test centre') ||
    q.includes('test center') ||
    q.includes('centres') ||
    q.includes('centers') ||
    q.includes('where to sit') ||
    q.includes('where can i take') ||
    q.includes('where is the test held') ||
    q.includes('pakistan test') ||
    q.includes('exam location')
  ) {
    return `### Official IMAT Test Centres Worldwide

The IMAT is sat **simultaneously worldwide on the same day in September**. When registering on Universitaly, candidates choose an authorized test centre:

* **🇮🇹 Italy (University Campuses):**
  * Rome (La Sapienza & Tor Vergata), Milan (Statale & Bicocca), Pavia, Bologna, Padua, Turin, Naples (Vanvitelli & Federico II), Pisa, Bari, Catania, Messina, Genoa, etc.
* **🌍 Europe (Embassies & Cultural Institutes):**
  * London (United Kingdom), Paris (France), Berlin (Germany), Madrid (Spain), Athens (Greece), Warsaw (Poland), Vienna (Austria), Brussels (Belgium).
* **🌏 Asia & Middle East:**
  * Islamabad (Pakistan), Dubai (UAE), Riyadh (Saudi Arabia), Ankara/Istanbul (Turkey), Cairo (Egypt), Beirut (Lebanon), Tehran (Iran), New Delhi (India).
* **🌎 Americas & Africa:**
  * New York (USA), Toronto (Canada), Buenos Aires (Argentina), Lagos (Nigeria), Nairobi (Kenya), Addis Ababa (Ethiopia).

⚠️ *Test centre availability is confirmed annually by MUR during July registration on [Universitaly.it](https://www.universitaly.it/). Italian residents must sit at their chosen university; candidates abroad sit at designated local centres.*`;
  }

  // 4c. IMAT Eligibility, High School Requirements & Language
  if (
    q.includes('eligibility') ||
    q.includes('requirement') ||
    q.includes('requirements') ||
    q.includes('who can apply') ||
    q.includes('high school') ||
    q.includes('12 years') ||
    q.includes('gpa') ||
    q.includes('a level') ||
    q.includes('ib diploma') ||
    q.includes('english requirement') ||
    q.includes('italian language') ||
    q.includes('do i need italian') ||
    q.includes('ielts')
  ) {
    return `### IMAT Eligibility, High School & Language Requirements

To be eligible for admission to public medical schools in Italy through the IMAT:

1. **12 Years of Formal Schooling:**
   * You must hold a high school diploma (e.g. A-Levels, IB, High School Diploma, FSc/HSSC, CBSE) obtained after a minimum of **12 years of education**.
   * If your country has an 11-year school system, you must have completed either 1 year of university studies or an accredited foundation year.
2. **High School GPA Cutoff:**
   * **There is NO minimum high school GPA required by MUR** to sit the IMAT or qualify for admission! Admission to public medical schools is determined strictly by your **IMAT exam score**.
   * You only need a legally valid diploma that qualifies you for university admission in your home country.
3. **Language Requirements:**
   * The IMAT exam and all 6 years of the Medicine & Surgery degree are **taught 100% in English**.
   * **You do NOT need Italian language proficiency** to sit the exam or gain admission! (Universities provide Italian classes in years 1–2 so students can communicate with patients during hospital clinical rotations starting in year 3).
   * Most universities accept proof of secondary schooling in English or standard English tests (IELTS 6.0–6.5 / TOEFL).
4. **Legal Document Verification:**
   * Non-EU candidates require a **Declaration of Value (DOV)** from the Italian Embassy or a **CIMEA Statement of Comparability**. Our **Ahsora Path Elite** package guides you through this step-by-step!

Explore more details on our [Admissions Hub](/universities) or [Register with Ahsora](/register).`;
  }

  // 4d. EU vs Non-EU Rules & First-Choice University Policy
  if (
    q.includes('non-eu') ||
    q.includes('non eu') ||
    q.includes('eu candidate') ||
    q.includes('first choice') ||
    q.includes('1st choice') ||
    q.includes('scorrimenti') ||
    q.includes('quotas') ||
    q.includes('seat quota')
  ) {
    return `### EU vs Non-EU Rules & The 1st-Choice Policy

Italian medical admissions have distinct rules based on citizenship:

* **Non-EU Candidates (Residing Abroad):**
  * You compete exclusively within the **designated Non-EU seat quota** set by each university.
  * **The 1st-Choice Rule:** Non-EU applicants must select **ONE single 1st-choice university** on Universitaly. Your IMAT score only competes against other Non-EU applicants applying to that same university. You cannot slide to a 2nd choice university!
* **EU Candidates (and Non-EU Residing in Italy):**
  * You list all preferred universities in ranked order on Universitaly.
  * You compete on a **Single National Ranking List** (*graduatoria unica nazionale*). If you do not obtain your top choice initially, you can enter the weekly sliding reallocation list (*scorrimenti*) as seats open up.
  * Minimum score to enter EU national ranking: **20 points**.

Our admissions team provides personalized advice on selecting the safest, highest-probability university based on past cutoffs in our [Ahsora MedPath Elite](/register) mentorship!`;
  }

  // 4e. Cutoffs & Safe Scores
  if (
    q.includes('cutoff') ||
    q.includes('cut off') ||
    q.includes('safe score') ||
    q.includes('what score do i need') ||
    q.includes('passing mark') ||
    q.includes('how many marks')
  ) {
    return `### IMAT Cutoffs & Safe Score Targets

* **Minimum Formal Threshold:**
  * EU candidates require a minimum of **20 points** to enter the national ranking.
  * Non-EU candidates have no formal 20-point minimum, but admission depends on ranking high enough for the university's quota.
* **Historical Competitive Ranges:**
  * **Top-Tier Universities (Milan, Bologna, Pavia, Sapienza):** Typically require **50.0 to 65.0+ points**.
  * **Mid-Tier & Southern Universities (Turin, Padua, Vanvitelli, Messina, Catania, Bari):** Typically range from **38.0 to 52.0 points** depending on EU vs Non-EU quota.
  * *Ahsora's highest recorded student score in IMAT 2025 was **84.7 / 90 points**!*

View the complete historical cutoffs for all 16+ Italian medical faculties on our [Universities Directory](/universities).`;
  }

  // 4f. What is IMAT / Overview
  if (
    q.includes('what is imat') ||
    q.includes('about imat') ||
    q.includes('tell me about imat') ||
    q.includes('how to prepare for imat') ||
    q.includes('study plan')
  ) {
    return `### What is the IMAT (International Medical Admissions Test)?

The **IMAT** is the official national entrance exam used by Italian public universities to admit students into their prestigious, 100% English-taught **6-Year Medicine and Surgery (MD, LM-41)** degrees:

* **Official Governing Body:** Italian Ministry of University and Research (**MUR**).
* **Format:** 60 Multiple-Choice Questions sat in 100 minutes.
* **Language:** 100% English.
* **Universities:** 16+ Italian public universities (Milan, Bologna, Pavia, Sapienza Rome, Padua, Turin, Messina, Catania, etc.).
* **Tuition:** Exceptionally affordable (€156 to €4,000/year based on family income) with regional **DSU scholarships up to €8,500/year**.
* **Global Recognition:** Medical degrees awarded by Italian public medical schools are recognized across the **EU, UK (GMC), USA (USMLE/ECFMG), Canada, and worldwide**.

Ready to prepare? Check out [Ahsora IMAT Preparation Courses](/courses) or get started at [Register Now](/register)!`;
  }

  // 5. Universities & Medical Schools in Italy
  if (
    q.includes('university') ||
    q.includes('universities') ||
    q.includes('medical school') ||
    q.includes('milan') ||
    q.includes('bologna') ||
    q.includes('rome') ||
    q.includes('pavia') ||
    q.includes('padua') ||
    q.includes('cattolica') ||
    q.includes('humanitas') ||
    q.includes('san raffaele')
  ) {
    return `### English-Taught Medical Universities in Italy

Italy hosts top-tier English-language Medicine & Surgery (MD, LM-41) programmes:

**Top Public Universities (IMAT Route):**
* **University of Milan (La Statale):** 55 EU / 25 Non-EU seats
* **University of Bologna:** 97 EU / 20 Non-EU seats
* **Sapienza University of Rome:** 45 EU / 13 Non-EU seats
* **University of Pavia:** 103 EU / 35 Non-EU seats
* **University of Padua (Venice campus):** 76 EU / 25 Non-EU seats
* **University of Turin:** 70 EU / 30 Non-EU seats
* **Rome Tor Vergata:** 40 EU / 15 Non-EU seats
* **Luigi Vanvitelli & Federico II (Naples/Caserta):** High seat quotas
* **New for 2026/27:** Università degli Studi di Firenze (Florence) & Padua MedTech!

**Private Universities (Own Entrance Tests):**
* **Cattolica (Rome)**, **San Raffaele (Milan)**, **Humanitas (Milan)**, **UniCamillus (Rome)**.

Explore complete cutoff history, fees, and campus guides on our [Universities Directory](/universities).`;
  }

  // 6. Scholarships & Tuition Fees
  if (
    q.includes('scholarship') ||
    q.includes('tuition') ||
    q.includes('dsu') ||
    q.includes('ergo') ||
    q.includes('financial aid') ||
    q.includes('free') ||
    q.includes('isee') ||
    q.includes('cost of living')
  ) {
    return `### Italian University Tuition & Regional Scholarships (DSU)

Studying medicine in Italy is one of the most affordable pathways worldwide:

* **Public University Tuition:** Between **€156 and €4,000/year**, calculated strictly according to family income via the **ISEE Parificato** declaration.
* **Regional Government Scholarships (DSU, ER.GO, Disco Lazio, EDiSU):**
  * Awarded based on family financial need (ISEE threshold usually under €26,000–€27,000/year).
  * **Benefits:** 100% tuition waiver + free university canteen meals + cash living stipend of up to **€7,200 to €8,500/year**!
  * **Application Windows:** Open between June and July with deadlines in August/September.

Read our complete breakdown on the [Scholarships Hub](/universities/scholarships). Our **Ahsora Path Elite** package also includes full mentor guidance for scholarship paperwork!`;
  }

  // 7. Contact & Support Channels
  if (
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('whatsapp') ||
    q.includes('email') ||
    q.includes('office') ||
    q.includes('help') ||
    q.includes('speak') ||
    q.includes('human')
  ) {
    return `### Contact Ahsora Med Academy

Our admissions team is available to assist you with enrollment, package choices, and Italian visa questions:

* **WhatsApp & Phone:** **+39 333 3444 479**
* **Email:** [admissions@ahsorameds.com](mailto:admissions@ahsorameds.com)
* **Hours:** Monday – Friday, 9:00 AM – 6:00 PM (Central European Time)
* **Offices:**
  * **Italy:** Via Roma, 98124 Messina, Italy
  * **Pakistan:** S19 Panoramic Complex, Mall Road, Lahore, Pakistan
* **Dedicated Contact Page:** [Contact Us](/contact)
* **Social Channels:** [YouTube Channel](https://youtube.com/@ahsoramedsacademy) · [Instagram](https://www.instagram.com/ahsorameds.imat)`;
  }

  // 8. General Comprehensive Fallback
  return `### Welcome to Ahsora Med Academy!

We are the premier preparation and guidance platform for students aspiring to study Medicine & Surgery in Italy in English:

* **Our Preparation Packages:**
  * **Ahsora IMAT Ascend (€299):** 2,500+ Q-bank, 120+ hrs video lectures, 10 CBT mock exams.
  * **Ahsora IMAT Mastery (€499):** Live masterclasses 3x weekly, WhatsApp doubt clearing, past papers (2011–2025).
  * **Ahsora Path Elite (€799):** Complete mentorship, pre-enrollment, DOV & Italian student visa guidance.
* **How to Enrol:** Register in 2 minutes at [Register Now](/register).
* **Official IMAT Schedule:** The exam is held annually in mid-September by MUR, with registration on [Universitaly](https://www.universitaly.it/) in July.
* **Directory & Guides:** Browse the [Universities Directory](/universities) and [Scholarships Hub](/universities/scholarships).

Need direct support? Message our team on WhatsApp at **+39 333 3444 479** or email [admissions@ahsorameds.com](mailto:admissions@ahsorameds.com).`;
}
