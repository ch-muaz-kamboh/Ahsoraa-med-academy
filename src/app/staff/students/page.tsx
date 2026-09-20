'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Users, GraduationCap, CheckCircle2, BookOpen, Search } from 'lucide-react';

export default function StaffStudentsPage() {
  const { staffProfile } = useAppStore();

  const assignedStudents = [
    {
      id: 'stu-101',
      name: 'Marco Rossi',
      email: 'marco.rossi@student.ahsorameds.com',
      cohort: 'IMAT 2026 Alpha Cohort',
      targetExam: 'IMAT (Italy)',
      attendanceRate: '94%',
      avgMockScore: '68.5 / 90',
      status: 'Active',
    },
    {
      id: 'stu-102',
      name: 'Sofia Chen',
      email: 'sofia.chen@student.ahsorameds.com',
      cohort: 'IMAT 2026 Alpha Cohort',
      targetExam: 'IMAT & BioMedical Entrance',
      attendanceRate: '98%',
      avgMockScore: '74.2 / 90',
      status: 'Active',
    },
    {
      id: 'stu-103',
      name: 'Ahmed Khan',
      email: 'ahmed.khan@student.ahsorameds.com',
      cohort: 'IMAT 2026 Intensive Track',
      targetExam: 'IMAT (Italy)',
      attendanceRate: '88%',
      avgMockScore: '62.0 / 90',
      status: 'Active',
    },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
          My Assigned Students & Cohort Performance
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Track academic activity, mock test performance, and live attendance for students in your assigned cohorts.
        </p>
      </div>

      {/* Student List Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {assignedStudents.map((stu) => (
          <div key={stu.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.125rem',
                }}
              >
                {stu.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                  {stu.name}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                  {stu.email} • Cohort: <strong style={{ color: '#0F172A' }}>{stu.cohort}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10B981' }}>{stu.attendanceRate}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Live Attendance</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2563EB' }}>{stu.avgMockScore}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Avg Mock Score</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
