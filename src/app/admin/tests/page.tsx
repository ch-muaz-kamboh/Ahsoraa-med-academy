'use client';

import React, { useState } from 'react';
import { FileSignature, Plus, Radio, Play, StopCircle, ArrowRight, Award, Users } from 'lucide-react';
import { mockTests } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function AdminTestsPage() {
  const [tests] = useState(mockTests);
  const [selectedTest, setSelectedTest] = useState(mockTests[0]);
  const { liveTestSession, startLiveTest, endLiveTest } = useAppStore();

  const isCurrentLive = liveTestSession?.testId === selectedTest.id && liveTestSession?.isLive;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
            Test Management & Live Exam Broadcast Engine
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Launch mandatory live tests for all enrolled students, author CBT question banks, and take tests as Admin.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => alert('Opening new Test Series Creator modal...')}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.875rem' }}
          >
            <Plus size={16} />
            <span>Create New Test</span>
          </button>
        </div>
      </div>

      {/* Active Live Session Alert Bar for Admin */}
      {liveTestSession && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '2px solid #EF4444',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1.5s infinite',
              }}
            >
              <Radio size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-red" style={{ fontWeight: 800 }}>LIVE BROADCAST ACTIVE</span>
                <span style={{ fontSize: '0.8125rem', color: '#991B1B', fontWeight: 600 }}>
                  Mandatory Participation Triggered
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#7F1D1D', fontWeight: 800, marginTop: '2px' }}>
                {liveTestSession.testTitle}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#991B1B', margin: 0 }}>
                All active student portals are receiving an instant pop-up notification to join this exam.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href={`/portal/tests/${liveTestSession.testId}/take`}
              className="btn-primary"
              style={{ padding: '10px 18px', backgroundColor: '#DC2626', borderColor: '#B91C1C' }}
            >
              <Play size={16} />
              <span>Admin Take Test Now</span>
            </Link>

            <button
              onClick={endLiveTest}
              className="btn-secondary"
              style={{ padding: '10px 18px', backgroundColor: '#FFFFFF', color: '#991B1B', borderColor: '#FCA5A5' }}
            >
              <StopCircle size={16} />
              <span>End Live Session</span>
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* Left: Test Series List */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '14px' }}>
            Available Test Blocks
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tests.map((t) => {
              const isSelected = selectedTest.id === t.id;
              const isTestLive = liveTestSession?.testId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTest(t)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? '#F0FDF9' : '#F8FAFC',
                    border: isSelected ? '2px solid #0D7C7A' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {isTestLive && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      LIVE NOW
                    </span>
                  )}
                  <div style={{ fontWeight: 700, color: isSelected ? '#0A6866' : '#0F172A', fontSize: '0.875rem', marginBottom: '4px' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {t.category} • {t.questions.length} Questions
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Test Details + Live Controls & Questions */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px' }}>
          {/* Header Action Control Panel */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '6px' }}>
                {selectedTest.category}
              </span>
              <h2 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800, margin: 0 }}>
                {selectedTest.title}
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0 0' }}>
                Duration: {selectedTest.durationMinutes} Mins • Total Questions: {selectedTest.questions.length} • Passing Score: {selectedTest.passingPercentage}%
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* Broadcast Button */}
              {!isCurrentLive ? (
                <button
                  onClick={() => startLiveTest(selectedTest.id, selectedTest.title)}
                  className="btn-primary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.875rem',
                    backgroundColor: '#0D7C7A',
                    borderRadius: '10px',
                  }}
                >
                  <Radio size={18} />
                  <span>Start Live Exam for All Students</span>
                </button>
              ) : (
                <button
                  onClick={endLiveTest}
                  className="btn-secondary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.875rem',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    borderColor: '#FCA5A5',
                    borderRadius: '10px',
                  }}
                >
                  <StopCircle size={18} />
                  <span>Stop Live Session</span>
                </button>
              )}

              {/* Admin Direct Take Test Button */}
              <Link
                href={`/portal/tests/${selectedTest.id}/take`}
                className="btn-secondary"
                style={{
                  padding: '10px 18px',
                  fontSize: '0.875rem',
                  borderRadius: '10px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                }}
              >
                <Play size={16} />
                <span>Admin Take Test</span>
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', color: '#0F172A', fontWeight: 700 }}>
              Question Bank Preview ({selectedTest.questions.length} Items)
            </h3>
            <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              Marking Scheme: <strong style={{ color: '#10B981' }}>+{selectedTest.positiveMark}</strong> /{' '}
              <strong style={{ color: '#EF4444' }}>-{selectedTest.negativeMark}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {selectedTest.questions.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '18px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ color: '#0D7C7A', fontSize: '0.875rem' }}>
                    Q{idx + 1}: {q.subject} - {q.topic}
                  </strong>
                  <span className="badge badge-green">Correct: {q.correctOption}</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#0F172A', lineHeight: 1.5, marginBottom: '12px' }}>
                  {q.questionText}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.8125rem', marginBottom: '12px' }}>
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: opt.id === q.correctOption ? '#ECFDF5' : '#F8FAFC',
                        border: `1px solid ${opt.id === q.correctOption ? '#A7F3D0' : '#E2E8F0'}`,
                        color: opt.id === q.correctOption ? '#065F46' : '#475569',
                      }}
                    >
                      <strong>{opt.id}.</strong> {opt.text}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '6px' }}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
