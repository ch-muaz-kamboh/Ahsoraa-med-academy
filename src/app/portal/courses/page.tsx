'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, FileCheck, CheckCircle2, PlayCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function PortalCoursesPage() {
  const { courses } = useAppStore();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          My Enrolled Courses & Lectures
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Access your high-yield video lessons, downloadable study PDFs, and integrated topic assessments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {courses.map((course) => {
          // calculate completed lessons
          let totalLessons = 0;
          let completedLessons = 0;
          course.modules.forEach((m) => {
            m.lessons.forEach((l) => {
              totalLessons++;
              if (l.isCompleted) completedLessons++;
            });
          });
          const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

          return (
            <div
              key={course.id}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge badge-blue">{course.targetExam}</span>
                <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                  ● Active Enrolment
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '10px', lineHeight: 1.3 }}>
                {course.title}
              </h3>

              <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                {course.summary}
              </p>

              {/* Progress */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>Syllabus Progress</span>
                  <strong style={{ color: '#2563EB' }}>{progressPercent}%</strong>
                </div>
                <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#2563EB' }} />
                </div>
              </div>

              <Link
                href={`/portal/courses/${course.id}/player`}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '0.875rem' }}
              >
                <PlayCircle size={16} />
                <span>Open Course Player</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
