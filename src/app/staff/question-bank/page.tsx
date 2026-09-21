'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Filter, CheckCircle2, Clock, ShieldAlert, Send, Trash2, XCircle } from 'lucide-react';
import { StaffQuestion } from '@/types';

const TAXONOMY: Record<string, Record<string, string[]>> = {
  Biology: {
    'Biochemistry & Molecular Biology': [
      'Water, Weak Interactions & Chemical Basis of Life',
      'Carbohydrates, Lipids, Proteins & Nucleic Acids',
      'Enzymes & Bioenergetics',
    ],
    'Genetics & Cell Structure': [
      'Cell Theory, Organelles & Transport',
      'DNA Replication, Genetic Code & Mutations',
      'Mendelian Inheritance',
    ],
  },
  Chemistry: {
    'Physical & Organic Chemistry': [
      'Atomic Structure & Periodic Table',
      'Chemical Bonding & Solutions',
      'Organic Reactions & Hydrocarbons',
    ],
  },
};

const STATUS_CONFIG = {
  draft: { label: 'Draft', bg: '#F1F5F9', color: '#475569', icon: <Clock size={12} /> },
  in_review: { label: 'In Review', bg: '#FFFBEB', color: '#D97706', icon: <ShieldAlert size={12} /> },
  published: { label: 'Published ✓', bg: '#ECFDF5', color: '#059669', icon: <CheckCircle2 size={12} /> },
  archived: { label: 'Archived', bg: '#F1F5F9', color: '#94A3B8', icon: <XCircle size={12} /> },
};

