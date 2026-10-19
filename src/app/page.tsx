'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  FlaskConical,
  Atom,
  Brain,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  RotateCcw,
  TrendingUp,
  GraduationCap,
  Target,
  Zap,
  Bell,
  Video,
  Users,
  Calendar,
  Clock,
  PlayCircle,
  Star,
  Shield,
  Globe,
  MessageCircle,
  Mic,
  Timer,
  BarChart3,
  ChevronDown,
  Newspaper,
} from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { getTickerItems, syncTickerFromSupabase, TickerItem, getDynamicPackagePrices, syncPricesFromSupabase, DynamicPackagePrice, getNewsPosts, syncNewsFromSupabase, NewsItem, getHomeTickerSpeed, DEFAULT_HOME_TICKER_SPEED } from '@/lib/cms-store';
import { useDynamicPackagePrices } from '@/hooks/useDynamicPackagePrices';

// ─── Reusable section observer wrapper ───────────────────────
function AnimatedSection({
  children,
  className = '',
  style = {},
  animClass = 'scroll-fade-up',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  animClass?: string;
  delay?: number;
}) {
  const ref = useScrollAnimation() as React.RefObject<HTMLDivElement>;
  return (
    <div
      ref={ref}
      className={`${animClass} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Learning Cycle Node ──────────────────────────────────────
function CycleNode({
  icon,
  label,
  sublabel,
  color,
  delay,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: string;
  delay: number;
  isActive: boolean;
}) {
  const ref = useScrollAnimation({ threshold: 0.2 }) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isActive) {
      setTimeout(() => el.classList.add('is-visible'), delay);
    }
  }, [isActive, delay, ref]);

  return (
    <div
      ref={ref}
      className="cycle-node"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        flex: '1 1 110px',
        minWidth: '85px',
        maxWidth: '140px',
      }}
    >
      <div
        style={{
          width: '66px',
          height: '66px',
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 24px -4px ${color}55`,
          border: '3px solid #ffffff',
          outline: `2px solid ${color}33`,
        }}
      >
        {icon}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.82rem', lineHeight: 1.3 }}>
          {label}
        </div>
        <div style={{ fontSize: '0.69rem', color: '#64748B', fontWeight: 500, marginTop: '3px', lineHeight: 1.35 }}>
          {sublabel}
        </div>
      </div>
    </div>
  );
}

// ─── Arrow between cycle nodes ────────────────────────────────
function CycleArrow({ delay }: { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      ref.current?.classList.add('is-visible');
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div
      ref={ref}
      className="cycle-arrow scroll-fade-up"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#059669',
        flexShrink: 0,
      }}
    >
      <ChevronRight size={22} strokeWidth={2.5} className="cycle-arrow-desktop" />
      <ChevronRight size={22} strokeWidth={2.5} style={{ transform: 'rotate(90deg)' }} className="cycle-arrow-mobile" />
    </div>
  );
}

