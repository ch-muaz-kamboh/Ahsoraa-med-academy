'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  UserCheck,
  Edit2,
  Trash2,
  X,
  Search,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { ScheduleItem } from '@/types';
import { sortSchedulesByDate } from '@/lib/schedule-utils';

export default function StaffSchedulePage() {
  const { schedules, addSchedule, updateSchedule, deleteSchedule, staffProfile } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters and Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Form State - Exactly matching Admin Portal
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(staffProfile?.assignedSubjects?.[0] || 'Biochemistry');
  const [instructor, setInstructor] = useState(staffProfile?.displayName || 'Dr. Sarah Jenkins');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [location, setLocation] = useState('Live Zoom Interactive Room 1');
  const [status, setStatus] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [description, setDescription] = useState('');

  const openNewModal = () => {
    setEditingId(null);
    setTitle('');
    setSubject(staffProfile?.assignedSubjects?.[0] || 'Biochemistry');
    setInstructor(staffProfile?.displayName || 'Dr. Sarah Jenkins');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('17:00 - 19:00 GMT');
    setDurationMinutes(90);
    setMeetingUrl('https://zoom.us/j/mock-live-room');
    setLocation('Live Zoom Interactive Room 1');
    setStatus('upcoming');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ScheduleItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSubject(item.subject);
    setInstructor(item.instructor);
    setDate(item.date);
    setTime(item.time);
    setDurationMinutes(item.durationMinutes || 90);
    setMeetingUrl(item.meetingUrl || '');
    setLocation(item.location || 'Live Zoom Interactive Room 1');
    setStatus(item.status);
    setDescription(item.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateSchedule(editingId, {
        title,
        subject,
        instructor,
        date,
        time,
        durationMinutes: Number(durationMinutes),
        meetingUrl,
        location,
        status,
        description,
      });
    } else {
      addSchedule({
        title,
        subject,
        instructor,
        date,
        time,
        durationMinutes: Number(durationMinutes),
        meetingUrl,
        location,
        status,
        description,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, sessionTitle: string) => {
    if (confirm(`Are you sure you want to delete session "${sessionTitle}"?`)) {
      deleteSchedule(id);
    }
  };

  // Automatically arrange datewise
  const sortedAndFilteredSchedules = useMemo(() => {
    // 1. Filter
    const filtered = schedules.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });

    // 2. Sort automatically by date
    return sortSchedulesByDate(filtered, sortOrder);
  }, [schedules, statusFilter, searchQuery, sortOrder]);

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '24px 32px',
          borderRadius: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
            Faculty Live Timetable
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
            My Teaching Schedule & Live Classes
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: 0 }}>
            Manage live interactive sessions, launch video calls, and record attendance for assigned cohorts.
          </p>
        </div>

        <button
          onClick={openNewModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '10px',
            backgroundColor: '#059669',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Plus size={18} /> Schedule New Live Class
        </button>
      </div>

      {/* Filter and Automatic Sort Toolbar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 20px',
          border: '1px solid #E2E8F0',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 240px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by topic, subject or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
            {(['all', 'upcoming', 'live', 'completed'] as const).map((statusVal) => (
              <button
                key={statusVal}
                onClick={() => setStatusFilter(statusVal)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: statusFilter === statusVal ? '#FFFFFF' : 'transparent',
                  color: statusFilter === statusVal ? '#0F172A' : '#64748B',
                  boxShadow: statusFilter === statusVal ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                  textTransform: 'capitalize',
                }}
              >
                {statusVal === 'all' ? 'All Classes' : statusVal === 'live' ? 'Live Now' : statusVal}
              </button>
            ))}
          </div>
        </div>

        {/* Date Sorting Indicator & Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Arranged Date-wise:</span>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title="Toggle between Earliest first and Latest first"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              color: '#0F172A',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <ArrowUpDown size={14} color="#059669" />
            {sortOrder === 'asc' ? 'Earliest Date First (Ascending)' : 'Latest Date First (Descending)'}
          </button>
        </div>
      </div>

      {/* Schedule List */}
      {sortedAndFilteredSchedules.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px dashed #CBD5E1',
            padding: '48px 24px',
            textAlign: 'center',
            color: '#64748B',
          }}
        >
          <Calendar size={40} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            No live class sessions found
          </h3>
          <p style={{ fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 16px' }}>
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search query or status filter.'
              : 'You have not scheduled any live lectures yet. Click the button below to schedule one.'}
          </p>
          <button
            onClick={openNewModal}
            className="btn-primary"
            style={{ backgroundColor: '#059669', padding: '10px 18px', fontSize: '0.875rem' }}
          >
            <Plus size={16} /> Schedule New Live Class
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedAndFilteredSchedules.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: item.status === 'live' ? '2px solid #DC2626' : '1px solid #E2E8F0',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
                boxShadow: item.status === 'live' ? '0 8px 20px -4px rgba(220, 38, 38, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flex: '1 1 500px' }}>
                {/* Date & Status badge box */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    backgroundColor:
                      item.status === 'live'
                        ? '#FEE2E2'
                        : item.status === 'completed'
                        ? '#F1F5F9'
                        : '#ECFDF5',
                    color:
                      item.status === 'live'
                        ? '#DC2626'
                        : item.status === 'completed'
                        ? '#64748B'
                        : '#059669',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                    border:
                      item.status === 'live'
                        ? '1px solid #FECACA'
                        : item.status === 'completed'
                        ? '1px solid #E2E8F0'
                        : '1px solid #A7F3D0',
                  }}
                >
                  <Calendar size={20} />
                  <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.5px' }}>
                    {item.status}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#059669',
                        backgroundColor: '#F0FFF4',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid #BBF7D0',
                      }}
                    >
                      {item.subject}
                    </span>

                    {item.status === 'live' && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          backgroundColor: '#DC2626',
                          color: '#FFFFFF',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          letterSpacing: '0.5px',
                        }}
                      >
                        🔴 LIVE NOW
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    {item.title}
                  </h3>

                  <div style={{ fontSize: '0.875rem', color: '#64748B', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} color="#059669" />
                      <strong>Date:</strong> {item.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color="#059669" />
                      <strong>Time:</strong> {item.time} ({item.durationMinutes} min)
                    </span>
                    <span>
                      <strong>Instructor:</strong> {item.instructor}
                    </span>
                  </div>

                  {item.description && (
                    <p style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '8px', marginBottom: 0, lineHeight: 1.5 }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {item.meetingUrl ? (
                  <a
                    href={item.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ backgroundColor: '#10B981', padding: '9px 16px', fontSize: '0.8125rem', textDecoration: 'none' }}
                  >
                    <Video size={15} /> Join Zoom
                  </a>
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>No meeting link</span>
                )}

                <Link
                  href="/staff/attendance"
                  className="btn-outline"
                  style={{ padding: '9px 14px', fontSize: '0.8125rem', textDecoration: 'none' }}
                >
                  <UserCheck size={15} /> Register
                </Link>

                <button
                  onClick={() => openEditModal(item)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#F0FFF4',
                    color: '#059669',
                    border: '1px solid #BBF7D0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                  }}
                  title="Edit schedule details"
                >
                  <Edit2 size={14} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                  }}
                  title="Delete schedule"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal - Exact 1:1 match with Admin Portal screenshot */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '600px',
              padding: '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
              maxHeight: '92vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {editingId ? 'Edit Scheduled Session' : 'Schedule New Live Class'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Session Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Session Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Biochemistry High-Yield Enzymes Live Workshop"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Subject & Instructor Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Biochemistry"
                    list="staff-assigned-subjects-list"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <datalist id="staff-assigned-subjects-list">
                    {staffProfile?.assignedSubjects?.map((s) => (
                      <option key={s} value={s} />
                    ))}
                    <option value="Biochemistry" />
                    <option value="Biology" />
                    <option value="Chemistry" />
                    <option value="Physics" />
                    <option value="Mathematics" />
                    <option value="Critical Thinking" />
                  </datalist>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    required
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="Dr. Sarah Jenkins"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Date, Time String & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Time String
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="17:00 - 19:00 GMT"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live Now</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Zoom / Meeting Room URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Zoom / Meeting Room URL
                </label>
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://zoom.us/j/mock-live-room"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Description / Topic Summary */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Description / Topic Summary
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of topics covered in this session..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: '#334155',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#059669',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)',
                  }}
                >
                  {editingId ? 'Save Changes' : 'Publish Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
