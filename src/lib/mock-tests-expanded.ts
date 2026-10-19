import { Test, TestQuestion, TestDifficulty } from '@/types';
import { getImportedQuestions } from '@/lib/imported_questions';

interface MockSpec {
  id: string;
  slug: string;
  title: string;
  category: string;
  subject: string;
  difficulty: TestDifficulty;
  durationMinutes: number;
  passingPercentage: number;
  unlockDate?: string;
  instructions: string;
  startIndex: number;
  count: number;
}

const MOCK_SPECS: MockSpec[] = [
  {
    id: 'tst-03',
    slug: 'imat-grand-mock-03-bio-chem-foundations',
    title: 'IMAT Grand Mock 3 - Biology & Chemistry Core Foundations',
    category: 'IMAT Italy',
    subject: 'Biology & Chemistry',
    difficulty: 'medium',
    durationMinutes: 60,
    passingPercentage: 50,
    unlockDate: '', // Ready immediately
    instructions: 'Timed 60-minute sprint focusing on bioenergetics, water interactions, cellular basis of life, and fundamental chemical equilibria. IMAT scoring (+1.5 correct, -0.4 incorrect, 0 blank).',
    startIndex: 0,
    count: 15,
  },
  {
    id: 'tst-04',
    slug: 'imat-grand-mock-04-biochemistry-metabolism',
    title: 'IMAT Grand Mock 4 - Biochemistry, Enzymes & Molecular Metabolism',
    category: 'IMAT Italy',
    subject: 'Biochemistry & Molecular Biology',
    difficulty: 'hard',
    durationMinutes: 75,
    passingPercentage: 55,
    unlockDate: '', // Ready immediately
    instructions: 'Comprehensive exam covering enzyme kinetics, glycolysis, Krebs cycle, electron transport phosphorylation, and biomolecules. IMAT scoring: +1.5 for correct, -0.4 for wrong.',
    startIndex: 15,
    count: 15,
  },
  {
    id: 'tst-05',
    slug: 'imat-grand-mock-05-cellular-genetics',
    title: 'IMAT Grand Mock 5 - Cellular Biology, DNA Replication & Mendelian Genetics',
    category: 'IMAT Italy',
    subject: 'Genetics & Cell Biology',
    difficulty: 'medium',
    durationMinutes: 60,
    passingPercentage: 50,
    unlockDate: '', // Ready immediately
    instructions: 'High-yield genetics questions including pedigrees, sex-linked traits, transcription, translation, and chromosomal mutations. Scoring: +1.5 / -0.4 / 0.',
    startIndex: 30,
    count: 15,
  },
  {
    id: 'tst-06',
    slug: 'imat-grand-mock-06-human-physiology-organ-systems',
    title: 'IMAT Grand Mock 6 - Human Anatomy, Organ Systems & Physiology',
    category: 'IMAT Italy',
    subject: 'Human Anatomy & Physiology',
    difficulty: 'hard',
    durationMinutes: 80,
    passingPercentage: 55,
    unlockDate: '', // Ready immediately
    instructions: 'Detailed clinical and anatomical scenarios across cardiovascular, renal, endocrine, and neural systems. Scoring: +1.5 for correct, -0.4 for incorrect, 0 for blank.',
    startIndex: 45,
    count: 15,
  },
  {
    id: 'tst-07',
    slug: 'imat-grand-mock-07-organic-chemistry-bonding',
    title: 'IMAT Grand Mock 7 - Chemical Structure, Organic Chemistry & Solutions',
    category: 'IMAT Italy',
    subject: 'General & Organic Chemistry',
    difficulty: 'medium',
    durationMinutes: 60,
    passingPercentage: 50,
    unlockDate: '', // Unlocked for all students
    instructions: 'Comprehensive exam testing stoichiometry, IUPAC nomenclature, reaction mechanisms, and redox balancing. Scoring: +1.5 / -0.4 / 0.',
    startIndex: 60,
    count: 15,
  },
  {
    id: 'tst-08',
    slug: 'imat-grand-mock-08-general-knowledge-reasoning',
    title: 'IMAT Grand Mock 8 - Critical Reasoning, Logic & General Knowledge',
    category: 'IMAT Italy',
    subject: 'Logical Reasoning & Culture',
    difficulty: 'hard',
    durationMinutes: 45,
    passingPercentage: 50,
    unlockDate: '', // Unlocked for all students
    instructions: 'High-yield exam testing syllogisms, argument weaknesses, scientific history, and modern institutions. Scoring: +1.5 / -0.4 / 0.',
    startIndex: 75,
    count: 15,
  },
  {
    id: 'tst-09',
    slug: 'imat-grand-mock-09-physics-math-integrated',
    title: 'IMAT Grand Mock 9 - Physics & Mathematics Problem Solving',
    category: 'IMAT Italy',
    subject: 'Physics & Mathematics',
    difficulty: 'hard',
    durationMinutes: 60,
    passingPercentage: 50,
    unlockDate: '', // Unlocked for all students
    instructions: 'Full problem-solving block: Classical mechanics, electrostatics, optics, algebraic equations, and trigonometry. Scoring: +1.5 / -0.4 / 0.',
    startIndex: 90,
    count: 15,
  },
  {
    id: 'tst-10',
    slug: 'imat-grand-mock-10-italian-med-simulation-1',
    title: 'IMAT Grand Mock 10 - Italian Public Medical School Full Simulation A',
    category: 'IMAT Italy',
    subject: 'Complete All-Syllabus Simulation',
    difficulty: 'hard',
    durationMinutes: 100,
    passingPercentage: 60,
    unlockDate: '', // Unlocked for all students
    instructions: 'Official 100-minute all-section examination modeled on Università degli Studi di Milano & Bologna standards. Scoring: +1.5 / -0.4 / 0.',
    startIndex: 105,
    count: 20,
  },
  {
    id: 'tst-11',
    slug: 'imat-grand-mock-11-italian-med-simulation-2',
    title: 'IMAT Grand Mock 11 - Italian Public Medical School Full Simulation B',
    category: 'IMAT Italy',
    subject: 'Complete All-Syllabus Simulation',
    difficulty: 'hard',
    durationMinutes: 100,
    passingPercentage: 60,
    unlockDate: '', // Unlocked for all students
    instructions: 'Full-length benchmark test targeting top percentile cutoffs for Rome La Sapienza and Pavia. Scoring: +1.5 / -0.4 / 0.',
    startIndex: 125,
    count: 20,
  },
  {
    id: 'tst-12',
    slug: 'imat-grand-mock-12-final-pre-exam-benchmark',
    title: 'IMAT Grand Mock 12 - Final Pre-Exam National Grand Assessment',
    category: 'IMAT Italy',
    subject: 'National Benchmark Assessment',
    difficulty: 'hard',
    durationMinutes: 100,
    passingPercentage: 60,
    unlockDate: '', // Unlocked for all students
    instructions: 'Final dress rehearsal mock before the official admission test. Strict IMAT scoring: +1.5 correct, -0.4 penalty, 0 unanswered.',
    startIndex: 145,
    count: 20,
  },
];

