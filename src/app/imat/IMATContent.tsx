'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Clock, Target, CheckCircle2, ChevronDown, ChevronUp,
  BookOpen, Brain, Activity, TestTube, Scale, Info, AlertCircle, PlayCircle, MapPin
} from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';

// Section components to keep the main file readable

function AnimatedNumber({ end, suffix = '', label }: { end: number, suffix?: string, label: string }) {
  const [count, setCount] = useState(0);
  const ref = useScrollAnimation({ threshold: 0.5 }) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    if (!ref.current?.classList.contains('is-visible')) return;
    let start = 0;
    const duration = 700;
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
  }, [end, ref.current?.className]);

  return (
    <div ref={ref} className="scroll-fade-up" style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '28px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ fontWeight: 800, fontSize: '2.5rem', color: '#16A34A', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A', marginTop: '12px' }}>{label}</div>
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
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div ref={introRef as React.RefObject<HTMLDivElement>} className="scroll-fade-up">
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>What Is the IMAT?</h2>
            <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.8 }}>
              The International Medical Admissions Test (IMAT) is an English-language entrance examination used for admission to participating English-taught Medicine & Surgery programmes at Italian public universities. It tests scientific knowledge alongside logical reasoning, problem solving and reading-related skills, in a single 100-minute sitting. The exam is time-limited, so effective preparation requires both subject mastery and exam strategy — not one or the other. Not every Italian Medicine programme uses the IMAT, so confirming your target university's admission route is an important early step.
            </p>
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
          <div ref={datesRef as React.RefObject<HTMLDivElement>} className="scroll-fade-up" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', position: 'relative', zIndex: 2 }}>
              {[
                { step: 'Registration Opens', date: '[Pending Confirmation]', icon: <MapPin size={24} /> },
                { step: 'Registration Closes', date: '[Pending Confirmation]', icon: <Info size={24} /> },
                { step: 'Exam Fee', date: 'approx. €130 (TBC)', icon: <Activity size={24} /> },
                { step: 'Exam Date', date: '[Pending Sept 2027]', icon: <Clock size={24} /> },
                { step: 'Results/Ranking', date: '[Pending]', icon: <Target size={24} /> },
              ].map((item, idx) => (
                 <div key={idx} style={{ textAlign: 'center', padding: '20px', backgroundColor: '#1E293B', borderRadius: '12px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', color: '#5CED73', marginBottom: '12px' }}>
                      {item.icon}
                    </div>
                    <div style={{ fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>{item.step}</div>
                    <div style={{ fontSize: '0.9rem', color: '#94A3B8' }}>{item.date}</div>
                 </div>
              ))}
            </div>
            
            <div style={{ marginTop: '40px', backgroundColor: '#1E293B', borderLeft: '4px solid #F59E0B', padding: '16px 20px', borderRadius: '8px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
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
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>Exam Structure & Syllabus</h2>
            <p style={{ color: '#475569', marginTop: '12px' }}>Verified 60-question format across 5 subjects.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {subjects.map((sub, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', border: openSubject === i ? '1px solid #16A34A' : '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.2s ease' }}>
                <button 
                  onClick={() => setOpenSubject(openSubject === i ? null : i)}
                  style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ backgroundColor: '#F0FFF4', padding: '8px', borderRadius: '8px', color: '#16A34A', fontWeight: 800, fontSize: '1.2rem', minWidth: '40px', textAlign: 'center' }}>
                      {sub.qs}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A', textAlign: 'left' }}>
                      {sub.title}
                    </div>
                  </div>
                  {openSubject === i ? <ChevronUp color="#16A34A" /> : <ChevronDown color="#64748B" />}
                </button>
                {openSubject === i && (
                  <div style={{ padding: '0 24px 24px', borderTop: '1px solid #F1F5F9', marginTop: '4px', paddingTop: '20px' }}>
                    <p style={{ color: '#475569', marginBottom: '16px', lineHeight: 1.6 }}>
                      <strong>Core topics include:</strong> {sub.topics}
                    </p>
                    <Link href="/portal/courses" style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                      See course modules for this subject <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Scoring + Live Score Calculator */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div ref={calcRef as React.RefObject<HTMLDivElement>} className="scroll-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>IMAT Scoring</h2>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <span className="badge badge-green">+1.5 Correct</span>
                <span className="badge badge-red">−0.4 Incorrect</span>
                <span className="badge badge-gray">0 Blank</span>
              </div>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '24px' }}>
                The IMAT rewards accuracy over guessing — a wrong answer costs you, leaving one blank costs nothing. Knowing when to answer and when to skip is a skill, one our mock tests train explicitly.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                 <Link href="/portal/tests" className="btn-primary">Take the Full Free IMAT Mock</Link>
                 <button onClick={() => setLeadOpen(true)} className="btn-outline">Get a Personalised Prep Plan</button>
              </div>
            </div>
            
            {/* Calculator Widget */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', color: '#0F172A' }}>Score Calculator</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                 <div>
                   <label className="form-label">Correct (+1.5)</label>
                   <input type="number" min="0" max="60" className="form-input" value={scoreCalc.correct} onChange={(e) => handleScoreChange('correct', e.target.value)} />
                 </div>
                 <div>
                   <label className="form-label">Incorrect (−0.4)</label>
                   <input type="number" min="0" max="60" className="form-input" value={scoreCalc.incorrect} onChange={(e) => handleScoreChange('incorrect', e.target.value)} />
                 </div>
                 <div>
                   <label className="form-label">Blank (0)</label>
                   <input type="number" min="0" max="60" className="form-input" value={scoreCalc.blank} onChange={(e) => handleScoreChange('blank', e.target.value)} />
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                   <div style={{ fontSize: '0.8rem', color: inputsTotal > 60 ? '#EF4444' : '#64748B', fontWeight: 600, textAlign: 'right', paddingBottom: '12px' }}>
                     Total Questions: {inputsTotal}/60
                   </div>
                 </div>
               </div>
               
               <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                 <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>Projected Score</div>
                 <div style={{ fontSize: '3.5rem', fontWeight: 800, color: inputsTotal > 60 ? '#EF4444' : '#16A34A', lineHeight: 1, margin: '8px 0' }}>
                   {inputsTotal > 60 ? 'ERR' : totalScore.toFixed(1)}
                 </div>
                 <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginTop: '12px' }}>
                   Use this as a starting point for your prep plan — not an admission prediction.
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — Is the IMAT Right for You? */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
             <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>Is the IMAT Right for You?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
             <div className="card scroll-fade-up">
               <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A', marginBottom: '12px' }}>I want to study Medicine in English in Italy</div>
               <Link href="/universities" style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>See IMAT universities <ArrowRight size={16}/></Link>
             </div>
             <div className="card scroll-fade-up" style={{ transitionDelay: '100ms' }}>
               <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A', marginBottom: '12px' }}>I'm not sure which university fits me</div>
               <Link href="/universities" style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>Explore Universities <ArrowRight size={16}/></Link>
             </div>
             <div className="card scroll-fade-up" style={{ transitionDelay: '200ms' }}>
               <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A', marginBottom: '12px' }}>I'm not sure which admission category applies</div>
               <a href="#eu-noneu" style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>See EU / Non-EU guidance below <ArrowRight size={16}/></a>
             </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px', color: '#64748B', fontSize: '0.9rem' }}>
             Not every Italian Medicine programme uses the IMAT — confirm your target university's route.
          </div>
        </div>
      </section>

      {/* 08 — EU vs Non-EU & Admission Category */}
      <section id="eu-noneu" style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
             <div className="card scroll-fade-up">
               <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>EU Candidates</h3>
               <p style={{ color: '#475569', lineHeight: 1.6 }}>EU citizens — and non-EU citizens legally resident in Italy who meet the criteria — apply through the EU procedure and quota.</p>
             </div>
             <div className="card scroll-fade-up" style={{ transitionDelay: '100ms' }}>
               <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Non-EU Candidates</h3>
               <p style={{ color: '#475569', lineHeight: 1.6 }}>Applying from outside the EU means a separate quota and process, generally including pre-enrolment at an Italian embassy/consulate tied to your visa.</p>
             </div>
          </div>
          
          <div className="scroll-fade-up" style={{ marginTop: '40px', backgroundColor: '#F0FFF4', border: '1px solid #BBF7D0', padding: '32px', borderRadius: '16px' }}>
             <h4 style={{ fontWeight: 700, color: '#16A34A', marginBottom: '16px', fontSize: '1.1rem' }}>Which one am I?</h4>
             <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: '#0F172A', fontWeight: 500 }}>
               <li style={{ display: 'flex', gap: '12px' }}><CheckCircle2 color="#16A34A" /> EU citizen, or non-EU legally resident in Italy meeting the criteria? → <strong>EU pool.</strong></li>
               <li style={{ display: 'flex', gap: '12px' }}><CheckCircle2 color="#16A34A" /> Applying from abroad on a student visa? → <strong>Non-EU pool.</strong></li>
             </ul>
             <div style={{ marginTop: '24px' }}>
                <button onClick={() => setLeadOpen(true)} className="btn-secondary">Still unsure? Ask us</button>
             </div>
          </div>
          <div style={{ marginTop: '20px', fontSize: '0.85rem', color: '#64748B', display: 'flex', gap: '8px' }}>
             <AlertCircle size={16} style={{ flexShrink: 0 }} />
             "Rules, quotas and procedures are set by MUR/Universitaly and can change — always confirm your category and process on Universitaly.it."
          </div>
        </div>
      </section>

      {/* 09 — Where Can You Study */}
      <section style={{ padding: '80px 0', backgroundColor: '#0F172A' }}>
        <div className="container">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
             <div>
               <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF' }}>Where Can You Study?</h2>
               <p style={{ color: '#94A3B8', marginTop: '12px' }}>A snapshot of top universities participating in the IMAT.</p>
             </div>
             <Link href="/universities" className="btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
               View All Universities
             </Link>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
             {[
               { name: 'La Sapienza', city: 'Rome', desc: 'One of Europe\'s oldest universities, offering a prestigious 6-year program.' },
               { name: 'University of Milan', city: 'Milan', desc: 'Renowned IMS program located in Italy\'s economic and fashion capital.' },
               { name: 'University of Pavia', city: 'Pavia', desc: 'The Harvey Medicine course in a historic, student-friendly university town.' }
             ].map((uni, i) => (
               <div key={i} className="card scroll-fade-up" style={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}>
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
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
           <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>What Does It Cost to Study Medicine in Italy?</h2>
           <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '32px' }}>
             Italian public universities generally charge tuition scaled to family income (ISEE), often notably lower than private medical programmes elsewhere in Europe. Regional scholarships (DSU) can reduce or cover tuition and include a living stipend for eligible students, including international applicants.
           </p>
           <Link href="/scholarships" className="btn-outline">Explore Costs & Scholarships <ArrowRight size={18}/></Link>
        </div>
      </section>

      {/* 11 — How Ahsora Prepares You */}
      <section id="preparation" style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>How Ahsora Prepares You</h2>
            <p style={{ color: '#64748B', marginTop: '12px' }}>The Ahsora Signature Learning Cycle</p>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginBottom: '60px' }}>
             {['Learn', 'Practice', 'Test', 'Analyze', 'Improve', 'Repeat'].map((step, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#F0FFF4', border: '2px solid #5CED73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#16A34A' }}>
                     {i+1}
                   </div>
                   <div style={{ fontWeight: 700, color: '#0F172A' }}>{step}</div>
                </div>
             ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            <div className="card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                 <PlayCircle size={28} color="#16A34A" />
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>Live Teaching</h3>
               </div>
               <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '24px' }}>
                 Ahsora combines structured digital preparation with live, teacher-led classes — difficult concepts explained, questions discussed, and doubts resolved in real time. Recordings available for every session.
               </p>
            </div>
            <div className="card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                 <Target size={28} color="#16A34A" />
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>Mocks & Analytics</h3>
               </div>
               <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '24px' }}>
                 Full-length timed mocks with official-style scoring, detailed question review, subject/topic performance breakdown, and timing analysis so you know exactly what to fix before the real exam.
               </p>
               <Link href="/portal/courses" style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>View the IMAT Course <ArrowRight size={16}/></Link>
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
      <section style={{ padding: '80px 0', backgroundColor: '#16A34A', color: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '20px' }}>Get the Free IMAT Starter Kit</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '40px', color: '#DCFCE7' }}>
            Syllabus overview, subject checklist, recommended study order, a study timeline, mock-test strategy, and a university-planning checklist — sent straight to your inbox.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column', maxWidth: '400px', margin: '0 auto' }}>
            <input type="text" placeholder="Your Name" className="form-input" style={{ backgroundColor: '#FFFFFF', border: 'none' }} />
            <input type="email" placeholder="Your Email" className="form-input" style={{ backgroundColor: '#FFFFFF', border: 'none' }} />
            <button className="btn-primary" style={{ backgroundColor: '#0F172A', color: '#FFFFFF', width: '100%', marginTop: '8px' }}>
              Get the Free Starter Kit <ArrowRight size={18}/>
            </button>
          </div>
        </div>
      </section>

      {/* 15 — FAQ + Final CTA */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '80px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', border: openFaq === i ? '1px solid #16A34A' : '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1rem', color: '#0F172A', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '16px' }}
                >
                  <span style={{ flex: 1 }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={20} color="#16A34A" /> : <ChevronDown size={20} color="#64748B" />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 24px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
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
