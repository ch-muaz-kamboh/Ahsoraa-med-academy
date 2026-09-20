'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import importedQuestions from '@/lib/imported_questions';
import { Plus, Filter, Search, CheckCircle2, Clock, ShieldAlert, Check, Edit } from 'lucide-react';
import { PublishingStatus } from '@/types';

interface StaffQuestion {
  id: string;
  subject: string;
  majorCategory: string;
  chapter: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_option: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  status: PublishingStatus;
  author: string;
}

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

export default function StaffQuestionBankPage() {
  const { staffProfile } = useAppStore();

  const [questions, setQuestions] = useState<StaffQuestion[]>([
    {
      id: 'staff-q1',
      subject: 'Biology',
      majorCategory: 'Biochemistry & Molecular Biology',
      chapter: 'Water, Weak Interactions & Chemical Basis of Life',
      topic: 'Hydrogen Bonding in Water',
      difficulty: 'medium',
      question_text: 'Why does ice float on liquid water?',
      option_a: 'Hydrogen bonds hold water molecules in an open lattice in ice.',
      option_b: 'Ice contains fewer oxygen atoms than liquid water.',
      option_c: 'Covalent bonds break when water freezes.',
      option_d: 'Ice loses hydrogen bonds.',
      option_e: 'Ice has lower molecular weight.',
      correct_option: 'A',
      explanation: 'Hydrogen bonding creates an open hexagonal crystal lattice, rendering ice less dense.',
      status: 'draft',
      author: staffProfile.displayName,
    },
  ]);

  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [subject, setSubject] = useState(staffProfile.assignedSubjects[0] || 'Biology');
  const [majorCategory, setMajorCategory] = useState('Biochemistry & Molecular Biology');
  const [chapter, setChapter] = useState('Water, Weak Interactions & Chemical Basis of Life');
  const [topic, setTopic] = useState('Hydrogen Bonding in Water');
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
    const newQ: StaffQuestion = {
      id: 'sq-' + Date.now(),
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
      status: 'draft',
      author: staffProfile.displayName,
    };
    setQuestions([newQ, ...questions]);
    setShowModal(false);
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setOptionE('');
  };

  const handleUpdateStatus = (id: string, newStatus: PublishingStatus) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterSubject && q.subject !== filterSubject) return false;
    if (filterStatus && q.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            Faculty Question Bank & Publishing Workflow
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Draft MCQs, structure taxonomy, and submit questions for Academic Admin review & publishing.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ backgroundColor: '#2563EB', padding: '10px 18px', fontSize: '0.875rem' }}
        >
          <Plus size={16} /> Draft New MCQ
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Filter size={16} color="#64748B" />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>Filters:</span>

        <select
          className="form-select"
          style={{ width: '180px', padding: '6px 12px', fontSize: '0.8125rem' }}
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
        >
          <option value="">All Assigned Subjects</option>
          {staffProfile.assignedSubjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="form-select"
          style={{ width: '180px', padding: '6px 12px', fontSize: '0.8125rem' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="draft">Drafts</option>
          <option value="in_review">In Review</option>
          <option value="published">Published</option>
        </select>

        <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: '#64748B' }}>
          Showing {filteredQuestions.length} items
        </span>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredQuestions.map((q) => (
          <div key={q.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge badge-blue">{q.subject}</span>
                  <span className="badge badge-amber">{q.difficulty.toUpperCase()}</span>
                  <span
                    style={{
                      backgroundColor:
                        q.status === 'published'
                          ? '#ECFDF5'
                          : q.status === 'in_review'
                          ? '#FFFBEB'
                          : '#F1F5F9',
                      color:
                        q.status === 'published'
                          ? '#059669'
                          : q.status === 'in_review'
                          ? '#D97706'
                          : '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    STATUS: {q.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                  Taxonomy: <strong>{q.majorCategory}</strong> → {q.chapter} → <em>{q.topic}</em>
                </div>
              </div>

              {/* Status Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {q.status === 'draft' && (
                  <button
                    onClick={() => handleUpdateStatus(q.id, 'in_review')}
                    className="btn-outline"
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Submit for Review
                  </button>
                )}

                {(staffProfile.role === 'academic_admin' || staffProfile.role === 'super_admin') && q.status !== 'published' && (
                  <button
                    onClick={() => handleUpdateStatus(q.id, 'published')}
                    className="btn-primary"
                    style={{ backgroundColor: '#10B981', fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    <CheckCircle2 size={12} /> Approve & Publish
                  </button>
                )}
              </div>
            </div>

            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>
              {q.question_text}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.875rem', color: '#475569', marginBottom: '12px' }}>
              <div>A. {q.option_a}</div>
              <div>B. {q.option_b}</div>
              <div>C. {q.option_c}</div>
              <div>D. {q.option_d}</div>
            </div>

            <div style={{ fontSize: '0.8125rem', backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', color: '#0F172A' }}>
              <strong>Correct Option: {q.correct_option}</strong> — Explanation: {q.explanation}
            </div>
          </div>
        ))}
      </div>

      {/* Draft Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '650px',
              width: '100%',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Draft New Multiple Choice Question (MCQ)
            </h3>

            <form onSubmit={handleSaveDraft} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    {staffProfile.assignedSubjects.map((s) => (
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

              <div className="form-group">
                <label className="form-label">Question Text *</label>
                <textarea
                  rows={3}
                  required
                  className="form-textarea"
                  placeholder="Enter clear, unambiguous question text..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" required className="form-input" placeholder="Option A *" value={optionA} onChange={(e) => setOptionA(e.target.value)} />
                <input type="text" required className="form-input" placeholder="Option B *" value={optionB} onChange={(e) => setOptionB(e.target.value)} />
                <input type="text" required className="form-input" placeholder="Option C *" value={optionC} onChange={(e) => setOptionC(e.target.value)} />
                <input type="text" required className="form-input" placeholder="Option D *" value={optionD} onChange={(e) => setOptionD(e.target.value)} />
                <input type="text" className="form-input" placeholder="Option E" value={optionE} onChange={(e) => setOptionE(e.target.value)} />
                <div className="form-group">
                  <select className="form-select" value={correctOption} onChange={(e) => setCorrectOption(e.target.value as any)}>
                    <option value="A">Correct: Option A</option>
                    <option value="B">Correct: Option B</option>
                    <option value="C">Correct: Option C</option>
                    <option value="D">Correct: Option D</option>
                    <option value="E">Correct: Option E</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Explanation *</label>
                <textarea
                  rows={2}
                  required
                  className="form-textarea"
                  placeholder="Explain why the correct option is right and others are wrong..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#2563EB' }}>Save as Draft</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
