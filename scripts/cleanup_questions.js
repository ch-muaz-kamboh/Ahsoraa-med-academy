/**
 * cleanup_questions.js
 * Reads src/lib/imported_questions.ts, maps existing "topic" field to
 * the correct "chapter" + "topic" based on the 5-topic Biology structure,
 * then writes back a cleaned imported_questions.ts.
 *
 * Run: node scripts/cleanup_questions.js
 */

const fs = require('fs');
const path = require('path');

// ── 1. Biology Topic/Chapter Map ─────────────────────────────────────────────
// Maps the NEW chapter name → array of topic names under it
const BIOLOGY_STRUCTURE = {
  'Genetics, Heredity & Molecular Biology': [
    'DNA, Chromosomes & Genome Organisation',
    'DNA Replication, Genetic Code & Protein Synthesis',
    'Mendelian Genetics & Probability',
    'Classical & Human Genetics',
    'Cell Cycle, Mitosis & Meiosis',
    'Reproduction & Life Cycles',
  ],
  'Biochemistry, Biological Molecules & Bioenergetics': [
    'Water, Weak Interactions & Chemical Basis of Life',
    'Carbohydrates, Lipids, Proteins & Nucleic Acids',
    'Enzymes',
    'ATP, Cellular Respiration & Fermentation',
    'Photosynthesis',
  ],
  'Cell Biology': [
    'Cell Theory, Cell Types & Cell Size',
    'Organelles & Cellular Structures',
    'Cell Membrane & Transport',
    'Viruses',
  ],
  'Human Anatomy, Physiology & Homeostasis': [
    'Animal Tissues & Homeostasis',
    'Digestive System & Nutrition',
    'Respiratory System & Gas Exchange',
    'Circulatory System',
    'Excretion, Kidney & Osmoregulation',
    'Nervous & Endocrine Coordination',
    'Musculoskeletal System',
    'Human Reproduction',
    'Immunity',
  ],
  'Evolution, Variation & Biotechnology': [
    'Mutation, Variation & Selection',
    'Evolutionary Theory & Genetic Basis of Evolution',
    'Recombinant DNA & Biotechnology',
  ],
};

