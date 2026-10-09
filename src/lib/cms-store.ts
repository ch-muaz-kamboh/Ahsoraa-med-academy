'use client';

import { createClient } from '@/lib/supabase/client';
import { ACADEMY_PACKAGES } from './packages';

export interface ArticleIndexItem {
  id: string; // anchor slug (e.g. "application-timeline")
  title: string; // heading label (e.g. "1. Important Deadlines")
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  featured?: boolean;
  indexes?: ArticleIndexItem[];
}

export interface ResourceDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  format: 'PDF' | 'DOCX' | 'ZIP';
  fileUrl: string;
  fileSize: string;
  downloadsCount: number;
  dateAdded: string;
}

export interface TickerItem {
  id: string;
  text: string;
  icon?: string;
}

export interface DynamicPackagePrice {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  originalPrice?: string;
  numericOriginalPrice?: number;
  discountBadge?: string;
  isDiscountActive?: boolean;
}

// ── Initial Mock Data Fallbacks ──────────────────────────────────────────────

const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Admissions Open in Italy for 2027/2028 Academic Year',
    slug: 'admissions-open-italy-2027',
    category: 'Admissions',
    date: 'Sep 2, 2026',
    readTime: '4 min read',
    excerpt: 'The Italian Ministry of University and Research (MUR) has officially announced that applications for the 2027/2028 IMAT cycle are now open. Here is everything you need to know about deadlines, eligible universities, and what documents to prepare.',
    content: `<h2 id="mur-announcement">1. Official MUR Announcement & Timeline</h2>
<p>The Italian Ministry of University and Research (MUR) has officially confirmed that the 2027/2028 admission cycle for public medical universities is active. Non-EU applicants must submit through the Universitaly portal.</p>

<h2 id="universitaly-pre-enrollment">2. Universitaly Pre-Enrollment & Portal Steps</h2>
<p>Applicants must register and complete the mandatory pre-enrollment application, selecting their single public university choice. Ensure that your secondary school qualifications and transcript translations are ready.</p>

<h2 id="dov-and-document-checklist">3. DOV (Declaration of Value) & Essential Documents</h2>
<p>International non-EU medical candidates must obtain either a Declaration of Value (DOV) from the Italian consulate or a Statement of Comparability issued by CIMEA. Certified translations and apostille stamps must be affixed.</p>

<h2 id="english-licensing-universities">4. Eligible English-Taught Italian Medical Schools</h2>
<p>Over 16 public universities across Italy offer fully English-medium Medicine and Surgery (MD, LM-41) degrees, including University of Milan, Bologna, Rome La Sapienza, Pavia, and Naples Vanvitelli.</p>`,
    author: 'Ahsora Admissions Team',
    featured: true,
    indexes: [
      { id: 'mur-announcement', title: '1. Official MUR Announcement & Timeline' },
      { id: 'universitaly-pre-enrollment', title: '2. Universitaly Pre-Enrollment & Steps' },
      { id: 'dov-and-document-checklist', title: '3. DOV & Essential Document Checklist' },
      { id: 'english-licensing-universities', title: '4. Eligible English-Taught Medical Schools' },
    ],
  },
  {
    id: 'news-2',
    title: 'How to Score 60+ on the IMAT: A High-Yield Strategy Guide',
    slug: 'score-60-plus-imat-guide',
    category: 'IMAT Tips',
    date: 'Aug 28, 2026',
    readTime: '6 min read',
    excerpt: 'Scoring 60+ requires more than hard work — it demands the right strategy. We break down the exact approach top-scoring Ahsora students use to maximize their marks in Biology, Chemistry, and Logical Reasoning.',
    content: `<h2 id="anatomy-60-score">1. Anatomy of a 60+ Score on the IMAT</h2>
<p>Achieving 60+ points puts candidates comfortably above cutoff ranks for Milan, Bologna, and Pavia. Out of 90 maximum points (60 questions), scoring 60+ requires a calculated approach balancing accuracy and calculated skips.</p>

<h2 id="negative-marking-management">2. Negative Marking Management (-0.4 Rules)</h2>
<p>Each incorrect answer carries a -0.4 point penalty. Avoid blind guessing on questions where you cannot eliminate at least 2 or 3 options. A question left blank awards 0 points and preserves your baseline score.</p>

<h2 id="subject-priority">3. Biology & Chemistry Weighting Priorities</h2>
<p>Biology and Chemistry account for the lion's share of the test. Master molecular biology, cellular metabolism, genetics, and organ systems first, alongside stoichiometry, chemical bonding, and acid-base equilibria.</p>

<h2 id="mock-routines">4. CBT Timed Mock Strategy & Mistake Notebooks</h2>
<p>Complete at least 10 to 12 timed CBT mocks under strict 90-minute examination conditions. Log every missed question in an active mistakes notebook to target recurring conceptual errors before exam day.</p>`,
    author: 'Dr. Sofia Renna',
    featured: false,
    indexes: [
      { id: 'anatomy-60-score', title: '1. Anatomy of a 60+ Score' },
      { id: 'negative-marking-management', title: '2. Negative Marking Strategy (-0.4)' },
      { id: 'subject-priority', title: '3. Biology & Chemistry Weighting' },
      { id: 'mock-routines', title: '4. CBT Timed Mock & Notebook Routines' },
    ],
  },
  {
    id: 'news-3',
    title: 'Top 5 Italian Universities for International Medical Students in 2027',
    slug: 'top-5-italian-universities-2027',
    category: 'University Guide',
    date: 'Aug 20, 2026',
    readTime: '8 min read',
    excerpt: 'La Sapienza, University of Milan, Bologna, Pavia, or Naples? We rank the top 5 Italian medical schools for English-language programs, comparing cost of living, clinical exposure, and IMAT cutoff scores.',
    content: 'In-depth comparison of cutoffs, hospital training facilities, student housing costs, and EU license validity across Rome La Sapienza, University of Milan, Bologna, Pavia, and University of Campania Luigi Vanvitelli.',
    author: 'Ahsora Research Team',
    featured: false,
  },
  {
    id: 'news-4',
    title: 'The 12-Week IMAT Study Plan That Gets Results',
    slug: '12-week-imat-study-plan',
    category: 'Study Plan',
    date: 'Aug 15, 2026',
    readTime: '5 min read',
    excerpt: 'Starting from scratch with 12 weeks to go? Our evidence-based study schedule — used by 3,500+ Ahsora students — breaks down exactly what to study each week, how many practice questions to tackle, and when to do mock tests.',
    content: 'Week-by-week calendar breakdown covering initial baseline mock, active recall methods for biological molecules, organic chemistry mechanisms, and timed CBT practice exams.',
    author: 'Ahsora Academic Team',
    featured: false,
  },
  {
    id: 'news-5',
    title: 'After IMAT: Your Global Licensing Options as an Italian Medical Graduate',
    slug: 'after-imat-global-licensing',
    category: 'Licensing',
    date: 'Aug 8, 2026',
    readTime: '7 min read',
    excerpt: 'Graduating from an Italian medical university opens doors worldwide. We walk through how to proceed to PLAB (UK), USMLE (USA), AMC (Australia), and FMGE (India) after completing your Italian medical degree.',
    content: 'Detailed roadmap for international recognition of Italian MD degrees (LM-41 code), ECFMG certification eligibility, UK GMC registration via PLAB/UKMLA, and direct practicing rights in the European Union.',
    author: 'Dr. Tariq Al-Hassan',
    featured: false,
  },
  {
    id: 'news-6',
    title: 'Student Visa Guide for Italy 2027: Everything You Need to Know',
    slug: 'student-visa-guide-italy-2027',
    category: 'Visa & Living',
    date: 'Jul 30, 2026',
    readTime: '5 min read',
    excerpt: 'Applying for a Type D student visa for Italy? We cover the complete application process, document checklist, income thresholds, and embassy interview tips for Pakistani, Egyptian, and South Asian applicants.',
    content: 'Step-by-step guidance on embassy appointments, minimum bank statement balance (€6,000+ per year of study), codice fiscale, and health insurance requirements for non-EU students.',
    author: 'Ahsora Visa Team',
    featured: false,
  },
];

