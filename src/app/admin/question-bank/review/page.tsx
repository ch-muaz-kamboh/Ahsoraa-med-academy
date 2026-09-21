'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  BookOpen,
  User,
  ShieldCheck,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function AdminMCQReviewPage() {
  const { staffQuestions, approveStaffQuestion, declineStaffQuestion, deleteStaffQuestion } = useAppStore();

  const [activeTab, setActiveTab] = useState<'pending' | 'published' | 'declined' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Modal states
  const [declineModalId, setDeclineModalId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter staff questions
  const pendingCount = staffQuestions.filter((q) => q.status === 'in_review').length;
  const publishedCount = staffQuestions.filter((q) => q.status === 'published').length;
  const declinedCount = staffQuestions.filter((q) => q.status === 'draft' && q.reviewNote).length;

  const filteredQuestions = staffQuestions.filter((q) => {
    // Tab filter
    if (activeTab === 'pending' && q.status !== 'in_review') return false;
    if (activeTab === 'published' && q.status !== 'published') return false;
    if (activeTab === 'declined' && !(q.status === 'draft' && q.reviewNote)) return false;

    // Subject filter
    if (selectedSubject !== 'All' && q.subject.toLowerCase() !== selectedSubject.toLowerCase()) return false;

    // Search filter
    if (searchQuery.trim()) {
      const sq = searchQuery.toLowerCase();
      const textMatch = q.question_text?.toLowerCase().includes(sq);
      const subjectMatch = q.subject?.toLowerCase().includes(sq);
      const topicMatch = q.topic?.toLowerCase().includes(sq);
      const authorMatch = q.author?.toLowerCase().includes(sq);
      if (!textMatch && !subjectMatch && !topicMatch && !authorMatch) return false;
    }

    return true;
  });

  const handleApprove = (id: string) => {
    approveStaffQuestion(id, 'Approved by Admin');
    showToast('MCQ approved and published to the active question bank!');
  };

  const handleDeclineSubmit = () => {
    if (!declineModalId) return;
    if (!declineReason.trim()) {
      alert('Please enter a feedback reason for declining.');
      return;
    }
    declineStaffQuestion(declineModalId, declineReason.trim());
    setDeclineModalId(null);
    setDeclineReason('');
    showToast('MCQ declined and returned to staff with feedback.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this staff MCQ?')) {
      deleteStaffQuestion(id);
      showToast('MCQ deleted successfully.');
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'easy':
        return <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Easy</span>;
      case 'medium':
        return <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Medium</span>;
      case 'hard':
        return <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Hard</span>;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#0F172A', color: '#FFF',
          padding: '12px 20px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 999,
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/admin/question-bank" style={{ color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.875rem' }}>
              <ArrowLeft size={16} /> Back to Main Question Bank
            </Link>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            Staff MCQ Approval Center
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
            Review, approve, or decline questions submitted by faculty staff before they go live for students.
          </p>
        </div>
      </div>

      {/* Quick Stats & Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            backgroundColor: activeTab === 'pending' ? '#EFF6FF' : '#FFFFFF',
            border: activeTab === 'pending' ? '2px solid #2563EB' : '1px solid #E2E8F0',
            borderRadius: '12px', padding: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563EB' }}>Pending Review</span>
            <Clock size={20} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginTop: '8px' }}>{pendingCount}</div>
        </button>

        <button
          onClick={() => setActiveTab('published')}
          style={{
            backgroundColor: activeTab === 'published' ? '#F0FDF4' : '#FFFFFF',
            border: activeTab === 'published' ? '2px solid #16A34A' : '1px solid #E2E8F0',
            borderRadius: '12px', padding: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#16A34A' }}>Approved & Live</span>
            <CheckCircle2 size={20} color="#16A34A" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginTop: '8px' }}>{publishedCount}</div>
        </button>

        <button
          onClick={() => setActiveTab('declined')}
          style={{
            backgroundColor: activeTab === 'declined' ? '#FEF2F2' : '#FFFFFF',
            border: activeTab === 'declined' ? '2px solid #DC2626' : '1px solid #E2E8F0',
            borderRadius: '12px', padding: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#DC2626' }}>Declined (Needs Revision)</span>
            <XCircle size={20} color="#DC2626" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginTop: '8px' }}>{declinedCount}</div>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          style={{
            backgroundColor: activeTab === 'all' ? '#F8FAFC' : '#FFFFFF',
            border: activeTab === 'all' ? '2px solid #475569' : '1px solid #E2E8F0',
            borderRadius: '12px', padding: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>All Staff Submissions</span>
            <BookOpen size={20} color="#475569" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginTop: '8px' }}>{staffQuestions.length}</div>
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search by question text, subject, topic, or staff email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748B" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFF' }}
          >
            <option value="All">All Subjects</option>
            <option value="Biology">Biology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Physics">Physics</option>
            <option value="Logical Reasoning">Logical Reasoning</option>
            <option value="General Knowledge">General Knowledge</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '48px 24px', textAlign: 'center' }}>
          <ShieldCheck size={48} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>No MCQs found</h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '4px' }}>
            {activeTab === 'pending'
              ? 'There are no pending staff MCQs waiting for approval.'
              : 'No staff MCQs match the current filters.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredQuestions.map((q) => {
            const optionsList = [
              { key: 'A', text: q.option_a },
              { key: 'B', text: q.option_b },
              { key: 'C', text: q.option_c },
              { key: 'D', text: q.option_d },
              ...(q.option_e ? [{ key: 'E', text: q.option_e }] : []),
            ];

            return (
              <div
                key={q.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: q.status === 'in_review' ? '1px solid #93C5FD' : '1px solid #E2E8F0',
                  boxShadow: q.status === 'in_review' ? '0 4px 12px rgba(37, 99, 235, 0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
                  padding: '20px',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Question Header Metadata */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {q.subject}
                    </span>
                    {q.topic && (
                      <span style={{ backgroundColor: '#F8FAFC', color: '#64748B', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid #E2E8F0' }}>
                        {q.topic}
                      </span>
                    )}
                    {getDifficultyBadge(q.difficulty)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Status Badge */}
                    {q.status === 'in_review' && (
                      <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> Pending Approval
                      </span>
                    )}
                    {q.status === 'published' && (
                      <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Published
                      </span>
                    )}
                    {q.status === 'draft' && q.reviewNote && (
                      <span style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={14} /> Declined
                      </span>
                    )}
                  </div>
                </div>

                {/* Author & Date info */}
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} color="#94A3B8" /> Staff: <strong style={{ color: '#334155' }}>{q.author || 'Staff Member'}</strong>
                  </span>
                  {q.createdAt && (
                    <span>• Submitted: {new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  )}
                </div>

                {/* Question Text */}
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px', lineHeight: 1.5 }}>
                  {q.question_text}
                </div>

                {/* Options grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                  {optionsList.map((opt) => {
                    const isCorrect = opt.key === q.correct_option;
                    return (
                      <div
                        key={opt.key}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: isCorrect ? '2px solid #10B981' : '1px solid #E2E8F0',
                          backgroundColor: isCorrect ? '#F0FDF4' : '#FAFAFA',
                          fontSize: '0.875rem',
                          color: isCorrect ? '#14532D' : '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>
                          <strong style={{ marginRight: '8px' }}>{opt.key}.</strong> {opt.text}
                        </span>
                        {isCorrect && (
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#10B981', color: '#FFF', padding: '2px 6px', borderRadius: '4px' }}>
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div style={{ backgroundColor: '#F8FAFC', borderLeft: '4px solid #3B82F6', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: '0.85rem', color: '#475569', marginBottom: '16px' }}>
                    <strong style={{ color: '#1E293B' }}>Explanation:</strong> {q.explanation}
                  </div>
                )}

                {/* Review Note if Declined */}
                {q.reviewNote && (
                  <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#991B1B', marginBottom: '16px' }}>
                    <strong>Admin Feedback:</strong> {q.reviewNote}
                  </div>
                )}

                {/* Admin Actions Footer */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <button
                    onClick={() => handleDelete(q.id)}
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                  >
                    <Trash2 size={15} /> Delete
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {q.status === 'in_review' && (
                      <>
                        <button
                          onClick={() => {
                            setDeclineModalId(q.id);
                            setDeclineReason('');
                          }}
                          style={{
                            backgroundColor: '#FFFFFF', border: '1px solid #EF4444', color: '#DC2626',
                            padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s ease'
                          }}
                        >
                          <XCircle size={16} /> Decline MCQ
                        </button>

                        <button
                          onClick={() => handleApprove(q.id)}
                          style={{
                            backgroundColor: '#16A34A', border: 'none', color: '#FFFFFF',
                            padding: '8px 20px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(22, 163, 74, 0.2)'
                          }}
                        >
                          <CheckCircle2 size={16} /> Approve & Publish
                        </button>
                      </>
                    )}

                    {q.status === 'published' && (
                      <button
                        onClick={() => {
                          setDeclineModalId(q.id);
                          setDeclineReason('');
                        }}
                        style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#64748B', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Revoke Approval
                      </button>
                    )}

                    {q.status === 'draft' && (
                      <button
                        onClick={() => handleApprove(q.id)}
                        style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Re-Approve Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decline Feedback Modal */}
      {declineModalId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Decline Staff MCQ
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '16px' }}>
              Please provide feedback explaining why this MCQ is being declined so the staff member can revise it.
            </p>

            <textarea
              rows={4}
              placeholder="e.g. Option C is incorrect, or explanation needs more details regarding cell cycle phases..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', marginBottom: '20px', fontFamily: 'sans-serif' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setDeclineModalId(null);
                  setDeclineReason('');
                }}
                style={{ backgroundColor: '#F1F5F9', border: 'none', color: '#475569', padding: '10px 18px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineSubmit}
                style={{ backgroundColor: '#DC2626', border: 'none', color: '#FFFFFF', padding: '10px 20px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Decline MCQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
