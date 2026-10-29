import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/client';
import { NewsItem } from '@/lib/cms-store';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Tag,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap
} from 'lucide-react';
import ArticleShareBar from '@/components/news/ArticleShareBar';
import ArticleTableOfContents from '@/components/news/ArticleTableOfContents';

export const revalidate = 60; // ISR: Incremental Static Regeneration every 60 seconds

function injectHeadingIds(html: string): string {
  if (!html) return '';
  let counter = 1;
  return html.replace(/<h([23])(?:\s+id=["']([^"']*)["'])?([^>]*)>(.*?)<\/h\1>/gi, (match, tag, existingId, otherAttrs, text) => {
    if (existingId) return match;
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const slug = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `section-${counter++}`;
    return `<h${tag} id="${slug}"${otherAttrs}>${text}</h${tag}>`;
  });
}

// ── Fallback articles database for SSR when Supabase is offline / demo mode ──
const SSR_FALLBACK_NEWS: NewsItem[] = [
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
    metaTitle: 'Italy IMAT Admissions Open 2027/28 | Ahsora Academy',
    metaDescription: 'Official Italian MUR announcement for IMAT 2027/2028 medical admissions. Timeline, Universitaly pre-enrollment steps, and eligible English medical schools.',
    faqItems: [
      { question: 'When do IMAT 2027 applications open?', answer: 'Universitaly pre-enrollment opens in summer with official test dates scheduled by MUR in September.' },
      { question: 'Can non-EU international students apply for Italian medicine?', answer: 'Yes, non-EU students apply via Universitaly with a Declaration of Value (DOV) or CIMEA certificate.' },
      { question: 'Which Italian universities teach medicine in English?', answer: 'Over 16 public universities including Milan, Bologna, Rome La Sapienza, Pavia, and Naples offer English MD programs.' },
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
    metaTitle: 'How to Score 60+ on IMAT: High-Yield Strategy Guide',
    metaDescription: 'Master high-yield Biology and Chemistry, avoid negative marking penalties, and implement CBT mock routines to achieve a top 60+ IMAT score in Italy.',
    faqItems: [
      { question: 'What is considered a competitive IMAT score?', answer: 'A score of 60+ out of 90 puts applicants in the top percentile, sufficient for top universities like Milan, Bologna, and Pavia.' },
      { question: 'How does IMAT negative marking work?', answer: 'Each correct answer earns +1.5 points, incorrect answers penalize -0.4 points, and blank answers receive 0 points.' },
      { question: 'How many practice mocks should I take?', answer: 'We recommend taking at least 10 to 12 full-length timed CBT mocks and reviewing every mistake thoroughly.' },
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
    content: `<h2 id="milan-bologna">1. University of Milan & Bologna: Clinical Excellence</h2>
<p>University of Milan (La Statale) and University of Bologna consistently rank highest in academic reputation and research output, with world-class teaching hospital networks.</p>

<h2 id="rome-pavia">2. Rome La Sapienza & Pavia: Historic Prestige</h2>
<p>Rome La Sapienza offers extensive international community ties, while University of Pavia provides a collegiate campus environment with rigorous clinical clerkships.</p>

<h2 id="naples-living">3. University of Campania Luigi Vanvitelli: Affordable Living</h2>
<p>Located in the vibrant Campania region, Luigi Vanvitelli offers affordable student accommodations, lower cost of living, and an accredited EU medical diploma.</p>`,
    author: 'Ahsora Research Team',
    featured: false,
    metaTitle: 'Top 5 Italian Medical Schools for International Students',
    metaDescription: 'Compare Milan, Bologna, Rome La Sapienza, Pavia, and Naples cutoffs, tuition fees, hospital clinical rotations, and English medical degrees.',
    faqItems: [
      { question: 'Are Italian medical degrees recognized globally?', answer: 'Yes, English-taught Italian MD degrees (LM-41) are fully recognized across the EU, UK GMC, and US ECFMG.' },
      { question: 'What is the tuition fee for public medical schools in Italy?', answer: 'Tuition ranges from €156 to €4,000 per year based on family income (ISEE), with regional scholarships available.' },
    ],
  },
  {
    id: 'news-4',
    title: 'The 12-Week IMAT Study Plan That Gets Results',
    slug: '12-week-imat-study-plan',
    category: 'Study Plan',
    date: 'Aug 15, 2026',
    readTime: '5 min read',
    excerpt: 'Starting from scratch with 12 weeks to go? Our evidence-based study schedule — used by 3,500+ Ahsora students — breaks down exactly what to study each week, how many practice questions to tackle, and when to do mock tests.',
    content: `<h2 id="phase-1">Phase 1 (Weeks 1–4): Core High-Yield Concepts</h2>
<p>Master the high-yield Biology and Chemistry syllabus foundations. Dedicate 4 hours daily to active recall and summary notes.</p>

<h2 id="phase-2">Phase 2 (Weeks 5–8): Intensive Question Bank Practice</h2>
<p>Solve at least 50 MCQs daily, logging conceptual errors into an active mistakes notebook. Begin weekly past papers.</p>

<h2 id="phase-3">Phase 3 (Weeks 9–12): Timed CBT Simulations & Exam Polishing</h2>
<p>Simulate full 90-minute examination conditions with realistic computer-based tests and refine negative marking management.</p>`,
    author: 'Ahsora Academic Team',
    featured: false,
    metaTitle: '12-Week High-Yield IMAT Study Schedule | Ahsora Meds',
    metaDescription: 'Evidence-based 12-week IMAT preparation schedule covering active recall, topic-wise MCQ banks, formula sheets, and full-length CBT simulation mocks.',
    faqItems: [
      { question: 'Is 12 weeks enough to prepare for the IMAT?', answer: 'Yes, with a focused daily routine of 4 to 6 hours focusing on high-yield Biology, Chemistry, and regular CBT mocks.' },
    ],
  },
  {
    id: 'news-5',
    title: 'After IMAT: Your Global Licensing Options as an Italian Medical Graduate',
    slug: 'after-imat-global-licensing',
    category: 'Licensing',
    date: 'Aug 8, 2026',
    readTime: '7 min read',
    excerpt: 'Graduating from an Italian medical university opens doors worldwide. We walk through how to proceed to PLAB (UK), USMLE (USA), AMC (Australia), and FMGE (India) after completing your Italian medical degree.',
    content: `<h2 id="eu-direct-practice">1. Direct Practicing Rights in the European Union</h2>
<p>Under EU Directive 2005/36/EC, medical qualifications awarded by Italian universities (Laurea Magistrale in Medicina e Chirurgia, LM-41) are automatically recognized across all 27 EU member states without additional licensing exams.</p>

<h2 id="usmle-usa">2. United States Medical Licensing (USMLE Step 1 & 2)</h2>
<p>Italian public medical schools are accredited by WFME and recognized in the World Directory of Medical Schools (WDOMS), enabling graduates to sit the USMLE Step 1, Step 2 CK, and participate in the NRMP Match.</p>

<h2 id="uk-gmc">3. United Kingdom GMC Registration (PLAB / UKMLA)</h2>
<p>Graduates can apply for registration with a license to practice with the General Medical Council (GMC) via the PLAB/UKMLA route.</p>`,
    author: 'Dr. Tariq Al-Hassan',
    featured: false,
    metaTitle: 'Global Licensing After IMAT: USMLE, PLAB & EU Guide',
    metaDescription: 'Complete roadmap for practicing medicine globally after graduating from Italian medical schools, including USMLE Step 1 & 2, PLAB/UKMLA, and EU mobility.',
    faqItems: [
      { question: 'Can Italian medical graduates take the USMLE?', answer: 'Yes, Italian medical schools are listed in the World Directory of Medical Schools (WDOMS) and are ECFMG eligible.' },
    ],
  },
  {
    id: 'news-6',
    title: 'Student Visa Guide for Italy 2027: Everything You Need to Know',
    slug: 'student-visa-guide-italy-2027',
    category: 'Visa & Living',
    date: 'Jul 30, 2026',
    readTime: '5 min read',
    excerpt: 'Applying for a Type D student visa for Italy? We cover the complete application process, document checklist, income thresholds, and embassy interview tips for Pakistani, Egyptian, and South Asian applicants.',
    content: `<h2 id="visa-overview">1. Italy National Visa Type-D (Study)</h2>
<p>Non-EU students accepted into Italian universities must obtain a Type-D Long Stay National Study Visa before entering Italy.</p>

<h2 id="financial-proof">2. Financial Means of Subsistence (€6,000+ per year)</h2>
<p>The Italian Ministry requires demonstration of adequate financial resources, with proof of at least €6,000 per academic year via verified sponsor bank statements.</p>

<h2 id="accommodation-health">3. Accommodation Proof & Comprehensive Health Insurance</h2>
<p>Embassy requirements include registered housing or student residence confirmation and valid international travel health coverage.</p>`,
    author: 'Ahsora Visa Team',
    featured: false,
    metaTitle: 'Italy Student Visa 2027: Type-D Application Guide',
    metaDescription: 'Step-by-step Type-D study visa guide for Italy. Bank statement minimums, accommodation proof, codice fiscale, and embassy interview preparation.',
    faqItems: [
      { question: 'What is the minimum bank balance required for an Italian student visa?', answer: 'The Italian Ministry requires proof of at least €6,000 per academic year, though showing €8,000 to €10,000 is strongly recommended.' },
    ],
  },
];

// ── Server-Side Article Fetcher (with Supabase query & fallback) ─────────────
async function getArticleBySlug(slug: string): Promise<NewsItem | null> {
  const cleanSlug = slug.toLowerCase().trim();

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('slug', cleanSlug)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        author: data.author,
        date: data.date,
        readTime: data.read_time,
        imageUrl: data.image_url,
        featured: data.featured,
        metaTitle: data.meta_title || undefined,
        metaDescription: data.meta_description || undefined,
        faqItems: Array.isArray(data.faq_items) ? data.faq_items : undefined,
        indexes: Array.isArray(data.indexes) ? data.indexes : undefined,
      };
    }
  } catch (err) {
    console.warn('Server Supabase fetch fallback to local for slug:', slug);
  }

  // Fallback match
  const matched = SSR_FALLBACK_NEWS.find(
    (n) => n.slug.toLowerCase() === cleanSlug || n.id === cleanSlug
  );

  return matched || null;
}

