'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Clock, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface FreeMockQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_option: 'a' | 'b' | 'c' | 'd' | 'e';
}

const OPTION_LABELS = ['a', 'b', 'c', 'd', 'e'] as const;

function getOptionText(q: FreeMockQuestion, opt: typeof OPTION_LABELS[number]) {
  const map = { a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d, e: q.option_e };
  return map[opt];
}

export default function FreeMockPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<FreeMockQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, typeof OPTION_LABELS[number]>>({});
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
        setQuestions(data as FreeMockQuestion[]);
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

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && !submitted && questions.length > 0) {
      handleSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '76px' }}>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>Loading free mock test…</p>
        </div>
        <Footer />
      </div>
    );
  }

  /* -------------------- NO QUESTIONS -------------------- */
  if (questions.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '76px', gap: '16px' }}>
          <h2 style={{ fontWeight: 700, color: '#0F172A' }}>No Questions Yet</h2>
          <p style={{ color: '#64748B' }}>The free mock test is being prepared. Please check back soon.</p>
          <button onClick={() => router.push('/')} style={{ marginTop: '8px', padding: '10px 24px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Return Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  /* -------------------- RESULTS -------------------- */
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
        <Navbar />
        <div className="container" style={{ flex: 1, marginTop: '100px', marginBottom: '60px' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <CheckCircle size={64} color="#22C55E" style={{ margin: '0 auto 16px' }} />
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Test Completed!</h1>
              <p style={{ fontSize: '1.2rem', color: '#475569' }}>
                You answered <strong>{score}</strong> out of <strong>{questions.length}</strong> questions correctly.
              </p>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>Answer Review</h3>
            {questions.map((q, idx) => {
              const selected = answers[q.id];
              const isCorrect = selected === q.correct_option;
              return (
                <div key={q.id} style={{ marginBottom: '20px', padding: '20px', borderRadius: '12px', border: `1px solid ${isCorrect ? '#86EFAC' : selected ? '#FECACA' : '#E2E8F0'}`, backgroundColor: isCorrect ? '#F0FDF4' : selected ? '#FEF2F2' : '#FAFAFA' }}>
                  <p style={{ fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>Q{idx + 1}. {q.question}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {OPTION_LABELS.map((opt) => {
                      const isThis = opt === selected;
                      const isCorrectOpt = opt === q.correct_option;
                      return (
                        <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', backgroundColor: isCorrectOpt ? '#DCFCE7' : isThis && !isCorrectOpt ? '#FEE2E2' : 'transparent', fontWeight: isCorrectOpt || isThis ? 600 : 400 }}>
                          <span style={{ minWidth: '24px', fontWeight: 700, color: isCorrectOpt ? '#16A34A' : isThis ? '#DC2626' : '#64748B' }}>{opt.toUpperCase()}.</span>
                          <span style={{ color: isCorrectOpt ? '#16A34A' : isThis ? '#DC2626' : '#475569' }}>{getOptionText(q, opt)}</span>
                          {isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>✓ Correct</span>}
                          {isThis && !isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>✗ Your answer</span>}
                        </div>
                      );
                    })}
                    {!selected && <p style={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.875rem', marginTop: '4px' }}>Skipped</p>}
                  </div>
                </div>
              );
            })}

            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <p style={{ color: '#475569', marginBottom: '16px' }}>Want more full-length mocks, detailed explanations & progress tracking?</p>
              <button onClick={() => router.push('/portal/dashboard')} style={{ padding: '12px 32px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                Create a Free Account →
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* -------------------- TEST INTERFACE -------------------- */
  const currentQ = questions[currentIndex];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />

      <div className="container" style={{ flex: 1, marginTop: '100px', marginBottom: '60px', display: 'flex', flexDirection: 'column' }}>

        {/* Header bar */}
        <header style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>Free IMAT Mock Test</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748B' }}>Question {currentIndex + 1} of {questions.length}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.1rem', color: timeLeft < 300 ? '#EF4444' : '#0F172A' }}>
              <Clock size={20} />
              <span suppressHydrationWarning>{formatTime(timeLeft)}</span>
            </div>
            <button onClick={handleSubmit} style={{ backgroundColor: '#2563EB', color: '#FFF', padding: '8px 20px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Submit Test
            </button>
          </div>
        </header>

        {/* Body */}
        <div style={{ display: 'flex', gap: '24px', flex: 1, alignItems: 'flex-start' }}>

          {/* Question panel */}
          <main style={{ flex: 1, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1E293B', lineHeight: 1.65, marginBottom: '28px' }}>
              <span style={{ fontWeight: 800, marginRight: '8px', color: '#2563EB' }}>Q{currentIndex + 1}.</span>
              {currentQ.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {OPTION_LABELS.map((opt) => {
                const isSelected = answers[currentQ.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, [currentQ.id]: opt })}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '10px', border: `1.5px solid ${isSelected ? '#2563EB' : '#E2E8F0'}`, backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
                  >
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: `1.5px solid ${isSelected ? '#2563EB' : '#CBD5E1'}`, backgroundColor: isSelected ? '#2563EB' : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', color: isSelected ? '#FFFFFF' : '#64748B', flexShrink: 0 }}>
                      {opt.toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.9375rem', color: isSelected ? '#1E3A8A' : '#334155', fontWeight: isSelected ? 600 : 400 }}>
                      {getOptionText(currentQ, opt)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
              <button onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))} disabled={currentIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#F1F5F9', color: currentIndex === 0 ? '#94A3B8' : '#475569', fontWeight: 600, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}>
                <ChevronLeft size={18} /> Previous
              </button>
              <button
                onClick={() => currentIndex === questions.length - 1 ? handleSubmit() : setCurrentIndex((p) => p + 1)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#2563EB', color: '#FFFFFF', fontWeight: 600, cursor: 'pointer' }}
              >
                {currentIndex === questions.length - 1 ? 'Finish & Submit' : 'Next'} <ChevronRight size={18} />
              </button>
            </div>
          </main>

          {/* Navigator */}
          <aside style={{ width: '280px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Questions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '24px' }}>
              {questions.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = !!answers[q.id];
                return (
                  <button key={q.id} onClick={() => setCurrentIndex(idx)} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', border: `2px solid ${isCurrent ? '#2563EB' : 'transparent'}`, backgroundColor: isAnswered ? '#10B981' : '#F1F5F9', color: isAnswered ? '#FFFFFF' : isCurrent ? '#2563EB' : '#475569' }}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#10B981' }} />
                <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Answered ({Object.keys(answers).length})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#F1F5F9' }} />
                <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Not Answered ({questions.length - Object.keys(answers).length})</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