const INITIAL_DOCUMENTS: ResourceDocument[] = [
  {
    id: 'doc-1',
    title: 'Official IMAT Complete Syllabus & Exam Blueprint (2026/2027)',
    description: 'Comprehensive topic-by-topic specification issued by MUR & Cambridge Assessment for Biology, Chemistry, Physics, Math, and General Knowledge.',
    category: 'Syllabus & Blueprint',
    format: 'PDF',
    fileUrl: '/docs/IMAT_Official_Syllabus_2026.pdf',
    fileSize: '2.4 MB',
    downloadsCount: 1420,
    dateAdded: 'Aug 10, 2026',
  },
  {
    id: 'doc-2',
    title: 'Ahsora High-Yield Biology Revision Mindmaps & Summary Notes',
    description: 'Concise summary of Cell Biology, Bioenergetics, Genetics, Human Physiology, and DNA Replication designed for rapid last-minute revision.',
    category: 'Biology Notes',
    format: 'PDF',
    fileUrl: '/docs/Ahsora_Biology_HighYield_Notes.pdf',
    fileSize: '5.1 MB',
    downloadsCount: 2380,
    dateAdded: 'Aug 18, 2026',
  },
  {
    id: 'doc-3',
    title: 'IMAT Organic & General Chemistry Formula Cheat Sheet',
    description: 'Must-know chemical reactions, stoichiometry formulas, functional groups, and periodic trends for IMAT Chemistry.',
    category: 'Chemistry Cheat Sheets',
    format: 'PDF',
    fileUrl: '/docs/Chemistry_IMAT_CheatSheet.pdf',
    fileSize: '1.8 MB',
    downloadsCount: 1890,
    dateAdded: 'Aug 22, 2026',
  },
  {
    id: 'doc-4',
    title: 'IMAT Past Papers Compilation (2011 – 2025) with Answer Key',
    description: 'All official IMAT past exam papers bundled together with worked solutions and topic difficulty categorizations.',
    category: 'Past Papers',
    format: 'PDF',
    fileUrl: '/docs/IMAT_Past_Papers_2011_2025.pdf',
    fileSize: '14.2 MB',
    downloadsCount: 3950,
    dateAdded: 'Jul 15, 2026',
  },
  {
    id: 'doc-5',
    title: 'Italian University Pre-Enrollment & DOV Document Checklist',
    description: 'Official step-by-step checklist for Universitaly portal submission, Declaration of Value (DOV), apostilles, and legalizations.',
    category: 'Admissions Checklists',
    format: 'PDF',
    fileUrl: '/docs/Italian_University_DOV_Checklist.pdf',
    fileSize: '1.2 MB',
    downloadsCount: 1150,
    dateAdded: 'Aug 05, 2026',
  },
  {
    id: 'doc-6',
    title: 'IMAT Physics & Mathematics Quick Reference Formula Sheet',
    description: 'Complete list of mechanics, thermodynamics, electromagnetism, and algebra formulas needed for IMAT Physics and Math.',
    category: 'Physics & Math',
    format: 'PDF',
    fileUrl: '/docs/IMAT_Physics_Math_Formulas.pdf',
    fileSize: '2.0 MB',
    downloadsCount: 1670,
    dateAdded: 'Aug 25, 2026',
  },
];