// ── 2. Source-reference prefix → chapter + topic mapping ────────────────────
// The source_reference codes encode the topic. E.g. "BIO-BCH-WAT-001" → Biochemistry chapter, Water topic
const SOURCE_PREFIX_MAP = [
  // Biochemistry chapter
  { prefix: 'BIO-BCH-WAT', chapter: 'Biochemistry, Biological Molecules & Bioenergetics', topic: 'Water, Weak Interactions & Chemical Basis of Life' },
  { prefix: 'BIO-BCH-BIO', chapter: 'Biochemistry, Biological Molecules & Bioenergetics', topic: 'Carbohydrates, Lipids, Proteins & Nucleic Acids' },
  { prefix: 'BIO-BCH-ENZ', chapter: 'Biochemistry, Biological Molecules & Bioenergetics', topic: 'Enzymes' },
  { prefix: 'BIO-BCH-ATP', chapter: 'Biochemistry, Biological Molecules & Bioenergetics', topic: 'ATP, Cellular Respiration & Fermentation' },
  { prefix: 'BIO-BCH-PHO', chapter: 'Biochemistry, Biological Molecules & Bioenergetics', topic: 'Photosynthesis' },
  { prefix: 'BIO-BCH', chapter: 'Biochemistry, Biological Molecules & Bioenergetics', topic: 'Carbohydrates, Lipids, Proteins & Nucleic Acids' },

  // Genetics chapter
  { prefix: 'BIO-GEN-DNA', chapter: 'Genetics, Heredity & Molecular Biology', topic: 'DNA, Chromosomes & Genome Organisation' },
  { prefix: 'BIO-GEN-REP', chapter: 'Genetics, Heredity & Molecular Biology', topic: 'DNA Replication, Genetic Code & Protein Synthesis' },
  { prefix: 'BIO-GEN-MEN', chapter: 'Genetics, Heredity & Molecular Biology', topic: 'Mendelian Genetics & Probability' },
  { prefix: 'BIO-GEN-HUM', chapter: 'Genetics, Heredity & Molecular Biology', topic: 'Classical & Human Genetics' },
  { prefix: 'BIO-GEN-CLH', chapter: 'Genetics, Heredity & Molecular Biology', topic: 'Classical & Human Genetics' },
  { prefix: 'BIO-GEN-CYC', chapter: 'Genetics, Heredity & Molecular Biology', topic: 'Cell Cycle, Mitosis & Meiosis' },
  { prefix: 'BIO-GEN-RLC', chapter: 'Genetics, Heredity & Molecular Biology', topic: 'Reproduction & Life Cycles' },
  { prefix: 'BIO-GEN', chapter: 'Genetics, Heredity & Molecular Biology', topic: 'Mendelian Genetics & Probability' },

  // Cell Biology chapter
  { prefix: 'BIO-CEL-THE', chapter: 'Cell Biology', topic: 'Cell Theory, Cell Types & Cell Size' },
  { prefix: 'BIO-CEL-ORG', chapter: 'Cell Biology', topic: 'Organelles & Cellular Structures' },
  { prefix: 'BIO-CEL-MEM', chapter: 'Cell Biology', topic: 'Cell Membrane & Transport' },
  { prefix: 'BIO-CEL-VIR', chapter: 'Cell Biology', topic: 'Viruses' },
  { prefix: 'BIO-CEL', chapter: 'Cell Biology', topic: 'Organelles & Cellular Structures' },

  // Human Anatomy chapter
  { prefix: 'BIO-HAP-ANI', chapter: 'Human Anatomy, Physiology & Homeostasis', topic: 'Animal Tissues & Homeostasis' },
  { prefix: 'BIO-HAP-DIG', chapter: 'Human Anatomy, Physiology & Homeostasis', topic: 'Digestive System & Nutrition' },
  { prefix: 'BIO-HAP-RES', chapter: 'Human Anatomy, Physiology & Homeostasis', topic: 'Respiratory System & Gas Exchange' },
  { prefix: 'BIO-HAP-CIR', chapter: 'Human Anatomy, Physiology & Homeostasis', topic: 'Circulatory System' },
  { prefix: 'BIO-HAP-EXC', chapter: 'Human Anatomy, Physiology & Homeostasis', topic: 'Excretion, Kidney & Osmoregulation' },
  { prefix: 'BIO-HAP-NER', chapter: 'Human Anatomy, Physiology & Homeostasis', topic: 'Nervous & Endocrine Coordination' },
  { prefix: 'BIO-HAP-MUS', chapter: 'Human Anatomy, Physiology & Homeostasis', topic: 'Musculoskeletal System' },
  { prefix: 'BIO-HAP-HRP', chapter: 'Human Anatomy, Physiology & Homeostasis', topic: 'Human Reproduction' },
  { prefix: 'BIO-HAP-IMM', chapter: 'Human Anatomy, Physiology & Homeostasis', topic: 'Immunity' },
  { prefix: 'BIO-HAP', chapter: 'Human Anatomy, Physiology & Homeostasis', topic: 'Animal Tissues & Homeostasis' },

  // Evolution chapter
  { prefix: 'BIO-EVT-MUT', chapter: 'Evolution, Variation & Biotechnology', topic: 'Mutation, Variation & Selection' },
  { prefix: 'BIO-EVT-EVT', chapter: 'Evolution, Variation & Biotechnology', topic: 'Evolutionary Theory & Genetic Basis of Evolution' },
  { prefix: 'BIO-EVT-BIO', chapter: 'Evolution, Variation & Biotechnology', topic: 'Recombinant DNA & Biotechnology' },
  { prefix: 'BIO-EVT', chapter: 'Evolution, Variation & Biotechnology', topic: 'Evolutionary Theory & Genetic Basis of Evolution' },
];

