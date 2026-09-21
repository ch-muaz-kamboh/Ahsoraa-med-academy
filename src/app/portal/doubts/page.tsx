'use client';

import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle, Clock, MessageSquare, Plus, Filter, BookOpen } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const SUBJECT_OPTIONS = [
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Logical Reasoning',
  'General Knowledge',
  'Admissions & Visa Guidance',
];

export default function PortalDoubtsPage() {
  const { doubts, addDoubt } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  const [formData, setFormData] = useState({
    subject: 'Biology',
    topic: '',
    title: '',
    questionText: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.questionText.trim()) return;

    addDoubt({
      subject: formData.subject,
      topic: formData.topic.trim() || 'General Concept',
      title: formData.title.trim(),
      questionText: formData.questionText.trim(),
    });

    setFormData({ subject: 'Biology', topic: '', title: '', questionText: '' });
    setShowForm(false);
  };

  const filteredDoubts = doubts.filter((item) => {
    if (selectedSubjectFilter !== 'All' && item.subject.toLowerCase() !== selectedSubjectFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
            Academic Doubt Resolution Desk
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Ask questions on specific subjects directly to our teaching staff and receive step-by-step faculty answers.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
          }}
        >
          <Plus size={18} />
          <span>Ask New Question</span>
        </button>
      </div>

      {/* New Question Form */}
      {showForm && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '28px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
            Submit New Academic Doubt
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Target Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFF' }}
                >
                  {SUBJECT_OPTIONS.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Topic / Sub-specialty
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cell Membrane Transport, Organic Reactions..."
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Question Summary / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Why is active transport required against the concentration gradient?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Detailed Question / Context *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe your reasoning, specific question options, or where you need clarification..."
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', fontFamily: 'sans-serif' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ backgroundColor: '#F1F5F9', border: 'none', color: '#475569', padding: '10px 18px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={16} /> Submit to Subject Teacher
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Filter size={15} /> Filter Subject:
        </span>
        {['All', ...SUBJECT_OPTIONS].map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubjectFilter(subj)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: selectedSubjectFilter === subj ? 700 : 500,
              backgroundColor: selectedSubjectFilter === subj ? '#0F172A' : '#FFFFFF',
              color: selectedSubjectFilter === subj ? '#FFFFFF' : '#475569',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Doubts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredDoubts.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '40px', textAlign: 'center', color: '#64748B' }}>
            <HelpCircle size={40} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
            <p>No doubts submitted for this subject filter yet.</p>
          </div>
        ) : (
          filteredDoubts.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {item.subject}
                  </span>
                  {item.topic && (
                    <span style={{ backgroundColor: '#F8FAFC', color: '#64748B', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid #E2E8F0' }}>
                      {item.topic}
                    </span>
                  )}
                </div>
                <span style={{
                  backgroundColor: item.status === 'resolved' ? '#DCFCE7' : '#FEF3C7',
                  color: item.status === 'resolved' ? '#15803D' : '#B45309',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  {item.status === 'resolved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {item.status === 'resolved' ? 'RESOLVED BY TEACHER' : 'PENDING TEACHER RESPONSE'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {item.title}
              </h3>

              <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '16px' }}>
                {item.questionText || item.question}
              </p>

              {/* Faculty Response Box */}
              {(item.resolutionNote || item.answer) ? (
                <div
                  style={{
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #86EFAC',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#14532D',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    marginTop: '12px'
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D' }}>
                    <CheckCircle size={18} color="#16A34A" />
                    <span>Faculty Response from {item.facultyName || item.assignedMentorName || 'Subject Specialist Teacher'}:</span>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', color: '#166534' }}>{item.resolutionNote || item.answer}</div>
                  {item.answeredAt && (
                    <div style={{ fontSize: '0.75rem', color: '#15803D', marginTop: '8px', fontStyle: 'italic' }}>
                      Answered on {new Date(item.answeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> Submitted on {new Date(item.createdAt).toLocaleDateString()} — Assigned to {item.subject} Subject Teacher
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
