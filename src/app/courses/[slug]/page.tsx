'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BookOpen,
  Clock,
  FileCheck,
  CheckCircle2,
  Users,
  ShieldCheck,
  PlayCircle,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { courses } = useAppStore();

  const course = courses.find((c) => c.slug === resolvedParams.slug) || courses[0];

  if (!course) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header Breadcrumbs */}
        <div style={{ marginBottom: '20px', fontSize: '0.875rem', color: '#64748B' }}>
          <Link href="/" style={{ color: '#2563EB' }}>Home</Link> /{' '}
          <Link href="/courses" style={{ color: '#2563EB' }}>Courses</Link> /{' '}
          <span>{course.title}</span>
        </div>

        {/* Hero Course Banner */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '36px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            marginBottom: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '12px' }}>
              {course.category} • {course.targetExam}
            </span>
            <h1 style={{ fontSize: '2.2rem', color: '#0F172A', lineHeight: 1.2, marginBottom: '16px' }}>
              {course.title}
            </h1>
            <p style={{ color: '#475569', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {course.overview}
            </p>

            {/* Inclusions Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '28px',
                fontSize: '0.875rem',
                color: '#334155',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#2563EB" />
                <span>{course.durationHours} Hours Video Lectures</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={16} color="#2563EB" />
                <span>{course.totalTests} Full Simulated Mock Tests</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} color="#2563EB" />
                <span>{course.totalResources} High-Yield Downloadable PDFs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#2563EB" />
                <span>1-on-1 Faculty Mentorship Included</span>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Card */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '16px',
              border: '1px solid #BFDBFE',
              padding: '28px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', marginBottom: '4px' }}>
              Centralized Course Enrollment
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1E3A8A', marginBottom: '4px' }}>
              ${course.price}
              {course.comparePrice && (
                <span style={{ fontSize: '1.125rem', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '8px', fontWeight: 400 }}>
                  ${course.comparePrice}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#10B981', fontWeight: 600, marginBottom: '20px' }}>
              ● Instant Portal & LMS Activation
            </div>

            <Link
              href="/portal/courses"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginBottom: '12px' }}
            >
              <span>Enrol & Start Learning</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/portal/tests/tst-01/take"
              className="btn-outline"
              style={{ width: '100%', padding: '12px', fontSize: '0.9375rem', backgroundColor: '#FFFFFF' }}
            >
              <span>Try Free Diagnostic Mock Test</span>
            </Link>
          </div>
        </div>

        {/* Curriculum Breakdown */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#0F172A', marginBottom: '20px' }}>
            Curriculum & Lesson Modules
          </h2>

          {course.modules.length === 0 ? (
            <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
              Complete high-yield modules, notes, and question banks will unlock automatically upon portal enrollment.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {course.modules.map((mod, modIdx) => (
                <div
                  key={mod.id}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      padding: '14px 20px',
                      fontWeight: 700,
                      color: '#0F172A',
                      fontSize: '0.9375rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>
                      Module {modIdx + 1}: {mod.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {mod.lessons.length} Lessons
                    </span>
                  </div>

                  <div style={{ padding: '8px 16px' }}>
                    {mod.lessons.map((les) => (
                      <div
                        key={les.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 8px',
                          borderBottom: '1px solid #F1F5F9',
                          fontSize: '0.875rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
                          <PlayCircle size={16} color="#2563EB" />
                          <span>{les.title}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>{les.durationMinutes}m</span>
                          {les.isPreviewAllowed ? (
                            <Link
                              href="/portal/courses/crs-01/player"
                              style={{
                                color: '#2563EB',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                backgroundColor: '#EFF6FF',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              Free Preview
                            </Link>
                          ) : (
                            <Lock size={14} color="#94A3B8" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
