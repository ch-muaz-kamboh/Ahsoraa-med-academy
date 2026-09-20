'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Calendar, Clock, Video, Plus, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function StaffSchedulePage() {
  const { schedules, addSchedule, staffProfile } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(staffProfile.assignedSubjects[0] || 'Biology');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [meetingUrl, setMeetingUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSchedule({
      title,
      subject,
      instructor: staffProfile.displayName,
      date,
      time,
      durationMinutes: Number(duration),
      meetingUrl,
      status: 'upcoming',
    });
    setShowModal(false);
    setTitle('');
    setDate('');
    setTime('');
    setMeetingUrl('');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            My Teaching Schedule & Live Classes
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Manage live interactive sessions, launch video calls, and record attendance for assigned cohorts.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ backgroundColor: '#2563EB', padding: '10px 18px', fontSize: '0.875rem' }}
        >
          <Plus size={16} /> Schedule Live Class
        </button>
      </div>

      {/* Schedule List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {schedules.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              backgroundColor: '#FFFFFF',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: item.status === 'live' ? '#FEF2F2' : '#EFF6FF',
                  color: item.status === 'live' ? '#DC2626' : '#2563EB',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                <Calendar size={20} />
                <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase' }}>{item.status}</span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#64748B', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span>Subject: <strong style={{ color: '#0F172A' }}>{item.subject}</strong></span>
                  <span>Date: <strong style={{ color: '#0F172A' }}>{item.date} at {item.time}</strong> ({item.durationMinutes} min)</span>
                  <span>Instructor: {item.instructor}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {item.meetingUrl && (
                <a
                  href={item.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ backgroundColor: '#10B981', padding: '8px 16px', fontSize: '0.8125rem' }}
                >
                  <Video size={16} /> Start / Join Room
                </a>
              )}

              <Link
                href="/staff/attendance"
                className="btn-outline"
                style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
              >
                <UserCheck size={16} /> Attendance Register
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Schedule Live Class Session
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Session Topic / Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Bioenergetics & ATP Synthase Deep Dive"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject Scope *</label>
                <select
                  className="form-select"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {staffProfile.assignedSubjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input
                    type="time"
                    required
                    className="form-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meeting Room URL (Zoom / Meet)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://zoom.us/j/..."
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#2563EB' }}>
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
