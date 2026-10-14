'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, FileText, Search, Filter, CheckCircle2, ShieldCheck, ExternalLink, ArrowRight, Eye, Sparkles } from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import { getResourceDocuments, ResourceDocument } from '@/lib/cms-store';

export default function ResourcesPage() {
  const [documents, setDocuments] = useState<ResourceDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [leadOpen, setLeadOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<ResourceDocument | null>(null);

  useEffect(() => {
    setDocuments(getResourceDocuments());
  }, []);

  const categories = ['All', 'Syllabus & Blueprint', 'Biology Notes', 'Chemistry Cheat Sheets', 'Past Papers', 'Physics & Math', 'Admissions Checklists'];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleDownload = (doc: ResourceDocument) => {
    // Increment download count locally
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, downloadsCount: (d.downloadsCount || 0) + 1 } : d))
    );

    // Directly trigger browser download without modal or sign up prompt
    if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      const fileExt = doc.format ? doc.format.toLowerCase() : 'pdf';
      const cleanName = doc.title ? doc.title.replace(/[^a-zA-Z0-9_\-]/g, '_') : 'document';
      link.download = `${cleanName}.${fileExt}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      {/* ── HERO SECTION: AHSORA IMAT RESOURCE LIBRARY ── */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '160px 0 28px',
        }}
      >
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div
            style={{
              backgroundColor: '#F3F8F5',
              border: '1px solid #DDE8E0',
              borderRadius: '20px',
              padding: 'clamp(32px, 4.2vw, 48px)',
              boxShadow: '0 8px 30px -10px rgba(6, 78, 59, 0.05)',
            }}
          >
            {/* Tagline */}
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#166534',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>AHSORA MEDS ACADEMY · IMAT RESOURCE LIBRARY</span>
            </div>

            {/* Heading */}
            <h1
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 900,
                color: '#0F291E',
                marginBottom: '20px',
                letterSpacing: '-0.8px',
                lineHeight: 1.18,
              }}
            >
              More Than Past Papers. A Library That Grows With Your Preparation.
            </h1>

            {/* Paragraph 1 */}
            <p
              style={{
                color: '#334155',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                marginBottom: '16px',
                maxWidth: '960px',
              }}
            >
              Download IMAT past papers from 2011–2026 with answer keys, completely free. For students enrolled through our portal, the wider Ahsora library brings together 20+ Ahsora mock tests, academy-authored books aligned with the IMAT 2026 syllabus, 20+ additional reference books, comprehensive subject-wise and topic-wise notes, formula sheets, cheat sheets, quick-revision guides, and detailed past-paper solutions.
            </p>

            {/* Paragraph 2 */}
            <p
              style={{
                color: '#334155',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                marginBottom: '28px',
                maxWidth: '960px',
              }}
            >
              Our authoring team develops original learning materials and updates book editions each year to reflect the relevant syllabus. As Ahsora Meds Academy evolves, our library continues to expand with new resources designed to support students throughout their preparation.
            </p>

            {/* Buttons Row */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: '18px',
              }}
            >
              <a
                href="#document-vault"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#14532D',
                  color: '#FFFFFF',
                  padding: '13px 26px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(20, 83, 45, 0.25)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0F3F22';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#14532D';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Download Free Past Papers</span>
              </a>

              <Link
                href="/portal"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#14532D',
                  border: '1.5px solid #14532D',
                  padding: '13px 26px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Access Student Portal</span>
              </Link>
            </div>

            {/* Subtext under buttons */}
            <div
              style={{
                fontSize: '0.85rem',
                color: '#64748B',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span>Free past papers and answer keys for everyone</span>
              <span>·</span>
              <span>Extended study library for students through the portal</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOCUMENT CATEGORIES & GRID ── */}
      <section id="document-vault" style={{ padding: '30px 0 80px', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>

          {/* Search Bar */}
          <div
            style={{
              position: 'relative',
              maxWidth: '680px',
              margin: '0 auto 28px',
            }}
          >
            <input
              type="text"
              placeholder="Search documents by title, subject, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 20px 15px 48px',
                borderRadius: '16px',
                border: '1.5px solid #D1E7DD',
                backgroundColor: '#F8FAF9',
                color: '#0F172A',
                fontSize: '0.9375rem',
                outline: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#059669';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#D1E7DD';
                e.currentTarget.style.backgroundColor = '#F8FAF9';
              }}
            />
            <Search size={19} color="#059669" style={{ position: 'absolute', left: '16px', top: '16px' }} />
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '16px',
              marginBottom: '36px',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 600,
                    backgroundColor: active ? '#059669' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#475569',
                    border: `1px solid ${active ? '#059669' : '#E2E8F0'}`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    boxShadow: active ? '0 4px 12px rgba(5,150,105,0.25)' : 'none',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
              Available Documents ({filteredDocs.length})
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
              Verified PDF Downloads • Free &amp; Premium Bundles
            </div>
          </div>

          {/* Documents Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.03)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#6EE7B7';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px -6px rgba(5,150,105,0.12)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#E2E8F0';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(15,23,42,0.03)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span
                      style={{
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        border: '1px solid #A7F3D0',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {doc.category}
                    </span>
                    <span
                      style={{
                        backgroundColor: '#F1F5F9',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {doc.format} • {doc.fileSize}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.35, margin: 0 }}>
                      {doc.title}
                    </h3>
                  </div>

                  <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                    {doc.description}
                  </p>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
                    {doc.downloadsCount} downloads
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setActivePreview(doc)}
                      style={{
                        backgroundColor: '#F8FAFC',
                        color: '#475569',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Eye size={14} /> Preview
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      style={{
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 10px rgba(5,150,105,0.2)',
                      }}
                    >
                      <Download size={14} /> Download PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <FileText size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>No documents found</h3>
              <p style={{ fontSize: '0.9375rem' }}>Try selecting a different category or search term.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── DOCUMENT PREVIEW MODAL ── */}
      {activePreview && (
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
            padding: '20px',
          }}
          onClick={() => setActivePreview(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '640px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                {activePreview.category}
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>{activePreview.format} • {activePreview.fileSize}</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              {activePreview.title}
            </h2>

            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
              {activePreview.description}
            </p>

            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', textAlign: 'center', marginBottom: '24px' }}>
              <FileText size={48} color="#059669" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>Document File Ready</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>Verified &amp; scanned for official IMAT candidates</div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setActivePreview(null)}
                style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setActivePreview(null);
                  handleDownload(activePreview);
                }}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.875rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={16} /> Download Full Document
              </button>
            </div>
          </div>
        </div>
      )}

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} defaultExam="IMAT" />
    </div>
  );
}
