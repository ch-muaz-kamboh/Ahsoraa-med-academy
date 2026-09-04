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
        gap: '12px',
        flex: '1 1 120px',
        minWidth: '100px',
        maxWidth: '150px',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
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
        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.8rem', lineHeight: 1.3 }}>
          {label}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500, marginTop: '3px' }}>
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

export default function HomePage() {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [cycleVisible, setCycleVisible] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

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
      a: 'Live weekly classes are included in our Mastery and Path Elite plans. Ascend students get access to recorded class replays. All plans include our full video library, mock tests, and study notes. Upgrade to Mastery for real-time teacher interaction and Q&A sessions.',
    },
  ];

  const imatSubjects = [
    {
      icon: <BookOpen size={26} color="#059669" />,
      title: 'Reading & Acquired Knowledge',
      desc: 'General knowledge and reading comprehension skills. 4 questions.',
      topics: 'General knowledge topics',
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
      color: '#3B82F6',
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
        style={{
          backgroundColor: '#FFFFFF',
          padding: '80px 0 100px 0',
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
                  href="/portal/tests/tst-01/take"
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

            {/* ── RIGHT: Hero Graphic ── */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                animation: 'fadeInRight 0.8s 0.3s cubic-bezier(0.16,1,0.3,1) both',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '420px', // slightly smaller to fit the floating portal correctly
                }}
              >
                {/* Main graphic card (Professional Photo) */}
                <div
                  style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 24px 48px -12px rgba(15,23,42,0.15)',
                    aspectRatio: '3/4',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #E2E8F0',
                    position: 'relative',
                  }}
                >
                  <Image 
                    src="/founder-photo.jpg" 
                    alt="Ahsora Founder in Medical Setting" 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    priority 
                  />
                </div>

                {/* Floating Student Portal Visual */}
                <div
                  className="hero-float-portal"
                  style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '-80px', // Floating overlap
                    width: '240px',
                    animation: 'fadeInUp 1s 0.6s cubic-bezier(0.16,1,0.3,1) both',
                  }}
                >
                  <div
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 32px 64px -12px rgba(15,23,42,0.25), 0 0 0 1px rgba(5,150,105,0.15)',
                      backgroundColor: '#0F172A',
                      padding: '4px',
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
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. TRUST STRIP — animated marquee
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
          <div className="trust-marquee-inner">
            {[...trustItems, ...trustItems].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 32px',
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
                Every other platform gives you pre-recorded videos and leaves you alone. 
                Ahsora gives you live weekly classes, real teachers, a structured learning system, 
                and complete admissions support — all the way to your Italian university seat.
              </p>
              <button
                onClick={() => setLeadModalOpen(true)}
                className="btn-primary"
                style={{ padding: '14px 30px', fontSize: '0.9375rem' }}
              >
                <span>Book Free Session</span>
                <ArrowRight size={16} />
              </button>
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
                  desc: '96.8% pass rate across 3,500+ IMAT students from 40+ countries worldwide.',
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
            {/* Cycle nodes row */}
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
                icon={<BookOpen size={28} color="#FFFFFF" />}
                label="Study"
                sublabel="Structured courses & notes"
                color="#059669"
                delay={0}
                isActive={cycleVisible}
              />
              <CycleArrow delay={200} />
              <CycleNode
                icon={<FileCheck size={28} color="#FFFFFF" />}
                label="Mock Test"
                sublabel="Real IMAT conditions"
                color="#047857"
                delay={300}
                isActive={cycleVisible}
              />
              <CycleArrow delay={500} />
              <CycleNode
                icon={<Target size={28} color="#FFFFFF" />}
                label="Analyze"
                sublabel="Identify weak topics"
                color="#D4AF37"
                delay={600}
                isActive={cycleVisible}
              />
              <CycleArrow delay={800} />
              <CycleNode
                icon={<Video size={28} color="#FFFFFF" />}
                label="Live Class"
                sublabel="Teacher-led Q&A"
                color="#0F172A"
                delay={900}
                isActive={cycleVisible}
              />
              <CycleArrow delay={1100} />
              <CycleNode
                icon={<TrendingUp size={28} color="#FFFFFF" />}
                label="Improve"
                sublabel="Score higher each cycle"
                color="#059669"
                delay={1200}
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
              Every plan includes our full video library and IMAT question bank. Upgrade for live classes and 1-on-1 support.
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
              <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '28px', lineHeight: 1.6 }}>
                The perfect starter plan for self-paced study with full content access.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Full Video Library Access',
                  'Comprehensive Study Notes',
                  '1,000+ Practice Questions',
                  '3 Full-Length Mock Exams',
                  'Recorded Class Replays',
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
              <p style={{ color: '#475569', fontSize: '0.9375rem', marginBottom: '28px', lineHeight: 1.6 }}>
                Everything you need to confidently ace the IMAT — live classes included.
              </p>
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

            {/* Package 3: Path Elite */}
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
                Ahsora MedPath elite <Sparkles size={18} color="#D4AF37" />
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.9375rem', marginBottom: '28px', lineHeight: 1.6 }}>
                The ultimate 1-on-1 personalized mentorship from IMAT prep to admission.
              </p>
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
              <button
                onClick={() => setLeadModalOpen(true)}
                className="btn-primary"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #D4AF37, #C59B27)',
                  color: '#0F172A',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(212,175,55,0.3)',
                }}
              >
                Contact Us
              </button>
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
                    desc: 'Biology, Chemistry, Physics & Critical Thinking — live every week.',
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

              <button
                onClick={() => setLeadModalOpen(true)}
                className="btn-primary"
                style={{
                  padding: '14px 30px',
                  fontSize: '0.9375rem',
                  backgroundColor: '#059669',
                  boxShadow: '0 8px 28px -4px rgba(92,237,115,0.4)',
                }}
              >
                <Calendar size={16} />
                <span>Book a Free Session</span>
              </button>
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
                      <button
                        onClick={() => setLeadModalOpen(true)}
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
                        }}
                      >
                        {session.live ? 'Join' : 'RSVP'}
                      </button>
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
                  <button
                    onClick={() => setLeadModalOpen(true)}
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
                    }}
                  >
                    Full Schedule <ChevronRight size={13} />
                  </button>
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
                    href="/portal/tests/tst-01/take"
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

                {/* Analytics mini-card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px 22px',
                    boxShadow: '0 8px 24px -6px rgba(0,0,0,0.15)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>Score Breakdown</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#14532D', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '9999px', padding: '3px 10px' }}>
                      LIVE REPORT
                    </span>
                  </div>
                  {[
                    { label: 'Biology', pct: 84, color: '#059669' },
                    { label: 'Chemistry', pct: 71, color: '#D4AF37' },
                    { label: 'Critical Thinking', pct: 91, color: '#059669' },
                    { label: 'Physics & Maths', pct: 63, color: '#F59E0B' },
                  ].map((bar) => (
                    <div key={bar.label} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{bar.label}</span>
                        <strong style={{ fontSize: '0.75rem', color: '#0F172A' }}>{bar.pct}%</strong>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${bar.pct}%`, height: '100%', backgroundColor: bar.color, borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#64748B' }}>IMAT Score Estimate</span>
                    <strong style={{ color: '#059669', fontSize: '1rem' }}>47.4 / 90</strong>
                  </div>
                </div>
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
            {[
              {
                badge: 'Announcement',
                badgeColor: '#D97706',
                badgeBg: '#FEF3C7',
                borderColor: '#F59E0B',
                date: 'Sep 2026',
                title: 'Admissions Open — Italy 2027/2028',
                desc: 'Applications are now open for the upcoming academic year. Start your IMAT preparation early to secure your seat at a top Italian university.',
                icon: <GraduationCap size={18} color="#D97706" />,
                link: '/universities',
                cta: 'View Universities',
              },
              {
                badge: 'Live Classes',
                badgeColor: '#047857',
                badgeBg: '#ECFDF5',
                borderColor: '#059669',
                date: 'Sep 2026',
                title: 'New Weekly Live Class Schedule Released',
                desc: 'Biology, Chemistry, and Critical Thinking live sessions have been scheduled. Enroll in Mastery or Path Elite to join.',
                icon: <Video size={18} color="#047857" />,
                link: '/courses',
                cta: 'Enroll Now',
              },
              {
                badge: 'Mock Tests',
                badgeColor: '#7C3AED',
                badgeBg: '#F5F3FF',
                borderColor: '#8B5CF6',
                date: 'Aug 2026',
                title: 'IMAT 2026 Mock Test Series — Now Available',
                desc: '12 full-length IMAT mock tests updated with 2026-pattern questions and analytics. Practice under real exam conditions.',
                icon: <FileCheck size={18} color="#7C3AED" />,
                link: '/mock-tests',
                cta: 'Start a Mock Test',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '18px',
                  padding: '24px',
                  borderLeft: `4px solid ${item.borderColor}`,
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  cursor: 'default',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span
                    style={{
                      backgroundColor: item.badgeBg,
                      color: item.badgeColor,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {item.badge}
                  </span>
                  <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 500 }}>
                    {item.date}
                  </span>
                </div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: item.badgeBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px', lineHeight: 1.4 }}>
                  {item.title}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '18px' }}>
                  {item.desc}
                </p>
                <Link
                  href={item.link}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: item.badgeColor,
                  }}
                >
                  {item.cta} <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
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
          9. FAQs (expanded + WhatsApp CTA)
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '90px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
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
              Common Questions
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                color: '#0F172A',
                marginTop: '8px',
                letterSpacing: '-0.5px',
              }}
            >
              IMAT FAQ
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '12px', lineHeight: 1.7 }}>
              Everything you need to know before you start.
            </p>
          </AnimatedSection>

          <div
            className="faq-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
            {faqs.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <AnimatedSection
                  key={idx}
                  animClass="scroll-fade-up"
                  delay={idx * 70}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isOpen ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'border-color 0.25s',
                    boxShadow: isOpen ? '0 4px 16px -4px rgba(34,197,94,0.12)' : 'none',
                  }}
                >
                  <button
                    onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      color: isOpen ? '#0F172A' : '#334155',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      gap: '16px',
                    }}
                  >
                    <span style={{ flex: 1 }}>{faq.q}</span>
                    <span
                      style={{
                        flexShrink: 0,
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isOpen ? '#ECFDF5' : '#FFFFFF',
                        border: `1px solid ${isOpen ? '#A7F3D0' : '#E2E8F0'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isOpen ? '#047857' : '#64748B',
                        transition: 'all 0.25s',
                        transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)',
                      }}
                    >
                      <ChevronDown
                        size={16}
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
                        padding: '0 22px 22px 22px',
                        color: '#475569',
                        fontSize: '0.9375rem',
                        lineHeight: 1.75,
                        borderTop: '1px solid #ECFDF5',
                        paddingTop: '16px',
                        animation: 'fadeInUp 0.3s ease-out forwards',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </AnimatedSection>
              );
            })}
          </div>

          {/* Still have questions */}
          <AnimatedSection
            delay={400}
            style={{
              marginTop: '36px',
              textAlign: 'center',
              padding: '28px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
            }}
          >
            <p style={{ color: '#475569', fontSize: '0.9375rem', marginBottom: '16px' }}>
              Still have questions? Our team is ready to help.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  padding: '11px 22px',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 14px rgba(34,197,94,0.3)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)')}
              >
                <MessageCircle size={15} />
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                className="btn-outline"
                style={{ padding: '11px 22px', fontSize: '0.875rem' }}
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
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
              <button
                onClick={() => setLeadModalOpen(true)}
                className="btn-primary"
                style={{
                  padding: '16px 36px',
                  fontSize: '1rem',
                  backgroundColor: '#059669',
                  boxShadow: '0 8px 28px -4px rgba(5,150,105,0.5)',
                }}
              >
                <span>Book Free 1-on-1 Counselling</span>
                <ArrowRight size={18} />
              </button>
              <Link
                href="/portal/tests/tst-01/take"
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
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.14)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.08)')}
              >
                <FileCheck size={17} />
                <span>Start Free Mock Test</span>
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

