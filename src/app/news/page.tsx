'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Tag, Clock, User } from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import { useState } from 'react';

const posts = [
  {
    tag: 'Admissions',
    tagColor: '#22C55E',
    date: 'Sep 2, 2026',
    readTime: '4 min read',
    title: 'Admissions Open in Italy for 2027/2028 Academic Year',
    excerpt: 'The Italian Ministry of University and Research (MUR) has officially announced that applications for the 2027/2028 IMAT cycle are now open. Here\'s everything you need to know about deadlines, eligible universities, and what documents to prepare.',
    author: 'Ahsora Team',
    featured: true,
  },
  {
    tag: 'IMAT Tips',
    tagColor: '#D4AF37',
    date: 'Aug 28, 2026',
    readTime: '6 min read',
    title: 'How to Score 60+ on the IMAT: A High-Yield Strategy Guide',
    excerpt: 'Scoring 60+ requires more than hard work — it demands the right strategy. We break down the exact approach top-scoring Ahsora students use to maximize their marks in Biology, Chemistry, and Logical Reasoning.',
    author: 'Dr. Sofia Renna',
    featured: false,
  },
  {
    tag: 'University Guide',
    tagColor: '#0B2B5C',
    date: 'Aug 20, 2026',
    readTime: '8 min read',
    title: 'Top 5 Italian Universities for International Medical Students in 2027',
    excerpt: 'La Sapienza, University of Milan, Bologna, Pavia, or Naples? We rank the top 5 Italian medical schools for English-language programs, comparing cost of living, clinical exposure, and IMAT cutoff scores.',
    author: 'Ahsora Research Team',
    featured: false,
  },
  {
    tag: 'Study Plan',
    tagColor: '#7C3AED',
    date: 'Aug 15, 2026',
    readTime: '5 min read',
    title: 'The 12-Week IMAT Study Plan That Gets Results',
    excerpt: 'Starting from scratch with 12 weeks to go? Our evidence-based study schedule — used by 3,500+ Ahsora students — breaks down exactly what to study each week, how many practice questions to tackle, and when to do mock tests.',
    author: 'Ahsora Academic Team',
    featured: false,
  },
  {
    tag: 'Licensing',
    tagColor: '#DC2626',
    date: 'Aug 8, 2026',
    readTime: '7 min read',
    title: 'After IMAT: Your Global Licensing Options as an Italian Medical Graduate',
    excerpt: 'Graduating from an Italian medical university opens doors worldwide. We walk through how to proceed to PLAB (UK), USMLE (USA), AMC (Australia), and FMGE (India) after completing your Italian medical degree.',
    author: 'Dr. Tariq Al-Hassan',
    featured: false,
  },
  {
    tag: 'Visa & Living',
    tagColor: '#16A34A',
    date: 'Jul 30, 2026',
    readTime: '5 min read',
    title: 'Student Visa Guide for Italy 2027: Everything You Need to Know',
    excerpt: 'Applying for a Type D student visa for Italy? We cover the complete application process, document checklist, income thresholds, and embassy interview tips for Pakistani, Egyptian, and South Asian applicants.',
    author: 'Ahsora Visa Team',
    featured: false,
  },
];

export default function NewsPage() {
  const [leadOpen, setLeadOpen] = useState(false);

  const featured = posts.find(p => p.featured)!;
  const rest = posts.filter(p => !p.featured);

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #F0FFF4 0%, #FFFFFF 60%)', padding: '80px 0 60px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Ahsora Blog
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#0F172A', marginTop: '12px', marginBottom: '20px', letterSpacing: '-1px', lineHeight: 1.15 }}>
            News, Guides & Updates
          </h1>
          <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Stay up to date with the latest IMAT news, admission announcements, study tips, and expert guides from the Ahsora team.
          </p>
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      <section style={{ padding: '60px 0 40px', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured Story</span>
          </div>
          <div style={{ backgroundColor: '#F0FFF4', border: '2px solid #BBF7D0', borderRadius: '20px', padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#22C55E', color: '#FFF', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                🔔 {featured.tag}
              </span>
              <span style={{ color: '#64748B', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={13} /> {featured.date}
              </span>
              <span style={{ color: '#64748B', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} /> {featured.readTime}
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, margin: 0 }}>
              {featured.title}
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>{featured.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {featured.author}</span>
              <button onClick={() => setLeadOpen(true)} style={{ backgroundColor: '#22C55E', color: '#FFF', border: 'none', borderRadius: '8px', padding: '9px 20px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Read Full Article <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL POSTS ── */}
      <section style={{ padding: '20px 0 80px', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {rest.map((post, i) => (
              <div key={i} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px -6px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: `${post.tagColor}15`, color: post.tagColor, padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Tag size={10} style={{ marginRight: '4px' }} />{post.tag}
                  </span>
                  <span style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>{post.date}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', lineHeight: 1.4, margin: 0 }}>{post.title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, margin: 0 }}>{post.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={12} />{post.readTime}</span>
                  <button onClick={() => setLeadOpen(true)} style={{ background: 'none', border: 'none', color: '#22C55E', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read More <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#0F172A', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '580px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>Stay Updated</h2>
          <p style={{ color: '#94A3B8', marginBottom: '32px', lineHeight: 1.7 }}>Get the latest IMAT news, admission deadlines, and study tips delivered straight to your inbox.</p>
          <button onClick={() => setLeadOpen(true)} className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem', backgroundColor: '#22C55E' }}>
            Subscribe to Updates
          </button>
        </div>
      </section>

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} />
    </div>
  );
}
