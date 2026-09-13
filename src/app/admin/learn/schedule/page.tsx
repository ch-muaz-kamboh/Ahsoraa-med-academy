'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Calendar as CalendarIcon,
  Plus,
  Edit2,
  Trash2,
  Video,
  User,
  Clock,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { ScheduleItem } from '@/types';

export default function AdminScheduleManagerPage() {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Biochemistry');
  const [instructor, setInstructor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [location, setLocation] = useState('Live Zoom Interactive Room');
  const [status, setStatus] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [description, setDescription] = useState('');

  const openNewModal = () => {
    setEditingId(null);
    setTitle('');
    setSubject('Biochemistry');
    setInstructor('Dr. Sarah Jenkins');
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
    setDurationMinutes(item.durationMinutes);
    setMeetingUrl(item.meetingUrl || '');
    setLocation(item.location || '');
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0' }}>
            Schedule Manager (Admin Panel)
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: 0 }}>
            Create, edit, or publish live Zoom timetables, workshops, and exam review sessions visible to enrolled students.
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
            backgroundColor: '#F59E0B',
            color: '#0F172A',
            fontWeight: 800,
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={18} /> Schedule New Live Class
        </button>
      </div>

      {/* Schedule Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
              <th style={{ padding: '16px 20px' }}>Subject & Title</th>
              <th style={{ padding: '16px 20px' }}>Instructor</th>
              <th style={{ padding: '16px 20px' }}>Date & Time</th>
              <th style={{ padding: '16px 20px' }}>Status</th>
              <th style={{ padding: '16px 20px' }}>Zoom Link</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '16px 20px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#2563EB',
                      backgroundColor: '#EFF6FF',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginBottom: '4px',
                    }}
                  >
                    {item.subject}
                  </span>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.title}</div>
                </td>
                <td style={{ padding: '16px 20px', color: '#334155', fontWeight: 600 }}>
                  {item.instructor}
                </td>
                <td style={{ padding: '16px 20px', color: '#475569' }}>
                  <div>{item.date}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.time} ({item.durationMinutes}m)</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backgroundColor:
                        item.status === 'live'
                          ? '#FEE2E2'
                          : item.status === 'completed'
                          ? '#F1F5F9'
                          : '#FEF3C7',
                      color:
                        item.status === 'live'
                          ? '#DC2626'
                          : item.status === 'completed'
                          ? '#64748B'
                          : '#D97706',
                    }}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  {item.meetingUrl ? (
                    <a
                      href={item.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2563EB', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      Zoom Room Link
                    </a>
                  ) : (
                    <span style={{ color: '#94A3B8' }}>No link</span>
                  )}
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(item)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        border: '1px solid #BFDBFE',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => deleteSchedule(item.id)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        border: '1px solid #FECACA',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '600px',
              padding: '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {editingId ? 'Edit Scheduled Session' : 'Schedule New Live Class'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

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
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
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
                    placeholder="e.g. Dr. Sarah Jenkins"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

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
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
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
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live Now</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Zoom / Meeting Room URL
                </label>
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://zoom.us/j/12345678"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Description / Topic Summary
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of topics covered in this session..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#2563EB', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
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
