'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Banknote,
  Building,
  Globe,
  Award,
  Users,
  Heart,
  Compass,
  Check,
  BookmarkPlus,
  BookmarkCheck,
  BarChart3,
  Info,
  ExternalLink,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { mockUniversities } from '@/lib/mock-data';

// ─── Types ─────────────────────────────────────────────────────
type University = (typeof mockUniversities)[0];

interface CutoffRecord {
  university: string;
  seats: number;
  seatsLeft: string;
  round1Cutoff: string;
  finalCutoff: string;
}

// ─── Static Data ────────────────────────────────────────────────
const cutoffData: Record<string, Record<string, CutoffRecord[]>> = {
  EU: {
    '2024': [
      { university: 'University of Milan (La Statale)', seats: 100, seatsLeft: '12', round1Cutoff: '84.7', finalCutoff: '78.2' },
      { university: 'Sapienza University of Rome', seats: 90, seatsLeft: '—', round1Cutoff: '79.3', finalCutoff: '72.1' },
      { university: 'University of Bologna', seats: 60, seatsLeft: '8', round1Cutoff: '76.4', finalCutoff: '70.5' },
      { university: 'University of Pavia', seats: 50, seatsLeft: '5', round1Cutoff: 'Not published', finalCutoff: '68.3' },
    ],
    '2023': [
      { university: 'University of Milan (La Statale)', seats: 100, seatsLeft: '9', round1Cutoff: '82.1', finalCutoff: '75.9' },
      { university: 'Sapienza University of Rome', seats: 90, seatsLeft: '—', round1Cutoff: '77.6', finalCutoff: '70.3' },
      { university: 'University of Bologna', seats: 60, seatsLeft: '11', round1Cutoff: '74.2', finalCutoff: '68.0' },
      { university: 'University of Pavia', seats: 50, seatsLeft: '3', round1Cutoff: 'Not published', finalCutoff: '65.7' },
    ],
    '2022': [
      { university: 'University of Milan (La Statale)', seats: 95, seatsLeft: '14', round1Cutoff: '79.8', finalCutoff: '73.4' },
      { university: 'Sapienza University of Rome', seats: 88, seatsLeft: '—', round1Cutoff: '75.0', finalCutoff: '68.5' },
      { university: 'University of Bologna', seats: 55, seatsLeft: '7', round1Cutoff: '71.6', finalCutoff: '65.2' },
      { university: 'University of Pavia', seats: 48, seatsLeft: '6', round1Cutoff: 'Not published', finalCutoff: '62.1' },
    ],
  },
  'Non-EU': {
    '2024': [
      { university: 'University of Milan (La Statale)', seats: 65, seatsLeft: '4', round1Cutoff: '88.2', finalCutoff: '82.5' },
      { university: 'Sapienza University of Rome', seats: 55, seatsLeft: '—', round1Cutoff: '84.0', finalCutoff: '76.8' },
      { university: 'University of Bologna', seats: 40, seatsLeft: '2', round1Cutoff: '80.1', finalCutoff: '74.3' },
      { university: 'University of Pavia', seats: 35, seatsLeft: '1', round1Cutoff: 'Not published', finalCutoff: '71.0' },
    ],
    '2023': [
      { university: 'University of Milan (La Statale)', seats: 65, seatsLeft: '6', round1Cutoff: '85.9', finalCutoff: '79.7' },
      { university: 'Sapienza University of Rome', seats: 55, seatsLeft: '—', round1Cutoff: '81.3', finalCutoff: '74.2' },
      { university: 'University of Bologna', seats: 40, seatsLeft: '3', round1Cutoff: '77.5', finalCutoff: '71.8' },
      { university: 'University of Pavia', seats: 35, seatsLeft: '2', round1Cutoff: 'Not published', finalCutoff: '68.4' },
    ],
    '2022': [
      { university: 'University of Milan (La Statale)', seats: 60, seatsLeft: '8', round1Cutoff: '83.1', finalCutoff: '77.0' },
      { university: 'Sapienza University of Rome', seats: 52, seatsLeft: '—', round1Cutoff: '78.6', finalCutoff: '72.1' },
      { university: 'University of Bologna', seats: 38, seatsLeft: '4', round1Cutoff: '75.2', finalCutoff: '69.0' },
      { university: 'University of Pavia', seats: 32, seatsLeft: '—', round1Cutoff: 'Not published', finalCutoff: '65.8' },
    ],
  },
};

