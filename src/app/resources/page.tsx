'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, FileCheck, Download, Video, BookMarked, FlaskConical, ArrowRight, Zap } from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import { useState } from 'react';

const resourceCategories = [
  {
    icon: <Video size={24} color="#22C55E" />,
    title: 'Video Lectures',
    desc: 'High-yield, structured video modules covering every IMAT topic. Organized by subject and difficulty.',
    count: '120+ Videos',
    color: '#22C55E',
    link: '/courses',
  },
  {
    icon: <FileCheck size={24} color="#D4AF37" />,
    title: 'Practice Question Banks',
    desc: '2,800+ IMAT-style MCQs with fully worked explanations, tagged by topic and year.',
    count: '2,800+ Questions',
    color: '#D4AF37',
    link: '/courses',
  },
  {
    icon: <Download size={24} color="#0B2B5C" />,
    title: 'Downloadable Notes',
    desc: 'Concise, exam-focused summary sheets for every IMAT topic — perfect for last-minute revision.',
    count: '80+ PDF Sheets',
    color: '#0B2B5C',
    link: '/courses',
  },
  {
    icon: <BookMarked size={24} color="#16A34A" />,
    title: 'Past Paper Library',
    desc: 'Complete archive of official IMAT past papers with model answers, going back 10 years.',
    count: '10 Years of Papers',
    color: '#16A34A',
    link: '/courses',
  },
  {
    icon: <FlaskConical size={24} color="#7C3AED" />,
    title: 'Lab & Experiment Guides',
    desc: 'Illustrated science guides for Biology and Chemistry experiments commonly referenced in IMAT questions.',
    count: '40+ Guides',
    color: '#7C3AED',
    link: '/courses',
  },
  {
    icon: <BookOpen size={24} color="#DC2626" />,
    title: 'IMAT Glossary',
    desc: 'A complete indexed glossary of medical, biological, and chemistry terminology tested in IMAT.',
    count: '500+ Terms',
    color: '#DC2626',
    link: '/courses',
  },
];

const freeResources = [
  { title: 'IMAT 2024 Official Past Paper', type: 'PDF', size: '1.2 MB' },
  { title: 'IMAT Biology Quick Reference Sheet', type: 'PDF', size: '840 KB' },
  { title: 'IMAT Scoring Calculator (Excel)', type: 'XLSX', size: '120 KB' },
  { title: 'Italy University Ranking 2027/2028', type: 'PDF', size: '2.1 MB' },
  { title: 'IMAT Study Schedule Template (12 Weeks)', type: 'PDF', size: '560 KB' },
];

export default function ResourcesPage() {
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #F0FFF4 0%, #FFFFFF 60%)', padding: '80px 0 60px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            IMAT Study Resources
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#0F172A', marginTop: '12px', marginBottom: '20px', letterSpacing: '-1px', lineHeight: 1.15 }}>
            Everything you need to ace the IMAT
          </h1>
          <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '36px' }}>
            Access our complete library of videos, question banks, notes, past papers, and downloadable tools — all curated specifically for IMAT success.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/courses" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              <span>Access Full Library</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/#packages" className="btn-outline" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              View Packages
            </Link>
          </div>
        </div>
      </section>

      {/* ── RESOURCE CATEGORIES ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0F172A' }}>Resource Categories</h2>
            <p style={{ color: '#64748B', marginTop: '10px' }}>Everything organized — so you can study smarter, not harder.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {resourceCategories.map((cat, i) => (
              <Link key={i} href={cat.link} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px 24px', height: '100%', transition: 'all 0.2s ease', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px -6px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    {cat.icon}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A' }}>{cat.title}</h3>
                    <span style={{ backgroundColor: `${cat.color}15`, color: cat.color, borderRadius: '12px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, marginLeft: '8px' }}>{cat.count}</span>
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE DOWNLOADS ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Completely Free</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>Free Resources</h2>
            <p style={{ color: '#64748B', marginTop: '10px' }}>Download these high-value IMAT materials at no cost.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {freeResources.map((r, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Download size={18} color="#22C55E" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9375rem' }}>{r.title}</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.8125rem', marginTop: '2px' }}>{r.type} · {r.size}</div>
                  </div>
                </div>
                <button onClick={() => setLeadOpen(true)} style={{ backgroundColor: '#F0FFF4', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '7px 16px', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                  Download Free
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#0F172A', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <Zap size={36} color="#D4AF37" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>Unlock the full resource library</h2>
          <p style={{ color: '#94A3B8', marginBottom: '32px', lineHeight: 1.7 }}>Get access to 2,800+ questions, 120+ video lectures, 12 mock exams, and personalized mentoring in one package.</p>
          <Link href="/#packages" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem', backgroundColor: '#D4AF37', color: '#0F172A', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>View All Packages</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} defaultExam="IMAT" />
    </div>
  );
}
