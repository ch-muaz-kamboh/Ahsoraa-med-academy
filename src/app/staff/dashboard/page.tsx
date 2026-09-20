'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  Calendar,
  HelpCircle,
  BookOpen,
  FileCheck2,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Video,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export default function StaffDashboardPage() {
  const { staffProfile, schedules, doubts, recordedLectures, mockSnapshots } = useAppStore();

  const pendingDoubts = doubts.filter((d) => d.status !== 'resolved');
  const todayClasses = schedules.filter((s) => s.status === 'upcoming' || s.status === 'live');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div
        style={{
          backgroundColor: '#1E293B',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#FFFFFF',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.8125rem', color: '#38BDF8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Faculty Task Workspace
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px', color: '#FFFFFF' }}>
            Welcome back, {staffProfile.displayName}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9375rem', maxWidth: '600px', margin: 0 }}>
            You are managing <strong>{staffProfile.assignedSubjects.join(', ')}</strong> for <strong>{staffProfile.assignedCohorts.join(' & ')}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/staff/question-bank"
            className="btn-primary"
            style={{ backgroundColor: '#2563EB', padding: '10px 18px', fontSize: '0.875rem' }}
          >
            <Plus size={16} /> New Question Draft
          </Link>
          <Link
            href="/staff/doubts"
            className="btn-outline"
            style={{ color: '#FFFFFF', borderColor: '#475569', padding: '10px 18px', fontSize: '0.875rem' }}
          >
            <HelpCircle size={16} /> Resolve Doubts ({pendingDoubts.length})
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #2563EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>TODAY'S CLASSES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A' }}>{todayClasses.length}</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>Live Zoom & Interactive sessions</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>PENDING DOUBTS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FFFBEB', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A' }}>{pendingDoubts.length}</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>Awaiting faculty explanation</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>RECORDED LECTURES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A' }}>{recordedLectures.length}</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>Published student portal videos</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>MOCK SNAPSHOTS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#F3E8FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A' }}>{mockSnapshots.length}</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>Versioned test configurations</div>
        </div>
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        {/* Left Column: Live Classes & Schedule */}
        <div>
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>
                Assigned Live Class Schedule
              </h2>
              <Link href="/staff/schedule" style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                View All Schedule →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {schedules.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        padding: '10px 14px',
                        backgroundColor: item.status === 'live' ? '#FEF2F2' : '#F1F5F9',
                        color: item.status === 'live' ? '#DC2626' : '#475569',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                      }}
                    >
                      <div>{item.time}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.date}</div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9375rem', color: '#0F172A', marginBottom: '4px', fontWeight: 600 }}>
                        {item.title}
                      </h4>
                      <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                        Subject: <strong style={{ color: '#0F172A' }}>{item.subject}</strong> • Instructor: {item.instructor}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Link
                      href="/staff/attendance"
                      className="btn-outline"
                      style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
                    >
                      Mark Attendance
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Doubts List */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>
                Pending Student Doubts & Questions
              </h2>
              <Link href="/staff/doubts" style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                Doubt Resolution Desk →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingDoubts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                  <CheckCircle2 size={32} color="#10B981" style={{ marginBottom: '8px' }} />
                  <p>All assigned doubts have been resolved!</p>
                </div>
              ) : (
                pendingDoubts.slice(0, 3).map((doubt) => (
                  <div key={doubt.id} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="badge badge-amber">{doubt.subject}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{doubt.studentName}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 600, marginBottom: '8px' }}>
                      {doubt.question}
                    </p>
                    <Link
                      href="/staff/doubts"
                      style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Answer Doubt →
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Scoped Access Guard & Workflow Status */}
        <div>
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
              🛡️ Role & Scoping Policy
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.6, marginBottom: '16px' }}>
              As a <strong>{staffProfile.role.toUpperCase()}</strong>, server-side RLS restricts your data mutations to your assigned subjects and cohorts.
            </p>

            <div style={{ fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '6px', borderLeft: '3px solid #10B981' }}>
                ✅ Question Draft & Edit Rights
              </div>
              <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '6px', borderLeft: '3px solid #10B981' }}>
                ✅ Attendance & Doubt Marking
              </div>
              <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '6px', borderLeft: '3px solid #EF4444' }}>
                🚫 Financial & Visa Documents Locked
              </div>
            </div>
          </div>

          <div className="card" style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: '#F8FAFC' }}>
              Publishing Workflow
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '16px' }}>
              Questions created by teachers enter `Draft` status and must be submitted to `In Review` before Academic Admins publish them to CBT Mocks.
            </p>
            <Link
              href="/staff/question-bank"
              className="btn-primary"
              style={{ width: '100%', textAlign: 'center', backgroundColor: '#2563EB', fontSize: '0.8125rem' }}
            >
              Open Question Bank
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
