'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Calendar, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { mockScholarships } from '@/lib/mock-data';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

export default function ScholarshipsPage() {
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0F172A 100%)',
          color: '#FFFFFF',
          padding: '116px 20px 60px',
          borderBottom: '1px solid #1E293B',
          marginBottom: '40px',
        }}
      >
        <div className="container">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5CED73', textTransform: 'uppercase', letterSpacing: '1.5px', backgroundColor: 'rgba(92,237,115,0.15)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(92,237,115,0.3)' }}>
            Financial Aid & Grants
          </span>
          <h1 style={{ fontSize: '2.4rem', color: '#FFFFFF', marginTop: '16px', marginBottom: '8px' }}>
            Medical Scholarships & Government Grants
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1rem', maxWidth: '750px', margin: 0 }}>
            Verified government scholarships covering 100% of university tuition, living stipends, and accommodation in Italy, Hungary, and Europe.
          </p>
        </div>
      </div>

      <div className="container">

        {/* Scholarships Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '28px',
          }}
        >
          {mockScholarships.map((sch) => (
            <div
              key={sch.id}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-blue">{sch.country}</span>
                <span className="badge badge-green">
                  <ShieldCheck size={12} />
                  Verified: {sch.lastVerifiedAt}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '8px', lineHeight: 1.3 }}>
                {sch.title}
              </h3>

              <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 700, marginBottom: '14px' }}>
                {sch.coverageAmount}
              </div>

              <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                {sch.eligibilitySummary}
              </p>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.8125rem',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#0F172A',
                }}
              >
                <Calendar size={16} color="#D97706" />
                <span>Application Deadline: <strong>{sch.deadline}</strong></span>
              </div>

              <button
                onClick={() => setLeadModalOpen(true)}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
              >
                <span>Check Scholarship Eligibility</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
      />
    </div>
  );
}
