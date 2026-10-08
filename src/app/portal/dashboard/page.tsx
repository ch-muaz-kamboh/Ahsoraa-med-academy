'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileCheck2,
  TrendingUp,
  Radio,
  PlayCircle,
  Target,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import {
  getPackageByIdOrName,
  getStudentTier,
  resolveEffectivePackage,
} from '@/lib/packages';

export default function StudentDashboardPage() {
  const { currentUser, courses, testAttempts, studentMistakes } = useAppStore();
  const [liveSession, setLiveSession] = useState<{ id: string; test_id: string; test_title: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('test_sessions')
      .select('id, test_id, test_title')
      .eq('is_live', true)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setLiveSession(data);
      });
  }, []);

  // Real computed stats
  const activeCourse = courses ? courses.find((c) => c.slug === 'imat-italy-medical-entrance-prep') || courses[0] : null;
  const totalAttempted = testAttempts.reduce((acc, t) => acc + (t.totalAttempted || 0), 0);
  const totalCorrect = testAttempts.reduce((acc, t) => acc + (t.totalCorrect || 0), 0);
  const avgAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const unresolvedMistakes = studentMistakes.filter((m) => !m.isResolved).length;
  const firstName = currentUser?.firstName || 'Student';

  const effectivePkg = resolveEffectivePackage(currentUser);
  const currentPkgObj = getPackageByIdOrName(effectivePkg);
  const studentTier = getStudentTier(effectivePkg);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Live Exam Alert */}
      {liveSession && (
        <div style={{ backgroundColor: '#FEF2F2', border: '2px solid #EF4444', borderRadius: '14px', padding: '18px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#EF4444', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '1px' }}>LIVE MOCK EXAM IN PROGRESS</div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>{liveSession.test_title}</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Join now to participate!</div>
            </div>
          </div>
          <Link href={`/portal/tests/${liveSession.test_id}/take`} style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <PlayCircle size={18} /><span>Join Live Test Now</span>
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%)', borderRadius: '16px', padding: '28px 32px', color: '#FFFFFF', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.85 }}>WELCOME BACK</span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 800,
                padding: '2px 10px',
                borderRadius: '12px',
                backgroundColor: studentTier === 'elite' ? '#FFEDD5' : studentTier === 'mastery' ? '#DCFCE7' : '#DCFCE7',
                color: studentTier === 'elite' ? '#C2410C' : studentTier === 'mastery' ? '#047857' : '#15803D',
              }}
            >
              {currentPkgObj.name} ({currentPkgObj.price})
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 6px 0' }}>{firstName}</h1>
          <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: 0 }}>
            {studentTier === 'elite'
              ? '👑 Full VIP Mentorship & Guidance: Live Masterclasses, MedPath Visa Guidance & Document Vault active.'
              : studentTier === 'mastery'
              ? '⚡ Mastery Track: Live Class Schedule, Masterclasses & Question Bank fully unlocked.'
              : '📚 Ascend Track: Full 120+ Hr Video Lectures, CBT Mocks & 2,500+ Question Bank active.'}
          </p>
        </div>
        <Link href="/portal/tests" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF', padding: '12px 22px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
          Start Practice Test <ChevronRight size={16} />
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Active Course</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#F0FFF4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={18} /></div>
          </div>
          {activeCourse ? (
            <>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>{activeCourse.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, marginTop: '6px' }}>{activeCourse.targetExam} • {activeCourse.totalLectures} Lectures</div>
            </>
          ) : (
            <div style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>No course enrolled</div>
          )}
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Mocks Completed</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#F0FFF4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileCheck2 size={18} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{testAttempts.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, marginTop: '4px' }}>Test sessions done</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Avg Accuracy</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={18} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{totalAttempted > 0 ? `${avgAccuracy}%` : '--'}</div>
          <div style={{ fontSize: '0.75rem', color: totalAttempted > 0 ? '#10B981' : '#94A3B8', fontWeight: 600, marginTop: '4px' }}>
            {totalAttempted > 0 ? `${totalCorrect} / ${totalAttempted} correct` : 'No attempts yet'}
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Mistakes Log</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={18} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{unresolvedMistakes}</div>
          <div style={{ fontSize: '0.75rem', color: unresolvedMistakes > 0 ? '#DC2626' : '#10B981', fontWeight: 600, marginTop: '4px' }}>
            {unresolvedMistakes > 0 ? 'Pending review' : 'All resolved!'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Continue Learning */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#0F172A' }}>Continue Learning</h3>
              <Link href="/portal/courses" style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>All Courses &rarr;</Link>
            </div>
            {activeCourse ? (
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#F0FFF4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={24} /></div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '4px' }}>{activeCourse.title}</h4>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{activeCourse.progressPercent ?? 0}% complete</div>
                    <div style={{ marginTop: '6px', height: '5px', backgroundColor: '#E2E8F0', borderRadius: '3px', width: '200px' }}>
                      <div style={{ height: '100%', width: `${activeCourse.progressPercent ?? 0}%`, backgroundColor: '#059669', borderRadius: '3px' }} />
                    </div>
                  </div>
                </div>
                <Link href={`/portal/courses/${activeCourse.id}/player`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Resume Lecture</Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '28px', color: '#94A3B8' }}>
                <BookOpen size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.875rem', margin: 0 }}>You have not enrolled in any courses yet.</p>
                <Link href="/portal/courses" className="btn-primary" style={{ marginTop: '12px', display: 'inline-flex', padding: '8px 20px', fontSize: '0.875rem' }}>Browse Courses</Link>
              </div>
            )}
          </div>

          {/* Recent Test Attempts */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#0F172A' }}>Recent Test Attempts</h3>
              <Link href="/portal/tests" style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>All Tests &rarr;</Link>
            </div>
            {testAttempts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
                <FileCheck2 size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.875rem', margin: 0 }}>No tests attempted yet.</p>
                <Link href="/portal/tests" className="btn-primary" style={{ marginTop: '12px', display: 'inline-flex', padding: '8px 20px', fontSize: '0.875rem' }}>Start a Test</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {testAttempts.slice(0, 4).map((attempt) => {
                  const acc = (attempt.totalAttempted || 0) > 0 ? Math.round(((attempt.totalCorrect || 0) / attempt.totalAttempted) * 100) : 0;
                  return (
                    <div key={attempt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>{attempt.testTitle || 'Practice Session'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{attempt.totalAttempted} questions</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: acc >= 70 ? '#059669' : acc >= 50 ? '#D97706' : '#DC2626' }}>{acc}%</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>accuracy</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '16px' }}>Performance Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '5px' }}>
                  <span style={{ color: '#64748B' }}>Questions Answered</span>
                  <strong style={{ color: '#0F172A' }}>{totalAttempted}</strong>
                </div>
                <div style={{ height: '7px', backgroundColor: '#E2E8F0', borderRadius: '4px' }}>
                  <div style={{ width: `${Math.min((totalAttempted / 500) * 100, 100)}%`, height: '100%', backgroundColor: '#059669', borderRadius: '4px' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '5px' }}>
                  <span style={{ color: '#64748B' }}>Correct Answers</span>
                  <strong style={{ color: '#059669' }}>{totalCorrect}</strong>
                </div>
                <div style={{ height: '7px', backgroundColor: '#E2E8F0', borderRadius: '4px' }}>
                  <div style={{ width: `${Math.min((totalCorrect / 500) * 100, 100)}%`, height: '100%', backgroundColor: '#10B981', borderRadius: '4px' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '5px' }}>
                  <span style={{ color: '#64748B' }}>Accuracy Rate</span>
                  <strong style={{ color: avgAccuracy >= 70 ? '#059669' : '#D97706' }}>{totalAttempted > 0 ? `${avgAccuracy}%` : '--'}</strong>
                </div>
                <div style={{ height: '7px', backgroundColor: '#E2E8F0', borderRadius: '4px' }}>
                  <div style={{ width: `${avgAccuracy}%`, height: '100%', backgroundColor: avgAccuracy >= 70 ? '#10B981' : '#F59E0B', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
            <Link href="/portal/progress/analysis" style={{ display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>Full Analysis Report &rarr;</Link>
          </div>

          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '12px' }}>Mistakes Notebook</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: unresolvedMistakes > 0 ? '#FEF2F2' : '#ECFDF5', color: unresolvedMistakes > 0 ? '#DC2626' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unresolvedMistakes > 0 ? <AlertTriangle size={22} /> : <TrendingUp size={22} />}
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>{unresolvedMistakes}</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>{unresolvedMistakes > 0 ? 'Questions need review' : 'All cleared!'}</div>
              </div>
            </div>
            <Link href="/portal/practice/mistakes" className="btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8125rem' }}>
              {unresolvedMistakes > 0 ? 'Review Mistakes Now' : 'View Mistakes Log'}
            </Link>
          </div>

          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '12px' }}>Quick Access</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(studentTier === 'elite'
                ? [
                    { href: '/portal/medpath', label: 'MedPath Elite Tracker' },
                    { href: '/portal/documents', label: 'Document Vault' },
                    { href: '/portal/learn/schedule', label: 'Live Class Schedule' },
                    { href: '/portal/tests', label: 'CBT Mock Exams' },
                    { href: '/portal/learn/lectures', label: 'Recorded Lectures' },
                  ]
                : studentTier === 'mastery'
                ? [
                    { href: '/portal/learn/schedule', label: 'Live Class Schedule' },
                    { href: '/portal/tests', label: 'CBT Mock Exams' },
                    { href: '/portal/practice', label: 'Practice Question Bank' },
                    { href: '/portal/learn/lectures', label: 'Recorded Lectures' },
                    { href: '/portal/learn/library', label: 'Study Library' },
                  ]
                : [
                    { href: '/portal/practice', label: 'Practice Question Bank' },
                    { href: '/portal/tests', label: 'CBT Mock Exams' },
                    { href: '/portal/learn/lectures', label: 'Recorded Lectures' },
                    { href: '/portal/learn/library', label: 'Study Library' },
                    { href: '/portal/practice/mistakes', label: 'My Mistakes' },
                  ]
              ).map((link) => (
                <Link key={link.href} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textDecoration: 'none', color: '#334155', fontWeight: 600, fontSize: '0.875rem' }}>
                  {link.label}
                  <ChevronRight size={14} color="#94A3B8" style={{ marginLeft: 'auto' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
