'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Compass, GraduationCap, Globe2, ArrowRight, CheckCircle2,
  ChevronDown, ChevronUp, PlayCircle, Target, BarChart2, MessageCircle, AlertCircle, Star,
  Users
} from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import './courses.css'; // Import premium styles

// ─── Intersection Observer Hook ──────────────────────────────────────────────
function useIntersectionObserver(options = {}) {
  const [elements, setElements] = useState<Element[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Optional: observer.unobserve(entry.target) if we only want it to run once
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px', ...options });

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

// ─── Sticky mobile bar ──────────────────────────────────────────────────────
function StickyMobileBar({ onTrial }: { onTrial: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return show ? (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '12px 20px', display: 'flex', gap: '10px', justifyContent: 'center',
      paddingBottom: 'env(safe-area-inset-bottom, 12px)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
    }} className="mobile-only scroll-fade-up is-visible">
      <button onClick={onTrial} className="btn-primary" style={{ flex: 1, maxWidth: '180px', fontSize: '0.85rem', padding: '10px', boxShadow: 'none' }}>Try Free Mock</button>
      <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer"
        style={{ flex: 1, maxWidth: '180px', backgroundColor: '#16A34A', color: '#fff', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.85rem', padding: '10px', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <MessageCircle size={16} /> WhatsApp
      </a>
    </div>
  ) : null;
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
      <div className="scroll-scale-in is-visible" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ padding: '16px', background: `${meta.color}15`, borderRadius: '50%' }}>
            {meta.icon}
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Your recommended programme</div>
        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: meta.color, marginBottom: '12px', letterSpacing: '-0.5px' }}>{result}</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>{meta.desc}</p>
        <button onClick={onLead} style={{ backgroundColor: meta.color, color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '14px 28px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', marginBottom: '16px', width: '100%', transition: 'transform 0.2s', boxShadow: `0 8px 24px -4px ${meta.color}40` }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
          Save My Result &amp; Get Free IMAT Guide
        </button>
        <button onClick={() => { setStep(0); setAnswers([]); setResult(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '0.88rem', cursor: 'pointer', textDecoration: 'underline' }}>Retake quiz</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 32px' }} className="scroll-fade-up is-visible">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Question {step + 1} of {questions.length}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: '32px', height: '6px', borderRadius: '3px', backgroundColor: i <= step ? 'var(--primary-400)' : 'var(--border-light)', transition: 'background 0.4s ease' }} />
          ))}
        </div>
      </div>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '28px', lineHeight: 1.4 }}>{questions[step].q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {questions[step].opts.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)}
            style={{ padding: '18px 24px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-light)', backgroundColor: '#FFFFFF', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: 'var(--shadow-sm)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-400)'; e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
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
      icon: <Compass size={28} color="#3B82F6" />,
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
      icon: <GraduationCap size={28} color="#d4af37" />,
      accentColor: '#d4af37',
      accentBg: '#fbf8eb',
      badge: 'Recommended',
      tagline: 'Prepare Without Compromise.',
      desc: 'For students who want structured preparation, live teaching and continuous support.',
      price: '$499',
      features: ['Everything in Ascent', 'Live instructor-led classes (all subjects)', 'Recorded session library', 'Scheduled founder group guidance sessions', 'Direct Q&A during live classes', 'Structured weekly timetable'],
      cta: 'Join Mastery',
      founderAccess: 'Scheduled group guidance and motivation sessions',
      isFeatured: true
    },
    {
      id: 'elite',
      name: 'MedPath Elite',
      icon: <Globe2 size={28} color="#1E3A8A" />,
      accentColor: '#1E3A8A',
      accentBg: '#EFF6FF',
      badge: 'Flagship',
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
    { subject: 'Biology', status: 'Available', color: '#16A34A', bg: 'var(--success-bg)', border: 'var(--success-border)' },
    { subject: 'Chemistry', status: 'Available', color: '#16A34A', bg: 'var(--success-bg)', border: 'var(--success-border)' },
    { subject: 'Physics', status: 'Adding this month', color: '#d4af37', bg: 'var(--warning-bg)', border: 'var(--warning-border)' },
    { subject: 'Logical Reasoning', status: 'In production', color: '#7C3AED', bg: '#F5F3FF', border: '#C4B5FD' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>

      {/* ── 01 HERO ─────────────────────────────────────────────────────── */}
      <section className="courses-hero">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span ref={observe} className="section-tagline scroll-fade-up">IMAT Preparation Programmes</span>
          <h1 ref={observe} className="section-title scroll-fade-up" style={{ transitionDelay: '100ms' }}>
            Your Journey to Medicine<br />in Italy Starts Here
          </h1>
          <p ref={observe} className="scroll-fade-up" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '16px', transitionDelay: '200ms', padding: '0 20px' }}>
            Prepare for the IMAT. Learn from experienced instructors. Measure your progress. And, when you're ready, let Ahsora guide you through the journey beyond the exam.
          </p>
          <p ref={observe} className="scroll-fade-up" style={{ color: 'var(--text-light)', fontSize: '1rem', marginBottom: '40px', transitionDelay: '300ms' }}>
            Three programmes. One complete ecosystem. Your choice of support.
          </p>
          <div ref={observe} className="scroll-fade-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', transitionDelay: '400ms' }}>
            <a href="#programmes" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>Explore Our Programmes</a>
            <a href="#quiz" className="btn-outline" style={{ padding: '16px 28px', fontSize: '1.05rem', backgroundColor: '#fff' }}>Not Sure Which Is Right For Me?</a>
          </div>
        </div>
      </section>

      {/* ── 02 CHOOSE YOUR PATH ─────────────────────────────────────────── */}
      <section id="programmes" style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">Choose Your Path</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>Choose Your Ahsora Programme</h2>
          </div>
          <p ref={observe} className="scroll-fade-up" style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '60px', fontSize: '1.05rem', transitionDelay: '100ms' }}>
            Every programme includes <strong style={{ color: 'var(--primary-600)' }}>12 months of full portal access</strong> — mocks, question banks, and resources for every subject, at your own pace.
          </p>
          
          <div ref={observe} className="scroll-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {programmes.map((prog) => (
              <div key={prog.id} className={`prog-card ${prog.isFeatured ? 'prog-card-featured' : ''}`} style={{ '--card-accent': prog.accentColor, '--card-bg': prog.accentBg } as React.CSSProperties}>
                {prog.badge && (
                  <span className="prog-badge">{prog.badge}</span>
                )}
                <div className="prog-icon-wrap">
                  {prog.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{prog.name}</div>
                  <div style={{ fontWeight: 700, color: prog.accentColor, fontSize: '0.95rem', marginTop: '4px', marginBottom: '16px' }}>{prog.tagline}</div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, flex: 1, marginBottom: '24px' }}>{prog.desc}</p>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '-1px' }}>{prog.price}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                  <a href={`#${prog.id}`} style={{ display: 'block', textAlign: 'center', backgroundColor: prog.isFeatured ? prog.accentColor : 'transparent', color: prog.isFeatured ? '#fff' : prog.accentColor, border: `1.5px solid ${prog.accentColor}`, borderRadius: 'var(--radius-full)', padding: '14px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', transition: 'all 0.2s', boxShadow: prog.isFeatured ? `0 8px 20px -4px ${prog.accentColor}40` : 'none' }}
                     onMouseEnter={e => !prog.isFeatured && (e.currentTarget.style.backgroundColor = prog.accentBg)}
                     onMouseLeave={e => !prog.isFeatured && (e.currentTarget.style.backgroundColor = 'transparent')}>
                    {prog.cta}
                  </a>
                  <Link href="/portal/tests" style={{ display: 'block', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', padding: '8px' }}>
                    Try a Free Diagnostic Mock First →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 SEE IT IN ACTION ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">The Platform</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>See Exactly What You're Getting</h2>
          </div>

          {[
            {
              label: 'Live Classes', question: 'Will I actually be taught?',
              title: "Don't Just Watch. Learn.",
              desc: 'Ask questions in real time, get concepts clarified on the spot, and apply what you learn through IMAT-style problem solving.',
              icon: <PlayCircle size={48} color="var(--primary-600)" />, flip: false,
            },
            {
              label: 'Student Portal', question: 'What will I use every day?',
              title: 'Your Entire Preparation. One Dashboard.',
              desc: 'Question bank, topic-wise practice, full mock exams, and a personal dashboard that tracks everything in one place.',
              icon: <BarChart2 size={48} color="#3B82F6" />, flip: true,
            },
            {
              label: 'CBT Mock System', question: 'What will practising the IMAT actually feel like?',
              title: 'Practice on the Real Exam Format.',
              desc: 'Timed, scored with the exact IMAT marking formula, so exam day feels familiar before you ever sit the real thing.',
              icon: <Target size={48} color="#7C3AED" />, flip: false,
            },
          ].map((block, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '60px', alignItems: 'center', marginBottom: '100px', direction: block.flip ? 'rtl' : 'ltr' }}>
              <div style={{ direction: 'ltr' }} ref={observe} className={`scroll-fade-${block.flip ? 'right' : 'left'}`}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{block.label}</span>
                <p style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.95rem', margin: '8px 0 16px' }}>"{block.question}"</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>{block.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>{block.desc}</p>
                {i === 2 && (
                  <div style={{ marginTop: '32px' }}>
                    <Link href="/portal/tests" className="btn-primary">Try a Free Diagnostic Mock →</Link>
                  </div>
                )}
              </div>
              <div style={{ direction: 'ltr' }} ref={observe} className={`showcase-block scroll-fade-${block.flip ? 'left' : 'right'}`}>
                <div style={{ padding: '24px', background: 'var(--bg-subtle)', borderRadius: '50%', marginBottom: '16px' }}>
                  {block.icon}
                </div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', textAlign: 'center', fontStyle: 'italic' }}>Illustrative preview — screenshots coming soon</div>
              </div>
            </div>
          ))}

          {/* Growing Content Library */}
          <div ref={observe} className="scroll-fade-up" style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '56px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Growing Content Library</span>
                <p style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.95rem', margin: '8px 0 16px' }}>"What's available right now, and what's coming?"</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>A Library That Grows With Every Class.</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>Every live session becomes a permanent part of your resource library — so the archive of recorded lectures grows continuously, alongside the question banks and mock tests you have full access to from day one.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {contentLibrary.map((item, i) => (
                  <div key={i} className="lib-item">
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{item.subject}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.color, backgroundColor: item.bg, padding: '6px 14px', borderRadius: 'var(--radius-full)', border: `1px solid ${item.border}`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pipeline connector */}
          <div ref={observe} className="scroll-scale-in" style={{ marginTop: '64px', backgroundColor: 'var(--text-primary)', borderRadius: 'var(--radius-xl)', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', boxShadow: '0 20px 40px -10px rgba(15,23,42,0.3)' }}>
            {['Course', 'Live Class', 'Question Bank', 'Mock Exam', 'Analytics', 'Improvement'].map((step, i, arr) => (
              <React.Fragment key={i}>
                <span style={{ color: 'var(--primary-400)', fontWeight: 700, fontSize: '0.95rem' }}>{step}</span>
                {i < arr.length - 1 && <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>→</span>}
              </React.Fragment>
            ))}
            <span style={{ color: 'var(--text-light)', fontSize: '0.85rem', width: '100%', textAlign: 'center', marginTop: '8px' }}>One connected system — not three separate tools.</span>
          </div>
        </div>
      </section>

      {/* ── 04 FOUNDER ──────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div ref={observe} className="scroll-fade-right" style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '48px', border: '1px solid var(--border-light)', position: 'relative' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #fff', boxShadow: 'var(--shadow-md)' }}>
                <Users size={48} color="var(--text-light)" />
              </div>
              <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center' }}>Real founder photo — coming soon</div>
              <div style={{ backgroundColor: 'var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '16px 24px', textAlign: 'center', width: '100%', marginTop: '20px' }}>
                <div style={{ color: 'var(--primary-400)', fontWeight: 700, fontSize: '0.9rem' }}>Final-Year Medicine & Surgery Student</div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '6px' }}>University of Messina, Italy · Founder, Ahsora Med Academy</div>
              </div>
            </div>
            <div ref={observe} className="scroll-fade-left">
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Meet the Founder</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px', marginBottom: '24px', lineHeight: 1.2 }}>Built From Firsthand Experience of the Journey to Medicine in Italy</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.1rem', marginBottom: '32px' }}>
                Ahsora was founded by a final-year Medicine and Surgery student at the University of Messina — one of Italy's public medical universities admitting through the IMAT. The programmes are shaped by firsthand experience of studying for the exam and living the result of it, not built at a distance from the process.
              </p>
              <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '24px', marginBottom: '32px' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '16px' }}>Founder access — by programme:</div>
                {[
                  { prog: 'Ascent', access: 'No direct access — programme built on the founder\'s method' },
                  { prog: 'Mastery', access: 'Scheduled group guidance and motivation sessions' },
                  { prog: 'MedPath Elite', access: 'Defined direct advisory access as part of admissions support' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '0.95rem', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-secondary)', minWidth: '100px' }}>{row.prog}</span>
                    <span style={{ color: 'var(--text-muted)' }}>— {row.access}</span>
                  </div>
                ))}
              </div>
              <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--primary-600)', fontWeight: 800, textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-700)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--primary-600)'}>
                Have a question before you enrol? Ask the Founder <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 LEARNING CYCLE ───────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center', marginBottom: '60px' }}>
          <span ref={observe} className="section-tagline scroll-fade-up">The Method</span>
          <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px', marginBottom: '20px' }}>More Than an IMAT Course</h2>
          <p ref={observe} className="scroll-fade-up" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>Every Ahsora programme runs on the same core method, whether you study independently or alongside live instructors:</p>
        </div>
        <div className="container">
          <div ref={observe} className="scroll-stagger" style={{ display: 'flex', overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            {['Learn', 'Practice', 'Test', 'Analyze', 'Improve'].map((step, i, arr) => (
              <div key={i} style={{ flex: '1 1 0', minWidth: '80px', textAlign: 'center', padding: '36px 16px', backgroundColor: i % 2 === 0 ? 'var(--primary-50)' : '#FFFFFF', borderRight: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none', position: 'relative' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' }}>{i + 1}</div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 COMPARISON TABLE ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">Compare Programmes</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>Side-by-Side Comparison</h2>
          </div>
          <div ref={observe} className="scroll-fade-up" style={{ overflowX: 'auto', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px', backgroundColor: '#fff' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <th style={{ padding: '24px', textAlign: 'left', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.9rem', borderBottom: '2px solid var(--border-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Feature</th>
                  {programmes.map((p) => (
                    <th key={p.id} style={{ padding: '24px', textAlign: 'center', borderBottom: `2px solid ${p.isFeatured ? p.accentColor : 'var(--border-light)'}`, backgroundColor: p.isFeatured ? `${p.accentColor}08` : 'transparent', width: '22%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ padding: '12px', background: p.accentBg, borderRadius: 'var(--radius-md)' }}>
                          {p.icon}
                        </div>
                        <span style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{p.name}</span>
                        <span style={{ fontWeight: 900, color: p.accentColor, fontSize: '1.25rem' }}>{p.price}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Portal access duration', vals: ['12 months', '12 months', '12 months'], highlight: true },
                  { feature: 'Full question bank', vals: ['✓', '✓', '✓'] },
                  { feature: 'IMAT mock exams', vals: ['✓', '✓', '✓'] },
                  { feature: 'Performance analytics', vals: ['✓', '✓', '✓'] },
                  { feature: 'Study plan & timeline', vals: ['✓', '✓', '✓'] },
                  { feature: 'Live instructor-led classes', vals: ['—', '✓', '✓'] },
                  { feature: 'Recorded session library', vals: ['—', '✓', '✓'] },
                  { feature: 'Founder group guidance sessions', vals: ['—', '✓', '✓'] },
                  { feature: 'University application guidance', vals: ['—', '—', '✓'] },
                  { feature: 'Pre-enrolment / Universitaly support', vals: ['—', '—', '✓'] },
                  { feature: 'Visa process orientation', vals: ['—', '—', '✓'] },
                  { feature: 'Scholarship guidance', vals: ['—', '—', '✓'] },
                  { feature: 'Direct founder advisory access', vals: ['—', '—', '✓'] },
                ].map((row, i) => (
                  <tr key={i} style={{ backgroundColor: row.highlight ? 'var(--primary-50)' : i % 2 === 0 ? 'var(--bg-subtle)' : '#FFFFFF', transition: 'background-color 0.2s' }} onMouseEnter={e => !row.highlight && (e.currentTarget.style.backgroundColor = '#f8fafc')} onMouseLeave={e => !row.highlight && (e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'var(--bg-subtle)' : '#FFFFFF')}>
                    <td style={{ padding: '18px 24px', color: 'var(--text-secondary)', fontWeight: row.highlight ? 800 : 600, fontSize: '0.95rem', borderBottom: '1px solid var(--border-light)' }}>{row.feature}</td>
                    {row.vals.map((val, j) => (
                      <td key={j} style={{ padding: '18px 24px', textAlign: 'center', borderBottom: '1px solid var(--border-light)', backgroundColor: j === 1 && !row.highlight ? `${programmes[1].accentColor}05` : 'transparent' }}>
                        <span style={{ fontWeight: 800, color: val === '✓' ? 'var(--primary-600)' : val === '—' ? 'var(--text-light)' : 'var(--text-primary)', fontSize: val === '✓' || val === '—' ? '1.2rem' : '0.95rem' }}>{val}</span>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <td style={{ padding: '24px' }} />
                  {programmes.map((p) => (
                    <td key={p.id} style={{ padding: '24px', textAlign: 'center' }}>
                      <a href={`#${p.id}`} style={{ display: 'inline-block', backgroundColor: p.isFeatured ? p.accentColor : '#fff', color: p.isFeatured ? '#fff' : p.accentColor, border: `1.5px solid ${p.accentColor}`, borderRadius: 'var(--radius-full)', padding: '12px 24px', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: p.isFeatured ? `0 4px 14px ${p.accentColor}30` : 'none' }} onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>{p.cta}</a>
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
        <section key={prog.id} id={prog.id} style={{ padding: '100px 0', backgroundColor: pi % 2 === 0 ? 'var(--bg-subtle)' : '#FFFFFF', borderTop: '1px solid var(--border-light)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '80px', alignItems: 'flex-start' }}>
              <div ref={observe} className="scroll-fade-right">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', backgroundColor: prog.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${prog.accentColor}33`, boxShadow: `0 4px 12px ${prog.accentColor}20` }}>{prog.icon}</div>
                  <div>
                    {prog.badge && <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: prog.accentColor, color: '#fff', borderRadius: 'var(--radius-sm)', padding: '4px 12px', marginBottom: '6px', display: 'inline-block', textTransform: 'uppercase', letterSpacing: '1px' }}>{prog.badge}</span>}
                    <div style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{prog.name}</div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '32px' }}>{prog.desc}</p>
                {pi > 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', fontStyle: 'italic', fontWeight: 600 }}>
                  {pi === 1 ? 'Everything in Ascent, plus:' : 'Same core IMAT academic preparation as Mastery, plus:'}
                </p>}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                  {prog.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>
                      <CheckCircle2 size={22} color={prog.accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />{f}
                    </li>
                  ))}
                </ul>
                <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '16px 20px', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <AlertCircle size={20} style={{ flexShrink: 0 }} color="var(--text-light)" />
                  <span style={{ fontWeight: 500 }}>Founder access: <strong>{prog.founderAccess}</strong></span>
                </div>
              </div>
              <div ref={observe} className={`sticky-pricing scroll-fade-left ${prog.isFeatured ? 'prog-card-featured' : ''}`} style={{ '--card-accent': prog.accentColor } as React.CSSProperties}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', fontWeight: 700 }}>Starting from</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: prog.accentColor, letterSpacing: '-1.5px', marginBottom: '8px' }}>{prog.price}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '40px', fontWeight: 600 }}>12 months full portal access included</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', backgroundColor: prog.accentColor, color: '#fff', borderRadius: 'var(--radius-full)', padding: '18px', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: `0 8px 24px -4px ${prog.accentColor}40` }} onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>{prog.cta}</a>
                  <Link href="/portal/tests" style={{ display: 'block', textAlign: 'center', color: prog.accentColor, border: `2px solid ${prog.accentColor}`, borderRadius: 'var(--radius-full)', padding: '16px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', transition: 'background-color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${prog.accentColor}10`)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>Try Free Diagnostic Mock</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── 10 QUIZ ─────────────────────────────────────────────────────── */}
      <section id="quiz" style={{ padding: '100px 0', backgroundColor: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(92, 237, 115, 0.1) 0%, transparent 60%)', zIndex: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div ref={observe} className="scroll-fade-right">
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-400)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>20-Second Quiz</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginTop: '12px', marginBottom: '24px', letterSpacing: '-0.5px' }}>Which Programme Is Right for You?</h2>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.8, fontSize: '1.1rem' }}>Four quick questions. Immediate result. No sign-up required to see your recommendation.</p>
              <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { icon: <Compass size={20} color="#3B82F6" />, label: 'Ascent', desc: 'Self-paced prep' },
                  { icon: <GraduationCap size={20} color="#d4af37" />, label: 'Mastery', desc: 'Live classes' },
                  { icon: <Globe2 size={20} color="var(--text-light)" />, label: 'MedPath Elite', desc: 'Full journey support' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>{t.icon}</div>
                    <span style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '1rem' }}>{t.label} — <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>{t.desc}</span></span>
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
      <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">The Team</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>Meet Your Ahsora Faculty</h2>
          </div>
          <div ref={observe} className="scroll-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {['Leadership Team', 'Academic Faculty', 'Student Success & Admissions'].map((group, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', transition: 'transform 0.3s, box-shadow 0.3s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
                  <Users size={32} color="var(--text-light)" />
                </div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{group}</div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontStyle: 'italic' }}>Faculty profiles — coming soon</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12 TESTIMONIALS ─────────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">Results</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>Verified Testimonials</h2>
          </div>
          <div ref={observe} className="scroll-scale-in" style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '64px 40px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: '#fffbeb', borderRadius: '50%', marginBottom: '24px' }}>
              <Star size={40} color="#d4af37" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.8, maxWidth: '640px', margin: '0 auto 16px', fontWeight: 500 }}>
              Student outcomes — coming soon. We'll share real results in the format: <br/>
              <em style={{ color: 'var(--primary-600)', fontWeight: 700, fontStyle: 'normal' }}>Starting point → Programme → IMAT result → University</em>.
            </p>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>We'll never publish invented testimonials or inflated scores.</p>
          </div>
        </div>
      </section>

      {/* ── 13 FAQ ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span ref={observe} className="section-tagline scroll-fade-up">Got Questions?</span>
            <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>Frequently Asked Questions</h2>
          </div>
          <div ref={observe} className="scroll-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', border: openFaq === i ? '1px solid var(--primary-400)' : '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: openFaq === i ? 'var(--shadow-sm)' : 'none' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.05rem', color: openFaq === i ? 'var(--primary-700)' : 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '20px', transition: 'color 0.2s' }}>
                  <span style={{ flex: 1, letterSpacing: '-0.3px' }}>{faq.q}</span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: openFaq === i ? 'var(--primary-50)' : 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }}>
                    {openFaq === i ? <ChevronUp size={20} color="var(--primary-600)" /> : <ChevronDown size={20} color="var(--text-light)" />}
                  </div>
                </button>
                <div style={{ maxHeight: openFaq === i ? '500px' : '0', opacity: openFaq === i ? 1 : 0, overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <div style={{ padding: '0 24px 24px', color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>
                    <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
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
      <section style={{ padding: '120px 0', backgroundColor: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(92, 237, 115, 0.15) 0%, transparent 70%)', zIndex: 0 }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 ref={observe} className="scroll-fade-up" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '24px', letterSpacing: '-1px' }}>
            Your Goal Is Medicine.<br />Your Path Starts With Ahsora.
          </h2>
          <p ref={observe} className="scroll-fade-up" style={{ color: 'var(--text-light)', fontSize: '1.2rem', marginBottom: '48px', transitionDelay: '100ms' }}>Choose the level of preparation and support that fits your journey.</p>
          <div ref={observe} className="scroll-fade-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px', transitionDelay: '200ms' }}>
            <a href="#ascent" className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', padding: '16px 32px' }} onMouseEnter={e => {e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}} onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}}>Ascent</a>
            <a href="#mastery" className="btn-primary" style={{ padding: '16px 40px' }}>Mastery</a>
            <a href="#elite" className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', padding: '16px 32px' }} onMouseEnter={e => {e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}} onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}}>MedPath Elite</a>
          </div>
          <div ref={observe} className="scroll-fade-up" style={{ transitionDelay: '300ms' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Not sure which programme is right for you? </span>
            <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-400)', fontWeight: 700, textDecoration: 'none' }}>Talk to an Ahsora Advisor</a>
          </div>
        </div>
      </section>

      <StickyMobileBar onTrial={() => {}} />

      {leadOpen && (
        <LeadCaptureModal
          isOpen={leadOpen}
          onClose={() => setLeadOpen(false)}
        />
      )}
    </div>
  );
}
