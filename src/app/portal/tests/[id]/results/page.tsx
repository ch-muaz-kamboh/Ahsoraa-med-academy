'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import {
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { getMockTestWithCustom, getMockTestWithCustomAsync } from '@/lib/test-utils';
import { useAppStore } from '@/lib/store';
import { Test, TestAttempt } from '@/types';


export default function TestResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const { testAttempts } = useAppStore();

  const [test, setTest] = useState<Test>(() => getMockTestWithCustom(resolvedParams.id));

  React.useEffect(() => {
    let isMounted = true;
    getMockTestWithCustomAsync(resolvedParams.id).then((fetched) => {
      if (isMounted && fetched) {
        setTest(fetched);
      }
    });
    return () => { isMounted = false; };
  }, [resolvedParams.id]);

  if (!test) {
    notFound();
  }

  // Find attempt from store or local storage fallback
  const getSavedAttempt = (): TestAttempt | null => {
    if (typeof window === 'undefined') return null;
    try {
      const byId = attemptId ? localStorage.getItem('cbt_attempt_' + attemptId) : null;
      if (byId) return JSON.parse(byId);
      const latest = localStorage.getItem('cbt_latest_attempt_' + test.id);
      if (latest) return JSON.parse(latest);
    } catch (e) {}
    return null;
  };

  const savedAttempt = getSavedAttempt();

  const attempt: TestAttempt =
    savedAttempt ||
    testAttempts.find((a) => a.id === attemptId) ||
    testAttempts.find((a) => a.testId === test.id) ||
    testAttempts[0] || {
      id: 'mock-att',
      testId: test.id,
      testTitle: test.title,
      studentId: 'usr-student-01',
      status: 'completed' as const,
      startedAt: new Date().toISOString(),
      timeSpentSeconds: 1420,
      totalScore: 0,
      percentage: 0,
      totalAttempted: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      totalUnanswered: test.questions.length,
      accuracyRate: 0,
      percentile: 10,
      subjectBreakdown: {},
    };

  const totalMaxMarks = test.questions.length > 0 ? Number((test.questions.length * 1.5).toFixed(1)) : (test.totalMarks || 90);
  const isPassed = attempt.percentage >= (test.passingPercentage || 50);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: isPassed ? '#EFF6FF' : '#FEF2F2',
          border: `1px solid ${isPassed ? '#BFDBFE' : '#FECACA'}`,
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div>
          <span
            className={isPassed ? 'badge badge-green' : 'badge badge-red'}
            style={{ marginBottom: '8px', fontSize: '0.8125rem' }}
          >
            {isPassed ? 'PASSED QUALIFYING THRESHOLD' : 'NEEDS REVISION'}
          </span>
          <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
            Assessment Outcome: {test.title}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem', margin: 0 }}>
            Completed in {Math.round(attempt.timeSpentSeconds / 60)} minutes • Official negative-marking applied
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href={`/portal/tests/${test.id}/take`}
            className="btn-outline"
            style={{ backgroundColor: '#FFFFFF', fontSize: '0.875rem' }}
          >
            <RotateCcw size={16} /> Re-attempt Block
          </Link>
          <Link
            href="/portal/tests"
            className="btn-primary"
            style={{ fontSize: '0.875rem' }}
          >
            All Tests Series
          </Link>
        </div>
      </div>

      {/* 4-Stat Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '4px' }}>Net Final Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563EB' }}>
            {attempt.totalScore} <span style={{ fontSize: '1rem', color: '#94A3B8' }}>/ {totalMaxMarks}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
            {attempt.percentage}% Overall
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '4px' }}>Accuracy Rate</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>
            {attempt.accuracyRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            {attempt.totalCorrect} Correct • {attempt.totalIncorrect} Incorrect
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '4px' }}>Estimated Cohort Percentile</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>
            {attempt.percentile}th
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Top {100 - attempt.percentile}% of Candidate Pool
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '4px' }}>Time / Vignette</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>
            {Math.round(attempt.timeSpentSeconds / Math.max(1, attempt.totalAttempted))}s
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
            Pacing: Excellent (&lt; 90s)
          </div>
        </div>
      </div>

      {/* Subject Breakdown & Weak Area Detection */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '16px' }}>
          Subject & Topic Mastery Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(attempt.subjectBreakdown).map(([subject, data]) => {
            const mastery = Math.round((data.correct / Math.max(1, data.total)) * 100);
            return (
              <div key={subject}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '6px' }}>
                  <strong style={{ color: '#0F172A' }}>{subject}</strong>
                  <span style={{ color: '#64748B' }}>
                    {data.correct} / {data.total} Correct ({mastery}%) • Net {data.score} pts
                  </span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${mastery}%`,
                      height: '100%',
                      backgroundColor: mastery >= 80 ? '#10B981' : mastery >= 50 ? '#2563EB' : '#EF4444',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question by Question Comprehensive Review */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '20px' }}>
          Question-by-Question Clinical Explanations
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {test.questions.map((q, idx) => (
            <div
              key={q.id}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, color: '#2563EB', fontSize: '0.9375rem' }}>
                  Question {idx + 1}: {q.subject}
                </span>
                <span className="badge badge-green">
                  Correct Answer: Option {q.correctOption}
                </span>
              </div>

              <p style={{ color: '#0F172A', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '16px' }}>
                {q.questionText}
              </p>

              {/* Options list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {q.options.map((opt) => {
                  const isCorrect = opt.id === q.correctOption;
                  return (
                    <div
                      key={opt.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        backgroundColor: isCorrect ? '#ECFDF5' : '#F8FAFC',
                        border: isCorrect ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                        color: isCorrect ? '#065F46' : '#334155',
                        fontWeight: isCorrect ? 600 : 400,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <strong>{opt.id}.</strong>
                      <span>{opt.text}</span>
                      {isCorrect && (
                        <CheckCircle size={16} color="#10B981" style={{ marginLeft: 'auto' }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box */}
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  fontSize: '0.875rem',
                  color: '#1E3A8A',
                  lineHeight: 1.6,
                }}
              >
                <strong>High-Yield Clinical Rationale:</strong> {q.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