export default function StaffQuestionBankPage() {
  const { staffProfile, staffQuestions, addStaffQuestion, submitQuestionForReview, deleteStaffQuestion } = useAppStore();

  // Only show this staff member's own questions
  const myQuestions = staffQuestions.filter((q) => q.authorId === staffProfile.id);

  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [subject, setSubject] = useState(staffProfile.assignedSubjects?.[0] || 'Biology');
  const [majorCategory, setMajorCategory] = useState('Biochemistry & Molecular Biology');
  const [chapter, setChapter] = useState('Water, Weak Interactions & Chemical Basis of Life');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [optionE, setOptionE] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [explanation, setExplanation] = useState('');

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    addStaffQuestion({
      subject,
      majorCategory,
      chapter,
      topic,
      difficulty,
      question_text: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      option_e: optionE,
      correct_option: correctOption,
      explanation,
      author: staffProfile.displayName,
      authorId: staffProfile.id,
    });
    setShowModal(false);
    setQuestionText(''); setOptionA(''); setOptionB(''); setOptionC(''); setOptionD(''); setOptionE(''); setTopic(''); setExplanation('');
  };

  const filteredQuestions = myQuestions.filter((q) => {
    if (filterStatus && q.status !== filterStatus) return false;
    return true;
  });

  const pendingCount = myQuestions.filter((q) => q.status === 'in_review').length;
  const publishedCount = myQuestions.filter((q) => q.status === 'published').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            My MCQ Question Bank
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Draft MCQs and submit them to Admin for review & publishing.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ backgroundColor: '#2563EB', padding: '10px 18px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Draft New MCQ
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total MCQs', value: myQuestions.length, color: '#2563EB' },
          { label: 'Drafts', value: myQuestions.filter(q => q.status === 'draft').length, color: '#64748B' },
          { label: 'In Review', value: pendingCount, color: '#D97706' },
          { label: 'Published', value: publishedCount, color: '#10B981' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '14px 20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Filter size={16} color="#64748B" />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>Filter by status:</span>
        {['', 'draft', 'in_review', 'published'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 600,
              backgroundColor: filterStatus === s ? '#0F172A' : '#F1F5F9',
              color: filterStatus === s ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s',
            }}
          >
            {s === '' ? 'All' : s === 'in_review' ? 'In Review' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: '#64748B' }}>
          {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
          <h3 style={{ color: '#0F172A', fontWeight: 700, marginBottom: '8px' }}>No MCQs yet</h3>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>Click "Draft New MCQ" to start adding questions for admin review.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredQuestions.map((q) => {
            const statusCfg = STATUS_CONFIG[q.status] || STATUS_CONFIG.draft;
            return (
              <div key={q.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', borderLeft: `4px solid ${statusCfg.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span className="badge badge-blue">{q.subject}</span>
                      <span className="badge badge-amber">{q.difficulty.toUpperCase()}</span>
                      <span style={{
                        backgroundColor: statusCfg.bg,
                        color: statusCfg.color,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                      {q.majorCategory} → {q.chapter}{q.topic ? ` → ${q.topic}` : ''}
                    </div>
                    {q.reviewNote && (
                      <div style={{ marginTop: '6px', fontSize: '0.8125rem', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '4px 10px', borderRadius: '6px' }}>
                        Admin note: {q.reviewNote}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {q.status === 'draft' && (
                      <>
                        <button
                          onClick={() => submitQuestionForReview(q.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '6px 12px', borderRadius: '8px', border: '1px solid #2563EB',
                            backgroundColor: '#EFF6FF', color: '#2563EB',
                            fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                          }}
                        >
                          <Send size={13} /> Submit for Review
                        </button>
                        <button
                          onClick={() => deleteStaffQuestion(q.id)}
                          style={{
                            padding: '6px 10px', borderRadius: '8px', border: '1px solid #FEE2E2',
                            backgroundColor: '#FEF2F2', color: '#DC2626',
                            fontSize: '0.8125rem', cursor: 'pointer',
                          }}
                          title="Delete question"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                    {q.status === 'in_review' && (
                      <span style={{ fontSize: '0.8125rem', color: '#D97706', fontStyle: 'italic' }}>Awaiting admin review…</span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>
                  {q.question_text}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.875rem', color: '#475569', marginBottom: '12px' }}>
                  {[['A', q.option_a], ['B', q.option_b], ['C', q.option_c], ['D', q.option_d], ['E', q.option_e]].map(([ltr, val]) =>
                    val ? (
                      <div key={ltr} style={{
                        padding: '6px 10px', borderRadius: '6px',
                        backgroundColor: q.correct_option === ltr ? '#ECFDF5' : '#F8FAFC',
                        color: q.correct_option === ltr ? '#059669' : '#475569',
                        fontWeight: q.correct_option === ltr ? 700 : 400,
                        border: q.correct_option === ltr ? '1px solid #A7F3D0' : '1px solid transparent',
                      }}>
                        {ltr}. {val} {q.correct_option === ltr ? '✓' : ''}
                      </div>
                    ) : null
                  )}
                </div>

                <div style={{ fontSize: '0.8125rem', backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', color: '#475569' }}>
                  <strong style={{ color: '#0F172A' }}>Explanation:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Draft Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>
              Draft New MCQ
            </h3>

            <form onSubmit={handleSaveDraft} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    {(staffProfile.assignedSubjects || ['Biology', 'Chemistry']).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty *</label>
                  <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input type="text" className="form-input" value={majorCategory} onChange={(e) => setMajorCategory(e.target.value)} placeholder="e.g. Biochemistry & Molecular Biology" />
                </div>
                <div className="form-group">
                  <label className="form-label">Chapter</label>
                  <input type="text" className="form-input" value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="e.g. Enzymes" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Topic</label>
                <input type="text" className="form-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Specific topic (optional)" />
              </div>

              <div className="form-group">
                <label className="form-label">Question Text *</label>
                <textarea rows={3} required className="form-textarea" placeholder="Enter clear, unambiguous question text..." value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" required className="form-input" placeholder="Option A *" value={optionA} onChange={(e) => setOptionA(e.target.value)} />
                <input type="text" required className="form-input" placeholder="Option B *" value={optionB} onChange={(e) => setOptionB(e.target.value)} />
                <input type="text" required className="form-input" placeholder="Option C *" value={optionC} onChange={(e) => setOptionC(e.target.value)} />
                <input type="text" required className="form-input" placeholder="Option D *" value={optionD} onChange={(e) => setOptionD(e.target.value)} />
                <input type="text" className="form-input" placeholder="Option E (optional)" value={optionE} onChange={(e) => setOptionE(e.target.value)} />
                <div className="form-group">
                  <select className="form-select" value={correctOption} onChange={(e) => setCorrectOption(e.target.value as any)}>
                    {['A','B','C','D','E'].map(l => <option key={l} value={l}>Correct: Option {l}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Explanation *</label>
                <textarea rows={2} required className="form-textarea" placeholder="Explain why the correct option is right..." value={explanation} onChange={(e) => setExplanation(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={15} /> Save as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
