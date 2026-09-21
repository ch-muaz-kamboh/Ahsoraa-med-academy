'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { LibraryResource } from '@/types';

export default function AdminLibraryManagerPage() {
  const { libraryResources, addLibraryResource, updateLibraryResource, deleteLibraryResource } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LibraryResource['category']>('Book');
  const [subject, setSubject] = useState('Biology');
  const [fileUrl, setFileUrl] = useState('');
  const [pagesCount, setPagesCount] = useState(150);
  const [authorOrSource, setAuthorOrSource] = useState('Ahsora Medical Faculty');
  const [description, setDescription] = useState('');

  const openNewModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Book');
    setSubject('Biology');
    setFileUrl('/files/ahsora-high-yield-notes.pdf');
    setPagesCount(120);
    setAuthorOrSource('Ahsora Medical Faculty');
    setDescription('');
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
                  <a
                    href={item.fileUrl}
                    download
                    style={{ color: '#10B981', textDecoration: 'underline', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Download size={13} /> PDF Link
                  </a>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(item)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        border: '1px solid #BFDBFE',
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
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '600px',
              padding: '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {editingId ? 'Edit Library Resource' : 'Upload New Library Resource'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      backgroundColor: '#EFF6FF',
                      border: '1px dashed #3B82F6',
                      color: '#2563EB',
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

              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#10B981', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
                >
                  {editingId ? 'Save Changes' : 'Upload Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
