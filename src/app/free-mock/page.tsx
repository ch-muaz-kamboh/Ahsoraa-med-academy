'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Brain,
  FlaskConical,
  Atom,
  Target,
  GraduationCap,
  Award,
  RotateCcw,
  Sparkles,
  Globe,
  ShieldCheck,
  Check,
  X,
  Play,
  FileCheck,
  Library,
  Users,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DEFAULT_FREE_MOCK_QUESTIONS, FreeMockQuestion } from '@/lib/free-mock-questions';

const OPTION_LABELS = ['a', 'b', 'c', 'd', 'e'] as const;
type OptionLetter = typeof OPTION_LABELS[number];

function getOptionText(q: FreeMockQuestion, opt: OptionLetter) {
  const map: Record<OptionLetter, string> = {
    a: q.option_a,
    b: q.option_b,
    c: q.option_c,
    d: q.option_d,
    e: q.option_e,
  };
  return map[opt] || '';
}

export default function FreeMockPage() {
  const router = useRouter();
  const [view, setView] = useState<'intro' | 'test' | 'results'>('intro');
  const [questions, setQuestions] = useState<FreeMockQuestion[]>(DEFAULT_FREE_MOCK_QUESTIONS);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionLetter>>({});
  const [timeLeft, setTimeLeft] = useState(100 * 60); // 100 minutes = 6000 seconds
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  // Load questions from Supabase if available; fallback to DEFAULT_FREE_MOCK_QUESTIONS
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('free_mock_questions')
          .select('*');

        if (!error && data && data.length > 0) {
          // If supabase has questions, use them
          setQuestions(data as FreeMockQuestion[]);
        } else {
          setQuestions(DEFAULT_FREE_MOCK_QUESTIONS);
        }
      } catch (err) {
        console.warn('Using preloaded IMAT questions:', err);
        setQuestions(DEFAULT_FREE_MOCK_QUESTIONS);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // Timer countdown while in test view
  useEffect(() => {
    if (view !== 'test' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setView('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  // Handler to start the test
  const handleStartTest = () => {
    setTimeLeft(100 * 60);
    setCurrentIndex(0);
    setAnswers({});
    setView('test');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handler to submit the test
  const handleSubmitTest = () => {
    setConfirmSubmitOpen(false);
    setView('results');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handler to retake mock test
  const handleRetakeMock = () => {
    setAnswers({});
    setCurrentIndex(0);
    setTimeLeft(100 * 60);
    setView('intro');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Scoring Logic based on official CBT Mock (+1.5 for correct, -0.4 for incorrect, 0 for unattempted)
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let rawScore = 0;

  questions.forEach((q) => {
    const selected = answers[q.id];
    if (!selected) {
      unansweredCount++;
    } else if (selected.toLowerCase() === q.correct_option.toLowerCase()) {
      correctCount++;
      rawScore += 1.5;
    } else {
      incorrectCount++;
      rawScore -= 0.4;
    }
  });

  const attemptedCount = correctCount + incorrectCount;
  const finalScoreOutOf90 = Number(rawScore.toFixed(2));
  const accuracyRate = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
  const timeSpentSeconds = 100 * 60 - timeLeft;

  // Filter ONLY questions that were attempted
  const attemptedQuestions = questions.filter((q) => !!answers[q.id]);

  /* ══════════════════════════════════════════════════════════
     VIEW 1: INTRODUCTION & INFORMATION PAGE (Default)
  ══════════════════════════════════════════════════════════ */
  if (view === 'intro') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FAFCFA' }}>
        <Navbar />

        <main style={{ flex: 1, marginTop: '80px', paddingBottom: '80px' }}>
          {/* Breadcrumb Bar */}
          <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '14px 0' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#64748B' }}>
              <Link href="/" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
              <span>/</span>
              <span style={{ color: '#0F172A', fontWeight: 600 }}>Free IMAT Mock Test</span>
            </div>
          </div>

          <div className="container" style={{ marginTop: '40px' }}>
            {/* Hero Split Layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.9fr)',
                gap: '40px',
                alignItems: 'start',
                marginBottom: '60px',
              }}
              className="free-mock-hero-grid"
            >
              {/* LEFT COLUMN: Core Mock Information */}
              <div>
                {/* Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#059669',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                  }}
                >
                  <Sparkles size={14} />
                  <span>Official Diagnostic Simulation</span>
                </div>

                {/* Main Heading */}
                <h1
                  style={{
                    fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.15,
                    marginBottom: '14px',
                    letterSpacing: '-1px',
                    fontFamily: 'var(--font-serif), Georgia, serif',
                  }}
                >
                  FREE IMAT MOCK TEST
                </h1>

                {/* Subtitle Spec Bar */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                    fontWeight: 700,
                    color: '#059669',
                    marginBottom: '24px',
                    padding: '8px 18px',
                    backgroundColor: '#F0FDF4',
                    borderRadius: '10px',
                    border: '1px solid #BBF7D0',
                  }}
                >
                  <span>60 Questions. 100 Minutes. Unlimited Attempts.</span>
                </div>

                {/* Narrative Description */}
                <p
                  style={{
                    fontSize: '1.0625rem',
                    lineHeight: 1.75,
                    color: '#334155',
                    marginBottom: '28px',
                  }}
                >
                  This free mock has been created by Ahsora Meds Academy around the IMAT 2026 syllabus and exam structure, giving you a realistic way to test your preparation before exam day. Take it once to see where you stand. Then come back and retake it as many times as you want to measure how much you’ve improved.
                </p>

                {/* The Mock Covers Section */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '24px 28px',
                    marginBottom: '28px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      marginBottom: '16px',
                    }}
                  >
                    The mock covers:
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <Brain size={18} color="#059669" />
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>Logical Reasoning</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <BookOpen size={18} color="#059669" />
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>Reading Skills & Acquired knowledge</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <FlaskConical size={18} color="#059669" />
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>Biology</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <Atom size={18} color="#059669" />
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>Chemistry</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <Target size={18} color="#059669" />
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>Physics & Mathematics</span>
                    </div>
                  </div>
                </div>

                {/* Exam Mindset & Advice Card */}
                <div
                  style={{
                    backgroundColor: '#F0FDF4',
                    borderLeft: '4px solid #059669',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    boxShadow: '0 2px 6px rgba(5,150,105,0.06)',
                  }}
                >
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#166534', marginBottom: '12px', fontWeight: 500 }}>
                    Treat this test as more than just a score. Use it to see where you currently stand, which subjects are costing you marks, where your timing needs work, and what you should focus on next.
                  </p>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#166534', margin: 0, fontWeight: 500 }}>
                    A single attempt cannot predict your final IMAT result. What it can do is show you where your preparation needs to improve. And with unlimited attempts, you can keep coming back to test that improvement.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Dedicated Sticky Card to Start Test */}
              <div style={{ position: 'sticky', top: '100px' }}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '2px solid #BBF7D0',
                    boxShadow: '0 12px 36px -4px rgba(5, 150, 105, 0.15)',
                    padding: '32px 28px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative corner accent */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '120px',
                      height: '120px',
                      background: 'radial-gradient(circle at top right, rgba(92, 237, 115, 0.25) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#059669',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        backgroundColor: '#ECFDF5',
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      Instant CBT Simulation
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>100% Free</span>
                  </div>

                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    FREE IMAT MOCK TEST
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '24px' }}>
                    Real exam conditions, official Italian scoring (+1.5 / -0.4), and instant score calculation out of 90.
                  </p>

                  {/* Test Specs Highlights */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      marginBottom: '24px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: '#64748B' }}>Questions:</span>
                      <strong style={{ color: '#0F172A' }}>60 Questions</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: '#64748B' }}>Time Limit:</span>
                      <strong style={{ color: '#0F172A' }}>100 Minutes</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: '#64748B' }}>Scoring Algorithm:</span>
                      <span style={{ fontWeight: 700 }}>
                        <span style={{ color: '#059669' }}>+1.5</span> / <span style={{ color: '#EF4444' }}>-0.4</span> / <span style={{ color: '#64748B' }}>0</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: '#64748B' }}>Max Total Score:</span>
                      <strong style={{ color: '#059669' }}>90 Marks</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: '#64748B' }}>Attempts Allowed:</span>
                      <strong style={{ color: '#059669' }}>Unlimited</strong>
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    onClick={handleStartTest}
                    id="start-free-mock-btn"
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1.0625rem',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      boxShadow: '0 8px 24px -4px rgba(5,150,105,0.45)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#047857';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>START FREE MOCK</span>
                    <ArrowRight size={20} />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', color: '#64748B', fontSize: '0.8125rem' }}>
                    <ShieldCheck size={16} color="#059669" />
                    <span>No credit card or login needed to start</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SECTION: WHAT WE OFFER INSIDE OUR STUDENT PORTAL
            ══════════════════════════════════════════════════ */}
            <section
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '48px 40px',
                marginBottom: '48px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ maxWidth: '820px', marginBottom: '36px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Ahsora Meds Ecosystem
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
                    fontWeight: 800,
                    color: '#0F172A',
                    marginTop: '6px',
                    marginBottom: '14px',
                    fontFamily: 'var(--font-serif), Georgia, serif',
                  }}
                >
                  THIS IS JUST A TASTE OF WHAT WE OFFER INSIDE OUR STUDENT PORTAL
                </h2>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7 }}>
                  The free mock gives you a small look at the preparation system our students use throughout their IMAT journey.
                  Inside the Ahsora Meds Academy Student Portal, students get access to:
                </p>
              </div>

              {/* Portal Features Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                <div style={{ padding: '22px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#059669' }}>
                    <FileCheck size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      5,000+ IMAT Practice Questions
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                      Practice across different subjects, topics, and difficulty levels with complete rationale explanations.
                    </p>
                  </div>
                </div>

                <div style={{ padding: '22px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#059669' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      15 Full CBT Mock Exams
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                      Realistic, timed exam simulations replicating exact Italian ministry testing software and conditions.
                    </p>
                  </div>
                </div>

                <div style={{ padding: '22px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#059669' }}>
                    <Target size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      Custom Practice Tests
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                      Build customized drills where you choose the subject, topic, number of questions, and test duration.
                    </p>
                  </div>
                </div>

                <div style={{ padding: '22px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#059669' }}>
                    <Award size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      Detailed Performance Analytics
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                      Track your overall, subject-wise, and topic-wise progress with peer percentile benchmarks.
                    </p>
                  </div>
                </div>

                <div style={{ padding: '22px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#059669' }}>
                    <Library size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      Complete IMAT Digital Library
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                      Notes, solved past papers, Ahsora Meds Academy’s own preparation books, formula sheets, and study materials.
                    </p>
                  </div>
                </div>

                <div style={{ padding: '22px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#059669' }}>
                    <Users size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      Live Classes with Subject Specialists
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                      Interactive live lectures led by expert instructors focused on test strategy and concept mastery.
                    </p>
                  </div>
                </div>

                <div style={{ padding: '22px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', gap: '16px', gridColumn: '1 / -1' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#059669' }}>
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      Regular Doubt-Clarification Support
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                      Direct communication channels with faculty to resolve challenging questions and conceptual roadblocks quickly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════
                SECTION: AND WE DON'T STOP AT IMAT PREPARATION
            ══════════════════════════════════════════════════ */}
            <section
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '48px 40px',
                marginBottom: '40px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ maxWidth: '820px', marginBottom: '32px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  End-To-End Medical Admission
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
                    fontWeight: 800,
                    color: '#0F172A',
                    marginTop: '6px',
                    marginBottom: '14px',
                    fontFamily: 'var(--font-serif), Georgia, serif',
                  }}
                >
                  AND WE DON’T STOP AT IMAT PREPARATION
                </h2>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7 }}>
                  Getting into medical school in Italy involves much more than passing the IMAT. Our students can also receive support with:
                </p>
              </div>

              {/* Admissions Roadmap Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '14px',
                  marginBottom: '28px',
                }}
              >
                {[
                  'University selection',
                  'Admission applications',
                  'Scholarship applications',
                  'IMAT registration',
                  'Universitaly and pre-enrolment procedures',
                  'Document preparation and verification',
                  'Visa guidance',
                  'Pre-departure guidance',
                  'Post-arrival documentation and assistance in Italy',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#1E293B',
                    }}
                  >
                    <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p style={{ color: '#64748B', fontSize: '0.9375rem', fontStyle: 'italic', marginBottom: '16px' }}>
                And much more throughout the admission journey.
              </p>
              <p style={{ color: '#0F172A', fontSize: '1.0625rem', fontWeight: 600, lineHeight: 1.7, marginBottom: '32px' }}>
                From your first IMAT practice test to university admission and your arrival in Italy, Ahsora Meds Academy is built to support the journey, not just the exam.
              </p>

              {/* Bottom Quick Start Action */}
              <div
                style={{
                  padding: '28px',
                  backgroundColor: '#F0FDF4',
                  borderRadius: '16px',
                  border: '1px solid #BBF7D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    Ready to take your Free Diagnostic Mock?
                  </h4>
                  <p style={{ color: '#166534', fontSize: '0.9375rem' }}>
                    60 Questions • 100 Minutes • Official +1.5 / -0.4 scoring logic.
                  </p>
                </div>
                <button
                  onClick={handleStartTest}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 18px -2px rgba(5,150,105,0.4)',
                  }}
                >
                  <span>START FREE MOCK</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>
          </div>
        </main>

        <Footer />

        <style jsx global>{`
          @media (max-width: 900px) {
            .free-mock-hero-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     VIEW 2: TEST TAKING INTERFACE (Active Test)
  ══════════════════════════════════════════════════════════ */
  if (view === 'test') {
    const currentQ = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const answeredCount = Object.keys(answers).length;

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
        <Navbar />

        <div className="container" style={{ flex: 1, marginTop: '96px', marginBottom: '60px', display: 'flex', flexDirection: 'column' }}>
          {/* Header Bar with synchronized timer and submit button */}
          <header
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '18px 26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                  Free IMAT Mock Test
                </h1>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#059669',
                    backgroundColor: '#ECFDF5',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  60 Questions • 100 Min
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
                Question {currentIndex + 1} of {questions.length} • {currentQ?.subject || 'IMAT Section'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Timer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: timeLeft < 300 ? '#EF4444' : '#0F172A',
                  backgroundColor: timeLeft < 300 ? '#FEF2F2' : '#F8FAFC',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${timeLeft < 300 ? '#FECACA' : '#E2E8F0'}`,
                }}
              >
                <Clock size={20} color={timeLeft < 300 ? '#EF4444' : '#059669'} />
                <span suppressHydrationWarning>{formatTime(timeLeft)}</span>
              </div>

              {/* Submit Test Button */}
              <button
                onClick={() => setConfirmSubmitOpen(true)}
                style={{
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                }}
              >
                Submit Test
              </button>
            </div>
          </header>

          {/* Test Interface Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 300px',
              gap: '24px',
              alignItems: 'start',
              flex: 1,
            }}
            className="test-interface-grid"
          >
            {/* Question Panel */}
            <main
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '36px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}
            >
              {/* Question Meta */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#059669',
                    backgroundColor: '#ECFDF5',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    border: '1px solid #A7F3D0',
                  }}
                >
                  {currentQ?.subject || 'IMAT Practice'}
                </span>
                <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                  Scoring: +1.5 / -0.4 / 0
                </span>
              </div>

              {/* Question Text */}
              <h2
                style={{
                  fontSize: '1.1875rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  lineHeight: 1.7,
                  marginBottom: '32px',
                }}
              >
                <span style={{ fontWeight: 800, marginRight: '10px', color: '#059669' }}>
                  Q{currentIndex + 1}.
                </span>
                {currentQ?.question}
              </h2>

              {/* MCQ Options A - E */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {OPTION_LABELS.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [currentQ.id]: opt })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? '#059669' : '#E2E8F0'}`,
                        backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? '#059669' : '#CBD5E1'}`,
                          backgroundColor: isSelected ? '#059669' : '#F8FAFC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.875rem',
                          color: isSelected ? '#FFFFFF' : '#64748B',
                          flexShrink: 0,
                        }}
                      >
                        {opt.toUpperCase()}
                      </div>
                      <span
                        style={{
                          fontSize: '0.95rem',
                          color: isSelected ? '#065F46' : '#334155',
                          fontWeight: isSelected ? 600 : 400,
                          lineHeight: 1.5,
                        }}
                      >
                        {getOptionText(currentQ, opt)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Clear Answer Button */}
              {answers[currentQ.id] && (
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                  <button
                    onClick={() => {
                      const updated = { ...answers };
                      delete updated[currentQ.id];
                      setAnswers(updated);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Clear answer (leave blank to avoid -0.4 penalty)
                  </button>
                </div>
              )}

              {/* Question Navigation */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '40px',
                  paddingTop: '24px',
                  borderTop: '1px solid #E2E8F0',
                }}
              >
                <button
                  onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                  disabled={currentIndex === 0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: currentIndex === 0 ? '#94A3B8' : '#334155',
                    fontWeight: 600,
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    if (isLastQuestion) {
                      setConfirmSubmitOpen(true);
                    } else {
                      setCurrentIndex((p) => p + 1);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isLastQuestion ? '#059669' : '#0F172A',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <span>{isLastQuestion ? 'Review & Submit' : 'Next Question'}</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </main>

            {/* Question Palette Sidebar */}
            <aside
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                position: 'sticky',
                top: '100px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>
                  Question Palette
                </h3>
                <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                  {answeredCount}/{questions.length} done
                </span>
              </div>

              {/* 60 Questions Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px',
                  maxHeight: '360px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                  marginBottom: '20px',
                }}
              >
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
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: `2px solid ${isCurrent ? '#059669' : 'transparent'}`,
                        backgroundColor: isAnswered ? '#059669' : '#F1F5F9',
                        color: isAnswered ? '#FFFFFF' : isCurrent ? '#059669' : '#475569',
                        transition: 'all 0.1s ease',
                      }}
                      title={`Go to Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Palette Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: '#059669' }} />
                  <span style={{ color: '#475569' }}>Answered ({answeredCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }} />
                  <span style={{ color: '#475569' }}>Unanswered ({questions.length - answeredCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '4px', border: '2px solid #059669', backgroundColor: '#FFFFFF' }} />
                  <span style={{ color: '#475569' }}>Current Question</span>
                </div>
              </div>

              <button
                onClick={() => setConfirmSubmitOpen(true)}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '12px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Submit Test Early
              </button>
            </aside>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {confirmSubmitOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
                borderRadius: '18px',
                padding: '32px',
                maxWidth: '460px',
                width: '100%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <HelpCircle size={32} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Submit Free IMAT Mock Test?
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '20px' }}>
                You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
                {questions.length - answeredCount > 0 && (
                  <span>
                    {' '}You still have <strong>{questions.length - answeredCount}</strong> unanswered questions.
                  </span>
                )}
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => setConfirmSubmitOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Continue Test
                </button>
                <button
                  onClick={handleSubmitTest}
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />

        <style jsx global>{`
          @media (max-width: 900px) {
            .test-interface-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     VIEW 3: RESULTS & ATTEMPTED MCQS REVIEW
  ══════════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FAFCFA' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, marginTop: '100px', marginBottom: '60px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* Top Result Score Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '40px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto',
              }}
            >
              <CheckCircle size={40} />
            </div>

            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: '#059669',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                backgroundColor: '#ECFDF5',
                padding: '4px 12px',
                borderRadius: '9999px',
              }}
            >
              Diagnostic Mock Completed
            </span>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginTop: '10px', marginBottom: '8px' }}>
              Your Free IMAT Mock Score
            </h1>

            {/* Score out of 90 */}
            <div style={{ margin: '24px 0' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: '6px',
                  padding: '16px 36px',
                  backgroundColor: '#F0FDF4',
                  borderRadius: '16px',
                  border: '2px solid #BBF7D0',
                }}
              >
                <span style={{ fontSize: '3.2rem', fontWeight: 900, color: finalScoreOutOf90 >= 40 ? '#059669' : '#D97706' }}>
                  {finalScoreOutOf90.toFixed(1)}
                </span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#64748B' }}>
                  / 90
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                marginTop: '28px',
                paddingTop: '24px',
                borderTop: '1px solid #E2E8F0',
              }}
            >
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>Attempted</span>
                <strong style={{ fontSize: '1.25rem', color: '#0F172A' }}>{attemptedCount} / {questions.length}</strong>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
                <span style={{ fontSize: '0.75rem', color: '#166534', display: 'block', textTransform: 'uppercase' }}>Correct (+1.5)</span>
                <strong style={{ fontSize: '1.25rem', color: '#059669' }}>{correctCount}</strong>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#FEF2F2', borderRadius: '10px', border: '1px solid #FEE2E2' }}>
                <span style={{ fontSize: '0.75rem', color: '#991B1B', display: 'block', textTransform: 'uppercase' }}>Incorrect (-0.4)</span>
                <strong style={{ fontSize: '1.25rem', color: '#DC2626' }}>{incorrectCount}</strong>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>Unanswered (0)</span>
                <strong style={{ fontSize: '1.25rem', color: '#64748B' }}>{unansweredCount}</strong>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>Accuracy</span>
                <strong style={{ fontSize: '1.25rem', color: '#0F172A' }}>{accuracyRate}%</strong>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              UPSELL / IN-DEPTH ANALYSIS CARD (REQUIRED TEXT)
          ══════════════════════════════════════════════════ */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid #5CED73',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(92, 237, 115, 0.18)',
              marginBottom: '40px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle at top right, rgba(92, 237, 115, 0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#059669',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                backgroundColor: '#ECFDF5',
                padding: '4px 10px',
                borderRadius: '6px',
                display: 'inline-block',
                marginBottom: '12px',
              }}
            >
              Ahsora Meds Academy Portal
            </span>

            <h2
              style={{
                fontSize: 'clamp(1.3rem, 2.4vw, 1.75rem)',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '12px',
                fontFamily: 'var(--font-serif), Georgia, serif',
              }}
            >
              WANT TO UNDERSTAND YOUR RESULT IN MORE DETAIL?
            </h2>

            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, marginBottom: '20px' }}>
              Your free mock shows your score and the correct answers. Register with Ahsora Meds Academy to access the full student experience, including:
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>Subject-wise performance analysis</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>Topic-wise strengths and weaknesses</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>Detailed review of your mistakes</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>Conceptual explanations</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>Progress tracking across your practice</span>
              </li>
            </ul>

            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '28px' }}>
              Don’t just see what you got wrong. Understand why, and know what to work on next.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                href="/register"
                id="register-explore-courses-btn"
                style={{
                  padding: '14px 28px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px -2px rgba(5,150,105,0.4)',
                  transition: 'background-color 0.2s',
                }}
              >
                <span>Register & Explore Our Courses</span>
                <ArrowRight size={18} />
              </Link>

              <button
                onClick={handleRetakeMock}
                style={{
                  padding: '13px 22px',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RotateCcw size={16} />
                <span>Retake Free Mock</span>
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              MCQ REVIEW: ONLY OF THE MCQS ATTEMPTED
          ══════════════════════════════════════════════════ */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '36px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                  Attempted MCQs Review
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '2px' }}>
                  Showing the correct answer and the answer you marked for the {attemptedQuestions.length} questions you attempted.
                </p>
              </div>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#059669',
                  backgroundColor: '#ECFDF5',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                }}
              >
                {attemptedQuestions.length} Attempted
              </span>
            </div>

            {/* If no questions were attempted */}
            {attemptedQuestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                <p style={{ fontSize: '1rem', marginBottom: '16px' }}>
                  You submitted the test without attempting any questions.
                </p>
                <button
                  onClick={handleRetakeMock}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Start an Attempt Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {attemptedQuestions.map((q) => {
                  const originalIndex = questions.findIndex((item) => item.id === q.id);
                  const selectedOpt = answers[q.id];
                  const isCorrect = selectedOpt.toLowerCase() === q.correct_option.toLowerCase();

                  return (
                    <div
                      key={q.id}
                      style={{
                        padding: '24px',
                        borderRadius: '14px',
                        border: `1.5px solid ${isCorrect ? '#86EFAC' : '#FECACA'}`,
                        backgroundColor: isCorrect ? '#F0FDF4' : '#FEF2F2',
                      }}
                    >
                      {/* Question Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                          Question {originalIndex + 1}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: isCorrect ? '#166534' : '#991B1B',
                              backgroundColor: isCorrect ? '#DCFCE7' : '#FEE2E2',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            {isCorrect ? '+1.5 Marks' : '-0.4 Marks'}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#64748B',
                              backgroundColor: '#FFFFFF',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                            }}
                          >
                            {q.subject || 'General'}
                          </span>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p style={{ fontWeight: 600, color: '#0F172A', marginBottom: '16px', lineHeight: 1.6 }}>
                        {q.question}
                      </p>

                      {/* Marked vs Correct Answer Comparison */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* The answer student marked */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            backgroundColor: isCorrect ? '#DCFCE7' : '#FEE2E2',
                            border: `1px solid ${isCorrect ? '#86EFAC' : '#FCA5A5'}`,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {isCorrect ? (
                              <CheckCircle2 size={18} color="#16A34A" />
                            ) : (
                              <XCircle size={18} color="#DC2626" />
                            )}
                            <span style={{ fontSize: '0.875rem', color: isCorrect ? '#166534' : '#991B1B', fontWeight: 600 }}>
                              Your Marked Answer: <strong>({selectedOpt.toUpperCase()}) {getOptionText(q, selectedOpt)}</strong>
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isCorrect ? '#16A34A' : '#DC2626' }}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        {/* If incorrect, explicitly show the correct answer */}
                        {!isCorrect && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              backgroundColor: '#ECFDF5',
                              border: '1px solid #A7F3D0',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <CheckCircle2 size={18} color="#059669" />
                              <span style={{ fontSize: '0.875rem', color: '#065F46', fontWeight: 600 }}>
                                Correct Answer: <strong>({q.correct_option.toUpperCase()}) {getOptionText(q, q.correct_option.toLowerCase() as OptionLetter)}</strong>
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                              Official Solution
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
