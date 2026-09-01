'use client';

import React from 'react';
import Link from 'next/link';
import { FileCheck, Clock, Award, CheckCircle, ArrowRight, PlayCircle } from 'lucide-react';
import { mockTests } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';

export default function PortalTestsPage() {
  const { testAttempts } = useAppStore();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          Computer-Based Test (CBT) Series
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Real examination simulation with question navigation, mark-for-review flags, negative marking, and instant analytical breakdowns.
        </p>
      </div>

      {/* Available Tests Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {mockTests.map((test) => (
          <div
            key={test.id}
            className="card"
            style={{
              backgroundColor: '#FFFFFF',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="badge badge-blue">{test.category}</span>
              <span className="badge badge-amber" style={{ textTransform: 'uppercase' }}>
                {test.difficulty}
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '8px', lineHeight: 1.3 }}>
              {test.title}
            </h3>

            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
              {test.instructions}
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.8125rem',
                marginBottom: '20px',
                border: '1px solid #E2E8F0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              <div>
                Duration: <strong>{test.durationMinutes} mins</strong>
              </div>
              <div>
                Questions: <strong>{test.totalQuestions} items</strong>
              </div>
              <div>
                Marking: <strong style={{ color: '#10B981' }}>+{test.positiveMark}</strong> /{' '}
                <strong style={{ color: '#EF4444' }}>-{test.negativeMark}</strong>
              </div>
              <div>
                Passing: <strong style={{ color: '#2563EB' }}>{test.passingPercentage}%</strong>
              </div>
            </div>

            <Link
              href={`/portal/tests/${test.id}/take`}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '0.875rem' }}
            >
              <PlayCircle size={16} />
              <span>Launch Timed Mock Exam</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Past Completed Attempts */}
      {testAttempts.length > 0 && (
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '16px' }}>
            My Recent Mock Attempts
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {testAttempts.map((attempt) => (
              <div
                key={attempt.id}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '4px' }}>
                    {attempt.testTitle}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Submitted: {new Date(attempt.startedAt).toLocaleDateString()} • Time spent:{' '}
                    {Math.round(attempt.timeSpentSeconds / 60)} mins
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: attempt.percentage >= 60 ? '#10B981' : '#EF4444' }}>
                      {attempt.percentage}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Score: {attempt.totalScore} pts
                    </div>
                  </div>

                  <Link
                    href={`/portal/tests/${attempt.testId}/results?attemptId=${attempt.id}`}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.8125rem' }}
                  >
                    View Analytics →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
