'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowRight,
  TrendingUp,
  BarChart2,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getMockAttemptsAsync } from '@/lib/test-utils';
import { createClient } from '@/lib/supabase/client';
import { TestAttempt } from '@/types';

export default function PortalTestsPage() {
  const { testAttempts, currentUser } = useAppStore();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<'all' | 'passed' | 'failed'>('all');

  const loadAttempts = useCallback(async () => {
    try {
      const fetched = await getMockAttemptsAsync();
      const currentEmail = currentUser?.email?.toLowerCase().trim();
      const currentId = currentUser?.id;

      // Filter attempts matching current student if available, else show all user's recorded attempts
      const filtered = fetched.filter((att) => {
        if (!currentEmail && !currentId) return true;
        const attEmail = att.studentEmail?.toLowerCase().trim();
        const attId = att.studentId;
        return (currentEmail && attEmail === currentEmail) || (currentId && attId === currentId) || !attEmail;
      });

      // Merge with store testAttempts (avoiding duplicate IDs)
      const map = new Map<string, TestAttempt>();
      filtered.forEach((a) => map.set(a.id, a));
      testAttempts.forEach((a) => {
        if (!map.has(a.id)) {
          map.set(a.id, a);
        }
      });

      const merged = Array.from(map.values());
      merged.sort((a, b) => {
        const timeA = new Date(a.submittedAt || a.startedAt || 0).getTime();
        const timeB = new Date(b.submittedAt || b.startedAt || 0).getTime();
        return timeB - timeA;
      });

      setAttempts(merged);
    } catch (e) {
      console.warn('Failed to fetch mock attempts:', e);
      setAttempts(testAttempts);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.email, currentUser?.id, testAttempts]);

  useEffect(() => {
    loadAttempts();

    const supabase = createClient();
    const channel = supabase
      .channel('portal-mock-attempts-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cbt_test_questions' }, () => {
        loadAttempts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadAttempts]);

  // Filtered attempts based on search and outcome filter
  const displayedAttempts = useMemo(() => {
    return attempts.filter((att) => {
      const matchesSearch =
        att.testTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (att.id && att.id.toLowerCase().includes(searchQuery.toLowerCase()));

      const maxScore = att.maxScore || 90;
      const isPassed =
        att.isPassed !== undefined
          ? att.isPassed
          : att.passingMarks !== undefined
          ? att.totalScore >= att.passingMarks
          : att.percentage >= 50;

      if (!matchesSearch) return false;
      if (outcomeFilter === 'passed') return isPassed;
      if (outcomeFilter === 'failed') return !isPassed;
      return true;
    });
  }, [attempts, searchQuery, outcomeFilter]);

  // Aggregate KPI metrics
  const totalMocks = attempts.length;
  const bestAttempt = attempts.reduce<TestAttempt | null>((best, cur) => {
    if (!best) return cur;
    return cur.totalScore > best.totalScore ? cur : best;
  }, null);

  const avgPercentage =
    totalMocks > 0 ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalMocks) : 0;

  const avgAccuracy =
    totalMocks > 0 ? Math.round(attempts.reduce((sum, a) => sum + (a.accuracyRate || 0), 0) / totalMocks) : 0;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ECFDF5', color: '#059669', padding: '4px 12px', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          <CheckCircle2 size={13} /> Student Mock Examination Results
        </div>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', fontWeight: 800, marginBottom: '6px' }}>
          Computer-Based Test (CBT) Mock Results
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem', margin: 0, lineHeight: 1.5 }}>
          Official examination scores, percentile rankings, subject diagnostics, and historical attempt analytics.
        </p>
      </div>

      {/* Aggregate Performance Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Total Mocks Attempted</span>
            <FileCheck2 size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {totalMocks}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            Completed examination records
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Highest Score</span>
            <Award size={18} color="#D97706" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
            {bestAttempt ? (
              <>
                {bestAttempt.totalScore}{' '}
                <span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: 600 }}>
                  / 90 pts
                </span>
              </>
            ) : (
              '—'
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px', fontWeight: 600 }}>
            {bestAttempt ? `${bestAttempt.percentage}% Top Achievement` : 'No attempts recorded'}
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Average Percentage</span>
            <TrendingUp size={18} color="#6366F1" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {totalMocks > 0 ? `${avgPercentage}%` : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            Across all attempted blocks
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Overall Accuracy</span>
            <BarChart2 size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {totalMocks > 0 ? `${avgAccuracy}%` : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            Mean correct response rate
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      {attempts.length > 0 && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '380px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search your completed mocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} /> Filter:
            </span>
            <button
              type="button"
              onClick={() => setOutcomeFilter('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: outcomeFilter === 'all' ? '#0F172A' : '#F1F5F9',
                color: outcomeFilter === 'all' ? '#FFFFFF' : '#475569',
              }}
            >
              All ({attempts.length})
            </button>
            <button
              type="button"
              onClick={() => setOutcomeFilter('passed')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: outcomeFilter === 'passed' ? '#059669' : '#F1F5F9',
                color: outcomeFilter === 'passed' ? '#FFFFFF' : '#475569',
              }}
            >
              Passed
            </button>
            <button
              type="button"
              onClick={() => setOutcomeFilter('failed')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: outcomeFilter === 'failed' ? '#DC2626' : '#F1F5F9',
                color: outcomeFilter === 'failed' ? '#FFFFFF' : '#475569',
              }}
            >
              Needs Revision
            </button>
          </div>
        </div>
      )}

      {/* Attempts List */}
      {displayedAttempts.length === 0 ? (
        <div
          className="card"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '50px 24px',
            textAlign: 'center',
            border: '1px dashed #CBD5E1',
            borderRadius: '14px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <FileCheck2 size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
            {attempts.length === 0 ? 'No Attempted Mock Exams Yet' : 'No Results Match Your Search'}
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.5 }}>
            {attempts.length === 0
              ? 'Your official examination scores, percentile standing, and detailed section breakdowns will appear here automatically as soon as you complete a mock test.'
              : 'Try clearing your search query or changing the filter to view other test records.'}
          </p>
          {attempts.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setOutcomeFilter('all');
              }}
              className="btn-secondary"
              style={{ fontSize: '0.8125rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {displayedAttempts.map((attempt) => {
            const maxScore = 90;
            const isPassed =
              attempt.isPassed !== undefined
                ? attempt.isPassed
                : attempt.passingMarks !== undefined
                ? attempt.totalScore >= attempt.passingMarks
                : attempt.percentage >= 50;

            const formattedDate = attempt.submittedAt
              ? new Date(attempt.submittedAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent';

            const spentMinutes = Math.round((attempt.timeSpentSeconds || 0) / 60);

            return (
              <div
                key={attempt.id}
                className="card"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '22px 26px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '12px',
                          backgroundColor: isPassed ? '#DCFCE7' : '#FEE2E2',
                          color: isPassed ? '#166534' : '#991B1B',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {isPassed ? '✓ PASSED QUALIFYING CUTOFF' : 'NEEDS REVISION'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        Submitted {formattedDate} • Time spent: {spentMinutes} mins
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
                      {attempt.testTitle}
                    </h3>
                  </div>

                  <Link
                    href={`/portal/tests/${attempt.testId}/results?attemptId=${attempt.id}`}
                    className="btn-primary"
                    style={{
                      padding: '9px 18px',
                      fontSize: '0.84rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: '8px',
                      fontWeight: 700,
                    }}
                  >
                    <span>View Full Analytics</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {/* Score & Diagnostics Grid */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    padding: '16px 20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '16px',
                    alignItems: 'center',
                  }}
                >
                  {/* Score */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Net Score
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: isPassed ? '#059669' : '#DC2626', marginTop: '2px' }}>
                      {attempt.totalScore}{' '}
                      <span style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: 600 }}>
                        / {maxScore} pts
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      Scoring: +1.5 / -0.4 / blank 0
                    </div>
                  </div>

                  {/* Percentage */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Percentage
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>
                      {attempt.percentage}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      {attempt.percentile ? `Estimated ${attempt.percentile}th percentile` : 'Cohort scaled'}
                    </div>
                  </div>

                  {/* Accuracy */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Accuracy Rate
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>
                      {attempt.accuracyRate}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      Of attempted questions
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Breakdown (C / I / U)
                    </div>
                    <div style={{ fontSize: '0.875rem', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ color: '#16A34A', fontWeight: 800 }}>✓ {attempt.totalCorrect}</span>
                      <span style={{ color: '#94A3B8' }}>•</span>
                      <span style={{ color: '#DC2626', fontWeight: 800 }}>✗ {attempt.totalIncorrect}</span>
                      <span style={{ color: '#94A3B8' }}>•</span>
                      <span style={{ color: '#64748B', fontWeight: 600 }}>— {attempt.totalUnanswered}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                      {attempt.totalAttempted} attempted of {attempt.totalAttempted + attempt.totalUnanswered} total
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
