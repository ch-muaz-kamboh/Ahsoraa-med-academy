'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Target,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles,
} from 'lucide-react';

export default function StudentProgressAnalysisPage() {
  const { testAttempts, studentMistakes } = useAppStore();

  const totalAttempted = testAttempts.reduce((acc, t) => acc + t.totalAttempted, 0);
  const totalCorrect = testAttempts.reduce((acc, t) => acc + t.totalCorrect, 0);
  const totalIncorrect = testAttempts.reduce((acc, t) => acc + t.totalIncorrect, 0);
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 78;

  const subjectStats = [
    { subject: 'Biology & Genetics', accuracy: 84, totalQuestions: 140, strength: 'High' },
    { subject: 'Biochemistry', accuracy: 72, totalQuestions: 95, strength: 'Medium' },
    { subject: 'General Chemistry', accuracy: 68, totalQuestions: 110, strength: 'Needs Focus' },
    { subject: 'Physics & Optics', accuracy: 65, totalQuestions: 60, strength: 'Needs Focus' },
    { subject: 'Logic & Critical Thinking', accuracy: 91, totalQuestions: 85, strength: 'Mastered' },
  ];

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
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '14px',
            }}
          >
            <Sparkles size={14} color="#FDE047" />
            <span>PROGRESS & PERFORMANCE ANALYTICS</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Diagnostic Performance Analysis
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.6, margin: 0 }}>
            Deep breakdown of your subject proficiency, time management efficiency, accuracy percentages, and predicted target score for official entrance exams.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700 }}>OVERALL ACCURACY</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A' }}>{overallAccuracy}%</div>
          <div style={{ fontSize: '0.8125rem', color: '#10B981', fontWeight: 600, marginTop: '4px' }}>
            ▲ +5.2% from last week
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700 }}>PREDICTED IMAT SCORE</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A' }}>58.4 / 90</div>
          <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
            Top 8% percentile projection
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700 }}>AVG RESPONSE TIME</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A' }}>52 sec</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>
            Optimal pacing per MCQ
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700 }}>ACTIVE MISTAKES LOG</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A' }}>{studentMistakes.filter(m => !m.isResolved).length}</div>
          <div style={{ fontSize: '0.8125rem', color: '#DC2626', fontWeight: 600, marginTop: '4px' }}>
            Pending review notebook
          </div>
        </div>
      </div>

      {/* Subject Breakdown Progress Bars */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid #E2E8F0', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={20} color="#2563EB" /> Subject Proficiency & Mastery Index
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {subjectStats.map((st) => (
            <div key={st.subject}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#334155' }}>
                  {st.subject} <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>({st.totalQuestions} Questions)</span>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: st.accuracy >= 80 ? '#DCFCE7' : st.accuracy >= 70 ? '#FEF3C7' : '#FEE2E2', color: st.accuracy >= 80 ? '#15803D' : st.accuracy >= 70 ? '#B45309' : '#B91C1C' }}>
                    {st.strength}
                  </span>
                  <strong style={{ fontSize: '0.9375rem', color: '#0F172A' }}>{st.accuracy}%</strong>
                </div>
              </div>

              {/* Progress Track */}
              <div style={{ height: '10px', backgroundColor: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${st.accuracy}%`,
                    backgroundColor: st.accuracy >= 80 ? '#10B981' : st.accuracy >= 70 ? '#F59E0B' : '#EF4444',
                    borderRadius: '5px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
