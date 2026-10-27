'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Beaker, Calculator, Brain, FlaskConical, Globe, Sigma,
  ChevronRight, Loader2, Shuffle, Clock, BookOpen, BarChart3
} from 'lucide-react';
import importedQuestions, { getImportedQuestions } from '@/lib/imported_questions';

const getPool = (): any[] => {
  let basePool = getImportedQuestions();
  if (!basePool || basePool.length === 0) basePool = importedQuestions as any[];

  try {
    const staffQsStr = typeof window !== 'undefined' ? localStorage.getItem('ahsora_local_staff_questions') : null;
    if (staffQsStr) {
      const staffQs = JSON.parse(staffQsStr);
      const publishedStaff = staffQs
        .filter((q: any) => q.status === 'published')
        .map((q: any) => ({
          id: q.id,
          subject: q.subject,
          chapter: q.chapter || '',
          topic: q.topic || '',
          difficulty: q.difficulty,
          question_text: q.questionText,
          option_a: q.options?.find((o: any) => o.key === 'A')?.text || '',
          option_b: q.options?.find((o: any) => o.key === 'B')?.text || '',
          option_c: q.options?.find((o: any) => o.key === 'C')?.text || '',
          option_d: q.options?.find((o: any) => o.key === 'D')?.text || '',
          option_e: q.options?.find((o: any) => o.key === 'E')?.text || '',
          correct_option: q.correctOption,
          explanation: q.explanation || '',
          source_reference: `Staff: ${q.authorName || q.authorEmail || 'Faculty'}`,
          is_active: true,
          created_at: q.createdAt,
        }));

      // Combine published staff MCQs with base pool
      const existingIds = new Set(basePool.map((b: any) => b.id));
      const newStaffQs = publishedStaff.filter((s: any) => !existingIds.has(s.id));
      return [...newStaffQs, ...basePool];
    }
  } catch (e) {}

  return basePool;
};

const SUBJECTS = [
  { name:'Biology',          icon:<Beaker size={20}/>,     color:'#10B981', bg:'#F0FFF4' },
  { name:'Chemistry',        icon:<FlaskConical size={20}/>,color:'#F59E0B', bg:'#FFFBEB' },
  { name:'Physics',          icon:<Sigma size={20}/>,       color:'#8B5CF6', bg:'#F5F3FF' },
  { name:'Mathematics',      icon:<Calculator size={20}/>,  color:'#10B981', bg:'#F0FFF4' },
  { name:'Logical Reasoning',icon:<Brain size={20}/>,       color:'#EC4899', bg:'#FDF2F8' },
  { name:'Reading & Acquired Knowledge',icon:<Globe size={20}/>,       color:'#F97316', bg:'#FFF7ED' },
];

function normalizeSubject(raw: string = ''): string {
  const s = raw.toLowerCase().trim();
  if (s.includes('chem')) return 'Chemistry';
  if (s.includes('bio') || s.includes('anat') || s.includes('physio') || s.includes('cell') || s.includes('gene')) return 'Biology';
  if (s.includes('physic')) return 'Physics';
  if (s.includes('math')) return 'Mathematics';
  if (s.includes('logic') || s.includes('reason') || s.includes('critical')) return 'Logical Reasoning';
  if (s.includes('read') || s.includes('knowledge') || s.includes('general') || s.includes('culture')) return 'Reading & Acquired Knowledge';
  const match = SUBJECTS.find(sub => sub.name.toLowerCase() === s);
  return match ? match.name : (raw.charAt(0).toUpperCase() + raw.slice(1));
}

const BIOLOGY_STRUCTURE: Record<string, string[]> = {
  'Genetics, Heredity & Molecular Biology': [
    'DNA, Chromosomes & Genome Organisation',
    'DNA Replication, Genetic Code & Protein Synthesis',
    'Mendelian Genetics & Probability',
    'Classical & Human Genetics',
    'Cell Cycle, Mitosis & Meiosis',
    'Reproduction & Life Cycles',
  ],
  'Biochemistry, Biological Molecules & Bioenergetics': [
    'Water, Weak Interactions & Chemical Basis of Life',
    'Carbohydrates, Lipids, Proteins & Nucleic Acids',
    'Enzymes',
    'ATP, Cellular Respiration & Fermentation',
    'Photosynthesis',
  ],
  'Cell Biology': [
    'Cell Theory, Cell Types & Cell Size',
    'Organelles & Cellular Structures',
    'Cell Membrane & Transport',
    'Viruses',
  ],
  'Human Anatomy, Physiology & Homeostasis': [
    'Animal Tissues & Homeostasis',
    'Digestive System & Nutrition',
    'Respiratory System & Gas Exchange',
    'Circulatory System',
    'Excretion, Kidney & Osmoregulation',
    'Nervous & Endocrine Coordination',
    'Musculoskeletal System',
    'Human Reproduction',
    'Immunity',
  ],
  'Evolution, Variation & Biotechnology': [
    'Mutation, Variation & Selection',
    'Evolutionary Theory & Genetic Basis of Evolution',
    'Recombinant DNA & Biotechnology',
  ],
};
const BIOLOGY_TOPICS = Object.keys(BIOLOGY_STRUCTURE);

