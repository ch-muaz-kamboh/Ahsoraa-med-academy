'use client';

import React, { useState } from 'react';
import { FolderCheck, CheckCircle2, XCircle, AlertTriangle, FileText, Download } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { StudentDocument } from '@/types';

export default function AdminDocumentsPage() {
  const { documents, updateDocStatus } = useAppStore();
  const [rejectModalDoc, setRejectModalDoc] = useState<StudentDocument | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  const handleApprove = (id: string) => {
    updateDocStatus(id, 'approved');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalDoc) return;

    updateDocStatus(rejectModalDoc.id, 'revision_requested', rejectionNote);
    setRejectModalDoc(null);
    setRejectionNote('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          Document Verification & Approval Queue
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Review uploaded student files, verify apostilles and language certificates, and issue certified approvals.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="card"
            style={{
              backgroundColor: '#FFFFFF',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.0625rem', color: '#0F172A', marginBottom: '2px' }}>
                    {doc.title}
                  </h4>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                    {doc.fileName} • Category: <strong style={{ color: '#0F172A' }}>{doc.category.replace('_', ' ')}</strong> • Version {doc.version}
                  </div>
                </div>
              </div>

              {/* Status & Review Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  className={
                    doc.status === 'approved'
                      ? 'badge badge-green'
                      : doc.status === 'revision_requested'
                      ? 'badge badge-amber'
                      : 'badge badge-blue'
                  }
                >
                  {doc.status.toUpperCase().replace('_', ' ')}
                </span>

                <button
                  onClick={() => alert(`Opening secure signed preview for ${doc.fileName}`)}
                  className="btn-outline"
                  style={{ padding: '8px 14px', fontSize: '0.8125rem' }}
                >
                  View File
                </button>

                {doc.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(doc.id)}
                    className="btn-primary"
                    style={{ backgroundColor: '#10B981', padding: '8px 14px', fontSize: '0.8125rem' }}
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                )}

                {doc.status !== 'revision_requested' && (
                  <button
                    onClick={() => setRejectModalDoc(doc)}
                    className="btn-outline"
                    style={{ color: '#DC2626', borderColor: '#FECACA', padding: '8px 14px', fontSize: '0.8125rem' }}
                  >
                    <XCircle size={16} /> Request Revision
                  </button>
                )}
              </div>
            </div>

            {doc.rejectionReason && (
              <div
                style={{
                  marginTop: '16px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#92400E',
                  fontSize: '0.8125rem',
                }}
              >
                <strong>Current Revision Request:</strong> {doc.rejectionReason}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Revision Request Modal */}
      {rejectModalDoc && (
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
          onClick={() => setRejectModalDoc(null)}
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
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '8px' }}>
              Request Document Revision
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '16px' }}>
              Explain to the student what changes or certified translations are required.
            </p>

            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <label className="form-label">Reviewer Instructions / Rejection Reason *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Please attach all 4 pages including the official Italian apostille stamp..."
                  className="form-textarea"
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setRejectModalDoc(null)}
                  className="btn-outline"
                  style={{ fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#D97706', fontSize: '0.875rem' }}>
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
