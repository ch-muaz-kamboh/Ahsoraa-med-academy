'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Library,
  BookOpen,
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  Sparkles,
  FileCheck2,
  HardDrive,
} from 'lucide-react';
import { LibraryResource } from '@/types';

export default function StudentLibraryPage() {
  const { libraryResources } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const categories: LibraryResource['category'][] = ['Book', 'PDF Notes', 'Formula Sheet', 'Past Paper'];
  const subjects = Array.from(new Set(libraryResources.map((r) => r.subject)));

  const filteredResources = libraryResources.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.authorOrSource && item.authorOrSource.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSubject && matchesSearch;
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'PDF Document';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '14px',
            }}
          >
            <Sparkles size={14} color="#FDE047" />
            <span>ACADEMIC REPOSITORY • DIGITAL LIBRARY</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Books, PDF Notes & Past Papers
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.6, margin: 0 }}>
            Download official curriculum textbooks, high-yield revision summaries, formula sheets, and past IMAT exam papers compiled by our medical faculty.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <input
            type="text"
            placeholder="Search book titles, notes or past papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: selectedCategory === 'all' ? '#10B981' : '#E2E8F0',
              backgroundColor: selectedCategory === 'all' ? '#ECFDF5' : '#FFFFFF',
              color: selectedCategory === 'all' ? '#059669' : '#64748B',
            }}
          >
            All Resources
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#10B981' : '#E2E8F0',
                backgroundColor: selectedCategory === cat ? '#ECFDF5' : '#FFFFFF',
                color: selectedCategory === cat ? '#059669' : '#64748B',
              }}
            >
              {cat}s
            </button>
          ))}
        </div>

        {/* Subject Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748B" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.8125rem',
              color: '#334155',
              backgroundColor: '#FFFFFF',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Library Grid */}
      {filteredResources.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px dashed #CBD5E1',
          }}
        >
          <Library size={48} color="#94A3B8" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
            No library books or PDF notes uploaded yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0 0 16px 0' }}>
            The digital repository is empty. Faculty and admins can upload books, notes, and past papers from the Admin Panel.
          </p>
          <a
            href="/admin/learn/library"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              fontWeight: 700,
              fontSize: '0.8125rem',
              textDecoration: 'none',
            }}
          >
            + Upload Books & Notes in Admin Panel →
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredResources.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div>
                {/* Header Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
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
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    {item.subject}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                  {item.title}
                </h3>

                {/* Description */}
                {item.description && (
                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                    {item.description}
                  </p>
                )}

                {/* File Info */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem', color: '#475569', marginBottom: '20px' }}>
                  {item.pagesCount && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={14} color="#10B981" />
                      <span>{item.pagesCount} pages</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HardDrive size={14} color="#10B981" />
                    <span>{formatFileSize(item.fileSizeBytes)}</span>
                  </div>
                  {item.downloadCount && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Download size={14} color="#10B981" />
                      <span>{item.downloadCount} downloads</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Download / View Button */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                <a
                  href={item.fileUrl}
                  download
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  <Download size={16} />
                  <span>Download PDF Document</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
