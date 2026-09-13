'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function StudentSchedulePage() {
  const { schedules } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredSchedules = schedules.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSubject && matchesSearch;
  });

  const subjects = Array.from(new Set(schedules.map((s) => s.subject)));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Banner Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '14px',
              letterSpacing: '0.5px',
            }}
          >
            <Sparkles size={14} color="#FDE047" />
            <span>STUDENT PORTAL • LIVE TIMETABLE</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Live Classes & Exam Schedule
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6, margin: 0 }}>
            Never miss a live interactive lecture, question-solving workshop, or official mock exam review. Join live Zoom rooms directly from your portal.
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <input
            type="text"
            placeholder="Search class title, instructor or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Sessions' },
            { id: 'live', label: '🔴 Live Now' },
            { id: 'upcoming', label: '📅 Upcoming' },
            { id: 'completed', label: '✅ Completed' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterStatus(btn.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filterStatus === btn.id ? '#2563EB' : '#E2E8F0',
                backgroundColor: filterStatus === btn.id ? '#EFF6FF' : '#FFFFFF',
                color: filterStatus === btn.id ? '#2563EB' : '#64748B',
                transition: 'all 0.15s ease',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748B" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.8125rem',
              color: '#334155',
              backgroundColor: '#FFFFFF',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedule Grid */}
      {filteredSchedules.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px dashed #CBD5E1',
          }}
        >
          <CalendarIcon size={48} color="#94A3B8" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
            No live classes or webinars scheduled yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0 0 16px 0' }}>
            The class timetable is currently empty. Administrators can publish live sessions from the Admin Portal.
          </p>
          <a
            href="/admin/learn/schedule"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              fontWeight: 700,
              fontSize: '0.8125rem',
              textDecoration: 'none',
            }}
          >
            + Manage & Add Sessions in Admin Panel →
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredSchedules.map((item) => {
            const isLive = item.status === 'live';
            const isCompleted = item.status === 'completed';

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: isLive ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isLive
                    ? '0 10px 20px -5px rgba(37, 99, 235, 0.15)'
                    : '0 1px 3px rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Status Badge Accent */}
                {isLive && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '4px 0',
                      letterSpacing: '0.5px',
                    }}
                  >
                    🔴 LIVE CLASS IN PROGRESS NOW
                  </div>
                )}

                <div style={{ marginTop: isLive ? '14px' : '0' }}>
                  {/* Top Meta Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.subject}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {item.durationMinutes} mins
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                      {item.description}
                    </p>
                  )}

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: '#475569', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={15} color="#2563EB" />
                      <span><strong>Instructor:</strong> {item.instructor}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CalendarIcon size={15} color="#2563EB" />
                      <span><strong>Date & Time:</strong> {item.date} • {item.time}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div style={{ paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                  {isLive && item.meetingUrl ? (
                    <a
                      href={item.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        textDecoration: 'none',
                        textAlign: 'center',
                      }}
                    >
                      <Video size={16} />
                      <span>Join Live Zoom Class →</span>
                    </a>
                  ) : isCompleted ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#F1F5F9',
                        color: '#64748B',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={16} color="#10B981" />
                      <span>Class Completed & Archived</span>
                    </div>
                  ) : (
                    <a
                      href={item.meetingUrl || '#'}
                      target={item.meetingUrl ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid #2563EB',
                        color: '#2563EB',
                        backgroundColor: '#EFF6FF',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                      }}
                    >
                      <CalendarIcon size={16} />
                      <span>Scheduled for {item.date}</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