const INITIAL_TICKER: TickerItem[] = [
  { id: 't-1', text: '🎓 100% Admission Guidance to Top Italian Public Medical Universities', icon: '🎓' },
  { id: 't-2', text: '⚡ IMAT 2027 Registration Open — Special Discount Offer Active', icon: '⚡' },
  { id: 't-3', text: '🏆 2,800+ Verified Practice Questions with Step-by-Step Video Explanations', icon: '🏆' },
  { id: 't-4', text: '📜 Pre-Enrollment, DOV & Student Visa Legal Support Included in MedPath Elite', icon: '📜' },
  { id: 't-5', text: '💼 Learn Directly from Certified Doctors & Senior Medical Mentors in Italy', icon: '💼' },
];

const INITIAL_PACKAGE_PRICES: DynamicPackagePrice[] = ACADEMY_PACKAGES.map((pkg) => ({
  id: pkg.id,
  name: pkg.name,
  price: pkg.price,
  numericPrice: pkg.numericPrice,
  originalPrice: pkg.id === 'ascend' ? '€399' : pkg.id === 'mastery' ? '€649' : '€999',
  numericOriginalPrice: pkg.id === 'ascend' ? 399 : pkg.id === 'mastery' ? 649 : 999,
  discountBadge: pkg.id === 'ascend' ? '25% OFF' : pkg.id === 'mastery' ? '23% OFF' : '20% OFF',
  isDiscountActive: true,
}));

// ── LocalStorage Keys ────────────────────────────────────────────────────────

