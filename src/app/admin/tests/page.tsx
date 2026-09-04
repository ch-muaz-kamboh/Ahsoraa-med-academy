'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, StopCircle, Radio, Loader2 } from 'lucide-react';
import { mockTests } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

export default function AdminTestsPage() {
  const [tests] = useState(mockTests);
  const [liveSession, setLiveSession] = useState<{ id: string; test_id: string; test_title: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch current live session from DB on mount
  const fetchLiveSession = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('test_sessions')
      .select('*')
      .eq('is_live', true)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    setLiveSession(data ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLiveSession();
  }, [fetchLiveSession]);

  const startTest = async (testId: string, testTitle: string) => {
    if (liveSession) {
      alert('Please stop the currently live test before starting a new one.');
      return;
    }
    if (!confirm(`Start "${testTitle}" for ALL enrolled students?`)) return;

    setActionLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('test_sessions')
      .insert({ test_id: testId, test_title: testTitle, is_live: true })
      .select()
      .single();

    if (!error && data) {
      setLiveSession(data);
    } else {
      alert('Failed to start test: ' + (error?.message ?? 'Unknown error'));
    }
    setActionLoading(false);
  };

  const stopTest = async () => {
    if (!liveSession) return;
    setActionLoading(true);
    const supabase = createClient();
    await supabase
      .from('test_sessions')
      .update({ is_live: false, ended_at: new Date().toISOString() })
      .eq('id', liveSession.id);

    setLiveSession(null);
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: '#64748B' }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>Tests</h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Select a test and broadcast it live. When you start a test, all enrolled students will immediately receive a notification to join.
        </p>
      </div>

      {/* Live Session Banner */}
      {liveSession && (
        <div style={{
          backgroundColor: '#FEF2F2', border: '2px solid #EF4444', borderRadius: '16px',
          padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#EF4444', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '1px' }}>
                🔴 Live Now — All Students Notified
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#7F1D1D', marginTop: '2px' }}>
                {liveSession.test_title}
              </div>
            </div>
          </div>
          <button
            onClick={stopTest}
            disabled={actionLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#DC2626', color: '#FFF', fontWeight: 700, fontSize: '0.9375rem', cursor: actionLoading ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }}
          >
            {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <StopCircle size={18} />}
            End Test for All Students
          </button>
        </div>
      )}

      {/* Test List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tests.map((test) => {
          const isLive = liveSession?.test_id === test.id;
          return (
            <div key={test.id} style={{
              backgroundColor: '#FFFFFF', border: `2px solid ${isLive ? '#EF4444' : '#E2E8F0'}`,
              borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', backgroundColor: '#F0FFF4', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {test.category}
                  </span>
                  {isLive && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', backgroundColor: '#EF4444', color: '#FFF' }}>
                      LIVE
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{test.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
                  {test.questions.length} Questions • {test.durationMinutes} Minutes • Passing: {test.passingPercentage}%
                </div>
              </div>

              <div>
                {isLive ? (
                  <button onClick={stopTest} disabled={actionLoading}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: 700, fontSize: '0.875rem', cursor: actionLoading ? 'not-allowed' : 'pointer' }}>
                    <StopCircle size={16} /> Stop Test
                  </button>
                ) : (
                  <button onClick={() => startTest(test.id, test.title)} disabled={actionLoading}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: '#FFF', fontWeight: 700, fontSize: '0.875rem', cursor: actionLoading ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }}>
                    {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={16} />}
                    Start Test for All Students
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* How it works */}
      <div style={{ marginTop: '40px', backgroundColor: '#F0FFF4', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '20px 24px' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#065F46', marginBottom: '10px' }}>✅ How Test Broadcasting Works</div>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#047857', fontSize: '0.875rem', lineHeight: '2' }}>
          <li>Click <strong>"Start Test for All Students"</strong> — this saves a live session to the database.</li>
          <li>Every enrolled student&apos;s portal checks for a live session and displays a <strong>Join Now</strong> notification.</li>
          <li>Click <strong>"End Test"</strong> to close the session — students can no longer join.</li>
        </ul>
      </div>
    </div>
  );
}
