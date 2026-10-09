'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Building2,
  MapPin,
  Globe,
  Award,
  CheckCircle,
  FileText,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Stethoscope,
  Banknote,
  Clock,
  Check,
  Users,
  Compass,
  Building,
  HeartHandshake,
} from 'lucide-react';
import { mockUniversities } from '@/lib/mock-data';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

export default function UniversityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'admissions' | 'hospitals' | 'costs' | 'curriculum'>('overview');

  const lookupKey = decodeURIComponent(resolvedParams.id).toLowerCase();
  const university =
    mockUniversities.find(
      (u) =>
        u.id.toLowerCase() === lookupKey ||
        u.slug.toLowerCase() === lookupKey ||
        u.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(lookupKey.replace(/[^a-z0-9]/g, '')) ||
        (u.italianName && u.italianName.toLowerCase().replace(/[^a-z0-9]/g, '').includes(lookupKey.replace(/[^a-z0-9]/g, '')))
    ) || mockUniversities[0];

  if (!university) {
    notFound();
  }

  const isPublic = university.type ? university.type === 'Public' : university.tuitionFeeAnnual < 5000;
  const route = university.admissionRoute || (isPublic ? 'IMAT' : 'University-specific');

  // Related universities to explore
  const relatedUniversities = mockUniversities
    .filter((u) => u.id !== university.id && (u.country === 'Italy' || u.country === university.country))
    .slice(0, 3);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '100px 0 80px 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px', fontSize: '0.875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#059669', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          <span>/</span>
          <Link href="/universities" style={{ color: '#059669', textDecoration: 'none', fontWeight: 500 }}>Universities</Link>
          <span>/</span>
          <span style={{ color: '#0F172A', fontWeight: 600 }}>{university.name}</span>
        </div>

        {/* Hero Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #E2E8F0',
            overflow: 'hidden',
            marginBottom: '32px',
            boxShadow: '0 8px 30px rgba(15,23,42,0.04)',
          }}
        >
          {/* Hero Banner with Image & Badges */}
          <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
            <img
              src={university.imageUrl}
              alt={university.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)' }} />

            <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: isPublic ? 'rgba(5,150,105,0.95)' : 'rgba(124,58,237,0.95)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {isPublic ? 'Public University' : 'Private / Independent'}
              </span>
              <span
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}
              >
                {route === 'IMAT' ? '🎯 IMAT Route (MUR Coordinated)' : `Route: ${route}`}
              </span>
              <span
                style={{
                  background: 'rgba(15,23,42,0.7)',
                  backdropFilter: 'blur(8px)',
                  color: '#5CED73',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: '1px solid rgba(92,237,115,0.3)',
                }}
              >
                <ShieldCheck size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                Fact-Checked Cycle 2026/27
              </span>
            </div>

            <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>
                  <MapPin size={16} color="#5CED73" />
                  <span>{university.city}, {university.country}</span>
                  {university.region && <span>• Region: {university.region}</span>}
                </div>
                <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#FFFFFF', fontWeight: 800, margin: 0, lineHeight: 1.15 }}>
                  {university.name}
                </h1>
              </div>

              {university.rankingWorld > 0 && (
                <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#5CED73', fontWeight: 700, display: 'block' }}>QS World Rank</span>
                  <strong style={{ fontSize: '1.1rem' }}>#{university.rankingWorld}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Hero Content & CTA Row */}
          <div style={{ padding: '32px' }}>
            {university.italianName && university.italianName !== university.name && (
              <p style={{ color: '#64748B', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '16px', fontWeight: 500 }}>
                {university.italianName}
              </p>
            )}

            <p style={{ color: '#334155', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '28px', maxWidth: '900px' }}>
              {university.overview}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => setLeadModalOpen(true)}
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '0.95rem' }}
              >
                <span>Request University Guidance</span>
                <ArrowRight size={18} />
              </button>

              <a
                href={university.officialWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 22px',
                  borderRadius: '999px',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#1E293B',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.color = '#059669'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#1E293B'; }}
              >
                <ExternalLink size={16} />
                <span>Official Faculty Portal</span>
              </a>

              <Link
                href="/free-mock"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 22px',
                  borderRadius: '999px',
                  background: '#F0FDF4',
                  border: '1.5px solid #BBF7D0',
                  color: '#166534',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <span>Take Diagnostic Mock</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Quick Admission Metrics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '36px',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Banknote size={15} color="#059669" /> Annual Tuition
            </span>
            <strong style={{ fontSize: '1.35rem', color: '#059669', display: 'block', marginTop: '6px' }}>
              {university.currency === 'EUR' ? '€' : '$'}{university.tuitionFeeAnnual.toLocaleString()}/yr
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{isPublic ? 'ISEE income-scaled' : 'Fixed upfront fee'}</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} color="#3B82F6" /> EU Quota Seats
            </span>
            <strong style={{ fontSize: '1.35rem', color: '#0F172A', display: 'block', marginTop: '6px' }}>
              {university.euSeats || '60+'} Seats
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Assigned via EU merit list</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={15} color="#8B5CF6" /> Non-EU Quota Seats
            </span>
            <strong style={{ fontSize: '1.35rem', color: '#0F172A', display: 'block', marginTop: '6px' }}>
              {university.nonEuSeats || '20+'} Seats
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Dedicated visa quota</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={15} color="#F59E0B" /> Reference Cutoff
            </span>
            <strong style={{ fontSize: '1.15rem', color: '#0F172A', display: 'block', marginTop: '6px' }}>
              {route === 'IMAT' ? 'Historical Range' : 'Merit Test'}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>See section below</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={15} color="#059669" /> Degree Awarded
            </span>
            <strong style={{ fontSize: '1.15rem', color: '#0F172A', display: 'block', marginTop: '6px' }}>
              6-Year Single-Cycle MD
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>360 ECTS · Laurea Magistrale</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="#6366F1" /> Intake Cycle
            </span>
            <strong style={{ fontSize: '1.15rem', color: '#0F172A', display: 'block', marginTop: '6px' }}>
              {university.intakes.join(', ')}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Autumn Academic Term</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', marginBottom: '28px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { id: 'overview', label: 'Faculty Overview & Highlights' },
            { id: 'admissions', label: 'Admissions & IMAT Requirements' },
            { id: 'hospitals', label: 'Clinical Teaching Hospitals' },
            { id: 'costs', label: 'Tuition, Living Costs & Scholarships' },
            { id: 'curriculum', label: '6-Year MD Curriculum' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                color: activeTab === tab.id ? '#059669' : '#64748B',
                borderBottom: activeTab === tab.id ? '3px solid #059669' : '3px solid transparent',
                marginBottom: '-2px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, marginBottom: '16px' }}>
                Key Highlights of this Medical Faculty
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {university.overview}
              </p>

              {university.highlights && university.highlights.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {university.highlights.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <CheckCircle size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600 }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {university.campusLocation && (
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.875rem' }}>
                  <Building size={16} color="#059669" />
                  <span>Main Campus Address: <strong style={{ color: '#0F172A' }}>{university.campusLocation}</strong></span>
                </div>
              )}
            </div>

            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, marginBottom: '16px' }}>
                Available Academic Programs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {university.programs.map((prog, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#F0FDF4',
                      border: '1.5px solid #BBF7D0',
                      borderRadius: '12px',
                      padding: '16px',
                      color: '#14532D',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '1rem' }}>{prog}</strong>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '999px' }}>English</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#166534' }}>
                      Accredited by the Italian Ministry of Universities and Research (MUR) and recognized across the European Union, UK (GMC), and USA (ECFMG / USMLE eligibility).
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ fontSize: '0.9375rem', color: '#1E40AF', fontWeight: 700, marginBottom: '6px' }}>
                  🌐 International Recognition
                </h4>
                <p style={{ fontSize: '0.8125rem', color: '#1E3A8A', margin: 0, lineHeight: 1.5 }}>
                  Graduates of Italian public medical faculties automatically hold direct practice rights in Italy and all 27 EU member states upon passing the qualifying internship, without needing additional licensing exams in the European Union.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Admissions */}
        {activeTab === 'admissions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, marginBottom: '16px' }}>
                Eligibility & Prerequisites
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {university.eligibility}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { title: 'Minimum 12 Years of Formal Schooling', desc: 'Candidates holding an 11-year diploma must provide 1 year of university credits or foundation course certificate.' },
                  { title: route === 'IMAT' ? 'Official IMAT Examination Qualification' : 'Institutional Admissions Examination', desc: 'Registration takes place on the official Universitaly portal during the annual summer window.' },
                  { title: 'Science Prerequisite Preparation', desc: 'Tested in Biology, Chemistry, Physics, Mathematics, Reading Skills & Logical Reasoning.' },
                  { title: 'Declaration of Value (DOV) or CIMEA', desc: 'Statement of Comparability issued by the Italian diplomatic mission or CIMEA online verification.' },
                  { title: 'Apostille & Sworn Legal Translations', desc: 'Certified translation into Italian of all secondary school transcripts and diploma.' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0, marginTop: '2px' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.9375rem', color: '#0F172A', display: 'block', marginBottom: '2px' }}>{item.title}</strong>
                      <span style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5 }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, marginBottom: '16px' }}>
                Historical Cutoff & Competition Guidance
              </h3>

              {university.historicalCutoffNote ? (
                <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                  <p style={{ color: '#92400E', fontSize: '0.875rem', margin: 0, fontWeight: 600 }}>
                    💡 {university.historicalCutoffNote}
                  </p>
                </div>
              ) : null}

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                At Italian public medical faculties, cutoffs are determined strictly by the national merit ranking based on official IMAT scores. EU and Non-EU applicants compete within separate designated seat quotas.
              </p>

              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748B' }}>EU Quota Seats:</span>
                  <strong style={{ color: '#0F172A' }}>{university.euSeats || 'Variable'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748B' }}>Non-EU Quota Seats:</span>
                  <strong style={{ color: '#0F172A' }}>{university.nonEuSeats || 'Variable'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748B' }}>Admission Route:</span>
                  <strong style={{ color: '#059669' }}>{route}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Link
                  href="/universities#cutoff-history"
                  style={{ color: '#059669', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  View Historical IMAT Cutoff Table Across All Universities →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Hospitals */}
        {activeTab === 'hospitals' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, marginBottom: '16px' }}>
                Affiliated University Hospitals
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Clinical rotations begin in the 3rd year and ramp up to full bedside immersion in the 5th and 6th years across premier hospital centers:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {(university.hospitalAffiliations || ['Regional University Polyclinic Hospital', 'Pediatric Clinical Center']).map((hosp, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <Stethoscope size={22} color="#059669" />
                    <div>
                      <strong style={{ fontSize: '0.9375rem', color: '#0F172A', display: 'block' }}>{hosp}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Primary Teaching &amp; Emergency Hub</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, marginBottom: '16px' }}>
                Clinical Clerkship Structure
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderLeft: '3px solid #059669', paddingLeft: '14px' }}>
                  <h4 style={{ fontSize: '0.9375rem', color: '#0F172A', fontWeight: 700, margin: '0 0 4px 0' }}>Years 1–2: Early Clinical Exposure</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>Simulation laboratory practice, patient communication, first-aid training, and medical genetics diagnostics.</p>
                </div>
                <div style={{ borderLeft: '3px solid #3B82F6', paddingLeft: '14px' }}>
                  <h4 style={{ fontSize: '0.9375rem', color: '#0F172A', fontWeight: 700, margin: '0 0 4px 0' }}>Years 3–4: General Medicine &amp; Surgery</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>Rotation through internal medicine wards, general surgery operating rooms, and clinical pathology laboratories.</p>
                </div>
                <div style={{ borderLeft: '3px solid #8B5CF6', paddingLeft: '14px' }}>
                  <h4 style={{ fontSize: '0.9375rem', color: '#0F172A', fontWeight: 700, margin: '0 0 4px 0' }}>Years 5–6: Specialized Rotations &amp; Licensing</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>Obstetrics &amp; Gynecology, Pediatrics, Cardiology, Emergency Medicine, and the State Qualifying Internship (Abilitazione).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Costs & Scholarships */}
        {activeTab === 'costs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, marginBottom: '16px' }}>
                Tuition Fee Mechanism
              </h3>
              {isPublic ? (
                <>
                  <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '16px' }}>
                    Tuition at Italian public universities is income-assessed based on your family&apos;s financial situation using Italy&apos;s <strong>ISEE Parificato</strong> economic indicator:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#334155' }}>ISEE &lt; €13,000 (Low income):</span>
                      <strong style={{ color: '#059669', fontSize: '0.85rem' }}>€156 / year (Base regional fee only)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#334155' }}>ISEE €13,000 – €26,000 (Mid income):</span>
                      <strong style={{ color: '#0F172A', fontSize: '0.85rem' }}>€500 – €1,500 / year</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#334155' }}>ISEE &gt; €30,000 (Higher bracket):</span>
                      <strong style={{ color: '#0F172A', fontSize: '0.85rem' }}>€2,000 – €{university.tuitionFeeAnnual.toLocaleString()} / year (Max cap)</strong>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Tuition is a fixed published annual fee of €{university.tuitionFeeAnnual.toLocaleString()} per year, with installment plans and institution-specific merit discounts available.
                </p>
              )}

              {university.scholarshipInfo && (
                <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '12px', padding: '16px' }}>
                  <h4 style={{ fontSize: '0.9375rem', color: '#166534', fontWeight: 700, marginBottom: '6px' }}>
                    🏆 Regional Scholarship Opportunities
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: '#14532D', margin: 0, lineHeight: 1.5 }}>
                    {university.scholarshipInfo}
                  </p>
                </div>
              )}
            </div>

            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, marginBottom: '16px' }}>
                Estimated Cost of Living in {university.city}
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Average monthly student expenditure for housing, food, transport, and utilities:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Room / Student Accommodation:</span>
                  <strong style={{ color: '#0F172A' }}>€300 – €650 / mo</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Food &amp; University Canteen:</span>
                  <strong style={{ color: '#0F172A' }}>€180 – €280 / mo</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '0.875rem' }}>City Transportation &amp; Metro:</span>
                  <strong style={{ color: '#0F172A' }}>€20 – €35 / mo</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Utilities &amp; Mobile Internet:</span>
                  <strong style={{ color: '#0F172A' }}>€40 – €70 / mo</strong>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Typical Total Budget</span>
                <strong style={{ fontSize: '1.25rem', color: '#059669' }}>€600 – €1,000 / month</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Curriculum */}
        {activeTab === 'curriculum' && (
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '36px' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, marginBottom: '8px' }}>
              6-Year Single-Cycle Medical Curriculum Structure (360 ECTS)
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '28px' }}>
              The program is organized into 12 semesters over six academic years, strictly aligned with the European Directive 2005/36/EC for mutual recognition across the European Union.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                { year: 'Year 1', phase: 'Pre-Clinical Sciences', modules: 'Human Anatomy I, Medical Histology, Physics & Statistics, General Chemistry & Biochemistry, Medical Biology & Genetics' },
                { year: 'Year 2', phase: 'Human Physiology & Pathophysiology', modules: 'Human Anatomy II, Human Physiology, Microbiology & Parasitology, Immunology, General Pathology' },
                { year: 'Year 3', phase: 'Clinical Foundations', modules: 'Systemic Pathology, Clinical Methodology & Semiotics, Pharmacology & Toxicology, Hospital Ward Rotations' },
                { year: 'Year 4', phase: 'Integrated Medical Specialties', modules: 'Internal Medicine I, General Surgery I, Diagnostic Radiology & Imaging, Dermatology, Laboratory Medicine' },
                { year: 'Year 5', phase: 'Specialized Clinical Clerkships', modules: 'Pediatrics, Obstetrics & Gynecology, Neurology & Psychiatry, Cardiology, Orthopedics, Ophthalmology' },
                { year: 'Year 6', phase: 'Rotations & State Qualifying Internship', modules: 'Emergency Medicine, Forensic Medicine, Direct Qualifying Medical Internship, Experimental Thesis Defense' },
              ].map((yr, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', background: '#DCFCE7', padding: '3px 10px', borderRadius: '999px' }}>{yr.year}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>60 ECTS</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#0F172A', fontWeight: 700, margin: '0 0 8px 0' }}>{yr.phase}</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>{yr.modules}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ahsora Guidance CTA Banner */}
        <div
          style={{
            marginTop: '48px',
            marginBottom: '48px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F2D1A 100%)',
            borderRadius: '24px',
            padding: '40px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <span style={{ color: '#5CED73', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              🎯 Target Admission in Italy
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 10px 0', lineHeight: 1.25 }}>
              Prepare for {university.name} with Ahsora Med Academy
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9375rem', margin: 0, lineHeight: 1.6 }}>
              Join thousands of aspiring doctors mastering the IMAT. Access our 10,000+ verified medical MCQ bank, real-time diagnostic simulations, and 1-on-1 mentorship.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setLeadModalOpen(true)}
              className="btn-primary"
              style={{ padding: '14px 28px', fontSize: '0.95rem' }}
            >
              <span>Get Application Support</span>
              <ArrowRight size={18} />
            </button>
            <Link
              href="/free-mock"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '999px',
                border: '1.5px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              <span>Free Diagnostic Mock</span>
            </Link>
          </div>
        </div>

        {/* Other Universities to Compare */}
        {relatedUniversities.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, margin: 0 }}>
                Explore Other Medical Universities
              </h3>
              <Link href="/universities" style={{ color: '#059669', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
                View All Universities →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {relatedUniversities.map((uni) => (
                <div
                  key={uni.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                    <img src={uni.imageUrl} alt={uni.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                      <span style={{ background: 'rgba(5,150,105,0.95)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
                        {uni.admissionRoute || 'IMAT'}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <MapPin size={12} />
                      <span>{uni.city}, {uni.country}</span>
                    </div>
                    <h4 style={{ fontSize: '1rem', color: '#0F172A', fontWeight: 700, margin: '0 0 10px 0' }}>
                      {uni.name}
                    </h4>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 700 }}>
                        {uni.currency === 'EUR' ? '€' : '$'}{uni.tuitionFeeAnnual.toLocaleString()}/yr
                      </span>
                      <Link
                        href={`/universities/${uni.slug || uni.id}`}
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: '#059669',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        Profile →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        defaultCountry={university.country}
      />
    </div>
  );
}
