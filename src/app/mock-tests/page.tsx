'use client';

import React from 'react';
import Link from 'next/link';
import { FileCheck, Clock, Award, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { mockTests } from '@/lib/mock-data';

export default function MockTestsPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '36px', textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
            Computer-Based Testing (CBT)
          </span>
          <h1 style={{ fontSize: '2.4rem', color: '#0F172A', marginTop: '4px', marginBottom: '12px' }}>
            High-Yield Assessment & Mock Test Engine
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            Simulate actual exam conditions with synchronized timers, negative marking, question palettes, and topic-level mastery analytics.
          </p>
        </div>

        {/* Test Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '28px',
          }}
        >
          {mockTests.map((test) => (
            <div
              key={test.id}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-blue">{test.category}</span>
                <span className="badge badge-amber" style={{ textTransform: 'uppercase' }}>
                  {test.difficulty}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '12px', lineHeight: 1.3 }}>
                {test.title}
              </h3>

              <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                {test.instructions}
              </p>

              {/* Stats Box */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  fontSize: '0.8125rem',
                  marginBottom: '20px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <span style={{ color: '#64748B' }}>Duration:</span>{' '}
                  <strong style={{ color: '#0F172A' }}>{test.durationMinutes} mins</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Questions:</span>{' '}
                  <strong style={{ color: '#0F172A' }}>{test.totalQuestions} Vignettes</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Marking:</span>{' '}
                  <strong style={{ color: '#10B981' }}>+{test.positiveMark}</strong> /{' '}
                  <strong style={{ color: '#EF4444' }}>-{test.negativeMark}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Passing:</span>{' '}
                  <strong style={{ color: '#2563EB' }}>{test.passingPercentage}%</strong>
                </div>
              </div>

              <Link
                href={`/portal/tests/${test.id}/take`}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
              >
                <span>Launch Mock Test Exam</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
