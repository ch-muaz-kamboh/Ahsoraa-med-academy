'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Video,
  Play,
  FileText,
  Search,
  Filter,
  Clock,
  Eye,
  User,
  X,
  Download,
  Sparkles,
} from 'lucide-react';
import { RecordedLecture } from '@/types';

export default function StudentRecordedLecturesPage() {
  const { recordedLectures } = useAppStore();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLecture, setActiveLecture] = useState<RecordedLecture | null>(null);

  const subjects = Array.from(new Set(recordedLectures.map((l) => l.subject)));

  const filteredLectures = recordedLectures.filter((item) => {
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.topic && item.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '14px',
              letterSpacing: '0.5px',
            }}
          >
            <Sparkles size={14} color="#F59E0B" />
            <span>LEARN ON-DEMAND • VIDEO ARCHIVE</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Recorded Video Lectures
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6, margin: 0 }}>
            Access high-yield medical lectures, step-by-step MCQ walkthroughs, and organic chemistry mechanisms anytime on demand. Download lecture notes to follow along.
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Subject Tabs */}
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
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <input
            type="text"
            placeholder="Search lectures by title, topic, or keyword..."
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

        {/* Subject Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedSubject('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: selectedSubject === 'all' ? '#2563EB' : '#E2E8F0',
              backgroundColor: selectedSubject === 'all' ? '#EFF6FF' : '#FFFFFF',
              color: selectedSubject === 'all' ? '#2563EB' : '#64748B',
            }}
          >
            All Subjects
          </button>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selectedSubject === sub ? '#2563EB' : '#E2E8F0',
                backgroundColor: selectedSubject === sub ? '#EFF6FF' : '#FFFFFF',
                color: selectedSubject === sub ? '#2563EB' : '#64748B',
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Lecture Grid */}
      {filteredLectures.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px dashed #CBD5E1',
          }}
        >
          <Video size={48} color="#94A3B8" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
            No recorded video lectures added yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0 0 16px 0' }}>
            The video archive is empty. Faculty and admins can upload recorded lectures from the Admin Panel.
          </p>
          <a
            href="/admin/learn/lectures"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              fontWeight: 700,
              fontSize: '0.8125rem',
              textDecoration: 'none',
            }}
          >
            + Upload Lectures in Admin Panel →
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredLectures.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Video Thumbnail Preview */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#0F172A',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
                onClick={() => setActiveLecture(item)}
              >
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                    <Video size={48} />
                  </div>
                )}

                {/* Play Overlay Button */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(37, 99, 235, 0.9)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    paddingLeft: '4px',
                  }}
                >
                  <Play size={24} fill="#FFFFFF" />
                </div>

                {/* Duration Badge */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#FFFFFF',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Clock size={12} /> {item.durationMinutes} min
                </span>

                {/* Subject Tag */}
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {item.subject}
                </span>
              </div>

              {/* Content Description */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.4, margin: '0 0 8px 0' }}>
                    {item.title}
                  </h3>
                  {item.topic && (
                    <div style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, marginBottom: '8px' }}>
                      Topic: {item.topic}
                    </div>
                  )}
                  {item.description && (
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} color="#2563EB" />
                    <span>{item.instructor || 'Faculty'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.pdfAttachmentUrl && (
                      <a
                        href={item.pdfAttachmentUrl}
                        download
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                        title="Download Lecture Notes PDF"
                      >
                        <Download size={13} /> Notes
                      </a>
                    )}
                    <button
                      onClick={() => setActiveLecture(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        backgroundColor: '#2563EB',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Play size={12} fill="#FFFFFF" /> Watch Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeLecture && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
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
              maxWidth: '900px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#2563EB',
                    backgroundColor: '#EFF6FF',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginRight: '8px',
                  }}
                >
                  {activeLecture.subject}
                </span>
                <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{activeLecture.title}</strong>
              </div>
              <button
                onClick={() => setActiveLecture(null)}
                style={{
                  border: 'none',
                  background: '#F1F5F9',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            {/* Video Player Container */}
            <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000000', borderRadius: '0' }}>
              {activeLecture.videoUrl && (
                activeLecture.videoUrl.startsWith('blob:') ||
                activeLecture.videoUrl.startsWith('data:') ||
                activeLecture.videoUrl.match(/\.(mp4|webm|mkv|mov)($|\?)/i) ||
                (!activeLecture.videoUrl.includes('youtube') && !activeLecture.videoUrl.includes('youtu.be') && !activeLecture.videoUrl.includes('vimeo')) ? (
                  <video
                    src={activeLecture.videoUrl}
                    controls
                    autoPlay
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <iframe
                    src={
                      activeLecture.videoUrl.includes('watch?v=')
                        ? activeLecture.videoUrl.replace('watch?v=', 'embed/')
                        : activeLecture.videoUrl.includes('youtu.be/')
                        ? `https://www.youtube.com/embed/${activeLecture.videoUrl.split('youtu.be/')[1]?.split('?')[0]}`
                        : activeLecture.videoUrl
                    }
                    title={activeLecture.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              )}
            </div>

            {/* Modal Details & Attachments */}
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
                Instructor: <strong>{activeLecture.instructor}</strong> • Topic: <strong>{activeLecture.topic || 'General'}</strong>
              </p>
              {activeLecture.pdfAttachmentUrl && (
                <a
                  href={activeLecture.pdfAttachmentUrl}
                  download
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textDecoration: 'none',
                  }}
                >
                  <Download size={15} /> Download Handout PDF
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