const NEWS_KEY = 'ahsora_cms_news_posts';
const DOCS_KEY = 'ahsora_cms_documents';
const TICKER_KEY = 'ahsora_cms_ticker_items';
const PRICES_KEY = 'ahsora_cms_package_prices';

// ── 1. NEWS & BLOG POSTS ─────────────────────────────────────────────────────

export function getNewsPosts(): NewsItem[] {
  if (typeof window === 'undefined') return INITIAL_NEWS;
  try {
    const data = localStorage.getItem(NEWS_KEY);
    return data ? JSON.parse(data) : INITIAL_NEWS;
  } catch {
    return INITIAL_NEWS;
  }
}

export function saveNewsPosts(posts: NewsItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NEWS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save news posts locally:', e);
  }
}

export async function syncNewsFromSupabase(): Promise<NewsItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('news_posts').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const formatted: NewsItem[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        category: item.category,
        author: item.author,
        date: item.date,
        readTime: item.read_time,
        imageUrl: item.image_url,
        featured: item.featured,
      }));
      saveNewsPosts(formatted);
      return formatted;
    }
  } catch (e) {
    console.warn('Supabase news fetch skipped/fallback to local:', e);
  }
  return getNewsPosts();
}

export function addNewsPost(post: Omit<NewsItem, 'id'>): NewsItem {
  const posts = getNewsPosts();
  const newPost: NewsItem = {
    ...post,
    id: `news-${Date.now()}`,
  };
  const updated = [newPost, ...posts];
  saveNewsPosts(updated);

  // Async Supabase Sync
  if (typeof window !== 'undefined') {
    const supabase = createClient();
    supabase.from('news_posts').insert({
      id: newPost.id,
      title: newPost.title,
      slug: newPost.slug,
      excerpt: newPost.excerpt,
      content: newPost.content,
      category: newPost.category,
      author: newPost.author,
      date: newPost.date,
      read_time: newPost.readTime,
      image_url: newPost.imageUrl || null,
      featured: newPost.featured || false,
    }).then(({ error }) => {
      if (error) console.warn('Supabase news insert warning:', error.message);
    });
  }

  return newPost;
}

export function updateNewsPost(updatedPost: NewsItem): NewsItem {
  const posts = getNewsPosts();
  const index = posts.findIndex((p) => p.id === updatedPost.id);
  const updated = index !== -1
    ? posts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    : [updatedPost, ...posts];
  saveNewsPosts(updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ahsora_cms_news_updated', { detail: updatedPost }));
    const supabase = createClient();
    supabase.from('news_posts').upsert({
      id: updatedPost.id,
      title: updatedPost.title,
      slug: updatedPost.slug,
      excerpt: updatedPost.excerpt,
      content: updatedPost.content,
      category: updatedPost.category,
      author: updatedPost.author,
      date: updatedPost.date,
      read_time: updatedPost.readTime,
      image_url: updatedPost.imageUrl || null,
      featured: updatedPost.featured || false,
    }).then(({ error }) => {
      if (error) console.warn('Supabase news update warning:', error.message);
    });
  }

  return updatedPost;
}

export function deleteNewsPost(id: string) {
  const posts = getNewsPosts().filter((p) => p.id !== id);
  saveNewsPosts(posts);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ahsora_cms_news_updated'));
    const supabase = createClient();
    supabase.from('news_posts').delete().eq('id', id).then(({ error }) => {
      if (error) console.warn('Supabase news delete warning:', error.message);
    });
  }
}

// ── 2. RESOURCE DOCUMENTS ────────────────────────────────────────────────────

export function getResourceDocuments(): ResourceDocument[] {
  if (typeof window === 'undefined') return INITIAL_DOCUMENTS;
  try {
    const data = localStorage.getItem(DOCS_KEY);
    return data ? JSON.parse(data) : INITIAL_DOCUMENTS;
  } catch {
    return INITIAL_DOCUMENTS;
  }
}

export function saveResourceDocuments(docs: ResourceDocument[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save documents locally:', e);
  }
}

export async function syncDocumentsFromSupabase(): Promise<ResourceDocument[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('resource_documents').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const formatted: ResourceDocument[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        format: item.format,
        fileUrl: item.file_url,
        fileSize: item.file_size,
        downloadsCount: item.downloads_count || 0,
        dateAdded: item.date_added,
      }));
      saveResourceDocuments(formatted);
      return formatted;
    }
  } catch (e) {
    console.warn('Supabase documents fetch skipped/fallback:', e);
  }
  return getResourceDocuments();
}

