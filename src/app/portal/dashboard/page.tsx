'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileCheck2,
  Calendar,
  FolderLock,
  Globe2,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { mockApplicationCases, mockVisaCases } from '@/lib/mock-data';

export default function StudentDashboardPage() {
  const { currentUser, courses, documents, doubts, testAttempts } = useAppStore();

  const activeApp = mockApplicationCases[0];
  const activeVisa = mockVisaCases[0];
  const pendingDocsCount = documents.filter((d) => d.status === 'revision_requested' || d.status === 'requested').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Banner Alert */}
      <div
        style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#1E3A8A', fontSize: '0.9375rem' }}>
              Action Required: Italian Universitaly Pre-enrolment Summary
            </div>
            <div style={{ color: '#3B82F6', fontSize: '0.8125rem' }}>
              Your counselor Marcus Sterling requested an updated 4-page certified translation for CIMEA.
            </div>
          </div>
        </div>

        <Link
          href="/portal/documents"
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
        >
          View Document Vault →
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Active Course</span>
            <BookOpen size={18} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>USMLE Step 1</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, marginTop: '4px' }}>
            68% Syllabus Completed
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Mock Tests Completed</span>
            <FileCheck2 size={18} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
            {testAttempts.length + 3} Blocks
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600, marginTop: '4px' }}>
            Average Accuracy: 84.5%
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Admissions Case</span>
            <Globe2 size={18} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>Italy (2026)</div>
          <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600, marginTop: '4px' }}>
            Stage: Application Prepared
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Visa Appointment</span>
            <Calendar size={18} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>Sept 12, 2026</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, marginTop: '4px' }}>
            Embassy Slot Confirmed
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Current Course Continue Learning */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#0F172A' }}>Continue Learning</h3>
              <Link href="/portal/courses" style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600 }}>
                All Courses →
              </Link>
            </div>

            <div
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '4px' }}>
                    Cardiovascular Pathology: Ischemic Heart Disease EKG
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Module 1 • Lesson 1 • Next: Valvular Murmurs
                  </div>
                </div>
              </div>

              <Link
                href="/portal/courses/crs-01/player"
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              >
                Resume Lecture
              </Link>
            </div>
          </div>

          {/* Quick Mock Exam Launcher */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#0F172A' }}>Recommended Diagnostic Mock</h3>
              <Link href="/portal/tests" style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600 }}>
                Test Series →
              </Link>
            </div>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge badge-blue">USMLE Step 1 Diagnostic</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>45 mins • 6 Questions</span>
              </div>
              <h4 style={{ fontSize: '1.0625rem', color: '#0F172A', marginBottom: '8px' }}>
                Integrated Organ Systems Block 1 Simulation
              </h4>
              <p style={{ color: '#64748B', fontSize: '0.8125rem', marginBottom: '16px' }}>
                Simulates real examination pacing, negative marking, and provides an instant topic-level analysis breakdown upon completion.
              </p>
              <Link
                href="/portal/tests/tst-01/take"
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.875rem' }}
              >
                Start Timed Test
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (Admissions & Documents Tracker) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Admissions Pipeline Status */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '16px' }}>
              Admissions Status
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '4px' }}>Case Number:</div>
              <strong style={{ color: '#0F172A', fontSize: '0.9375rem' }}>{activeApp.caseNumber}</strong>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                <span style={{ color: '#64748B' }}>Application Progress</span>
                <strong style={{ color: '#2563EB' }}>{activeApp.progressPercent}%</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${activeApp.progressPercent}%`, height: '100%', backgroundColor: '#2563EB' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
              {activeApp.applications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>
                    {app.universityName}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem' }}>
                    <span>Deadline: {app.deadline}</span>
                    <span className="badge badge-amber" style={{ padding: '2px 6px', fontSize: '0.6875rem' }}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/portal/applications"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '16px',
                fontSize: '0.8125rem',
                color: '#2563EB',
                fontWeight: 600,
              }}
            >
              Full Application Roadmap →
            </Link>
          </div>

          {/* Mentorship & Doubts */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '14px' }}>
              Assigned Advisor
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#DBEAFE',
                  color: '#1D4ED8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                EV
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>
                  {activeApp.assignedCounsellor}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10B981' }}>● Online • Senior Advisor</div>
              </div>
            </div>
            <Link
              href="/portal/mentorship"
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8125rem' }}
            >
              Schedule 1-on-1 Call
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