const cityProfiles = [
  { city: 'Milan', emoji: '🏙️', tag: 'Large International City', desc: 'Higher housing costs, world-class transport network, major financial & fashion hub', budget: '€900–€1,300/mo', cost: 'Higher' },
  { city: 'Rome', emoji: '🏛️', tag: 'National Capital', desc: 'Large student population, rich history, varied housing options across districts', budget: '€850–€1,200/mo', cost: 'Higher' },
  { city: 'Bologna', emoji: '🍝', tag: 'University City', desc: "One of Europe's oldest universities, student-oriented culture, good affordability", budget: '€750–€1,050/mo', cost: 'Moderate' },
  { city: 'Pavia', emoji: '🏘️', tag: 'Compact University City', desc: 'Intimate university town, historically student-oriented, meaningfully lower costs', budget: '€650–€900/mo', cost: 'Lower' },
  { city: 'Messina', emoji: '☀️', tag: 'Southern University City', desc: 'Mediterranean setting, very affordable living, close-knit student community', budget: '€500–€750/mo', cost: 'Lower' },
  { city: 'Padua', emoji: '📚', tag: 'Historic University City', desc: 'Second-oldest university in the world, strong academic tradition, moderate costs', budget: '€700–€950/mo', cost: 'Moderate' },
];

const decisionFactors = [
  { icon: '🌍', title: 'Admission Route', desc: 'Can you realistically apply through this route — IMAT or university-specific test?' },
  { icon: '💰', title: 'Budget', desc: 'What can you and your family realistically sustain over six years of study?' },
  { icon: '📍', title: 'City', desc: 'Where would you actually want to live during your degree? Size and setting matter.' },
  { icon: '🏆', title: 'Scholarships', desc: 'What funding could genuinely apply to your situation — regional, national, or institutional?' },
  { icon: '🏥', title: 'Clinical Environment', desc: 'Teaching hospital size and setting vary significantly between institutions.' },
  { icon: '❤️', title: 'Lifestyle', desc: 'Large international city, or a smaller, closer-knit university town that suits you better?' },
];

const faqItems = [
  { q: 'How many English-taught Medicine universities are there in Italy?', a: 'As of the most recent verified data, around 15–20 Italian universities offer English-taught Medicine and Surgery programmes — a mix of public (IMAT-route) and private (institution-specific route). This number changes year to year as universities open or modify their English-taught offerings, so always verify directly with each institution and via Universitaly.it for the current cycle.' },
  { q: 'Which universities use the IMAT?', a: 'Public Italian universities that offer English-taught Medicine & Surgery use the IMAT (International Medical Admissions Test) as part of the national admissions process coordinated by the Italian Ministry of Universities and Research (MUR). The exact list of participating universities is confirmed annually — check Universitaly.it each year for the official updated list.' },
  { q: 'Do all Medicine programmes in Italy use the IMAT?', a: 'No. Public universities generally use the IMAT (or the applicable national route for that academic year), while private universities run their own admission procedures and selection tests, which are separate from the IMAT. Routes and requirements can change year to year, so verify directly with each institution.' },
  { q: "What's the difference between public and private medical universities?", a: "Public universities use a national admissions route (typically the IMAT), have income-scaled tuition (via Italy's ISEE system), and seats split between EU and non-EU pools. Private universities run their own admission tests, charge fixed published tuition, and have institution-specific scholarship schemes. Neither type is automatically better — it depends on your budget, admission strategy, and preferences." },
  { q: 'How much does Medicine cost in Italy?', a: "At public universities, tuition is scaled to your family's financial situation using Italy's ISEE system — so two students at the same university can pay very different amounts, from near-zero for low-income families to around €3,000–€4,000/year maximum. Private university tuition is typically a fixed annual figure, often in the €15,000–€25,000+ range. Neither figure includes cost of living, which varies significantly by city." },
  { q: 'Does meeting a past cutoff guarantee my admission?', a: "No. Cutoffs are historical results, not guarantees — seat numbers, applicant pools, and cutoffs can all shift year to year. We don't offer a tool that predicts your personal chances at a specific university, because that variability makes any such prediction unreliable. Use historical cutoffs to understand a university's general competitiveness, not to predict your own outcome." },
  { q: 'Can international students apply for scholarships?', a: 'Yes. Non-EU international students can generally apply for Italian regional scholarships (like DSU/ER.GO), which are income-assessed. Some require an equivalent income declaration (ISEE Parificato) assessed abroad. Individual private universities also offer their own scholarship schemes. Always verify eligibility directly with the institution and the relevant regional authority.' },
  { q: 'Which cities are more affordable for students?', a: "Southern cities like Messina are generally the most affordable (€500–€750/month estimated budget). Mid-size university cities like Pavia and Ferrara are meaningfully cheaper than major capitals. Milan and Rome carry the highest housing costs. These are Ahsora's general planning estimates — not official figures." },
  { q: 'How do EU and non-EU seats differ?', a: 'At public Italian universities, seats in English-taught Medicine programmes are split into separate EU and non-EU pools, each with its own merit ranking based on IMAT scores. This means EU and non-EU applicants compete separately, and the cutoffs for each pool can differ substantially.' },
  { q: 'Can Ahsora help me choose a university?', a: "Yes. MedPath Elite, Ahsora's admissions guidance service, can support you through the decision and application process regardless of whether you're targeting a public (IMAT-route) or private institution. The university cards above include a 'Get Guidance' link — that's where to start." },
];