export function addResourceDocument(doc: Omit<ResourceDocument, 'id' | 'dateAdded' | 'downloadsCount'>): ResourceDocument {
  const docs = getResourceDocuments();
  const newDoc: ResourceDocument = {
    ...doc,
    id: `doc-${Date.now()}`,
    downloadsCount: 0,
    dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
  const updated = [newDoc, ...docs];
  saveResourceDocuments(updated);

  if (typeof window !== 'undefined') {
    const supabase = createClient();
    supabase.from('resource_documents').insert({
      id: newDoc.id,
      title: newDoc.title,
      description: newDoc.description,
      category: newDoc.category,
      format: newDoc.format,
      file_url: newDoc.fileUrl,
      file_size: newDoc.fileSize,
      downloads_count: 0,
      date_added: newDoc.dateAdded,
    }).then(({ error }) => {
      if (error) console.warn('Supabase document insert warning:', error.message);
    });
  }

  return newDoc;
}

export function deleteResourceDocument(id: string) {
  const docs = getResourceDocuments().filter((d) => d.id !== id);
  saveResourceDocuments(docs);

  if (typeof window !== 'undefined') {
    const supabase = createClient();
    supabase.from('resource_documents').delete().eq('id', id).then(({ error }) => {
      if (error) console.warn('Supabase document delete warning:', error.message);
    });
  }
}

// ── 3. TICKER / MOVING STRIP ITEMS ──────────────────────────────────────────

export function getTickerItems(): TickerItem[] {
  if (typeof window === 'undefined') return INITIAL_TICKER;
  try {
    const data = localStorage.getItem(TICKER_KEY);
    return data ? JSON.parse(data) : INITIAL_TICKER;
  } catch {
    return INITIAL_TICKER;
  }
}

export function saveTickerItems(items: TickerItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TICKER_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save ticker items locally:', e);
  }
}

export async function syncTickerFromSupabase(): Promise<TickerItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('ticker_items').select('*').order('created_at', { ascending: true });
    if (!error && data && data.length > 0) {
      const formatted: TickerItem[] = data.map((item: any) => ({
        id: item.id,
        text: item.text,
        icon: item.icon || '✨',
      }));
      saveTickerItems(formatted);
      return formatted;
    }
  } catch (e) {
    console.warn('Supabase ticker fetch skipped/fallback:', e);
  }
  return getTickerItems();
}

export function addTickerItem(text: string, icon = '✨'): TickerItem {
  const items = getTickerItems();
  const newItem: TickerItem = { id: `t-${Date.now()}`, text, icon };
  const updated = [...items, newItem];
  saveTickerItems(updated);

  if (typeof window !== 'undefined') {
    const supabase = createClient();
    supabase.from('ticker_items').insert({
      id: newItem.id,
      text: newItem.text,
      icon: newItem.icon,
    }).then(({ error }) => {
      if (error) console.warn('Supabase ticker insert warning:', error.message);
    });
  }

  return newItem;
}

export function deleteTickerItem(id: string) {
  const items = getTickerItems().filter((t) => t.id !== id);
  saveTickerItems(items);

  if (typeof window !== 'undefined') {
    const supabase = createClient();
    supabase.from('ticker_items').delete().eq('id', id).then(({ error }) => {
      if (error) console.warn('Supabase ticker delete warning:', error.message);
    });
  }
}

// ── 3B. STUDENT PORTAL MOVING STRIP (ADMIN CONTROLLED) ─────────────────────────

export interface PortalTickerConfig {
  isActive: boolean;
  speedSeconds: number;
  bgStyle: 'emerald' | 'dark' | 'slate';
  items: TickerItem[];
}

const PORTAL_TICKER_KEY = 'ahsora_cms_portal_ticker';

