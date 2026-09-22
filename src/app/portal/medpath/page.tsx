'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore, MedpathEliteStudent, MedpathStageStatus } from '@/lib/store';
import { getPackageByIdOrName } from '@/lib/packages';
import {
  Lock, Star, CheckCircle2, Clock, ArrowRight, Sparkles,
  FileCheck, Building2, GraduationCap, Globe, Home, Loader2,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const STAGES: { key: keyof MedpathEliteStudent['stages']; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    key: 'pre_enrollment',
    label: 'Pre-Enrollment Documentation',
    description: 'Gather and verify all required academic and identity documents for pre-enrollment.',
    icon: <FileCheck size={22} />,
    color: '#2563EB',
  },
  {
    key: 'dov_submission',
    label: 'DOV Submission',
    description: 'Submit Dichiarazione di Valore (DOV) through the Italian Consulate.',
    icon: <Globe size={22} />,
    color: '#7C3AED',
  },
  {
    key: 'university_application',
    label: 'University Application',
    description: 'Complete and submit applications to target Italian medical universities.',
    icon: <Building2 size={22} />,
    color: '#0E7490',
  },
  {
    key: 'admission_decision',
    label: 'Admission Decision',
    description: 'Await and review the admission outcome from the university.',
    icon: <GraduationCap size={22} />,
    color: '#059669',
  },
  {
    key: 'visa_process',
    label: 'Student Visa Process',
    description: 'Prepare and submit the Italian student visa application at the consulate.',
    icon: <Star size={22} />,
    color: '#D97706',
  },
  {
    key: 'housing_arrival',
    label: 'Housing & Arrival Support',
    description: 'Secure accommodation and complete final pre-arrival checklist.',
    icon: <Home size={22} />,
    color: '#DC2626',
  },
];

const STATUS_STYLES: Record<MedpathStageStatus, { bg: string; color: string; border: string; label: string; icon: React.ReactNode }> = {
  pending: { bg: '#F8FAFC', color: '#64748B', border: '#CBD5E1', label: 'Pending', icon: <Clock size={16} /> },
  in_progress: { bg: '#EFF6FF', color: '#2563EB', border: '#93C5FD', label: 'In Progress', icon: <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> },
  completed: { bg: '#F0FFF4', color: '#16A34A', border: '#86EFAC', label: 'Completed', icon: <CheckCircle2 size={16} /> },
};