// ─── Intersection Observer Hook ────────────────────────────────
function useScrollVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Animated Section Wrapper ──────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollVisible();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function UniversitiesPage() {
  // Filter state
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterRoute, setFilterRoute] = useState<string[]>([]);
  const [filterBudget, setFilterBudget] = useState<string[]>([]);
  const [filterRegion, setFilterRegion] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Relevance');
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Cutoff state
  const [cutoffPool, setCutoffPool] = useState<'EU' | 'Non-EU'>('EU');
  const [cutoffYear, setCutoffYear] = useState('2024');

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleShortlist = useCallback((id: string) => {
    setShortlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const activeFilters: { label: string; clear: () => void }[] = [
    ...filterType.map(v => ({ label: v, clear: () => setFilterType(p => p.filter(x => x !== v)) })),
    ...filterRoute.map(v => ({ label: v, clear: () => setFilterRoute(p => p.filter(x => x !== v)) })),
    ...filterBudget.map(v => ({ label: `Budget: ${v}`, clear: () => setFilterBudget(p => p.filter(x => x !== v)) })),
    ...filterRegion.map(v => ({ label: v, clear: () => setFilterRegion(p => p.filter(x => x !== v)) })),
  ];

  const clearAllFilters = () => {
    setFilterType([]); setFilterRoute([]); setFilterBudget([]); setFilterRegion([]);
  };

  const filteredUnis = useMemo(() => {
    let results = mockUniversities.filter(u => {
      const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.city.toLowerCase().includes(search.toLowerCase());
      const isPublic = u.tuitionFeeAnnual < 5000;
      const matchType = filterType.length === 0 || (filterType.includes('Public') && isPublic) || (filterType.includes('Private') && !isPublic);
      const route = isPublic ? 'IMAT' : 'University-specific';
      const matchRoute = filterRoute.length === 0 || filterRoute.includes(route);
      const budgetTier = u.tuitionFeeAnnual < 3000 ? 'Lower' : u.tuitionFeeAnnual < 10000 ? 'Moderate' : 'Higher';
      const matchBudget = filterBudget.length === 0 || filterBudget.includes(budgetTier);
      const regionMap: Record<string, string> = { Milan: 'North', Bologna: 'North', Pavia: 'North', Venice: 'North', Rome: 'Central', Florence: 'Central', Messina: 'South & Islands', Palermo: 'South & Islands' };
      const region = regionMap[u.city] || 'North';
      const matchRegion = filterRegion.length === 0 || filterRegion.includes(region);
      return matchSearch && matchType && matchRoute && matchBudget && matchRegion;
    });

    if (sortBy === 'University Name') results = [...results].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'City') results = [...results].sort((a, b) => a.city.localeCompare(b.city));
    else if (sortBy === 'Tuition') results = [...results].sort((a, b) => a.tuitionFeeAnnual - b.tuitionFeeAnnual);
    else if (sortBy === 'Seats') results = [...results].sort((a, b) => b.admissionRatePercent - a.admissionRatePercent);

    return results;
  }, [search, filterType, filterRoute, filterBudget, filterRegion, sortBy]);

  const compareUnis = mockUniversities.filter(u => compareList.includes(u.id));

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── 01 HERO ───────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f2d1a 100%)', padding: '176px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,237,115,0.12) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,237,115,0.08) 0%, transparent 70%)' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(92,237,115,0.15)', border: '1px solid rgba(92,237,115,0.3)', borderRadius: '999px', padding: '6px 14px', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#5CED73', letterSpacing: '0.05em', textTransform: 'uppercase' }}>🧭 Medicine in Italy</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
              Find the Medical University<br />
              <span style={{ color: '#5CED73' }}>That Fits Your Journey.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: '36px', maxWidth: '600px' }}>
              Explore English-taught Medicine programmes across Italy — public and private, admission routes, tuition, seats and historical cutoffs. Filter by what matters to you, then build your shortlist.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a href="#find-university" className="btn-primary" style={{ fontSize: '0.9375rem' }}>
                🔍 Find Your University
              </a>
              <a href="#map-section" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '999px', padding: '12px 24px', fontWeight: 600, fontSize: '0.9375rem', transition: 'all 0.2s ease' }}>
                📍 Browse the Map
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 PUBLIC vs PRIVATE ──────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#fafcfa' }}>
        <div className="container">
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: '12px' }}>
              Not Every Medical University in Italy Works the Same Way.
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', maxWidth: '580px', margin: '0 auto 44px' }}>
              Understanding the distinction before you explore is essential.
            </p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
            {[
              {
                label: 'Public Universities',
                color: '#059669',
                bg: 'linear-gradient(135deg, #f0fff4, #dcfce7)',
                border: '#bbf7d0',
                points: [
                  'Many programmes use the IMAT, or the applicable national route for that academic year',
                  'Merit-ranked, seats generally split into EU and non-EU pools',
                  "Tuition scaled to family income via Italy's ISEE system",
                  'Regional scholarships widely available — can reach full tuition waiver + living stipend',
                ],
              },
              {
                label: 'Private Universities',
                color: '#7c3aed',
                bg: 'linear-gradient(135deg, #faf5ff, #ede9fe)',
                border: '#c4b5fd',
                points: [
                  'Generally run their own admission procedures and selection tests',
                  'Separate from the IMAT — route varies by institution and academic year',
                  'Tuition generally fixed and published upfront',
                  'Scholarships set by the individual university rather than a national system',
                ],
              },
            ].map((card, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div style={{ background: card.bg, border: `1.5px solid ${card.border}`, borderRadius: '20px', padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      {i === 0 ? '🏛️' : '🏢'}
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{card.label}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {card.points.map((pt, j) => (
                      <li key={j} style={{ display: 'flex', gap: '10px', color: '#334155', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                        <span style={{ color: card.color, flexShrink: 0, marginTop: '2px' }}>✓</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={160}>
            <p style={{ textAlign: 'center', marginTop: '28px', color: '#475569', fontStyle: 'italic', fontSize: '0.9375rem' }}>
              "Neither is automatically better — the right path depends on your budget, admission strategy, and preferences."
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 03 HOW TO CHOOSE ──────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: '10px' }}>
              There&apos;s No Single &ldquo;Best&rdquo; Medical University.
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', maxWidth: '600px', margin: '0 auto 44px', lineHeight: 1.6 }}>
              The right university fits your admission route, budget, city preference, scholarship situation, and long-term plans — not a ranking.
            </p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' }}>
            {decisionFactors.map((f, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px 20px', transition: 'all 0.2s ease', cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#5CED73'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(92,237,115,0.18)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '14px' }}>{f.icon}</div>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem', marginBottom: '8px' }}>{f.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={200}>
            <div style={{ marginTop: '32px', background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '1px solid #fde68a', borderRadius: '14px', padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '1px' }}>⚠️</span>
              <div>
                <strong style={{ color: '#92400e', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Reading Cutoffs Correctly</strong>
                <p style={{ color: '#78350f', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                  A cutoff score is a historical result, not a target you can hit with certainty — seats, applicant numbers, and cutoffs shift every year. Use historical cutoffs (Section below) to understand a university&apos;s general competitiveness, not to predict your own outcome.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 04 FIND YOUR UNIVERSITY ───────────────────────────── */}
      <section id="find-university" style={{ padding: '80px 0', background: 'linear-gradient(180deg, #fafcfa 0%, #fff 100%)' }}>
        <div className="container">
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              What Are You Looking For?
            </h2>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>Filter universities by what actually matters to your decision — no score required.</p>
          </FadeUp>

          {/* Search bar */}
          <FadeUp delay={80}>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '1.1rem' }}>🔍</span>
              <input
                type="text"
                placeholder="Search by university or city — Milan, Pavia, Messina, Rome..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 48px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9375rem', fontFamily: 'inherit', color: '#0f172a', background: '#fff', outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#059669'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </FadeUp>

          {/* Filter toggle */}
          <FadeUp delay={120}>
            <button
              onClick={() => setFiltersOpen(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: filtersOpen ? '#059669' : '#f1f5f9', color: filtersOpen ? '#fff' : '#334155', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '16px' }}
            >
              ⚙️ Filters
              {activeFilters.length > 0 && (
                <span style={{ background: filtersOpen ? 'rgba(255,255,255,0.25)' : '#059669', color: '#fff', borderRadius: '999px', padding: '1px 8px', fontSize: '0.75rem', marginLeft: '4px' }}>{activeFilters.length}</span>
              )}
              {filtersOpen ? '▲' : '▼'}
            </button>
          </FadeUp>

          {/* Filter panel */}
          {filtersOpen && (
            <FadeUp>
              <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '20px' }}>
                {[
                  { label: 'Admission Route', opts: ['IMAT', 'University-specific'], val: filterRoute, set: setFilterRoute },
                  { label: 'Type', opts: ['Public', 'Private'], val: filterType, set: setFilterType },
                  { label: 'Tuition Budget', opts: ['Lower', 'Moderate', 'Higher'], val: filterBudget, set: setFilterBudget },
                  { label: 'Region', opts: ['North', 'Central', 'South & Islands'], val: filterRegion, set: setFilterRegion },
                ].map((f, fi) => (
                  <div key={fi}>
                    <p style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>{f.label}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {f.opts.map(opt => {
                        const active = f.val.includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => f.set((p: string[]) => active ? p.filter((x: string) => x !== opt) : [...p, opt])}
                            style={{ textAlign: 'left', padding: '7px 12px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: active ? 700 : 500, background: active ? '#f0fff4' : 'transparent', color: active ? '#059669' : '#475569', border: active ? '1px solid #bbf7d0' : '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}
                          >
                            {active ? '✓ ' : ''}{opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          )}

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
              {activeFilters.map((f, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fff4', color: '#059669', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '5px 12px', fontSize: '0.8125rem', fontWeight: 600 }}>
                  {f.label}
                  <button onClick={f.clear} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: '#059669', fontSize: '0.875rem' }}>×</button>
                </span>
              ))}
              <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', padding: '4px 8px' }}>
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 05 MAP EXPLORER ───────────────────────────────────── */}
      <section id="map-section" style={{ padding: '0 0 40px', background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Explore Medicine Across Italy
            </h2>
          </FadeUp>
          <FadeUp delay={80}>
            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', borderRadius: '20px', overflow: 'hidden', position: 'relative', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', zIndex: 1, padding: '20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗺️</div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>Interactive Map — Coming Soon</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', maxWidth: '400px' }}>
                  One pin per university, two-way linked with the results grid. Click a pin to see details. Hover a card to highlight its pin on the map.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
                  {['🟢 Public (IMAT)', '🟣 Private (Own Test)'].map(l => (
                    <span key={l} style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', padding: '5px 14px', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 600 }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 06 RESULTS & SHORTLIST ────────────────────────────── */}
      <section style={{ padding: '20px 0 80px', background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              <p style={{ color: '#475569', fontWeight: 600, fontSize: '0.9375rem' }}>
                <span style={{ color: '#0f172a', fontWeight: 800 }}>{filteredUnis.length}</span> medical programme{filteredUnis.length !== 1 ? 's' : ''} match your preferences
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Sort by:</span>
                {['Relevance', 'University Name', 'City', 'Tuition', 'Seats'].map(s => (
                  <button key={s} onClick={() => setSortBy(s)} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, background: sortBy === s ? '#059669' : '#f1f5f9', color: sortBy === s ? '#fff' : '#475569', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* University cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
            {filteredUnis.map((uni, i) => {
              const isPublic = uni.tuitionFeeAnnual < 5000;
              const route = isPublic ? 'IMAT' : 'University-specific';
              const inShortlist = shortlist.includes(uni.id);
              const inCompare = compareList.includes(uni.id);
              const budgetTier = uni.tuitionFeeAnnual < 3000 ? 'Lower' : uni.tuitionFeeAnnual < 10000 ? 'Moderate' : 'Higher';
              const bestFor = isPublic
                ? `Students targeting a public English-taught programme via IMAT in ${uni.city}.`
                : 'Students looking for a structured private admissions route with fixed, published tuition.';
              return (
                <FadeUp key={uni.id} delay={Math.min(i * 60, 360)}>
                  <div
                    style={{ background: '#fff', border: inCompare ? '2px solid #059669' : '1.5px solid #e2e8f0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)', display: 'flex', flexDirection: 'column' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                  >
                    {/* Image */}
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <img src={uni.imageUrl} alt={uni.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 60%)' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                        <span style={{ background: isPublic ? 'rgba(5,150,105,0.9)' : 'rgba(124,58,237,0.9)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{isPublic ? 'Public' : 'Private'}</span>
                        <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid rgba(255,255,255,0.3)' }}>{route}</span>
                      </div>
                      <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8125rem', fontWeight: 600 }}>📍 {uni.city}, {uni.country}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', lineHeight: 1.3 }}>{uni.name}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '14px' }}>Medicine &amp; Surgery · 6 years · English-taught</p>

                      {/* Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                        {[
                          { label: 'Annual Tuition', value: `${uni.currency === 'EUR' ? '€' : '$'}${uni.tuitionFeeAnnual.toLocaleString()}/yr`, green: false },
                          { label: 'Budget Tier', value: budgetTier, green: true },
                          { label: 'Admission Rate', value: `~${uni.admissionRatePercent}%`, green: false },
                          { label: 'Last Verified', value: uni.lastVerifiedAt, green: false },
                        ].map(stat => (
                          <div key={stat.label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px 12px', border: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>{stat.label}</p>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: stat.green ? '#059669' : '#0f172a' }}>{stat.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Best For */}
                      <div style={{ background: 'linear-gradient(135deg, #f0fff4, #dcfce7)', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>Best For</p>
                        <p style={{ fontSize: '0.8125rem', color: '#14532d', lineHeight: 1.5 }}>{bestFor}</p>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                        <Link
                          href={`/universities/${uni.id}`}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', fontWeight: 600, fontSize: '0.8125rem', border: '1.5px solid #e2e8f0', color: '#334155', transition: 'all 0.2s', textDecoration: 'none' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#bbf7d0'; (e.currentTarget as HTMLAnchorElement).style.background = '#f0fff4'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                        >
                          🔗 View Profile
                        </Link>
                        <button
                          onClick={() => toggleShortlist(uni.id)}
                          title={inShortlist ? 'Remove from Shortlist' : 'Add to Shortlist'}
                          style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid', borderColor: inShortlist ? '#bbf7d0' : '#e2e8f0', background: inShortlist ? '#f0fff4' : 'transparent', color: inShortlist ? '#059669' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', fontSize: '1rem' }}
                        >
                          {inShortlist ? '🔖' : '➕'}
                        </button>
                        <button
                          onClick={() => toggleCompare(uni.id)}
                          title={inCompare ? 'Remove from Compare' : 'Add to Compare (max 4)'}
                          style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid', borderColor: inCompare ? '#bbf7d0' : '#e2e8f0', background: inCompare ? '#059669' : 'transparent', color: inCompare ? '#fff' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', fontSize: '1rem' }}
                        >
                          📊
                        </button>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>

          {filteredUnis.length === 0 && (
            <FadeUp>
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#475569', marginBottom: '6px' }}>No results match your current filters</p>
                <p style={{ fontSize: '0.875rem' }}>Try adjusting or clearing your filters to see all universities.</p>
                <button onClick={clearAllFilters} style={{ marginTop: '16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Clear All Filters
                </button>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* Persistent shortlist bar */}
      {shortlist.length > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', borderRadius: '999px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 50, whiteSpace: 'nowrap', border: '1px solid rgba(92,237,115,0.2)' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            <span style={{ color: '#5CED73', fontWeight: 800 }}>{shortlist.length}</span> universit{shortlist.length === 1 ? 'y' : 'ies'} saved
          </span>
          {compareList.length >= 2 && (
            <button onClick={() => setShowCompare(true)} style={{ background: '#5CED73', color: '#0f172a', border: 'none', borderRadius: '999px', padding: '7px 18px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              Compare ({compareList.length}) →
            </button>
          )}
          <button onClick={() => setShortlist([])} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '2px', fontSize: '1rem' }}>×</button>
        </div>
      )}

      {/* Compare modal */}
      {showCompare && compareUnis.length >= 2 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={e => { if (e.target === e.currentTarget) setShowCompare(false); }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '900px', width: '100%', maxHeight: '85vh', overflow: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>Compare Universities ({compareUnis.length})</h3>
              <button onClick={() => setShowCompare(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>×</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.04em', width: '160px' }}>Field</th>
                    {compareUnis.map(u => (
                      <th key={u.id} style={{ textAlign: 'left', padding: '10px 14px', color: '#0f172a', fontWeight: 700 }}>{u.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { field: 'Type', fn: (u: University) => u.tuitionFeeAnnual < 5000 ? 'Public' : 'Private' },
                    { field: 'Admission Route', fn: (u: University) => u.tuitionFeeAnnual < 5000 ? 'IMAT' : 'University-specific' },
                    { field: 'Location', fn: (u: University) => `${u.city}, ${u.country}` },
                    { field: 'Annual Tuition', fn: (u: University) => `${u.currency === 'EUR' ? '€' : '$'}${u.tuitionFeeAnnual.toLocaleString()}` },
                    { field: 'Admission Rate', fn: (u: University) => `~${u.admissionRatePercent}%` },
                    { field: 'Programme Length', fn: (u: University) => `${u.durationYears} years` },
                    { field: 'Scholarship Availability', fn: (u: University) => u.tuitionFeeAnnual < 5000 ? 'Yes — Regional (DSU/ER.GO) + University' : 'Yes — Institution-specific' },
                    { field: 'Last Verified', fn: (u: University) => u.lastVerifiedAt },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafcfa' }}>
                      <td style={{ padding: '11px 14px', color: '#475569', fontWeight: 600 }}>{row.field}</td>
                      {compareUnis.map(u => (
                        <td key={u.id} style={{ padding: '11px 14px', color: '#0f172a', fontWeight: 500 }}>{row.fn(u)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              {compareUnis.map(u => (
                <Link key={u.id} href={`/universities/${u.id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '10px', background: '#f0fff4', color: '#059669', fontWeight: 600, fontSize: '0.875rem', border: '1px solid #bbf7d0', textDecoration: 'none' }}>
                  View Full Profile: {u.name.split(' ')[0]} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 07 CUTOFF HISTORY ─────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#fafcfa' }}>
        <div className="container">
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              IMAT Cutoff History
            </h2>
            <p style={{ color: '#64748b', marginBottom: '8px', maxWidth: '620px', lineHeight: 1.6 }}>
              Historical reference only — applies to public (IMAT-route) universities. Private universities do not publish comparable national cutoff data.
            </p>
            <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 18px', display: 'flex', gap: '10px', alignItems: 'flex-start', maxWidth: '620px', marginBottom: '28px' }}>
              <span style={{ flexShrink: 0, marginTop: '2px' }}>⚠️</span>
              <p style={{ color: '#78350f', fontSize: '0.8125rem', margin: 0, lineHeight: 1.6 }}>
                <strong>Historical cutoffs are reference points, not guarantees</strong> — competition and seat availability change every year. Source: Universitaly.it official published results. Last verified: August 2026.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
                {(['EU', 'Non-EU'] as const).map(pool => (
                  <button key={pool} onClick={() => setCutoffPool(pool)} style={{ padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', background: cutoffPool === pool ? '#0f172a' : 'transparent', color: cutoffPool === pool ? '#fff' : '#64748b', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {pool}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['2024', '2023', '2022'].map(yr => (
                  <button key={yr} onClick={() => setCutoffYear(yr)} style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', background: cutoffYear === yr ? '#059669' : '#f1f5f9', color: cutoffYear === yr ? '#fff' : '#64748b', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={120}>
            <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: '#fff' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                    {[`University (${cutoffPool} Pool · ${cutoffYear})`, 'Total Seats', 'Seats Left After Round 1', 'Round 1 Cutoff', 'Final Cutoff'].map((h, i) => (
                      <th key={i} style={{ textAlign: i === 0 ? 'left' : 'center', padding: '12px 16px', color: '#475569', fontWeight: 700, fontSize: '0.7875rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cutoffData[cutoffPool]?.[cutoffYear]?.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafcfa' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f0fff4'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? '#fff' : '#fafcfa'}
                    >
                      <td style={{ padding: '13px 16px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{row.university}</td>
                      <td style={{ padding: '13px 16px', textAlign: 'center', color: '#334155' }}>{row.seats}</td>
                      <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                        <span style={{ color: row.seatsLeft === '—' ? '#d97706' : '#334155', fontStyle: row.seatsLeft === '—' ? 'italic' : 'normal' }}>{row.seatsLeft}</span>
                        {row.seatsLeft === '—' && <div style={{ fontSize: '0.7rem', color: '#d97706' }}>Still being assigned via later rounds</div>}
                      </td>
                      <td style={{ padding: '13px 16px', textAlign: 'center', color: row.round1Cutoff === 'Not published' ? '#94a3b8' : '#334155', fontStyle: row.round1Cutoff === 'Not published' ? 'italic' : 'normal' }}>{row.round1Cutoff}</td>
                      <td style={{ padding: '13px 16px', textAlign: 'center', fontWeight: 700, color: '#059669' }}>{row.finalCutoff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '14px', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.8125rem', color: '#64748b' }}>
              <span><strong style={{ color: '#d97706' }}>—</strong> = seats still being assigned through later rounds (a real result, not a data gap)</span>
              <span><em style={{ color: '#94a3b8' }}>Not published</em> = figure not made available by the source (a data-availability gap)</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 08 HOW COSTS WORK ─────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                How Much Does Medicine in Italy Actually Cost?
              </h2>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>Two genuinely different cost systems — explained side by side.</p>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '24px', marginTop: '44px' }}>
            {[
              {
                label: 'Public Universities',
                color: '#059669',
                bg: 'linear-gradient(135deg, #f0fff4, #dcfce7)',
                border: '#bbf7d0',
                points: [
                  "Tuition scaled to family financial situation via Italy's ISEE system",
                  'Two students at the same university can pay very different amounts',
                  'International students assessed using an equivalent income declaration',
                  'Regional scholarships can reduce tuition further or add a living stipend',
                  'Max tuition typically €3,000–€4,000/year; min can approach zero for lowest-income families',
                ],
              },
              {
                label: 'Private Universities',
                color: '#7c3aed',
                bg: 'linear-gradient(135deg, #faf5ff, #ede9fe)',
                border: '#c4b5fd',
                points: [
                  'Tuition is a fixed, published annual figure — known upfront before applying',
                  'Sometimes payable in installments; plus an application fee',
                  'Scholarships set by the individual university rather than a national system',
                  'Typical range: €15,000–€25,000+/year depending on institution',
                  'No income-scaling — same cost for all students regardless of family situation',
                ],
              },
            ].map((card, i) => (
              <FadeUp key={i} delay={i * 100}>
                <div style={{ background: card.bg, border: `1.5px solid ${card.border}`, borderRadius: '20px', padding: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                    <div style={{ fontSize: '1.5rem' }}>{i === 0 ? '🏛️' : '💼'}</div>
                    <span style={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.04em' }}>{card.label}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {card.points.map((pt, j) => (
                      <li key={j} style={{ display: 'flex', gap: '8px', color: '#334155', fontSize: '0.875rem', lineHeight: 1.5 }}>
                        <span style={{ color: card.color, flexShrink: 0, marginTop: '2px' }}>✓</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Illustrative chart */}
          <FadeUp delay={160}>
            <div style={{ marginTop: '36px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>📊 Illustrative: Public University Tuition by ISEE Income Band</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>(General estimate — not exact)</span>
              </div>
              {[
                { label: 'Very Low Income (ISEE < €13,000)', pct: 5, val: '~€0–€300/yr', color: '#059669' },
                { label: 'Low Income (€13,000–€20,000)', pct: 25, val: '~€300–€1,000/yr', color: '#22c55e' },
                { label: 'Middle Income (€20,000–€30,000)', pct: 55, val: '~€1,000–€2,500/yr', color: '#86efac' },
                { label: 'Higher Income (> €30,000)', pct: 85, val: '~€2,500–€4,000/yr', color: '#bbf7d0' },
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#475569' }}>{row.label}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>{row.val}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
              <p style={{ marginTop: '12px', fontSize: '0.8125rem', color: '#94a3b8', fontStyle: 'italic' }}>
                Ahsora&apos;s general illustrative estimate — not a university fee or official figure. Actual ISEE thresholds and amounts vary by institution and academic year.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={200}>
            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <Link href="/scholarships" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#059669', color: '#fff', padding: '13px 28px', borderRadius: '999px', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', boxShadow: '0 4px 18px rgba(5,150,105,0.35)' }}>
                See Full Scholarship Guidance →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 09 COST OF LIVING & CITIES ────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#fafcfa' }}>
        <div className="container">
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              Your University Choice Is Also a City Choice.
            </h2>
            <p style={{ color: '#64748b', marginBottom: '36px', maxWidth: '580px', lineHeight: 1.6 }}>
              Each Italian university city has a different cost of living, atmosphere, and lifestyle. Here&apos;s a snapshot.
            </p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '20px' }}>
            {cityProfiles.map((city, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div
                  style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '22px', transition: 'all 0.2s ease', cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#5CED73'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(92,237,115,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.75rem' }}>{city.emoji}</span>
                    <div>
                      <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', marginBottom: '2px' }}>{city.city}</h3>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{city.tag}</span>
                    </div>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '12px' }}>{city.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669' }}>{city.budget}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: city.cost === 'Lower' ? '#f0fff4' : city.cost === 'Higher' ? '#fef2f2' : '#fffbeb', color: city.cost === 'Lower' ? '#059669' : city.cost === 'Higher' ? '#dc2626' : '#d97706', border: `1px solid ${city.cost === 'Lower' ? '#bbf7d0' : city.cost === 'Higher' ? '#fecaca' : '#fde68a'}` }}>
                      {city.cost} Cost
                    </span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={200}>
            <p style={{ marginTop: '20px', fontSize: '0.8125rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
              Estimated monthly student budgets are Ahsora&apos;s general planning estimates — not university fees or official figures. Actual costs vary by lifestyle and accommodation type.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 10 FAQ ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: '40px' }}>
              Frequently Asked Questions
            </h2>
          </FadeUp>
          <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqItems.map((item, i) => (
              <FadeUp key={i} delay={Math.min(i * 40, 240)}>
                <div style={{ border: '1.5px solid', borderRadius: '14px', borderColor: openFaq === i ? '#bbf7d0' : '#e2e8f0', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', textAlign: 'left', padding: '18px 20px', background: openFaq === i ? '#f0fff4' : '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', transition: 'background 0.2s' }}
                  >
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem', lineHeight: 1.4 }}>{item.q}</span>
                    <span style={{ color: '#059669', flexShrink: 0, fontSize: '1rem' }}>{openFaq === i ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '4px 20px 20px', color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, borderTop: '1px solid #e2e8f0', background: '#fff' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11 FINAL CTA ──────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f2d1a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,237,115,0.1) 0%, transparent 70%)' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <FadeUp>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📚</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '16px', maxWidth: '640px', margin: '0 auto 16px' }}>
              Your University Should Fit Your Journey —<br />
              <span style={{ color: '#5CED73' }}>Not the Other Way Around.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.0625rem', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.6 }}>
              Explore your options, build your shortlist, then get guidance when you&apos;re ready to decide.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#find-university" className="btn-primary" style={{ fontSize: '1rem', padding: '15px 32px' }}>
                🔍 Build My Shortlist
              </a>
              <Link
                href="/courses"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '999px', padding: '15px 32px', fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s ease', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#5CED73'; (e.currentTarget as HTMLAnchorElement).style.color = '#5CED73'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
              >
                Get University Guidance →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}
