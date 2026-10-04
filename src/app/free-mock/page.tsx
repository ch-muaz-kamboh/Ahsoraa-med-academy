'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface FreeMockQuestion {
  id: string;
  text: string;
  options: string[];
  correct_option: string;
  explanation: string | null;
  subject: string | null;
}

export default function FreeMockPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<FreeMockQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes

  useEffect(() => {
    async function fetchQuestions() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('free_mock_questions')
        .select('*');
      
      if (!error && data) {
        setQuestions(data);
      }
      setLoading(false);
    }
    fetchQuestions();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (loading || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, submitted, timeLeft]);

  // Auto-submit when time reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !submitted && questions.length > 0) {
      handleSubmit();
    }
  }, [timeLeft, submitted, questions]);

  const handleSubmit = () => {
    let currentScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '76px' }}>
          <p>Loading free mock test...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '76px' }}>
          <h2>No Questions Available</h2>
          <p>The free mock test is currently being updated. Please check back later.</p>
          <button onClick={() => router.push('/')} className="btn-primary" style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px' }}>
            Return Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div className="container" style={{ flex: 1, marginTop: '100px', marginBottom: '60px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <CheckCircle size={64} color="#22C55E" style={{ margin: '0 auto 20px auto' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Test Completed!</h1>
            <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '32px' }}>
              You scored {score} out of {questions.length} correct.
            </p>
            
            <div style={{ textAlign: 'left', marginTop: '40px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>Review Answers</h3>
              {questions.map((q, idx) => {
                const isCorrect = answers[q.id] === q.correct_option;
                const answered = !!answers[q.id];
                return (
                  <div key={q.id} style={{ marginBottom: '24px', padding: '20px', border: `1px solid ${isCorrect ? '#86EFAC' : '#FECACA'}`, borderRadius: '12px', backgroundColor: isCorrect ? '#F0FDF4' : '#FEF2F2' }}>
                    <p style={{ fontWeight: 600, marginBottom: '12px' }}>Q{idx + 1}. {q.text}</p>
                    <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>
                      <strong>Your Answer:</strong> {answered ? answers[q.id] : <span style={{ color: '#EF4444' }}>Skipped</span>}
                    </p>
                    {!isCorrect && (
                      <p style={{ color: '#166534', fontSize: '0.9rem', marginBottom: '8px' }}>
                        <strong>Correct Answer:</strong> {q.correct_option}
                      </p>
                    )}
                    {q.explanation && (
                      <p style={{ color: '#334155', fontSize: '0.85rem', marginTop: '12px', padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            
            <button onClick={() => router.push('/portal/dashboard')} className="btn-primary" style={{ marginTop: '30px', padding: '12px 30px', fontSize: '1.1rem', borderRadius: '8px' }}>
              Create an Account for Full Access
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />
      
      <div className="container" style={{ flex: 1, marginTop: '100px', marginBottom: '60px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>Free IMAT Mock Test</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748B' }}>Question {currentIndex + 1} of {questions.length}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: timeLeft < 300 ? '#EF4444' : '#0F172A', fontWeight: 600, fontSize: '1.1rem' }}>
              <Clock size={20} />
              <span suppressHydrationWarning>{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={handleSubmit}
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Submit Test
            </button>
          </div>
        </header>

        {/* Question Area */}
        <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
          <main style={{ flex: 1, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#1E293B', lineHeight: 1.6 }}>
                <span style={{ fontWeight: 700, marginRight: '8px' }}>Q{currentIndex + 1}.</span>
                {currentQuestion.text}
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQuestion.options?.map((opt, idx) => {
                const isSelected = answers[currentQuestion.id] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      borderRadius: '10px',
                      border: `1px solid ${isSelected ? '#3B82F6' : '#E2E8F0'}`,
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${isSelected ? '#3B82F6' : '#CBD5E1'}`, backgroundColor: isSelected ? '#3B82F6' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? '#FFFFFF' : '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: '0.9375rem', color: isSelected ? '#1E3A8A' : '#334155' }}>{opt}</span>
                  </button>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', backgroundColor: '#F1F5F9', color: currentIndex === 0 ? '#94A3B8' : '#475569', fontWeight: 600, border: 'none', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              
              <button
                onClick={() => {
                  if (currentIndex === questions.length - 1) {
                    handleSubmit();
                  } else {
                    setCurrentIndex((prev) => prev + 1);
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', backgroundColor: '#2563EB', color: '#FFFFFF', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
                {currentIndex !== questions.length - 1 && <ChevronRight size={18} />}
              </button>
            </div>
          </main>
          
          {/* Question Navigator */}
          <aside style={{ width: '320px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', alignSelf: 'flex-start' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Question Navigator</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {questions.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = !!answers[q.id];
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `2px solid ${isCurrent ? '#2563EB' : 'transparent'}`,
                      backgroundColor: isAnswered ? '#10B981' : '#F1F5F9',
                      color: isAnswered ? '#FFFFFF' : '#475569',
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#10B981' }}></div>
                <span style={{ fontSize: '0.875rem', color: '#475569' }}>Answered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#F1F5F9' }}></div>
                <span style={{ fontSize: '0.875rem', color: '#475569' }}>Not Answered</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
