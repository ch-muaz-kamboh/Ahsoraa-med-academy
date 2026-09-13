'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  Flame,
  Calendar as CalendarIcon,
  CheckCircle2,
  Award,
  Zap,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function StudentStreakHistoryPage() {
  const currentStreakDays = 14;
  const longestStreak = 21;
  const totalStudyHours = 48.5;

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const pastWeeksActivity = [
    { week: 'Sep 07 - Sep 13', days: [true, true, true, true, true, true, true], hours: 14.5 },
    { week: 'Aug 31 - Sep 06', days: [true, true, true, true, true, false, true], hours: 12.0 },
    { week: 'Aug 24 - Aug 30', days: [true, true, true, false, true, true, true], hours: 11.5 },
    { week: 'Aug 17 - Aug 23', days: [true, false, true, true, true, true, true], hours: 10.5 },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Flame Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #B91C1C 0%, #DC2626 50%, #F97316 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ maxWidth: '600px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '14px',
            }}
          >
            <Sparkles size={14} color="#FDE047" />
            <span>DAILY LEARNING CONSISTENCY • STREAK LOG</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            {currentStreakDays}-Day Study Streak 🔥
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.6, margin: 0 }}>
            You've logged active practice questions or video lectures for 14 consecutive days! Keep your streak alive to unlock top percentile performance.
          </p>
        </div>

        {/* Big Flame Icon Badge */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '24px 32px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Flame size={48} color="#FDE047" style={{ marginBottom: '6px' }} />
          <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{currentStreakDays} Days</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.9 }}>ACTIVE STREAK</div>
        </div>
      </div>

      {/* Streak Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Zap size={20} color="#F59E0B" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>LONGEST STREAK</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>{longestStreak} Days</div>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0 0' }}>Personal best record</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Clock size={20} color="#2563EB" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>TOTAL STUDY TIME</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>{totalStudyHours} Hours</div>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0 0' }}>Logged in portal this month</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Award size={20} color="#10B981" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>MILESTONE BADGE</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>🔥 Master Scholar</div>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0 0' }}>Top 5% active consistency</p>
        </div>
      </div>

      {/* Calendar Heatmap / Weekly History */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={20} color="#DC2626" /> Weekly Activity & Heatmap
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {pastWeeksActivity.map((w, idx) => (
            <div key={idx} style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{w.week}</strong>
                <span style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 700 }}>{w.hours} hrs logged</span>
              </div>

              {/* Days Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
                {daysOfWeek.map((day, dIdx) => {
                  const isActive = w.days[dIdx];
                  return (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{day}</span>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: isActive ? '#DC2626' : '#E2E8F0',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.8125rem',
                        }}
                      >
                        {isActive ? <Flame size={18} fill="#FFFFFF" /> : '•'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