// ── 3. Old topic string → chapter fallback mapping ───────────────────────────
const OLD_TOPIC_TO_CHAPTER = {
  'Biochemistry & Bioenergetics': 'Biochemistry, Biological Molecules & Bioenergetics',
  'Evolution & Biotechnology': 'Evolution, Variation & Biotechnology',
  'Classical & Human Genetics': 'Genetics, Heredity & Molecular Biology',
  '5. Classical & Human Genetics': 'Genetics, Heredity & Molecular Biology',
  '4. Animal Tissues & Homeostasis': 'Human Anatomy, Physiology & Homeostasis',
  '7. Circulatory System': 'Human Anatomy, Physiology & Homeostasis',
  '10. Musculoskeletal System': 'Human Anatomy, Physiology & Homeostasis',
};

// ── 4. Strip old numbered-prefix from topic string ───────────────────────────
function stripNumberPrefix(str) {
  return str.replace(/^\d+\.\s*/, '').trim();
}

// ── 5. Determine chapter + topic for a question ──────────────────────────────
function resolveChapterTopic(q) {
  const src = (q.source_reference || '').toUpperCase();

  // Try source_reference prefix mapping (most accurate)
  for (const entry of SOURCE_PREFIX_MAP) {
    if (src.startsWith(entry.prefix.toUpperCase())) {
      return { chapter: entry.chapter, topic: entry.topic };
    }
  }

  // Fallback: derive from old topic field
  const oldTopic = q.topic || '';
  const cleanTopic = stripNumberPrefix(oldTopic);
  const chapter = OLD_TOPIC_TO_CHAPTER[oldTopic] || OLD_TOPIC_TO_CHAPTER[cleanTopic] || '';

  // Try to find the matching real topic
  let resolvedTopic = cleanTopic;
  if (chapter) {
    const validTopics = BIOLOGY_STRUCTURE[chapter] || [];
    const match = validTopics.find(t =>
      t.toLowerCase().includes(cleanTopic.toLowerCase()) ||
      cleanTopic.toLowerCase().includes(t.toLowerCase())
    );
    if (match) resolvedTopic = match;
  }

  return { chapter, topic: resolvedTopic };
}

// ── 6. Main cleanup ──────────────────────────────────────────────────────────
const filePath = path.join(__dirname, '..', 'src', 'lib', 'imported_questions.ts');
let raw = fs.readFileSync(filePath, 'utf8');

// Extract array
const startIdx = raw.indexOf('[');
// Find matching closing bracket
let depth = 0, endIdx = -1;
for (let i = startIdx; i < raw.length; i++) {
  if (raw[i] === '[' || raw[i] === '{') depth++;
  if (raw[i] === ']' || raw[i] === '}') depth--;
  if (depth === 0) { endIdx = i; break; }
}

const jsonPart = raw.slice(startIdx, endIdx + 1);
const questions = JSON.parse(jsonPart);

let stats = { total: 0, chapterSet: 0, topicCleaned: 0 };
const cleaned = questions.map(q => {
  stats.total++;
  const { chapter, topic } = resolveChapterTopic(q);
  if (chapter) stats.chapterSet++;

  // If old topic had a number prefix, the cleaned topic is better
  const cleanedTopic = stripNumberPrefix(q.topic || '');
  if (cleanedTopic !== q.topic) stats.topicCleaned++;

  return {
    ...q,
    chapter: chapter || '',
    topic: topic || cleanedTopic,
  };
});

// Rebuild file
const prefix = raw.slice(0, startIdx);
const suffix = raw.slice(endIdx + 1);
const newJson = JSON.stringify(cleaned, null, 2);
const newContent = prefix + newJson + suffix;

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('✅ Cleanup complete!');
console.log(`Total questions:   ${stats.total}`);
console.log(`Chapter set:       ${stats.chapterSet}`);
console.log(`Topics cleaned:    ${stats.topicCleaned}`);

// Print a sample to verify
console.log('\n--- Sample (first 3 questions) ---');
cleaned.slice(0, 3).forEach(q => {
  console.log(`  ID: ${q.id}`);
  console.log(`  Subject: ${q.subject}`);
  console.log(`  Chapter: ${q.chapter}`);
  console.log(`  Topic: ${q.topic}`);
  console.log(`  Q: ${q.question_text.slice(0, 60)}...`);
  console.log('');
});