// ── 1. Next.js Server-Side Metadata (SSR / ISR) ──────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Ahsora Meds Academy',
      description: 'The requested medical admission or IMAT news article could not be located.',
    };
  }

  const cleanTitle = (post.metaTitle || `${post.title} | Ahsora Meds Academy`).slice(0, 60);
  const cleanDescription = (
    post.metaDescription ||
    post.excerpt.replace(/<[^>]*>/g, '').trim()
  ).slice(0, 160);

  const articleUrl = `https://ahsorameds.com/news/${post.slug}`;
  const ogImage = post.imageUrl || 'https://ahsorameds.com/icon.png';

  return {
    title: cleanTitle,
    description: cleanDescription,
    keywords: [
      'IMAT 2027',
      'Italy Medical Entrance',
      'Universitaly',
      'Ahsora Meds Academy',
      post.category,
      post.title,
      'Study Medicine in Italy',
      'Italian Public Universities',
    ],
    authors: [{ name: post.author, url: 'https://ahsorameds.com' }],
    creator: 'Ahsora Meds Academy',
    publisher: 'Ahsora Meds Academy',
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      type: 'article',
      url: articleUrl,
      title: cleanTitle,
      description: cleanDescription,
      siteName: 'Ahsora Meds Academy',
      locale: 'en_US',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanDescription,
      images: [ogImage],
      creator: '@ahsorameds',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ── 2. Server-Rendered Page Component ─────────────────────────────────────────
export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);

  if (!post) {
    notFound();
  }

  const enrichedContent = injectHeadingIds(post.content);
  const articleUrl = `https://ahsorameds.com/news/${post.slug}`;
  const ogImage = post.imageUrl || 'https://ahsorameds.com/icon.png';
  const cleanDescription = (
    post.metaDescription ||
    post.excerpt.replace(/<[^>]*>/g, '').trim()
  ).slice(0, 160);

  // ── JSON-LD Schema Markup Definitions (Strict Server-Rendered) ──────────────
  // 1. Article / BlogPosting Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: (post.metaTitle || post.title).slice(0, 110),
    description: cleanDescription,
    image: [ogImage],
    datePublished: '2026-09-02T08:00:00+02:00',
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://ahsorameds.com/about',
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'Ahsora Meds Academy',
      url: 'https://ahsorameds.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ahsorameds.com/icon.png',
      },
    },
    inLanguage: 'en-US',
    keywords: `IMAT, Italian Medical Universities, Medicine in Italy, ${post.category}, Ahsora Meds`,
  };

  // 2. Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Ahsora Meds Academy',
    url: 'https://ahsorameds.com',
    logo: 'https://ahsorameds.com/icon.png',
    description:
      'Premier preparatory institute and admissions agency for English-taught public medical universities across Italy and the IMAT examination.',
    telephone: '+39 333 3444 479',
    email: 'admissions@ahsorameds.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Milan',
      addressCountry: 'Italy',
    },
    sameAs: [
      'https://instagram.com/ahsora.meds',
      'https://wa.me/393333444479',
    ],
  };

  // 3. FAQPage Schema (for Google Rich Snippets & GPTBot Q&A ingestion)
  const faqList = post.faqItems || [
    {
      question: `What are the key requirements for ${post.title}?`,
      answer:
        'Candidates require a valid secondary school diploma with 12 years of education, English proficiency, and an official IMAT test sitting.',
    },
    {
      question: 'How can Ahsora Meds Academy help with this process?',
      answer:
        'Ahsora provides full CBT exam simulations, verified question banks, live doctor mentorship, Universitaly pre-enrollment assistance, and student visa filing.',
    },
  ];

  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // 4. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ahsorameds.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'News & Guides',
        item: 'https://ahsorameds.com/news',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  // Other related posts
  const otherPosts = SSR_FALLBACK_NEWS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      {/* ── RAW SERVER-RENDERED JSON-LD STRUCTURED DATA IN HEAD ──────────────── */}
      {/* These script tags are present in raw HTML payload for GPTBot & crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
        {/* Header Breadcrumb Banner */}
        <section
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0F172A 100%)',
            color: '#FFFFFF',
            padding: '110px 20px 48px',
            borderBottom: '1px solid #1E293B',
          }}
        >
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            {/* Breadcrumb nav */}
            <nav
              aria-label="Breadcrumb"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8125rem',
                color: '#94A3B8',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              <Link href="/" style={{ color: '#A7F3D0', textDecoration: 'none', fontWeight: 600 }}>
                Home
              </Link>
              <ChevronRight size={14} color="#64748B" />
              <Link href="/news" style={{ color: '#A7F3D0', textDecoration: 'none', fontWeight: 600 }}>
                News &amp; Guides
              </Link>
              <ChevronRight size={14} color="#64748B" />
              <span style={{ color: '#E2E8F0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                {post.category}
              </span>
            </nav>

            {/* Category badge & meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span
                style={{
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                {post.category}
              </span>
              <span style={{ color: '#CBD5E1', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#34D399" /> {post.date}
              </span>
              <span style={{ color: '#CBD5E1', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#34D399" /> {post.readTime}
              </span>
            </div>

            {/* Main H1 Title */}
            <h1
              style={{
                fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.2,
                margin: '0 0 20px 0',
                letterSpacing: '-0.5px',
              }}
            >
              {post.title}
            </h1>

            {/* Author bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                  }}
                >
                  <User size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>{post.author}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Ahsora Academic Medical Advisory</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArticleShareBar title={post.title} url={articleUrl} variant="header" />
              </div>
            </div>
          </div>
        </section>

        {/* Main Article Body Container */}
        <main style={{ maxWidth: '960px', margin: '-24px auto 0', padding: '0 20px', position: 'relative', zIndex: 10 }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '36px 40px',
              boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px #E2E8F0',
            }}
          >
            {/* Lead Excerpt Callout */}
            <div
              style={{
                backgroundColor: '#ECFDF5',
                borderLeft: '4px solid #059669',
                padding: '20px 24px',
                borderRadius: '0 12px 12px 0',
                marginBottom: '32px',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: '#064E3B',
                fontWeight: 500,
              }}
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />

            {/* SEO Quick Facts Sheet for AI bots & readers */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Target Exam / Field</span>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem', marginTop: '2px' }}>IMAT (Medicine &amp; Surgery)</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Jurisdiction</span>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem', marginTop: '2px' }}>Italy / MUR Ministry</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Degree Code</span>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem', marginTop: '2px' }}>LM-41 (EU Accredited MD)</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Authoritative Verification</span>
                <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.9rem', marginTop: '2px' }}>Ahsora Academic Panel ✓</div>
              </div>
            </div>

            {/* Table of Contents / Article Index */}
            <ArticleTableOfContents indexes={post.indexes} htmlContent={enrichedContent} />

            {/* Article Content */}
            <article
              className="prose-article"
              style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: '#334155',
              }}
              dangerouslySetInnerHTML={{ __html: enrichedContent }}
            />

            {/* Bottom Multi-Platform Social Virality Share Card */}
            <ArticleShareBar title={post.title} url={articleUrl} variant="footer" />

            {/* Dynamic Q&A / FAQ Section with FAQPage Schema */}
            {faqList.length > 0 && (
              <section style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <HelpCircle size={22} color="#059669" />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Frequently Asked Questions (Q&amp;A)
                  </h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {faqList.map((faq, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '18px 22px',
                      }}
                    >
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                        {faq.question}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Author Bio Box */}
            <div
              style={{
                marginTop: '48px',
                padding: '24px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  flexShrink: 0,
                }}
              >
                AM
              </div>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  PUBLISHED BY
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{post.author}</div>
                <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                  Ahsora Meds Academy mentors students globally for the Italian IMAT medical examination, Universitaly pre-enrollment legalizations, and full residency transitions.
                </p>
              </div>
              <Link
                href="/courses"
                style={{
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                View Prep Courses <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Related Articles Section */}
          <div style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Related News &amp; Exam Updates
              </h3>
              <Link href="/news" style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All News &rarr;
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {otherPosts.map((other) => (
                <Link
                  key={other.id}
                  href={`/news/${other.slug}`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid #E2E8F0',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    <span
                      style={{
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'inline-block',
                        marginBottom: '10px',
                      }}
                    >
                      {other.category}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.35, margin: '0 0 8px 0' }}>
                      {other.title}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                      {other.excerpt.slice(0, 110)}...
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', color: '#94A3B8' }}>
                    <span>{other.date}</span>
                    <span style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Read Guide &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
