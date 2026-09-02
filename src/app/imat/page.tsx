'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, FileCheck, Target, Clock, Award, CheckCircle2,
  ArrowRight, Zap, BarChart3, Users, ChevronDown, ChevronUp, Globe,
} from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

const subjects = [
  { name: 'Biology', topics: 40, color: '#22C55E', desc: 'Cell biology, genetics, human anatomy, physiology, evolution, and ecology.' },
  { name: 'Chemistry', topics: 35, color: '#16A34A', desc: 'Organic & inorganic chemistry, thermodynamics, kinetics, and solutions.' },
  { name: 'Physics', topics: 28, color: '#D4AF37', desc: 'Mechanics, waves, electricity, optics, and modern physics.' },
  { name: 'Math & Logic', topics: 20, color: '#0B2B5C', desc: 'Algebra, geometry, statistics, and critical reasoning problems.' },
  { name: 'General Knowledge', topics: 12, color: '#64748B', desc: 'Italian culture, science history, current affairs, and reading comprehension.' },
];

const faqs = [
  { q: 'What is the IMAT?', a: 'The International Medical Admissions Test (IMAT) is an admissions examination for international degree programs in Medicine and Surgery at Italian state universities. It is administered by Cambridge Assessment Admissions Testing on behalf of the Italian Ministry of University and Research (MUR).' },
  { q: 'How is the IMAT scored?', a: 'The test has 60 questions answered in 100 minutes. Scoring: +1.5 for each correct answer, −0.4 for each incorrect answer, and 0 for each unanswered question. The maximum achievable score is 90.' },
  { q: 'When is the IMAT exam held?', a: 'The IMAT is typically held in September each year. For the 2027/2028 academic year, the exam date is expected in September 2027. Registration usually opens in July.' },
  { q: 'Which universities accept IMAT scores?', a: 'All major Italian public universities with English-medium medicine programs accept IMAT scores, including La Sapienza Rome, University of Milan, University of Pavia, University of Bologna, and more.' },
  { q: 'How many questions are in each section?', a: 'Section 1 (General Knowledge & Logical Reasoning): 23 questions. Section 2 (Biology): 18 questions. Section 3 (Chemistry): 12 questions. Section 4 (Physics & Math): 7 questions.' },
  { q: 'What score do I need to get into a top Italian university?', a: 'Competitive scores are generally 40+ for lower-ranked universities and 55+ for top institutions like La Sapienza and University of Milan. Scores vary yearly based on the cohort\'s performance.' },
];

export default function IMATPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #F0FFF4 0%, #FFFFFF 60%)', padding: '80px 0 60px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Your IMAT Guide
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#0F172A', marginTop: '12px', marginBottom: '20px', letterSpacing: '-1px', lineHeight: 1.15 }}>
            Everything you need to know about the IMAT
          </h1>
          <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '36px' }}>
            The International Medical Admissions Test (IMAT) is your gateway to studying Medicine in Italy. We cover everything — from exam structure and scoring to subject breakdowns and top universities.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setLeadOpen(true)} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              <span>Book Free Counselling</span>
              <ArrowRight size={18} />
            </button>
            <Link href="/#packages" className="btn-outline" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              View Packages
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXAM AT A GLANCE ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0F172A' }}>IMAT at a Glance</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { icon: <FileCheck size={26} color="#22C55E" />, label: '60 Questions', sub: 'Multiple Choice' },
              { icon: <Clock size={26} color="#22C55E" />, label: '100 Minutes', sub: 'Exam Duration' },
              { icon: <Target size={26} color="#D4AF37" />, label: '90 Max Score', sub: '+1.5 / −0.4 / 0' },
              { icon: <Globe size={26} color="#0B2B5C" />, label: 'Italy-Wide', sub: '16+ Universities' },
              { icon: <Award size={26} color="#22C55E" />, label: 'September', sub: 'Annual Exam Date' },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '28px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#0F172A' }}>{stat.label}</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0F172A' }}>IMAT Subject Breakdown</h2>
            <p style={{ color: '#64748B', marginTop: '10px', fontSize: '1rem' }}>Five core sections tested — all covered in our courses.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {subjects.map((s) => (
              <div key={s.name} style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={22} color={s.color} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A' }}>{s.name}</div>
                  <div style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '4px' }}>{s.desc}</div>
                </div>
                <div style={{ backgroundColor: `${s.color}15`, color: s.color, borderRadius: '20px', padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0 }}>
                  {s.topics}+ Topics
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY AHSORA ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#0F172A' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#FFFFFF' }}>Why Ahsora for IMAT?</h2>
            <p style={{ color: '#94A3B8', marginTop: '10px' }}>Purpose-built for IMAT success — not a generic test prep platform.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { icon: <Zap size={22} color="#D4AF37" />, title: '2,800+ IMAT Questions', desc: 'Fully explained, categorized by topic and difficulty level.' },
              { icon: <BarChart3 size={22} color="#22C55E" />, title: 'CBT Mock Tests', desc: '12 full-length mocks with the exact MUR scoring formula.' },
              { icon: <Users size={22} color="#22C55E" />, title: '1-on-1 Mentors', desc: 'IMAT-certified mentors with 90th+ percentile scores.' },
              { icon: <CheckCircle2 size={22} color="#D4AF37" />, title: '96.8% Pass Rate', desc: '3,500+ students placed in Italian medical universities.' },
            ].map((f, i) => (
              <div key={i} style={{ backgroundColor: '#1E293B', borderRadius: '14px', padding: '28px 24px', border: '1px solid #334155' }}>
                <div style={{ marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0F172A' }}>IMAT FAQ</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', border: openFaq === i ? '1px solid #BBF7D0' : '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '16px' }}>
                  <span style={{ flex: 1 }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} color="#22C55E" /> : <ChevronDown size={18} color="#64748B" />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 20px', color: '#475569', fontSize: '0.9375rem', lineHeight: 1.7, borderTop: '1px solid #F0FFF4', paddingTop: '16px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Start your IMAT journey today</h2>
          <p style={{ color: '#64748B', marginBottom: '32px', lineHeight: 1.7 }}>Get a personalized study plan, subject audit, and mock test schedule built around your exam date.</p>
          <button onClick={() => setLeadOpen(true)} className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            <span>Book Free Counselling</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} defaultExam="IMAT" />
    </div>
  );
}
