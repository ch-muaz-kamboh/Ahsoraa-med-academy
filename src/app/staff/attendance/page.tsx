'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { CheckSquare, Check, X, Clock, Calendar, UserCheck } from 'lucide-react';

export default function StaffAttendancePage() {
  const { schedules, attendances, markAttendance, staffProfile } = useAppStore();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(schedules[0]?.id || '');

  const activeSchedule = schedules.find((s) => s.id === selectedScheduleId) || schedules[0];

  const studentsList = [
    { id: 'stu-101', name: 'Marco Rossi' },
    { id: 'stu-102', name: 'Sofia Chen' },
    { id: 'stu-103', name: 'Ahmed Khan' },
    { id: 'stu-104', name: 'Elena Vance' },
  ];

  const getStatus = (stuId: string) => {
    const record = attendances.find((a) => a.scheduleId === activeSchedule?.id && a.studentId === stuId);
    return record ? record.status : null;
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
          Mark Live Class Attendance
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Record present, absent, or late statuses for students attending live Zoom/Google Meet sessions.
        </p>
      </div>

      {/* Select Session */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', marginBottom: '24px' }}>
        <label className="form-label">Select Live Class Session *</label>
        <select
          className="form-select"
          value={selectedScheduleId}
          onChange={(e) => setSelectedScheduleId(e.target.value)}
        >
          {schedules.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} ({s.subject} • {s.date} at {s.time})
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Sheet Table */}
      {activeSchedule && (
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Attendance Register for: {activeSchedule.title}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {studentsList.map((stu) => {
              const currentStatus = getStatus(stu.id);
              return (
                <div
                  key={stu.id}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#F1F5F9',
                        color: '#0F172A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                      }}
                    >
                      {stu.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{stu.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Student ID: {stu.id}</div>
                    </div>
                  </div>

                  {/* Marking Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => markAttendance(activeSchedule.id, stu.id, stu.name, 'present')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        backgroundColor: currentStatus === 'present' ? '#10B981' : '#F1F5F9',
                        color: currentStatus === 'present' ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markAttendance(activeSchedule.id, stu.id, stu.name, 'late')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        backgroundColor: currentStatus === 'late' ? '#F59E0B' : '#F1F5F9',
                        color: currentStatus === 'late' ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Late
                    </button>
                    <button
                      onClick={() => markAttendance(activeSchedule.id, stu.id, stu.name, 'absent')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        backgroundColor: currentStatus === 'absent' ? '#EF4444' : '#F1F5F9',
                        color: currentStatus === 'absent' ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
