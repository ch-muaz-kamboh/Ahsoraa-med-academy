'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, Clock, Target, CheckCircle2, ChevronDown, ChevronUp,
  BookOpen, Brain, Activity, TestTube, Scale, Info, AlertCircle, PlayCircle, MapPin
} from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';

// Section components to keep the main file readable

function AnimatedNumber({ end, suffix = '', label }: { end: number, suffix?: string, label: string }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1200;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, isVisible]);

  return (
    <div ref={ref} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px 20px', textAlign: 'center', boxShadow: '0 12px 30px rgba(0,0,0,0.05)', transform: isVisible ? 'translateY(0)' : 'translateY(20px)', opacity: isVisible ? 1 : 0, transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <div style={{ fontWeight: 800, fontSize: '3.2rem', color: '#16A34A', lineHeight: 1, letterSpacing: '-1px', textShadow: '0 4px 15px rgba(22, 163, 74, 0.15)' }}>
        {count}{suffix}
      </div>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#334155', marginTop: '16px' }}>{label}</div>
    </div>
  );
}

export default function IMATContent() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scoreCalc, setScoreCalc] = useState({ correct: 0, incorrect: 0, blank: 0 });
  const [openSubject, setOpenSubject] = useState<number | null>(null);

  const totalScore = (scoreCalc.correct * 1.5) - (scoreCalc.incorrect * 0.4);
  const inputsTotal = scoreCalc.correct + scoreCalc.incorrect + scoreCalc.blank;

  // Hooks for scroll animations
  const heroRef = useScrollAnimation();
  const introRef = useScrollAnimation();
  const datesRef = useScrollAnimation();
  const calcRef = useScrollAnimation();
  const timelineRef = useStaggeredAnimation(8);
  
  const segmentRef = useStaggeredAnimation(3);
  const euRef = useStaggeredAnimation(2);
  const euHelperRef = useScrollAnimation();
  const uniRef = useStaggeredAnimation(3);
  
  const handleScoreChange = (type: 'correct' | 'incorrect' | 'blank', val: string) => {
    const num = parseInt(val) || 0;
    setScoreCalc(prev => ({ ...prev, [type]: num }));
  };

  const subjects = [
    { title: 'Reading & Acquired Knowledge', qs: 4, topics: 'reading comprehension, general/scientific culture, critical reasoning' },
    { title: 'Logical Reasoning & Problem Solving', qs: 5, topics: 'numerical reasoning, data interpretation, logical sequences' },
    { title: 'Biology', qs: 23, topics: 'cell biology, genetics & heredity, human anatomy & physiology, microbiology, evolution, ecology' },
    { title: 'Chemistry', qs: 15, topics: 'atomic structure, chemical bonding, stoichiometry, acids & bases, organic chemistry fundamentals, redox reactions' },
    { title: 'Physics & Mathematics', qs: 13, topics: 'mechanics, thermodynamics, electromagnetism, waves & optics, algebra, probability & statistics' },
  ];

  const faqs = [
    { q: 'What is the IMAT?', a: 'The International Medical Admissions Test (IMAT) is an English-language entrance examination used for admission to participating English-taught Medicine & Surgery programmes at Italian public universities.' },
    { q: 'How many questions are in each section?', a: 'Reading & Knowledge: 4, Logical Reasoning: 5, Biology: 23, Chemistry: 15, Physics & Math: 13. Total: 60 questions.' },
    { q: 'How is the IMAT scored?', a: '+1.5 for each correct answer, -0.4 for incorrect, and 0 for blank answers. Maximum score is 90.' },
    { q: 'When is the IMAT exam held?', a: 'Historically held in early September. Dates are confirmed annually by the Italian Ministry of University and Research (MUR).' },
    { q: 'Who can take the IMAT?', a: 'EU citizens and non-EU citizens can take the IMAT. Non-EU candidates residing abroad must complete pre-enrolment via Universitaly.' },
    { q: 'Which universities accept IMAT scores?', a: 'Most Italian public universities offering English-taught Medicine & Surgery degrees, including La Sapienza, University of Milan, Pavia, Bologna, and others. Always verify the current list on Universitaly.' },
    { q: 'What score do I need?', a: 'Cutoff scores vary each year and by university. Typically, top choices require higher scores (e.g., 50+), while others may have lower cutoffs. Treat mock scores as a guide, not a guarantee.' },
    { q: 'Can I retake the IMAT?', a: 'Yes, you can retake it in subsequent years if you do not secure a place. There is no limit on retakes.' },
    { q: 'How should I prepare?', a: 'Master the core syllabus, practice with IMAT-style questions, take full-length timed mocks, and analyze your weak points. Consistent, targeted practice is key.' },
    { q: 'Does Ahsora offer live classes?', a: 'Yes. The Ahsora IMAT Mastery and MedPath Elite programmes include live, teacher-led classes along with full access to our mock tests and question bank.' },
    { q: 'Which Ahsora programme is right for me?', a: 'If you prefer self-paced study, choose Ascent. For live teaching, choose Mastery. For end-to-end exam prep and admission guidance, choose MedPath Elite.' },
  ];

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 01 — Hero */}
      <section style={{ background: 'linear-gradient(135deg, #F0FFF4 0%, #FFFFFF 60%)', padding: '80px 0 60px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div ref={heroRef as React.RefObject<HTMLDivElement>} className="scroll-fade-up">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              IMAT — International Medical Admissions Test
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, color: '#0F172A', marginTop: '16px', marginBottom: '24px', letterSpacing: '-1px', lineHeight: 1.1 }}>
              The IMAT Is the Test. Your Preparation Makes the Difference.
            </h1>
            <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '36px' }}>
              Understand the exam, master the syllabus, practise under realistic conditions, and measure your progress — with a preparation system built for students pursuing Medicine in Italy.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button onClick={() => setLeadOpen(true)} className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                <span>Take the Free IMAT Mock</span>
              </button>
              <Link href="#preparation" className="btn-outline" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
                Explore IMAT Preparation
              </Link>
            </div>
          </div>
          <div className="scroll-fade-left is-visible" style={{ position: 'relative', height: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 20px 25px -5px rgba(92, 237, 115, 0.15)', width: '100%', maxWidth: '400px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>Mock Test Simulator</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontWeight: 600, fontSize: '0.9rem' }}>
                    <Clock size={16} /> 99:59
                  </div>
               </div>
               <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', marginBottom: '24px' }}>
                  <div style={{ width: '45%', height: '100%', backgroundColor: '#5CED73', borderRadius: '4px' }}></div>
               </div>
               <div style={{ fontWeight: 600, color: '#334155', marginBottom: '12px' }}>Question 27 of 60</div>
               <div style={{ color: '#0F172A', fontWeight: 500, lineHeight: 1.5, marginBottom: '24px' }}>
                 Which of the following cellular structures is primarily responsible for the synthesis of ribosomal RNA?
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {['Nucleolus', 'Golgi Apparatus', 'Smooth ER', 'Lysosome', 'Mitochondrion'].map((opt, i) => (
                   <div key={i} style={{ border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '8px', color: i === 0 ? '#16A34A' : '#475569', backgroundColor: i === 0 ? '#F0FFF4' : '#FFFFFF', borderColor: i === 0 ? '#16A34A' : '#E2E8F0', fontWeight: i === 0 ? 600 : 400 }}>
                     {opt}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — IMAT At-a-Glance */}
      <section style={{ padding: '60px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <AnimatedNumber end={60} label="Questions (MCQ)" />
            <AnimatedNumber end={100} label="Minutes (One sitting)" />
            <AnimatedNumber end={90} label="Max Score (+1.5/-0.4/0)" />
            <AnimatedNumber end={5} label="Answer Options" />
          </div>
        </div>
      </section>

      {/* 03 — What Is the IMAT */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '60px', alignItems: 'center' }}>
            {/* Text */}
            <div ref={introRef as React.RefObject<HTMLDivElement>} className="scroll-fade-up">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '1.5px' }}>About the Exam</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px', marginTop: '12px' }}>What Is the IMAT?</h2>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.85 }}>
                The International Medical Admissions Test (IMAT) is an English-language entrance examination used for admission to participating English-taught Medicine &amp; Surgery programmes at Italian public universities. It tests scientific knowledge alongside logical reasoning, problem solving and reading-related skills, in a single 100-minute sitting.
              </p>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.85, marginTop: '16px' }}>
                The exam is time-limited, so effective preparation requires both subject mastery and exam strategy — not one or the other. Not every Italian Medicine programme uses the IMAT, so confirming your target university's admission route is an important early step.
              </p>
              <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="#dates" className="btn-primary">See Key Dates</Link>
                <Link href="#preparation" className="btn-outline">How to Prepare</Link>
              </div>
            </div>
            {/* Image */}
            <div className="scroll-fade-left is-visible" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.15)', position: 'relative' }}>
              <Image
                src="/imat-student-studying.jpg"
                alt="Medical student studying for the IMAT exam"
                width={700}
                height={467}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority
              />
              {/* Floating stat badge */}
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', borderRadius: '14px', padding: '14px 20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#5CED73', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>60 Qs</div>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '4px' }}>in 100 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Key Dates & Registration */}
      <section id="dates" style={{ padding: '80px 0', backgroundColor: '#0F172A' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF' }}>Mark Your Calendar</h2>
            <p style={{ color: '#94A3B8', marginTop: '12px' }}>Timeline for the upcoming IMAT cycle.</p>
          </div>
          
          {/* Timeline UI */}
          <div ref={datesRef as React.RefObject<HTMLDivElement>} className="scroll-fade-up">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', position: 'relative', zIndex: 2 }}>
              {[
                { step: 'Registration Opens', date: '[Pending Confirmation]', icon: <MapPin size={24} /> },
                { step: 'Registration Closes', date: '[Pending Confirmation]', icon: <Info size={24} /> },
                { step: 'Exam Fee', date: 'approx. €130 (TBC)', icon: <Activity size={24} /> },
                { step: 'Exam Date', date: '[Pending Sept 2027]', icon: <Clock size={24} /> },
                { step: 'Results/Ranking', date: '[Pending]', icon: <Target size={24} /> },
              ].map((item, idx) => (
                 <div key={idx} style={{ textAlign: 'center', padding: '28px 20px', backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', color: '#5CED73', marginBottom: '14px' }}>
                      {item.icon}
                    </div>
                    <div style={{ fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>{item.step}</div>
                    <div style={{ fontSize: '0.9rem', color: '#94A3B8' }}>{item.date}</div>
                 </div>
              ))}
            </div>
            
            <div style={{ marginTop: '40px', backgroundColor: '#1E293B', borderLeft: '4px solid #F59E0B', padding: '20px 24px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
               <AlertCircle color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
               <p style={{ color: '#CBD5E1', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                 "Dates, fees and procedures are set annually by the Italian Ministry of University and Research (MUR) — always verify current information on Universitaly.it. Last verified: September 2026."
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Exam Structure & Syllabus */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '60px', alignItems: 'flex-start' }}>
            {/* Left: intro + subject pie */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Verified Format</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', marginTop: '12px' }}>Exam Structure &amp; Syllabus</h2>
              <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: '32px' }}>60 questions across 5 subjects, sat in a single 100-minute session. Each subject has a fixed number of questions — knowing the breakdown helps you allocate prep time strategically.</p>
              {/* Visual subject breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { title: 'Biology', qs: 23, color: '#16A34A', pct: 38 },
                  { title: 'Chemistry', qs: 15, color: '#0EA5E9', pct: 25 },
                  { title: 'Physics & Maths', qs: 13, color: '#8B5CF6', pct: 22 },
                  { title: 'Logical Reasoning', qs: 5, color: '#F59E0B', pct: 8 },
                  { title: 'Reading & Knowledge', qs: 4, color: '#EC4899', pct: 7 },
                ].map((s) => (
                  <div key={s.title}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>{s.title}</span>
                      <span style={{ fontWeight: 800, color: s.color, fontSize: '0.9rem' }}>{s.qs} Qs</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.pct}%`, backgroundColor: s.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subjects.map((sub, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', border: openSubject === i ? '1px solid #16A34A' : '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden', transition: 'all 0.2s ease' }}>
                  <button 
                    onClick={() => setOpenSubject(openSubject === i ? null : i)}
                    style={{ width: '100%', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ backgroundColor: '#F0FFF4', padding: '8px 12px', borderRadius: '10px', color: '#16A34A', fontWeight: 800, fontSize: '1.1rem', minWidth: '44px', textAlign: 'center', border: '1px solid #BBF7D0' }}>
                        {sub.qs}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', textAlign: 'left' }}>
                        {sub.title}
                      </div>
                    </div>
                    {openSubject === i ? <ChevronUp color="#16A34A" /> : <ChevronDown color="#64748B" />}
                  </button>
                  {openSubject === i && (
                    <div style={{ padding: '0 24px 24px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                      <p style={{ color: '#475569', marginBottom: '16px', lineHeight: 1.6, fontSize: '0.95rem' }}>
                        <strong>Core topics:</strong> {sub.topics}
                      </p>
                      <Link href="/portal/courses" style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                        See course modules <ArrowRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 06 — Scoring + Live Score Calculator */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div ref={calcRef as React.RefObject<HTMLDivElement>} className="scroll-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '56px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>IMAT Scoring</h2>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <span className="badge badge-green">+1.5 Correct</span>
                <span className="badge badge-red">−0.4 Incorrect</span>
                <span className="badge badge-gray">0 Blank</span>
              </div>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '32px' }}>
                The IMAT rewards accuracy over guessing — a wrong answer costs you, leaving one blank costs nothing. Knowing when to answer and when to skip is a skill, one our mock tests train explicitly.
              </p>
              {/* Score breakdown table */}
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: '32px' }}>
                {[{ label: 'Correct answer', value: '+1.5 pts', color: '#16A34A', bg: '#F0FFF4' }, { label: 'Incorrect answer', value: '−0.4 pts', color: '#DC2626', bg: '#FFF1F2' }, { label: 'Blank / skipped', value: '0 pts', color: '#64748B', bg: '#F8FAFC' }, { label: 'Maximum score', value: '90 pts', color: '#0F172A', bg: '#FFFFFF' }].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', backgroundColor: row.bg, borderBottom: i < 3 ? '1px solid #E2E8F0' : 'none' }}>
                    <span style={{ color: '#475569', fontWeight: 500 }}>{row.label}</span>
                    <span style={{ color: row.color, fontWeight: 800, fontSize: '1.05rem' }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                 <Link href="/portal/tests" className="btn-primary">Take the Full Free IMAT Mock</Link>
                 <button onClick={() => setLeadOpen(true)} className="btn-outline">Get a Personalised Prep Plan</button>
              </div>
            </div>
            
            {/* Premium Calculator Widget */}
            <div style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)', borderRadius: '24px', padding: '36px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative', overflow: 'hidden' }}>
              {/* Background glow */}
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(92,237,115,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(92,237,115,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={18} color="#5CED73" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Live Score Calculator</h3>
              </div>
              
              {/* Input sliders + numbers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                {[
                  { key: 'correct' as const, label: 'Correct', emoji: '✓', color: '#5CED73', pts: '+1.5' },
                  { key: 'incorrect' as const, label: 'Incorrect', emoji: '✗', color: '#F87171', pts: '−0.4' },
                  { key: 'blank' as const, label: 'Blank', emoji: '—', color: '#94A3B8', pts: '0' },
                ].map(({ key, label, emoji, color, pts }) => (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: `${color}22`, color, fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{emoji}</span>
                        <span style={{ color: '#CBD5E1', fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
                        <span style={{ color, fontSize: '0.8rem', fontWeight: 700 }}>({pts})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => handleScoreChange(key, String(Math.max(0, scoreCalc[key] - 1)))} style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.1rem', minWidth: '28px', textAlign: 'center' }}>{scoreCalc[key]}</span>
                        <button onClick={() => handleScoreChange(key, String(Math.min(60, scoreCalc[key] + 1)))} style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(scoreCalc[key] / 60) * 100}%`, backgroundColor: color, borderRadius: '3px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total questions indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 16px', marginBottom: '24px', border: inputsTotal > 60 ? '1px solid #F87171' : '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Questions used</span>
                <span style={{ color: inputsTotal > 60 ? '#F87171' : '#5CED73', fontWeight: 700 }}>{inputsTotal} / 60</span>
              </div>

              {/* Score display */}
              {(() => {
                const score = inputsTotal > 60 ? null : totalScore;
                const scoreColor = score === null ? '#F87171' : score >= 60 ? '#5CED73' : score >= 45 ? '#FCD34D' : '#F87171';
                const scoreBand = score === null ? 'Invalid' : score >= 60 ? 'Competitive Range' : score >= 45 ? 'Moderate Range' : 'Needs Work';
                const fillPct = score === null ? 0 : Math.max(0, Math.min(100, (score / 90) * 100));
                return (
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', border: `1px solid ${scoreColor}33` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>Projected Score</div>
                        <div style={{ fontSize: '3.2rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                          {score === null ? 'ERR' : score.toFixed(1)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>out of 90</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-block', backgroundColor: `${scoreColor}22`, color: scoreColor, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, border: `1px solid ${scoreColor}44` }}>
                          {scoreBand}
                        </div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${fillPct}%`, background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`, borderRadius: '4px', transition: 'width 0.4s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#475569' }}>0</span>
                      <span style={{ fontSize: '0.7rem', color: '#475569' }}>60 (competitive)</span>
                      <span style={{ fontSize: '0.7rem', color: '#475569' }}>90</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5, marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      Guide only — cutoffs vary each year. Use mock tests to track real progress.
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* 07 — Is the IMAT Right for You? */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Find Your Path</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginTop: '12px' }}>Is the IMAT Right for You?</h2>
          </div>
          <div ref={segmentRef as React.RefObject<HTMLDivElement>} className="scroll-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🎓', title: 'I want to study Medicine in English in Italy', desc: 'The IMAT is the gateway to English-taught Medicine & Surgery at Italian public universities. If this is your goal, this exam is your path.', link: '/universities', cta: 'See IMAT universities' },
              { icon: '🏛️', title: "I'm not sure which university fits me", desc: 'Italy has over 10 universities offering IMAT-based admission. Each has different city vibes, fees, and programme styles — explore them before deciding.', link: '/universities', cta: 'Explore Universities' },
              { icon: '🌍', title: "I'm not sure which admission category applies", desc: 'EU and Non-EU candidates follow different quotas and processes. The distinction is based on residency and citizenship — not nationality alone.', href: '#eu-noneu', cta: 'See EU / Non-EU guidance' },
            ].map((card, i) => (
              <div key={i} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '2.2rem' }}>{card.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0F172A', lineHeight: 1.3 }}>{card.title}</div>
                <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.7, flex: 1 }}>{card.desc}</p>
                {'link' in card
                  ? <Link href={card.link!} style={{ color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>{card.cta} <ArrowRight size={15}/></Link>
                  : <a href={card.href} style={{ color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>{card.cta} <ArrowRight size={15}/></a>
                }
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px', color: '#94A3B8', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <AlertCircle size={14} />
            Not every Italian Medicine programme uses the IMAT — confirm your target university's route.
          </div>
        </div>
      </section>

      {/* 08 — EU vs Non-EU & Admission Category */}
      <section id="eu-noneu" style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Admission Category</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginTop: '12px' }}>EU &amp; Non-EU Candidates</h2>
          </div>
          <div ref={euRef as React.RefObject<HTMLDivElement>} className="scroll-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* EU Card */}
            <div style={{ background: 'linear-gradient(135deg, #F0FFF4, #DCFCE7)', border: '1px solid #86EFAC', borderRadius: '20px', padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🇪🇺</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532D', margin: 0 }}>EU Candidates</h3>
              </div>
              <p style={{ color: '#166534', lineHeight: 1.7, marginBottom: '20px' }}>EU citizens — and non-EU citizens legally resident in Italy who meet the criteria — apply through the EU procedure and quota.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Apply under the EU quota', 'No pre-enrolment via embassy required', 'Confirm residency documentation early'].map((pt, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#166534', fontSize: '0.92rem', fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />{pt}
                  </li>
                ))}
              </ul>
            </div>
            {/* Non-EU Card */}
            <div style={{ background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)', border: '1px solid #7DD3FC', borderRadius: '20px', padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🌐</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0C4A6E', margin: 0 }}>Non-EU Candidates</h3>
              </div>
              <p style={{ color: '#0369A1', lineHeight: 1.7, marginBottom: '20px' }}>Applying from outside the EU means a separate quota and process, including pre-enrolment at an Italian embassy/consulate tied to your visa.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Apply under the Non-EU quota', 'Pre-enrolment via Universitaly required', 'Begin visa + embassy process early'].map((pt, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#0369A1', fontSize: '0.92rem', fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#0284C7" style={{ flexShrink: 0, marginTop: '2px' }} />{pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div ref={euHelperRef as React.RefObject<HTMLDivElement>} className="scroll-fade-up" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '32px 40px', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <div>
              <h4 style={{ fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '1.1rem' }}>Still not sure which applies to you?</h4>
              <p style={{ color: '#64748B', fontSize: '0.92rem', margin: 0 }}>Your status depends on citizenship and residency — not just where you're from.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setLeadOpen(true)} className="btn-primary">Ask us directly</button>
              <a href="https://www.universitaly.it" target="_blank" rel="noopener noreferrer" className="btn-outline">Check Universitaly.it</a>
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '0.82rem', color: '#94A3B8', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            Rules, quotas and procedures are set by MUR/Universitaly and can change — always confirm on Universitaly.it.
          </div>
        </div>
      </section>

      {/* 09 — Where Can You Study */}
      <section style={{ padding: '0 0 80px', backgroundColor: '#0F172A' }}>
        {/* Full-width Italy city banner */}
        <div style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden', marginBottom: '60px' }}>
          <Image
            src="/imat-italy-city.jpg"
            alt="Aerial view of an Italian university city at golden hour"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
          />
          {/* Dark gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.7) 60%, #0F172A 100%)' }} />
          {/* Centred heading on image */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '48px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5CED73', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Study Medicine in Italy</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.5px' }}>Where Can You Study?</h2>
            <p style={{ color: '#94A3B8', marginTop: '12px', fontSize: '1.05rem' }}>A snapshot of top universities participating in the IMAT.</p>
          </div>
        </div>
        <div className="container">
           <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
             <Link href="/universities" className="btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
               View All Universities
             </Link>
           </div>
           
           <div ref={uniRef as React.RefObject<HTMLDivElement>} className="scroll-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
             {[
               { name: 'La Sapienza', city: 'Rome', desc: 'One of Europe\'s oldest universities, offering a prestigious 6-year program.' },
               { name: 'University of Milan', city: 'Milan', desc: 'Renowned IMS program located in Italy\'s economic and fashion capital.' },
               { name: 'University of Pavia', city: 'Pavia', desc: 'The Harvey Medicine course in a historic, student-friendly university town.' }
             ].map((uni, i) => (
               <div key={i} className="card" style={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}>
                 <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '4px' }}>{uni.name}</div>
                 <div style={{ color: '#5CED73', fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px' }}>{uni.city}, Italy</div>
                 <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>{uni.desc}</p>
                 <Link href="/universities" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5CED73', fontWeight: 600 }}>
                   View Details <ArrowRight size={16} />
                 </Link>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* 10 — Cost */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Affordability</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px', marginTop: '12px' }}>What Does It Cost to Study Medicine in Italy?</h2>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '12px' }}>
                Italian public universities generally charge tuition scaled to family income (ISEE), often notably lower than private medical programmes elsewhere in Europe.
              </p>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '32px' }}>
                Regional scholarships (DSU) can reduce or cover tuition entirely and include a living stipend for eligible students, including international applicants.
              </p>
              <Link href="/scholarships" className="btn-primary">Explore Costs &amp; Scholarships <ArrowRight size={18}/></Link>
            </div>
            {/* Fact cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Average annual tuition (public)', value: '€156 – €3,000+', note: 'Scaled to ISEE household income', color: '#16A34A' },
                { label: 'DSU scholarship (living stipend)', value: 'Up to €8,000/yr', note: 'Accommodation + cash allowance for eligible students', color: '#0EA5E9' },
                { label: 'Exam registration fee', value: '~€130', note: 'Paid at time of IMAT registration (TBC annually)', color: '#8B5CF6' },
                { label: 'vs. UK private Medicine', value: '5–10× cheaper', note: 'Typical comparison against private UK med school fees', color: '#F59E0B' },
              ].map((fact, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem', marginBottom: '4px' }}>{fact.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{fact.note}</div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: fact.color, whiteSpace: 'nowrap', textAlign: 'right' }}>{fact.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11 — How Ahsora Prepares You */}
      <section id="preparation" style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '1.5px' }}>The Ahsora Method</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginTop: '12px' }}>How Ahsora Prepares You</h2>
            <p style={{ color: '#64748B', marginTop: '12px' }}>The Ahsora Signature Learning Cycle</p>
          </div>
          
          {/* Learning cycle strip */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: '0', marginBottom: '64px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            {['Learn', 'Practice', 'Test', 'Analyze', 'Improve', 'Repeat'].map((step, i, arr) => (
              <div key={i} style={{ flex: '1 1 0', minWidth: '100px', textAlign: 'center', padding: '24px 12px', backgroundColor: i % 2 === 0 ? '#F0FFF4' : '#FFFFFF', borderRight: i < arr.length - 1 ? '1px solid #E2E8F0' : 'none', position: 'relative' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#16A34A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', margin: '0 auto 12px' }}>{i + 1}</div>
                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>{step}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
            <div className="card" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlayCircle size={26} color="#16A34A" />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Live Teaching</h3>
              </div>
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '24px' }}>
                Ahsora combines structured digital preparation with live, teacher-led classes — difficult concepts explained, questions discussed, and doubts resolved in real time.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Live sessions for every IMAT subject', 'Full recordings available after each class', 'Direct Q&A with subject teachers', 'Structured weekly timetable'].map((pt, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', color: '#334155', fontSize: '0.92rem', fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />{pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={26} color="#16A34A" />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Mocks &amp; Analytics</h3>
              </div>
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '24px' }}>
                Full-length timed mocks with official-style scoring, detailed question review, and subject performance breakdown so you know exactly what to fix.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Official-format timed mock exams', 'Per-topic accuracy & timing analysis', 'Personalised weak-area feedback', 'Unlimited question bank practice'].map((pt, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', color: '#334155', fontSize: '0.92rem', fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />{pt}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '24px' }}>
                <Link href="/portal/courses" style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>View the IMAT Course <ArrowRight size={16}/></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12 — Ahsora Preparation Paths */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>Choose Your Ahsora Preparation Path</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
             {[
               { name: 'IMAT Ascent', desc: 'Independent, structured self-paced preparation.', price: '$299' },
               { name: 'IMAT Mastery', desc: 'Structured preparation + live teacher-led classes.', price: '$499', highlight: true },
               { name: 'MedPath Elite', desc: 'Full IMAT preparation + university & admissions support.', price: '$999' }
             ].map((path, i) => (
               <div key={i} className="card" style={path.highlight ? { borderColor: '#5CED73', boxShadow: '0 8px 24px -4px rgba(92, 237, 115, 0.2)', transform: 'scale(1.02)' } : {}}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{path.name}</div>
                  <div style={{ color: '#475569', fontSize: '0.95rem', height: '48px', marginBottom: '20px' }}>{path.desc}</div>
                  <Link href="/#packages" className={path.highlight ? "btn-primary" : "btn-outline"} style={{ width: '100%' }}>Compare Programmes</Link>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 13 — The Full Journey */}
      <section style={{ padding: '80px 0', backgroundColor: '#0F172A' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
             <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF' }}>The Full Journey</h2>
             <p style={{ color: '#94A3B8', marginTop: '12px' }}>From preparation to starting Medical School in Italy.</p>
          </div>
          <div ref={timelineRef as React.RefObject<HTMLDivElement>} className="scroll-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            {[
              'Understand the IMAT', 'Identify target universities', 'Build your prep plan',
              'Learn & practise', 'Sit the IMAT', 'Review ranking & options', 
              'Complete university procedures', 'Begin Medicine in Italy'
            ].map((step, i) => (
              <div key={i} style={{ padding: '16px', backgroundColor: '#1E293B', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#5CED73', color: '#14532D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', marginBottom: '12px' }}>
                  {i+1}
                </div>
                <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14 — Free IMAT Starter Kit */}
      <section style={{ padding: '80px 0', backgroundColor: '#0F172A' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '60px', alignItems: 'center' }}>
            {/* Left: what's inside */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5CED73', textTransform: 'uppercase', letterSpacing: '1.5px' }}>100% Free</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '12px', marginBottom: '20px' }}>Get the Free IMAT Starter Kit</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px', color: '#94A3B8' }}>
                Everything you need to understand the exam and start preparing with confidence — sent straight to your inbox.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Full IMAT syllabus overview',
                  'Subject-by-subject topic checklist',
                  'Recommended study order & timeline',
                  'Mock-test strategy guide',
                  'University planning checklist',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#CBD5E1', fontWeight: 500 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(92,237,115,0.15)', border: '1px solid rgba(92,237,115,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={14} color="#5CED73" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* Right: form */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>Send it to my inbox</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '28px' }}>Join 2,000+ students who've already downloaded it.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Your Name" className="form-input" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF' }} />
                <input type="email" placeholder="Your Email" className="form-input" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF' }} />
                <button className="btn-primary" style={{ width: '100%', marginTop: '4px', padding: '16px', fontSize: '1rem' }}>
                  Get the Free Starter Kit <ArrowRight size={18}/>
                </button>
              </div>
              <p style={{ color: '#475569', fontSize: '0.78rem', marginTop: '16px', textAlign: 'center' }}>No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 15 — FAQ + Final CTA */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Got Questions?</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginTop: '12px' }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'flex-start', marginBottom: '80px' }}>
            {/* FAQ accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', border: openFaq === i ? '1px solid #16A34A' : '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '16px' }}
                  >
                    <span style={{ flex: 1 }}>{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={18} color="#16A34A" /> : <ChevronDown size={18} color="#64748B" />}
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 22px 20px', color: '#475569', fontSize: '0.92rem', lineHeight: 1.7, borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '100px' }}>
              {/* Quick facts */}
              <div style={{ backgroundColor: '#0F172A', borderRadius: '20px', padding: '32px' }}>
                <h4 style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.1rem', marginBottom: '20px' }}>IMAT Quick Facts</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { label: 'Questions', value: '60 MCQ' },
                    { label: 'Duration', value: '100 min' },
                    { label: 'Max Score', value: '90 pts' },
                    { label: 'Correct', value: '+1.5 pts' },
                    { label: 'Incorrect', value: '−0.4 pts' },
                    { label: 'Language', value: 'English' },
                  ].map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < 5 ? '14px' : 0, borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <span style={{ color: '#94A3B8', fontSize: '0.88rem' }}>{f.label}</span>
                      <span style={{ color: '#5CED73', fontWeight: 700, fontSize: '0.95rem' }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* CTA card */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Still have questions?</h4>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '20px', lineHeight: 1.6 }}>Our advisors are happy to help you navigate the IMAT, programme selection, and admissions process.</p>
                <button onClick={() => setLeadOpen(true)} className="btn-primary" style={{ width: '100%' }}>Talk to an Advisor</button>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '60px 40px', borderRadius: '24px', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
             <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Ready to Start Your IMAT Preparation?</h2>
             <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '32px' }}>
               Take the free diagnostic, understand your starting point, and choose the preparation path that fits you.
             </p>
             <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
               <button onClick={() => setLeadOpen(true)} className="btn-primary">Take the Free IMAT Mock</button>
               <Link href="/#packages" className="btn-outline">Explore Programmes</Link>
             </div>
          </div>
        </div>
      </section>

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} defaultExam="IMAT" />
    </div>
  );
}
