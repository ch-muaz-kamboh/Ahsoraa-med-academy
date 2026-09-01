'use client';

import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle, Clock, MessageSquare, Plus } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function PortalDoubtsPage() {
  const { doubts, addDoubt } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: 'Cardiovascular Pathology',
    topic: 'Myocardial Infarction',
    title: '',
    questionText: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.questionText) return;

    addDoubt(formData);
    setFormData({ subject: 'Cardiovascular Pathology', topic: 'Myocardial Infarction', title: '', questionText: '' });
    setShowForm(false);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
            Academic Doubt Resolution Queue
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Submit questions on exam vignettes, pharmacology, or admissions criteria directly to our faculty.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.875rem' }}
        >
          <Plus size={16} />
          <span>Ask New Question</span>
        </button>
      </div>

      {/* New Question Form */}
      {showForm && (
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '16px' }}>
            Submit New Academic Doubt
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Topic / Sub-specialty</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Question Summary / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Differentiating papillary muscle rupture vs VSR murmurs"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Question / Clinical Scenario *</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your reasoning and where you are stuck..."
                className="form-textarea"
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-outline"
                style={{ fontSize: '0.875rem' }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ fontSize: '0.875rem' }}>
                <Send size={16} /> Submit to Faculty
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Doubts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {doubts.map((item) => (
          <div key={item.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="badge badge-blue">{item.subject}</span>
                <span className="badge badge-gray">{item.topic}</span>
              </div>
              <span className={item.status === 'resolved' ? 'badge badge-green' : 'badge badge-amber'}>
                {item.status.toUpperCase()}
              </span>
            </div>

            <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '8px' }}>
              {item.title}
            </h3>

            <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '16px' }}>
              {item.questionText}
            </p>

            {item.resolutionNote && (
              <div
                style={{
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '10px',
                  padding: '16px',
                  color: '#065F46',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} color="#10B981" />
                  <span>Faculty Resolution by {item.assignedMentorName || 'Senior Mentor'}:</span>
                </div>
                <div>{item.resolutionNote}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
