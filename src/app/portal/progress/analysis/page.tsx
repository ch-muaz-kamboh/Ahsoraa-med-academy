'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  TrendingUp,
  BarChart2,
  Target,
  Award,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function StudentProgressAnalysisPage() {
  const { testAttempts, studentMistakes } = useAppStore();

  const totalAttempted = testAttempts.reduce((acc, t) => acc + (t.totalAttempted || 0), 0);
  const totalCorrect = testAttempts.reduce((acc, t) => acc + (t.totalCorrect || 0), 0);
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Build subject stats from mistakes log (grouped by subject)
  const subjectMap: Record<string, { wrong: number; resolved: number }> = {};
  studentMistakes.forEach((m) => {
    const subj = (m as any).subject || 'General';
    if (!subjectMap[subj]) subjectMap[subj] = { wrong: 0, resolved: 0 };
    subjectMap[subj].wrong += 1;
    if ((m as any).isResolved) subjectMap[subj].resolved += 1;
  });

  const subjectStats = Object.entries(subjectMap)
    .map(([subject, data]) => {
      const pct = data.wrong > 0 ? Math.round((data.resolved / data.wrong) * 100) : 0;
      const strength = pct >= 80 ? 'Mastered' : pct >= 60 ? 'High' : pct >= 40 ? 'Medium' : 'Needs Focus';
      return { subject, pct, totalQuestions: data.wrong, strength };
    })
    .sort((a, b) => b.pct - a.pct);

  const hasData = testAttempts.length > 0 || studentMistakes.length > 0;
  const unresolvedCount = studentMistakes.filter((m) => !(m as any).isResolved).length;
  const resolvedCount = studentMistakes.filter((m) => (m as any).isResolved).length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(67, 56, 202, 0.3)',
        }}
      >
        <div style={{ maxWidth: '700px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '14px' }}>
            <Sparkles size={14} color="#FDE047" />
            <span>PROGRESS &amp; PERFORMANCE ANALYTICS</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Diagnostic Performance Analysis
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.6, margin: 0 }}>
            Real-time breakdown of your subject proficiency, accuracy, and mistake patterns from actual test sessions.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700 }}>OVERALL ACCURACY</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={20} /></div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A' }}>{totalAttempted > 0 ? `${overallAccuracy}%` : '--'}</div>
          <div style={{ fontSize: '0.8125rem', color: totalAttempted > 0 ? '#10B981' : '#94A3B8', fontWeight: 600, marginTop: '4px' }}>
            {totalAttempted > 0 ? `${totalCorrect} correct of ${totalAttempted}` : 'No attempts yet'}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700 }}>TESTS COMPLETED</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={20} /></div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A' }}>{testAttempts.length}</div>
          <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>{totalAttempted} total questions answered</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700 }}>ACTIVE MISTAKES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={20} /></div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A' }}>{unresolvedCount}</div>
          <div style={{ fontSize: '0.8125rem', color: '#DC2626', fontWeight: 600, marginTop: '4px' }}>Pending in review notebook</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700 }}>RESOLVED MISTAKES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={20} /></div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A' }}>{resolvedCount}</div>
          <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>Mastered concepts</div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid #E2E8F0', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={20} color="#2563EB" /> Subject Proficiency &amp; Mastery Index
        </h3>

        {!hasData ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
            <TrendingUp size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Complete practice tests or mock exams to see your subject-level performance breakdown here.</p>
          </div>
        ) : subjectStats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>No subject data yet. Breakdowns appear after logging mistakes with subject tags.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {subjectStats.map((st) => (
              <div key={st.subject}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#334155' }}>
                    {st.subject}{' '}
                    <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>({st.totalQuestions} mistakes tracked)</span>
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px',
                      backgroundColor: st.pct >= 80 ? '#DCFCE7' : st.pct >= 60 ? '#FEF3C7' : '#FEE2E2',
                      color: st.pct >= 80 ? '#15803D' : st.pct >= 60 ? '#B45309' : '#B91C1C',
                    }}>
                      {st.strength}
                    </span>
                    <strong style={{ fontSize: '0.9375rem', color: '#0F172A' }}>{st.pct}% resolved</strong>
                  </div>
                </div>
                <div style={{ height: '10px', backgroundColor: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${st.pct}%`,
                    backgroundColor: st.pct >= 80 ? '#10B981' : st.pct >= 60 ? '#F59E0B' : '#EF4444',
                    borderRadius: '5px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}    </div>
  );
}
