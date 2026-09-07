'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass, GraduationCap, Globe2, ArrowRight, CheckCircle2,
  ChevronDown, ChevronUp, PlayCircle, Target, BarChart2, MessageCircle, AlertCircle, Star,
  Users, Zap, TrendingUp, CheckCircle
} from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import './courses.css';

// ─── Intersection Observer Hook ──────────────────────────────────────────────
function useIntersectionObserver(options = {}) {
  const [elements, setElements] = useState<Element[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [elements, options]);

  const observe = (el: Element | null) => {
    if (el && !elements.includes(el)) {
      setElements(prev => [...prev, el]);
    }
  };

  return { observe };
}

// ─── Floating Corner Actions (Compact, Transparent & Unobtrusive) ─────────────
function FloatingCornerBar({ onTrial }: { onTrial: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'flex-end',
      pointerEvents: 'auto',
      animation: 'fadeInUp 0.3s ease-out'
    }}>
      <a
        href="https://wa.me/393333444479"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(22, 163, 74, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#ffffff',
          padding: '7px 14px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          border: '1px solid rgba(255,255,255,0.25)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.04) translateY(-1px)';
          e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.88)';
        }}
      >
        <MessageCircle size={15} />
        <span>WhatsApp</span>
      </a>

      <button
        onClick={onTrial}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(15, 23, 42, 0.82)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#5CED73',
          padding: '7px 14px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 700,
          border: '1px solid rgba(92, 237, 115, 0.35)',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.04) translateY(-1px)';
          e.currentTarget.style.borderColor = 'rgba(92, 237, 115, 0.8)';
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(92, 237, 115, 0.35)';
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.82)';
        }}
      >
        <Zap size={14} color="#5CED73" />
        <span>Try Free Mock</span>
      </button>
    </div>
  );
}

// ─── Animated Dashboard Mockup Component ─────────────────────────────────────
function AnimatedDashboardMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [questions, setQuestions] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [score, setScore] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    
    // Slow, smooth ease-out count up animation (2.2 seconds)
    const duration = 2200;
    const start = performance.now();
    const targetQ = 2480;
    const targetAcc = 89;
    const targetScore = 54.8;
    const targetHours = 142;

    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      setQuestions(Math.floor(ease * targetQ));
      setAccuracy(Math.floor(ease * targetAcc));
      setScore(Number((ease * targetScore).toFixed(1)));
      setHours(Math.floor(ease * targetHours));

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };
    requestAnimationFrame(frame);
  }, [inView]);

  const weeklyActivity = [
    { day: 'M', height: 60, questions: 45 },
    { day: 'T', height: 85, questions: 62 },
    { day: 'W', height: 50, questions: 38 },
    { day: 'T', height: 100, questions: 78 },
    { day: 'F', height: 70, questions: 50 },
    { day: 'S', height: 90, questions: 70 },
    { day: 'S', height: 95, questions: 75 },
  ];

  const subjects = [
    { name: 'Biology', pct: 94, color: '#10B981' },
    { name: 'Chemistry', pct: 88, color: '#3B82F6' },
    { name: 'Physics & Math', pct: 78, color: '#F59E0B' },
    { name: 'Logical Reasoning', pct: 92, color: '#8B5CF6' },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        backgroundColor: '#0F172A',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        color: '#FFFFFF',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top OS Window Header */}
      <div style={{
        backgroundColor: '#1E293B',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: '8px', fontWeight: 600 }}>
            Ahsora Student OS • Live Dashboard
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
          <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, letterSpacing: '0.5px' }}>
            STUDY SYNC ACTIVE
          </span>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* KPI Counter Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px'
        }}>
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>Solved Questions</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38BDF8', letterSpacing: '-0.5px' }}>
              {questions.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 700, marginTop: '2px' }}>↑ +14 today</div>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>Accuracy Rate</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#5CED73', letterSpacing: '-0.5px' }}>
              {accuracy}%
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600, marginTop: '2px' }}>Top 5% Cohort</div>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>Diagnostic Score</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FBBF24', letterSpacing: '-0.5px' }}>
              {score}<span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>/60</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#5CED73', fontWeight: 700, marginTop: '2px' }}>Qualified Track</div>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>Study Hours</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#C084FC', letterSpacing: '-0.5px' }}>
              {hours}h
            </div>
            <div style={{ fontSize: '0.65rem', color: '#F59E0B', fontWeight: 700, marginTop: '2px' }}>🔥 28-day streak</div>
          </div>
        </div>

        {/* 2-Column Section: Subject Mastery & Weekly Bar Chart */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '14px',
          alignItems: 'stretch'
        }}>
          {/* Subject Mastery Progress Bars */}
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0' }}>Subject Mastery & Syllabus</span>
              <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Target: 85%+</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subjects.map((sub, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '3px' }}>
                    <span style={{ color: '#CBD5E1', fontWeight: 600 }}>{sub.name}</span>
                    <span style={{ color: sub.color, fontWeight: 800 }}>{inView ? sub.pct : 0}%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: inView ? `${sub.pct}%` : '0%',
                      backgroundColor: sub.color,
                      borderRadius: '3px',
                      transition: `width 1.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.15}s`,
                      boxShadow: `0 0 8px ${sub.color}80`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Practice Bar Graph */}
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0' }}>Weekly Activity</span>
              <span style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 700 }}>420 Qs this wk</span>
            </div>
            {/* Graph Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '64px', padding: '4px 0 0', gap: '4px' }}>
              {weeklyActivity.map((bar, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
                  <div
                    title={`${bar.questions} questions`}
                    style={{
                      width: '100%',
                      maxWidth: '14px',
                      height: inView ? `${bar.height}%` : '0%',
                      backgroundColor: i === 6 ? '#5CED73' : '#38BDF8',
                      borderRadius: '3px 3px 0 0',
                      transition: `height 1.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.1}s`,
                      opacity: i === 6 ? 1 : 0.75
                    }}
                  />
                  <span style={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 600 }}>{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Status Banner */}
        <div style={{
          backgroundColor: 'rgba(92, 237, 115, 0.08)',
          border: '1px solid rgba(92, 237, 115, 0.2)',
          borderRadius: '8px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem'
        }}>
          <span style={{ color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} color="#5CED73" />
            <span>Target Match: <strong>University of Messina (Medicine)</strong></span>
          </span>
          <span style={{ color: '#5CED73', fontWeight: 700 }}>Next Mock: Sun 10:00 CET</span>
        </div>
      </div>
    </div>
  );
}

