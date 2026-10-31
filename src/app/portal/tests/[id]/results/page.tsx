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

  const totalMaxMarks = attempt.maxScore || (test.questions.length > 0 ? Number((test.questions.length * 1.5).toFixed(1)) : (test.totalMarks || 90));
  const passingScoreRequired = attempt.passingMarks !== undefined ? attempt.passingMarks : (test.passingMarks !== undefined ? test.passingMarks : Number(((test.passingPercentage || 50) / 100 * totalMaxMarks).toFixed(1)));
  const isPassed = attempt.isPassed !== undefined ? attempt.isPassed : (test.passingMarks !== undefined ? attempt.totalScore >= test.passingMarks : attempt.percentage >= (test.passingPercentage || 50));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: isPassed ? '#F0FFF4' : '#FEF2F2',
          border: `1px solid ${isPassed ? '#BBF7D0' : '#FECACA'}`,
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
            href="/portal/tests"
            className="btn-primary"
            style={{ fontSize: '0.875rem' }}
          >
            ← Back to CBT Mock Results
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
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>
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
                      backgroundColor: mastery >= 80 ? '#10B981' : mastery >= 50 ? '#059669' : '#EF4444',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question by Question Review — STRICT REQUIREMENT: Only show attempted MCQs */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', margin: 0 }}>
              Attempted Questions Review & Rationale
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '4px 0 0' }}>
              Showing only the questions you attempted during this mock session. Unattempted questions remain hidden.
            </p>
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, padding: '6px 14px', borderRadius: '8px', backgroundColor: '#F1F5F9', color: '#334155' }}>
            {(() => {
              const uAnswers = attempt.userAnswers || {};
              const attCount = test.questions.filter((q) => Boolean(uAnswers[q.id])).length;
              return `${attCount} of ${test.questions.length} Attempted`;
            })()}
          </span>
        </div>

        {(() => {
          const uAnswers = attempt.userAnswers || {};
          const attemptedList = test.questions
            .map((q, originalIdx) => ({ q, originalIdx }))
            .filter(({ q }) => Boolean(uAnswers[q.id]));

          if (attemptedList.length === 0) {
            return (
              <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                <HelpCircle size={40} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                  No Questions Attempted
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#64748B', maxWidth: '440px', margin: '0 auto 16px' }}>
                  You did not select answers for any questions during this mock exam block. Per exam policy, unanswered questions are not revealed.
                </p>
                <Link
                  href="/portal/tests"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}
                >
                  Return to CBT Mock Results
                </Link>
              </div>
            );
          }

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {attemptedList.map(({ q, originalIdx }) => {
                const marked = uAnswers[q.id];
                const isCorrect = marked === q.correctOption;

                return (
                  <div
                    key={q.id}
                    style={{
                      border: `1.5px solid ${isCorrect ? '#BBF7D0' : '#FECACA'}`,
                      borderRadius: '12px',
                      padding: '20px',
                      backgroundColor: isCorrect ? '#FBFDFB' : '#FFFDFD',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem' }}>
                        Question {originalIdx + 1}: <span style={{ color: '#059669' }}>{q.subject}</span>
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isCorrect ? (
                          <span
                            style={{
                              backgroundColor: '#DCFCE7',
                              color: '#15803D',
                              border: '1px solid #BBF7D0',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <CheckCircle size={13} /> You Marked Option {marked} (Correct +1.5)
                          </span>
                        ) : (
                          <span
                            style={{
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              border: '1px solid #FECACA',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <XCircle size={13} /> You Marked Option {marked} (Incorrect -0.4)
                          </span>
                        )}
                        <span
                          style={{
                            backgroundColor: '#F0FDF4',
                            color: '#166534',
                            border: '1px solid #86EFAC',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            padding: '3px 10px',
                            borderRadius: '6px',
                          }}
                        >
                          Correct: Option {q.correctOption}
                        </span>
                      </div>
                    </div>

                    <p style={{ color: '#0F172A', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '16px' }}>
                      {q.questionText}
                    </p>

                    {/* Options list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {q.options.map((opt) => {
                        const isThisCorrect = opt.id === q.correctOption;
                        const isThisMarked = opt.id === marked;

                        let bg = '#F8FAFC';
                        let border = '1px solid #E2E8F0';
                        let color = '#334155';
                        let fontWeight = 400;

                        if (isThisCorrect) {
                          bg = '#ECFDF5';
                          border = '1.5px solid #10B981';
                          color = '#065F46';
                          fontWeight = 600;
                        } else if (isThisMarked && !isThisCorrect) {
                          bg = '#FEF2F2';
                          border = '1.5px solid #EF4444';
                          color = '#991B1B';
                          fontWeight = 600;
                        }

                        return (
                          <div
                            key={opt.id}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              backgroundColor: bg,
                              border: border,
                              color: color,
                              fontWeight: fontWeight,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '10px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong>{opt.id}.</strong>
                              <span>{opt.text}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {isThisMarked && (
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: isThisCorrect ? '#D1FAE5' : '#FEE2E2',
                                    color: isThisCorrect ? '#065F46' : '#991B1B',
                                  }}
                                >
                                  Your Choice
                                </span>
                              )}
                              {isThisCorrect && (
                                <CheckCircle size={16} color="#10B981" />
                              )}
                              {isThisMarked && !isThisCorrect && (
                                <XCircle size={16} color="#EF4444" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    <div
                      style={{
                        backgroundColor: '#F0FFF4',
                        border: '1px solid #DCFCE7',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        fontSize: '0.875rem',
                        color: '#14532D',
                        lineHeight: 1.6,
                      }}
                    >
                      <strong>High-Yield Clinical Rationale:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
