'use client';

import React from 'react';
import Link from 'next/link';
import { Stethoscope, Award, Users, ShieldCheck, CheckCircle2, Globe } from 'lucide-react';
import { mockMentors } from '@/lib/mock-data';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px auto' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase' }}>
            About Ahsora Meds Academy
          </span>
          <h1 style={{ fontSize: '2.5rem', color: '#0F172A', marginTop: '6px', marginBottom: '16px' }}>
            Empowering Future Doctors Worldwide
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.0625rem', lineHeight: 1.6 }}>
            Ahsora Meds Academy was founded by international medical graduates and admissions consultants to provide transparent, verified, and high-yield pathways into global medicine.
          </p>
        </div>

        {/* 3 Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#F0FDF9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#22C55E' }}>
              <Award size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '10px' }}>
              Fact-Checked Single Source of Truth
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>
              No outdated rumours or inflated fees. Every admission deadline, tuition cost, and visa requirement is verified directly against official ministry and university registers.
            </p>
          </div>

          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#F0FDF9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#22C55E' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '10px' }}>
              Direct Faculty & Doctor Mentorship
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Learn from licensed physicians and clinical residents who scored in the 99th percentile of USMLE, PLAB, and IMAT examinations.
            </p>
          </div>

          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#F0FDF9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#22C55E' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '10px' }}>
              End-to-End Security & Compliance
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Enterprise data privacy, role-based access control, secure student document vaults, and auditable application workflows.
            </p>
          </div>
        </div>

        {/* Mentors / Faculty Section */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '36px', marginBottom: '40px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.75rem', color: '#0F172A', marginBottom: '6px' }}>
              Our Senior Faculty & Mentors
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
              Book 1-on-1 consultations and clinical coaching sessions directly inside the student portal.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {mockMentors.map((m) => (
              <div
                key={m.id}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <img
                  src={m.avatarUrl}
                  alt={m.name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '4px' }}>{m.name}</h4>
                  <div style={{ fontSize: '0.8125rem', color: '#22C55E', fontWeight: 600, marginBottom: '6px' }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '10px' }}>
                    {m.qualifications}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, marginBottom: '12px' }}>
                    {m.bio}
                  </p>
                  <Link
                    href="/portal/mentorship"
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                  >
                    Book 1-on-1 Session (${m.hourlyRate}/hr)
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
