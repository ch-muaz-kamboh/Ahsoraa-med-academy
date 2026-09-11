'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Beaker, Calculator, Brain, FlaskConical, Globe, Sigma,
  ChevronRight, Loader2, Shuffle, Clock, BookOpen, BarChart3
} from 'lucide-react';
import importedQuestions from '@/lib/imported_questions.json';

const SUBJECTS = [
  { name:'Biology',          icon:<Beaker size={20}/>,     color:'#10B981', bg:'#F0FFF4' },
  { name:'Chemistry',        icon:<FlaskConical size={20}/>,color:'#F59E0B', bg:'#FFFBEB' },
  { name:'Physics',          icon:<Sigma size={20}/>,       color:'#8B5CF6', bg:'#F5F3FF' },
  { name:'Mathematics',      icon:<Calculator size={20}/>,  color:'#3B82F6', bg:'#EFF6FF' },
  { name:'Logical Reasoning',icon:<Brain size={20}/>,       color:'#EC4899', bg:'#FDF2F8' },
  { name:'General Knowledge',icon:<Globe size={20}/>,       color:'#F97316', bg:'#FFF7ED' },
];

interface SubjectCount { subject: string; count: number; }

export default function PracticePage() {
  const router = useRouter();
  const supabase = createClient();

  const [subjectCounts, setSubjectCounts] = useState<SubjectCount[]>([]);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [subject, setSubject]     = useState('');
  const [topic, setTopic]         = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQCount]= useState(20);
  const [timeLimit, setTimeLimit] = useState(30);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data } = await supabase
          .from('qb_questions')
          .select('subject')
          .eq('is_active', true);
        if (data && data.length > 0) {
          const counts: Record<string,number> = {};
          data.forEach(r => { counts[r.subject] = (counts[r.subject]||0)+1; });
          setSubjectCounts(Object.entries(counts).map(([subject,count]) => ({ subject, count })));
          setLoadingCounts(false);
          return;
        }
      } catch (e) {}

      // Fallback to local imported questions bank (820 MCQs)
      const counts: Record<string, number> = {};
      (importedQuestions as any[]).forEach(q => {
        counts[q.subject] = (counts[q.subject] || 0) + 1;
      });
      setSubjectCounts(Object.entries(counts).map(([subject, count]) => ({ subject, count })));
      setLoadingCounts(false);
    };
    fetchCounts();
  }, [supabase]);

  useEffect(() => {
    if (!subject) { setAvailableTopics([]); return; }
    const fetchTopics = async () => {
      try {
        const { data } = await supabase
          .from('qb_questions')
          .select('topic')
          .eq('subject', subject)
          .eq('is_active', true);
        if (data && data.length > 0) {
          const unique = [...new Set(data.map(r => r.topic).filter(Boolean))].sort();
          setAvailableTopics(unique as string[]);
          return;
        }
      } catch (e) {}

      const filtered = (importedQuestions as any[]).filter(q => q.subject === subject);
      const unique = [...new Set(filtered.map(q => q.topic).filter(Boolean))].sort();
      setAvailableTopics(unique as string[]);
    };
    fetchTopics();
  }, [subject, supabase]);

  const totalAvailable = subjectCounts.reduce((s,r) => s+r.count, 0);

  const handleCreate = async () => {
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Please log in first.'); setCreating(false); return; }

    // Build session title
    const parts = [];
    if (subject) parts.push(subject); else parts.push('All Subjects');
    if (topic)   parts.push(topic);
    if (difficulty) parts.push(difficulty.charAt(0).toUpperCase()+difficulty.slice(1));
    parts.push(`${questionCount} Qs`);
    const title = parts.join(' — ');

    // Create session
    const { data: session, error: sErr } = await supabase
      .from('practice_sessions')
      .insert({
        student_id: user.id, title,
        subject_filter: subject || null,
        topic_filter: topic || null,
        difficulty_filter: difficulty || null,
        question_count: questionCount,
        time_limit_minutes: timeLimit,
        status: 'pending',
      })
      .select()
      .single();

    if (sErr || !session) { alert('Failed to create session: '+(sErr?.message||'Unknown')); setCreating(false); return; }

    // Draw random questions server-side
    const { data: qids, error: qErr } = await supabase.rpc('get_random_question_ids', {
      p_count: questionCount,
      p_subject: subject || null,
      p_topic: topic || null,
      p_difficulty: difficulty || null,
    });

    if (qErr || !qids || qids.length === 0) {
      await supabase.from('practice_sessions').delete().eq('id', session.id);
      alert('Not enough questions match your filters. Try wider criteria.');
      setCreating(false); return;
    }

    // Link questions to session
    const linkRows = qids.map((r: {question_id:string}, i: number) => ({
      session_id: session.id, question_id: r.question_id, order_index: i,
    }));
    await supabase.from('practice_session_questions').insert(linkRows);

    // Update session status
    await supabase.from('practice_sessions').update({ status:'in_progress', started_at: new Date().toISOString() }).eq('id', session.id);

    router.push(`/portal/practice/${session.id}/take`);
  };

  return (
    <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
          <BookOpen size={28} color="#2563EB" />
          <h1 style={{ fontSize:'1.875rem', fontWeight:800, color:'#0F172A' }}>Question Bank & Practice</h1>
        </div>
        <p style={{ color:'#64748B', fontSize:'0.9375rem' }}>
          Generate a custom practice test from {totalAvailable.toLocaleString()} questions. Filter by subject, topic, and difficulty.
        </p>
        <div style={{ display:'flex', gap:'12px', marginTop:'12px', flexWrap:'wrap' }}>
          <Link href="/portal/practice/history"
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'7px 14px',
              borderRadius:'8px', border:'1px solid #E2E8F0', backgroundColor:'#F8FAFC',
              color:'#475569', textDecoration:'none', fontSize:'0.875rem', fontWeight:600 }}>
            <BarChart3 size={14} /> My Practice History
          </Link>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'28px', alignItems:'start' }}>
        {/* Subject cards */}
        <div>
          <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#334155', marginBottom:'14px' }}>Browse by Subject</h2>
          {loadingCounts ? (
            <div style={{ display:'flex', gap:'10px', color:'#64748B', alignItems:'center' }}>
              <Loader2 size={18} style={{ animation:'spin 1s linear infinite' }} /> Loading…
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'12px' }}>
              {SUBJECTS.map(s => {
                const cnt = subjectCounts.find(c => c.subject===s.name)?.count || 0;
                const active = subject === s.name;
                return (
                  <button key={s.name}
                    onClick={() => { setSubject(active ? '' : s.name); setTopic(''); }}
                    style={{ textAlign:'left', padding:'16px', borderRadius:'12px',
                      border: `2px solid ${active ? s.color : '#E2E8F0'}`,
                      backgroundColor: active ? s.bg : '#fff',
                      cursor:'pointer', transition:'all 0.15s ease' }}>
                    <div style={{ color:s.color, marginBottom:'8px' }}>{s.icon}</div>
                    <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#0F172A' }}>{s.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'#94A3B8', marginTop:'3px' }}>{cnt.toLocaleString()} questions</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Config Panel */}
        <div style={{ backgroundColor:'#fff', borderRadius:'16px', border:'1px solid #E2E8F0', padding:'24px', position:'sticky', top:'80px' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#334155', marginBottom:'18px' }}>
            <Shuffle size={16} style={{ verticalAlign:'middle', marginRight:'6px', color:'#2563EB' }} />
            Build Your Test
          </h2>

          {/* Subject */}
          <div style={{ marginBottom:'14px' }}>
            <label style={LS}>Subject</label>
            <select value={subject} onChange={e => { setSubject(e.target.value); setTopic(''); }} style={SS}>
              <option value="">All Subjects (Mixed)</option>
              {SUBJECTS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          {/* Topic */}
          {availableTopics.length > 0 && (
            <div style={{ marginBottom:'14px' }}>
              <label style={LS}>Topic (optional)</label>
              <select value={topic} onChange={e => setTopic(e.target.value)} style={SS}>
                <option value="">All Topics</option>
                {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          {/* Difficulty */}
          <div style={{ marginBottom:'14px' }}>
            <label style={LS}>Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={SS}>
              <option value="">Mixed (All Levels)</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Question Count */}
          <div style={{ marginBottom:'14px' }}>
            <label style={LS}>Number of Questions: <strong>{questionCount}</strong></label>
            <input type="range" min={5} max={100} step={5} value={questionCount}
              onChange={e => setQCount(Number(e.target.value))}
              style={{ width:'100%', accentColor:'#2563EB' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#94A3B8' }}>
              <span>5</span><span>100</span>
            </div>
          </div>

          {/* Time Limit */}
          <div style={{ marginBottom:'20px' }}>
            <label style={LS}>
              <Clock size={12} style={{ verticalAlign:'middle', marginRight:'4px' }} />
              Time Limit: <strong>{timeLimit === 0 ? 'Untimed' : `${timeLimit} min`}</strong>
            </label>
            <input type="range" min={0} max={180} step={5} value={timeLimit}
              onChange={e => setTimeLimit(Number(e.target.value))}
              style={{ width:'100%', accentColor:'#2563EB' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#94A3B8' }}>
              <span>Untimed</span><span>180 min</span>
            </div>
          </div>

          <button onClick={handleCreate} disabled={creating}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center',
              gap:'8px', padding:'13px', borderRadius:'10px', border:'none',
              backgroundColor:'#2563EB', color:'#fff', fontWeight:700, fontSize:'0.9375rem',
              cursor: creating?'not-allowed':'pointer', opacity: creating?0.7:1 }}>
            {creating
              ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} /> Creating…</>
              : <><Shuffle size={16} /> Start Practice Test</>}
          </button>
          <p style={{ textAlign:'center', fontSize:'0.75rem', color:'#94A3B8', marginTop:'10px' }}>
            Questions are randomly selected from the question bank
          </p>
        </div>
      </div>
    </div>
  );
}

const LS: React.CSSProperties = {
  display:'block', fontSize:'0.8125rem', fontWeight:600, color:'#334155', marginBottom:'5px',
};
const SS: React.CSSProperties = {
  width:'100%', padding:'9px 12px', borderRadius:'8px', border:'1px solid #CBD5E1',
  fontSize:'0.875rem', backgroundColor:'#fff', outline:'none',
};
