'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter, notFound } from 'next/navigation';
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  X,
  Flag,
} from 'lucide-react';
import { mockTests } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';
import { TestAttempt } from '@/types';

export default function TakeTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { recordTestAttempt, currentUser } = useAppStore();

  const test = mockTests.find((t) => t.id === resolvedParams.id) || mockTests[0];

  if (!test) {
    notFound();
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // { questionId: "A" }
  const [markedReview, setMarkedReview] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = test.questions[currentIndex] || test.questions[0];

  const handleSelectOption = (optId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optId,
    }));
  };

  const handleClearOption = () => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleToggleMarkReview = () => {
    setMarkedReview((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  // Submit test calculations
  const handleSubmitTest = () => {
    setIsSubmitting(true);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let score = 0;

    const subjectBreakdown: Record<string, { total: number; correct: number; score: number }> = {};

    test.questions.forEach((q) => {
      const selected = answers[q.id];
      const subj = q.subject || 'General Medical';

      if (!subjectBreakdown[subj]) {
        subjectBreakdown[subj] = { total: 0, correct: 0, score: 0 };
      }
      subjectBreakdown[subj].total += 1;

      if (!selected) {
        unansweredCount += 1;
      } else if (selected === q.correctOption) {
        correctCount += 1;
        score += test.positiveMark;
        subjectBreakdown[subj].correct += 1;
        subjectBreakdown[subj].score += test.positiveMark;
      } else {
        incorrectCount += 1;
        score -= test.negativeMark;
        subjectBreakdown[subj].score -= test.negativeMark;
      }
    });

    const attemptedCount = correctCount + incorrectCount;
    const finalScore = Math.max(0, Number(score.toFixed(2)));
    const maxScore = test.totalMarks || test.questions.length * test.positiveMark;
    const percentage = Math.max(0, Math.round((finalScore / maxScore) * 100));
    const accuracyRate = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const percentile = Math.min(99, Math.max(10, Math.round(percentage * 0.95 + 8)));

    const attemptId = `att-${Date.now()}`;
    const newAttempt: TestAttempt = {
      id: attemptId,
      testId: test.id,
      testTitle: test.title,
      studentId: currentUser.id,
      status: 'completed',
      startedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: test.durationMinutes * 60 - timeLeft,
      totalScore: finalScore,
      percentage: percentage,
      totalAttempted: attemptedCount,
      totalCorrect: correctCount,
      totalIncorrect: incorrectCount,
      totalUnanswered: unansweredCount,
      accuracyRate: accuracyRate,
      percentile: percentile,
      subjectBreakdown: subjectBreakdown,
    };

    recordTestAttempt(newAttempt);

    // Redirect to results
    router.push(`/portal/tests/${test.id}/results?attemptId=${attemptId}`);
  };

  const answeredCount = Object.keys(answers).length;
  const reviewCount = Object.values(markedReview).filter(Boolean).length;
  const unansweredCount = test.questions.length - answeredCount;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', minHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Test Header with Countdown & Controls */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div>
          <span className="badge badge-blue" style={{ marginBottom: '4px' }}>
            {test.category}
          </span>
          <h2 style={{ fontSize: '1.125rem', color: '#0F172A', margin: 0 }}>
            {test.title}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Timer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: timeLeft < 300 ? '#FEF2F2' : '#EFF6FF',
              color: timeLeft < 300 ? '#DC2626' : '#1D4ED8',
              border: `1px solid ${timeLeft < 300 ? '#FECACA' : '#BFDBFE'}`,
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1.125rem',
            }}
          >
            <Clock size={18} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="btn-primary"
            style={{ backgroundColor: '#10B981', padding: '8px 18px', fontSize: '0.875rem' }}
          >
            Submit Block
          </button>
        </div>
      </header>

      {/* Main 2-Column Examination Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '24px',
          flex: 1,
        }}
      >
        {/* Left Column: Question Vignette & Multiple Choice Options */}
        <div
          className="card"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Question Info Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F1F5F9',
                paddingBottom: '14px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: '1.125rem',
                    color: '#2563EB',
                  }}
                >
                  Question {currentIndex + 1} of {test.questions.length}
                </span>
                <span className="badge badge-gray">{currentQuestion.subject}</span>
                <span className="badge badge-gray">{currentQuestion.topic}</span>
              </div>

              <button
                onClick={handleToggleMarkReview}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: markedReview[currentQuestion.id] ? '#D97706' : '#64748B',
                  backgroundColor: markedReview[currentQuestion.id] ? '#FFFBEB' : '#F1F5F9',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: markedReview[currentQuestion.id] ? '1px solid #FDE68A' : '1px solid transparent',
                }}
              >
                <Bookmark size={14} fill={markedReview[currentQuestion.id] ? '#D97706' : 'none'} />
                <span>{markedReview[currentQuestion.id] ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text / Clinical Vignette */}
            <div
              style={{
                fontSize: '1.0625rem',
                color: '#0F172A',
                lineHeight: 1.7,
                marginBottom: '28px',
                whiteSpace: 'pre-line',
              }}
            >
              {currentQuestion.questionText}
            </div>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        backgroundColor: isSelected ? '#2563EB' : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        flexShrink: 0,
                      }}
                    >
                      {opt.id}
                    </div>
                    <div
                      style={{
                        fontSize: '0.9375rem',
                        color: isSelected ? '#1E3A8A' : '#334155',
                        fontWeight: isSelected ? 600 : 400,
                        lineHeight: 1.5,
                      }}
                    >
                      {opt.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Nav Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '20px',
              marginTop: '32px',
            }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="btn-outline"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  opacity: currentIndex === 0 ? 0.4 : 1,
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              {answers[currentQuestion.id] && (
                <button
                  onClick={handleClearOption}
                  style={{
                    fontSize: '0.8125rem',
                    color: '#64748B',
                    padding: '8px 12px',
                    borderRadius: '6px',
                  }}
                >
                  Clear Selection
                </button>
              )}
            </div>

            <button
              onClick={() => {
                if (currentIndex < test.questions.length - 1) {
                  setCurrentIndex((prev) => prev + 1);
                } else {
                  setSubmitModalOpen(true);
                }
              }}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.875rem' }}
            >
              <span>{currentIndex < test.questions.length - 1 ? 'Next Question' : 'Review & Submit'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Question Palette Grid & Progress */}
        <div
          className="card"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '14px' }}>
            Question Palette
          </h3>

          {/* Legend */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '0.75rem',
              color: '#64748B',
              marginBottom: '20px',
              paddingBottom: '14px',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#2563EB' }} />
              <span>Answered ({answeredCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#F59E0B' }} />
              <span>Marked ({reviewCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#E2E8F0' }} />
              <span>Unanswered ({unansweredCount})</span>
            </div>
          </div>

          {/* Palette Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '24px',
            }}
          >
            {test.questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isMarked = !!markedReview[q.id];
              const isCurrent = idx === currentIndex;

              let bgColor = '#F1F5F9';
              let textColor = '#475569';
              let borderColor = 'transparent';

              if (isAnswered) {
                bgColor = '#2563EB';
                textColor = '#FFFFFF';
              }
              if (isMarked) {
                bgColor = '#F59E0B';
                textColor = '#FFFFFF';
              }
              if (isCurrent) {
                borderColor = '#0F172A';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: bgColor,
                    color: textColor,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isCurrent ? '2px solid #0F172A' : `1px solid ${borderColor}`,
                    boxShadow: isCurrent ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Submit Action */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
            >
              Review & Submit Exam
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {submitModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSubmitModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '12px' }}>
              Confirm Mock Exam Submission
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '20px' }}>
              Are you sure you want to finalize your answers and end this exam block?
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.875rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Total Questions:</span>
                <strong>{test.questions.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#2563EB' }}>Answered:</span>
                <strong style={{ color: '#2563EB' }}>{answeredCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#D97706' }}>Marked for Review:</span>
                <strong style={{ color: '#D97706' }}>{reviewCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#EF4444' }}>Unanswered:</span>
                <strong style={{ color: '#EF4444' }}>{unansweredCount}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="btn-outline"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Back to Exam
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', backgroundColor: '#10B981' }}
              >
                {isSubmitting ? 'Calculating...' : 'Submit & View Score'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