const INITIAL_PORTAL_TICKER: PortalTickerConfig = {
  isActive: true,
  speedSeconds: 26,
  bgStyle: 'emerald',
  items: [
    { id: 'pt-1', text: '🎓 Full-Length IMAT 2027 CBT Mock Test #12 is now live in Mock Exams!', icon: '🎯' },
    { id: 'pt-2', text: '💡 Study Tip: Review your personal Mistakes Tracker weekly to prevent repeat errors.', icon: '💡' },
    { id: 'pt-3', text: '📅 Live Chemistry Question Solving Masterclass this Saturday at 4:00 PM CET.', icon: '📅' },
    { id: 'pt-4', text: '🏆 2,800+ Verified Practice Questions with Step-by-Step Video Explanations active.', icon: '🏆' },
    { id: 'pt-5', text: '⚡ MedPath Elite: Senior Doctor mentor advisory session slots open for booking.', icon: '⚡' },
    { id: 'pt-6', text: '📚 High-yield Biology mindmaps updated in your Document Vault & Resources.', icon: '📚' },
  ],
};

export function getPortalTickerConfig(): PortalTickerConfig {
  if (typeof window === 'undefined') return INITIAL_PORTAL_TICKER;
  try {
    const data = localStorage.getItem(PORTAL_TICKER_KEY);
    return data ? JSON.parse(data) : INITIAL_PORTAL_TICKER;
  } catch {
    return INITIAL_PORTAL_TICKER;
  }
}

export function savePortalTickerConfig(config: PortalTickerConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PORTAL_TICKER_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save portal ticker config locally:', e);
  }
}

export async function syncPortalTickerFromSupabase(): Promise<PortalTickerConfig> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();
    if (!error && data && data.portal_ticker_config) {
      const parsed: PortalTickerConfig = data.portal_ticker_config;
      savePortalTickerConfig(parsed);
      return parsed;
    }
  } catch (e) {
    console.warn('Supabase portal ticker fetch skipped/fallback:', e);
  }
  return getPortalTickerConfig();
}

export function updatePortalTickerConfig(config: PortalTickerConfig) {
  savePortalTickerConfig(config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ahsora_cms_portal_ticker_updated', { detail: config }));
    const supabase = createClient();
    supabase.from('site_content').upsert({
      id: 1,
      portal_ticker_config: config,
      updated_at: new Date().toISOString(),
    }).then(({ error }) => {
      if (error) console.warn('Supabase portal ticker upsert notice:', error.message);
    });
  }
}

export function addPortalTickerItem(text: string, icon = '📢'): PortalTickerConfig {
  const current = getPortalTickerConfig();
  const newItem: TickerItem = { id: `pt-${Date.now()}`, text, icon };
  const updated: PortalTickerConfig = {
    ...current,
    items: [...current.items, newItem],
  };
  updatePortalTickerConfig(updated);
  return updated;
}

export function deletePortalTickerItem(id: string): PortalTickerConfig {
  const current = getPortalTickerConfig();
  const updated: PortalTickerConfig = {
    ...current,
    items: current.items.filter((item) => item.id !== id),
  };
  updatePortalTickerConfig(updated);
  return updated;
}

// ── 4. DYNAMIC PACKAGE PRICING & DISCOUNTS ───────────────────────────────────

export function getDynamicPackagePrices(): DynamicPackagePrice[] {
  if (typeof window === 'undefined') return INITIAL_PACKAGE_PRICES;
  try {
    const data = localStorage.getItem(PRICES_KEY);
    return data ? JSON.parse(data) : INITIAL_PACKAGE_PRICES;
  } catch {
    return INITIAL_PACKAGE_PRICES;
  }
}

export function saveDynamicPackagePrices(prices: DynamicPackagePrice[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRICES_KEY, JSON.stringify(prices));
  } catch (e) {
    console.error('Failed to save prices locally:', e);
  }
}

export async function syncPricesFromSupabase(): Promise<DynamicPackagePrice[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('package_prices').select('*');
    if (!error && data && data.length > 0) {
      const formatted: DynamicPackagePrice[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        numericPrice: Number(item.numeric_price),
        originalPrice: item.original_price,
        numericOriginalPrice: item.numeric_original_price ? Number(item.numeric_original_price) : undefined,
        discountBadge: item.discount_badge,
        isDiscountActive: item.is_discount_active ?? true,
      }));
      saveDynamicPackagePrices(formatted);
      return formatted;
    }
  } catch (e) {
    console.warn('Supabase package prices fetch skipped/fallback:', e);
  }
  return getDynamicPackagePrices();
}

