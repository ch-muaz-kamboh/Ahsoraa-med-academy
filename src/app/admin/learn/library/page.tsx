'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Library,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Download,
  X,
  BookOpen,
  Sparkles,
  Lock,
  Eye,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { LibraryResource } from '@/types';

export default function AdminLibraryManagerPage() {
  const { libraryResources, addLibraryResource, updateLibraryResource, deleteLibraryResource } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Scroll state & ref for the document modal
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(true);

  const checkScroll = () => {
    if (!modalContentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = modalContentRef.current;
    setShowScrollButton(scrollHeight > clientHeight + 15);
    setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 35);
  };

  useEffect(() => {
    if (isModalOpen) {
      setIsScrolledToBottom(false);
      const timer = setTimeout(checkScroll, 120);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const scrollToBottom = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({
        top: modalContentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const toggleScroll = () => {
    if (isScrolledToBottom) {
      scrollToTop();
    } else {
      scrollToBottom();
    }
  };

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LibraryResource['category']>('Book');
  const [subject, setSubject] = useState('Biology');
  const [fileUrl, setFileUrl] = useState('');
  const [pagesCount, setPagesCount] = useState(150);
  const [authorOrSource, setAuthorOrSource] = useState('Ahsora Medical Faculty');
  const [description, setDescription] = useState('');
  const [allowDownload, setAllowDownload] = useState(true);

  const openNewModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Book');
    setSubject('Biology');
    setFileUrl('/files/ahsora-high-yield-notes.pdf');
    setPagesCount(120);
    setAuthorOrSource('Ahsora Medical Faculty');
    setDescription('');
    setAllowDownload(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: LibraryResource) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setSubject(item.subject);
    setFileUrl(item.fileUrl);
    setPagesCount(item.pagesCount || 100);
    setAuthorOrSource(item.authorOrSource || '');
    setDescription(item.description || '');
    setAllowDownload(item.allowDownload !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateLibraryResource(editingId, {
        title,
        category,
        subject,
        fileUrl,
        pagesCount: Number(pagesCount),
        authorOrSource,
        description,
        allowDownload,
        accessMode: allowDownload ? 'download_and_read' : 'read_only',
      });
    } else {
      addLibraryResource({
        title,
        category,
        subject,
        fileUrl,
        fileSizeBytes: 15000000,
        pagesCount: Number(pagesCount),
        authorOrSource,
        description,
        downloadCount: 0,
        allowDownload,
        accessMode: allowDownload ? 'download_and_read' : 'read_only',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '24px 32px',
          borderRadius: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0' }}>
            Digital Library Manager (Admin Panel)
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: 0 }}>
            Upload or manage textbooks, PDF revision notes, formula cheat-sheets, and past exam papers for students.
          </p>
        </div>
        <button
          onClick={openNewModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '10px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={18} /> Upload New Book / Document
        </button>
      </div>

      {/* Library Resources Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
              <th style={{ padding: '16px 20px' }}>Resource Title</th>
              <th style={{ padding: '16px 20px' }}>Category</th>
              <th style={{ padding: '16px 20px' }}>Subject</th>
              <th style={{ padding: '16px 20px' }}>Pages / Author</th>
              <th style={{ padding: '16px 20px' }}>Access Permission</th>
              <th style={{ padding: '16px 20px' }}>PDF File Link</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {libraryResources.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.title}</div>
                  {item.description && (
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                      {item.description.slice(0, 70)}...
                    </div>
                  )}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                    }}
                  >
                    {item.category}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', color: '#334155', fontWeight: 600 }}>
                  {item.subject}
                </td>
                <td style={{ padding: '16px 20px', color: '#475569' }}>
                  <div>{item.pagesCount ? `${item.pagesCount} Pages` : 'N/A'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.authorOrSource || 'Faculty'}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  {item.allowDownload === false ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#FEF3C7',
                        color: '#B45309',
                        border: '1px solid #FDE68A',
                      }}
                    >
                      <Lock size={12} /> Read-Only
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        border: '1px solid #A7F3D0',
                      }}
                    >
                      <Download size={12} /> Download & Read
                    </span>
                  )}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#10B981', textDecoration: 'underline', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Download size={13} /> {item.allowDownload === false ? 'Preview PDF' : 'PDF Link'}
                  </a>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(item)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#F0FFF4',
                        color: '#059669',
                        border: '1px solid #BBF7D0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => deleteLibraryResource(item.id)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        border: '1px solid #FECACA',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header with Quick Scroll Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 28px',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                zIndex: 10,
                flexShrink: 0,
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {editingId ? 'Edit Library Resource' : 'Upload New Library Resource'}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Document metadata & student portal access settings
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Scroll Button */}
                <button
                  type="button"
                  id="btn-scroll-library-modal"
                  onClick={toggleScroll}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: isScrolledToBottom ? '#EFF6FF' : '#F8FAFC',
                    border: isScrolledToBottom ? '1px solid #93C5FD' : '1px solid #CBD5E1',
                    color: isScrolledToBottom ? '#1D4ED8' : '#334155',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title={isScrolledToBottom ? 'Scroll back to top' : 'Scroll down to bottom / submit'}
                >
                  {isScrolledToBottom ? (
                    <>
                      <ChevronUp size={15} /> Scroll to Top
                    </>
                  ) : (
                    <>
                      <ChevronDown size={15} /> Scroll to Bottom
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    border: 'none',
                    background: '#F1F5F9',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Close"
                >
                  <X size={18} color="#64748B" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div
                ref={modalContentRef}
                onScroll={checkScroll}
                style={{
                  padding: '24px 28px',
                  overflowY: 'auto',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  scrollBehavior: 'smooth',
                  position: 'relative',
                }}
              >
                {/* Floating Scroll Action Button */}
                {showScrollButton && (
                  <button
                    type="button"
                    onClick={toggleScroll}
                    style={{
                      position: 'sticky',
                      top: '0px',
                      alignSelf: 'flex-end',
                      zIndex: 15,
                      marginBottom: '-32px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 10px rgba(15, 23, 42, 0.25)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: 0.92,
                    }}
                    title={isScrolledToBottom ? 'Jump back to top' : 'Jump down to bottom'}
                  >
                    {isScrolledToBottom ? (
                      <>
                        <ArrowUp size={13} /> Back to Top
                      </>
                    ) : (
                      <>
                        <ArrowDown size={13} /> Scroll Down
                      </>
                    )}
                  </button>
                )}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Document / Book Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ahsora Biology High-Yield Comprehensive Review Book"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Resource Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  >
                    <option value="Book">Book</option>
                    <option value="PDF Notes">PDF Notes</option>
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="Past Paper">Past Paper</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Biology / Chemistry / IMAT"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Pages Count
                  </label>
                  <input
                    type="number"
                    value={pagesCount}
                    onChange={(e) => setPagesCount(Number(e.target.value))}
                    placeholder="150"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Author / Source
                  </label>
                  <input
                    type="text"
                    value={authorOrSource}
                    onChange={(e) => setAuthorOrSource(e.target.value)}
                    placeholder="Ahsora Medical Faculty"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Upload Document / PDF File
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#F0FFF4',
                      border: '1px dashed #10B981',
                      color: '#059669',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    <FileText size={16} /> Choose File from Computer
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.epub,.pptx"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const localUrl = URL.createObjectURL(file);
                          setFileUrl(localUrl);
                          if (!title) {
                            setTitle(file.name.replace(/\.[^/.]+$/, ""));
                          }
                        }
                      }}
                    />
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>or enter URL directly:</span>
                </div>
                <input
                  type="text"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="/files/ahsora-biology-high-yield-2026.pdf"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '8px' }}
                />
              </div>

              {/* Student Access Permission: Downloadable vs Read-Only */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                  Student Portal Access & Download Security
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setAllowDownload(true)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: allowDownload ? '2px solid #10B981' : '1px solid #CBD5E1',
                      backgroundColor: allowDownload ? '#ECFDF5' : '#FFFFFF',
                      color: allowDownload ? '#047857' : '#64748B',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.85rem' }}>
                      <Download size={16} color={allowDownload ? '#10B981' : '#64748B'} />
                      <span>Download & Read</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      Students can read online AND download PDF directly to their PC/phone.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAllowDownload(false)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: !allowDownload ? '2px solid #D97706' : '1px solid #CBD5E1',
                      backgroundColor: !allowDownload ? '#FFFBEB' : '#FFFFFF',
                      color: !allowDownload ? '#B45309' : '#64748B',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.85rem' }}>
                      <Lock size={16} color={!allowDownload ? '#D97706' : '#64748B'} />
                      <span>Read-Only in Portal</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      Students can ONLY read in the portal viewer. File downloading is disabled.
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Description / Table of Contents Summary
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of chapters and contents included..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              </div>

              {/* Sticky Modal Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 28px',
                  borderTop: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={scrollToTop}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8125rem',
                    color: '#64748B',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  <ChevronUp size={16} /> Scroll to top
                </button>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#334155',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 22px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#10B981',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    {editingId ? 'Save Changes' : 'Upload Resource'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
