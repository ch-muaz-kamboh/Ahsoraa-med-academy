'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus, Search, Pencil, Trash2, Upload, X, Check, ChevronDown,
  BookOpen, Filter, Loader2, AlertCircle, FileSpreadsheet
} from 'lucide-react';



// ─── Types ────────────────────────────────────────────────────────────────────
interface QBQuestion {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  question_image_url?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_option: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation?: string;
  source_reference?: string;
  is_active: boolean;
  created_at: string;
}

const SUBJECTS = ['Biology','Chemistry','Physics','Mathematics','Logical Reasoning','General Knowledge'];
const DIFFICULTIES: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
const EMPTY_FORM = {
  subject: 'Biology', topic: '', difficulty: 'medium' as 'easy'|'medium'|'hard',
  question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', option_e: '',
  correct_option: 'A' as 'A'|'B'|'C'|'D'|'E', explanation: '', source_reference: '', is_active: true,
};

const DIFF_COLOR: Record<string, string> = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' };
const DIFF_BG:    Record<string, string> = { easy: '#F0FFF4', medium: '#FFFBEB', hard: '#FEF2F2' };

export default function AdminQuestionBankPage() {
  const [questions, setQuestions]   = useState<QBQuestion[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [syncing, setSyncing]       = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [editId, setEditId]         = useState<string | null>(null);
  const [form, setForm]             = useState({ ...EMPTY_FORM });
  const [formError, setFormError]   = useState('');
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [toast, setToast]           = useState('');

  // Filters
  const [searchQ, setSearchQ]         = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDiff, setFilterDiff]   = useState('');
  const [page, setPage]               = useState(0);
  const PAGE_SIZE = 20;

  // CSV/bulk import
  const [importing, setImporting] = useState(false);
  const [importLog, setImportLog] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    let allPool: QBQuestion[] = [];

    // 1. Try Supabase
    try {
      let q = supabase.from('qb_questions').select('*');
      const { data, error } = await q;
      if (!error && data && data.length > 0) {
        allPool = data as QBQuestion[];
        try {
          localStorage.setItem('ahsora_local_qb_questions', JSON.stringify(allPool));
        } catch (e) {}
      }
    } catch (e) {}

    // 2. Try LocalStorage synced cache
    if (allPool.length === 0) {
      try {
        const cached = localStorage.getItem('ahsora_local_qb_questions');
        if (cached) {
          allPool = JSON.parse(cached);
        }
      } catch (e) {}
    }

    // 3. Fallback to bundled 820 imported questions
    if (allPool.length === 0) {
      allPool = (importedQuestions as unknown as QBQuestion[]);
    }

    // Apply Filters (Subject, Difficulty, Search)
    let filtered = allPool;
    if (filterSubject) {
      filtered = filtered.filter(q => q.subject && q.subject.toLowerCase() === filterSubject.toLowerCase());
    }
    if (filterDiff) {
      filtered = filtered.filter(q => q.difficulty === filterDiff);
    }
    if (searchQ) {
      const sq = searchQ.toLowerCase();
      filtered = filtered.filter(q =>
        (q.question_text && q.question_text.toLowerCase().includes(sq)) ||
        (q.topic && q.topic.toLowerCase().includes(sq)) ||
        (q.source_reference && q.source_reference.toLowerCase().includes(sq))
      );
    }

    const start = page * PAGE_SIZE;
    setQuestions(filtered.slice(start, start + PAGE_SIZE));
    setTotal(filtered.length);
    setLoading(false);
  }, [filterSubject, filterDiff, searchQ, page, supabase]);

  const handleSyncDocxBank = async () => {
    setSyncing(true);
    const all820 = (importedQuestions as unknown as QBQuestion[]);

    // 1. Save all 820 questions to LocalStorage
    try {
      localStorage.setItem('ahsora_local_qb_questions', JSON.stringify(all820));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }

    // 2. Set active pool state to all 820 questions
    setQuestions(all820.slice(0, PAGE_SIZE));
    setTotal(all820.length);

    // 3. Attempt Supabase batch insert
    let dbSuccessCount = 0;
    let dbError = '';
    try {
      const BATCH_SIZE = 50;
      for (let i = 0; i < all820.length; i += BATCH_SIZE) {
        const batch = all820.slice(i, i + BATCH_SIZE).map(q => ({
          // OMIT id field so Supabase auto-generates valid UUIDs
          subject: q.subject,
          topic: q.topic,
          difficulty: q.difficulty,
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          option_e: q.option_e || '',
          correct_option: q.correct_option,
          explanation: q.explanation || '',
          source_reference: q.source_reference || '',
          is_active: true,
        }));

        const { error } = await supabase
          .from('qb_questions')
          .insert(batch);
        if (!error) {
          dbSuccessCount += batch.length;
        } else {
          dbError = error.message;
        }
      }
    } catch (err: any) {
      dbError = err?.message || 'Unknown error';
    }

    setSyncing(false);

    if (dbSuccessCount > 0) {
      showToast(`✅ Synced ${dbSuccessCount} questions to database!`);
    } else if (dbError) {
      showToast(`📚 820 questions loaded locally (DB: ${dbError.slice(0, 35)})`);
    } else {
      showToast(`📚 820 questions loaded into Question Bank!`);
    }

    fetchQuestions();
  };

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // ── Save (Create / Update) ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.question_text.trim() || !form.option_a.trim() || !form.option_b.trim() ||
        !form.option_c.trim() || !form.option_d.trim() || !form.option_e.trim()) {
      setFormError('All fields (question + 5 options) are required.'); return;
    }
    setFormError(''); setSaving(true);
    const payload = { ...form };
    const { error } = editId
      ? await supabase.from('qb_questions').update(payload).eq('id', editId)
      : await supabase.from('qb_questions').insert(payload);
    setSaving(false);
    if (error) { setFormError(error.message); return; }
    showToast(editId ? 'Question updated!' : 'Question added!');
    setShowModal(false); setEditId(null); setForm({ ...EMPTY_FORM });
    fetchQuestions();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const targetId = deleteId;
    setDeleteId(null);

    // 1. Immediately remove from active state so UI updates without delay
    setQuestions(prev => prev.filter(q => q.id !== targetId));
    setTotal(prev => Math.max(0, prev - 1));
    showToast('Question deleted.');

    // 2. Remove from localStorage cache so it stays deleted across refreshes
    try {
      const cached = localStorage.getItem('ahsora_local_qb_questions');
      let localQs: QBQuestion[] = [];
      if (cached) {
        localQs = JSON.parse(cached);
      } else {
        localQs = (importedQuestions as unknown as QBQuestion[]);
      }
      const updated = localQs.filter((q) => q.id !== targetId);
      localStorage.setItem('ahsora_local_qb_questions', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update local cache after delete:', e);
    }

    // 3. Delete from Supabase if valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
    if (isUuid) {
      try {
        await supabase.from('qb_questions').delete().eq('id', targetId);
      } catch (e) {
        console.error('Supabase delete error:', e);
      }
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const openEdit = (q: QBQuestion) => {
    setEditId(q.id);
    setForm({
      subject: q.subject, topic: q.topic, difficulty: q.difficulty,
      question_text: q.question_text, option_a: q.option_a, option_b: q.option_b,
      option_c: q.option_c, option_d: q.option_d, option_e: q.option_e,
      correct_option: q.correct_option, explanation: q.explanation || '',
      source_reference: q.source_reference || '', is_active: q.is_active,
    });
    setFormError(''); setShowModal(true);
  };

  // ── CSV Import ─────────────────────────────────────────────────────────────
  const handleCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setImporting(true); setImportLog(['Parsing CSV...']);
    const text = await file.text();
    const rows = text.split('\n').map(r => r.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
    const header = rows[0].map(h => h.toLowerCase());
    const required = ['subject','topic','difficulty','question_text','option_a','option_b','option_c','option_d','option_e','correct_option'];
    const missing = required.filter(r => !header.includes(r));
    if (missing.length) { setImportLog([`Missing columns: ${missing.join(', ')}`]); setImporting(false); return; }
    const insertRows: Record<string, string | boolean>[] = [];
    const logs: string[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]; if (!row[0]) continue;
      const get = (col: string) => row[header.indexOf(col)] || '';
      const co = get('correct_option').toUpperCase();
      if (!['A','B','C','D','E'].includes(co)) { logs.push(`Row ${i+1}: invalid correct_option "${co}" – skipped`); continue; }
      insertRows.push({
        subject: get('subject') || 'Biology', topic: get('topic'),
        difficulty: ['easy','medium','hard'].includes(get('difficulty')) ? get('difficulty') : 'medium',
        question_text: get('question_text'), option_a: get('option_a'), option_b: get('option_b'),
        option_c: get('option_c'), option_d: get('option_d'), option_e: get('option_e'),
        correct_option: co, explanation: get('explanation'), source_reference: get('source_reference'),
        is_active: true,
      });
    }
    if (insertRows.length === 0) { setImportLog([...logs,'No valid rows found.']); setImporting(false); return; }
    const { error } = await supabase.from('qb_questions').insert(insertRows);
    if (error) logs.push(`Import error: ${error.message}`);
    else logs.push(`✅ Imported ${insertRows.length} questions successfully.`);
    setImportLog(logs); setImporting(false);
    if (!error) fetchQuestions();
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:24, zIndex:1000, backgroundColor:'#059669',
          color:'#fff', padding:'12px 20px', borderRadius:'10px', fontWeight:600, fontSize:'0.9rem',
          boxShadow:'0 4px 14px rgba(0,0,0,0.15)', display:'flex', alignItems:'center', gap:'8px' }}>
          <Check size={16} /> {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'#0F172A', marginBottom:'4px' }}>Question Bank</h1>
          <p style={{ color:'#64748B', fontSize:'0.9rem' }}>{total.toLocaleString()} total questions — 5 options each (A–E)</p>
        </div>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          <button
            onClick={handleSyncDocxBank}
            disabled={syncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #BBF7D0',
              backgroundColor: '#F0FDF4',
              color: '#15803D',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: syncing ? 'not-allowed' : 'pointer',
            }}
          >
            {syncing ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <BookOpen size={16} />}
            <span>Sync 820+ Docx Questions</span>
          </button>
          <label style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 16px',
            borderRadius:'8px', border:'1px solid #E2E8F0', backgroundColor:'#F8FAFC',
            cursor:'pointer', fontSize:'0.875rem', fontWeight:600, color:'#475569' }}>
            <FileSpreadsheet size={16} />
            {importing ? 'Importing…' : 'Import CSV'}
            <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} style={{ display:'none' }} />
          </label>
          <button onClick={() => { setEditId(null); setForm({ ...EMPTY_FORM }); setFormError(''); setShowModal(true); }}
            style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 18px',
              borderRadius:'8px', border:'none', backgroundColor:'#2563EB', color:'#fff',
              fontWeight:700, fontSize:'0.875rem', cursor:'pointer' }}>
            <Plus size={16} /> Add Question
          </button>
        </div>
      </div>

      {/* Import Log */}
      {importLog.length > 0 && (
        <div style={{ backgroundColor:'#F0FFF4', border:'1px solid #A7F3D0', borderRadius:'10px',
          padding:'14px 18px', marginBottom:'20px', fontSize:'0.8125rem', color:'#065F46' }}>
          {importLog.map((l, i) => <div key={i}>{l}</div>)}
          <button onClick={() => setImportLog([])} style={{ marginTop:'8px', fontSize:'0.75rem',
            color:'#059669', border:'none', background:'none', cursor:'pointer' }}>Clear log</button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'20px' }}>
        <div style={{ position:'relative', flex:'1 1 220px' }}>
          <Search size={15} color="#94A3B8" style={{ position:'absolute', left:12, top:11 }} />
          <input value={searchQ} onChange={e => { setSearchQ(e.target.value); setPage(0); }}
            placeholder="Search questions…"
            style={{ width:'100%', padding:'9px 12px 9px 34px', borderRadius:'8px',
              border:'1px solid #E2E8F0', fontSize:'0.875rem', outline:'none' }} />
        </div>
        <select value={filterSubject} onChange={e => { setFilterSubject(e.target.value); setPage(0); }}
          style={{ padding:'9px 12px', borderRadius:'8px', border:'1px solid #E2E8F0',
            fontSize:'0.875rem', backgroundColor:'#fff', outline:'none' }}>
          <option value="">All Subjects</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterDiff} onChange={e => { setFilterDiff(e.target.value); setPage(0); }}
          style={{ padding:'9px 12px', borderRadius:'8px', border:'1px solid #E2E8F0',
            fontSize:'0.875rem', backgroundColor:'#fff', outline:'none' }}>
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display:'flex', alignItems:'center', gap:'10px', color:'#64748B', padding:'32px' }}>
          <Loader2 size={20} style={{ animation:'spin 1s linear infinite' }} /> Loading questions…
        </div>
      ) : questions.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'#94A3B8' }}>
          <BookOpen size={40} strokeWidth={1} />
          <p style={{ marginTop:'12px', fontSize:'0.9rem' }}>No questions yet. Add your first or import a CSV.</p>
        </div>
      ) : (
        <div style={{ backgroundColor:'#fff', borderRadius:'12px', border:'1px solid #E2E8F0', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor:'#F8FAFC', borderBottom:'1px solid #E2E8F0' }}>
                <th style={{ padding:'10px 14px', textAlign:'left', color:'#64748B', fontWeight:600 }}>Question</th>
                <th style={{ padding:'10px 14px', textAlign:'left', color:'#64748B', fontWeight:600 }}>Subject</th>
                <th style={{ padding:'10px 14px', textAlign:'left', color:'#64748B', fontWeight:600 }}>Topic</th>
                <th style={{ padding:'10px 14px', textAlign:'left', color:'#64748B', fontWeight:600 }}>Difficulty</th>
                <th style={{ padding:'10px 14px', textAlign:'left', color:'#64748B', fontWeight:600 }}>Answer</th>
                <th style={{ padding:'10px 14px', textAlign:'center', color:'#64748B', fontWeight:600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => (
                <tr key={q.id} style={{ borderBottom:'1px solid #F1F5F9', backgroundColor: i%2===0?'#fff':'#FAFAFA' }}>
                  <td style={{ padding:'10px 14px', maxWidth:'320px' }}>
                    <div style={{ fontWeight:500, color:'#0F172A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {q.question_text}
                    </div>
                  </td>
                  <td style={{ padding:'10px 14px', color:'#475569' }}>{q.subject}</td>
                  <td style={{ padding:'10px 14px', color:'#64748B' }}>{q.topic || '—'}</td>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ padding:'2px 8px', borderRadius:'6px', fontSize:'0.75rem', fontWeight:700,
                      backgroundColor: DIFF_BG[q.difficulty], color: DIFF_COLOR[q.difficulty] }}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
                      width:24, height:24, borderRadius:'50%', backgroundColor:'#F0FFF4',
                      color:'#059669', fontWeight:800, fontSize:'0.75rem' }}>{q.correct_option}</span>
                  </td>
                  <td style={{ padding:'10px 14px', textAlign:'center' }}>
                    <div style={{ display:'flex', gap:'6px', justifyContent:'center' }}>
                      <button onClick={() => openEdit(q)} title="Edit"
                        style={{ padding:'5px 8px', borderRadius:'6px', border:'1px solid #E2E8F0',
                          background:'#F8FAFC', cursor:'pointer', color:'#475569' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(q.id)} title="Delete"
                        style={{ padding:'5px 8px', borderRadius:'6px', border:'1px solid #FCA5A5',
                          background:'#FEF2F2', cursor:'pointer', color:'#EF4444' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'20px' }}>
          <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page===0}
            style={{ padding:'7px 14px', borderRadius:'7px', border:'1px solid #E2E8F0',
              background:'#fff', cursor: page===0?'not-allowed':'pointer', opacity: page===0?0.4:1 }}>
            Prev
          </button>
          <span style={{ padding:'7px 14px', fontSize:'0.875rem', color:'#64748B' }}>
            Page {page+1} of {Math.ceil(total/PAGE_SIZE)}
          </span>
          <button onClick={() => setPage(p => p+1)} disabled={(page+1)*PAGE_SIZE >= total}
            style={{ padding:'7px 14px', borderRadius:'7px', border:'1px solid #E2E8F0',
              background:'#fff', cursor:(page+1)*PAGE_SIZE>=total?'not-allowed':'pointer',
              opacity:(page+1)*PAGE_SIZE>=total?0.4:1 }}>
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', zIndex:200,
          display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ backgroundColor:'#fff', borderRadius:'16px', width:'100%', maxWidth:'700px',
            maxHeight:'90vh', overflowY:'auto', padding:'28px', position:'relative' }}>
            <button onClick={() => { setShowModal(false); setEditId(null); }}
              style={{ position:'absolute', top:16, right:16, border:'none', background:'none', cursor:'pointer' }}>
              <X size={20} color="#64748B" />
            </button>
            <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#0F172A', marginBottom:'20px' }}>
              {editId ? 'Edit Question' : 'Add New Question'}
            </h2>

            {formError && (
              <div style={{ backgroundColor:'#FEF2F2', border:'1px solid #FCA5A5', color:'#991B1B',
                padding:'10px 14px', borderRadius:'8px', marginBottom:'16px', fontSize:'0.875rem',
                display:'flex', gap:'8px', alignItems:'center' }}>
                <AlertCircle size={15} /> {formError}
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div>
                <label style={LS}>Subject</label>
                <select value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} style={SS}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={LS}>Topic</label>
                <input value={form.topic} onChange={e => setForm({...form, topic:e.target.value})}
                  placeholder="e.g. Cell Division" style={IS} />
              </div>
              <div>
                <label style={LS}>Difficulty</label>
                <select value={form.difficulty} onChange={e => setForm({...form, difficulty:e.target.value as 'easy'|'medium'|'hard'})} style={SS}>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={LS}>Correct Option</label>
                <select value={form.correct_option} onChange={e => setForm({...form, correct_option:e.target.value as 'A'|'B'|'C'|'D'|'E'})} style={SS}>
                  {(['A','B','C','D','E'] as const).map(o => <option key={o} value={o}>Option {o}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop:'14px' }}>
              <label style={LS}>Question Text *</label>
              <textarea value={form.question_text} onChange={e => setForm({...form, question_text:e.target.value})}
                rows={3} placeholder="Enter the question…"
                style={{ ...IS, resize:'vertical', height:'80px', lineHeight:1.5 }} />
            </div>

            {(['a','b','c','d','e'] as const).map(opt => (
              <div key={opt} style={{ marginTop:'12px' }}>
                <label style={{ ...LS, display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
                    width:20, height:20, borderRadius:'50%',
                    backgroundColor: form.correct_option===opt.toUpperCase()?'#059669':'#E2E8F0',
                    color: form.correct_option===opt.toUpperCase()?'#fff':'#64748B',
                    fontSize:'0.7rem', fontWeight:800 }}>{opt.toUpperCase()}</span>
                  Option {opt.toUpperCase()} {form.correct_option===opt.toUpperCase() && '✓ Correct'}
                </label>
                <input value={form[`option_${opt}` as 'option_a'|'option_b'|'option_c'|'option_d'|'option_e']}
                  onChange={e => setForm({...form, [`option_${opt}`]:e.target.value})}
                  placeholder={`Option ${opt.toUpperCase()}…`} style={IS} />
              </div>
            ))}

            <div style={{ marginTop:'12px' }}>
              <label style={LS}>Explanation (optional)</label>
              <textarea value={form.explanation} onChange={e => setForm({...form, explanation:e.target.value})}
                rows={2} placeholder="Why is this the correct answer?"
                style={{ ...IS, resize:'vertical', height:'60px' }} />
            </div>
            <div style={{ marginTop:'12px' }}>
              <label style={LS}>Source / Reference (optional)</label>
              <input value={form.source_reference} onChange={e => setForm({...form, source_reference:e.target.value})}
                placeholder="e.g. IMAT 2023 Q14" style={IS} />
            </div>

            <div style={{ marginTop:'20px', display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditId(null); }}
                style={{ padding:'10px 18px', borderRadius:'8px', border:'1px solid #E2E8F0',
                  background:'#F8FAFC', cursor:'pointer', fontWeight:600, fontSize:'0.875rem', color:'#475569' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px',
                  borderRadius:'8px', border:'none', backgroundColor:'#2563EB', color:'#fff',
                  fontWeight:700, fontSize:'0.875rem', cursor: saving?'not-allowed':'pointer', opacity: saving?0.7:1 }}>
                {saving ? <Loader2 size={15} style={{ animation:'spin 1s linear infinite' }} /> : <Check size={15} />}
                {editId ? 'Save Changes' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', zIndex:200,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ backgroundColor:'#fff', borderRadius:'14px', padding:'28px', maxWidth:'380px', width:'90%' }}>
            <h3 style={{ fontSize:'1.1rem', fontWeight:800, color:'#0F172A', marginBottom:'10px' }}>Delete Question?</h3>
            <p style={{ color:'#64748B', fontSize:'0.9rem', marginBottom:'20px' }}>
              This cannot be undone. If any student has answered this question, those answers will also be removed.
            </p>
            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button onClick={() => setDeleteId(null)}
                style={{ padding:'9px 16px', borderRadius:'8px', border:'1px solid #E2E8F0',
                  background:'#F8FAFC', cursor:'pointer', fontWeight:600, fontSize:'0.875rem' }}>Cancel</button>
              <button onClick={handleDelete}
                style={{ padding:'9px 16px', borderRadius:'8px', border:'none',
                  backgroundColor:'#EF4444', color:'#fff', fontWeight:700, fontSize:'0.875rem', cursor:'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Style helpers ──────────────────────────────────────────────────────────────
const LS: React.CSSProperties = {
  display:'block', fontSize:'0.8125rem', fontWeight:600, color:'#334155', marginBottom:'5px',
};
const IS: React.CSSProperties = {
  width:'100%', padding:'9px 12px', borderRadius:'8px', border:'1px solid #CBD5E1',
  fontSize:'0.875rem', outline:'none', boxSizing:'border-box',
};
const SS: React.CSSProperties = {
  width:'100%', padding:'9px 12px', borderRadius:'8px', border:'1px solid #CBD5E1',
  fontSize:'0.875rem', backgroundColor:'#fff', outline:'none',
};
