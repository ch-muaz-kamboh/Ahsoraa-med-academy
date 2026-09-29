'use client';

import React, { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Flame,
  Calendar as CalendarIcon,
  Award,
  Zap,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function StudentStreakHistoryPage() {
  const { testAttempts, studentMistakes } = useAppStore();

  // Collect all unique activity dates from test attempts and mistakes
  const activityDates = useMemo(() => {
    const dates = new Set<string>();
    testAttempts.forEach((t) => {
      const d = t.createdAt || (t as any).created_at;
      if (d) dates.add(new Date(d).toISOString().slice(0, 10));
    });
    studentMistakes.forEach((m) => {
      const d = (m as any).createdAt || (m as any).created_at;
      if (d) dates.add(new Date(d).toISOString().slice(0, 10));
    });
    return dates;
  }, [testAttempts, studentMistakes]);

  // Compute current streak
  const { currentStreak, longestStreak } = useMemo(() => {
    const sorted = Array.from(activityDates).sort().reverse();
    if (sorted.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    let cur = 0;
    let check = sorted[0] === today || sorted[0] === yesterday ? sorted[0] : null;
    if (check) {
      for (const d of sorted) {
        if (d === check) {
          cur++;
          const prev = new Date(new Date(check).getTime() - 86400000).toISOString().slice(0, 10);
          check = prev;
        } else {
          break;
        }
      }
    }

    // Longest streak
    const allSorted = Array.from(activityDates).sort();
    let longest = 0;
    let tempLen = 1;
    for (let i = 1; i < allSorted.length; i++) {
      const prev = new Date(new Date(allSorted[i - 1]).getTime() + 86400000).toISOString().slice(0, 10);
      if (allSorted[i] === prev) {
        tempLen++;
        longest = Math.max(longest, tempLen);
      } else {
        tempLen = 1;
      }
    }
    if (allSorted.length === 1) longest = 1;

    return { currentStreak: cur, longestStreak: Math.max(longest, cur) };
  }, [activityDates]);

  const totalSessions = testAttempts.length;
  const hasData = activityDates.size > 0;

  // Build last 4 weeks activity grid
  const weeksData = useMemo(() => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeks = [];
    const now = new Date();
    for (let w = 0; w < 4; w++) {
      // Find the Monday of this week offset
      const weekStart = new Date(now);
      const dayOfWeek = (weekStart.getDay() + 6) % 7; // Monday=0
      weekStart.setDate(weekStart.getDate() - dayOfWeek - w * 7);
      weekStart.setHours(0, 0, 0, 0);

      const days: boolean[] = [];
      const label = weekStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const weekEndDate = new Date(weekStart);
      weekEndDate.setDate(weekEndDate.getDate() + 6);
      const labelEnd = weekEndDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

      for (let d = 0; d < 7; d++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(dayDate.getDate() + d);
        const ds = dayDate.toISOString().slice(0, 10);
        days.push(activityDates.has(ds));
      }

      weeks.push({ label: `${label} – ${labelEnd}`, days, daysOfWeek });
    }
    return weeks;
  }, [activityDates]);

  const badge =
    currentStreak >= 30 ? '🏆 Legend Scholar'
    : currentStreak >= 14 ? '🔥 Master Scholar'
    : currentStreak >= 7  ? '⚡ Rising Star'
    : currentStreak >= 3  ? '✅ Consistent'
    : hasData             ? '🌱 Getting Started'
    : null;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '14px' }}>
            <Sparkles size={14} color="#FDE047" />
            <span>DAILY LEARNING CONSISTENCY • STREAK LOG</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            {currentStreak > 0 ? `${currentStreak}-Day Study Streak 🔥` : 'Start Your Streak Today!'}
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.6, margin: 0 }}>
            {currentStreak > 0
              ? `You've logged active practice or tests for ${currentStreak} consecutive day${currentStreak > 1 ? 's' : ''}! Keep it going.`
              : 'Complete a practice session or mock test today to start building your streak.'}
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '24px 32px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
          <Flame size={48} color="#FDE047" style={{ marginBottom: '6px' }} />
          <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{currentStreak} Day{currentStreak !== 1 ? 's' : ''}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.9 }}>ACTIVE STREAK</div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Zap size={20} color="#F59E0B" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>LONGEST STREAK</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>{longestStreak} Day{longestStreak !== 1 ? 's' : ''}</div>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0 0' }}>Personal best record</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <TrendingUp size={20} color="#2563EB" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>TOTAL SESSIONS</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>{totalSessions}</div>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0 0' }}>Tests &amp; practice completed</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Award size={20} color="#10B981" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>ACTIVE DAYS</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>{activityDates.size}</div>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0 0' }}>Unique days with activity</p>
        </div>

        {badge && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Award size={20} color="#7C3AED" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>MILESTONE BADGE</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7C3AED' }}>{badge}</div>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0 0' }}>Based on your streak</p>
          </div>
        )}
      </div>

      {/* Weekly Heatmap */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={20} color="#DC2626" /> Weekly Activity Heatmap
        </h3>

        {!hasData ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
            <Flame size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Complete a test or practice session to start seeing your activity heatmap.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {weeksData.map((w, idx) => (
              <div key={idx} style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{w.label}</strong>
                  <span style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 700 }}>
                    {w.days.filter(Boolean).length}/7 days active
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
                  {w.daysOfWeek.map((day, dIdx) => {
                    const isActive = w.days[dIdx];
                    return (
                      <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{day}</span>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          backgroundColor: isActive ? '#DC2626' : '#E2E8F0',
                          color: '#FFFFFF',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.8125rem',
                        }}>
                          {isActive ? <Flame size={18} fill="#FFFFFF" /> : <span style={{ color: '#94A3B8' }}>·</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
