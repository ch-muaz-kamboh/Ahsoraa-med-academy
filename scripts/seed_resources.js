const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const INITIAL_DOCS = [
  {
    id: 'doc-imat-2026-blueprint',
    title: 'Official IMAT 2026/2027 Complete Syllabus & Exam Blueprint',
    description: 'Comprehensive topic-by-topic specification issued by MUR & Cambridge Assessment for Biology, Chemistry, Physics, Math, and General Knowledge.',
    category: 'IMAT Past Papers',
    format: 'PDF',
    file_url: '/docs/IMAT_2026_Syllabus_Blueprint.pdf',
    file_size: '2.1 MB',
    downloads_count: 6840,
    date_added: 'Jan 15, 2026',
  },
  {
    id: 'doc-imat-2025',
    title: 'Official IMAT 2025 Past Paper & Answer Key (Complete)',
    description: 'Official test paper from the September 2025 sitting with complete verified answer key from the Italian Ministry (MUR).',
    category: 'IMAT Past Papers',
    format: 'PDF',
    file_url: '/docs/IMAT_2025_Past_Paper.pdf',
    file_size: '3.8 MB',
    downloads_count: 4210,
    date_added: 'Sep 25, 2025',
  },
  {
    id: 'doc-imat-2024',
    title: 'Official IMAT 2024 Past Paper & Answer Key',
    description: 'Complete 60-question examination paper with official scoring key for Biology, Chemistry, Physics, Math, and General Knowledge.',
    category: 'IMAT Past Papers',
    format: 'PDF',
    file_url: '/docs/IMAT_2024_Past_Paper.pdf',
    file_size: '3.4 MB',
    downloads_count: 5120,
    date_added: 'Sep 20, 2024',
  },
  {
    id: 'doc-imat-2023',
    title: 'Official IMAT 2023 Past Paper with Solution Key',
    description: 'Official MUR examination paper featuring the revised format and question distribution with official answers.',
    category: 'IMAT Past Papers',
    format: 'PDF',
    file_url: '/docs/IMAT_2023_Past_Paper.pdf',
    file_size: '3.1 MB',
    downloads_count: 3890,
    date_added: 'Oct 10, 2023',
  },
  {
    id: 'doc-imat-2022',
    title: 'Official IMAT 2022 Past Paper & Verified Scoring Grid',
    description: 'Original Cambridge Assessment examination paper with complete scoring rubric and question solutions.',
    category: 'IMAT Past Papers',
    format: 'PDF',
    file_url: '/docs/IMAT_2022_Past_Paper.pdf',
    file_size: '2.9 MB',
    downloads_count: 4760,
    date_added: 'Sep 18, 2022',
  },
  {
    id: 'doc-imat-2021',
    title: 'Official IMAT 2021 Past Paper & Answer Key',
    description: 'Full-length 60-question examination paper with official Cambridge answers.',
    category: 'IMAT Past Papers',
    format: 'PDF',
    file_url: '/docs/IMAT_2021_Past_Paper.pdf',
    file_size: '2.8 MB',
    downloads_count: 3450,
    date_added: 'Sep 15, 2021',
  },
  {
    id: 'doc-bio-1',
    title: 'High-Yield Cell Biology & Genetics Formula Pack',
    description: 'Essential diagrams, Mendelian genetics cheat-sheet, organelle comparative tables, and molecular pathways.',
    category: 'Biology Notes',
    format: 'PDF',
    file_url: '/docs/High_Yield_Cell_Biology_Genetics.pdf',
    file_size: '5.2 MB',
    downloads_count: 2940,
    date_added: 'Nov 02, 2025',
  },
  {
    id: 'doc-chem-1',
    title: 'Organic Chemistry & Stoichiometry Quick Revision Map',
    description: 'Functional group priorities, reaction mechanisms, redox balancing shortcuts, and periodic trend cheat-sheet.',
    category: 'Chemistry Cheat Sheets',
    format: 'PDF',
    file_url: '/docs/Organic_Chemistry_Revision_Map.pdf',
    file_size: '4.1 MB',
    downloads_count: 2430,
    date_added: 'Dec 14, 2025',
  },
  {
    id: 'doc-phys-1',
    title: 'Physics Mechanics & Thermodynamics Formula Compendium',
    description: 'Kinematics, Newton laws, thermodynamic cycles, circuits, and electric fields summary tailored to IMAT syllabus.',
    category: 'Physics & Math',
    format: 'PDF',
    file_url: '/docs/Physics_Formulas_IMAT.pdf',
    file_size: '3.6 MB',
    downloads_count: 2110,
    date_added: 'Jan 05, 2026',
  },
  {
    id: 'doc-visa-1',
    title: 'Universitaly Pre-Enrollment & Italian Student Visa Roadmap 2026/27',
    description: 'Step-by-step bureaucratic checklist: Declaration of Value (DOV), CIMEA statements, fiscal code, and embassy appointment timeline.',
    category: 'Admissions Checklists',
    format: 'PDF',
    file_url: '/docs/Universitaly_PreEnrollment_Visa_Checklist.pdf',
    file_size: '1.9 MB',
    downloads_count: 3820,
    date_added: 'Jan 22, 2026',
  }
];

async function seed() {
  console.log('Seeding resource_documents...');
  const { data, error } = await supabase.from('resource_documents').upsert(INITIAL_DOCS, { onConflict: 'id' });
  if (error) {
    console.error('Error seeding resource_documents:', error);
  } else {
    console.log('Successfully seeded resource_documents!');
  }

  // Also check if site_content has cutoff_data
  const { error: testErr } = await supabase.from('site_content').update({ cutoff_data: { test: true } }).eq('id', 1);
  console.log('Update cutoff_data error:', testErr ? testErr.message : 'SUCCESS');
}

seed();
