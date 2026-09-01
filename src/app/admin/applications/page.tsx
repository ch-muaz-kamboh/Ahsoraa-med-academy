'use client';

import React, { useState } from 'react';
import { GraduationCap, Users, CheckCircle2, Clock, Search, Filter, Mail, Phone, DollarSign, BookOpen, ShieldCheck } from 'lucide-react';
import { mockApplicationCases } from '@/lib/mock-data';
import { ApplicationStatus } from '@/types';
import { useAppStore } from '@/lib/store';

export default function AdminApplicationsPage() {
  const [activeTab, setActiveTab] = useState<'enrollments' | 'cases'>('enrollments');
  const [cases, setCases] = useState(mockApplicationCases);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAppStore();

  // Mock list of all enrolled students in the academy
  const [enrolledStudents] = useState([
    {
      id: 'enr-101',
      name: 'Arham Farooq',
      email: 'arham.farooq@student.ahsora.com',
      phone: '+1 (555) 234-8901',
      enrolledCourses: ['USMLE Step 1: Clinical Integrated High-Yield Mastery', 'IMAT Biology & Chemistry Booster'],
      targetExam: 'USMLE Step 1 / IMAT Italy',
      enrollmentDate: '2026-01-15',
      paymentStatus: 'Paid in Full ($699)',
      academicStatus: 'Active & Verified',
      progressPercent: 78,
    },
    {
      id: 'enr-102',
      name: 'Sophia Martinez',
      email: 'sophia.m@example.com',
      phone: '+1 (555) 345-6789',
      enrolledCourses: ['IMAT 2026/2027 Full Preparation Intensive'],
      targetExam: 'IMAT Italy',
      enrollmentDate: '2026-02-01',
      paymentStatus: 'Paid in Full ($499)',
      academicStatus: 'Active & Verified',
      progressPercent: 62,
    },
    {
      id: 'enr-103',
      name: 'Dr. Michael Chen',
      email: 'm.chen@example.com',
      phone: '+1 (555) 456-7890',
      enrolledCourses: ['PLAB 1 / UKMLA Clinical Masterclass', 'Medical German B2/C1 Approbation'],
      targetExam: 'PLAB 1 / UKMLA',
      enrollmentDate: '2026-01-20',
      paymentStatus: 'Partial ($350 / $799)',
      academicStatus: 'Pending Verification',
      progressPercent: 45,
    },
    {
      id: 'enr-104',
      name: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      phone: '+44 20 7946 0912',
      enrolledCourses: ['German Medical Licensing Approbation B2/C1'],
      targetExam: 'German Approbation',
      enrollmentDate: '2026-02-10',
      paymentStatus: 'Paid in Full ($550)',
      academicStatus: 'Active & Verified',
      progressPercent: 90,
    },
  ]);

  const filteredStudents = enrolledStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetExam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStageChange = (caseId: string, newStage: ApplicationStatus) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, currentStage: newStage } : c))
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          Student Enrollments & Admissions Portal
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Manage enrolled student rosters, active course progress, tuition status, and university application cases.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '2px solid #E2E8F0',
          marginBottom: '28px',
        }}
      >
        <button
          onClick={() => setActiveTab('enrollments')}
          style={{
            padding: '12px 20px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: activeTab === 'enrollments' ? '#2563EB' : '#64748B',
            borderBottom: activeTab === 'enrollments' ? '3px solid #2563EB' : '3px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <Users size={18} />
          <span>Student Enrollments Roster ({enrolledStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cases')}
          style={{
            padding: '12px 20px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: activeTab === 'cases' ? '#2563EB' : '#64748B',
            borderBottom: activeTab === 'cases' ? '3px solid #2563EB' : '3px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <GraduationCap size={18} />
          <span>University Admissions Cases ({cases.length})</span>
        </button>
      </div>

      {activeTab === 'enrollments' ? (
        /* TAB 1: STUDENT ENROLLMENT DIRECTORY & INFO */
        <div>
          {/* Search and Filters */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Search enrolled students by name, email, exam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', fontSize: '0.8125rem', color: '#64748B' }}>
              <span className="badge badge-blue">Total Enrolled: {enrolledStudents.length}</span>
              <span className="badge badge-green">Verified: 3</span>
            </div>
          </div>

          {/* Enrollment Cards Roster */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="card"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 800, margin: 0 }}>
                        {student.name}
                      </h3>
                      <span className={`badge ${student.academicStatus.includes('Active') ? 'badge-green' : 'badge-amber'}`}>
                        {student.academicStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={14} color="#2563EB" /> {student.email}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={14} color="#2563EB" /> {student.phone}
                      </span>
                      <span>Enrolled Date: <strong>{student.enrollmentDate}</strong></span>
                    </div>
                  </div>

                  <div>
                    <span className="badge badge-blue" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>
                      Target: {student.targetExam}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                      Enrolled Courses
                    </span>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', fontSize: '0.8125rem', color: '#0F172A', lineHeight: '1.5' }}>
                      {student.enrolledCourses.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                      Tuition & Payment Status
                    </span>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>
                      {student.paymentStatus}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                      Course Completion Progress
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '8px',
                          backgroundColor: '#E2E8F0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${student.progressPercent}%`,
                            height: '100%',
                            backgroundColor: '#2563EB',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                        {student.progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TAB 2: ADMISSIONS CASES */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cases.map((c) => (
            <div key={c.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-blue" style={{ marginBottom: '4px' }}>
                    {c.caseNumber}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
                    Student: {c.studentName} ({c.targetCountry} - {c.targetIntake})
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Stage:</span>
                  <select
                    className="form-select"
                    value={c.currentStage}
                    onChange={(e) => handleStageChange(c.id, e.target.value as ApplicationStatus)}
                    style={{ width: 'auto', fontSize: '0.8125rem', padding: '4px 10px' }}
                  >
                    <option value="shortlisting">Shortlisting</option>
                    <option value="documents_pending">Documents Pending</option>
                    <option value="application_prepared">Application Prepared</option>
                    <option value="submitted">Submitted to University</option>
                    <option value="conditional_offer">Offer Letter Issued</option>
                    <option value="enrolled">Enrolled</option>
                    <option value="visa_stage">Visa Processing</option>
                  </select>
                </div>
              </div>

              {/* University sub applications */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {c.applications.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#0F172A', fontSize: '0.9375rem' }}>{app.universityName}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.program} • Deadline: {app.deadline}</div>
                    </div>
                    <span className="badge badge-amber">{app.status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
