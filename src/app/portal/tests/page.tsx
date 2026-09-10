'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileCheck, Clock, Award, CheckCircle, ArrowRight, PlayCircle, Radio } from 'lucide-react';
import { mockTests } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

export default function PortalTestsPage() {
  const { testAttempts } = useAppStore();
  const [liveSession, setLiveSession] = useState<{ id: string; test_id: string; test_title: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('test_sessions')
      .select('id, test_id, test_title')
      .eq('is_live', true)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setLiveSession(data);
      });
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {liveSession && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '2px solid #EF4444',
          borderRadius: '14px',
          padding: '18px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              backgroundColor: '#EF4444', color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Radio size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '1px' }}>
                LIVE EXAM IN PROGRESS
              </div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>
                {liveSession.test_title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                Admin has initiated this exam for all students. Join now to participate in real-time.
              </div>
            </div>
          </div>
          <Link
            href={`/portal/tests/${liveSession.test_id}/take`}
            style={{
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
          >
            <PlayCircle size={18} />
            <span>Join Live Test Now</span>
          </Link>
        </div>
      )}

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
