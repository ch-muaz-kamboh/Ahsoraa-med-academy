'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Minus, ArrowLeft, RotateCcw, TrendingUp, Clock, Target, Loader2 } from 'lucide-react';

interface QBQuestion {
  id: string; subject: string; topic: string; difficulty: string;
  question_text: string; option_a: string; option_b: string; option_c: string; option_d: string; option_e: string;
  correct_option: string; explanation?: string;
}
interface Session {
  id: string; title: string; total_correct: number; total_incorrect: number; total_unanswered: number;
  percentage: number; accuracy_rate: number; time_spent_seconds: number; question_count: number;
}
interface PracticeAnswer {
  question_id: string; selected_option: string | null; is_correct: boolean | null; is_marked_review: boolean;
}

const OPTS = ['A','B','C','D','E'] as const;
const DIFF_COLOR: Record<string,string> = { easy:'#10B981', medium:'#F59E0B', hard:'#EF4444' };
const DIFF_BG: Record<string,string>    = { easy:'#F0FFF4', medium:'#FFFBEB', hard:'#FEF2F2' };

export default function PracticeResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const supabase = createClient();

  const [session, setSession]       = useState<Session | null>(null);
  const [questions, setQuestions]   = useState<QBQuestion[]>([]);
  const [answers, setAnswers]       = useState<Record<string,PracticeAnswer>>({});
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState<'overview'|'review'|'mistakes'>('overview');
  const [expandedQ, setExpandedQ]   = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: sess } = await supabase
        .from('practice_sessions').select('*').eq('id', sessionId).single();
      if (!sess) { router.push('/portal/practice'); return; }
      if (sess.status !== 'submitted') { router.push('/portal/practice/' + sessionId + '/take'); return; }
      setSession(sess);

      const { data: sq } = await supabase
        .from('practice_session_questions').select('question_id, order_index').eq('session_id', sessionId).order('order_index');
      if (!sq) { setLoading(false); return; }

      const ids = sq.map((r: {question_id:string}) => r.question_id);
      const { data: qs } = await supabase
        .from('qb_questions')
        .select('id,subject,topic,difficulty,question_text,option_a,option_b,option_c,option_d,option_e,correct_option,explanation')
        .in('id', ids);
      if (qs) {
        const qMap = Object.fromEntries(qs.map((q: QBQuestion) => [q.id, q]));
        setQuestions(sq.map((s: {question_id:string}) => qMap[s.question_id]).filter(Boolean));
      }

      const { data: ans } = await supabase
        .from('practice_answers').select('*').eq('session_id', sessionId);
      if (ans) {
        const map: Record<string,PracticeAnswer> = {};
        ans.forEach((a: PracticeAnswer) => { map[a.question_id] = a; });
        setAnswers(map);
      }
      setLoading(false);
    };
    load();
  }, [sessionId, router, supabase]);

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return m + 'm ' + sec + 's';
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'12px', color:'#64748B' }}>
      <Loader2 size={24} style={{ animation:'spin 1s linear infinite' }} /> Loading results…
    </div>
  );
  if (!session) return null;

  const total = session.question_count || questions.length;
  const pct = session.percentage;
  const color = pct >= 70 ? '#059669' : pct >= 50 ? '#F59E0B' : '#EF4444';
  const bg    = pct >= 70 ? '#F0FFF4' : pct >= 50 ? '#FFFBEB' : '#FEF2F2';

  const mistakeQs = questions.filter(q => {
    const a = answers[q.id];
    return a && a.selected_option && !a.is_correct;
  });

  const reviewQs = activeTab === 'review' ? questions : mistakeQs;

  return (
    <div style={{ maxWidth:'960px', margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
        <Link href='/portal/practice' style={{ display:'flex', alignItems:'center', gap:'6px',
          color:'#64748B', textDecoration:'none', fontSize:'0.875rem', fontWeight:600 }}>
          <ArrowLeft size={15} /> Practice
        </Link>
        <span style={{ color:'#CBD5E1' }}>/</span>
        <span style={{ fontSize:'0.875rem', color:'#475569' }}>Results</span>
      </div>

      {/* Score Hero */}
      <div style={{ backgroundColor:bg, border:'2px solid '+color, borderRadius:'20px', padding:'32px', marginBottom:'24px', textAlign:'center' }}>
        <div style={{ fontSize:'4rem', fontWeight:900, color, marginBottom:'4px', lineHeight:1 }}>
          {pct.toFixed(1)}%
        </div>
        <div style={{ fontSize:'1.1rem', color:'#0F172A', fontWeight:600, marginBottom:'16px' }}>{session.title}</div>
        <div style={{ display:'flex', justifyContent:'center', gap:'32px', flexWrap:'wrap' }}>
          <Stat icon={<CheckCircle size={18} color='#059669'/>} label='Correct' value={session.total_correct} color='#059669' />
          <Stat icon={<XCircle size={18} color='#EF4444'/>}    label='Incorrect' value={session.total_incorrect} color='#EF4444' />
          <Stat icon={<Minus size={18} color='#94A3B8'/>}      label='Unanswered' value={session.total_unanswered} color='#94A3B8' />
          <Stat icon={<Target size={18} color='#8B5CF6'/>}     label='Accuracy' value={session.accuracy_rate.toFixed(1)+'%'} color='#8B5CF6' />
          <Stat icon={<Clock size={18} color='#2563EB'/>}      label='Time' value={fmtTime(session.time_spent_seconds||0)} color='#2563EB' />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'4px', backgroundColor:'#F8FAFC', borderRadius:'10px', padding:'4px', marginBottom:'20px', width:'fit-content' }}>
        {(['overview','review','mistakes'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding:'8px 16px', borderRadius:'7px', border:'none',
              backgroundColor: activeTab===tab?'#fff':'transparent',
              color: activeTab===tab?'#0F172A':'#64748B',
              fontWeight: activeTab===tab?700:500, fontSize:'0.875rem', cursor:'pointer',
              boxShadow: activeTab===tab?'0 1px 3px rgba(0,0,0,0.1)':'none' }}>
            {tab==='overview' ? 'Overview' : tab==='review' ? 'Full Review' : 'My Mistakes ('+mistakeQs.length+')'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          {/* Subject breakdown */}
          <div style={{ backgroundColor:'#fff', borderRadius:'14px', border:'1px solid #E2E8F0', padding:'24px' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:700, color:'#0F172A', marginBottom:'16px' }}>Performance by Subject</h3>
            {(() => {
              const bySubject: Record<string,{correct:number;total:number}> = {};
              questions.forEach(q => {
                if (!bySubject[q.subject]) bySubject[q.subject] = { correct:0, total:0 };
                bySubject[q.subject].total++;
                const a = answers[q.id];
                if (a?.is_correct) bySubject[q.subject].correct++;
              });
              return Object.entries(bySubject).map(([subj, d]) => {
                const pct2 = d.total > 0 ? (d.correct/d.total)*100 : 0;
                return (
                  <div key={subj} style={{ marginBottom:'12px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px', fontSize:'0.875rem' }}>
                      <span style={{ fontWeight:600, color:'#334155' }}>{subj}</span>
                      <span style={{ color:'#64748B' }}>{d.correct}/{d.total} ({pct2.toFixed(0)}%)</span>
                    </div>
                    <div style={{ height:'8px', backgroundColor:'#F1F5F9', borderRadius:'4px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:pct2+'%', borderRadius:'4px',
                        backgroundColor: pct2>=70?'#059669':pct2>=50?'#F59E0B':'#EF4444',
                        transition:'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
          <div style={{ display:'flex', gap:'12px', marginTop:'16px', flexWrap:'wrap' }}>
            <Link href='/portal/practice'
              style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 20px',
                borderRadius:'9px', border:'none', backgroundColor:'#2563EB', color:'#fff',
                fontWeight:700, fontSize:'0.875rem', textDecoration:'none' }}>
              <RotateCcw size={15} /> New Practice Test
            </Link>
            <Link href='/portal/practice/history'
              style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 20px',
                borderRadius:'9px', border:'1px solid #E2E8F0', backgroundColor:'#F8FAFC',
                color:'#475569', fontWeight:600, fontSize:'0.875rem', textDecoration:'none' }}>
              <TrendingUp size={15} /> View All History
            </Link>
          </div>
        </div>
      )}

      {(activeTab === 'review' || activeTab === 'mistakes') && (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {reviewQs.length === 0 && activeTab === 'mistakes' && (
            <div style={{ textAlign:'center', padding:'40px', color:'#10B981', fontSize:'1rem', fontWeight:600 }}>
              No mistakes! Perfect score on this set. ✅
            </div>
          )}
          {reviewQs.map((q, i) => {
            const a = answers[q.id];
            const sel = a?.selected_option;
            const isExpanded = expandedQ === q.id;
            const isCorrect = a?.is_correct;
            return (
              <div key={q.id} style={{ backgroundColor:'#fff', borderRadius:'12px',
                border: '1px solid ' + (isCorrect?'#A7F3D0':sel?'#FCA5A5':'#E2E8F0'), overflow:'hidden' }}>
                <button onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                  style={{ width:'100%', padding:'16px 20px', textAlign:'left', border:'none', background:'none', cursor:'pointer',
                    display:'flex', alignItems:'center', gap:'12px' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
                    width:28, height:28, borderRadius:'50%', flexShrink:0,
                    backgroundColor: isCorrect?'#F0FFF4':sel?'#FEF2F2':'#F8FAFC',
                    color: isCorrect?'#059669':sel?'#EF4444':'#94A3B8' }}>
                    {isCorrect ? <CheckCircle size={16}/> : sel ? <XCircle size={16}/> : <Minus size={16}/>}
                  </span>
                  <span style={{ fontWeight:600, fontSize:'0.9rem', color:'#0F172A', lineHeight:1.5, textAlign:'left' }}>
                    {activeTab==='review' ? 'Q'+(i+1)+'. ' : ''}{q.question_text}
                  </span>
                </button>
                {isExpanded && (
                  <div style={{ padding:'0 20px 20px 60px', borderTop:'1px solid #F1F5F9' }}>
                    <div style={{ display:'flex', gap:'8px', marginBottom:'12px', flexWrap:'wrap' }}>
                      <span style={{ padding:'2px 8px', borderRadius:'6px', fontSize:'0.75rem', fontWeight:700,
                        backgroundColor:DIFF_BG[q.difficulty]||'#F8FAFC', color:DIFF_COLOR[q.difficulty]||'#64748B' }}>
                        {q.difficulty}
                      </span>
                      <span style={{ fontSize:'0.75rem', color:'#94A3B8' }}>{q.subject}{q.topic?' · '+q.topic:''}</span>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'16px' }}>
                      {OPTS.map(opt => {
                        const key = ('option_' + opt.toLowerCase()) as 'option_a'|'option_b'|'option_c'|'option_d'|'option_e';
                        const val = q[key];
                        const isCorr = opt === q.correct_option;
                        const isSel  = opt === sel;
                        return (
                          <div key={opt} style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'10px 14px',
                            borderRadius:'8px', backgroundColor: isCorr?'#F0FFF4':isSel&&!isCorr?'#FEF2F2':'#F8FAFC',
                            border:'1px solid '+(isCorr?'#A7F3D0':isSel&&!isCorr?'#FCA5A5':'#E2E8F0') }}>
                            <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
                              width:22, height:22, borderRadius:'50%', flexShrink:0, fontSize:'0.7rem', fontWeight:800,
                              backgroundColor: isCorr?'#059669':isSel&&!isCorr?'#EF4444':'#E2E8F0',
                              color: isCorr||isSel?'#fff':'#64748B' }}>{opt}</span>
                            <span style={{ fontSize:'0.875rem', color:'#0F172A' }}>{val}</span>
                            {isCorr && <span style={{ marginLeft:'auto', fontSize:'0.75rem', color:'#059669', fontWeight:700 }}>✓ Correct</span>}
                            {isSel && !isCorr && <span style={{ marginLeft:'auto', fontSize:'0.75rem', color:'#EF4444', fontWeight:700 }}>✗ Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div style={{ backgroundColor:'#EFF6FF', borderRadius:'8px', padding:'12px 14px',
                        fontSize:'0.875rem', color:'#1D4ED8', lineHeight:1.6 }}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
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

function Stat({ icon, label, value, color }: { icon:React.ReactNode; label:string; value:string|number; color:string }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', marginBottom:'2px' }}>
        {icon}
        <span style={{ fontSize:'0.75rem', color:'#64748B', fontWeight:600 }}>{label}</span>
      </div>
      <div style={{ fontSize:'1.3rem', fontWeight:800, color }}>{value}</div>
    </div>
  );
}