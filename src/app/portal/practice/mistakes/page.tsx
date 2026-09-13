'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  FileCheck2,
  Filter,
  Search,
  Sparkles,
  HelpCircle,
  Check,
} from 'lucide-react';
import { StudentMistake } from '@/types';

export default function StudentMyMistakesPage() {
  const { studentMistakes, toggleMistakeResolved } = useAppStore();
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('unresolved');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Retake State: track selected option user picked in retake mode for questionId
  const [userRetakeAnswers, setUserRetakeAnswers] = useState<Record<string, string>>({});
  const [retakeSubmitted, setRetakeSubmitted] = useState<Record<string, boolean>>({});

  const subjects = Array.from(new Set(studentMistakes.map((m) => m.subject)));

  const filteredMistakes = studentMistakes.filter((item) => {
    const matchesSource = filterSource === 'all' || item.source === filterSource;
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'unresolved'
        ? !item.isResolved
        : item.isResolved;
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchesSearch =
      item.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.explanation && item.explanation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.testTitle && item.testTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSource && matchesStatus && matchesSubject && matchesSearch;
  });

  const unresolvedCount = studentMistakes.filter((m) => !m.isResolved).length;
  const resolvedCount = studentMistakes.filter((m) => m.isResolved).length;

  const handleSelectRetakeOption = (mistakeId: string, optionId: string) => {
    if (retakeSubmitted[mistakeId]) return;
    setUserRetakeAnswers((prev) => ({ ...prev, [mistakeId]: optionId }));
  };

  const handleCheckRetakeAnswer = (mistake: StudentMistake) => {
    setRetakeSubmitted((prev) => ({ ...prev, [mistake.id]: true }));
    const chosen = userRetakeAnswers[mistake.id];
    if (chosen === mistake.correctOption && !mistake.isResolved) {
      toggleMistakeResolved(mistake.id);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Banner Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #C084FC 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.3)',
        }}
      >
        <div style={{ maxWidth: '700px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '14px',
            }}
          >
            <Sparkles size={14} color="#FDE047" />
            <span>SMART REVISION • MY MISTAKES NOTEBOOK</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            My Incorrect MCQs & Error Log
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.6, margin: 0 }}>
            Review wrongly answered questions from both <strong>Practice Bank</strong> and <strong>CBT Mock Tests</strong>. Practice them again until you master every concept!
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>{unresolvedCount}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Needs Review</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>{resolvedCount}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Mastered & Resolved</div>
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
          <input
            type="text"
            placeholder="Search in failed question text or explanations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>

        {/* Source Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Sources' },
            { id: 'Practice Bank', label: 'Book Practice Bank' },
            { id: 'CBT Mock', label: 'CBT Mock Exams' },
          ].map((src) => (
            <button
              key={src.id}
              onClick={() => setFilterSource(src.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filterSource === src.id ? '#9333EA' : '#E2E8F0',
                backgroundColor: filterSource === src.id ? '#F3E8FF' : '#FFFFFF',
                color: filterSource === src.id ? '#7C3AED' : '#64748B',
              }}
            >
              {src.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { id: 'unresolved', label: 'Needs Review' },
            { id: 'resolved', label: 'Mastered' },
            { id: 'all', label: 'All' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: filterStatus === st.id ? '1px solid #9333EA' : '1px solid #CBD5E1',
                backgroundColor: filterStatus === st.id ? '#9333EA' : '#FFFFFF',
                color: filterStatus === st.id ? '#FFFFFF' : '#475569',
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mistakes Question List */}
      {filteredMistakes.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px dashed #CBD5E1',
          }}
        >
          <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
            No incorrect MCQs found in this filter
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
            Great job! You have no unresolved mistakes under this view.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredMistakes.map((item, idx) => {
            const isSubmitted = retakeSubmitted[item.id];
            const chosenOption = userRetakeAnswers[item.id];

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: item.isResolved ? '1px solid #E2E8F0' : '2px solid #FCA5A5',
                  padding: '28px',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                }}
              >
                {/* Header Meta Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: item.source === 'CBT Mock' ? '#FEE2E2' : '#E0E7FF',
                        color: item.source === 'CBT Mock' ? '#DC2626' : '#4338CA',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {item.source === 'CBT Mock' ? <FileCheck2 size={13} /> : <BookOpen size={13} />}
                      {item.source} {item.testTitle ? `• ${item.testTitle}` : ''}
                    </span>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: '#F3E8FF',
                        color: '#7C3AED',
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      {item.subject} {item.topic ? `> ${item.topic}` : ''}
                    </span>
                  </div>

                  {/* Toggle Mastered Button */}
                  <button
                    onClick={() => toggleMistakeResolved(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: item.isResolved ? '#10B981' : '#CBD5E1',
                      backgroundColor: item.isResolved ? '#ECFDF5' : '#FFFFFF',
                      color: item.isResolved ? '#059669' : '#64748B',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <CheckCircle2 size={14} color={item.isResolved ? '#059669' : '#94A3B8'} />
                    <span>{item.isResolved ? 'Mastered' : 'Mark as Mastered'}</span>
                  </button>
                </div>

                {/* Question Text */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.5, marginBottom: '20px' }}>
                  {idx + 1}. {item.questionText}
                </h3>

                {/* Options Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {item.options.map((opt) => {
                    const isOriginalWrongChoice = opt.id === item.selectedOption;
                    const isCorrectAnswer = opt.id === item.correctOption;
                    const isUserRetakeChosen = chosenOption === opt.id;

                    let bg = '#F8FAFC';
                    let border = '1px solid #E2E8F0';
                    let labelColor = '#334155';

                    if (isSubmitted) {
                      if (isCorrectAnswer) {
                        bg = '#DCFCE7';
                        border = '2px solid #16A34A';
                        labelColor = '#15803D';
                      } else if (isUserRetakeChosen && !isCorrectAnswer) {
                        bg = '#FEE2E2';
                        border = '2px solid #DC2626';
                        labelColor = '#991B1B';
                      }
                    } else if (isUserRetakeChosen) {
                      bg = '#F3E8FF';
                      border = '2px solid #9333EA';
                      labelColor = '#7C3AED';
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectRetakeOption(item.id, opt.id)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '10px',
                          backgroundColor: bg,
                          border: border,
                          cursor: isSubmitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <strong
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8125rem',
                              color: labelColor,
                            }}
                          >
                            {opt.id}
                          </strong>
                          <span style={{ fontSize: '0.9rem', color: labelColor, fontWeight: 500 }}>
                            {opt.text}
                          </span>
                        </div>

                        {/* Badges for previous vs retake status */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {!isSubmitted && isOriginalWrongChoice && (
                            <span style={{ fontSize: '0.75rem', color: '#DC2626', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                              Your Previous Choice ❌
                            </span>
                          )}
                          {isSubmitted && isCorrectAnswer && (
                            <span style={{ fontSize: '0.75rem', color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              Correct Option ✔️
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Retake Check Action */}
                {!isSubmitted ? (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <button
                      disabled={!chosenOption}
                      onClick={() => handleCheckRetakeAnswer(item)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        backgroundColor: chosenOption ? '#7C3AED' : '#94A3B8',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: chosenOption ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <RotateCcw size={16} /> Check Answer & Reveal Explanation
                    </button>
                  </div>
                ) : null}

                {/* Explanation Box (Visible if retake submitted or student requests) */}
                {(isSubmitted || item.isResolved) && (
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '12px',
                      padding: '18px 20px',
                      borderLeft: '4px solid #7C3AED',
                      marginTop: '16px',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HelpCircle size={16} color="#7C3AED" /> Faculty Explanation & Concept Breakdown
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                      {item.explanation}
                    </p>
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
