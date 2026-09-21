'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { HelpCircle, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export default function StaffDoubtsPage() {
  const { doubts, answerDoubt, staffProfile } = useAppStore();
  const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  const selectedDoubt = doubts.find((d) => d.id === selectedDoubtId);

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoubtId || !answerText) return;
    answerDoubt(selectedDoubtId, answerText);
    setAnswerText('');
    setSelectedDoubtId(null);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
          Subject-Scoped Student Doubt Resolution Desk
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          View, answer, and clarify student questions submitted for your assigned subjects (<strong>{staffProfile.assignedSubjects.join(', ')}</strong>).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Doubts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>
            Submitted Student Doubts ({doubts.length})
          </h2>

          {doubts.map((doubt) => (
            <div
              key={doubt.id}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderLeft: doubt.status === 'resolved' ? '4px solid #10B981' : '4px solid #F59E0B',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedDoubtId(doubt.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-blue">{doubt.subject}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: doubt.status === 'resolved' ? '#10B981' : '#F59E0B',
                  }}
                >
                  {doubt.status.toUpperCase()}
                </span>
              </div>

              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>
                {doubt.questionText || doubt.question || doubt.title}
              </p>

              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                Asked by: <strong>{doubt.studentName}</strong> • {new Date(doubt.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Doubt Answer Desk Panel */}
        <div>
          {selectedDoubt ? (
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', position: 'sticky', top: '88px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                Answer Doubt #{selectedDoubt.id}
              </h3>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>Student Question:</div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                  {selectedDoubt.questionText || selectedDoubt.question || selectedDoubt.title}
                </p>
              </div>

              {(selectedDoubt.resolutionNote || selectedDoubt.answer) && (
                <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginBottom: '4px' }}>Existing Faculty Response:</div>
                  <p style={{ fontSize: '0.875rem', color: '#065F46', margin: 0 }}>
                    {selectedDoubt.resolutionNote || selectedDoubt.answer}
                  </p>
                </div>
              )}

              <form onSubmit={handleAnswerSubmit}>
                <div className="form-group">
                  <label className="form-label">Faculty Explanation / Answer *</label>
                  <textarea
                    rows={5}
                    required
                    className="form-textarea"
                    placeholder="Provide a step-by-step academic explanation..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', backgroundColor: '#2563EB', marginTop: '12px' }}
                >
                  <Send size={16} /> Submit Faculty Answer
                </button>
              </form>
            </div>
          ) : (
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '40px', textAlign: 'center', color: '#64748B' }}>
              <HelpCircle size={40} color="#94A3B8" style={{ marginBottom: '12px' }} />
              <p>Select a student doubt from the left list to answer it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
