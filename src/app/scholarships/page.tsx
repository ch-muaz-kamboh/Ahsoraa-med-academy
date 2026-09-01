'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Calendar, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { mockScholarships } from '@/lib/mock-data';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

export default function ScholarshipsPage() {
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
            Financial Aid & Grants
          </span>
          <h1 style={{ fontSize: '2.4rem', color: '#0F172A', marginTop: '4px', marginBottom: '8px' }}>
            Medical Scholarships & Government Grants
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '750px' }}>
            Verified government scholarships covering 100% of university tuition, living stipends, and accommodation in Italy, Hungary, and Europe.
          </p>
        </div>

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

              <div style={{ fontSize: '0.875rem', color: '#2563EB', fontWeight: 700, marginBottom: '14px' }}>
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
