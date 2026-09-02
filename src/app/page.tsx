'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
        maxWidth: '160px',
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
        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.875rem', lineHeight: 1.3 }}>
          {label}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, marginTop: '3px' }}>
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
        color: '#22C55E',
        flexShrink: 0,
      }}
    >
      {/* On desktop: right arrow; on mobile: down arrow (handled via CSS) */}
      <ChevronRight size={22} strokeWidth={2.5} className="cycle-arrow-desktop" />
      <ChevronRight size={22} strokeWidth={2.5} style={{ transform: 'rotate(90deg)' }} className="cycle-arrow-mobile" />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '28px 20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px -4px rgba(0,0,0,0.06)',
        flex: 1,
        minWidth: '140px',
      }}
    >
      <div
        style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: accent ? '#22C55E' : '#0F172A',
          letterSpacing: '-1px',
          lineHeight: 1,
          marginBottom: '8px',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600, lineHeight: 1.4 }}>
        {label}
      </div>
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

  // Trigger cycle animation when section enters viewport
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
      a: 'The IMAT covers 4 sections: Biology (18 questions), Chemistry (12 questions), Physics & Mathematics (8 questions), and Critical Thinking & Problem Solving (22 questions). Our curriculum addresses every testable topic in all sections.',
    },
    {
      q: 'How does Ahsora Med Academy prepare me specifically for IMAT?',
      a: 'Our IMAT program includes 60+ hours of subject-specific video lectures, 2,800+ authentic past-paper questions with expert decompositions, 12 full-length CBT mock tests matching the Italian Ministry scoring algorithm (+1.5/−0.4), and live weekly strategy sessions.',
    },
    {
      q: 'How does the mock test engine replicate real IMAT conditions?',
      a: 'Our CBT platform mirrors the exact IMAT format: 100-minute timer, 60 questions, synchronized question palette, mark-for-review flags, and the official +1.5/−0.4 scoring system. Instant analytics show you topic-by-topic breakdowns and peer percentile ranking.',
    },
    {
      q: 'Can international (non-EU) students apply for Italian medical programs?',
      a: "Yes. Italian public universities reserve dedicated non-EU quota seats. We guide you through Universitaly pre-enrolment, document legalization (DOV/CIMEA), and the Type-D student visa — all as part of our post-IMAT admissions support.",
    },
  ];

  const imatSubjects = [
    {
      icon: <Brain size={26} color="#22C55E" />,
      title: 'Critical Thinking',
      desc: 'Argument analysis, problem solving, logical deduction. The highest-weighted section — 22 of 60 questions.',
      topics: '14 core topic areas',
      color: '#F0FFF4',
      border: '#BBF7D0',
    },
    {
      icon: <BookOpen size={26} color="#22C55E" />,
      title: 'Biology',
      desc: 'Cell biology, genetics, human anatomy, physiology, ecology. 18 questions aligned to the official IMAT syllabus.',
      topics: '28 testable topics',
      color: '#F0FFF4',
      border: '#BBF7D0',
    },
    {
      icon: <FlaskConical size={26} color="#D4AF37" />,
      title: 'Chemistry',
      desc: 'Organic & inorganic chemistry, stoichiometry, reactions, thermodynamics. 12 questions, high yield for score gains.',
      topics: '22 testable topics',
      color: '#FFFBEB',
      border: '#FDE68A',
    },
    {
      icon: <Atom size={26} color="#D4AF37" />,
      title: 'Physics & Maths',
      desc: 'Mechanics, waves, electricity, algebra, probability. 8 questions but often the differentiator between top scorers.',
      topics: '18 testable topics',
      color: '#FFFBEB',
      border: '#FDE68A',
    },
  ];

  return (
    <div>
      {/* ══════════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '80px 0 90px 0',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '500px',
            background:
              'radial-gradient(ellipse at top, rgba(92, 237, 115, 0.12) 0%, rgba(255,255,255,0) 65%)',
            pointerEvents: 'none',
          }}
        />
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, #E2E8F0 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            opacity: 0.45,
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>

            {/* IMAT badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F0FFF4',
                color: '#16A34A',
                border: '1px solid #BBF7D0',
                borderRadius: '9999px',
                padding: '6px 20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '28px',
                boxShadow: '0 2px 8px rgba(92,237,115,0.18)',
                letterSpacing: '0.5px',
                animation: 'fadeIn 0.6s ease-out forwards',
              }}
            >
              <Sparkles size={15} />
              <span>IMAT 2026 / 2027 — EXAM PREPARATION NOW OPEN</span>
            </div>

            {/* Main headline */}
            <h1
              style={{
                fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-2px',
                lineHeight: 1.12,
                marginBottom: '24px',
                fontFamily: 'var(--font-serif), Georgia, serif',
                animation: 'fadeInUp 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both',
              }}
            >
              Master the IMAT.{' '}
              <span
                style={{
                  fontStyle: 'italic',
                  color: '#22C55E',
                  fontWeight: 700,
                  display: 'inline-block',
                  position: 'relative',
                }}
              >
                Study Medicine in Italy.
              </span>
            </h1>

            {/* Sub-headline */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
                color: '#475569',
                lineHeight: 1.7,
                marginBottom: '40px',
                maxWidth: '680px',
                margin: '0 auto 40px auto',
                animation: 'fadeInUp 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) both',
              }}
            >
              The only platform built exclusively around the IMAT. Structured subject courses,
              real-condition mock tests, and a cycle of continuous improvement — until you get
              the score to secure your seat.
            </p>

            {/* CTA buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '56px',
                animation: 'fadeInUp 0.7s 0.3s cubic-bezier(0.16,1,0.3,1) both',
              }}
            >
              <Link
                href="/portal/tests/tst-01/take"
                className="btn-primary"
                style={{
                  padding: '16px 36px',
                  fontSize: '1rem',
                  borderRadius: '9999px',
                  backgroundColor: '#22C55E',
                  boxShadow: '0 8px 28px -4px rgba(92,237,115,0.5)',
                }}
              >
                <FileCheck size={18} />
                <span>Start Free IMAT Mock</span>
              </Link>

              <button
                onClick={() => setLeadModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  background: 'none',
                  border: '1.5px solid #E2E8F0',
                  cursor: 'pointer',
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#22C55E';
                  (e.currentTarget as HTMLButtonElement).style.background = '#F0FFF4';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#E2E8F0';
                  (e.currentTarget as HTMLButtonElement).style.background = 'none';
                }}
              >
                <span>Book Free Counselling</span>
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Stats strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '12px',
                animation: 'fadeInUp 0.7s 0.45s cubic-bezier(0.16,1,0.3,1) both',
              }}
            >
              {[
                { v: '2,800+', l: 'IMAT Questions' },
                { v: '12', l: 'Full Mock Tests' },
                { v: '96.8%', l: 'Pass Rate' },
                { v: '3,500+', l: 'Students Trained' },
              ].map((stat) => (
                <div
                  key={stat.l}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '9999px',
                    padding: '8px 20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <span style={{ fontWeight: 800, color: '#22C55E', fontSize: '1rem' }}>
                    {stat.v}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
                    {stat.l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. WHAT IS THE IMAT?
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '90px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <AnimatedSection style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 56px auto' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#22C55E',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              The Exam
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
              Everything you need to know about the{' '}
              <span style={{ color: '#22C55E', fontStyle: 'italic' }}>IMAT</span>
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.7 }}>
              The International Medical Admissions Test is Italy's gateway to English-taught
              medicine. 60 questions. 100 minutes. Four subjects. One chance per year. We prepare
              you to get it right.
            </p>
          </AnimatedSection>

          {/* Subject cards — staggered */}
          <div
            ref={subjectsRef}
            className="scroll-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {imatSubjects.map((subj) => (
              <div
                key={subj.title}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${subj.border}`,
                  borderRadius: '16px',
                  padding: '28px 24px',
                  boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    '0 12px 28px -6px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    '0 2px 12px -4px rgba(0,0,0,0.06)';
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: subj.color,
                    border: `1px solid ${subj.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  {subj.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    color: '#0F172A',
                    marginBottom: '8px',
                    fontWeight: 700,
                  }}
                >
                  {subj.title}
                </h3>
                <p
                  style={{
                    color: '#64748B',
                    fontSize: '0.875rem',
                    lineHeight: 1.65,
                    marginBottom: '14px',
                  }}
                >
                  {subj.desc}
                </p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#16A34A',
                    backgroundColor: '#F0FFF4',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    border: '1px solid #BBF7D0',
                  }}
                >
                  <CheckCircle2 size={12} />
                  {subj.topics}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. LEARNING CYCLE
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <AnimatedSection style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 64px auto' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#22C55E',
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
              <span style={{ color: '#22C55E', fontStyle: 'italic' }}>Learning Cycle</span>
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.7 }}>
              Improvement is not linear — it's cyclical. Our platform is designed around a
              structured loop that continuously narrows your gaps until your IMAT score is
              where it needs to be.
            </p>
          </AnimatedSection>

          {/* Cycle diagram */}
          <div ref={cycleRef}>
            {/* Nodes row */}
            <div className="cycle-nodes-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                marginBottom: '48px',
                flexWrap: 'nowrap',
              }}
            >
              <CycleNode
                icon={<GraduationCap size={30} color="#FFFFFF" />}
                label="Ahsora Med Academy"
                sublabel="Start your IMAT journey"
                color="#22C55E"
                delay={0}
                isActive={cycleVisible}
              />
              <CycleArrow delay={300} />
              <CycleNode
                icon={<Target size={30} color="#FFFFFF" />}
                label="Analyze"
                sublabel="Identify weak topics"
                color="#16A34A"
                delay={400}
                isActive={cycleVisible}
              />
              <CycleArrow delay={700} />
              <CycleNode
                icon={<TrendingUp size={30} color="#FFFFFF" />}
                label="Improve"
                sublabel="Targeted practice & review"
                color="#D4AF37"
                delay={800}
                isActive={cycleVisible}
              />
              <CycleArrow delay={1100} />
              <CycleNode
                icon={<RotateCcw size={30} color="#FFFFFF" />}
                label="Repeat"
                sublabel="Score higher each cycle"
                color="#22C55E"
                delay={1200}
                isActive={cycleVisible}
              />
            </div>

            {/* Cycle step cards */}
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
                  icon: <BookOpen size={20} color="#22C55E" />,
                  title: 'Learn with structured courses',
                  desc: 'High-yield subject modules, video lectures, and downloadable summary sheets — covering every IMAT topic in priority order.',
                  link: '/courses',
                  cta: 'Browse IMAT Courses',
                },
                {
                  step: '02',
                  icon: <FileCheck size={20} color="#22C55E" />,
                  title: 'Test under real conditions',
                  desc: '60-question, 100-minute mock tests with the exact Italian Ministry scoring: +1.5 correct, −0.4 wrong, 0 unanswered.',
                  link: '/mock-tests',
                  cta: 'View Mock Tests',
                },
                {
                  step: '03',
                  icon: <Zap size={20} color="#D4AF37" />,
                  title: 'Analyze & close gaps',
                  desc: 'Instant subject-by-subject breakdowns, peer percentile ranking, and AI-curated weak-topic drill sets after every test.',
                  link: '/portal/tests/tst-01/take',
                  cta: 'See Analytics Demo',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '28px 24px',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      '0 12px 28px -6px rgba(0,0,0,0.09)';
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
                        color: '#22C55E',
                        backgroundColor: '#F0FFF4',
                        border: '1px solid #BBF7D0',
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
                      color: '#16A34A',
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
          4. MOCK TEST BANNER
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <AnimatedSection animClass="scroll-scale-in">
            <div
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)',
                borderRadius: '24px',
                padding: '60px 48px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative circles */}
              <div
                style={{
                  position: 'absolute',
                  top: '-60px',
                  right: '-60px',
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-40px',
                  right: '200px',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '9999px',
                    padding: '4px 14px',
                    marginBottom: '16px',
                    letterSpacing: '1px',
                  }}
                >
                  LIVE IMAT SIMULATOR
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
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
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: '1rem',
                    lineHeight: 1.65,
                    marginBottom: '28px',
                  }}
                >
                  60 questions, 100 minutes, official scoring (+1.5/−0.4). Synchronized countdown
                  timer, question palette, mark-for-review flags, and instant topic analytics.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    href="/portal/tests/tst-01/take"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#FFFFFF',
                      color: '#15803D',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      padding: '13px 28px',
                      borderRadius: '9999px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                        '0 8px 24px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                        '0 4px 16px rgba(0,0,0,0.15)';
                    }}
                  >
                    <FileCheck size={18} />
                    <span>Start Free Mock Test</span>
                  </Link>
                  <Link
                    href="/mock-tests"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      padding: '13px 28px',
                      borderRadius: '9999px',
                      border: '1.5px solid rgba(255,255,255,0.35)',
                      transition: 'background 0.2s',
                    }}
                  >
                    <span>View All Mocks</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Analytics mini-card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 12px 32px -8px rgba(0,0,0,0.18)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px',
                  }}
                >
                  <strong style={{ fontSize: '0.9375rem', color: '#0F172A' }}>
                    Post-Mock Analytics
                  </strong>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#14532D',
                      backgroundColor: '#F0FFF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: '9999px',
                      padding: '3px 10px',
                    }}
                  >
                    LIVE REPORT
                  </span>
                </div>
                {[
                  { label: 'Biology', pct: 84, color: '#22C55E' },
                  { label: 'Chemistry', pct: 71, color: '#D4AF37' },
                  { label: 'Critical Thinking', pct: 91, color: '#22C55E' },
                  { label: 'Physics & Maths', pct: 63, color: '#F59E0B' },
                ].map((bar) => (
                  <div key={bar.label} style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '5px',
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{bar.label}</span>
                      <strong style={{ fontSize: '0.8rem', color: '#0F172A' }}>{bar.pct}%</strong>
                    </div>
                    <div
                      style={{
                        height: '7px',
                        backgroundColor: '#F1F5F9',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${bar.pct}%`,
                          height: '100%',
                          backgroundColor: bar.color,
                          borderRadius: '4px',
                          transition: 'width 1.2s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '14px',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem',
                  }}
                >
                  <span style={{ color: '#64748B' }}>IMAT Score Estimate</span>
                  <strong style={{ color: '#22C55E', fontSize: '1rem' }}>47.4 / 90</strong>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. STATS STRIP
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <AnimatedSection style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#22C55E',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              By the numbers
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                color: '#0F172A',
                marginTop: '8px',
                letterSpacing: '-0.5px',
              }}
            >
              Proven IMAT results
            </h2>
          </AnimatedSection>

          <div
            ref={statsRef}
            className="scroll-stagger"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
          >
            <StatCard value="2,800+" label="IMAT Questions with Full Explanations" accent />
            <StatCard value="12" label="Full-Length CBT Mock Tests" />
            <StatCard value="96.8%" label="Student Pass Rate" accent />
            <StatCard value="3,500+" label="IMAT Students Trained Globally" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5.5 PACKAGES
      ══════════════════════════════════════════════════ */}
      <section id="packages" style={{ padding: '90px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <AnimatedSection style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#22C55E',
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
          </AnimatedSection>

          <div
            className="scroll-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              alignItems: 'stretch',
            }}
            ref={useScrollAnimation() as React.RefObject<HTMLDivElement>}
          >
            {/* Package 1: Ascend */}
            <div
              style={{
                border: '2px solid #94A3B8',
                borderRadius: '16px',
                padding: '40px 30px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFFFFF',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px -6px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                Ahsora IMAT Ascend
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '24px' }}>
                The perfect starter plan for self-paced study.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Full Video Library Access',
                  'Comprehensive Study Notes',
                  '1,000+ Practice Questions',
                  '3 Full-Length Mock Exams',
                ].map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.9375rem' }}>
                    <CheckCircle2 size={18} color="#22C55E" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn-outline" style={{ width: '100%', textAlign: 'center', padding: '12px', display: 'block' }}>
                Select Plan
              </Link>
            </div>

            {/* Package 2: Mastery (Popular) */}
            <div
              style={{
                border: '2px solid #22C55E',
                borderRadius: '16px',
                padding: '40px 30px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#F0FFF4',
                position: 'relative',
                boxShadow: '0 12px 28px -6px rgba(34,197,94,0.15)',
              }}
            >
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#22C55E', color: '#FFF', padding: '4px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>
                MOST POPULAR
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                Ahsora IMAT Mastery
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '24px' }}>
                Everything you need to confidently ace the exam.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Everything in Ascend',
                  'Live Group Q&A Sessions',
                  '2,800+ Practice Questions',
                  '12 Full-Length Mock Exams',
                  'In-depth Performance Analytics',
                ].map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.9375rem', fontWeight: i === 0 ? 600 : 400 }}>
                    <CheckCircle2 size={18} color="#22C55E" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn-primary" style={{ width: '100%', textAlign: 'center', padding: '12px', backgroundColor: '#22C55E', display: 'block' }}>
                Select Plan
              </Link>
            </div>

            {/* Package 3: Path Elite */}
            <div
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '40px 30px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px -6px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Ahsora Path Elite <Sparkles size={18} color="#D4AF37" />
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.9375rem', marginBottom: '24px' }}>
                The ultimate 1-on-1 personalized mentorship.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Everything in Mastery',
                  '1-on-1 Personal Mentorship',
                  'Customized Study Plans',
                  'University Application Assistance',
                  'Visa & Documentation Support',
                ].map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '0.9375rem', fontWeight: i === 0 ? 600 : 400 }}>
                    <CheckCircle2 size={18} color="#D4AF37" />
                    {feat}
                  </li>
                ))}
              </ul>
              <button onClick={() => setLeadModalOpen(true)} className="btn-primary" style={{ width: '100%', textAlign: 'center', padding: '12px', backgroundColor: '#D4AF37', color: '#0F172A', border: 'none' }}>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. FAQs
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#22C55E',
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
          </AnimatedSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <AnimatedSection
                  key={idx}
                  animClass="scroll-fade-up"
                  delay={idx * 80}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isOpen ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'border-color 0.25s',
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
                      color: '#0F172A',
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
                        backgroundColor: isOpen ? '#F0FFF4' : '#F8FAFC',
                        border: `1px solid ${isOpen ? '#BBF7D0' : '#E2E8F0'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        color: isOpen ? '#16A34A' : '#64748B',
                        fontWeight: 700,
                        transition: 'all 0.2s',
                      }}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 22px 20px 22px',
                        color: '#475569',
                        fontSize: '0.9375rem',
                        lineHeight: 1.7,
                        borderTop: '1px solid #F0FFF4',
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
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6.5 NEWS & UPDATES
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection animClass="scroll-fade-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-1px',
                marginBottom: '16px',
              }}
            >
              Latest News & Updates
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.1rem' }}>
              Stay informed with the latest announcements and important dates.
            </p>
          </AnimatedSection>

          <AnimatedSection
            animClass="scroll-fade-up"
            delay={100}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px 32px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#F0FFF4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bell size={28} color="#22C55E" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#D97706',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Announcement
                </span>
                <span style={{ color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500 }}>
                  Recently Added
                </span>
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '6px',
                }}
              >
                Admissions Open in Italy 2027/2028
              </h3>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.5 }}>
                Applications are now open for the upcoming academic year. Start your IMAT preparation early to secure your spot at top Italian medical universities!
              </p>
            </div>
            <div style={{ flexShrink: 0, display: 'none' }} className="desktop-nav">
              <Link
                href="/universities"
                className="btn-outline"
                style={{ padding: '10px 20px', fontSize: '0.9375rem' }}
              >
                View Universities
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '90px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <AnimatedSection animClass="scroll-scale-in" style={{ textAlign: 'center' }}>
            <div
              style={{
                backgroundColor: '#F0FFF4',
                border: '1px solid #BBF7D0',
                borderRadius: '24px',
                padding: '60px 48px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative */}
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: 'rgba(92,237,115,0.1)',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  boxShadow: '0 8px 20px -4px rgba(92,237,115,0.5)',
                }}
              >
                <GraduationCap size={26} color="#FFFFFF" />
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  color: '#0F172A',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  marginBottom: '14px',
                }}
              >
                Ready to crack the IMAT?
              </h2>
              <p
                style={{
                  color: '#475569',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  marginBottom: '32px',
                  maxWidth: '520px',
                  margin: '0 auto 32px auto',
                }}
              >
                Book a free 1-on-1 session with our IMAT mentors. Get a personalized study plan,
                subject audit, and mock test schedule built around your exam date.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => setLeadModalOpen(true)}
                  className="btn-primary"
                  style={{
                    padding: '15px 36px',
                    fontSize: '1rem',
                    backgroundColor: '#22C55E',
                    boxShadow: '0 8px 28px -4px rgba(92,237,115,0.45)',
                  }}
                >
                  <span>Book Free 1-on-1 Counselling</span>
                  <ArrowRight size={18} />
                </button>
                <Link
                  href="/courses"
                  className="btn-outline"
                  style={{ padding: '15px 28px', fontSize: '1rem' }}
                >
                  <span>Browse IMAT Courses</span>
                </Link>
              </div>
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
