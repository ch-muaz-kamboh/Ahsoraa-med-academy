'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Globe, BookOpen, Shield, AlertCircle, Clock } from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

const exams = [
  {
    name: 'AMC (Australia)',
    flag: '🇦🇺',
    fullName: 'Australian Medical Council',
    desc: 'Two-part exam for international medical graduates seeking registration in Australia. Part 1 (MCQ) and Part 2 (Clinical).',
    steps: ['AMC Part 1 MCQ Exam', 'AMC Part 2 Clinical Exam', 'Internship / Supervised Practice', 'AHPRA Registration'],
    color: '#22C55E',
    tag: 'Australia & NZ',
  },
  {
    name: 'PLAB (UK)',
    flag: '🇬🇧',
    fullName: 'Professional and Linguistic Assessments Board',
    desc: 'The standard route for international medical graduates to practice medicine in the UK under the General Medical Council.',
    steps: ['IELTS / OET English Test', 'PLAB 1 (180 MCQs)', 'PLAB 2 (OSCE Circuit)', 'GMC Registration'],
    color: '#0B2B5C',
    tag: 'United Kingdom',
  },
  {
    name: 'USMLE (USA)',
    flag: '🇺🇸',
    fullName: 'United States Medical Licensing Examination',
    desc: 'Three-step licensing exam required to practice medicine in the United States, administered by NBME and FSMB.',
    steps: ['USMLE Step 1 (Basic Sciences)', 'USMLE Step 2 CK (Clinical Knowledge)', 'USMLE Step 2 CS (discontinued)', 'USMLE Step 3 + Residency'],
    color: '#DC2626',
    tag: 'United States',
  },
  {
    name: 'FMGE (India)',
    flag: '🇮🇳',
    fullName: 'Foreign Medical Graduates Examination',
    desc: 'Mandatory screening test for Indian nationals holding a foreign medical degree who wish to practice in India.',
    steps: ['Apply via NBE Portal', 'Appear in FMGE (300 MCQs)', 'Pass (150+ score required)', 'Provisional Registration with SMC/MCI'],
    color: '#D4AF37',
    tag: 'India',
  },
  {
    name: 'MCCQE (Canada)',
    flag: '🇨🇦',
    fullName: 'Medical Council of Canada Qualifying Examination',
    desc: 'Two-part exam for all graduates (domestic and international) seeking licensure to practice medicine in Canada.',
    steps: ['NAC OSCE (for IMGs)', 'MCCQE Part 1 (CDM + SAQ)', 'MCCQE Part 2 (OSCE)', 'Residency Match (CaRMS)'],
    color: '#7C3AED',
    tag: 'Canada',
  },
];

export default function LicensingExamsPage() {
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #F0FFF4 0%, #FFFFFF 60%)', padding: '80px 0 60px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Global Medical Licensing
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#0F172A', marginTop: '12px', marginBottom: '20px', letterSpacing: '-1px', lineHeight: 1.15 }}>
            Licensing Exams — Complete Global Guide
          </h1>
          <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '36px' }}>
            Planning to practice medicine internationally after your Italian degree? We guide you through every major licensing exam — from PLAB to USMLE, AMC to FMGE.
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

      {/* ── NOTICE ── */}
      <section style={{ padding: '40px 0', backgroundColor: '#FFFBEB' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <AlertCircle size={22} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: '#92400E', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
              <strong>Note:</strong> Licensing requirements change frequently. Always verify current requirements with the official regulatory body in your target country before applying.
            </p>
          </div>
        </div>
      </section>

      {/* ── EXAMS ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0F172A' }}>Major Licensing Pathways</h2>
            <p style={{ color: '#64748B', marginTop: '10px' }}>Step-by-step breakdowns for each major country's medical licensing route.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {exams.map((exam) => (
              <div key={exam.name} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '36px 32px', borderLeft: `4px solid ${exam.color}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{exam.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{exam.name}</h3>
                      <span style={{ backgroundColor: `${exam.color}15`, color: exam.color, padding: '3px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{exam.tag}</span>
                    </div>
                    <div style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '4px' }}>{exam.fullName}</div>
                    <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>{exam.desc}</p>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> Steps to Licensure
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {exam.steps.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 14px', fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: `${exam.color}20`, color: exam.color, fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx + 1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE HELP ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0F172A' }}>How Ahsora Helps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { icon: <BookOpen size={22} color="#22C55E" />, title: 'Exam-Specific Prep', desc: 'Targeted question banks and study plans aligned with each licensing exam\'s syllabus.' },
              { icon: <Globe size={22} color="#0B2B5C" />, title: 'Country Roadmaps', desc: 'Full step-by-step guides for registering, applying, and sitting each licensing exam.' },
              { icon: <Shield size={22} color="#D4AF37" />, title: '1-on-1 Mentoring', desc: 'Work with doctors who have already cleared the exam you\'re targeting.' },
              { icon: <CheckCircle2 size={22} color="#22C55E" />, title: 'Document Support', desc: 'Help with document legalization, credential verification, and official translations.' },
            ].map((f, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '28px 24px' }}>
                <div style={{ marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Not sure which exam to take?</h2>
          <p style={{ color: '#64748B', marginBottom: '32px', lineHeight: 1.7 }}>Our counsellors will help you map the right licensing pathway based on your target country and career goals.</p>
          <button onClick={() => setLeadOpen(true)} className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            <span>Book Free Counselling</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} />
    </div>
  );
}
