'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plane, CheckCircle2, ShieldCheck, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

export default function VisaPage() {
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const countries = [
    {
      country: 'Italy',
      visaType: 'National Type D Student Visa (Long Stay)',
      processingTime: '3-6 Weeks',
      financialRequirement: '€6,000+ Sponsor Bank Balance',
      checklists: [
        'Universitaly Pre-enrolment Summary Form',
        'Declaration of Value (DOV) or CIMEA Statement of Comparability',
        'Apostilled High School Diploma & Transcripts',
        'Schengen Area Comprehensive Medical Insurance (€30,000 minimum)',
        'Proof of Accommodation in Italy (Lease or University Dorm)',
        'Sponsor Bank Statements (Past 6 Months) + Tax Returns',
        'VFS / Embassy Appointment Slip',
      ],
    },
    {
      country: 'Hungary',
      visaType: 'Residence Permit for Study Purposes (D-Visa)',
      processingTime: '2-4 Weeks',
      financialRequirement: '$8,000+ Liquid Funds',
      checklists: [
        'Official University Letter of Acceptance',
        'Tuition Fee Payment Transfer Receipt',
        'Accommodation Confirmation in Hungary',
        'Bank Account Statement covering living expenses for 1 year',
        'Valid Passport (valid for at least 18 months)',
        'Biometrics Appointment at Embassy',
      ],
    },
    {
      country: 'United Kingdom',
      visaType: 'Student Visa (Student Route)',
      processingTime: '3 Weeks',
      financialRequirement: 'CAS Letter + 28-day Bank Holding',
      checklists: [
        'Confirmation of Acceptance for Studies (CAS) from Sponsor',
        'Funds held continuously for 28 consecutive days',
        'TB (Tuberculosis) Screening Certificate',
        'IELTS for UKVI (Academic) Certificate',
        'Immigration Health Surcharge (IHS) Payment',
      ],
    },
  ];

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
            Immigration & Embassy Guidance
          </span>
          <h1 style={{ fontSize: '2.4rem', color: '#FFFFFF', marginTop: '16px', marginBottom: '8px' }}>
            Medical Student Visa & Embassy Roadmaps
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1rem', maxWidth: '750px', margin: 0 }}>
            Complete step-by-step document legalization, Universitaly summaries, sponsor declarations, and embassy mock interviews.
          </p>
        </div>
      </div>

      <div className="container">

        {/* Disclaimer Alert */}
        <div
          style={{
            backgroundColor: '#F0FFF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <ShieldCheck size={24} color="#059669" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.875rem', color: '#14532D', lineHeight: 1.5 }}>
            <strong>Official Advisory:</strong> Ahsora Meds Academy provides document preparation, verification, and mock interviews. Final visa decisions rest solely with the sovereign embassies and consulates of the respective destination nations.
          </div>
        </div>

        {/* Countries Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
          {countries.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-blue">{item.country}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  Processing: {item.processingTime}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '12px' }}>
                {item.visaType}
              </h3>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '0.8125rem',
                  color: '#0F172A',
                  marginBottom: '16px',
                  border: '1px solid #E2E8F0',
                }}
              >
                Financial Requirement: <strong>{item.financialRequirement}</strong>
              </div>

              <div style={{ marginBottom: '20px', flex: 1 }}>
                <strong style={{ fontSize: '0.875rem', color: '#0F172A', display: 'block', marginBottom: '10px' }}>
                  Mandatory Document Checklist:
                </strong>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: '#475569' }}>
                  {item.checklists.map((chk, cIdx) => (
                    <li key={cIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <CheckCircle2 size={14} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{chk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setLeadModalOpen(true)}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
              >
                <span>Book Visa File Review</span>
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