// ─── Programme Recommendation Quiz ─────────────────────────────────────────
function ProgrammeQuiz({ onLead }: { onLead: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const questions = [
    { q: 'Do you prefer independent or guided preparation?', opts: ['Independent — I\'ll drive my own schedule', 'Guided — I want a structured programme'] },
    { q: 'Do you want live, teacher-led classes?', opts: ['No — self-paced study suits me', 'Yes — I learn better with live instruction'] },
    { q: 'Do you need university or admissions support?', opts: ['No — just the exam preparation', 'Yes — I want help beyond the exam'] },
    { q: 'Do you want personal guidance sessions with the founder?', opts: ['Not essential for me', 'Yes, that would really help'] },
  ];

  const getResult = (ans: number[]) => {
    if (ans[2] === 1 || ans[3] === 1) return 'MedPath Elite';
    if (ans[1] === 1) return 'Mastery';
    return 'Ascent';
  };

  const handleAnswer = (idx: number) => {
    const next = [...answers, idx];
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(getResult(next));
    }
  };

  const resultMeta: Record<string, { icon: React.ReactNode; color: string; desc: string }> = {
    'Ascent': { icon: <Compass size={32} color="#3B82F6" />, color: '#3B82F6', desc: 'Self-paced, structured preparation with full portal access.' },
    'Mastery': { icon: <GraduationCap size={32} color="#d4af37" />, color: '#d4af37', desc: 'Live classes, structured prep, and continuous support.' },
    'MedPath Elite': { icon: <Globe2 size={32} color="#1E3A8A" />, color: '#1E3A8A', desc: 'Full IMAT prep plus admissions and university guidance.' },
  };

  if (result) {
    const meta = resultMeta[result];
    return (
      <div className="scroll-scale-in is-visible" style={{ textAlign: 'center', padding: '36px 20px' }}>
        <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ padding: '14px', background: `${meta.color}15`, borderRadius: '50%' }}>
            {meta.icon}
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>Your recommended programme</div>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: meta.color, marginBottom: '10px', letterSpacing: '-0.5px' }}>{result}</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6, fontSize: '0.95rem' }}>{meta.desc}</p>
        <button onClick={onLead} style={{ backgroundColor: meta.color, color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', marginBottom: '14px', width: '100%', transition: 'transform 0.2s', boxShadow: `0 8px 24px -4px ${meta.color}40` }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
          Save My Result &amp; Get Free IMAT Guide
        </button>
        <button onClick={() => { setStep(0); setAnswers([]); setResult(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>Retake quiz</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 28px' }} className="scroll-fade-up is-visible">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>Question {step + 1} of {questions.length}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: '28px', height: '5px', borderRadius: '3px', backgroundColor: i <= step ? 'var(--primary-400)' : 'var(--border-light)', transition: 'background 0.4s ease' }} />
          ))}
        </div>
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.4 }}>{questions[step].q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {questions[step].opts.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)}
            style={{ padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-light)', backgroundColor: '#FFFFFF', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: 'var(--shadow-sm)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-400)'; e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'translateX(0)'; }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { observe } = useIntersectionObserver();

  const programmes = [
    {
      id: 'ascent',
      name: 'IMAT Ascent',
      icon: <Compass size={24} color="#3B82F6" />,
      accentColor: '#3B82F6',
      accentBg: '#EFF6FF',
      badge: null,
      tagline: 'Start with Confidence.',
      desc: 'For students who want to prepare independently with a structured, proven system.',
      price: '$299',
      features: ['Full portal access — 12 months', 'Complete question bank (all subjects)', 'Full-length IMAT mock exams', 'Topic-wise practice sets', 'Performance analytics dashboard', 'Study plan & timeline guide'],
      cta: 'Start Your Ascent',
      founderAccess: 'No direct access — programme built on the founder\'s method',
    },
    {
      id: 'mastery',
      name: 'IMAT Mastery',
      icon: <GraduationCap size={24} color="#d4af37" />,
      accentColor: '#d4af37',
      accentBg: '#fbf8eb',
      badge: 'Most Popular',
      tagline: 'Prepare Without Compromise.',
      desc: 'For students who want structured preparation, live teaching and continuous support.',
      price: '$499',
      features: ['Everything in Ascent', 'Live instructor-led classes (all subjects)', 'Recorded session library (Coming Soon)', 'Scheduled founder group guidance sessions', 'Direct Q&A during live classes', 'Structured weekly timetable'],
      cta: 'Join Mastery',
      founderAccess: 'Scheduled group guidance and motivation sessions',
      isFeatured: true
    },
    {
      id: 'elite',
      name: 'MedPath Elite',
      icon: <Globe2 size={24} color="#1E3A8A" />,
      accentColor: '#1E3A8A',
      accentBg: '#EFF6FF',
      badge: 'Recommended',
      tagline: 'Your Complete Journey.',
      desc: 'For students who want IMAT preparation plus university and admissions support.',
      price: '$999',
      features: ['Same core IMAT prep as Mastery', 'University application guidance', 'Pre-enrolment & Universitaly support', 'Visa process orientation', 'Scholarship guidance', 'Defined direct advisory access with the founder'],
      cta: 'Talk to an Elite Advisor',
      founderAccess: 'Defined direct advisory access as part of admissions support',
    },
  ];

  const faqs = [
    { q: 'Which programme is best for me?', a: 'Use the quiz above — it takes under 30 seconds. Broadly: independent learners → Ascent; those wanting live classes → Mastery; those needing admissions support → MedPath Elite.' },
    { q: 'Are Mastery classes live?', a: 'Yes. Mastery includes scheduled live, teacher-led sessions for all IMAT subjects. All sessions are also recorded and added to your library.' },
    { q: 'Can I ask questions during live classes?', a: 'Yes. Live sessions include real-time Q&A with the subject instructor.' },
    { q: 'Are classes recorded?', a: 'Yes — every live session becomes a permanent part of your resource library immediately after the class ends.' },
    { q: 'How long do I have access to the portal after enrolling?', a: 'Every Ahsora programme includes 12 months of full portal access from the date you enroll — mocks, question banks, and resources for every subject, at your own pace.' },
    { q: 'Is the recorded lecture library complete, or still growing?', a: 'Our recorded lecture library is growing continuously — every live class we run becomes part of it. Biology and Chemistry are available now; Physics is being added this month; Logical Reasoning is in production.' },
    { q: 'What is the difference between Ascent and Mastery?', a: 'Ascent is self-paced — you get the full portal, question bank, mocks and analytics, but no live classes. Mastery adds live instructor-led teaching, session recordings, and founder group guidance sessions.' },
    { q: 'What is the difference between Mastery and MedPath Elite?', a: 'The core IMAT academic preparation is the same. Elite adds university application guidance, pre-enrolment support, visa process orientation, and defined direct advisory access with the founder.' },
    { q: 'Does MedPath Elite include university application support?', a: 'Yes. Elite includes university application guidance, Universitaly pre-enrolment support, scholarship guidance, and visa process orientation.' },
    { q: 'Does Ahsora guarantee admission or a visa?', a: 'No. Ahsora provides preparation, guidance and application support, but admission, scholarship and visa decisions are made by universities and relevant authorities.' },
    { q: 'Will I have direct access to the founder?', a: 'It depends on your programme. Ascent: no direct access — the programme is built on the founder\'s method. Mastery: scheduled group guidance and motivation sessions with the founder. MedPath Elite: defined direct advisory access as part of the admissions support package.' },
  ];

  const contentLibrary = [
    { subject: 'Biology', status: 'In Production', color: '#7C3AED', bg: '#F5F3FF', border: '#C4B5FD' },
    { subject: 'Chemistry', status: 'In Production', color: '#7C3AED', bg: '#F5F3FF', border: '#C4B5FD' },
    { subject: 'Physics', status: 'In Production', color: '#7C3AED', bg: '#F5F3FF', border: '#C4B5FD' },
    { subject: 'Logical Reasoning', status: 'In Production', color: '#7C3AED', bg: '#F5F3FF', border: '#C4B5FD' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>

      {/* ── 01 HERO ─────────────────────────────────────────────────────── */}
      <section className="courses-hero" style={{ position: 'relative', overflow: 'hidden', padding: '90px 0 60px' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image src="/courses-hero-bg.jpg" alt="" fill style={{ objectFit: 'cover', opacity: 0.45 }} priority />
        </div>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span ref={observe} className="section-tagline scroll-fade-up">IMAT Preparation Programmes</span>
          <h1 ref={observe} className="section-title scroll-fade-up" style={{ transitionDelay: '100ms', marginBottom: '18px' }}>
            Your Journey to Medicine<br />in Italy Starts Here
          </h1>
          <p ref={observe} className="scroll-fade-up" style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '14px', transitionDelay: '200ms', padding: '0 20px' }}>
            Prepare for the IMAT. Learn from experienced instructors. Measure your progress. And, when you're ready, let Ahsora guide you through the journey beyond the exam.
          </p>
          <p ref={observe} className="scroll-fade-up" style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '32px', transitionDelay: '300ms' }}>
            Three programmes. One complete ecosystem. Your choice of support.
          </p>
          <div ref={observe} className="scroll-fade-up" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', transitionDelay: '400ms' }}>
            <a href="#programmes" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>Explore Our Programmes</a>
            <a href="#quiz" className="btn-outline" style={{ padding: '14px 26px', fontSize: '1rem', backgroundColor: '#fff' }}>Not Sure Which Is Right For Me?</a>
          </div>
        </div>
      </section>

      {/* ── 02 CHOOSE YOUR PATH ─────────────────────────────────────────── */}
      <section id="programmes" style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">Choose Your Path</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>Choose Your Ahsora Programme</h2>
          </div>
          <p ref={observe} className="scroll-fade-up" style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '48px', fontSize: '1rem', transitionDelay: '100ms' }}>
            Every programme includes <strong style={{ color: 'var(--primary-600)' }}>12 months of full portal access</strong> — mocks, question banks, and resources for every subject, at your own pace.
          </p>
          
          <div ref={observe} className="scroll-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '28px' }}>
            {programmes.map((prog) => (
              <div key={prog.id} className={`prog-card ${prog.isFeatured ? 'prog-card-featured' : ''}`} style={{ '--card-accent': prog.accentColor, '--card-bg': prog.accentBg, padding: '28px 24px', borderRadius: 'var(--radius-xl)' } as React.CSSProperties}>
                {prog.badge && (
                  <span className="prog-badge" style={{ backgroundColor: prog.accentColor }}>{prog.badge}</span>
                )}
                <div className="prog-icon-wrap" style={{ width: '48px', height: '48px', marginBottom: '16px' }}>
                  {prog.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{prog.name}</div>
                  <div style={{ fontWeight: 700, color: prog.accentColor, fontSize: '0.88rem', marginTop: '2px', marginBottom: '10px' }}>{prog.tagline}</div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, flex: 1, marginBottom: '18px' }}>{prog.desc}</p>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-1px' }}>{prog.price}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                  <a href={`#${prog.id}`} style={{ display: 'block', textAlign: 'center', backgroundColor: prog.isFeatured ? prog.accentColor : 'transparent', color: prog.isFeatured ? '#fff' : prog.accentColor, border: `1.5px solid ${prog.accentColor}`, borderRadius: 'var(--radius-full)', padding: '11px', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem', transition: 'all 0.2s', boxShadow: prog.isFeatured ? `0 8px 20px -4px ${prog.accentColor}40` : 'none' }}
                     onMouseEnter={e => !prog.isFeatured && (e.currentTarget.style.backgroundColor = prog.accentBg)}
                     onMouseLeave={e => !prog.isFeatured && (e.currentTarget.style.backgroundColor = 'transparent')}>
                    {prog.cta}
                  </a>
                  <a href={`#${prog.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: prog.accentColor, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', padding: '6px', transition: 'transform 0.2s' }}
                     onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(1px)')}
                     onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                    Jump to details ↓
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 SEE IT IN ACTION ─────────────────────────────────────────── */}
      <section style={{ padding: '70px 0', backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">The Platform</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>See Exactly What You're Getting</h2>
          </div>

          {[
            {
              label: 'Live Classes', question: 'Will I actually be taught?',
              title: "Don't Just Watch. Learn.",
              desc: 'Ask questions in real time, get concepts clarified on the spot, and apply what you learn through IMAT-style problem solving.',
              icon: <PlayCircle size={44} color="var(--primary-600)" />, flip: false,
            },
            {
              label: 'Student Portal', question: 'What will I use every day?',
              title: 'Your Entire Preparation. One Dashboard.',
              desc: 'Question bank, topic-wise practice, full mock exams, and a personal dashboard that tracks everything in one place with real-time score animations and insights.',
              icon: <BarChart2 size={44} color="#3B82F6" />, flip: true,
              isAnimatedDashboard: true,
            },
            {
              label: 'CBT Mock System', question: 'What will practising the IMAT actually feel like?',
              title: 'Practice on the Real Exam Format.',
              desc: 'Timed, scored with the exact IMAT marking formula, so exam day feels familiar before you ever sit the real thing.',
              icon: <Target size={44} color="#7C3AED" />, flip: false,
            },
          ].map((block, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center', marginBottom: i === 2 ? '60px' : '70px', direction: block.flip ? 'rtl' : 'ltr' }}>
              <div style={{ direction: 'ltr' }} ref={observe} className={`scroll-fade-${block.flip ? 'right' : 'left'}`}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{block.label}</span>
                <p style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.9rem', margin: '6px 0 12px' }}>"{block.question}"</p>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>{block.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '1.05rem' }}>{block.desc}</p>
                {i === 2 && (
                  <div style={{ marginTop: '24px' }}>
                    <Link href="/portal/tests" className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>Try a Free Diagnostic Mock →</Link>
                  </div>
                )}
              </div>
              <div style={{ direction: 'ltr' }} ref={observe} className={`scroll-fade-${block.flip ? 'left' : 'right'}`}>
                {block.isAnimatedDashboard ? (
                  <AnimatedDashboardMockup />
                ) : (
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-light)' }}>
                    <Image
                      src={i === 0 ? '/live-classes.jpg' : '/cbt-mock-exam.jpg'}
                      alt={block.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Growing Content Library */}
          <div ref={observe} className="scroll-fade-up" style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '40px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Growing Content Library</span>
                <p style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.9rem', margin: '6px 0 12px' }}>"What's available right now, and what's coming?"</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>A Library That Grows With Every Class.</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.02rem' }}>Every live session becomes a permanent part of your resource library — so the archive of recorded lectures grows continuously, alongside the question banks and mock tests you have full access to from day one.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {contentLibrary.map((item, i) => (
                  <div key={i} className="lib-item" style={{ padding: '12px 18px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{item.subject}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: item.color, backgroundColor: item.bg, padding: '4px 12px', borderRadius: 'var(--radius-full)', border: `1px solid ${item.border}`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pipeline connector */}
          <div ref={observe} className="scroll-scale-in" style={{ marginTop: '48px', backgroundColor: 'var(--text-primary)', borderRadius: 'var(--radius-xl)', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', boxShadow: '0 16px 36px -10px rgba(15,23,42,0.3)' }}>
            {['Course', 'Live Class', 'Question Bank', 'Mock Exam', 'Analytics', 'Improvement'].map((step, i, arr) => (
              <React.Fragment key={i}>
                <span style={{ color: 'var(--primary-400)', fontWeight: 700, fontSize: '0.9rem' }}>{step}</span>
                {i < arr.length - 1 && <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>→</span>}
              </React.Fragment>
            ))}
            <span style={{ color: 'var(--text-light)', fontSize: '0.8rem', width: '100%', textAlign: 'center', marginTop: '6px' }}>One connected system — not three separate tools.</span>
          </div>
        </div>
      </section>

      {/* ── 04 FOUNDER ──────────────────────────────────────────────────── */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
            <div ref={observe} className="scroll-fade-right" style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '36px', border: '1px solid var(--border-light)', position: 'relative' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #fff', boxShadow: 'var(--shadow-md)' }}>
                <Users size={40} color="var(--text-light)" />
              </div>
              <div style={{ color: 'var(--text-light)', fontSize: '0.82rem', fontStyle: 'italic', textAlign: 'center' }}>Real founder photo — coming soon</div>
              <div style={{ backgroundColor: 'var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '14px 20px', textAlign: 'center', width: '100%', marginTop: '12px' }}>
                <div style={{ color: 'var(--primary-400)', fontWeight: 700, fontSize: '0.88rem' }}>Final-Year Medicine & Surgery Student</div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '4px' }}>University of Messina, Italy · Founder, Ahsora Med Academy</div>
              </div>
            </div>
            <div ref={observe} className="scroll-fade-left">
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Meet the Founder</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '10px', marginBottom: '18px', lineHeight: 1.25 }}>Built From Firsthand Experience of the Journey to Medicine in Italy</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '1.05rem', marginBottom: '24px' }}>
                Ahsora was founded by <strong>Ahsan Jahangir</strong>, a final-year Medicine and Surgery student at the University of Messina — one of Italy's public medical universities admitting through the IMAT. The programmes are shaped by firsthand experience of studying for the exam and living the result of it, not built at a distance from the process.
              </p>
              <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '18px 20px', marginBottom: '24px' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '12px' }}>Founder access — by programme:</div>
                {[
                  { prog: 'Ascent', access: 'No direct access — programme built on the founder\'s method' },
                  { prog: 'Mastery', access: 'Scheduled group guidance and motivation sessions' },
                  { prog: 'MedPath Elite', access: 'Defined direct advisory access as part of admissions support' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', fontSize: '0.88rem', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-secondary)', minWidth: '95px' }}>{row.prog}</span>
                    <span style={{ color: 'var(--text-muted)' }}>— {row.access}</span>
                  </div>
                ))}
              </div>
              <a href="https://wa.me/393333444479" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-700)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--primary-600)'}>
                Have a question before you enrol? Ask the Founder <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 LEARNING CYCLE ───────────────────────────────────────────── */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center', marginBottom: '40px' }}>
          <span ref={observe} className="section-tagline scroll-fade-up">The Method</span>
          <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px', marginBottom: '14px' }}>More Than an IMAT Course</h2>
          <p ref={observe} className="scroll-fade-up" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>Every Ahsora programme runs on the same core method, whether you study independently or alongside live instructors:</p>
        </div>
        <div className="container">
          <div ref={observe} className="scroll-stagger" style={{ display: 'flex', overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            {['Learn', 'Practice', 'Test', 'Analyze', 'Improve'].map((step, i, arr) => (
              <div key={i} style={{ flex: '1 1 0', minWidth: '70px', textAlign: 'center', padding: '24px 12px', backgroundColor: i % 2 === 0 ? 'var(--primary-50)' : '#FFFFFF', borderRight: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none', position: 'relative' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.05rem', margin: '0 auto 10px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' }}>{i + 1}</div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 COMPACT SIDE-BY-SIDE COMPARISON TABLE ─────────────────────── */}
      <section style={{ padding: '50px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">Compare Programmes</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>Side-by-Side Comparison</h2>
          </div>
          <div ref={observe} className="scroll-fade-up" style={{ overflowX: 'auto', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px', backgroundColor: '#fff' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <th style={{ padding: '12px 18px', textAlign: 'left', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.78rem', borderBottom: '2px solid var(--border-light)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Core Feature</th>
                  {programmes.map((p) => (
                    <th key={p.id} style={{ padding: '12px 16px', textAlign: 'center', borderBottom: `2px solid ${p.isFeatured ? p.accentColor : 'var(--border-light)'}`, backgroundColor: p.isFeatured ? `${p.accentColor}08` : 'transparent', width: '22%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ padding: '6px', background: p.accentBg, borderRadius: 'var(--radius-sm)', display: 'inline-flex' }}>
                          {p.icon}
                        </div>
                        <span style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{p.name}</span>
                        <span style={{ fontWeight: 900, color: p.accentColor, fontSize: '1.05rem', marginLeft: '4px' }}>{p.price}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: '12 Months Full Portal Access', vals: ['✓ 12 Mo', '✓ 12 Mo', '✓ 12 Mo'], highlight: true },
                  { feature: 'Full Question Bank (All Subjects)', vals: ['✓', '✓', '✓'] },
                  { feature: 'Timed IMAT Mock Exams & Scoring', vals: ['✓', '✓', '✓'] },
                  { feature: 'Live AI & Performance Analytics', vals: ['✓', '✓', '✓'] },
                  { feature: 'Personalized Study Plan Guide', vals: ['✓', '✓', '✓'] },
                  { feature: 'Live Instructor-Led Masterclasses', vals: ['—', '✓', '✓'] },
                  { feature: 'Recorded Lecture Archive Library', vals: ['—', '✓', '✓'] },
                  { feature: 'Founder Group Guidance & Motivation', vals: ['—', '✓', '✓'] },
                  { feature: 'University Application Strategy', vals: ['—', '—', '✓'] },
                  { feature: 'Universitaly Pre-Enrolment & CIMEA Support', vals: ['—', '—', '✓'] },
                  { feature: 'Italian Visa & Scholarship Orientation', vals: ['—', '—', 'VISA_ELITE_NOTE'] },
                  { feature: 'Direct 1-on-1 Founder Advisory Access', vals: ['—', '—', '✓'] },
                ].map((row, i) => (
                  <tr key={i} style={{ backgroundColor: row.highlight ? 'var(--primary-50)' : i % 2 === 0 ? 'var(--bg-subtle)' : '#FFFFFF', transition: 'background-color 0.15s' }} onMouseEnter={e => !row.highlight && (e.currentTarget.style.backgroundColor = '#f8fafc')} onMouseLeave={e => !row.highlight && (e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'var(--bg-subtle)' : '#FFFFFF')}>
                    <td style={{ padding: '7px 18px', color: 'var(--text-secondary)', fontWeight: row.highlight ? 800 : 600, fontSize: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>{row.feature}</td>
                    {row.vals.map((val, j) => (
                      <td key={j} style={{ padding: '7px 16px', textAlign: 'center', borderBottom: '1px solid var(--border-light)', backgroundColor: j === 1 && !row.highlight ? `${programmes[1].accentColor}05` : 'transparent' }}>
                        {val === 'VISA_ELITE_NOTE' ? (
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                            ✓ <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>enhanced for eligible Pakistani applicants — </span>
                            <a href="#elite" style={{ color: 'var(--primary-600)', textDecoration: 'underline', fontWeight: 700 }}>see details</a>
                          </span>
                        ) : (
                          <span style={{ fontWeight: 800, color: val.includes('✓') ? 'var(--primary-600)' : val === '—' ? 'var(--text-light)' : 'var(--text-primary)', fontSize: val === '✓' || val === '—' ? '1.05rem' : '0.85rem' }}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <td style={{ padding: '10px 18px' }} />
                  {programmes.map((p) => (
                    <td key={p.id} style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <a href={`#${p.id}`} style={{ display: 'inline-block', backgroundColor: p.isFeatured ? p.accentColor : '#fff', color: p.isFeatured ? '#fff' : p.accentColor, border: `1.5px solid ${p.accentColor}`, borderRadius: 'var(--radius-full)', padding: '6px 16px', fontWeight: 800, fontSize: '0.8rem', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: p.isFeatured ? `0 4px 12px ${p.accentColor}25` : 'none' }} onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')} onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>{p.cta}</a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 07-09 PROGRAMME DETAILS ─────────────────────────────────────── */}
      {programmes.map((prog, pi) => (
        <section key={prog.id} id={prog.id} style={{ padding: '60px 0', backgroundColor: pi % 2 === 0 ? 'var(--bg-subtle)' : '#FFFFFF', borderTop: '1px solid var(--border-light)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'flex-start' }}>
              <div ref={observe} className="scroll-fade-right">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', backgroundColor: prog.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${prog.accentColor}33`, boxShadow: `0 4px 12px ${prog.accentColor}20` }}>{prog.icon}</div>
                  <div>
                    {prog.badge && <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: prog.accentColor, color: '#fff', borderRadius: 'var(--radius-sm)', padding: '3px 10px', marginBottom: '4px', display: 'inline-block', textTransform: 'uppercase', letterSpacing: '1px' }}>{prog.badge}</span>}
                    <div style={{ fontWeight: 900, fontSize: '1.8rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{prog.name}</div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '24px' }}>{prog.desc}</p>
                {pi > 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', fontStyle: 'italic', fontWeight: 600 }}>
                  {pi === 1 ? 'Everything in Ascent, plus:' : 'Same core IMAT academic preparation as Mastery, plus:'}
                </p>}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {prog.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>
                      <CheckCircle2 size={18} color={prog.accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />{f}
                    </li>
                  ))}
                </ul>
                <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '14px 18px', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} color="var(--text-light)" />
                  <span style={{ fontWeight: 500 }}>Founder access: <strong>{prog.founderAccess}</strong></span>
                </div>
              </div>
              <div ref={observe} className={`sticky-pricing scroll-fade-left ${prog.isFeatured ? 'prog-card-featured' : ''}`} style={{ '--card-accent': prog.accentColor, padding: '32px' } as React.CSSProperties}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px', fontWeight: 700 }}>Starting from</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: prog.accentColor, letterSpacing: '-1.5px', marginBottom: '6px' }}>{prog.price}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px', fontWeight: 600 }}>12 months full portal access included</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a href="https://wa.me/393333444479" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', backgroundColor: prog.accentColor, color: '#fff', borderRadius: 'var(--radius-full)', padding: '14px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: `0 8px 24px -4px ${prog.accentColor}40` }} onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>{prog.cta}</a>
                  <Link href="/portal/tests" style={{ display: 'block', textAlign: 'center', color: prog.accentColor, border: `2px solid ${prog.accentColor}`, borderRadius: 'var(--radius-full)', padding: '12px', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', transition: 'background-color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${prog.accentColor}10`)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>Try Free Diagnostic Mock</Link>
                </div>
              </div>
            </div>
            {prog.id === 'elite' && (
              <div ref={observe} className="scroll-fade-up" style={{ marginTop: '56px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '40px', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '8px' }}>Pakistani Applicants — Specialist Visa & Financial File Support</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.5px' }}>Ahsora Med Academy × LeyNexo Law Firm</h3>
                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px', fontStyle: 'italic' }}>"An additional level of specialist support for eligible Pakistani students applying to study in Italy."</p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '32px' }}>
                  Through our collaboration with LeyNexo Law Firm, eligible Pakistani MedPath Elite students receive specialist assistance with the preparation, organization and review of their financial and visa documentation:
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '36px' }}>
                  {[
                    { title: 'Financial File Preparation', desc: 'Organizing financial documentation into a clear, coherent file' },
                    { title: 'Income & Tax Documentation', desc: 'Guidance on relevant income-tax and revenue documentation where applicable' },
                    { title: 'Bank Statement Supporting Documentation', desc: 'Organizing and supporting the financial evidence presented' },
                    { title: 'Financial Justification', desc: 'Preparing appropriate explanations for the financial information included' },
                    { title: 'Visa File Organization', desc: 'Reviewing and organizing supporting documentation so the file is coherent and professionally prepared' },
                    { title: 'Immigration/Visa Expertise', desc: 'Specialist input from LeyNexo Law Firm on the relevant documentation aspects' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <CheckCircle2 size={20} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '4px' }}>{item.title}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ backgroundColor: 'var(--text-primary)', color: '#fff', borderRadius: 'var(--radius-md)', padding: '18px 24px', fontSize: '0.95rem', fontWeight: 500, fontStyle: 'italic', display: 'inline-block', lineHeight: 1.6 }}>
                  "Ahsora guides the overall admissions journey. LeyNexo provides specialist financial-file and documentation expertise for eligible Pakistani applicants."
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ── 10 QUIZ ─────────────────────────────────────────────────────── */}
      <section id="quiz" style={{ padding: '70px 0', backgroundColor: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(92, 237, 115, 0.1) 0%, transparent 60%)', zIndex: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div ref={observe} className="scroll-fade-right">
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-400)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>20-Second Quiz</span>
              <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: '10px', marginBottom: '18px', letterSpacing: '-0.5px' }}>Which Programme Is Right for You?</h2>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.7, fontSize: '1.05rem' }}>Four quick questions. Immediate result. No sign-up required to see your recommendation.</p>
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: <Compass size={18} color="#3B82F6" />, label: 'Ascent', desc: 'Self-paced prep' },
                  { icon: <GraduationCap size={18} color="#d4af37" />, label: 'Mastery', desc: 'Live classes' },
                  { icon: <Globe2 size={18} color="var(--text-light)" />, label: 'MedPath Elite', desc: 'Full journey support' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>{t.icon}</div>
                    <span style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.95rem' }}>{t.label} — <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>{t.desc}</span></span>
                  </div>
                ))}
              </div>
            </div>
            <div ref={observe} className="scroll-fade-left" style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 24px 50px -12px rgba(0,0,0,0.5)' }}>
              <ProgrammeQuiz onLead={() => setLeadOpen(true)} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 11 FACULTY ──────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">The Team</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>Meet Your Ahsora Faculty</h2>
          </div>
          <div ref={observe} className="scroll-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {['Leadership Team', 'Academic Faculty', 'Student Success & Admissions'].map((group, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', transition: 'transform 0.3s, box-shadow 0.3s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
                  <Users size={28} color="var(--text-light)" />
                </div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{group}</div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontStyle: 'italic' }}>Faculty profiles — coming soon</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12 TESTIMONIALS ─────────────────────────────────────────────── */}
      <section style={{ padding: '60px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">Results</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>Verified Testimonials</h2>
          </div>
          <div ref={observe} className="scroll-scale-in" style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '48px 32px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'inline-flex', padding: '14px', background: '#fffbeb', borderRadius: '50%', marginBottom: '18px' }}>
              <Star size={34} color="#d4af37" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: '640px', margin: '0 auto 12px', fontWeight: 500 }}>
              Student outcomes — coming soon. We'll share real results in the format: <br/>
              <em style={{ color: 'var(--primary-600)', fontWeight: 700, fontStyle: 'normal' }}>Starting point → Programme → IMAT result → University</em>.
            </p>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>We'll never publish invented testimonials or inflated scores.</p>
          </div>
        </div>
      </section>

      {/* ── 13 FAQ ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">Got Questions?</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>Frequently Asked Questions</h2>
          </div>
          <div ref={observe} className="scroll-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', border: openFaq === i ? '1px solid var(--primary-400)' : '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: openFaq === i ? 'var(--shadow-sm)' : 'none' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '0.98rem', color: openFaq === i ? 'var(--primary-700)' : 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '16px', transition: 'color 0.2s' }}>
                  <span style={{ flex: 1, letterSpacing: '-0.3px' }}>{faq.q}</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: openFaq === i ? 'var(--primary-50)' : 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }}>
                    {openFaq === i ? <ChevronUp size={18} color="var(--primary-600)" /> : <ChevronDown size={18} color="var(--text-light)" />}
                  </div>
                </button>
                <div style={{ maxHeight: openFaq === i ? '500px' : '0', opacity: openFaq === i ? 1 : 0, overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <div style={{ padding: '0 22px 20px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.75 }}>
                    <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14 FINAL CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(92, 237, 115, 0.15) 0%, transparent 70%)', zIndex: 0 }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '18px', letterSpacing: '-1px' }}>
            Your Goal Is Medicine.<br />Your Path Starts With Ahsora.
          </h2>
          <p ref={observe} className="scroll-fade-up" style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '36px', transitionDelay: '100ms' }}>Choose the level of preparation and support that fits your journey.</p>
          <div ref={observe} className="scroll-fade-up" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px', transitionDelay: '200ms' }}>
            <a href="#ascent" className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', padding: '14px 28px' }} onMouseEnter={e => {e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}} onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}}>Ascent</a>
            <a href="#mastery" className="btn-primary" style={{ padding: '14px 36px' }}>Mastery</a>
            <a href="#elite" className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', padding: '14px 28px' }} onMouseEnter={e => {e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}} onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}}>MedPath Elite</a>
          </div>
          <div ref={observe} className="scroll-fade-up" style={{ transitionDelay: '300ms' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Not sure which programme is right for you? </span>
            <a href="https://wa.me/393333444479" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-400)', fontWeight: 700, textDecoration: 'none' }}>Talk to an Ahsora Advisor</a>
          </div>
        </div>
      </section>

      {/* Floating corner quick action buttons */}
      <FloatingCornerBar onTrial={() => setLeadOpen(true)} />

      {leadOpen && (
        <LeadCaptureModal
          isOpen={leadOpen}
          onClose={() => setLeadOpen(false)}
        />
      )}
    </div>
  );
}


