'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, CheckCircle, Send, Sparkles } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultExam?: string;
  defaultCountry?: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  defaultExam = 'USMLE Step 1',
  defaultCountry = 'Italy',
}: LeadModalProps) {
  const { addLead } = useAppStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'United States',
    city: '',
    academicBackground: 'High School Senior / Pre-Med',
    targetExam: defaultExam,
    targetCountry: defaultCountry,
    budgetRange: '$5,000 - $15,000/yr',
    source: 'Website Counselling Modal',
    priority: 'hot' as const,
    stage: 'new' as const,
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in your name, email and phone number.');
      return;
    }

    addLead(formData);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
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
      onClick={handleResetAndClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#EFF6FF',
            borderBottom: '1px solid #DBEAFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', color: '#1E3A8A', margin: 0 }}>
                Book Free Medical Counselling
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#3B82F6', margin: 0 }}>
                1-on-1 Strategy Session with Senior Medical Admissions Advisors
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: '#64748B',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <CheckCircle size={36} />
              </div>
              <h4 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '8px' }}>
                Counselling Request Confirmed!
              </h4>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '24px' }}>
                Your case profile has been created and assigned to our Senior Admissions Team. A counsellor will reach out via WhatsApp and Email within 24 hours.
              </p>
              <button
                onClick={handleResetAndClose}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zainab Al-Mansoor"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Medical Exam</label>
                  <select
                    className="form-select"
                    value={formData.targetExam}
                    onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                  >
                    <option value="USMLE Step 1">USMLE Step 1</option>
                    <option value="IMAT (Italy Medical Entrance)">IMAT (Italy MBBS)</option>
                    <option value="PLAB 1 / UKMLA">PLAB 1 / UKMLA</option>
                    <option value="NEET PG">NEET PG</option>
                    <option value="Medical German B2/C1">Medical German Approbation</option>
                    <option value="Direct University Admission">Direct University Admission</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Destination</label>
                  <select
                    className="form-select"
                    value={formData.targetCountry}
                    onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                  >
                    <option value="Italy">Italy (Public MD)</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Hungary">Hungary (Semmelweis/Debrecen)</option>
                    <option value="Germany">Germany (Residency/Approbation)</option>
                    <option value="United States">United States</option>
                    <option value="Georgia">Georgia (USMD)</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Academic Background</label>
                  <input
                    type="text"
                    placeholder="e.g. IB Diploma, A-Levels, FSc Pre-Med, MBBS Graduate"
                    className="form-input"
                    value={formData.academicBackground}
                    onChange={(e) =>
                      setFormData({ ...formData, academicBackground: e.target.value })
                    }
                  />
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  <Send size={16} />
                  Submit & Connect with Admissions Counsellor
                </button>
              </div>

              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#94A3B8',
                  textAlign: 'center',
                  marginTop: '12px',
                  marginBottom: 0,
                }}
              >
                🔒 Your information is confidential and protected by Ahsora Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