export default function MedpathPage() {
  const { currentUser, eliteStudents, addEliteStudent } = useAppStore();
  const [studentPackage, setStudentPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [eliteRecord, setEliteRecord] = useState<MedpathEliteStudent | null>(null);

  // Helper to extract candidate emails and match student record reliably
  const findMatchingRecord = (candidateEmails: string[]): MedpathEliteStudent | null => {
    const normCandidate = candidateEmails.map((e) => e.toLowerCase().trim()).filter(Boolean);
    const prefixes = normCandidate.map((e) => e.split('@')[0]);

    const isMatch = (s: MedpathEliteStudent): boolean => {
      if (!s) return false;
      const sEmail = (s.email || '').toLowerCase().trim();
      const sPrefix = sEmail.split('@')[0];
      const sId = s.studentId || s.id || '';

      if (currentUser.id && (sId === currentUser.id || sId === 'usr-student-01' || sId === 'demo-2')) return true;
      if (normCandidate.some((e) => e === sEmail)) return true;
      if (sPrefix && prefixes.some((p) => p === sPrefix)) return true;
      return false;
    };

    // 1. Try localStorage ahsora_elite_students
    try {
      const savedStr = localStorage.getItem('ahsora_elite_students');
      if (savedStr) {
        const list: MedpathEliteStudent[] = JSON.parse(savedStr);
        const match = list.find(isMatch);
        if (match) return match;
      }
    } catch (e) {}

    // 2. Try store eliteStudents
    const storeMatch = eliteStudents.find(isMatch);
    if (storeMatch) return storeMatch;

    return null;
  };

  useEffect(() => {
    const detectPackage = async () => {
      setLoading(true);
      let pkg: string | null = null;
      const candidateEmails: string[] = [currentUser.email || ''];
      let studentName: string = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();

      // 1. Try Supabase profile
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('selected_package, package_price, full_name, email')
            .eq('id', user.id)
            .maybeSingle();
          if (profile?.selected_package) pkg = profile.selected_package;
          if (profile?.email) candidateEmails.push(profile.email);
          if (profile?.full_name) studentName = profile.full_name;
        }
      } catch (e) {}

      // 2. Fallback to localStorage registration data
      try {
        const reg = localStorage.getItem('recentRegistration');
        if (reg) {
          const parsed = JSON.parse(reg);
          if (!pkg) pkg = parsed.selectedPackage || parsed.selected_package || null;
          if (parsed.email) candidateEmails.push(parsed.email);
          if (!studentName && parsed.fullName) studentName = parsed.fullName;
        }
      } catch (e) {}

      // 3. Fallback to store profile
      if (!pkg && currentUser.selectedPackage) {
        pkg = currentUser.selectedPackage;
      }

      setStudentPackage(pkg);

      const matchedRecord = findMatchingRecord(candidateEmails);

      if (matchedRecord) {
        setEliteRecord(matchedRecord);
      } else if (pkg && getPackageByIdOrName(pkg).id === 'elite') {
        const primaryEmail = candidateEmails.find(Boolean) || 'student@ahsora.com';
        const newRecord: Omit<MedpathEliteStudent, 'id'> = {
          studentId: currentUser.id || `stu-${Date.now()}`,
          studentName: studentName || 'Elite Student',
          email: primaryEmail,
          registeredAt: new Date().toISOString(),
          stages: {
            pre_enrollment: 'pending',
            dov_submission: 'pending',
            university_application: 'pending',
            admission_decision: 'pending',
            visa_process: 'pending',
            housing_arrival: 'pending',
          },
        };
        addEliteStudent(newRecord);
        setEliteRecord({ ...newRecord, id: 'elite-new' });
      }

      setLoading(false);
    };

    detectPackage();
  }, [currentUser, eliteStudents, addEliteStudent]);

  // Real-time sync listener for stage status updates
  useEffect(() => {
    const syncLatestRecord = () => {
      const candidateEmails: string[] = [currentUser.email || ''];
      try {
        const reg = localStorage.getItem('recentRegistration');
        if (reg) {
          const parsed = JSON.parse(reg);
          if (parsed.email) candidateEmails.push(parsed.email);
        }
      } catch (e) {}

      const matched = findMatchingRecord(candidateEmails);
      if (matched) {
        setEliteRecord(matched);
      }
    };

    syncLatestRecord();

    const handleUpdateEvent = () => syncLatestRecord();
    window.addEventListener('storage', handleUpdateEvent);
    window.addEventListener('ahsora_elite_updated', handleUpdateEvent);
    window.addEventListener('focus', handleUpdateEvent);

    return () => {
      window.removeEventListener('storage', handleUpdateEvent);
      window.removeEventListener('ahsora_elite_updated', handleUpdateEvent);
      window.removeEventListener('focus', handleUpdateEvent);
    };
  }, [currentUser, eliteStudents]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#2563EB' }} />
      </div>
    );
  }

  const isElite = studentPackage && getPackageByIdOrName(studentPackage).id === 'elite';

  if (!isElite) {
    return <LockedEliteScreen currentPackage={studentPackage} />;
  }

  const completedCount = eliteRecord
    ? Object.values(eliteRecord.stages).filter((s) => s === 'completed').length
    : 0;
  const totalStages = STAGES.length;
  const progressPercent = Math.round((completedCount / totalStages) * 100);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ backgroundColor: '#EA580C', color: '#FFFFFF', fontSize: '0.6875rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', letterSpacing: '0.5px' }}>
            MEDPATH ELITE
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Ahsora Path Elite Package</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          Your University Journey
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Track your complete university admission process — from pre-enrollment to arrival in Italy.
        </p>
      </div>

      {/* Progress Bar Card */}
      <div style={{ backgroundColor: '#0F172A', borderRadius: '20px', padding: '28px 32px', marginBottom: '28px', background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>Overall Progress</div>
            <div style={{ color: '#FFFFFF', fontSize: '2.2rem', fontWeight: 900 }}>{progressPercent}%</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>{completedCount} of {totalStages} stages complete</div>
            <div style={{ color: '#38BDF8', fontSize: '0.875rem', fontWeight: 700, marginTop: '2px' }}>
              {progressPercent === 100 ? '🎉 Journey Complete!' : progressPercent > 50 ? '⚡ Great progress!' : '🚀 Journey Started'}
            </div>
          </div>
        </div>
        <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #38BDF8, #818CF8)', borderRadius: '10px', transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Stages Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {STAGES.map((stage, idx) => {
          const stageStatus: MedpathStageStatus = eliteRecord?.stages[stage.key] || 'pending';
          const style = STATUS_STYLES[stageStatus];
          return (
            <div
              key={stage.key}
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${stageStatus === 'in_progress' ? stage.color + '60' : '#E2E8F0'}`,
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                boxShadow: stageStatus === 'in_progress' ? `0 4px 20px -4px ${stage.color}25` : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Step number & icon */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: stageStatus === 'completed' ? '#F0FFF4' : stageStatus === 'in_progress' ? stage.color + '15' : '#F8FAFC',
                  color: stageStatus === 'completed' ? '#16A34A' : stageStatus === 'in_progress' ? stage.color : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${stageStatus === 'completed' ? '#86EFAC' : stageStatus === 'in_progress' ? stage.color + '50' : '#E2E8F0'}`,
                }}>
                  {stageStatus === 'completed' ? <CheckCircle2 size={24} color="#16A34A" /> : stage.icon}
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 700 }}>STEP {idx + 1}</span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{stage.label}</h3>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: style.bg,
                    color: style.color,
                    border: `1px solid ${style.border}`,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '20px',
                  }}>
                    {style.icon}
                    {style.label}
                  </span>
                </div>
                <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>{stage.description}</p>
              </div>

              {/* Connector line for completed */}
              {stageStatus === 'completed' && (
                <CheckCircle2 size={28} color="#16A34A" style={{ flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: '28px', backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '14px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Sparkles size={20} color="#EA580C" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.875rem', color: '#92400E', margin: 0 }}>
          <strong>Your dedicated Medpath Elite advisor</strong> will update each stage as milestones are achieved. Contact Ahsora support on WhatsApp for any questions about your process.
        </p>
      </div>
    </div>
  );
}

