'use client';

import React from 'react';
import Link from 'next/link';
import { Globe2, Building2, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { mockApplicationCases } from '@/lib/mock-data';

export default function PortalApplicationsPage() {
  const activeCase = mockApplicationCases[0];

  const stages = [
    { title: 'Profile & Shortlisting', status: 'completed' },
    { title: 'Document Verification', status: 'completed' },
    { title: 'Application Prepared', status: 'current' },
    { title: 'University Submission', status: 'upcoming' },
    { title: 'Offer Letter', status: 'upcoming' },
    { title: 'Visa Processing', status: 'upcoming' },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          University Application Tracker
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Real-time lifecycle tracking of your medical admissions files, deadlines, and university correspondence.
        </p>
      </div>

      {/* Main Case Summary Card */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '6px' }}>
              Case File: {activeCase.caseNumber}
            </span>
            <h2 style={{ fontSize: '1.4rem', color: '#0F172A' }}>
              Target Country: {activeCase.targetCountry} ({activeCase.targetIntake})
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem' }}>
            <div>
              <span style={{ color: '#64748B' }}>Counsellor:</span>
              <div style={{ fontWeight: 600, color: '#0F172A' }}>{activeCase.assignedCounsellor}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Admissions Officer:</span>
              <div style={{ fontWeight: 600, color: '#0F172A' }}>{activeCase.assignedAdmissionsOfficer}</div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Lifecycle Progression */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          {stages.map((stg, sIdx) => {
            const isCompleted = stg.status === 'completed';
            const isCurrent = stg.status === 'current';

            return (
              <div
                key={sIdx}
                style={{
                  backgroundColor: isCurrent ? '#EFF6FF' : isCompleted ? '#ECFDF5' : '#F8FAFC',
                  border: `1px solid ${isCurrent ? '#BFDBFE' : isCompleted ? '#A7F3D0' : '#E2E8F0'}`,
                  borderRadius: '10px',
                  padding: '14px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    margin: '0 auto 8px auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    backgroundColor: isCurrent ? '#2563EB' : isCompleted ? '#10B981' : '#CBD5E1',
                    color: '#FFFFFF',
                  }}
                >
                  {isCompleted ? '✓' : sIdx + 1}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: isCurrent ? '#1E3A8A' : '#0F172A' }}>
                  {stg.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Target Universities in this Case */}
        <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '16px' }}>
          Shortlisted University Applications
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeCase.applications.map((app) => (
            <div
              key={app.id}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div>
                <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '2px' }}>
                  {app.universityName}
                </h4>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                  {app.program} • Deadline: <strong style={{ color: '#0F172A' }}>{app.deadline}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-amber">
                  {app.status.replace('_', ' ')}
                </span>
                <Link
                  href="/portal/documents"
                  className="btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  Upload Required Files
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
