'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Filter, Star, Clock, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function CoursesPage() {
  const { courses } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Standardized Exams', 'University Admissions', 'Language & Placement'];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetExam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
            Academic Curriculum
          </span>
          <h1 style={{ fontSize: '2.4rem', color: '#0F172A', marginTop: '4px', marginBottom: '8px' }}>
            Admissions & Standardized Prep Courses
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '700px' }}>
            Curated by Harvard, Oxford, and European alumni mentors. Centralized pricing with integrated CBT mock tests.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: selectedCategory === cat ? '#2563EB' : '#F1F5F9',
                  color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search
              size={18}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search exam, topic, USMLE..."
              className="form-input"
              style={{ paddingLeft: '38px', borderRadius: '8px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Course Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px',
          }}
        >
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Image Banner */}
              <div
                style={{
                  height: '190px',
                  backgroundImage: `url(${course.thumbnailUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {course.targetExam}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '6px',
                  }}
                >
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {course.durationHours}h
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="badge badge-blue" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
                  {course.category}
                </span>

                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '10px', lineHeight: 1.3 }}>
                  {course.title}
                </h3>

                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                  {course.summary}
                </p>

                {/* Meta stats */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem',
                    color: '#64748B',
                    marginBottom: '16px',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: 700 }}>
                    <Star size={14} fill="#D97706" />
                    <span>{course.rating}</span>
                    <span style={{ color: '#94A3B8', fontWeight: 400 }}>({course.studentsCount})</span>
                  </div>
                  <div>
                    <strong>{course.totalLectures}</strong> Lectures • <strong>{course.totalTests}</strong> Mock Tests
                  </div>
                </div>

                {/* Price & Action */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '16px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                      ${course.price}
                    </div>
                    {course.comparePrice && (
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        Regular: ${course.comparePrice}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="btn-primary"
                    style={{ padding: '10px 18px' }}
                  >
                    View Curriculum
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
