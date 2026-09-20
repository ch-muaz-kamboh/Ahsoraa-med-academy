'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { FileCheck2, Plus, ShieldCheck, Clock, CheckCircle2, History, Copy } from 'lucide-react';

export default function StaffAssessmentsPage() {
  const { mockSnapshots, createMockSnapshot, staffProfile } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [versionLabel, setVersionLabel] = useState('');

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionLabel) return;
    createMockSnapshot(versionLabel, ['qb-BIO-BCH-WAT-001-1', 'qb-BIO-BCH-WAT-002-2']);
    setVersionLabel('');
    setShowModal(false);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            IMAT Assessments & Mock Version Snapshots
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Freeze versioned mock configurations (60 Qs / 100 Min / +1.5, -0.4 scoring) so future question bank edits do not distort historical attempt scores.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ backgroundColor: '#2563EB', padding: '10px 18px', fontSize: '0.875rem' }}
        >
          <Plus size={16} /> Create Immutable Version Snapshot
        </button>
      </div>

      {/* Snapshot Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockSnapshots.map((snap) => (
          <div key={snap.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#F3E8FF',
                    color: '#8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <History size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                    {snap.versionLabel}
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                    Created by: <strong style={{ color: '#0F172A' }}>{snap.createdBy}</strong> • Date: {new Date(snap.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8125rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{snap.questionsCount} Qs</div>
                  <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Questions</div>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8125rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{snap.durationMinutes} Min</div>
                  <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Time Limit</div>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8125rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#10B981' }}>+1.5 / -0.4</div>
                  <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Rules (Max 90)</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Snapshot Modal */}
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
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Create Versioned Mock Snapshot
            </h3>

            <form onSubmit={handleCreateSnapshot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Version Label / Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. IMAT Official Simulation 2026 v2.0"
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                />
              </div>

              <div style={{ backgroundColor: '#EFF6FF', padding: '12px 16px', borderRadius: '8px', fontSize: '0.8125rem', color: '#1E40AF', lineHeight: 1.5 }}>
                ℹ️ <strong>Rules Enforced:</strong> 60 Questions, 100 Minutes, +1.5 for Correct, -0.4 for Incorrect, Max 90 Score.
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#2563EB' }}>Create Snapshot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
