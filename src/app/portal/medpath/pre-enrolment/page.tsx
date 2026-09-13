'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  Compass,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Plane,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function StudentMedPathPreEnrolmentPage() {
  const steps = [
    {
      step: 1,
      title: 'Universitaly Pre-Enrolment Account & Form A',
      status: 'completed',
      date: '2026-08-10',
      description: 'Account created on Universitaly portal. Selected University of Milan (UniMi) as 1st choice medical institution.',
    },
    {
      step: 2,
      title: 'Academic Qualification Legalization & CIMEA Statement',
      status: 'completed',
      date: '2026-08-20',
      description: 'High school diploma and transcript submitted for CIMEA Statement of Comparability and Verification.',
    },
    {
      step: 3,
      title: 'Universitaly University Verification & Summary Issuance',
      status: 'completed',
      date: '2026-08-29',
      description: 'University of Milan validated eligibility and issued official Pre-enrolment Summary for Italian Embassy.',
    },
    {
      step: 4,
      title: 'VFS Global / Italian Embassy Visa Appointment Booking',
      status: 'in_progress',
      date: 'Scheduled: 2026-09-18',
      description: 'National Type D Long-Stay Student Visa appointment confirmed at VFS Application Centre.',
    },
    {
      step: 5,
      title: 'Official IMAT Test Day in Authorized Exam Centre',
      status: 'upcoming',
      date: 'Expected: 2026-10-17',
      description: 'Taking paper-based IMAT exam. Ranking list released by CINECA in October.',
    },
    {
      step: 6,
      title: 'Final In-Person Enrollment at Italian Medical Faculty',
      status: 'upcoming',
      date: 'November 2026',
      description: 'Submitting original stamped documents to Student Secretariat in Milan to get student ID & badge.',
    },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #047857 0%, #10B981 50%, #059669 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
        }}
      >
        <div style={{ maxWidth: '700px' }}>
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
            <Sparkles size={14} color="#FDE047" />
            <span>UNIVERSITALY & VISA ROADMAP</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Pre-Enrolment & Visa Roadmap
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.6, margin: 0 }}>
            Interactive step-by-step roadmap guiding you from Universitaly pre-enrolment validation to CIMEA legalizations, Embassy visa interview, and final university registration.
          </p>
        </div>
      </div>

      {/* Step by Step Timeline */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={22} color="#10B981" /> Official 6-Step Admission Roadmap
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {steps.map((st) => {
            const isDone = st.status === 'completed';
            const isCurrent = st.status === 'in_progress';

            return (
              <div
                key={st.step}
                style={{
                  display: 'flex',
                  gap: '20px',
                  position: 'relative',
                }}
              >
                {/* Step Circle Icon */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? '#ECFDF5' : isCurrent ? '#FEF3C7' : '#F1F5F9',
                    color: isDone ? '#10B981' : isCurrent ? '#D97706' : '#94A3B8',
                    border: isDone ? '2px solid #10B981' : isCurrent ? '2px solid #F59E0B' : '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}
                >
                  {isDone ? <CheckCircle2 size={22} color="#10B981" /> : st.step}
                </div>

                {/* Content Box */}
                <div
                  style={{
                    backgroundColor: isCurrent ? '#FFFBEB' : '#F8FAFC',
                    borderRadius: '14px',
                    padding: '20px 24px',
                    border: isCurrent ? '1px solid #FCD34D' : '1px solid #E2E8F0',
                    flex: 1,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Step {st.step}: {st.title}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: isDone ? '#DCFCE7' : isCurrent ? '#FEF3C7' : '#E2E8F0',
                        color: isDone ? '#15803D' : isCurrent ? '#B45309' : '#64748B',
                      }}
                    >
                      {isDone ? 'COMPLETED' : isCurrent ? 'IN PROGRESS' : 'UPCOMING'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                    {st.description}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    📅 Timeline: {st.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
