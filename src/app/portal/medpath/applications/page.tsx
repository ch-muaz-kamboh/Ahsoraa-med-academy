'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  Building,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  ExternalLink,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function StudentMedPathApplicationsPage() {
  const targetUniversities = [
    {
      id: 'uni-01',
      name: 'University of Milan (Università degli Studi di Milano)',
      country: 'Italy',
      city: 'Milan',
      program: 'Single-Cycle MD Medicine and Surgery (English)',
      intake: '2026 / 2027 Academic Year',
      status: 'under_university_review',
      stageLabel: 'Universitaly Summary Verified',
      progressPercent: 75,
      deadline: '2026-10-15',
      documentsVerified: 6,
      totalDocuments: 6,
    },
    {
      id: 'uni-02',
      name: 'Sapienza University of Rome (Sapienza Università di Roma)',
      country: 'Italy',
      city: 'Rome',
      program: 'Medicine & Surgery (F73 English Track)',
      intake: '2026 / 2027 Academic Year',
      status: 'eligibility_check',
      stageLabel: 'Eligibility & DOV Verification',
      progressPercent: 60,
      deadline: '2026-10-20',
      documentsVerified: 5,
      totalDocuments: 6,
    },
    {
      id: 'uni-03',
      name: 'University of Bologna (Alma Mater Studiorum - Università di Bologna)',
      country: 'Italy',
      city: 'Bologna',
      program: 'Medicine and Surgery (IMAT Track)',
      intake: '2026 / 2027 Academic Year',
      status: 'application_prepared',
      stageLabel: 'Pre-Enrolment Form Submitted',
      progressPercent: 45,
      deadline: '2026-11-01',
      documentsVerified: 4,
      totalDocuments: 6,
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #9333EA 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.3)',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '14px',
            }}
          >
            <Award size={14} color="#FDE047" />
            <span>MEDPATH ELITE • UNIVERSITY ADMISSIONS TRACKER</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            University Applications & Live Status
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.6, margin: 0 }}>
            Track pre-enrolment submissions, document legalizations, eligibility checks, and official acceptance letters from medical universities across Italy and Europe.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>TARGET UNIVERSITIES</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>3 Active Applications</div>
          <div style={{ fontSize: '0.8125rem', color: '#7C3AED', fontWeight: 600, marginTop: '4px' }}>Italy IMAT Medical Track</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>COUNSELLOR IN CHARGE</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Elena Vance</div>
          <div style={{ fontSize: '0.8125rem', color: '#10B981', fontWeight: 600, marginTop: '4px' }}>● Online & Monitoring Case</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>UNIVERSITALY STATUS</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>Validated by UniMi</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>Pre-enrolment Summary Issued</div>
        </div>
      </div>

      {/* Target Universities Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {targetUniversities.map((uni) => (
          <div
            key={uni.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '28px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Building size={20} color="#7C3AED" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {uni.name}
                  </h3>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
                  {uni.program} • {uni.city}, {uni.country}
                </div>
              </div>

              {/* Status Badge */}
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  backgroundColor: '#F3E8FF',
                  color: '#7C3AED',
                  border: '1px solid #DDD6FE',
                }}
              >
                {uni.stageLabel}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                <span>Application Progress Roadmap</span>
                <span>{uni.progressPercent}% Completed</span>
              </div>
              <div style={{ height: '10px', backgroundColor: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${uni.progressPercent}%`,
                    backgroundColor: '#7C3AED',
                    borderRadius: '5px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>

            {/* Meta Details */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.8125rem', color: '#475569', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
              <div>
                <strong>Intake:</strong> {uni.intake}
              </div>
              <div>
                <strong>Verified Documents:</strong> {uni.documentsVerified} / {uni.totalDocuments}
              </div>
              <div>
                <strong>University Deadline:</strong> {uni.deadline}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
