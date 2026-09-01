'use client';

import React, { useState } from 'react';
import { Users, Calendar, Clock, Star, CheckCircle, Video, ArrowRight } from 'lucide-react';
import { mockMentors } from '@/lib/mock-data';

export default function PortalMentorshipPage() {
  const [bookedSession, setBookedSession] = useState<string | null>(null);

  const handleBook = (mentorName: string) => {
    setBookedSession(mentorName);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          1-on-1 Faculty & Doctor Mentorship
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Schedule private clinical mentoring sessions for USMLE clinical breakdown, IMAT interview coaching, and residency application reviews.
        </p>
      </div>

      {bookedSession && (
        <div
          style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#065F46',
          }}
        >
          <CheckCircle size={24} color="#10B981" />
          <div>
            <strong>Mentorship Session Reserved with {bookedSession}!</strong>
            <div style={{ fontSize: '0.8125rem' }}>
              Your calendar invite with the encrypted Zoom/Google Meet link has been generated and sent to your email.
            </div>
          </div>
        </div>
      )}

      {/* Mentors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {mockMentors.map((m) => (
          <div
            key={m.id}
            className="card"
            style={{
              backgroundColor: '#FFFFFF',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <img
                src={m.avatarUrl}
                alt={m.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '2px' }}>{m.name}</h3>
                <div style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600 }}>{m.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{m.specialization}</div>
              </div>
            </div>

            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
              {m.bio}
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.8125rem',
                marginBottom: '16px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                Available Days: <strong>{m.availableDays.join(', ')}</strong>
              </div>
              <div>
                Rate: <strong>${m.hourlyRate}/session</strong>
              </div>
            </div>

            <button
              onClick={() => handleBook(m.name)}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '0.875rem' }}
            >
              <Calendar size={16} />
              <span>Book 45-Min Video Session</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
