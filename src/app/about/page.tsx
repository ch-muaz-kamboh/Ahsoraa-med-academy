'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, CheckCircle2, ChevronDown, ChevronUp,
  BookOpen, Target, BarChart2, Globe2, Users, Lightbulb,
  MessageCircle, RefreshCw, Award, ShieldCheck
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

        .container {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .container-narrow {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .about-value-card {
          background: var(--bg-main);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 36px 28px;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .about-value-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-300);
        }

        .about-pillar {
          background: var(--bg-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          border: 1px solid var(--border-light);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .about-pillar:hover {
          border-color: var(--primary-400);
          box-shadow: var(--shadow-sm);
          transform: translateY(-2px);
        }

        .method-step-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 18px;
          border-radius: var(--radius-xl);
          background: var(--bg-main);
          border: 1px solid var(--border-light);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative;
        }
        .method-step-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-400);
        }

        .about-never-card {
          background: var(--bg-main);
          border: 1px solid var(--border-light);
          border-top: 4px solid var(--danger);
          border-radius: var(--radius-xl);
          padding: 36px 28px;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .about-never-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 1024px) {
          .method-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 900px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .about-story-grid { grid-template-columns: 1fr !important; }
          .about-two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
          .about-three-col { grid-template-columns: 1fr !important; }
          .method-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .container { padding: 0 16px; }
        }

        @media (max-width: 640px) {
          .method-grid { grid-template-columns: 1fr !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>

        {/* ── 01 HERO ─────────────────────────────────────────────────────── */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          {/* Full-bleed background */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Image src="/messina-university.jpg" alt="University of Messina, Italy" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} priority />
          </div>
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,18,10,0.95) 0%, rgba(5,50,30,0.85) 50%, rgba(15,23,42,0.9) 100%)', zIndex: 1 }} />
          {/* Green glow orb */}
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,237,115,0.15) 0%, transparent 70%)', zIndex: 2, pointerEvents: 'none' }} />
          
          {/* Content */}
          <div className="container" style={{ position: 'relative', zIndex: 3, padding: '140px 20px 120px' }}>
            <div className="about-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }}>
              {/* Left — headline */}
              <div>
                <h1 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '24px' }}>
                  I Know What It Feels Like to Figure It All Out <span style={{ color: 'var(--primary-400)' }}>Alone.</span>
                </h1>
                <p className="reveal reveal-delay-2" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '48px', maxWidth: '580px' }}>
                  Ahsora was built from firsthand experience of the journey to Medicine in Italy — the uncertainty, the decisions, the preparation and everything that comes after the exam. We built Ahsora to make that journey clearer, more structured and less lonely for the students who come after us.
                </p>
                <div className="reveal reveal-delay-3" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <a href="#story" className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.05rem', borderRadius: 'var(--radius-full)' }}>Meet the Founder <ArrowRight size={18} /></a>
                  <Link href="/courses"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '18px 32px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
                    Explore Ahsora
                  </Link>
                </div>
              </div>
              
              {/* Right — floating founder card */}
              <div className="reveal reveal-delay-2" style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                <div style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px', maxWidth: '340px', width: '100%', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)' }}>
                  <div style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '320px', width: '100%', marginBottom: '20px' }}>
                    <Image src="/founder-about.jpg" alt="Ahsan Jahangir, Founder" fill style={{ objectFit: 'cover', objectPosition: 'center 20%' }} />
                    <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'var(--primary-400)', color: '#0a140c', fontWeight: 900, fontSize: '0.75rem', padding: '6px 14px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 20px rgba(92,237,115,0.4)' }}>
                      Founder-Led
                    </div>
                  </div>
                  <div style={{ padding: '0 8px 8px' }}>
                    <div style={{ color: 'var(--primary-400)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Founder</div>
                    <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>Ahsan Jahangir</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.5 }}>Final-Year Medicine &amp; Surgery<br/>University of Messina, Italy</div>
                  </div>
                </div>
                {/* Glow behind card */}
                <div style={{ position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,237,115,0.2) 0%, transparent 60%)', zIndex: -1, pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
            <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>Scroll</span>
            <div style={{ width: '1px', height: '44px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)' }} />
          </div>
        </section>

        {/* ── 02 OUR STORY ─────────────────────────────────────────────── */}
        <section id="story" style={{ padding: '100px 0', backgroundColor: 'var(--bg-main)' }}>
          <div className="container">
            <div className="about-two-col" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              {/* Left Column: Heading & Founder Card */}
              <div style={{ flex: 1 }}>
                <span className="reveal section-tagline">Our Story</span>
                <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '16px', lineHeight: 1.2 }}>
                  Before Ahsora, There Was a Student Trying to Find the Way.
                </h2>
                <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '24px' }}>
                  The hardest part of preparing for medical school in Italy was never the science — it was finding reliable, structured guidance in a sea of unverified internet advice.
                </p>

                {/* Founder Badge / Card */}
                <div className="reveal reveal-delay-3" style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--primary-400)', position: 'relative' }}>
                      <Image src="/founder-about.jpg" alt="Ahsan Jahangir" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.15rem' }}>Ahsan Jahangir</div>
                      <div style={{ color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Founder &amp; Academic Director</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Final-Year Medicine &amp; Surgery · Univ. of Messina</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color="var(--primary-600)" />
                      <span>Direct IMAT qualifier &amp; Italian medical scholar</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color="var(--primary-600)" />
                      <span>Founder-led curriculum &amp; personalized mentoring</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Founder's Personal Letter */}
              <div className="reveal reveal-delay-2" style={{ flex: 1.35, backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '48px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-full)', padding: '6px 16px', marginBottom: '28px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-700)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Letter from the Founder</span>
                </div>
                
                <div style={{ color: 'var(--text-secondary)', fontSize: '1.075rem', lineHeight: 1.9 }}>
                  <p style={{ marginBottom: '24px' }}>
                    I decided I wanted to study Medicine in Italy. It sounded straightforward — sit the IMAT, choose a university, apply. But when I actually started preparing, I realized how little structured help existed. Information was scattered across forums, YouTube videos, and WhatsApp groups. Most of it was unverified, outdated, or impossible to act on without context.
                  </p>
                  <p style={{ marginBottom: '24px' }}>
                    I didn't have a mentor who had done this before. I figured out the syllabus through trial and error. I worked through past papers alone. I made mistakes that a clearer guide would have prevented. And when I passed the IMAT and arrived in Messina, I realized that had only been the first chapter — the university, the clinical rotations, the system of studying medicine in a second language, were challenges no online resource had adequately prepared me for.
                  </p>
                  <p style={{ marginBottom: '28px' }}>
                    Before Ahsora formally existed, I found myself helping other students — friends, and friends of friends — who were at the same crossroads I had been. Explaining the exam structure, helping someone build a study plan, walking through the application process. It became clear that the need wasn't for more content. It was for a system, and a person who had actually done it.
                  </p>
                  
                  <div style={{ padding: '24px 28px', backgroundColor: 'var(--bg-main)', borderLeft: '4px solid var(--primary-500)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0', marginBottom: '36px', boxShadow: 'var(--shadow-xs)' }}>
                    <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.25rem', lineHeight: 1.4, margin: 0 }}>
                      "That realization became Ahsora."
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginTop: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '2.5rem', color: 'var(--text-primary)', transform: 'rotate(-2deg)', display: 'inline-block' }}>
                        Ahsan Jahangir
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Founder, Ahsora Med Academy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 THE TURNING POINT ─────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
          <div className="container" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="reveal section-tagline">The Turning Point</span>
            <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '20px', lineHeight: 1.2 }}>
              The Problem Wasn't Always the Student.
            </h2>
            <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '680px', margin: '0 auto' }}>
              Through my own preparation, I kept noticing the same three things. They weren't unique to me — I saw them in every student I helped.
            </p>
          </div>
          <div className="container">
            <div className="about-three-col reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {[
                { num: '01', title: 'Too Much Information', desc: 'Students can find information everywhere — but struggle to identify what actually matters for the exam and the journey.' },
                { num: '02', title: 'Too Little Guidance', desc: 'A syllabus tells you what exists. It rarely tells you how to approach it, what to prioritize, or how to study effectively under exam conditions.' },
                { num: '03', title: 'Too Many Decisions', desc: 'The IMAT is only one part — choosing a university, understanding the application, planning the wider journey: students are asked to figure it all out.' },
              ].map((item, i) => (
                <div key={i} className="about-value-card" style={{ borderTop: `4px solid var(--primary-400)`, padding: '36px 28px', height: '100%' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-400)', marginBottom: '16px', lineHeight: 1 }}>{item.num}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="reveal" style={{ marginTop: '48px' }}>
              <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', fontStyle: 'italic', textAlign: 'center' }}>
                "I believed there had to be a better way."
              </p>
            </div>
          </div>
        </section>

        {/* ── 04 AHSORA TODAY ──────────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-main)' }}>
          <div className="container">
            <div className="about-story-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'stretch' }}>
              <div className="reveal" style={{ position: 'relative', minHeight: '520px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                <Image src="/messina-university.jpg" alt="University of Messina campus" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="reveal section-tagline">Ahsora Today</span>
                <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '24px', lineHeight: 1.2 }}>
                  So We Built Something Different.
                </h2>
                <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.85, marginBottom: '16px' }}>
                  Medicine in Italy isn't simply a destination on a map — for most students, it's an exam, a country, a university and a completely new chapter of life, all decided at once. That's why Ahsora doesn't stop at exam preparation.
                </p>
                <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.85, marginBottom: '32px' }}>
                  Ahsora Med Academy is a founder-led medical education academy focused on helping students prepare for the IMAT and navigate the wider journey to Medicine in Italy. Our work combines live teaching, structured digital preparation, realistic testing, performance feedback and guidance beyond the exam.
                </p>
                <div className="reveal reveal-delay-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { icon: <Users size={20} color="var(--primary-600)" />, label: 'Live Teaching' },
                    { icon: <BookOpen size={20} color="var(--primary-600)" />, label: 'Student Portal' },
                    { icon: <Target size={20} color="var(--primary-600)" />, label: 'CBT Mock Exams' },
                    { icon: <Globe2 size={20} color="var(--primary-600)" />, label: 'University Guidance' },
                  ].map((p, i) => (
                    <div key={i} className="about-pillar" style={{ padding: '20px', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.icon}</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{p.label}</div>
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
          <div className="container-narrow" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
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
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-main)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="reveal section-tagline">What We Stand For</span>
              <h2 className="reveal reveal-delay-1" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px' }}>What You Can Expect From Ahsora</h2>
            </div>
            <div className="about-three-col reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
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
          <div className="container" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="reveal section-tagline">The Ahsora Method</span>
            <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '14px', marginBottom: '16px' }}>
              We Turn Preparation Into a Process.
            </h2>
            <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto' }}>
              Not more studying. Better-directed studying. A continuous 6-step cycle built specifically around the demands of the IMAT exam.
            </p>
          </div>

          <div className="container">
            {/* 6 Steps horizontally across the 1240px container */}
            <div className="method-grid reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', alignItems: 'stretch' }}>
              {[
                { step: 'Learn', num: '01', desc: 'Understand core concepts from first principles.', icon: <BookOpen size={22} color="var(--primary-600)" /> },
                { step: 'Practice', num: '02', desc: 'Apply knowledge through targeted, topic-wise questions.', icon: <Target size={22} color="var(--primary-600)" /> },
                { step: 'Test', num: '03', desc: 'Simulate full exams under authentic timed conditions.', icon: <CheckCircle2 size={22} color="var(--primary-600)" /> },
                { step: 'Analyze', num: '04', desc: 'Pinpoint error patterns, timing, and score gaps.', icon: <BarChart2 size={22} color="var(--primary-600)" /> },
                { step: 'Improve', num: '05', desc: 'Remediate blind spots with instructor guidance.', icon: <Lightbulb size={22} color="var(--primary-600)" /> },
                { step: 'Repeat', num: '06', desc: 'Return to the cycle calibrated, sharper, and confident.', icon: <RefreshCw size={22} color="var(--primary-600)" /> },
              ].map((s, i) => (
                <div key={i} className="method-step-card">
                  <div style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-700)', background: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                    {s.num}
                  </div>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', marginTop: '6px' }}>
                    {s.icon}
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '8px' }}>{s.step}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Horizontal Process Banner below */}
            <div className="reveal reveal-delay-3" style={{ marginTop: '36px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', boxShadow: 'var(--shadow-xs)' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={16} color="var(--primary-600)" /> The Closed-Loop Framework:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <span>Theory</span> <span style={{ color: 'var(--primary-500)' }}>→</span>
                <span>Application</span> <span style={{ color: 'var(--primary-500)' }}>→</span>
                <span>CBT Simulation</span> <span style={{ color: 'var(--primary-500)' }}>→</span>
                <span>Analytics</span> <span style={{ color: 'var(--primary-500)' }}>→</span>
                <span>Remediation</span> <span style={{ color: 'var(--primary-500)' }}>→</span>
                <span style={{ color: 'var(--primary-700)', fontWeight: 800 }}>Exam Mastery</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 WHY LIVE TEACHING MATTERS ────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-main)' }}>
          <div className="container">
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
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="reveal section-tagline">The Technology</span>
              <h2 className="reveal reveal-delay-1" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px', marginBottom: '16px' }}>Technology Should Make Learning Clearer, Not Colder.</h2>
              <p className="reveal reveal-delay-2" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>The technology organizes the journey. The teachers make it human.</p>
            </div>
            <div className="about-three-col reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
              {[
                { img: '/portal-dashboard.jpg', label: 'Your Preparation', sub: 'Resources and structured progression' },
                { img: '/cbt-mock-exam.jpg', label: 'Your Practice', sub: 'Question bank and CBT simulations' },
                { img: '/live-classes.jpg', label: 'Your Journey', sub: 'Performance analytics and feedback' },
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
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-main)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="reveal section-tagline">The Team</span>
              <h2 className="reveal reveal-delay-1" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px' }}>People Who Teach. People Who Know the Journey.</h2>
            </div>
            <div className="about-three-col reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
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
            {/* Header */}
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 56px' }}>
              <span className="reveal section-tagline">Our Commitment to Honesty</span>
              <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '14px', marginBottom: '16px' }}>
                What We Will Never Promise
              </h2>
              <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.75 }}>
                Many agencies sell false certainties to attract students. At Ahsora, we build on integrity. We are completely upfront about what is outside any academy's legal or realistic authority.
              </p>
            </div>

            {/* 3 Horizontal Cards Side by Side */}
            <div className="commitment-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginBottom: '32px' }}>
                {[
                  {
                    title: 'Guaranteed University Admission',
                    reason: 'Admission to Italian public medical universities is determined solely by official IMAT ranking lists and university selection committees — never by any private academy.',
                    label: 'University Authority'
                  },
                  {
                    title: 'Guaranteed Scholarship Awards',
                    reason: 'Regional scholarship grants (such as DSU or ER.GO) are allocated strictly by Italian regional bodies based on certified ISEE-parificato financial documents and academic merit.',
                    label: 'Regional Agency Authority'
                  },
                  {
                    title: 'Guaranteed Visa Approval',
                    reason: 'Visa issuance is the exclusive sovereign prerogative of Italian embassies and consulates worldwide. No independent organization can guarantee an entry visa outcome.',
                    label: 'Diplomatic Authority'
                  }
                ].map((item, i) => (
                  <div key={i} className="about-never-card compact-card" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center', flex: '1', minWidth: '280px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.reason}</p>
                    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-light)' }}>Determined by: {item.label}</div>
                  </div>
                ))}
            </div>

            {/* Horizontal "What We DO Promise" Banner */}
            <div className="reveal reveal-delay-2" style={{ backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--primary-300)', padding: '36px 44px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '28px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={36} color="var(--primary-600)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    What We Promise With 100% Commitment
                  </div>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.75, margin: 0 }}>
                    "Those decisions belong to universities and relevant authorities. What we can promise is that our guidance will be honest, our preparation will be structured, and your aspirations will be treated with the seriousness they deserve."
                  </p>
                  <div style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    — Ahsan Jahangir, Founder &amp; Academic Director
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12 WHERE WE'RE GOING ─────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-main)' }}>
          <div className="container">
            <div className="about-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '56px', alignItems: 'start' }}>
              <div>
                <span className="reveal section-tagline">The Road Ahead</span>
                <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '24px', lineHeight: 1.25 }}>
                  Where Ahsora Is Headed
                </h2>
                <p className="reveal reveal-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.85, marginBottom: '28px' }}>
                  We are building an enduring ecosystem for medical students. From IMAT preparation to clinical years in Italy, our roadmap is guided by real academic needs.
                </p>
                <div className="reveal reveal-delay-3" style={{ padding: '24px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px' }}>Long-Term Vision</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                    Over time, students who progress through Ahsora become mentors for the students coming behind them — the same way this academy started with one student's experience helping the next.
                  </p>
                </div>
              </div>
              <div className="reveal reveal-delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { title: 'Digital Transformation', desc: 'Continuous enhancement of our CBT simulation engine and performance analytics suite.' },
                  { title: 'Clinical Integration', desc: 'Expanding support for students through their transition into hospital rotations and clinical practice.' },
                  { title: 'Community Growth', desc: 'Developing a peer-to-peer mentoring network that spans multiple Italian medical universities.' }
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <CheckCircle2 size={20} color="var(--primary-600)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '6px' }}>{item.title}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 13 FAQ ───────────────────────────────────────────────────── */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-subtle)' }}>
          <div className="container" style={{ maxWidth: '1040px' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span className="reveal section-tagline">Questions About Ahsora</span>
              <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '12px' }}>Frequently Asked Questions</h2>
            </div>
            <div className="reveal" style={{ display: 'flex', gap: '24px' }}>
              {/* Left column: list of questions */}
              <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="reveal"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      textAlign: 'left',
                      background: openFaq === i ? 'var(--primary-50)' : 'var(--bg-main)',
                      border: openFaq === i ? '2px solid var(--primary-400)' : '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-lg)',
                      fontWeight: 700,
                      color: openFaq === i ? 'var(--primary-700)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'background 0.3s, border 0.3s',
                    }}
                  >
                    {faq.q}
                  </button>
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
          <div className="container-narrow" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 className="reveal" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-light)', marginBottom: '24px', letterSpacing: '-1px' }}>
              Start Your Journey With Ahsora.
            </h2>
            <p className="reveal reveal-delay-1" style={{ color: 'var(--text-light)', fontSize: '1.2rem', marginBottom: '48px', lineHeight: 1.8 }}>
              Explore how we prepare students for the IMAT and support the wider journey to Medicine in Italy.
            </p>
            <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
              <Link href="/courses" className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>Explore IMAT Preparation</Link>
              <a href="https://wa.me/393333444479" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '18px 32px', color: 'var(--text-light)', borderColor: 'rgba(255,255,255,0.25)' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
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