// ─── Animated Live Report Card ────────────────────────────────
function AnimatedLiveReportCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [scores, setScores] = useState({
    bio: 0,
    chem: 0,
    crit: 0,
    phys: 0,
    total: 0,
  });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const targets = { bio: 84, chem: 71, crit: 91, phys: 63, total: 47.4 };
    const duration = 1600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setScores({
        bio: Math.round(targets.bio * ease),
        chem: Math.round(targets.chem * ease),
        crit: Math.round(targets.crit * ease),
        phys: Math.round(targets.phys * ease),
        total: parseFloat((targets.total * ease).toFixed(1)),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible]);

  const bars = [
    { label: 'Biology', targetPct: 84, currentPct: scores.bio, color: '#059669' },
    { label: 'Chemistry', targetPct: 71, currentPct: scores.chem, color: '#D4AF37' },
    { label: 'Critical Thinking', targetPct: 91, currentPct: scores.crit, color: '#059669' },
    { label: 'Physics & Maths', targetPct: 63, currentPct: scores.phys, color: '#F59E0B' },
  ];

  return (
    <div
      ref={cardRef}
      className="img-interactive-hover"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px 22px',
        boxShadow: '0 8px 24px -6px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>Score Breakdown</strong>
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#14532D',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '9999px',
            padding: '3px 10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#059669',
              display: 'inline-block',
              animation: 'pulseGlow 1.5s ease-in-out infinite',
            }}
          />
          LIVE REPORT
        </span>
      </div>
      {bars.map((bar) => (
        <div key={bar.label} style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{bar.label}</span>
            <strong style={{ fontSize: '0.75rem', color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
              {bar.currentPct}%
            </strong>
          </div>
          <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: isVisible ? `${bar.targetPct}%` : '0%',
                height: '100%',
                backgroundColor: bar.color,
                borderRadius: '4px',
                transition: 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>
      ))}
      <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
        <span style={{ color: '#64748B' }}>IMAT Score Estimate</span>
        <strong style={{ color: '#059669', fontSize: '1.05rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
          {scores.total.toFixed(1)} / 90
        </strong>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [cycleVisible, setCycleVisible] = useState(false);
  const [showFaqList, setShowFaqList] = useState(false);
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>(() => {
    try {
      return getTickerItems();
    } catch {
      return [];
    }
  });
  const [tickerSpeed, setTickerSpeed] = useState<number>(() => {
    try {
      return getHomeTickerSpeed();
    } catch {
      return DEFAULT_HOME_TICKER_SPEED;
    }
  });
  const { getPrice } = useDynamicPackagePrices();

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const expandAllFaqs = () => {
    setOpenFaqIndices(faqs.map((_, i) => i));
  };

  const collapseAllFaqs = () => {
    setOpenFaqIndices([]);
  };

  const [latestNews, setLatestNews] = useState<NewsItem[]>(() => {
    try {
      const posts = getNewsPosts();
      return posts && posts.length > 0 ? posts.slice(0, 3) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    syncTickerFromSupabase().then((items) => {
      if (items && items.length > 0) setTickerItems(items);
    });

    const refreshSpeed = () => {
      try {
        setTickerSpeed(getHomeTickerSpeed());
      } catch {}
    };
    window.addEventListener('ahsora_cms_home_ticker_speed_updated', refreshSpeed);

    const refreshNews = () => {
      try {
        const posts = getNewsPosts();
        if (posts && posts.length > 0) {
          setLatestNews(posts.slice(0, 3));
        }
      } catch {}
    };
    refreshNews();
    syncNewsFromSupabase().then((posts) => {
      if (posts && posts.length > 0) {
        setLatestNews(posts.slice(0, 3));
      }
    });

    window.addEventListener('ahsora_cms_news_updated', refreshNews);
    window.addEventListener('storage', refreshNews);
    window.addEventListener('storage', refreshSpeed);
    return () => {
      window.removeEventListener('ahsora_cms_news_updated', refreshNews);
      window.removeEventListener('ahsora_cms_home_ticker_speed_updated', refreshSpeed);
      window.removeEventListener('storage', refreshNews);
      window.removeEventListener('storage', refreshSpeed);
    };
  }, []);

  const cycleRef = useRef<HTMLDivElement>(null);
  const statsRef = useStaggeredAnimation(4) as React.RefObject<HTMLDivElement>;
  const subjectsRef = useStaggeredAnimation(4) as React.RefObject<HTMLDivElement>;
  const stepsRef = useStaggeredAnimation(3) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    const el = cycleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCycleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      q: 'What subjects does the IMAT test?',
      a: 'The IMAT covers 5 sections: Reading & Acquired Knowledge (4 questions), Problem Solving (5 questions), Biology (23 questions), Chemistry (15 questions), and Physics & Mathematics (13 questions). Our curriculum addresses every testable topic in all sections.',
    },
    {
      q: 'How does Ahsora Med Academy prepare me specifically for IMAT?',
      a: 'Our IMAT program includes 60+ hours of subject-specific video lectures, 2,800+ authentic past-paper questions with expert decompositions, 12 full-length CBT mock tests matching the Italian Ministry scoring algorithm (+1.5/−0.4), and live weekly strategy sessions delivered by real teachers.',
    },
    {
      q: 'What makes Ahsora different from other IMAT prep platforms?',
      a: 'Most platforms just sell recorded video courses and leave you alone. Ahsora is built differently — we run live weekly classes delivered by real IMAT-certified teachers. You can ask questions, attend live lectures, and never feel stuck. We support you from preparation all the way through university application, visa, and admission.',
    },
    {
      q: 'How does the mock test engine replicate real IMAT conditions?',
      a: 'Our CBT platform mirrors the exact IMAT format: 100-minute timer, 60 questions, synchronized question palette, mark-for-review flags, and the official +1.5/−0.4 scoring system. Instant analytics show you topic-by-topic breakdowns and peer percentile ranking.',
    },
    {
      q: 'Can international (non-EU) students apply for Italian medical programs?',
      a: "Yes. Italian public universities reserve dedicated non-EU quota seats. We guide you through Universitaly pre-enrolment, document legalization (DOV/CIMEA), and the Type-D student visa — all as part of our post-IMAT admissions support.",
    },
    {
      q: 'Do I get access to live classes in all plans?',
      a: 'Live weekly classes are included in our Mastery and Ahsora MedPath Elite plans. Ascend students get portal access until next IMAT (upto 12 months) with 2,800+ practice MCQs, comprehensive study notes, solved past papers 2011-26, and 12 CBT mock exams. Upgrade to Mastery for live interactive classes and teacher Q&A sessions.',
    },
  ];

  const imatSubjects = [
    {
      icon: <BookOpen size={26} color="#059669" />,
      title: 'Reading & Acquired Knowledge',
      desc: 'Reading comprehension and acquired knowledge of scientific history. 4 questions.',
      topics: 'Reading & acquired knowledge topics',
      color: '#ECFDF5',
      border: '#A7F3D0',
    },
    {
      icon: <Brain size={26} color="#059669" />,
      title: 'Problem Solving',
      desc: 'Logical reasoning and numerical problem solving. 5 questions.',
      topics: 'Problem solving skills',
      color: '#ECFDF5',
      border: '#A7F3D0',
    },
    {
      icon: <FlaskConical size={26} color="#D4AF37" />,
      title: 'Biology',
      desc: 'Cell biology, genetics, human anatomy, physiology, ecology. 23 questions aligned to the official IMAT syllabus.',
      topics: '28 testable topics',
      color: '#FFFBEB',
      border: '#FDE68A',
    },
    {
      icon: <Atom size={26} color="#059669" />,
      title: 'Chemistry',
      desc: 'Organic & inorganic chemistry, stoichiometry, reactions, thermodynamics. 15 questions.',
      topics: '22 testable topics',
      color: '#ECFDF5',
      border: '#A7F3D0',
    },
    {
      icon: <Target size={26} color="#D4AF37" />,
      title: 'Physics & Mathematics',
      desc: 'Mechanics, waves, electricity, algebra, probability. 13 questions.',
      topics: '18 testable topics',
      color: '#FFFBEB',
      border: '#FDE68A',
    },
  ];

  const trustItems = [
    { icon: '🎥', text: '120+ Hours Live Teaching' },
    { icon: '🩺', text: 'Developed by 1st Hand Experience' },
    { icon: '🌍', text: 'Trusted Globally' },
    { icon: '👨‍🏫', text: 'Live Weekly Classes by Real Teachers' },
    { icon: '🔁', text: 'Full Support Until You Pass' },
    { icon: '📝', text: '2,800+ IMAT Practice Questions' },
    { icon: '🇮🇹', text: 'Italy Admissions Experts' },
    { icon: '📚', text: 'Comprehensive Study Materials' },
  ];

  const liveSchedule = [
    {
      subject: 'Biology',
      topic: 'Cell Division & Genetics Deep Dive',
      teacher: 'Dr. Ahmed K.',
      initials: 'AK',
      color: '#059669',
      time: 'Tomorrow — 6:00 PM',
      live: false,
    },
    {
      subject: 'Critical Thinking',
      topic: 'Argument Analysis — Past Paper Walkthrough',
      teacher: 'Prof. Zain M.',
      initials: 'ZM',
      color: '#D4AF37',
      time: 'Today — 8:00 PM',
      live: true,
    },
    {
      subject: 'Chemistry',
      topic: 'Organic Chemistry: Reactions & Mechanisms',
      teacher: 'Dr. Rania S.',
      initials: 'RS',
      color: '#10B981',
      time: 'Thu — 5:30 PM',
      live: false,
    },
  ];

  return (
    <div>
      {/* ══════════════════════════════════════════════════
          1. HERO SECTION — split layout
      ══════════════════════════════════════════════════ */}
      <section
        className="home-hero-section"
        style={{
          backgroundColor: '#FFFFFF',
          padding: 'calc(88px + var(--top-offer-bar-height, 0px)) 0 100px 0',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '30%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '600px',
            background:
              'radial-gradient(ellipse at top, rgba(5, 150, 105, 0.13) 0%, rgba(255,255,255,0) 65%)',
            pointerEvents: 'none',
          }}
        />
        {/* Subtle dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, #E2E8F0 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            opacity: 0.45,
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '60px',
              alignItems: 'center',
            }}
          >
            {/* ── LEFT: Copy ── */}
            <div>
              {/* Eyebrow */}
              <div
                style={{
                  color: '#D4AF37', // Gold text color matching the guide image
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  marginBottom: '16px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  animation: 'fadeIn 0.6s ease-out forwards',
                }}
              >
                A COMPLETE JOURNEY TO MEDICINE IN ITALY
              </div>

              {/* Main headline */}
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-1.5px',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  animation: 'fadeInUp 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both',
                }}
              >
                <span>THE IMAT IS THE TEST.</span><br />
                <span style={{ color: '#059669' }}>YOUR JOURNEY IS MUCH BIGGER.</span>
              </h1>

              {/* Supporting copy */}
              <p
                style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
                  color: '#475569',
                  lineHeight: 1.75,
                  marginBottom: '24px',
                  animation: 'fadeInUp 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) both',
                  maxWidth: '90%',
                }}
              >
                Prepare with live expert teaching, structured practice and realistic testing. 
                Track your progress through the Ahsora Student Portal. And when the exam is over, 
                continue with dedicated guidance through the university and admissions journey.
              </p>

              {/* Credibility Line */}
              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#64748B',
                  fontStyle: 'italic',
                  marginBottom: '40px',
                  animation: 'fadeInUp 0.7s 0.25s cubic-bezier(0.16,1,0.3,1) both',
                }}
              >
                Built from firsthand experience of the journey to Medicine in Italy.
              </p>

              {/* CTA buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                  animation: 'fadeInUp 0.7s 0.3s cubic-bezier(0.16,1,0.3,1) both',
                }}
              >
                <Link
                  href="/courses"
                  className="btn-primary"
                  style={{
                    padding: '15px 32px',
                    fontSize: '0.9375rem',
                    borderRadius: '9999px',
                    backgroundColor: '#059669', // Emerald Green
                    boxShadow: '0 8px 24px -4px rgba(5,150,105,0.4)',
                    color: '#FFF',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#047857';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#059669';
                  }}
                >
                  <span>EXPLORE PROGRAMMES</span>
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/free-mock"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: '#059669',
                    background: 'none',
                    border: '2px solid #059669', // Bold green border
                    cursor: 'pointer',
                    padding: '13px 26px',
                    borderRadius: '9999px',
                    transition: 'background-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#059669';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#059669';
                  }}
                >
                  <span>TAKE A FREE IMAT MOCK</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Hero Graphic (Medical Students Clinical Training) ── */}
            <div
              className="hero-graphic-col"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                animation: 'fadeInRight 0.8s 0.3s cubic-bezier(0.16,1,0.3,1) both',
                position: 'relative',
              }}
            >
              <div
                className="hero-images-wrapper"
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '490px',
                  paddingBottom: '20px',
                }}
              >
                {/* Clinical Student Photo 1: Blood Pressure Examination */}
                <div
                  className="hero-photo-primary img-interactive-hover"
                  style={{
                    borderRadius: '24px',
                    boxShadow: '0 24px 50px -10px rgba(15,23,42,0.22)',
                    aspectRatio: '4/3.4',
                    minHeight: '370px',
                    backgroundColor: '#F1F5F9',
                    border: '2px solid #E2E8F0',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Image 
                    src="/student-clinical-bp.jpg" 
                    alt="Medical student wearing white coat measuring blood pressure" 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    priority 
                  />
                  <div
                    className="hero-badge-clinical"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                    🩺 Clinical Skills in Italy
                  </div>
                </div>

                {/* Clinical Student Photo 2: Hospital Ward & Injection */}
                <div
                  className="hero-photo-secondary img-interactive-hover"
                  style={{
                    position: 'absolute',
                    top: '44%',
                    right: '-20px',
                    width: '60%',
                    aspectRatio: '4/3',
                    borderRadius: '18px',
                    boxShadow: '0 24px 48px -10px rgba(15,23,42,0.28)',
                    border: '3px solid #FFFFFF',
                    backgroundColor: '#F1F5F9',
                    zIndex: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Image 
                    src="/student-clinical-injection.jpg" 
                    alt="Medical student in white coat preparing injection in hospital setting" 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                  <div
                    className="hero-badge-hospital"
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(5, 150, 105, 0.92)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      pointerEvents: 'none',
                    }}
                  >
                    💉 Hospital Clerkship & Practice
                  </div>
                </div>

                {/* Floating Student Portal Visual */}
                <div
                  className="hero-float-portal img-interactive-hover"
                  style={{
                    position: 'absolute',
                    bottom: '-28px',
                    left: '-36px',
                    width: '210px',
                    zIndex: 3,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 24px 50px -10px rgba(15,23,42,0.3), 0 0 0 1px rgba(5,150,105,0.2)',
                    backgroundColor: '#0F172A',
                    padding: '4px',
                    animation: 'fadeInUp 1s 0.6s cubic-bezier(0.16,1,0.3,1) both',
                  }}
                >
                  <Image
                    src="/hero-proof-card.jpg"
                    alt="Ahsora Student Portal Dashboard"
                    width={300}
                    height={225}
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. TRUST STRIP — animated marquee (crash-proof)
      ══════════════════════════════════════════════════ */}
      <div
        style={{
          backgroundColor: '#0F172A',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 0',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Fade edges */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '80px',
            background: 'linear-gradient(to right, #0F172A, transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '80px',
            background: 'linear-gradient(to left, #0F172A, transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <div className="trust-marquee">
          {(() => {
            const itemsToDisplay = tickerItems.length > 0 ? tickerItems : trustItems;
            return (
              <>
                <div className="trust-marquee-track" style={{ animationDuration: `${tickerSpeed}s` }}>
                  {itemsToDisplay.map((item, i) => (
                    <div
                      key={`strip-a-${i}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '0 28px',
                        whiteSpace: 'nowrap',
                        color: '#CBD5E1',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                      <span>{item.text}</span>
                      <span style={{ color: '#334155', marginLeft: '16px' }}>·</span>
                    </div>
                  ))}
                </div>
                <div className="trust-marquee-track" aria-hidden="true" style={{ animationDuration: `${tickerSpeed}s` }}>
                  {itemsToDisplay.map((item, i) => (
                    <div
                      key={`strip-b-${i}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '0 28px',
                        whiteSpace: 'nowrap',
                        color: '#CBD5E1',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                      <span>{item.text}</span>
                      <span style={{ color: '#334155', marginLeft: '16px' }}>·</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          3. WHY AHSORA
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            {/* Left: headline */}
            <AnimatedSection animClass="scroll-fade-left">
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#059669',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                Why Ahsora
              </span>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-1.5px',
                  lineHeight: 1.15,
                  marginBottom: '20px',
                  fontFamily: 'var(--font-serif), Georgia, serif',
                }}
              >
                We don&apos;t just sell courses.{' '}
                <span style={{ color: '#059669', fontStyle: 'italic' }}>We teach you live.</span>
              </h2>
              <p
                style={{
                  color: '#475569',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  marginBottom: '32px',
                }}
              >
                Majority of platforms give you pre-recorded videos and leave you alone. 
                Ahsora gives you live weekly classes, real teachers, a structured learning system, 
                and complete admissions support — all the way to your Italian university seat.
              </p>
              <a
                href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20would%20like%20to%20book%20a%20free%20session"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '14px 30px', fontSize: '0.9375rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Book Free Session</span>
                <ArrowRight size={16} />
              </a>
            </AnimatedSection>

            {/* Right: 2×2 feature grid */}
            <div
              className="scroll-stagger why-features-grid"
              ref={useStaggeredAnimation(4) as React.RefObject<HTMLDivElement>}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              {[
                {
                  icon: <Video size={22} color="#059669" />,
                  bg: '#ECFDF5',
                  border: '#A7F3D0',
                  title: 'Real Teachers. Real Classes.',
                  desc: 'Live IMAT lectures every week — not just recordings. Ask questions, get answers.',
                },
                {
                  icon: <Shield size={22} color="#D4AF37" />,
                  bg: '#FFFBEB',
                  border: '#FDE68A',
                  title: 'Complete Support System',
                  desc: 'Prep → mock tests → university application → visa. We stay with you end to end.',
                },
                {
                  icon: <TrendingUp size={22} color="#059669" />,
                  bg: '#ECFDF5',
                  border: '#A7F3D0',
                  title: 'Proven Results',
                  desc: 'Supported students from 15+ countries on their journey to Medical School in Italy.',
                },
                {
                  icon: <Globe size={22} color="#D4AF37" />,
                  bg: '#FFFBEB',
                  border: '#FDE68A',
                  title: 'Italy Admissions Experts',
                  desc: 'Visa, documents, Universitaly, university selection — handled by our specialists.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${card.border}`,
                    borderRadius: '16px',
                    padding: '22px 18px',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px -6px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: card.bg,
                      border: `1px solid ${card.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      marginBottom: '8px',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. SIGNATURE LEARNING CYCLE
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <AnimatedSection style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 64px auto' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#059669',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              Our Method
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                color: '#0F172A',
                marginTop: '8px',
                marginBottom: '14px',
                letterSpacing: '-0.5px',
              }}
            >
              The Ahsora{' '}
              <span style={{ color: '#059669', fontStyle: 'italic' }}>Signature Learning Cycle</span>
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.7 }}>
              Improvement isn&apos;t linear — it&apos;s cyclical. Our platform is built around a 
              structured loop that continuously narrows your gaps. Each cycle brings you closer 
              to the score you need.
            </p>
          </AnimatedSection>

          <div ref={cycleRef}>
            {/* Cycle nodes row (6-stage signature loop) */}
            <div
              className="cycle-nodes-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                marginBottom: '60px',
                flexWrap: 'nowrap',
              }}
            >
              <CycleNode
                icon={<Video size={24} color="#FFFFFF" />}
                label="Learn"
                sublabel="Live classes, lectures"
                color="#059669"
                delay={0}
                isActive={cycleVisible}
              />
              <CycleArrow delay={100} />
              <CycleNode
                icon={<BookOpen size={24} color="#FFFFFF" />}
                label="Practice"
                sublabel="Books, question bank"
                color="#047857"
                delay={200}
                isActive={cycleVisible}
              />
              <CycleArrow delay={300} />
              <CycleNode
                icon={<FileCheck size={24} color="#FFFFFF" />}
                label="Test"
                sublabel="CBT mocks"
                color="#0F172A"
                delay={400}
                isActive={cycleVisible}
              />
              <CycleArrow delay={500} />
              <CycleNode
                icon={<BarChart3 size={24} color="#FFFFFF" />}
                label="Analyze"
                sublabel="Subjectwise & topic-wise error analysis"
                color="#D4AF37"
                delay={600}
                isActive={cycleVisible}
              />
              <CycleArrow delay={700} />
              <CycleNode
                icon={<Sparkles size={24} color="#FFFFFF" />}
                label="Improve"
                sublabel="Q&A & doubt sessions with teachers"
                color="#059669"
                delay={800}
                isActive={cycleVisible}
              />
              <CycleArrow delay={900} />
              <CycleNode
                icon={<RotateCcw size={24} color="#FFFFFF" />}
                label="Repeat"
                sublabel="Calibrated, sharper"
                color="#10B981"
                delay={1000}
                isActive={cycleVisible}
              />
            </div>

            {/* Step cards */}
            <div
              ref={stepsRef}
              className="scroll-stagger"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                {
                  step: '01',
                  icon: <BookOpen size={20} color="#059669" />,
                  title: 'Learn with structured courses',
                  desc: 'High-yield subject modules, video lectures, and downloadable summary sheets — covering every IMAT topic in priority order.',
                  link: '/courses',
                  cta: 'Browse IMAT Courses',
                  accent: '#059669',
                },
                {
                  step: '02',
                  icon: <FileCheck size={20} color="#059669" />,
                  title: 'Test under real conditions',
                  desc: '60-question, 100-minute mock tests with the exact Italian Ministry scoring: +1.5 correct, −0.4 wrong, 0 unanswered.',
                  link: '/mock-tests',
                  cta: 'View Mock Tests',
                  accent: '#059669',
                },
                {
                  step: '03',
                  icon: <Video size={20} color="#D4AF37" />,
                  title: 'Attend live classes & close gaps',
                  desc: 'Every week, real teachers run live IMAT lectures. Ask questions, get clarity, and close the gaps your mock test revealed.',
                  link: '/portal/tests/tst-01/take',
                  cta: 'See Analytics Demo',
                  accent: '#D4AF37',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '28px 24px',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px -6px rgba(0,0,0,0.09)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: item.accent,
                        backgroundColor: item.accent === '#059669' ? '#ECFDF5' : '#FFFBEB',
                        border: `1px solid ${item.accent === '#059669' ? '#A7F3D0' : '#FDE68A'}`,
                        borderRadius: '6px',
                        padding: '3px 8px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      STEP {item.step}
                    </span>
                    {item.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.05rem',
                      color: '#0F172A',
                      fontWeight: 700,
                      marginBottom: '10px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: '#64748B',
                      fontSize: '0.875rem',
                      lineHeight: 1.65,
                      marginBottom: '18px',
                    }}
                  >
                    {item.desc}
                  </p>
                  <Link
                    href={item.link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#047857',
                      transition: 'gap 0.2s',
                    }}
                  >
                    {item.cta} <ChevronRight size={15} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. COURSES / PACKAGES
      ══════════════════════════════════════════════════ */}
      <section id="packages" style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <AnimatedSection style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#059669',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              Preparation Plans
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                color: '#0F172A',
                marginTop: '8px',
                letterSpacing: '-0.5px',
              }}
            >
              Choose your IMAT journey
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '12px', lineHeight: 1.7 }}>
              Every plan includes our complete subject library and IMAT question bank. Upgrade for live classes and 1-on-1 support.
            </p>
          </AnimatedSection>

          {/* Subject coverage strip */}
          <AnimatedSection
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            {[
              { icon: <BookOpen size={14} />, label: 'Reading & Acquired Knowledge', q: '4 Qs' },
              { icon: <Brain size={14} />, label: 'Problem Solving', q: '5 Qs' },
              { icon: <FlaskConical size={14} />, label: 'Biology', q: '23 Qs' },
              { icon: <Atom size={14} />, label: 'Chemistry', q: '15 Qs' },
              { icon: <Target size={14} />, label: 'Physics & Mathematics', q: '13 Qs' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#475569',
                }}
              >
                <span style={{ color: '#059669' }}>{s.icon}</span>
                {s.label}
                <span
                  style={{
                    backgroundColor: '#ECFDF5',
                    color: '#047857',
                    borderRadius: '9999px',
                    padding: '1px 7px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    border: '1px solid #A7F3D0',
                  }}
                >
                  {s.q}
                </span>
              </div>
            ))}
          </AnimatedSection>

          <div
            className="scroll-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '28px',
              alignItems: 'stretch',
            }}
            ref={useScrollAnimation() as React.RefObject<HTMLDivElement>}
          >
            {/* Package 1: Ascend */}
            <div
              style={{
                border: '1.5px solid #E2E8F0',
                borderRadius: '20px',
                padding: '40px 30px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFFFFF',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px -8px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Starter
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Ahsora IMAT Ascend
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '16px', lineHeight: 1.6 }}>
                The perfect starter plan for self-paced study with full content access.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
                  {getPrice('ascend').price}
                </span>
                {getPrice('ascend').originalPrice && (
                  <span style={{ fontSize: '1.05rem', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 600 }}>
                    {getPrice('ascend').originalPrice}
                  </span>
                )}
                {getPrice('ascend').badge && (
                  <span style={{ backgroundColor: '#DCFCE7', color: '#047857', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                    {getPrice('ascend').badge}
                  </span>
                )}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Portal access until next IMAT (upto 12 months)',
                  'Comprehensive Study Notes, Books, Solved past IMAT papers 2011-26, Formula sheets etc',
                  '2,800+ Practice MCQs in Question Bank',
                  '12 Full-Length CBT Mocks',
                  'In-depth Error analysis, subjectwise and topicwise performance analysis',
                ].map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '0.9375rem' }}>
                    <CheckCircle2 size={18} color="#059669" style={{ marginTop: '1px', flexShrink: 0 }} />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn-outline" style={{ width: '100%', textAlign: 'center', padding: '13px', display: 'block' }}>
                Select Plan
              </Link>
            </div>

            {/* Package 2: Mastery (Popular) */}
            <div
              style={{
                border: '2px solid #059669',
                borderRadius: '20px',
                padding: '40px 30px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ECFDF5',
                position: 'relative',
                boxShadow: '0 20px 48px -8px rgba(34,197,94,0.2)',
                transform: 'scale(1.02)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#FFF',
                  padding: '5px 18px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(34,197,94,0.35)',
                }}
              >
                <Star size={11} fill="#FFF" />
                MOST POPULAR
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#047857',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Best Value
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Ahsora IMAT Mastery
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9375rem', marginBottom: '16px', lineHeight: 1.6 }}>
                Everything you need to confidently ace the IMAT — live classes included.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#047857', letterSpacing: '-0.5px' }}>
                  {getPrice('mastery').price}
                </span>
                {getPrice('mastery').originalPrice && (
                  <span style={{ fontSize: '1.05rem', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 600 }}>
                    {getPrice('mastery').originalPrice}
                  </span>
                )}
                {getPrice('mastery').badge && (
                  <span style={{ backgroundColor: '#059669', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                    {getPrice('mastery').badge}
                  </span>
                )}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { text: 'Everything in Ascend', bold: true },
                  { text: '🎥 Live Weekly Classes by Teachers', bold: false },
                  { text: 'Live Group Q&A Sessions', bold: false },
                  { text: '2,800+ Practice Questions', bold: false },
                  { text: '12 Full-Length Mock Exams', bold: false },
                  { text: 'In-depth Performance Analytics', bold: false },
                ].map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#375', fontSize: '0.9375rem', fontWeight: feat.bold ? 700 : 400 }}>
                    <CheckCircle2 size={18} color="#059669" style={{ marginTop: '1px', flexShrink: 0 }} />
                    <span style={{ color: feat.bold ? '#0F172A' : '#475569' }}>{feat.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn-primary" style={{ width: '100%', textAlign: 'center', padding: '14px', backgroundColor: '#059669', display: 'block' }}>
                Select Plan
              </Link>
            </div>

            {/* Package 3: Ahsora MedPath Elite */}
            <div
              style={{
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '20px',
                padding: '40px 30px',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
                color: '#FFFFFF',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 40px -8px rgba(212,175,55,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#D4AF37',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Premium
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Ahsora MedPath Elite <Sparkles size={18} color="#D4AF37" />
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.9375rem', marginBottom: '16px', lineHeight: 1.6 }}>
                The ultimate 1-on-1 personalized mentorship from IMAT prep to admission.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#D4AF37', letterSpacing: '-0.5px' }}>
                  {getPrice('elite').price}
                </span>
                {getPrice('elite').originalPrice && (
                  <span style={{ fontSize: '1.05rem', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 600 }}>
                    {getPrice('elite').originalPrice}
                  </span>
                )}
                {getPrice('elite').badge && (
                  <span style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', color: '#D4AF37', border: '1px solid #D4AF37', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                    {getPrice('elite').badge}
                  </span>
                )}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { text: 'Everything in Mastery', bold: true },
                  { text: '1-on-1 Personal Mentorship', bold: false },
                  { text: 'Customized Study Plans', bold: false },
                  { text: 'University Application Assistance', bold: false },
                  { text: 'Visa & Documentation Support', bold: false },
                ].map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#E2E8F0', fontSize: '0.9375rem', fontWeight: feat.bold ? 700 : 400 }}>
                    <CheckCircle2 size={18} color="#D4AF37" style={{ marginTop: '1px', flexShrink: 0 }} />
                    <span style={{ color: feat.bold ? '#FFFFFF' : '#CBD5E1' }}>{feat.text}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20would%20like%20to%20inquire%20about%20Ahsora%20MedPath%20Elite"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #D4AF37, #C59B27)',
                  color: '#0F172A',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(212,175,55,0.3)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                }}
              >
                <span>Inquire on WhatsApp</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. LIVE CLASSES — KEY DIFFERENTIATOR
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          padding: '100px 0',
          background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glows */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            right: '5%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            {/* Left: content */}
            <AnimatedSection animClass="scroll-fade-left">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#059669',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#059669',
                    display: 'inline-block',
                    animation: 'pulseGlow 1.5s ease-in-out infinite',
                  }}
                />
                Live Teaching — What Sets Us Apart
              </span>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-1px',
                  lineHeight: 1.15,
                  marginBottom: '20px',
                  fontFamily: 'var(--font-serif), Georgia, serif',
                }}
              >
                We Don&apos;t Just Sell Courses.{' '}
                <span style={{ color: '#059669', fontStyle: 'italic' }}>We Teach You Live.</span>
              </h2>
              <p
                style={{
                  color: '#94A3B8',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  marginBottom: '36px',
                }}
              >
                Other platforms give you pre-recorded videos and walk away. Ahsora runs 
                live lectures every week — delivered by IMAT-certified teachers. You can 
                ask questions in real time, get concepts clarified, and never feel stuck alone.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '40px' }}>
                {[
                  {
                    icon: <Mic size={18} color="#059669" />,
                    title: 'Weekly Live Subject Lectures',
                    desc: 'Biology, Chemistry, Physics, Mathematics & Critical Thinking — live every week.',
                  },
                  {
                    icon: <MessageCircle size={18} color="#059669" />,
                    title: 'Teacher Q&A Sessions',
                    desc: 'Ask anything in real time. Get answers from subject experts.',
                  },
                  {
                    icon: <PlayCircle size={18} color="#D4AF37" />,
                    title: 'Recorded Replays Included',
                    desc: "Can't attend live? All sessions are recorded and available instantly.",
                  },
                ].map((benefit) => (
                  <div key={benefit.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {benefit.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9375rem', marginBottom: '4px' }}>
                        {benefit.title}
                      </div>
                      <div style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        {benefit.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20would%20like%20to%20book%20a%20free%20session"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  padding: '14px 30px',
                  fontSize: '0.9375rem',
                  backgroundColor: '#059669',
                  boxShadow: '0 8px 28px -4px rgba(92,237,115,0.4)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Calendar size={16} />
                <span>Book a Free Session</span>
              </a>
            </AnimatedSection>

            {/* Right: Live schedule card */}
            <AnimatedSection animClass="scroll-fade-right">
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '24px',
                  padding: '28px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>
                      Upcoming Live Classes
                    </div>
                    <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '2px' }}>
                      This week&apos;s schedule
                    </div>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: 'rgba(5,150,105,0.15)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      color: '#059669',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#059669',
                        animation: 'pulseGlow 1.5s ease-in-out infinite',
                      }}
                    />
                    Live Now
                  </span>
                </div>

                {/* Session cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {liveSchedule.map((session, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: session.live ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${session.live ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '14px',
                        padding: '16px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      {/* Teacher avatar */}
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: session.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          flexShrink: 0,
                          border: `2px solid ${session.color}55`,
                          boxShadow: `0 0 0 3px ${session.color}22`,
                        }}
                      >
                        {session.initials}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: session.live ? '#059669' : '#94A3B8',
                              backgroundColor: session.live ? 'rgba(5,150,105,0.15)' : 'rgba(255,255,255,0.06)',
                              border: `1px solid ${session.live ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                            }}
                          >
                            {session.live ? '🔴 LIVE' : session.subject}
                          </span>
                          {!session.live && (
                            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Upcoming</span>
                          )}
                        </div>
                        <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.875rem', marginBottom: '2px' }}>
                          {session.topic}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{session.teacher}</span>
                          <span>·</span>
                          <Clock size={11} />
                          <span>{session.time}</span>
                        </div>
                      </div>

                      {/* Join button */}
                      <a
                        href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20would%20like%20to%20join%20the%20live%20masterclass%20session"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flexShrink: 0,
                          backgroundColor: session.live ? '#059669' : 'rgba(255,255,255,0.08)',
                          color: session.live ? '#FFFFFF' : '#94A3B8',
                          border: `1px solid ${session.live ? '#059669' : 'rgba(255,255,255,0.12)'}`,
                          borderRadius: '9999px',
                          padding: '6px 14px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textDecoration: 'none',
                        }}
                      >
                        {session.live ? 'Join' : 'RSVP'}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Footer note */}
                <div
                  style={{
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    All sessions include replay access
                  </span>
                  <Link
                    href="/courses"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#059669',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    Full Schedule <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. LIVE IMAT SIMULATOR (improved)
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <AnimatedSection animClass="scroll-scale-in">
            <div
              style={{
                background: 'linear-gradient(140deg, #065f46 0%, #059669 45%, #047857 100%)',
                borderRadius: '28px',
                padding: '64px 52px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '48px',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 32px 64px -12px rgba(34,197,94,0.3)',
              }}
            >
              {/* Background decorations */}
              <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-60px', right: '200px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '50%', left: '-40px', transform: 'translateY(-50%)', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

              {/* Left: text */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    borderRadius: '9999px',
                    padding: '5px 16px',
                    marginBottom: '20px',
                    letterSpacing: '1px',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  LIVE IMAT SIMULATOR
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    marginBottom: '16px',
                    lineHeight: 1.2,
                  }}
                >
                  Practice Under Real IMAT Conditions
                </h2>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    marginBottom: '32px',
                  }}
                >
                  Our CBT simulator mirrors the exact IMAT format. One test, real pressure, 
                  instant analytics — so exam day feels familiar.
                </p>

                {/* Feature badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
                  {[
                    { icon: <Timer size={13} />, label: '100-min Timer' },
                    { icon: <BarChart3 size={13} />, label: 'Official +1.5/−0.4 Scoring' },
                    { icon: <Zap size={13} />, label: 'Instant Analytics' },
                    { icon: <RotateCcw size={13} />, label: '12 Full Mock Tests' },
                  ].map((badge) => (
                    <span
                      key={badge.label}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    href="/free-mock"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#FFFFFF',
                      color: '#065f46',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      padding: '13px 28px',
                      borderRadius: '9999px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                    }}
                  >
                    <FileCheck size={17} />
                    <span>Start Free Mock Test</span>
                  </Link>
                  <Link
                    href="/mock-tests"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      padding: '13px 28px',
                      borderRadius: '9999px',
                      border: '1.5px solid rgba(255,255,255,0.3)',
                      transition: 'background 0.2s',
                    }}
                  >
                    <span>View All Mocks</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Right: sample question card + analytics */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Sample question card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '22px',
                    marginBottom: '16px',
                    boxShadow: '0 12px 32px -8px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 10px', borderRadius: '9999px' }}>
                      Biology · Q14 of 60
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Timer size={13} />
                      01:23:47
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 600, lineHeight: 1.6, marginBottom: '14px' }}>
                    Which of the following best describes the role of the mitochondria in cellular respiration?
                  </p>
                  {['ATP synthesis via oxidative phosphorylation', 'Protein synthesis and folding', 'Lipid digestion and breakdown', 'Detoxification of cellular waste'].map((opt, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: i === 0 ? '#065f46' : '#475569',
                        backgroundColor: i === 0 ? '#ECFDF5' : '#FFFFFF',
                        border: `1px solid ${i === 0 ? '#A7F3D0' : '#E2E8F0'}`,
                        marginBottom: '6px',
                        fontWeight: i === 0 ? 700 : 400,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: `2px solid ${i === 0 ? '#059669' : '#CBD5E1'}`,
                        backgroundColor: i === 0 ? '#059669' : 'transparent',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {i === 0 && <CheckCircle2 size={10} color="#fff" />}
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>

                {/* Analytics mini-card (Animated Live Report with growing lines & counting score) */}
                <AnimatedLiveReportCard />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          8. NEWS & UPDATES (3-card feed)
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '90px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <AnimatedSection style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#059669',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              Stay Informed
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                color: '#0F172A',
                marginTop: '8px',
                letterSpacing: '-0.5px',
              }}
            >
              Latest News & Updates
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '12px', lineHeight: 1.7 }}>
              IMAT dates, new class schedules, and important announcements — all in one place.
            </p>
          </AnimatedSection>

          <div
            className="scroll-stagger"
            ref={useStaggeredAnimation(3) as React.RefObject<HTMLDivElement>}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {(latestNews.length > 0
              ? latestNews.slice(0, 3)
              : [
                  {
                    id: 'fb-1',
                    category: 'Announcement',
                    date: 'Sep 2026',
                    title: 'Admissions Open — Italy 2027/2028',
                    excerpt: 'Applications are now open for the upcoming academic year. Start your IMAT preparation early to secure your seat at a top Italian university.',
                    readTime: '3 min read',
                  },
                  {
                    id: 'fb-2',
                    category: 'Live Classes',
                    date: 'Sep 2026',
                    title: 'New Weekly Live Class Schedule Released',
                    excerpt: 'Biology, Chemistry, and Critical Thinking live sessions have been scheduled. Enroll in Mastery or Ahsora MedPath Elite to join.',
                    readTime: '4 min read',
                  },
                  {
                    id: 'fb-3',
                    category: 'Mock Tests',
                    date: 'Aug 2026',
                    title: 'IMAT 2026 Mock Test Series — Now Available',
                    excerpt: '12 full-length IMAT mock tests updated with 2026-pattern questions and analytics. Practice under real exam conditions.',
                    readTime: '5 min read',
                  },
                ]
            ).map((item, i) => {
              const cat = (item.category || '').toLowerCase();
              const isAdmissions = cat.includes('admissions') || cat.includes('announcement');
              const isLive = cat.includes('live') || cat.includes('class');
              const isMock = cat.includes('mock') || cat.includes('test');

              const badgeColor = isAdmissions ? '#D97706' : isLive ? '#047857' : isMock ? '#7C3AED' : '#059669';
              const badgeBg = isAdmissions ? '#FEF3C7' : isLive ? '#ECFDF5' : isMock ? '#F5F3FF' : '#F0FDF4';
              const borderColor = isAdmissions ? '#F59E0B' : isLive ? '#059669' : isMock ? '#8B5CF6' : '#10B981';

              const cleanExcerpt = (item.excerpt || '').replace(/<[^>]*>/g, '');

              return (
                <div
                  key={item.id || i}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '18px',
                    padding: '24px',
                    borderLeft: `4px solid ${borderColor}`,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px -6px rgba(0,0,0,0.09)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <span
                        style={{
                          backgroundColor: badgeBg,
                          color: badgeColor,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {item.category || 'Update'}
                      </span>
                      <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 500 }}>
                        {item.date}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: badgeBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isLive ? (
                          <Video size={18} color={badgeColor} />
                        ) : isMock ? (
                          <FileCheck size={18} color={badgeColor} />
                        ) : (
                          <GraduationCap size={18} color={badgeColor} />
                        )}
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.35 }}>
                        {item.title}
                      </h3>
                    </div>

                    <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '18px' }}>
                      {cleanExcerpt}
                    </p>
                  </div>

                  <Link
                    href="/news"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: badgeColor,
                      textDecoration: 'none',
                    }}
                  >
                    Read Article <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link
              href="/news"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#64748B',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '2px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#059669')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#64748B')}
            >
              <Newspaper size={15} />
              View all news & updates
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          8b. STUDENT SUCCESS & REVIEWS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <AnimatedSection style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF3C7', color: '#B45309', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
              <Star size={14} fill="#F59E0B" color="#F59E0B" /> Verified Medical Student Results
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: '#0F172A', letterSpacing: '-0.5px', margin: '4px 0 10px' }}>
              From Ahsora Candidates to Medical Doctors in Italy
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.65 }}>
              Realistic feedback from candidates who conquered the IMAT and secured their seats in Italy's top English-taught medical faculties.
            </p>
          </AnimatedSection>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                name: 'Sofia Rossi',
                admitted: 'University of Milan (La Statale)',
                score: '71.8/90',
                rating: 5,
                quote: 'Organic chemistry, especially reaction mechanisms, was where I struggled the most. The classes and mock tests helped me understand what I was getting wrong, and the mentors helped me work on those weak areas. After a couple of weeks, I started feeling more confident.',
                avatar: 'SR',
                accent: '#059669',
              },
              {
                name: 'Hamza Tariq',
                admitted: 'Sapienza University of Rome · Non-EU Quota',
                score: '63.2/90',
                rating: 5,
                quote: 'As a non-EU student, I found the whole process of applying to medical universities in Italy a bit overwhelming. Ahsora’s MedPath Elite mentorship helped me with my IMAT preparation and made the admission and scholarship procedures much easier to understand.',
                avatar: 'HT',
                accent: '#2563EB',
              },
              {
                name: 'Elena Dumitru',
                admitted: 'University of Bologna',
                score: '65.0/90',
                rating: 4,
                quote: 'I really liked the live classes because I could ask questions whenever something wasn’t clear. The tips for managing time in logical reasoning were particularly helpful. They gave me a better idea of how to approach questions without spending too long on them.',
                avatar: 'ED',
                accent: '#7C3AED',
              },
            ].map((review, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px -6px rgba(15, 23, 42, 0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px -2px rgba(15, 23, 42, 0.04)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[...Array(5)].map((_, s) => (
                          <Star
                            key={s}
                            size={15}
                            fill={s < review.rating ? '#F59E0B' : '#E2E8F0'}
                            color={s < review.rating ? '#F59E0B' : '#CBD5E1'}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>
                        {review.rating}.0
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor: review.score === 'Not provided' ? '#F8FAFC' : '#ECFDF5',
                        color: review.score === 'Not provided' ? '#475569' : '#047857',
                        border: `1px solid ${review.score === 'Not provided' ? '#E2E8F0' : '#A7F3D0'}`,
                        padding: '3px 9px',
                        borderRadius: '9999px',
                      }}
                    >
                      {review.score === 'Not provided' ? 'Score: Not provided' : `IMAT Score: ${review.score}`}
                    </span>
                  </div>

                  <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '18px' }}>
                    "{review.quote}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: review.accent,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                      {review.name}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0' }}>
                      {review.admitted}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          9. FAQs & SUPPORT (2-Column Layout)
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '1180px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* Left Side: FAQs */}
            <div style={{ minWidth: 0 }}>
              <div style={{ marginBottom: '28px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#059669',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  Common Questions
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 3.2vw, 2.3rem)',
                    color: '#0F172A',
                    marginTop: '8px',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Frequently Asked Questions
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '8px', lineHeight: 1.6 }}>
                  Everything you need to know before joining Ahsora and applying to Italian medical universities.
                </p>
              </div>

              {/* FAQ Accordion List - Clean, directly visible */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndices.includes(idx);
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: isOpen ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: isOpen ? '0 4px 16px -4px rgba(5,150,105,0.1)' : 'none',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        style={{
                          width: '100%',
                          padding: '18px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          fontWeight: 700,
                          fontSize: '0.94rem',
                          color: isOpen ? '#0F172A' : '#334155',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          gap: '14px',
                        }}
                      >
                        <span style={{ flex: 1, lineHeight: 1.45 }}>{faq.q}</span>
                        <span
                          style={{
                            flexShrink: 0,
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: isOpen ? '#ECFDF5' : '#F8FAFC',
                            border: `1px solid ${isOpen ? '#A7F3D0' : '#E2E8F0'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isOpen ? '#047857' : '#64748B',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <ChevronDown
                            size={15}
                            style={{
                              transition: 'transform 0.25s',
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        </span>
                      </button>
                      {isOpen && (
                        <div
                          style={{
                            padding: '0 20px 20px 20px',
                            color: '#475569',
                            fontSize: '0.92rem',
                            lineHeight: 1.75,
                            borderTop: '1px solid #F1F5F9',
                            paddingTop: '14px',
                          }}
                        >
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Still Have Questions Card */}
            <div>
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  boxShadow: '0 4px 20px -4px rgba(15,23,42,0.06)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <MessageCircle size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Still Have Questions?
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '22px' }}>
                  Can't find what you're looking for? Reach out directly to our admissions team for personalized guidance.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href="https://wa.me/393333444479"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(5,150,105,0.25)',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)')}
                  >
                    <MessageCircle size={16} />
                    Chat on WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      padding: '11px 20px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#F1F5F9')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#FFFFFF')}
                  >
                    Contact Us
                  </Link>
                </div>

                <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Advisors active • Typical reply &lt; 15 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          10. FINAL CTA — dark gradient
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          padding: '110px 0',
          background: 'linear-gradient(160deg, #0F172A 0%, #1a2744 50%, #0F172A 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glows */}
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div className="container" style={{ maxWidth: '760px', position: 'relative', zIndex: 1 }}>
          <AnimatedSection animClass="scroll-scale-in" style={{ textAlign: 'center' }}>
            {/* Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #059669, #047857)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                boxShadow: '0 12px 32px rgba(92,237,115,0.4)',
              }}
            >
              <GraduationCap size={28} color="#FFFFFF" />
            </div>

            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#FFFFFF',
                fontWeight: 800,
                letterSpacing: '-1px',
                marginBottom: '18px',
                lineHeight: 1.15,
                fontFamily: 'var(--font-serif), Georgia, serif',
              }}
            >
              Ready to Crack the IMAT?
            </h2>
            <p
              style={{
                color: '#94A3B8',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                marginBottom: '40px',
                maxWidth: '560px',
                margin: '0 auto 40px auto',
              }}
            >
              Book a free 1-on-1 session with our IMAT mentors. Get a personalized study plan, 
              subject audit, and mock test schedule — built around your exam date and target university.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '32px',
              }}
            >
              <a
                href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20would%20like%20to%20book%20a%20free%201-on-1%20counselling%20session"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  padding: '16px 36px',
                  fontSize: '1rem',
                  backgroundColor: '#059669',
                  boxShadow: '0 8px 28px -4px rgba(5,150,105,0.5)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Book Free 1-on-1 Counselling</span>
                <ArrowRight size={18} />
              </a>
              <Link
                href="/imat"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '1rem',
                  padding: '16px 32px',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  transition: 'background 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.14)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.08)')}
              >
                <FileCheck size={17} />
                <span>Know More About IMAT</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {[
                { icon: '✓', text: 'No credit card required' },
                { icon: '🔒', text: 'Your data is safe' },
                { icon: '💬', text: '24/7 WhatsApp support' },
              ].map((badge) => (
                <div
                  key={badge.text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#64748B',
                    fontSize: '0.825rem',
                    fontWeight: 500,
                  }}
                >
                  <span style={{ color: '#059669' }}>{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        defaultExam="IMAT"
      />
    </div>
  );
}