export function updatePackagePricing(
  id: string,
  price: string,
  numericPrice: number,
  originalPrice?: string,
  numericOriginalPrice?: number,
  discountBadge?: string,
  isDiscountActive = true
) {
  const prices = getDynamicPackagePrices();
  const updated = prices.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        price,
        numericPrice,
        originalPrice,
        numericOriginalPrice,
        discountBadge,
        isDiscountActive,
      };
    }
    return p;
  });
  saveDynamicPackagePrices(updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ahsora_cms_prices_updated', { detail: updated }));
    const supabase = createClient();
    const target = updated.find((p) => p.id === id);
    if (target) {
      supabase.from('package_prices').upsert({
        id: target.id,
        name: target.name,
        price: target.price,
        numeric_price: target.numericPrice,
        original_price: target.originalPrice || null,
        numeric_original_price: target.numericOriginalPrice || null,
        discount_badge: target.discountBadge || null,
        is_discount_active: target.isDiscountActive,
        updated_at: new Date().toISOString(),
      }).then(({ error }) => {
        if (error) console.warn('Supabase pricing upsert warning:', error.message);
      });
    }
  }
}

export function getPackagePriceDisplay(pkgId: string, fallbackPrice?: string): { price: string; originalPrice?: string | null; badge?: string | null } {
  const targetId = pkgId === 'ascent' ? 'ascend' : pkgId;
  const prices = getDynamicPackagePrices();
  const found = prices.find((p) => p.id === targetId || p.id === pkgId);
  if (found) {
    return {
      price: found.price,
      originalPrice: (found.isDiscountActive ?? true) ? (found.originalPrice || null) : null,
      badge: (found.isDiscountActive ?? true) ? (found.discountBadge || null) : null,
    };
  }
  const defaultSale = targetId === 'ascend' ? '€299' : targetId === 'mastery' ? '€499' : '€799';
  const defaultOrig = targetId === 'ascend' ? '€399' : targetId === 'mastery' ? '€649' : '€999';
  const defaultBadge = targetId === 'ascend' ? '25% OFF' : targetId === 'mastery' ? '23% OFF' : '20% OFF';
  return {
    price: fallbackPrice || defaultSale,
    originalPrice: defaultOrig,
    badge: defaultBadge,
  };
}

// ── 5. SALE OFFER & FLASH PROMO CONFIG ────────────────────────────────────────

export interface SaleOfferConfig {
  isSaleActive: boolean;
  offerTitle: string;
  offerSubtitle: string;
  endDate: string;
  discountBadgeText?: string;
  promoCode?: string;
}

const SALE_OFFER_KEY = 'ahsora_cms_sale_offer';

const INITIAL_SALE_OFFER: SaleOfferConfig = {
  isSaleActive: true,
  offerTitle: '⚡ IMAT 2027 AUTUMN FLASH SALE — UP TO 25% OFF',
  offerSubtitle: 'Enrol today to lock in special discounted pricing with 12 months full portal access!',
  endDate: '2026-10-31T23:59:59',
  discountBadgeText: 'LIMITED TIME OFFER',
  promoCode: 'AUTUMN25',
};

export function getSaleOfferConfig(): SaleOfferConfig {
  if (typeof window === 'undefined') return INITIAL_SALE_OFFER;
  try {
    const data = localStorage.getItem(SALE_OFFER_KEY);
    return data ? JSON.parse(data) : INITIAL_SALE_OFFER;
  } catch {
    return INITIAL_SALE_OFFER;
  }
}

export function saveSaleOfferConfig(config: SaleOfferConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SALE_OFFER_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save sale offer locally:', e);
  }
}

export async function syncSaleOfferFromSupabase(): Promise<SaleOfferConfig> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();
    if (!error && data && data.sale_offer_config) {
      const parsed: SaleOfferConfig = data.sale_offer_config;
      saveSaleOfferConfig(parsed);
      return parsed;
    }
  } catch (e) {
    console.warn('Supabase sale offer fetch skipped/fallback:', e);
  }
  return getSaleOfferConfig();
}

export function updateSaleOfferConfig(config: SaleOfferConfig) {
  saveSaleOfferConfig(config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ahsora_cms_sale_offer_updated', { detail: config }));
    const supabase = createClient();
    supabase.from('site_content').upsert({
      id: 1,
      sale_offer_config: config,
      updated_at: new Date().toISOString(),
    }).then(({ error }) => {
      if (error) console.warn('Supabase sale offer upsert notice:', error.message);
    });
  }
}
