'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  PlayCircle,
  CheckCircle,
  Circle,
  BookOpen,
  FileText,
  Download,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Video,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function CoursePlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { courses, toggleLessonCompletion } = useAppStore();

  const course = courses.find((c) => c.id === resolvedParams.id) || courses[0];

  if (!course) {
    notFound();
  }

  // Find all lessons
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const [activeLessonId, setActiveLessonId] = useState(
    allLessons[0]?.id || 'les-01'
  );
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'qna'>('notes');

  const currentLesson =
    allLessons.find((l) => l.id === activeLessonId) || allLessons[0];

  const handleToggle = (lesId: string) => {
    toggleLessonCompletion(course.id, lesId);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Breadcrumb & Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <Link
            href="/portal/courses"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              color: '#2563EB',
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            <ChevronLeft size={16} /> Back to My Courses
          </Link>
          <h1 style={{ fontSize: '1.5rem', color: '#0F172A', lineHeight: 1.2 }}>
            {course.title}
          </h1>
        </div>

        {currentLesson && (
          <button
            onClick={() => handleToggle(currentLesson.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: currentLesson.isCompleted ? '#ECFDF5' : '#EFF6FF',
              color: currentLesson.isCompleted ? '#065F46' : '#1D4ED8',
              border: `1px solid ${currentLesson.isCompleted ? '#A7F3D0' : '#BFDBFE'}`,
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {currentLesson.isCompleted ? (
              <>
                <CheckCircle size={18} color="#10B981" /> Completed
              </>
            ) : (
              <>
                <Circle size={18} /> Mark Lesson as Complete
              </>
            )}
          </button>
        )}
      </div>

      {/* 2-Column Player Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 360px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Video + Notes Tabs */}
        <div>
          {/* Video Container */}
          <div
            style={{
              backgroundColor: '#0F172A',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              aspectRatio: '16 / 9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            {currentLesson?.videoUrl ? (
              <iframe
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#94A3B8', padding: '20px' }}>
                <Video size={48} color="#3B82F6" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '6px' }}>
                  {currentLesson?.title || 'Interactive Lesson'}
                </h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Full-HD Lecture Stream & Clinical Presentation
                </p>
              </div>
            )}
          </div>

          {/* Lesson Content Tabs */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '12px',
                marginBottom: '20px',
              }}
            >
              <button
                onClick={() => setActiveTab('notes')}
                style={{
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: activeTab === 'notes' ? '#2563EB' : '#64748B',
                  borderBottom: activeTab === 'notes' ? '2px solid #2563EB' : '2px solid transparent',
                  paddingBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <BookOpen size={16} /> High-Yield Notes
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                style={{
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: activeTab === 'resources' ? '#2563EB' : '#64748B',
                  borderBottom: activeTab === 'resources' ? '2px solid #2563EB' : '2px solid transparent',
                  paddingBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download size={16} /> PDFs & Attachments
              </button>
              <button
                onClick={() => setActiveTab('qna')}
                style={{
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: activeTab === 'qna' ? '#2563EB' : '#64748B',
                  borderBottom: activeTab === 'qna' ? '2px solid #2563EB' : '2px solid transparent',
                  paddingBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <HelpCircle size={16} /> Lesson Doubts
              </button>
            </div>

            {/* Tab 1: Notes */}
            {activeTab === 'notes' && (
              <div style={{ color: '#334155', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '12px' }}>
                  {currentLesson?.title}
                </h3>
                <div style={{ whiteSpace: 'pre-wrap', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  {currentLesson?.contentMarkdown ||
                    'Comprehensive clinical notes and summary diagrams are synced with this lecture.'}
                </div>
              </div>
            )}

            {/* Tab 2: Resources */}
            {activeTab === 'resources' && (
              <div>
                <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '12px' }}>
                  Downloadable Study Materials
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={18} color="#2563EB" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                        High-Yield Summary Sheet (PDF)
                      </span>
                    </div>
                    <button
                      onClick={() => alert('Downloading official lesson summary PDF...')}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Q&A */}
            {activeTab === 'qna' && (
              <div>
                <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '12px' }}>
                  Have a question about this lecture?
                </h4>
                <Link href="/portal/doubts" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                  Submit a Question to Faculty
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Syllabus Curriculum Navigation */}
        <div
          className="card"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '20px',
            position: 'sticky',
            top: '84px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '16px' }}>
            Course Curriculum
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id}>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  Module {modIdx + 1}: {mod.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {mod.lessons.map((les) => {
                    const isActive = les.id === activeLessonId;
                    return (
                      <div
                        key={les.id}
                        onClick={() => setActiveLessonId(les.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                          border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(les.id);
                            }}
                          >
                            {les.isCompleted ? (
                              <CheckCircle size={16} color="#10B981" />
                            ) : (
                              <Circle size={16} color="#94A3B8" />
                            )}
                          </button>
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? '#1D4ED8' : '#334155',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {les.title}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', flexShrink: 0, marginLeft: '6px' }}>
                          {les.durationMinutes}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
