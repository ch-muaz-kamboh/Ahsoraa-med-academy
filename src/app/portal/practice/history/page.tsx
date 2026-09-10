'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, BarChart3, CheckCircle, XCircle, Clock, Loader2, BookOpen, RefreshCcw } from 'lucide-react';

interface PracticeSession {
  id: string; title: string; subject_filter: string | null; difficulty_filter: string | null;
  question_count: number; total_correct: number; total_incorrect: number; total_unanswered: number;
  percentage: number; accuracy_rate: number; time_spent_seconds: number;
  status: string; created_at: string; submitted_at: string | null;
}

export default function PracticeHistoryPage() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [mistakeFilter, setMistakeFilter] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, count } = await supabase
        .from('practice_sessions')
        .select('*', { count:'exact' })
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });
      if (data) { setSessions(data); setTotal(count||0); }
      setLoading(false);
    };
    load();
  }, [supabase]);

  const fmtTime = (s: number) => Math.floor(s/60) + 'm ' + (s%60) + 's';
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

  const displayed = mistakeFilter ? sessions.filter(s => s.total_incorrect > 0) : sessions;

  const totalQs      = sessions.filter(s => s.status==='submitted').reduce((a,s) => a+s.question_count, 0);
  const totalCorrect = sessions.filter(s => s.status==='submitted').reduce((a,s) => a+s.total_correct, 0);
  const avgPct       = sessions.filter(s => s.status==='submitted').length > 0
    ? sessions.filter(s => s.status==='submitted').reduce((a,s) => a+s.percentage, 0) / sessions.filter(s => s.status==='submitted').length
    : 0;

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'12px', color:'#64748B' }}>
      <Loader2 size={24} style={{ animation:'spin 1s linear infinite' }} /> Loading history…
    </div>
  );

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
        <Link href='/portal/practice' style={{ display:'flex', alignItems:'center', gap:'6px',
          color:'#64748B', textDecoration:'none', fontSize:'0.875rem', fontWeight:600 }}>
          <ArrowLeft size={15} /> Practice
        </Link>
        <span style={{ color:'#CBD5E1' }}>/</span>
        <span style={{ fontSize:'0.875rem', color:'#475569', fontWeight:600 }}>My History</span>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'#0F172A', marginBottom:'4px' }}>Practice History</h1>
          <p style={{ color:'#64748B', fontSize:'0.9rem' }}>{total} sessions total</p>
        </div>
        <Link href='/portal/practice'
          style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 18px',
            borderRadius:'9px', border:'none', backgroundColor:'#2563EB', color:'#fff',
            fontWeight:700, fontSize:'0.875rem', textDecoration:'none' }}>
          <RefreshCcw size={14} /> New Practice Test
        </Link>
      </div>

      {/* Summary Stats */}
      {sessions.filter(s => s.status==='submitted').length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'14px', marginBottom:'24px' }}>
          <StatCard label='Sessions Completed' value={sessions.filter(s=>s.status==='submitted').length.toString()} color='#2563EB' />
          <StatCard label='Total Questions' value={totalQs.toLocaleString()} color='#8B5CF6' />
          <StatCard label='Total Correct' value={totalCorrect.toLocaleString()} color='#059669' />
          <StatCard label='Average Score' value={avgPct.toFixed(1)+'%'} color={avgPct>=70?'#059669':avgPct>=50?'#F59E0B':'#EF4444'} />
        </div>
      )}

      {/* Filter */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
        <button onClick={() => setMistakeFilter(false)}
          style={{ padding:'7px 14px', borderRadius:'7px', border:'1px solid '+(mistakeFilter?'#E2E8F0':'#2563EB'),
            backgroundColor: mistakeFilter?'#F8FAFC':'#EFF6FF', color: mistakeFilter?'#64748B':'#2563EB',
            fontWeight:600, fontSize:'0.8125rem', cursor:'pointer' }}>All Sessions</button>
        <button onClick={() => setMistakeFilter(true)}
          style={{ padding:'7px 14px', borderRadius:'7px', border:'1px solid '+(mistakeFilter?'#EF4444':'#E2E8F0'),
            backgroundColor: mistakeFilter?'#FEF2F2':'#F8FAFC', color: mistakeFilter?'#EF4444':'#64748B',
            fontWeight:600, fontSize:'0.8125rem', cursor:'pointer' }}>
          <XCircle size={12} style={{ marginRight:'4px', verticalAlign:'middle' }} />Sessions with Mistakes
        </button>
      </div>

      {displayed.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'#94A3B8' }}>
          <BookOpen size={40} strokeWidth={1} />
          <p style={{ marginTop:'12px' }}>{mistakeFilter ? 'No sessions with mistakes found.' : 'No practice sessions yet.'}</p>
          <Link href='/portal/practice' style={{ color:'#2563EB', fontWeight:600, textDecoration:'none', fontSize:'0.9rem' }}>
            Start your first practice test →
          </Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {displayed.map(sess => {
            const pct = sess.percentage;
            const color = pct>=70?'#059669':pct>=50?'#F59E0B':'#EF4444';
            const isSubmitted = sess.status === 'submitted';
            return (
              <div key={sess.id} style={{ backgroundColor:'#fff', borderRadius:'12px', border:'1px solid #E2E8F0',
                padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between',
                flexWrap:'wrap', gap:'12px' }}>
                <div style={{ flex:1, minWidth:'200px' }}>
                  <div style={{ fontWeight:700, fontSize:'0.95rem', color:'#0F172A', marginBottom:'4px' }}>{sess.title}</div>
                  <div style={{ fontSize:'0.75rem', color:'#94A3B8' }}>
                    {fmtDate(sess.created_at)} · {sess.question_count} questions
                    {sess.time_spent_seconds ? ' · ' + fmtTime(sess.time_spent_seconds) : ''}
                  </div>
                </div>
                {isSubmitted ? (
                  <div style={{ display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
                    <div style={{ display:'flex', gap:'14px', fontSize:'0.8125rem' }}>
                      <span style={{ color:'#059669', fontWeight:700 }}>✓ {sess.total_correct}</span>
                      <span style={{ color:'#EF4444', fontWeight:700 }}>✗ {sess.total_incorrect}</span>
                      <span style={{ color:'#94A3B8', fontWeight:600 }}>– {sess.total_unanswered}</span>
                    </div>
                    <div style={{ fontSize:'1.5rem', fontWeight:900, color, minWidth:'64px', textAlign:'center' }}>
                      {pct.toFixed(0)}%
                    </div>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <Link href={'/portal/practice/' + sess.id + '/results'}
                        style={{ padding:'7px 12px', borderRadius:'7px', border:'1px solid #E2E8F0',
                          backgroundColor:'#F8FAFC', color:'#475569', textDecoration:'none',
                          fontSize:'0.8125rem', fontWeight:600 }}>
                        Review
                      </Link>
                      <Link href={'/portal/practice/' + sess.id + '/results?tab=mistakes'}
                        style={{ padding:'7px 12px', borderRadius:'7px', border:'1px solid #FCA5A5',
                          backgroundColor:'#FEF2F2', color:'#EF4444', textDecoration:'none',
                          fontSize:'0.8125rem', fontWeight:600, display: sess.total_incorrect>0?'inline-flex':'none',
                          alignItems:'center', gap:'4px' }}>
                        <XCircle size={12} /> Mistakes ({sess.total_incorrect})
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <span style={{ fontSize:'0.8125rem', color:'#F59E0B', fontWeight:600 }}>In Progress</span>
                    <Link href={'/portal/practice/' + sess.id + '/take'}
                      style={{ padding:'7px 14px', borderRadius:'7px', border:'none',
                        backgroundColor:'#2563EB', color:'#fff', textDecoration:'none',
                        fontSize:'0.8125rem', fontWeight:700 }}>
                      Resume
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label:string; value:string; color:string }) {
  return (
    <div style={{ backgroundColor:'#fff', borderRadius:'12px', border:'1px solid #E2E8F0', padding:'16px 18px' }}>
      <div style={{ fontSize:'1.6rem', fontWeight:900, color, marginBottom:'4px' }}>{value}</div>
      <div style={{ fontSize:'0.8rem', color:'#64748B', fontWeight:600 }}>{label}</div>
    </div>
  );
}