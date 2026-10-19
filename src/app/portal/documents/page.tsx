'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Eye,
  FileUp,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DocumentCategory } from '@/types';
import {
  getPackageByIdOrName,
  isDocumentVaultLocked,
  resolveEffectivePackage,
} from '@/lib/packages';

export default function PortalDocumentsPage() {
  const { documents, addDocument, deleteDocument, currentUser } = useAppStore();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'academic_certificate' as DocumentCategory,
    fileName: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileObj(file);
      setUploadData((prev) => ({
        ...prev,
        fileName: file.name,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFileDataUrl((ev.target?.result as string) || '');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title) return;

    addDocument({
      title: uploadData.title,
      category: uploadData.category,
      fileName: uploadData.fileName || fileObj?.name || `${uploadData.title.replace(/\s+/g, '_')}.pdf`,
      fileSizeBytes: fileObj?.size || 1800000,
      status: 'under_review',
      fileDataUrl: fileDataUrl || undefined,
      studentEmail: currentUser.email,
      studentId: currentUser.id,
    });

    setUploadData({ title: '', category: 'academic_certificate', fileName: '' });
    setFileObj(null);
    setFileDataUrl('');
    setShowUploadModal(false);
  };

  const handleDownload = (doc: any) => {
    if (doc.fileDataUrl) {
      const a = document.createElement('a');
      a.href = doc.fileDataUrl;
      a.download = doc.fileName || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create a friendly text blob download
      const blob = new Blob([`Ahsora MedPath Elite - Official Document\nTitle: ${doc.title}\nCategory: ${doc.category}\nStatus: ${doc.status}\nUploaded: ${doc.uploadedAt}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || `${doc.title}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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

  const effectivePkg = resolveEffectivePackage(currentUser);
  const currentPkgObj = getPackageByIdOrName(effectivePkg);
  const isLocked = isDocumentVaultLocked(effectivePkg);

  if (isLocked) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div style={{ textAlign: 'center', maxWidth: '580px', padding: '24px' }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #F97316, #EA580C)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 20px 40px -8px rgba(249, 115, 22, 0.4)',
          }}>
            <Lock size={44} color="#FFFFFF" />
          </div>

          <div style={{ display: 'inline-block', backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', color: '#C2410C', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.5px', marginBottom: '16px' }}>
            DOCUMENT VAULT — EXCLUSIVE TO MEDPATH ELITE
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', marginBottom: '12px', lineHeight: 1.2 }}>
            This section is reserved for<br />
            <span style={{ color: '#EA580C' }}>Ahsora MedPath Elite</span> students
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '24px' }}>
            The Document Vault is a secure space where Elite students can safely upload and manage all their official university admission and visa application documents, directly reviewed by their senior advisor.
          </p>

          {/* Current Package Info */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '2px' }}>Your current enrolled plan</div>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9375rem' }}>{currentPkgObj.name} — {currentPkgObj.price}</div>
          </div>

          {/* What Path Elite Unlocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', textAlign: 'left' }}>
            {[
              'Dedicated Senior Medical Student Advisor Document Review',
              'Full Italian University Pre-Enrollment & DOV Submission',
              'Complete Student Visa Dossier Preparation & Legalization',
              'Guaranteed Admission & Housing Documentation Support',
            ].map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#334155' }}>
                <CheckCircle2 size={18} color="#EA580C" style={{ flexShrink: 0 }} />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20would%20like%20to%20upgrade%20to%20Ahsora%20MedPath%20Elite"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#EA580C',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px -4px rgba(234, 88, 12, 0.4)',
              }}
            >
              <Sparkles size={18} />
              Upgrade to MedPath Elite — €799
              <ArrowRight size={18} />
            </a>
            <Link
              href="/portal/dashboard"
              style={{
                padding: '14px 22px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                  required
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="form-input"
                  onChange={handleFileChange}
                />
                {fileObj && (
                  <div style={{ fontSize: '0.8125rem', color: '#059669', marginTop: '6px', fontWeight: 600 }}>
                    ✓ Selected: {fileObj.name} ({(fileObj.size / 1024).toFixed(0)} KB)
                  </div>
                )}
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

      {/* Preview Modal */}
      {previewDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setPreviewDoc(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '750px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{previewDoc.title}</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{previewDoc.fileName}</span>
              </div>
              <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748B' }}>✕</button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', textAlign: 'center', flex: 1, backgroundColor: '#F8FAFC' }}>
              {previewDoc.fileDataUrl?.startsWith('data:image/') ? (
                <img src={previewDoc.fileDataUrl} alt={previewDoc.title} style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain', borderRadius: '8px' }} />
              ) : previewDoc.fileDataUrl?.startsWith('data:application/pdf') ? (
                <iframe src={previewDoc.fileDataUrl} style={{ width: '100%', height: '55vh', border: 'none', borderRadius: '8px' }} />
              ) : (
                <div style={{ padding: '40px 20px', color: '#64748B' }}>
                  <FileText size={48} color="#EA580C" style={{ margin: '0 auto 16px', display: 'block' }} />
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: '#0F172A', marginBottom: '6px' }}>{previewDoc.fileName}</p>
                  <p style={{ fontSize: '0.85rem' }}>Encrypted document verified in MedPath Elite Vault.</p>
                </div>
              )}
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => handleDownload(previewDoc)} className="btn-primary" style={{ fontSize: '0.875rem' }}>
                <Download size={15} /> Download Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      {documents.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px dashed #E2E8F0',
            borderRadius: '20px',
            padding: '60px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#FFF7ED',
              color: '#EA580C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <FolderLock size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Your Document Vault is Empty
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.5 }}>
            No documents have been uploaded yet. Upload your passport, high school transcripts, or language certificates for your MedPath Elite advisor review.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.875rem' }}
          >
            <Upload size={16} />
            <span>Upload Your First Document</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px 24px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
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
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: '#FFF7ED',
                      color: '#EA580C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                      {doc.title}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span>{doc.fileName}</span>
                      <span>•</span>
                      <span>{(doc.fileSizeBytes / 1000000).toFixed(1)} MB</span>
                      <span>•</span>
                      <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {getStatusBadge(doc.status)}
                  {doc.fileDataUrl && (
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={13} /> View
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(doc)}
                    className="btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Download size={13} /> Download
                  </button>
                  {deleteDocument && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${doc.fileName}?`)) {
                          deleteDocument(doc.id);
                        }
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.75rem',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        border: '1px solid #FECACA',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
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
                    marginTop: '12px',
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
      )}
    </div>
  );
}