function LockedEliteScreen({ currentPackage }: { currentPackage: string | null }) {
  const pkg = getPackageByIdOrName(currentPackage);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div style={{ textAlign: 'center', maxWidth: '560px', padding: '20px' }}>
        {/* Lock icon with glow */}
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #F97316, #EA580C)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 20px 40px -8px rgba(249, 115, 22, 0.4)',
        }}>
          <Lock size={44} color="#FFFFFF" />
        </div>

        <div style={{ display: 'inline-block', backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', color: '#C2410C', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.5px', marginBottom: '16px' }}>
          MEDPATH ELITE — EXCLUSIVE ACCESS
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', marginBottom: '12px', lineHeight: 1.2 }}>
          This section is reserved for<br />
          <span style={{ color: '#EA580C' }}>Ahsora Path Elite</span> students
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '28px' }}>
          Medpath Elite includes full university admission tracking, DOV guidance, personalized visa support, and guaranteed housing — everything managed by your dedicated senior advisor.
        </p>

        {/* Current Package Info */}
        {currentPackage && (
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '2px' }}>Your current package</div>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9375rem' }}>{pkg.name} — {pkg.price}</div>
          </div>
        )}

        {/* What you get */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', textAlign: 'left' }}>
          {[
            'Dedicated Senior Medical Student Mentor',
            'Full Italian University Pre-Enrollment & DOV Guidance',
            'Complete Student Visa Document Preparation',
            'Guaranteed Admission & Housing Support in Italy',
            'Real-time process tracking dashboard',
          ].map((feat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#334155' }}>
              <CheckCircle2 size={18} color="#EA580C" style={{ flexShrink: 0 }} />
              {feat}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/message/AHSORAELITE"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#EA580C',
              color: '#FFFFFF',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px -4px rgba(234, 88, 12, 0.4)',
            }}
          >
            <Sparkles size={18} />
            Upgrade to Path Elite — €799
            <ArrowRight size={18} />
          </a>
          <Link
            href="/portal/dashboard"
            style={{
              padding: '14px 22px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
