'use client';

import React, { useState } from 'react';
import {
  FolderLock,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DocumentCategory } from '@/types';

export default function PortalDocumentsPage() {
  const { documents, addDocument } = useAppStore();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'academic_certificate' as DocumentCategory,
    fileName: '',
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title) return;

    addDocument({
      title: uploadData.title,
      category: uploadData.category,
      fileName: uploadData.fileName || `${uploadData.title.replace(/\s+/g, '_')}.pdf`,
      fileSizeBytes: 2400000,
      status: 'under_review',
    });

    setUploadData({ title: '', category: 'academic_certificate', fileName: '' });
    setShowUploadModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-green">✓ Verified & Approved</span>;
      case 'under_review':
        return <span className="badge badge-blue">● Under Review</span>;
      case 'revision_requested':
        return <span className="badge badge-amber">⚠ Revision Requested</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
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
            Secure Document Vault
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Private, encrypted storage for your passports, academic apostilles, language certifications, and financial declarations.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.875rem' }}
        >
          <Upload size={16} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
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
          onClick={() => setShowUploadModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '16px' }}>
              Upload Document to Secure Vault
            </h3>

            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIMEA Comparability Certificate"
                  className="form-input"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={uploadData.category}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, category: e.target.value as DocumentCategory })
                  }
                >
                  <option value="identity_passport">International Passport</option>
                  <option value="academic_certificate">Academic Diploma / Certificate</option>
                  <option value="transcript">Official Transcript & Marksheet</option>
                  <option value="attestation_legalization">Attestation / Legalization (DOV/CIMEA)</option>
                  <option value="language_certificate">Language Proficiency (IELTS/TOEFL)</option>
                  <option value="financial_document">Financial Sponsorship / ISEE</option>
                  <option value="visa_document">Visa / Embassy Document</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select File (PDF, JPG, PNG)</label>
                <input
                  type="file"
                  className="form-input"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadData({ ...uploadData, fileName: e.target.files[0].name });
                    }
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-outline"
                  style={{ fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ fontSize: '0.875rem' }}>
                  Upload to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="card"
            style={{
              backgroundColor: '#FFFFFF',
              padding: '20px 24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: doc.rejectionReason ? '12px' : 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '2px' }}>
                    {doc.title}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {doc.fileName} • {(doc.fileSizeBytes / 1000000).toFixed(1)} MB • Version {doc.version}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {getStatusBadge(doc.status)}
                <button
                  onClick={() => alert(`Downloading verified copy of ${doc.fileName}`)}
                  className="btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>

            {/* Rejection / Revision Note */}
            {doc.status === 'revision_requested' && doc.rejectionReason && (
              <div
                style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#92400E',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <AlertTriangle size={16} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong>Reviewer Feedback ({doc.reviewedBy || 'Admissions Officer'}):</strong>{' '}
                  {doc.rejectionReason}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
