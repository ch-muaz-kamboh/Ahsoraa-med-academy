'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { Flag, ChevronLeft, ChevronRight, Clock, Send, Loader2 } from 'lucide-react';
import importedQuestions from '@/lib/imported_questions.json';

interface QBQuestion {
  id: string; subject: string; topic: string; difficulty: string;
  question_text: string; question_image_url?: string;
  option_a: string; option_b: string; option_c: string; option_d: string; option_e: string;
  correct_option: string; explanation?: string;
}
interface SessionQ { question_id: string; order_index: number; }
interface Answer { selected_option: string | null; is_marked_review: boolean; time_spent_seconds: number; }

const OPTIONS = ['A','B','C','D','E'] as const;

export default function PracticeTakePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const supabase = createClient();

  const [questions, setQuestions]   = useState<QBQuestion[]>([]);
  const [answers, setAnswers]       = useState<Record<string, Answer>>({});
  const [current, setCurrent]       = useState(0);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [timeLeft, setTimeLeft]     = useState<number | null>(null);
  const [elapsed, setElapsed]       = useState(0);
  const [sessionTitle, setSessionTitle] = useState('Practice Test');
  const questionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    const load = async () => {
      const { data: session } = await supabase
        .from('practice_sessions').select('*').eq('id', sessionId).single();
      if (!session) { router.push('/portal/practice'); return; }
      if (session.status === 'submitted') { router.push('/portal/practice/' + sessionId + '/results'); return; }
      setSessionTitle(session.title);
      if (session.time_limit_minutes > 0) setTimeLeft(session.time_limit_minutes * 60);
      let loadedQuestions: QBQuestion[] = [];

      // FIRST: check if this session was created from the local 820 pool (no DB link exists)
      try {
        const localSessionData = localStorage.getItem(`practice_session_local_${sessionId}`);
        if (localSessionData) {
          loadedQuestions = JSON.parse(localSessionData) as QBQuestion[];
        }
      } catch (e) {}

      // SECOND: try loading from Supabase if no local session data found
      if (loadedQuestions.length === 0) {
        const { data: sq } = await supabase
          .from('practice_session_questions')
          .select('question_id, order_index')
          .eq('session_id', sessionId).order('order_index');
        
        if (sq && sq.length > 0) {
          const ids = sq.map((r: SessionQ) => r.question_id);
          const { data: qs } = await supabase
            .from('qb_questions')
            .select('id,subject,topic,difficulty,question_text,question_image_url,option_a,option_b,option_c,option_d,option_e,correct_option,explanation')
            .in('id', ids);
          if (qs && qs.length > 0) {
            const qMap = Object.fromEntries(qs.map((q: QBQuestion) => [q.id, q]));
            loadedQuestions = sq.map((s: SessionQ) => qMap[s.question_id]).filter(Boolean);
          }
          // Fallback: match by local qb-xxx IDs from localStorage / bundled JSON
          if (loadedQuestions.length === 0) {
            const localPool: any[] = (() => {
              try {
                const c = localStorage.getItem('ahsora_local_qb_questions');
                return c ? JSON.parse(c) : (importedQuestions as any[]);
              } catch { return importedQuestions as any[]; }
            })();
            const qMap = Object.fromEntries(localPool.map((q: any) => [q.id, q]));
            loadedQuestions = ids.map(id => qMap[id]).filter(Boolean);
          }
        }
      }

      // Final safety fallback: random questions from bundled 820 pool
      if (loadedQuestions.length === 0) {
        const localPool: any[] = (() => {
          try {
            const c = localStorage.getItem('ahsora_local_qb_questions');
            return c ? JSON.parse(c) : (importedQuestions as any[]);
          } catch { return importedQuestions as any[]; }
        })();
        const count = session.question_count || 20;
        const shuffled = [...localPool].sort(() => Math.random() - 0.5);
        loadedQuestions = shuffled.slice(0, count);
      }

      setQuestions(loadedQuestions);

      const { data: existingAnswers } = await supabase
        .from('practice_answers').select('question_id, selected_option, is_marked_review').eq('session_id', sessionId);
      if (existingAnswers) {
        const map: Record<string,Answer> = {};
        existingAnswers.forEach((a: {question_id:string; selected_option:string|null; is_marked_review:boolean}) => {
          map[a.question_id] = { selected_option: a.selected_option, is_marked_review: a.is_marked_review, time_spent_seconds: 0 };
        });
        setAnswers(map);
      }
      setLoading(false);
    };
    load();
  }, [sessionId, router, supabase]);

  useEffect(() => {
    if (submitted || loading) return;
    const interval = setInterval(() => {
      setElapsed(e => e + 1);
      if (timeLeft !== null) {
        setTimeLeft(t => {
          if (t === null) return null;
          if (t <= 1) { handleSubmit(true); return 0; }
          return t - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, loading, timeLeft]);

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
  };

  const currentQ = questions[current];

  const selectOption = async (opt: string) => {
    if (submitted || !currentQ) return;
    const qId = currentQ.id;
    const prev = answers[qId];
    const timeSec = Math.floor((Date.now() - questionStartRef.current) / 1000);
    const newAnswer: Answer = {
      selected_option: prev?.selected_option === opt ? null : opt,
      is_marked_review: prev?.is_marked_review || false,
      time_spent_seconds: timeSec,
    };
    setAnswers(a => ({ ...a, [qId]: newAnswer }));
    await supabase.from('practice_answers').upsert({
      session_id: sessionId, question_id: qId,
      selected_option: newAnswer.selected_option,
      is_marked_review: newAnswer.is_marked_review,
      time_spent_seconds: timeSec,
    }, { onConflict: 'session_id,question_id' });
  };

  const toggleReview = async () => {
    if (!currentQ) return;
    const qId = currentQ.id;
    const prev = answers[qId] || { selected_option: null, is_marked_review: false, time_spent_seconds: 0 };
    const updated = { ...prev, is_marked_review: !prev.is_marked_review };
    setAnswers(a => ({ ...a, [qId]: updated }));
    await supabase.from('practice_answers').upsert({
      session_id: sessionId, question_id: qId,
      selected_option: updated.selected_option, is_marked_review: updated.is_marked_review,
    }, { onConflict: 'session_id,question_id' });
  };

  const goTo = (idx: number) => {
    questionStartRef.current = Date.now();
    setCurrent(Math.max(0, Math.min(questions.length - 1, idx)));
  };

  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting || submitted) return;
    if (!auto && !confirm('Submit this practice test?')) return;
    setSubmitting(true);
    let correct = 0, incorrect = 0, unanswered = 0;
    const updates = questions.map(q => {
      const ans = answers[q.id];
      const sel = ans?.selected_option || null;
      const isCorrect = sel ? sel === q.correct_option : null;
      if (!sel) unanswered++; else if (isCorrect) correct++; else incorrect++;
      return { session_id: sessionId, question_id: q.id, selected_option: sel, is_correct: isCorrect,
        is_marked_review: ans?.is_marked_review || false, time_spent_seconds: ans?.time_spent_seconds || 0,
        answered_at: new Date().toISOString() };
    });
    await supabase.from('practice_answers').upsert(updates, { onConflict: 'session_id,question_id' });
    const total = questions.length;
    const percentage = total > 0 ? (correct / total) * 100 : 0;
    const accuracy = (correct + incorrect) > 0 ? (correct / (correct + incorrect)) * 100 : 0;
    await supabase.from('practice_sessions').update({
      status: 'submitted', submitted_at: new Date().toISOString(), time_spent_seconds: elapsed,
      total_correct: correct, total_incorrect: incorrect, total_unanswered: unanswered,
      percentage: parseFloat(percentage.toFixed(2)), accuracy_rate: parseFloat(accuracy.toFixed(2)),
    }).eq('id', sessionId);
    setSubmitted(true);
    router.push('/portal/practice/' + sessionId + '/results');
  }, [submitting, submitted, questions, answers, sessionId, elapsed, router, supabase]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'12px', color:'#64748B' }}>
      <Loader2 size={24} style={{ animation:'spin 1s linear infinite' }} /> Loading practice test…
    </div>
  );
  if (!currentQ) return <div style={{ padding:'32px', color:'#EF4444' }}>No questions found.</div>;

  const answered = answers[currentQ.id]?.selected_option;
  const isReview = answers[currentQ.id]?.is_marked_review;
  const answeredCount = Object.values(answers).filter(a => a.selected_option).length;
  const reviewCount   = Object.values(answers).filter(a => a.is_marked_review).length;
  const DIFF_COLOR: Record<string,string> = { easy:'#10B981', medium:'#F59E0B', hard:'#EF4444' };
  const DIFF_BG: Record<string,string>    = { easy:'#F0FFF4', medium:'#FFFBEB', hard:'#FEF2F2' };

  return (
    <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        backgroundColor:'#fff', borderRadius:'12px', border:'1px solid #E2E8F0',
        padding:'14px 20px', marginBottom:'20px', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <div style={{ fontWeight:700, fontSize:'1rem', color:'#0F172A' }}>{sessionTitle}</div>
          <div style={{ fontSize:'0.8125rem', color:'#64748B' }}>
            {answeredCount}/{questions.length} answered{reviewCount > 0 ? ' · ' + reviewCount + ' flagged' : ''}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          {timeLeft !== null ? (
            <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px',
              borderRadius:'8px', backgroundColor: timeLeft < 300 ? '#FEF2F2' : '#F0FFF4',
              border: '1px solid ' + (timeLeft < 300 ? '#FCA5A5' : '#A7F3D0') }}>
              <Clock size={15} color={timeLeft < 300 ? '#EF4444' : '#059669'} />
              <span style={{ fontWeight:800, fontSize:'1.1rem', fontFamily:'monospace',
                color: timeLeft < 300 ? '#EF4444' : '#059669' }}>{fmtTime(timeLeft)}</span>
            </div>
          ) : (
            <span style={{ fontSize:'0.8125rem', color:'#94A3B8' }}>Elapsed: {fmtTime(elapsed)}</span>
          )}
          <button onClick={() => handleSubmit(false)} disabled={submitting}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px',
              borderRadius:'8px', border:'none', backgroundColor:'#2563EB', color:'#fff',
              fontWeight:700, fontSize:'0.875rem', cursor:'pointer' }}>
            {submitting ? <Loader2 size={14} style={{ animation:'spin 1s linear infinite' }} /> : <Send size={14} />}
            Submit
          </button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 240px', gap:'20px', alignItems:'start' }}>
        <div style={{ backgroundColor:'#fff', borderRadius:'16px', border:'1px solid #E2E8F0', padding:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px' }}>
            <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
              <span style={{ fontSize:'0.8rem', fontWeight:700, color:'#64748B' }}>Q{current+1}/{questions.length}</span>
              <span style={{ padding:'2px 8px', borderRadius:'6px', fontSize:'0.75rem', fontWeight:700,
                backgroundColor: DIFF_BG[currentQ.difficulty]||'#F8FAFC', color: DIFF_COLOR[currentQ.difficulty]||'#64748B' }}>
                {currentQ.difficulty}
              </span>
              <span style={{ fontSize:'0.75rem', color:'#94A3B8' }}>{currentQ.subject}{currentQ.topic ? ' · ' + currentQ.topic : ''}</span>
            </div>
            <button onClick={toggleReview}
              style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 10px',
                borderRadius:'7px', border: '1px solid ' + (isReview?'#F59E0B':'#E2E8F0'),
                backgroundColor: isReview?'#FFFBEB':'#F8FAFC',
                color: isReview?'#D97706':'#64748B', cursor:'pointer', fontSize:'0.8125rem', fontWeight:600 }}>
              <Flag size={13} /> {isReview ? 'Flagged' : 'Flag'}
            </button>
          </div>
          <p style={{ fontSize:'1rem', fontWeight:600, color:'#0F172A', lineHeight:1.7, marginBottom:'24px' }}>
            {currentQ.question_text}
          </p>
          {currentQ.question_image_url && (
            <img src={currentQ.question_image_url} alt='Q figure' style={{ maxWidth:'100%', borderRadius:'8px', marginBottom:'20px' }} />
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {OPTIONS.map(opt => {
              const key = ('option_' + opt.toLowerCase()) as 'option_a'|'option_b'|'option_c'|'option_d'|'option_e';
              const val = currentQ[key];
              const isSelected = answered === opt;
              return (
                <button key={opt} onClick={() => selectOption(opt)}
                  style={{ display:'flex', alignItems:'flex-start', gap:'12px', padding:'14px 16px',
                    borderRadius:'10px', border: '2px solid ' + (isSelected?'#2563EB':'#E2E8F0'),
                    backgroundColor: isSelected?'#EFF6FF':'#FAFAFA', cursor:'pointer', textAlign:'left' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
                    width:26, height:26, borderRadius:'50%', flexShrink:0,
                    backgroundColor: isSelected?'#2563EB':'#E2E8F0',
                    color: isSelected?'#fff':'#475569', fontWeight:800, fontSize:'0.8rem' }}>{opt}</span>
                  <span style={{ fontSize:'0.9rem', color:'#0F172A', lineHeight:1.6 }}>{val}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'24px' }}>
            <button onClick={() => goTo(current-1)} disabled={current===0}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px',
                borderRadius:'8px', border:'1px solid #E2E8F0', background:'#F8FAFC',
                cursor:current===0?'not-allowed':'pointer', opacity:current===0?0.4:1,
                fontWeight:600, fontSize:'0.875rem', color:'#475569' }}>
              <ChevronLeft size={16} /> Previous
            </button>
            <button onClick={() => goTo(current+1)} disabled={current===questions.length-1}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px',
                borderRadius:'8px', border:'none', backgroundColor:'#2563EB', color:'#fff',
                cursor:current===questions.length-1?'not-allowed':'pointer',
                opacity:current===questions.length-1?0.4:1, fontWeight:600, fontSize:'0.875rem' }}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div style={{ backgroundColor:'#fff', borderRadius:'16px', border:'1px solid #E2E8F0', padding:'18px', position:'sticky', top:'80px' }}>
          <div style={{ fontSize:'0.8125rem', fontWeight:700, color:'#334155', marginBottom:'12px' }}>Navigator</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'5px' }}>
            {questions.map((q, i) => {
              const a = answers[q.id];
              const isAns = !!a?.selected_option;
              const isRev = a?.is_marked_review;
              const isCur = i === current;
              return (
                <button key={q.id} onClick={() => goTo(i)}
                  style={{ aspectRatio:'1', borderRadius:'6px',
                    border: '2px solid ' + (isCur?'#2563EB':isRev?'#F59E0B':isAns?'#10B981':'#E2E8F0'),
                    backgroundColor: isCur?'#2563EB':isRev?'#FFFBEB':isAns?'#F0FFF4':'#F8FAFC',
                    color: isCur?'#fff':isRev?'#D97706':isAns?'#059669':'#64748B',
                    fontWeight:700, fontSize:'0.7rem', cursor:'pointer' }}>
                  {i+1}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop:'12px', fontSize:'0.7rem', color:'#94A3B8', display:'flex', flexDirection:'column', gap:'3px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
              <div style={{ width:10, height:10, borderRadius:'2px', backgroundColor:'#F0FFF4', border:'1px solid #10B981' }} /> Answered
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
              <div style={{ width:10, height:10, borderRadius:'2px', backgroundColor:'#FFFBEB', border:'1px solid #F59E0B' }} /> Flagged
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
              <div style={{ width:10, height:10, borderRadius:'2px', backgroundColor:'#F8FAFC', border:'1px solid #E2E8F0' }} /> Unanswered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}