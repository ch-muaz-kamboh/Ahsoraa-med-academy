'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Eye,
  Sparkles,
  Lock,
  X,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import { getResourceDocuments, ResourceDocument } from '@/lib/cms-store';

export default function ResourcesPage() {
  const [documents, setDocuments] = useState<ResourceDocument[]>([]);
  // Firstly show IMAT related things by default
  const [selectedCategory, setSelectedCategory] = useState<string>('IMAT Past Papers & Official Keys');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [leadOpen, setLeadOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<ResourceDocument | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [lockedTargetDoc, setLockedTargetDoc] = useState<ResourceDocument | null>(null);

  useEffect(() => {
    setDocuments(getResourceDocuments());
  }, []);

  const categories = [
    'IMAT Past Papers & Official Keys',
    'Biology Notes',
    'Chemistry Cheat Sheets',
    'Physics & Math',
    'Admissions Checklists',
    'All Resources',
  ];

  const isDocLocked = (doc: ResourceDocument) => {
    // IMAT past papers, official blueprints, and unlocked items are freely available
    if (
      doc.category === 'IMAT Past Papers' ||
      doc.category === 'Past Papers' ||
      doc.category === 'Syllabus & Blueprint'
    ) {
      return false;
    }
    return doc.isLocked === true;
  };

  const filteredDocs = documents.filter((doc) => {
    let matchesCategory = false;
    if (selectedCategory === 'IMAT Past Papers & Official Keys') {
      matchesCategory =
        doc.category === 'IMAT Past Papers' ||
        doc.category === 'Past Papers' ||
        doc.category === 'Syllabus & Blueprint' ||
        doc.isLocked === false;
    } else if (selectedCategory === 'All Resources') {
      matchesCategory = true;
    } else {
      matchesCategory = doc.category === selectedCategory;
    }

    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleDownload = (doc: ResourceDocument) => {
    if (isDocLocked(doc)) {
      setLockedTargetDoc(doc);
      setRegisterModalOpen(true);
      return;
    }

    // Increment download count locally
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, downloadsCount: (d.downloadsCount || 0) + 1 } : d))
    );

    // Directly trigger browser download
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

  const handlePreview = (doc: ResourceDocument) => {
    if (isDocLocked(doc)) {
      setLockedTargetDoc(doc);
      setRegisterModalOpen(true);
      return;
    }
    setActivePreview(doc);
  };

  const isCurrentCategoryLocked = selectedCategory !== 'IMAT Past Papers & Official Keys' && selectedCategory !== 'All Resources';

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      {/* ── FULL-WIDTH HERO SECTION: AHSORA IMAT RESOURCE LIBRARY ── */}
      <section
        style={{
          width: '100%',
          backgroundColor: '#042F2E',
          backgroundImage: 'linear-gradient(135deg, #022C22 0%, #064E3B 45%, #0F172A 100%)',
          padding: '160px 20px 70px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Subtle decorative glowing background shapes */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '420px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.12), transparent)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ maxWidth: '1180px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Tagline Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 18px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(92, 237, 115, 0.12)',
              border: '1px solid rgba(92, 237, 115, 0.3)',
              color: '#5CED73',
              fontSize: '0.8125rem',
              fontWeight: 800,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={14} />
            <span>Official IMAT Resource Vault &amp; Study Library</span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.3rem, 4.8vw, 3.6rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: '20px',
              letterSpacing: '-1px',
              lineHeight: 1.15,
            }}
          >
            More Than Past Papers.<br />
            <span style={{ color: '#5CED73' }}>A Complete Medical Library for Italy.</span>
          </h1>

          {/* Subheading text */}
          <p
            style={{
              color: '#E2E8F0',
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              lineHeight: 1.7,
              maxWidth: '880px',
              margin: '0 auto 14px',
              fontWeight: 500,
            }}
          >
            Download official IMAT past papers from 2011–2026 with answer keys, completely free with no registration required.
          </p>

          <p
            style={{
              color: '#94A3B8',
              fontSize: '0.975rem',
              lineHeight: 1.65,
              maxWidth: '820px',
              margin: '0 auto 34px',
            }}
          >
            For registered students, the extended Ahsora vault unlocks high-yield subject notes, formula cheat sheets, 2,800+ practice MCQs, and full-length simulated mock exams.
          </p>

          {/* Hero Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '42px',
            }}
          >
            <a
              href="#document-vault"
              className="btn-primary"
              style={{
                padding: '14px 30px',
                fontSize: '0.95rem',
                boxShadow: '0 8px 24px -4px rgba(5,150,105,0.45)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Download size={16} />
              <span>Download Free Past Papers</span>
            </a>

            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Register for Full Library Access</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Highlights Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              maxWidth: '980px',
              margin: '0 auto',
            }}
          >
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#5CED73" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>15+ Official Past Papers (Free)</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#5CED73" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>Verified MUR &amp; Cambridge Keys</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#5CED73" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>High-Yield Demo Summaries</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#5CED73" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>Instant Direct Downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOCUMENT CATEGORIES & GRID ── */}
      <section id="document-vault" style={{ padding: '40px 0 80px', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px' }}>

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

          {/* Category Filter Pills (IMAT is first and active by default) */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '16px',
              marginBottom: '28px',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              const isLockedTab = cat !== 'IMAT Past Papers & Official Keys' && cat !== 'All Resources';

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 600,
                    backgroundColor: active ? '#059669' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#475569',
                    border: `1.5px solid ${active ? '#059669' : '#E2E8F0'}`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    boxShadow: active ? '0 4px 12px rgba(5,150,105,0.25)' : 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {isLockedTab && (
                    <Lock size={12} color={active ? '#FFFFFF' : '#94A3B8'} />
                  )}
                  <span>{cat}</span>
                  {cat === 'IMAT Past Papers & Official Keys' && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#ECFDF5',
                        color: active ? '#FFFFFF' : '#059669',
                        padding: '2px 6px',
                        borderRadius: '9999px',
                        fontWeight: 700,
                      }}
                    >
                      FREE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Locked Notice Banner when viewing locked categories */}
          {isCurrentCategoryLocked && (
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: '16px',
                padding: '16px 22px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#B45309',
                    flexShrink: 0,
                  }}
                >
                  <Lock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#92400E', fontSize: '0.975rem' }}>
                    Demo Documents Locked for Enrolled / Registered Students
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#B45309', marginTop: '2px' }}>
                    These high-yield summary notes, formula sheets, and checklists are reserved for registered Ahsora students. Register for free to unlock complete access and instant downloads.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRegisterModalOpen(true)}
                className="btn-primary"
                style={{
                  padding: '9px 20px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Register for Free</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                {selectedCategory} ({filteredDocs.length})
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '2px' }}>
                {selectedCategory === 'IMAT Past Papers & Official Keys'
                  ? 'Official exam questions & verified answer keys • 100% Free Downloads'
                  : 'Premium subject materials • Free student registration required'}
              </div>
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#059669" />
              <span>Verified Italian Ministry (MUR) &amp; Cambridge Syllabus</span>
            </div>
          </div>

          {/* Documents Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {filteredDocs.map((doc) => {
              const locked = isDocLocked(doc);

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    if (locked) {
                      setLockedTargetDoc(doc);
                      setRegisterModalOpen(true);
                    }
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: `1.5px solid ${locked ? '#E2E8F0' : '#E2E8F0'}`,
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 4px 12px rgba(15,23,42,0.03)',
                    transition: 'all 0.2s ease',
                    cursor: locked ? 'pointer' : 'default',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = locked ? '#FCD34D' : '#6EE7B7';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = locked
                      ? '0 12px 28px -6px rgba(245, 158, 11, 0.15)'
                      : '0 12px 28px -6px rgba(5,150,105,0.12)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#E2E8F0';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(15,23,42,0.03)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    {/* Category & Lock Status Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <span
                        style={{
                          backgroundColor: locked ? '#FEF3C7' : '#ECFDF5',
                          color: locked ? '#92400E' : '#059669',
                          border: `1px solid ${locked ? '#FDE68A' : '#A7F3D0'}`,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {locked ? <Lock size={12} /> : null}
                        <span>{doc.category}</span>
                      </span>

                      <span
                        style={{
                          backgroundColor: locked ? '#FFFBEB' : '#F1F5F9',
                          color: locked ? '#B45309' : '#475569',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {locked ? (
                          <>
                            <Lock size={11} /> Locked Demo
                          </>
                        ) : (
                          'Free Download'
                        )}
                        {' • '}
                        {doc.format} • {doc.fileSize}
                      </span>
                    </div>

                    {/* Title with icon */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: locked ? '#FEF3C7' : '#ECFDF5',
                          color: locked ? '#B45309' : '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {locked ? <Lock size={20} /> : <FileText size={22} />}
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.35, margin: 0 }}>
                        {doc.title}
                      </h3>
                    </div>

                    <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                      {doc.description}
                    </p>
                  </div>

                  {/* Card Footer with action buttons */}
                  <div style={{ paddingTop: '16px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
                      {doc.downloadsCount} downloads
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {locked ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(doc);
                            }}
                            style={{
                              backgroundColor: '#FFFBEB',
                              color: '#92400E',
                              border: '1px solid #FCD34D',
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
                            <Lock size={13} /> Preview
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(doc);
                            }}
                            style={{
                              backgroundColor: '#D97706',
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
                              boxShadow: '0 4px 10px rgba(217, 119, 6, 0.25)',
                            }}
                          >
                            <Lock size={13} /> Register to Unlock
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(doc);
                            }}
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
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(doc);
                            }}
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* ── UNLOCKED DOCUMENT PREVIEW MODAL ── */}
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
                type="button"
                onClick={() => setActivePreview(null)}
                style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = activePreview;
                  setActivePreview(null);
                  handleDownload(target);
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

      {/* ── LOCKED RESOURCE REGISTRATION MODAL ── */}
      {registerModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setRegisterModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              padding: '36px 32px',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
              position: 'relative',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: '#F1F5F9',
                border: 'none',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={18} />
            </button>

            {/* Lock Badge Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                border: '1.5px solid #A7F3D0',
                boxShadow: '0 8px 16px -4px rgba(5,150,105,0.15)',
              }}
            >
              <Lock size={30} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                border: '1px solid #FCD34D',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              <Sparkles size={12} />
              <span>Free Student Registration Required</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '10px', lineHeight: 1.25 }}>
              Register to Access Study Materials
            </h2>

            {lockedTargetDoc ? (
              <p style={{ fontSize: '0.9rem', color: '#059669', fontWeight: 600, marginBottom: '14px', backgroundColor: '#F0FDF4', padding: '8px 14px', borderRadius: '10px' }}>
                📄 {lockedTargetDoc.title}
              </p>
            ) : null}

            <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.6, marginBottom: '22px' }}>
              These high-yield summary notes, formula cheat sheets, and admissions checklists are reserved for registered Ahsora students. Register for free to unlock complete instant access and downloads.
            </p>

            {/* Benefits list */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '16px 20px',
                textAlign: 'left',
                marginBottom: '26px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#1E293B', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Instant access to all demo revision notes &amp; formula sheets</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#1E293B', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Free diagnostic IMAT mock exam with automated scoring</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#1E293B', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Official MUR syllabus blueprints &amp; university guidance</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href="/register"
                className="btn-primary"
                style={{
                  padding: '14px 24px',
                  fontSize: '0.95rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 6px 18px -2px rgba(5,150,105,0.4)',
                }}
              >
                <span>Create Free Student Account</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/login"
                style={{
                  padding: '12px 24px',
                  fontSize: '0.9rem',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} defaultExam="IMAT" />
    </div>
  );
}
