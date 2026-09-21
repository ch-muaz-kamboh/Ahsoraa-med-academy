'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { HelpCircle, CheckCircle2, MessageSquare, Send, Filter, Clock, User, Check } from 'lucide-react';

const SUBJECT_OPTIONS = [
  'All Subjects',
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Logical Reasoning',
  'General Knowledge',
  'Admissions & Visa Guidance',
];

export default function StaffDoubtsPage() {
  const { doubts, answerDoubt, staffProfile } = useAppStore();
  const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [toastMsg, setToastMsg] = useState('');

  const selectedDoubt = doubts.find((d) => d.id === selectedDoubtId);

  const filteredDoubts = doubts.filter((d) => {
    if (subjectFilter !== 'All Subjects' && d.subject.toLowerCase() !== subjectFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  const openDoubtsCount = filteredDoubts.filter((d) => d.status !== 'resolved').length;

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoubtId || !answerText.trim()) return;

    answerDoubt(selectedDoubtId, answerText.trim());
    setAnswerText('');
    setSelectedDoubtId(null);
    setToastMsg('Answer submitted successfully! The student can now view your response on their portal.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#0F172A', color: '#FFF',
          padding: '12px 20px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 999,
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          Subject Teacher Doubt Resolution Desk
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Review and respond to questions submitted by students. Your answers are published directly to the student's portal.
        </p>
      </div>

      {/* Subject Filter Bar */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={16} /> Filter Subject:
        </span>
        {SUBJECT_OPTIONS.map((subj) => (
          <button
            key={subj}
            onClick={() => setSubjectFilter(subj)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: subjectFilter === subj ? 700 : 500,
              backgroundColor: subjectFilter === subj ? '#2563EB' : '#F1F5F9',
              color: subjectFilter === subj ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {subj}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Doubts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
              Student Doubts ({filteredDoubts.length})
            </h2>
            {openDoubtsCount > 0 && (
              <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                {openDoubtsCount} Needs Response
              </span>
            )}
          </div>

          {filteredDoubts.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B' }}>
              No doubts found for this subject filter.
            </div>
          ) : (
            filteredDoubts.map((doubt) => {
              const isSelected = doubt.id === selectedDoubtId;
              const isResolved = doubt.status === 'resolved';

              return (
                <div
                  key={doubt.id}
                  onClick={() => setSelectedDoubtId(doubt.id)}
                  style={{
                    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                    borderRadius: '12px',
                    padding: '20px',
                    border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    borderLeft: isResolved ? '4px solid #10B981' : '4px solid #F59E0B',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ backgroundColor: '#F1F5F9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {doubt.subject}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isResolved ? '#10B981' : '#F59E0B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isResolved ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                      {isResolved ? 'RESOLVED' : 'PENDING'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                    {doubt.title}
                  </h4>

                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 10px 0', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {doubt.questionText || doubt.question}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} color="#94A3B8" /> Asked by: <strong style={{ color: '#334155' }}>{doubt.studentName || 'Student'}</strong>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Doubt Answer Desk Panel */}
        <div>
          {selectedDoubt ? (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', position: 'sticky', top: '88px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '4px 10px', borderRadius: '6px' }}>
                  {selectedDoubt.subject} {selectedDoubt.topic ? `— ${selectedDoubt.topic}` : ''}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Asked by {selectedDoubt.studentName}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                {selectedDoubt.title}
              </h3>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Student Question / Scenario:
                </div>
                <p style={{ fontSize: '0.9rem', color: '#1E293B', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {selectedDoubt.questionText || selectedDoubt.question || selectedDoubt.title}
                </p>
              </div>

              {(selectedDoubt.resolutionNote || selectedDoubt.answer) && (
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Current Faculty Response (by {selectedDoubt.facultyName || selectedDoubt.assignedMentorName || 'Teacher'}):
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedDoubt.resolutionNote || selectedDoubt.answer}
                  </p>
                </div>
              )}

              <form onSubmit={handleAnswerSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Your Faculty Explanation / Answer *
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Provide a detailed, step-by-step academic explanation to clarify this student's doubt..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', fontFamily: 'sans-serif' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  <Send size={16} /> Publish Faculty Answer to Student Portal
                </button>
              </form>
            </div>
          ) : (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '48px 24px', textAlign: 'center', color: '#64748B' }}>
              <HelpCircle size={44} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#334155' }}>Select a Doubt to Respond</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                Click any student question from the left list to review details and post your teacher response.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