export function buildExpandedMockTests(): Test[] {
  const rawQuestions = getImportedQuestions();

  return MOCK_SPECS.map((spec) => {
    let selectedRaw = rawQuestions.slice(spec.startIndex, spec.startIndex + spec.count);

    // If slice is empty or too short, wrap around or generate fallback
    if (selectedRaw.length === 0) {
      selectedRaw = rawQuestions.slice(0, spec.count);
    }

    const questions: TestQuestion[] = selectedRaw.map((raw: any, idx: number) => {
      const options = [
        { id: 'A', text: String(raw.option_a || 'Option A') },
        { id: 'B', text: String(raw.option_b || 'Option B') },
        { id: 'C', text: String(raw.option_c || 'Option C') },
        { id: 'D', text: String(raw.option_d || 'Option D') },
      ];
      if (raw.option_e) {
        options.push({ id: 'E', text: String(raw.option_e) });
      }

      return {
        id: `${spec.id}-q-${idx + 1}`,
        orderIndex: idx + 1,
        subject: raw.subject || spec.subject,
        topic: raw.topic || raw.chapter || 'Core Syllabus',
        difficulty: (raw.difficulty as TestDifficulty) || spec.difficulty,
        questionText: raw.question_text || `Question ${idx + 1} for ${spec.title}`,
        options,
        correctOption: (raw.correct_option || 'A').toUpperCase(),
        explanation: raw.explanation || 'Detailed mechanism explained in Ahsora Meds syllabus curriculum.',
      };
    });

    const totalMarks = Number((questions.length * 1.5).toFixed(1));
    const passingMarks = Number((totalMarks * (spec.passingPercentage / 100)).toFixed(1));

    return {
      id: spec.id,
      slug: spec.slug,
      title: spec.title,
      category: spec.category,
      subject: spec.subject,
      difficulty: spec.difficulty,
      durationMinutes: spec.durationMinutes,
      totalQuestions: questions.length,
      totalMarks,
      positiveMark: 1.5,
      negativeMark: 0.4,
      passingPercentage: spec.passingPercentage,
      passingMarks,
      unlockDate: spec.unlockDate || undefined,
      instructions: spec.instructions,
      isPublicSample: false,
      questions,
    };
  });
}
