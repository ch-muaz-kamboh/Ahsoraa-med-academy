'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Mail,
  Phone,
  BookOpen,
  Building,
  FileCheck2,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { mockApplicationCases } from '@/lib/mock-data';
import { ApplicationStatus } from '@/types';

export default function StaffApplicationsPage() {
  const [activeTab, setActiveTab] = useState<'cases' | 'enrollments'>('cases');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cases, setCases] = useState(mockApplicationCases);

  const [enrolledStudents] = useState([
    {
      id: 'enr-staff-1',
      name: 'Elena Dumitru',
      email: 'elena.dumitru@example.com',
      phone: '+39 349 112 8844',
      targetUniversity: 'University of Milan (La Statale)',
      course: 'IMAT 2026 Comprehensive Masterclass',
      status: 'Documents Verified',
      progress: '85%',
    },
    {
      id: 'enr-staff-2',
      name: 'Hamza Tariq',
      email: 'hamza.tariq@example.com',
      phone: '+92 300 123 4567',
      targetUniversity: 'University of Messina',
      course: 'Ahsora Path Elite Comprehensive',
      status: 'Pre-Enrollment Submitted',
      progress: '70%',
    },
    {
      id: 'enr-staff-3',
      name: 'Sofia Chen',
      email: 'sofia.chen@example.com',
      phone: '+39 340 987 6543',
      targetUniversity: 'University of Pavia (Harvey)',
      course: 'IMAT Mastery Track',
      status: 'Admitted / Placed',
      progress: '100%',
    },
    {
      id: 'enr-staff-4',
      name: 'Marco Rossi',
      email: 'marco.rossi@example.com',
      phone: '+39 333 456 7890',
      targetUniversity: 'Sapienza University of Rome',
      course: 'IMAT Ascend',
      status: 'Under Review',
      progress: '55%',
    },
  ]);

  const filteredCases = cases.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      c.studentName.toLowerCase().includes(q) ||
      c.universityName.toLowerCase().includes(q) ||
      c.program.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return { label: 'Admitted / Accepted', bg: '#DCFCE7', color: '#16A34A' };
      case 'in_review':
        return { label: 'Under Review', bg: '#EFF6FF', color: '#2563EB' };
      case 'submitted':
        return { label: 'Submitted', bg: '#FFFBEB', color: '#D97706' };
      case 'rejected':
        return { label: 'Unsuccessful', bg: '#FEE2E2', color: '#DC2626' };
      default:
        return { label: 'Drafting', bg: '#F1F5F9', color: '#64748B' };
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
          Student University Applications &amp; Enrollments
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Monitor candidate university admissions cases, Universitaly submissions, and verified enrollment progress.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>TOTAL CASES</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{cases.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>Active university files</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #10B981' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>ADMISSIONS WON</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {cases.filter((c) => c.status === 'accepted').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>Official Italian offers</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>IN EMBASSY / PRE-ENROLMENT</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {cases.filter((c) => c.status === 'submitted' || c.status === 'in_review').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '4px' }}>Universitaly & DOV stage</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>ENROLLED ACADEMY STUDENTS</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {enrolledStudents.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#3B82F6', marginTop: '4px' }}>Active academic roster</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('cases')}
          style={{
            padding: '10px 18px',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: activeTab === 'cases' ? '#059669' : '#64748B',
            background: 'none',
            border: 'none',
            borderBottomStyle: 'solid',
            borderBottomWidth: activeTab === 'cases' ? '2px' : '0',
            borderBottomColor: '#059669',
            cursor: 'pointer',
          }}
        >
          University Admission Cases ({cases.length})
        </button>
        <button
          onClick={() => setActiveTab('enrollments')}
          style={{
            padding: '10px 18px',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: activeTab === 'enrollments' ? '#059669' : '#64748B',
            background: 'none',
            border: 'none',
            borderBottomStyle: 'solid',
            borderBottomWidth: activeTab === 'enrollments' ? '2px' : '0',
            borderBottomColor: '#059669',
            cursor: 'pointer',
          }}
        >
          Enrolled Candidates ({enrolledStudents.length})
        </button>
      </div>

      {activeTab === 'cases' ? (
        <div>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                placeholder="Search by student name, university (Milan, Pavia, Rome...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.875rem',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="all">All Admission Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="in_review">In Review</option>
              <option value="accepted">Accepted / Admitted</option>
              <option value="rejected">Unsuccessful</option>
            </select>
          </div>

          {/* Cases List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredCases.map((c) => {
              const badge = getStatusBadge(c.status);
              return (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '22px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>{c.studentName}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem', color: '#64748B', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Building size={14} color="#059669" /> <strong>{c.universityName}</strong>
                      </span>
                      <span>Program: {c.program}</span>
                      <span>Target: {c.intakeYear}</span>
                    </div>

                    <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#475569' }}>
                      Documentation Verified: <strong>{c.documentsVerified ? 'Yes ✓' : 'In Progress'}</strong> • Last Updated: {c.lastUpdated}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => {
                        setCases((prev) =>
                          prev.map((item) =>
                            item.id === c.id
                              ? { ...item, status: item.status === 'in_review' ? 'accepted' : 'in_review' }
                              : item
                          )
                        );
                      }}
                      className="btn-outline"
                      style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
                    >
                      Toggle Status
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Enrolled Roster Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {enrolledStudents.map((stu) => (
            <div
              key={stu.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginBottom: '2px' }}>
                  {stu.name}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', display: 'flex', gap: '14px' }}>
                  <span>{stu.email}</span>
                  <span>{stu.phone}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, marginTop: '6px' }}>
                  🏛️ Destination: {stu.targetUniversity}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#059669' }}>
                  {stu.status}
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                  Progress: {stu.progress}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