interface SubjectCount { subject: string; count: number; }

export default function PracticePage() {
  const router = useRouter();
  const supabase = createClient();

  const [subjectCounts, setSubjectCounts] = useState<SubjectCount[]>([]);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [subject, setSubject]     = useState('');
  const [chapter, setChapter]     = useState('');
  const [topic, setTopic]         = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQCount]= useState(20);
  const [timeLimit, setTimeLimit] = useState(30);
  const [availableChapters, setAvailableChapters] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);

  useEffect(() => {
    const fetchCounts = async () => {
      let allQuestions: { id?: string; subject: string; question_text?: string }[] = [];
      try {
        const { data } = await supabase
          .from('qb_questions')
          .select('id, subject, question_text')
          .eq('is_active', true);
        if (data && data.length > 0) {
          allQuestions.push(...data);
        }
      } catch (e) {}

      // Merge local storage approved questions (for instant availability before DB roundtrip)
      try {
        const local = localStorage.getItem('ahsora_local_qb_questions');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            parsed.forEach((q: any) => {
              if (q.subject && !allQuestions.some((existing: any) => existing.id === q.id || (existing.question_text && existing.question_text.trim() === (q.question_text || '').trim()))) {
                allQuestions.push(q);
              }
            });
          }
        }
      } catch (e) {}

      // Merge published staff questions
      try {
        const staff = localStorage.getItem('ahsora_staffQuestions');
        if (staff) {
          const parsed = JSON.parse(staff);
          if (Array.isArray(parsed)) {
            parsed.filter((q: any) => q.status === 'published').forEach((q: any) => {
              if (q.subject && !allQuestions.some((existing: any) => existing.id === q.id || (existing.question_text && existing.question_text.trim() === (q.question_text || '').trim()))) {
                allQuestions.push(q);
              }
            });
          }
        }
      } catch (e) {}

      // If docx bank was explicitly synced by admin, include pool
      const isDocxSynced = typeof window !== 'undefined' && localStorage.getItem('ahsora_qb_docx_synced') === 'true';
      if (allQuestions.length === 0 && isDocxSynced) {
        allQuestions = getPool();
      }

      const counts: Record<string, number> = {};
      allQuestions.forEach(q => {
        if (q.subject) {
          const sName = normalizeSubject(q.subject);
          counts[sName] = (counts[sName] || 0) + 1;
        }
      });

      // Ensure every subject has an entry (even if 0)
      SUBJECTS.forEach(s => {
        if (typeof counts[s.name] === 'undefined') {
          counts[s.name] = 0;
        }
      });

      setSubjectCounts(SUBJECTS.map(s => ({ subject: s.name, count: counts[s.name] || 0 })));
      setLoadingCounts(false);
    };
    fetchCounts();

    const handleUpdate = () => { fetchCounts(); };
    window.addEventListener('ahsora_qb_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ahsora_qb_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [supabase]);

  useEffect(() => {
    if (!subject) { setAvailableChapters([]); setAvailableTopics([]); return; }
    const fetchStructure = async () => {
      try {
        const { data } = await supabase
          .from('qb_questions')
          .select('subject, chapter, topic')
          .eq('is_active', true);
        if (data && data.length > 0) {
          const matching = data.filter(r => normalizeSubject(r.subject).toLowerCase() === subject.toLowerCase());
          if (matching.length > 0) {
            const uniqueChapters = [...new Set(matching.map(r => r.chapter).filter(Boolean))].sort();
            setAvailableChapters(uniqueChapters as string[]);
            
            let topicsData = matching;
            if (chapter) topicsData = topicsData.filter(r => r.chapter === chapter);
            const uniqueTopics = [...new Set(topicsData.map(r => r.topic).filter(Boolean))].sort();
            setAvailableTopics(uniqueTopics as string[]);
            return;
          }
        }
      } catch (e) {}

      const filtered = getPool().filter(q => normalizeSubject(q.subject).toLowerCase() === subject.toLowerCase());
      const uniqueChapters = [...new Set(filtered.map(q => q.chapter).filter(Boolean))].sort();
      setAvailableChapters(uniqueChapters as string[]);
      
      let topicsData = filtered;
      if (chapter) topicsData = topicsData.filter(q => q.chapter === chapter);
      const uniqueTopics = [...new Set(topicsData.map(q => q.topic).filter(Boolean))].sort();
      setAvailableTopics(uniqueTopics as string[]);
    };
    fetchStructure();
  }, [subject, chapter, supabase]);

  const totalAvailable = subjectCounts.reduce((s,r) => s+r.count, 0);

  const handleCreate = async () => {
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Please log in first.'); setCreating(false); return; }

    // Build session title
    const parts = [];
    if (subject) parts.push(subject); else parts.push('All Subjects');
    if (chapter) parts.push(chapter);
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
        chapter_filter: chapter || null,
        topic_filter: topic || null,
        difficulty_filter: difficulty || null,
        question_count: questionCount,
        time_limit_minutes: timeLimit,
        status: 'pending',
      })
      .select()
      .single();

    if (sErr || !session) { alert('Failed to create session: '+(sErr?.message||'Unknown')); setCreating(false); return; }

    // Draw questions from pool (local 820 bank or Supabase)
    let pickedQuestions: any[] = [];
    try {
      const { data: qids } = await supabase.rpc('get_random_question_ids', {
        p_count: questionCount,
        p_subject: subject || null,
        p_chapter: chapter || null,
        p_topic: topic || null,
        p_difficulty: difficulty || null,
      });
      if (qids && qids.length > 0) {
        const ids = qids.map((r: { question_id: string }) => r.question_id);
        const { data: dbQs } = await supabase
          .from('qb_questions')
          .select('id,subject,chapter,topic,difficulty,question_text,question_image_url,option_a,option_b,option_c,option_d,option_e,correct_option,explanation')
          .in('id', ids);
        if (dbQs && dbQs.length > 0) {
          pickedQuestions = dbQs;
        }
      }
    } catch (e) {}

    // Fallback: If DB returned 0 questions, draw from local 820 MCQs pool
    if (pickedQuestions.length === 0) {
      let pool = getPool();
      try {
        const cached = localStorage.getItem('ahsora_local_qb_questions');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) pool = parsed;
        }
      } catch (e) {}

      let filtered = pool;
      if (subject) filtered = filtered.filter(q => q.subject && (q.subject.toLowerCase() === subject.toLowerCase() || normalizeSubject(q.subject).toLowerCase() === subject.toLowerCase()));
      if (topic) filtered = filtered.filter(q => q.topic && q.topic.toLowerCase() === topic.toLowerCase());
      if (chapter) filtered = filtered.filter(q => q.chapter && q.chapter.toLowerCase() === chapter.toLowerCase());
      if (difficulty) filtered = filtered.filter(q => q.difficulty && q.difficulty.toLowerCase() === difficulty.toLowerCase());
      if (filtered.length === 0) filtered = pool; // Widen criteria if too narrow

      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      pickedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    }

    // ALWAYS store resolved questions in localStorage for instant access on take page
    try {
      localStorage.setItem(`practice_session_local_${session.id}`, JSON.stringify(pickedQuestions));
    } catch (e) {}

    // Link DB question IDs to session in Supabase if present
    try {
      const linkRows = pickedQuestions.map((q: any, i: number) => ({
        session_id: session.id, question_id: q.id, order_index: i,
      }));
      await supabase.from('practice_session_questions').insert(linkRows);
    } catch (e) {}

    // Update session status
    await supabase.from('practice_sessions').update({ status:'in_progress', started_at: new Date().toISOString() }).eq('id', session.id);

    router.push(`/portal/practice/${session.id}/take`);
  };

  return (
    <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
          <BookOpen size={28} color="#059669" />
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
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
            <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#334155', margin:0 }}>Browse by Subject</h2>
            <span style={{ fontSize:'0.8125rem', fontWeight:700, color:'#059669', backgroundColor:'#ECFDF5', padding:'4px 10px', borderRadius:'20px' }}>
              {SUBJECTS.length} Subjects · {totalAvailable.toLocaleString()} Total Questions
            </span>
          </div>
          {loadingCounts ? (
            <div style={{ display:'flex', gap:'10px', color:'#64748B', alignItems:'center', padding:'24px' }}>
              <Loader2 size={18} style={{ animation:'spin 1s linear infinite' }} /> Loading subjects…
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'12px' }}>
              {SUBJECTS.map((s, index) => {
                const cnt = subjectCounts.find(c => c.subject.toLowerCase() === s.name.toLowerCase())?.count || 0;
                const active = subject === s.name;
                const num = index + 1;
                return (
                  <button key={s.name}
                    onClick={() => { setSubject(active ? '' : s.name); setChapter(''); setTopic(''); }}
                    style={{ textAlign:'left', padding:'16px', borderRadius:'14px',
                      border: `2px solid ${active ? s.color : '#E2E8F0'}`,
                      backgroundColor: active ? s.bg : '#fff',
                      cursor:'pointer', transition:'all 0.15s ease',
                      position:'relative',
                      boxShadow: active ? '0 4px 14px rgba(0,0,0,0.06)' : 'none' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                      <div style={{ color:s.color }}>{s.icon}</div>
                      <span style={{
                        fontSize:'0.75rem',
                        fontWeight:800,
                        padding:'3px 9px',
                        borderRadius:'20px',
                        backgroundColor: active ? '#fff' : '#F1F5F9',
                        color: active ? s.color : '#475569',
                        border: '1px solid ' + (active ? s.color : '#E2E8F0')
                      }}>
                        #{num}
                      </span>
                    </div>
                    <div style={{ fontSize:'0.9rem', fontWeight:700, color:'#0F172A', marginBottom:'4px' }}>
                      {num}. {s.name}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'0.75rem', fontWeight:600, color: cnt > 0 ? s.color : '#64748B' }}>
                      <span style={{
                        display:'inline-block',
                        width:'7px',
                        height:'7px',
                        borderRadius:'50%',
                        backgroundColor: cnt > 0 ? s.color : '#CBD5E1'
                      }} />
                      <span>{cnt.toLocaleString()} {cnt === 1 ? 'Question' : 'Questions'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Config Panel */}
        <div style={{ backgroundColor:'#fff', borderRadius:'16px', border:'1px solid #E2E8F0', padding:'24px', position:'sticky', top:'80px' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#334155', marginBottom:'18px' }}>
            <Shuffle size={16} style={{ verticalAlign:'middle', marginRight:'6px', color:'#059669' }} />
            Build Your Test
          </h2>

          {/* Subject */}
          <div style={{ marginBottom:'14px' }}>
            <label style={LS}>Subject</label>
            <select value={subject} onChange={e => { setSubject(e.target.value); setChapter(''); setTopic(''); }} style={SS}>
              <option value="">All Subjects (Mixed — {totalAvailable.toLocaleString()} Total Questions)</option>
              {SUBJECTS.map((s, index) => {
                const cnt = subjectCounts.find(c => c.subject.toLowerCase() === s.name.toLowerCase())?.count || 0;
                return (
                  <option key={s.name} value={s.name}>
                    #{index + 1} — {s.name} ({cnt.toLocaleString()} {cnt === 1 ? 'Question' : 'Questions'})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Topic (Broad) */}
          {subject === 'Biology' && (
            <div style={{ marginBottom:'14px' }}>
              <label style={LS}>Topic (optional)</label>
              <select value={topic} onChange={e => { setTopic(e.target.value); setChapter(''); }} style={SS}>
                <option value="">All Topics</option>
                {BIOLOGY_TOPICS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
          {subject !== 'Biology' && availableTopics.length > 0 && (
            <div style={{ marginBottom:'14px' }}>
              <label style={LS}>Topic (optional)</label>
              <select value={topic} onChange={e => { setTopic(e.target.value); setChapter(''); }} style={SS}>
                <option value="">All Topics</option>
                {availableTopics.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Chapter (Specific) */}
          {subject === 'Biology' && topic && BIOLOGY_STRUCTURE[topic] && (
            <div style={{ marginBottom:'14px' }}>
              <label style={LS}>Chapter (optional)</label>
              <select value={chapter} onChange={e => setChapter(e.target.value)} style={SS}>
                <option value="">All Chapters</option>
                {BIOLOGY_STRUCTURE[topic].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
          {subject !== 'Biology' && availableChapters.length > 0 && (
            <div style={{ marginBottom:'14px' }}>
              <label style={LS}>Chapter (optional)</label>
              <select value={chapter} onChange={e => setChapter(e.target.value)} style={SS}>
                <option value="">All Chapters</option>
                {availableChapters.map(t => <option key={t} value={t}>{t}</option>)}
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
              style={{ width:'100%', accentColor:'#059669' }} />
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
              style={{ width:'100%', accentColor:'#059669' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#94A3B8' }}>
              <span>Untimed</span><span>180 min</span>
            </div>
          </div>

          <button onClick={handleCreate} disabled={creating}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center',
              gap:'8px', padding:'13px', borderRadius:'10px', border:'none',
              backgroundColor:'#059669', color:'#fff', fontWeight:700, fontSize:'0.9375rem',
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
