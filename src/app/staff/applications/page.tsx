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
import { ApplicationStatus, ApplicationCase } from '@/types';

export default function StaffApplicationsPage() {
  const [activeTab, setActiveTab] = useState<'cases' | 'enrollments'>('cases');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cases, setCases] = useState<ApplicationCase[]>(mockApplicationCases);

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
      c.targetCountry.toLowerCase().includes(q) ||
      c.caseNumber.toLowerCase().includes(q) ||
      c.applications.some((app) =>
        app.universityName.toLowerCase().includes(q) || app.program.toLowerCase().includes(q)
      );

    const matchesStatus = statusFilter === 'all' || c.currentStage === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'unconditional_offer':
      case 'conditional_offer':
      case 'enrolled':
        return { label: status.replace('_', ' ').toUpperCase(), bg: '#DCFCE7', color: '#16A34A' };
      case 'submitted':
      case 'under_university_review':
        return { label: status.replace('_', ' ').toUpperCase(), bg: '#EFF6FF', color: '#2563EB' };
      case 'documents_pending':
      case 'shortlisting':
        return { label: status.replace('_', ' ').toUpperCase(), bg: '#FFFBEB', color: '#D97706' };
      case 'rejected':
        return { label: 'UNSUCCESSFUL', bg: '#FEE2E2', color: '#DC2626' };
      default:
        return { label: status.replace('_', ' ').toUpperCase(), bg: '#F1F5F9', color: '#64748B' };
    }
  };

  const handleStageChange = (caseId: string, newStage: ApplicationStatus) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, currentStage: newStage } : c))
    );
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
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>OFFERS ISSUED</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {cases.filter((c) => c.currentStage === 'conditional_offer' || c.currentStage === 'unconditional_offer' || c.currentStage === 'enrolled').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>Official Italian offers</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>SUBMITTED / IN REVIEW</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {cases.filter((c) => c.currentStage === 'submitted' || c.currentStage === 'under_university_review').length}
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
                placeholder="Search by student name, university, country, case number..."
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
              <option value="all">All Admission Stages</option>
              <option value="shortlisting">Shortlisting</option>
              <option value="documents_pending">Documents Pending</option>
              <option value="submitted">Submitted</option>
              <option value="under_university_review">Under Review</option>
              <option value="conditional_offer">Offer Issued</option>
              <option value="enrolled">Enrolled</option>
              <option value="visa_stage">Visa Stage</option>
            </select>
          </div>

          {/* Cases List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredCases.map((c) => {
              const badge = getStatusBadge(c.currentStage);
              return (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '22px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '6px' }}>
                          {c.caseNumber}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A' }}>{c.studentName}</span>
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
                        <span>Target: <strong>{c.targetCountry} ({c.targetIntake})</strong></span>
                        <span>Counsellor: {c.assignedCounsellor}</span>
                        <span>Admissions Officer: {c.assignedAdmissionsOfficer}</span>
                        <span>Progress: <strong>{c.progressPercent}%</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <select
                        value={c.currentStage}
                        onChange={(e) => handleStageChange(c.id, e.target.value as ApplicationStatus)}
                        style={{
                          fontSize: '0.8125rem',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#F8FAFC',
                          fontWeight: 600,
                        }}
                      >
                        <option value="shortlisting">Shortlisting</option>
                        <option value="documents_pending">Documents Pending</option>
                        <option value="application_prepared">Application Prepared</option>
                        <option value="submitted">Submitted</option>
                        <option value="under_university_review">Under University Review</option>
                        <option value="conditional_offer">Offer Letter Issued</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="visa_stage">Visa Processing</option>
                      </select>
                    </div>
                  </div>

                  {/* University Applications sublist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {c.applications.map((app) => (
                      <div
                        key={app.id}
                        style={{
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        <div>
                          <strong style={{ color: '#0F172A', fontSize: '0.875rem' }}>{app.universityName}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            {app.program} • Deadline: {app.deadline}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#B45309', textTransform: 'capitalize' }}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
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
