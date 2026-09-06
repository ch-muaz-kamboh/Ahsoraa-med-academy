'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, CheckCircle2, ChevronDown, ChevronUp,
  BookOpen, Target, BarChart2, Globe2, Users, Lightbulb,
  MessageCircle, RefreshCw
} from 'lucide-react';

// ─── Intersection Observer Hook ──────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function AboutPage() {
  useScrollReveal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: 'Who founded Ahsora?', a: 'Ahsora Med Academy was founded by a final-year Medicine and Surgery student currently studying at the University of Messina, Italy — one of the public medical universities that admits students through the IMAT.' },
    { q: 'Why was Ahsora created?', a: 'Ahsora was created because the founder experienced firsthand the lack of structured, honest guidance during their own IMAT preparation journey. The academy exists to give the next student a clearer, more supported path.' },
    { q: 'What is the founder\'s background?', a: 'The founder is a final-year Medicine and Surgery student at the University of Messina, Italy. They have direct, current experience of the IMAT exam, Italian university admissions, and life as an international medical student in Italy.' },
    { q: 'Is Ahsora accredited or affiliated with a university?', a: 'Ahsora Med Academy is an independent educational academy. It is not formally affiliated with or accredited by a university. It is founded and operated by someone currently studying medicine at an Italian public university.' },
    { q: 'Who teaches Ahsora programmes?', a: 'Ahsora programmes are taught by qualified instructors with subject expertise relevant to the IMAT syllabus. The founder\'s academic experience shapes the method; live teaching is delivered by the faculty team.' },
    { q: 'Does the founder personally teach students?', a: 'The founder\'s method and experience inform the entire academy, and the founder is directly involved in guidance sessions for Mastery and Elite students. Teaching across all subjects is delivered through the qualified faculty team.' },
    { q: 'How are students supported?', a: 'Students can ask questions during live classes, access recorded lectures and resources, use the CBT mock system, and connect with the academic support team. Mastery and Elite students also receive scheduled founder guidance sessions.' },
    { q: 'How is Ahsora different from other IMAT academies?', a: 'Ahsora was built from a student\'s firsthand experience of the journey — not designed at a distance from it. The combination of live teaching, a structured digital portal, real CBT mock exams, and honest guidance beyond the exam is what distinguishes Ahsora\'s approach.' },
    { q: 'Is Ahsora currently founder-led?', a: 'Yes. Ahsora is currently a founder-led academy. The programmes and operational approach are shaped directly by the founder.' },
    { q: 'Does Ahsora guarantee admission, scholarships or visas?', a: 'No. Ahsora provides preparation, structured guidance and application support. Admission, scholarship and visa decisions are made by universities and relevant authorities — never by Ahsora.' },
    { q: 'What are Ahsora\'s plans for the future?', a: 'In the near term: continuing to improve the IMAT preparation ecosystem and expanding recorded content as more live sessions are delivered. Longer term: expanding into additional medical exam programmes (USMLE is a planned future area) once genuinely ready.' },
  ];

  return (
    <>
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 80ms; }
        .reveal-delay-2 { transition-delay: 160ms; }
        .reveal-delay-3 { transition-delay: 240ms; }
        .reveal-delay-4 { transition-delay: 320ms; }

        .container { max-width: 760px; margin: 0 auto; padding: 0 24px; }

        .about-value-card {
          background: #fff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 40px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .about-value-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
        }

        .about-pillar {
          background: var(--bg-subtle);
          border-radius: var(--radius-lg);
          padding: 28px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          border: 1px solid var(--border-light);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .about-pillar:hover {
          border-color: var(--primary-300);
          box-shadow: var(--shadow-sm);
        }

        .method-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1 1 0;
          min-width: 100px;
          padding: 28px 12px;
          border-radius: var(--radius-lg);
          background: #fff;
          border: 1px solid var(--border-light);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .method-step:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .about-never-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid var(--border-light);
        }
        .about-never-item:last-child { border-bottom: none; }

        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .about-story-grid { grid-template-columns: 1fr !important; }
          .method-row { flex-wrap: wrap !important; }
          .method-step { min-width: 140px; }
          .container { padding: 0 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>

        {/* ── 01 HERO ─────────────────────────────────────────────────────── */}
        <section style={{ padding: '120px 0 80px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, var(--primary-50) 0%, #ffffff 60%)' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', opacity: 0.08, zIndex: 0 }}>
            <Image src="/messina-university.jpg" alt="" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="about-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
              <div>
                <span className="reveal section-tagline">Why Ahsora Exists</span>
                <h1 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '28px', marginTop: '16px' }}>
                  I Know What It Feels Like to Figure It All Out Alone.
                </h1>
                <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.85, marginBottom: '40px', maxWidth: '520px' }}>
                  Ahsora was built from firsthand experience of the journey to Medicine in Italy — the uncertainty, the decisions, the preparation and everything that comes after the exam. We built Ahsora to make that journey clearer, more structured and less lonely for the students who come after us.
                </p>
                <div className="reveal reveal-delay-3" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <a href="#story" className="btn-primary" style={{ padding: '16px 36px' }}>Meet the Founder <ArrowRight size={18} /></a>
                  <Link href="/courses" className="btn-outline" style={{ padding: '16px 28px', backgroundColor: '#fff' }}>Explore Ahsora</Link>
                </div>
              </div>
              <div className="reveal reveal-delay-2" style={{ position: 'relative', height: '540px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                <Image src="/founder-about.jpg" alt="Ahsora founder at the University of Messina, Italy" fill style={{ objectFit: 'cover' }} priority />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px', background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, transparent 100%)' }}>
                  <div style={{ color: 'var(--primary-400)', fontWeight: 800, fontSize: '0.9rem' }}>Final-Year Medicine &amp; Surgery Student</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '4px' }}>University of Messina, Italy · Founder, Ahsora Med Academy</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 OUR STORY ─────────────────────────────────────────────── */}
        <section id="story" style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <span className="reveal section-tagline">Our Story</span>
            <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '40px', lineHeight: 1.2 }}>
              Before Ahsora, There Was a Student Trying to Find the Way.
            </h2>
            <div className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.9 }}>
              <p style={{ marginBottom: '24px' }}>
                I decided I wanted to study Medicine in Italy. It sounded straightforward — sit the IMAT, choose a university, apply. But when I actually started preparing, I realized how little structured help existed. Information was scattered across forums, YouTube videos, and WhatsApp groups. Most of it was unverified, outdated, or impossible to act on without context.
              </p>
              <p style={{ marginBottom: '24px' }}>
                I didn't have a mentor who had done this before. I figured out the syllabus through trial and error. I worked through past papers alone. I made mistakes that a clearer guide would have prevented. And when I passed the IMAT and arrived in Messina, I realized that had only been the first chapter — the university, the clinical rotations, the system of studying medicine in a second language, were challenges no online resource had adequately prepared me for.
              </p>
              <p style={{ marginBottom: '24px' }}>
                Before Ahsora formally existed, I found myself helping other students — friends, and friends of friends — who were at the same crossroads I had been. Explaining the exam structure, helping someone build a study plan, walking through the application process. It became clear that the need wasn't for more content. It was for a system, and a person who had actually done it.
              </p>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                That realization became Ahsora.
              </p>
            </div>
            <div className="reveal reveal-delay-3" style={{ marginTop: '40px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '28px 32px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                <Image src="/founder-about.jpg" alt="Founder" fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.05rem' }}>Founder, Ahsora Med Academy</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Final-Year Medicine &amp; Surgery · University of Messina, Italy</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 THE TURNING POINT ─────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
          <div className="container">
            <span className="reveal section-tagline">The Turning Point</span>
            <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '20px', lineHeight: 1.2 }}>
              The Problem Wasn't Always the Student.
            </h2>
            <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '56px' }}>
              Through my own preparation, I kept noticing the same three things. They weren't unique to me — I saw them in every student I helped.
            </p>
          </div>
          <div className="container">
            <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
              {[
                { num: '01', title: 'Too Much Information', desc: 'Students can find information everywhere — but struggle to identify what actually matters for the exam and the journey.' },
                { num: '02', title: 'Too Little Guidance', desc: 'A syllabus tells you what exists. It rarely tells you how to approach it, what to prioritize, or how to study effectively under exam conditions.' },
                { num: '03', title: 'Too Many Decisions at Once', desc: 'The IMAT is only one part — choosing a university, understanding the application, planning the wider journey: students are asked to figure it all out simultaneously.' },
              ].map((item, i) => (
                <div key={i} className="about-value-card" style={{ borderTop: `4px solid var(--primary-400)` }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-100)', marginBottom: '12px', lineHeight: 1 }}>{item.num}</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '1rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="container reveal" style={{ marginTop: '48px' }}>
              <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', fontStyle: 'italic', textAlign: 'center' }}>
                "I believed there had to be a better way."
              </p>
            </div>
          </div>
        </section>

        {/* ── 04 AHSORA TODAY ──────────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="about-story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div className="reveal" style={{ position: 'relative', height: '480px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                <Image src="/messina-university.jpg" alt="University of Messina, Italy" fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <span className="reveal section-tagline">Ahsora Today</span>
                <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '24px', lineHeight: 1.2 }}>
                  So We Built Something Different.
                </h2>
                <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.85, marginBottom: '16px' }}>
                  Medicine in Italy isn't simply a destination on a map — for most students, it's an exam, a country, a university and a completely new chapter of life, all decided at once. That's why Ahsora doesn't stop at exam preparation.
                </p>
                <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.85, marginBottom: '40px' }}>
                  Ahsora Med Academy is a founder-led medical education academy focused on helping students prepare for the IMAT and navigate the wider journey to Medicine in Italy. Our work combines live teaching, structured digital preparation, realistic testing, performance feedback and guidance beyond the exam.
                </p>
                <div className="reveal reveal-delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { icon: <Users size={20} color="var(--primary-600)" />, label: 'Live Teaching' },
                    { icon: <BookOpen size={20} color="var(--primary-600)" />, label: 'Student Portal' },
                    { icon: <Target size={20} color="var(--primary-600)" />, label: 'CBT Mock Exams' },
                    { icon: <BarChart2 size={20} color="var(--primary-600)" />, label: 'Performance Tracking' },
                    { icon: <Globe2 size={20} color="var(--primary-600)" />, label: 'University & Admissions Guidance' },
                  ].map((p, i) => (
                    <div key={i} className="about-pillar">
                      <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.icon}</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', paddingTop: '10px' }}>{p.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 THE PHILOSOPHY ────────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(92,237,115,0.12) 0%, transparent 70%)', zIndex: 0 }} />
          <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <span className="reveal section-tagline" style={{ color: 'var(--primary-400)' }}>The Philosophy</span>
            <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', marginTop: '16px', marginBottom: '32px', letterSpacing: '-1px', lineHeight: 1.2 }}>
              A Journey Built Around Shared Experience.
            </h2>
            <p className="reveal reveal-delay-2" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.2rem', lineHeight: 1.9, marginBottom: '40px' }}>
              Ahsora wasn't built from a distance. It was built by someone who made the journey, understood its gaps, and decided to fill them for the students who come next.
            </p>
            <p className="reveal reveal-delay-3" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.1rem', lineHeight: 1.8 }}>
              The same experience that shaped the founder's path shapes every programme: what information actually matters, where students get lost, what the exam really tests, and what happens after you pass it. That's not something a distant curriculum can replicate — it's what firsthand experience makes possible.
            </p>
            <div className="reveal reveal-delay-4" style={{ marginTop: '56px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {['Firsthand Experience', 'Better Guidance', 'One Connected Journey'].map((label, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-full)', padding: '12px 24px', color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.95rem', backdropFilter: 'blur(10px)' }}>{label}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 06 WHAT WE STAND FOR ─────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="reveal section-tagline">What We Stand For</span>
              <h2 className="reveal reveal-delay-1" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px' }}>What You Can Expect From Ahsora</h2>
            </div>
            <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {[
                {
                  icon: <Lightbulb size={28} color="var(--primary-600)" />,
                  title: '01 — Clear Guidance',
                  desc: 'We explain what matters, what does not, and where official information should be checked. No vague direction, no unnecessary complexity.'
                },
                {
                  icon: <CheckCircle2 size={28} color="var(--primary-600)" />,
                  title: '02 — Honest Information',
                  desc: 'We distinguish verified official requirements from Ahsora\'s own guidance. We never manufacture certainty, and we say clearly when something is our view rather than official policy.'
                },
                {
                  icon: <MessageCircle size={28} color="var(--primary-600)" />,
                  title: '03 — Real Human Support',
                  desc: 'Students can ask questions, receive teacher guidance, and reach the appropriate support channel. The system is designed to be personal — not to replace a human with automation.'
                },
              ].map((item, i) => (
                <div key={i} className="about-value-card" style={{ textAlign: 'center' }}>
                  <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>{item.icon}</div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 07 THE AHSORA METHOD ─────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto 56px', padding: '0 24px', textAlign: 'center' }}>
            <span className="reveal section-tagline">The Ahsora Method</span>
            <h2 className="reveal reveal-delay-1" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px', marginBottom: '20px' }}>We Turn Preparation Into a Process.</h2>
            <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>Not more studying. Better-directed studying.</p>
          </div>
          <div className="container">
            <div className="method-row reveal" style={{ display: 'flex', gap: '16px', alignItems: 'stretch', justifyContent: 'center' }}>
              {[
                { step: 'Learn', num: '1', desc: 'Understand the concept.', icon: <BookOpen size={22} color="var(--primary-600)" /> },
                { step: 'Practice', num: '2', desc: 'Apply it through relevant questions.', icon: <Target size={22} color="var(--primary-600)" /> },
                { step: 'Test', num: '3', desc: 'Work under realistic exam conditions.', icon: <CheckCircle2 size={22} color="var(--primary-600)" /> },
                { step: 'Analyze', num: '4', desc: 'Identify errors, timing and weak areas.', icon: <BarChart2 size={22} color="var(--primary-600)" /> },
                { step: 'Improve', num: '5', desc: 'Target the gaps specifically.', icon: <Lightbulb size={22} color="var(--primary-600)" /> },
                { step: 'Repeat', num: '6', desc: 'Return to the cycle, stronger.', icon: <RefreshCw size={22} color="var(--primary-600)" /> },
              ].map((s, i) => (
                <div key={i} className="method-step" style={{ gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>{s.num}</div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>{s.step}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 08 WHY LIVE TEACHING MATTERS ────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="about-story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <span className="reveal section-tagline">Why Live Teaching Matters</span>
                <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '28px', lineHeight: 1.25 }}>
                  Some Things Are Easier to Understand With a Teacher in the Room.
                </h2>
                <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.85, marginBottom: '40px' }}>
                  A recorded explanation can give you information. A live teacher can see where you are confused, challenge your reasoning, explain the concept differently and answer the question you are actually asking.
                </p>
                <div className="reveal reveal-delay-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {['Live Classes', 'Real-Time Questions', 'Concept Explanation', 'Doubt Solving', 'Discussion'].map((tag, i) => (
                    <span key={i} style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-full)', padding: '8px 18px', fontWeight: 700, fontSize: '0.88rem' }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="reveal reveal-delay-2" style={{ position: 'relative', height: '420px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                <Image src="/live-classes.jpg" alt="Ahsora live teaching session" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── 09 THE TECHNOLOGY ────────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="reveal section-tagline">The Technology</span>
              <h2 className="reveal reveal-delay-1" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px', marginBottom: '16px' }}>Technology Should Make Learning Clearer, Not Colder.</h2>
              <p className="reveal reveal-delay-2" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>The technology organizes the journey. The teachers make it human.</p>
            </div>
            <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
              {[
                { img: '/portal-dashboard.jpg', label: 'Your Preparation', sub: 'Resources and structured progression' },
                { img: '/cbt-mock-exam.jpg', label: 'Your Practice', sub: 'Question bank and CBT simulations' },
                { img: '/live-classes.jpg', label: 'Your Progress', sub: 'Performance analytics and feedback' },
              ].map((t, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', position: 'relative', aspectRatio: '16/10', transition: 'transform 0.3s, box-shadow 0.3s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}>
                  <Image src={t.img} alt={t.label} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px 20px', background: 'linear-gradient(to top, rgba(15,23,42,0.88) 0%, transparent 100%)' }}>
                    <div style={{ color: 'var(--primary-400)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '4px' }}>{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10 MEET THE PEOPLE ───────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="reveal section-tagline">The Team</span>
              <h2 className="reveal reveal-delay-1" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px' }}>People Who Teach. People Who Know the Journey.</h2>
            </div>
            <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '260px' }}>
                  <Image src="/founder-about.jpg" alt="Founder" fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
                </div>
                <div style={{ padding: '28px' }}>
                  <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Founder</div>
                  <div style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>Leadership &amp; Academic Direction</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '16px' }}>Final-Year Medicine &amp; Surgery student at the University of Messina. Shapes every programme from firsthand experience of the journey.</p>
                  <a href="#story" style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Read the full story <ArrowRight size={16} /></a>
                </div>
              </div>
              {['Academic Faculty', 'Student Success & Admissions'].map((group, i) => (
                <div key={i} style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={32} color="var(--text-light)" />
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{group}</div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontStyle: 'italic' }}>Faculty profiles — coming soon</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11 WHAT WE WILL NEVER PROMISE ───────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
          <div className="container">
            <span className="reveal section-tagline">Our Commitment to Honesty</span>
            <h2 className="reveal reveal-delay-1" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '40px' }}>What We Will Never Promise</h2>
            <div className="reveal reveal-delay-2" style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '40px', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '32px' }}>We cannot promise:</p>
              {['Admission to any university', 'Scholarship awards', 'Visa approval'].map((item, i) => (
                <div key={i} className="about-never-item">
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'var(--danger)', fontWeight: 900, fontSize: '1rem' }}>✕</span>
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem', paddingTop: '4px' }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: '32px', padding: '24px', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)' }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.75 }}>
                  "Those decisions belong to universities and relevant authorities. What we can promise is that our guidance will be honest, our preparation will be structured, and our information will be treated seriously."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12 WHERE WE'RE GOING ─────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <span className="reveal section-tagline">The Road Ahead</span>
            <h2 className="reveal reveal-delay-1" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '40px' }}>Where Ahsora Is Headed</h2>
            <div className="reveal reveal-delay-2">
              <p style={{ fontSize: '1.1rem', lineHeight: 1.85, marginBottom: '32px', fontWeight: 600, color: 'var(--text-primary)' }}>Near-term — known and confirmed:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
                {[
                  'Continue improving the IMAT preparation ecosystem — better content, better feedback, better support.',
                  'Expand recorded content as more live sessions are delivered, so the library grows continuously.',
                  'Expand into additional medical-exam programmes — USMLE is a planned future direction — when genuinely ready.',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                    <CheckCircle2 size={22} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>{item}</span>
                  </div>
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.85 }}>
                Longer term — and only once the foundation is right: we want the journey to continue after the exam. Over time, students who progress through Ahsora may become resources for the students coming behind them — the same way this academy started with one student's experience helping the next.
              </p>
            </div>
          </div>
        </section>

        {/* ── 13 FAQ ───────────────────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span className="reveal section-tagline">Questions About Ahsora</span>
              <h2 className="reveal reveal-delay-1" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px' }}>Frequently Asked Questions</h2>
            </div>
            <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', border: openFaq === i ? '1px solid var(--primary-400)' : '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: openFaq === i ? 'var(--shadow-sm)' : 'none' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.05rem', color: openFaq === i ? 'var(--primary-700)' : 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '20px', transition: 'color 0.2s' }}>
                    <span style={{ flex: 1 }}>{faq.q}</span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: openFaq === i ? 'var(--primary-50)' : 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {openFaq === i ? <ChevronUp size={18} color="var(--primary-600)" /> : <ChevronDown size={18} color="var(--text-light)" />}
                    </div>
                  </button>
                  <div style={{ maxHeight: openFaq === i ? '400px' : '0', opacity: openFaq === i ? 1 : 0, overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 14 FINAL CTA ─────────────────────────────────────────────── */}
        <section style={{ padding: '120px 0', backgroundColor: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(92,237,115,0.15) 0%, transparent 70%)', zIndex: 0 }} />
          <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 className="reveal" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '24px', letterSpacing: '-1px' }}>
              Start Your Journey With Ahsora.
            </h2>
            <p className="reveal reveal-delay-1" style={{ color: 'var(--text-light)', fontSize: '1.2rem', marginBottom: '48px', lineHeight: 1.8 }}>
              Explore how we prepare students for the IMAT and support the wider journey to Medicine in Italy.
            </p>
            <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
              <Link href="/courses" className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>Explore IMAT Preparation</Link>
              <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '18px 32px', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <MessageCircle size={18} /> Talk to the Founder
              </a>
            </div>
            <p className="reveal reveal-delay-3" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic' }}>
              You don't have to figure it all out alone.
            </p>
          </div>
        </section>

      </div>
    </>
  );
}
