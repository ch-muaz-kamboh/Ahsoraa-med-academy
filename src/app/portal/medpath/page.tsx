'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore, MedpathEliteStudent, MedpathStageStatus } from '@/lib/store';
import { getPackageByIdOrName, canAccessMedpath, resolveEffectivePackage, getStudentPackageMapping } from '@/lib/packages';
import {
  Lock, Star, CheckCircle2, Clock, ArrowRight, Sparkles,
  FileCheck, Building2, GraduationCap, Globe, Home, Loader2,
  ChevronRight, AlertCircle, MessageCircle,
} from 'lucide-react';
import Link from 'next/link';

interface MedpathPortalStage {
  key: string;
  number: number;
  label: string;
  description: string;
  notice?: string;
  icon: React.ReactNode;
  color: string;
}

const STAGES: MedpathPortalStage[] = [
  {
    key: 'documents_evaluation',
    number: 1,
    label: 'Required Documents and Profile Evaluation',
    description: 'Gather and verify all required academic diplomas, transcripts, apostilles, and eligibility documents.',
    icon: <FileCheck size={22} />,
    color: '#059669',
  },
  {
    key: 'university_application',
    number: 2,
    label: 'University Application',
    description: 'Complete and submit official applications to your target Italian medical faculties.',
    icon: <Building2 size={22} />,
    color: '#0E7490',
  },
  {
    key: 'pre_enrollment',
    number: 3,
    label: 'Pre-Enrollment',
    description: 'Universitaly pre-enrollment application submission and Italian consulate forwarding.',
    icon: <Globe size={22} />,
    color: '#4F46E5',
  },
  {
    key: 'cimea_dov',
    number: 4,
    label: 'CIMEA / DOV',
    description: 'Statement of Comparability and Declaration of Value (DOV) verification dossier.',
    notice: 'Student will have to provide us CIMEA/DOV',
    icon: <Globe size={22} />,
    color: '#7C3AED',
  },
  {
    key: 'regional_scholarship',
    number: 5,
    label: 'Regional Scholarship',
    description: 'Zero-tuition regional scholarship (DSU/EDISU) & living allowance grant application.',
    icon: <Sparkles size={22} />,
    color: '#D97706',
  },
  {
    key: 'imat_registration',
    number: 6,
    label: 'IMAT Registration',
    description: 'Universitaly official IMAT candidate seat registration and test venue booking.',
    icon: <Star size={22} />,
    color: '#2563EB',
  },
  {
    key: 'imat_result',
    number: 7,
    label: 'IMAT Result',
    description: 'Official test score ranking release and medical school seat allocation.',
    icon: <GraduationCap size={22} />,
    color: '#059669',
  },
  {
    key: 'visa_process',
    number: 8,
    label: 'Student Visa Process',
    description: 'Type-D Italian student visa dossier preparation, bank guarantee, and embassy interview.',
    icon: <Star size={22} />,
    color: '#EA580C',
  },
  {
    key: 'arrival_support',
    number: 9,
    label: 'Arrival Support / Guidance',
    description: 'Airport reception guidance, Italian tax code (Codice Fiscale), housing, and Permesso di Soggiorno.',
    icon: <Home size={22} />,
    color: '#DC2626',
  },
];

export default function MedpathPage() {
  const { currentUser, eliteStudents, addEliteStudent } = useAppStore();
  const [studentPackage, setStudentPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [eliteRecord, setEliteRecord] = useState<MedpathEliteStudent | null>(null);
  const [studentEnrollmentId, setStudentEnrollmentId] = useState<string>('');

  // Helper to extract candidate emails and match student record reliably
  const findMatchingRecord = (candidateEmails: string[]): MedpathEliteStudent | null => {
    const normCandidate = candidateEmails.map((e) => e.toLowerCase().trim()).filter(Boolean);
    const prefixes = normCandidate.map((e) => e.split('@')[0]);

    const isMatch = (s: MedpathEliteStudent): boolean => {
      if (!s) return false;
      const sEmail = (s.email || '').toLowerCase().trim();
      const sPrefix = sEmail.split('@')[0];
      const sId = s.studentId || s.id || '';

      // Match by exact email first
      if (normCandidate.some((e) => e && e === sEmail)) return true;
      // Match by prefix if non-empty
      if (sPrefix && prefixes.some((p) => p && p === sPrefix)) return true;
      // Match by exact user ID if real user authenticated
      if (currentUser.id && currentUser.id !== 'usr-student-01' && sId === currentUser.id) return true;
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
      let detectedAmaId = currentUser.ama_id || '';

      // 1. Try Supabase user metadata and profile
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.user_metadata?.selected_package || user.user_metadata?.selectedPackage) {
            pkg = user.user_metadata.selected_package || user.user_metadata.selectedPackage;
          }
          if (user.user_metadata?.full_name) {
            studentName = user.user_metadata.full_name;
          }
          if (user.user_metadata?.ama_id) {
            detectedAmaId = user.user_metadata.ama_id;
          }
          if (user.email) candidateEmails.push(user.email);

          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, ama_id')
            .eq('id', user.id)
            .maybeSingle();
          if (profile?.email) candidateEmails.push(profile.email);
          if (profile?.full_name && !studentName) studentName = profile.full_name;
          if (profile?.ama_id) detectedAmaId = profile.ama_id;
        }
      } catch (e) {}

      // 2. Persistent package mapping by email
      if (!pkg && currentUser.email) {
        const mapped = getStudentPackageMapping(currentUser.email);
        if (mapped?.selectedPackage) {
          pkg = mapped.selectedPackage;
        }
      }

      // 3. Fallback to localStorage registration data
      try {
        const reg = localStorage.getItem('recentRegistration');
        if (reg) {
          const parsed = JSON.parse(reg);
          if (!pkg) pkg = parsed.selectedPackage || parsed.selected_package || null;
          if (parsed.email) candidateEmails.push(parsed.email);
          if (!studentName && parsed.fullName) studentName = parsed.fullName;
          if (parsed.ama_id && !detectedAmaId) detectedAmaId = parsed.ama_id;
        }
      } catch (e) {}

      // 4. Fallback to store profile or client storage
      if (!pkg) {
        pkg = resolveEffectivePackage(currentUser);
      }

      setStudentPackage(pkg);

      const primaryEmail = candidateEmails.find(Boolean) || currentUser.email || '';
      if (primaryEmail.toLowerCase().trim() === 'ahsank746@gmail.com') {
        detectedAmaId = 'AMA-27-0003';
      }
      if (detectedAmaId) {
        setStudentEnrollmentId(detectedAmaId);
      }

      let matchedRecord = findMatchingRecord(candidateEmails);

      // 5. Cloud Sync: fetch latest stages directly from /api/medpath/stages
      try {
        if (primaryEmail) {
          const cloudRes = await fetch(`/api/medpath/stages?email=${encodeURIComponent(primaryEmail)}`);
          if (cloudRes.ok) {
            const cloudJson = await cloudRes.json();
            if (cloudJson.success && cloudJson.stages && Object.keys(cloudJson.stages).length > 0) {
              if (matchedRecord) {
                matchedRecord = {
                  ...matchedRecord,
                  stages: { ...matchedRecord.stages, ...cloudJson.stages },
                  enrollmentNumber: detectedAmaId || cloudJson.student?.ama_id || matchedRecord.enrollmentNumber,
                };
              }
              if (cloudJson.student?.ama_id && !detectedAmaId) {
                setStudentEnrollmentId(cloudJson.student.ama_id);
              }
            }
          }
        }
      } catch (cloudErr) {
        console.warn('Medpath cloud stages fetch note:', cloudErr);
      }

      if (matchedRecord) {
        if (detectedAmaId && (!matchedRecord.enrollmentNumber || matchedRecord.enrollmentNumber.startsWith('AMA-2026-'))) {
          matchedRecord.enrollmentNumber = detectedAmaId;
        }
        setEliteRecord(matchedRecord);
      } else if (pkg && getPackageByIdOrName(pkg).id === 'elite') {
        const newRecord: Omit<MedpathEliteStudent, 'id'> = {
          studentId: currentUser.id || `stu-${Date.now()}`,
          studentName: studentName || 'Elite Student',
          email: primaryEmail || 'student@ahsora.com',
          enrollmentNumber: detectedAmaId || 'AMA-27-0003',
          registeredAt: new Date().toISOString(),
          stages: {
            documents_evaluation: { status: 'pending', actionDate: '', comments: '' },
            university_application: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
            pre_enrollment: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
            cimea_dov: { status: 'pending', actionDate: '', comments: '' },
            regional_scholarship: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
            imat_registration: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
            imat_result: { status: 'pending', actionDate: '', comments: '' },
            visa_process: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
            arrival_support: { status: 'pending', actionDate: '', comments: '' },
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
    const syncLatestRecord = async () => {
      const candidateEmails: string[] = [currentUser.email || ''];
      try {
        const reg = localStorage.getItem('recentRegistration');
        if (reg) {
          const parsed = JSON.parse(reg);
          if (parsed.email) candidateEmails.push(parsed.email);
        }
      } catch (e) {}

      let matched = findMatchingRecord(candidateEmails);

      // Also check cloud stages
      const primaryEmail = candidateEmails.find(Boolean);
      if (primaryEmail) {
        try {
          const cloudRes = await fetch(`/api/medpath/stages?email=${encodeURIComponent(primaryEmail)}`);
          if (cloudRes.ok) {
            const cloudJson = await cloudRes.json();
            if (cloudJson.success && cloudJson.stages && Object.keys(cloudJson.stages).length > 0) {
              if (matched) {
                matched = {
                  ...matched,
                  stages: { ...matched.stages, ...cloudJson.stages },
                };
              } else if (eliteRecord) {
                setEliteRecord((prev) => (prev ? { ...prev, stages: { ...prev.stages, ...cloudJson.stages } } : null));
              }
            }
          }
        } catch {}
      }

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
  }, [currentUser, eliteStudents, eliteRecord]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#059669' }} />
      </div>
    );
  }

  const isElite = canAccessMedpath(studentPackage);

  if (!isElite) {
    return <LockedEliteScreen currentPackage={studentPackage} />;
  }

  const completedCount = eliteRecord
    ? STAGES.filter((st) => {
        const val = eliteRecord.stages?.[st.key];
        const status = typeof val === 'object' ? val?.status : val;
        const decision = typeof val === 'object' ? val?.decision : undefined;
        return (
          status === 'completed' ||
          status === 'approved' ||
          status === 'received' ||
          status === 'secured_medical_seat' ||
          decision === 'accepted' ||
          decision === 'approved' ||
          decision === 'forwarded_to_embassy'
        );
      }).length
    : 0;
  const totalStages = STAGES.length;
  const progressPercent = Math.round((completedCount / totalStages) * 100);

  const getStatusDisplay = (status: string, decision?: string) => {
    if (status === 'secured_medical_seat') {
      return { bg: '#F0FDF4', color: '#16A34A', border: '#86EFAC', label: '🎉 Seat Secured!' };
    }
    if (decision === 'accepted' || status === 'approved' || status === 'completed' || status === 'received') {
      return { bg: '#F0FFF4', color: '#16A34A', border: '#86EFAC', label: decision === 'accepted' ? 'Accepted' : status === 'received' ? 'Received' : 'Completed' };
    }
    if (decision === 'forwarded_to_embassy') {
      return { bg: '#EEF2FF', color: '#4F46E5', border: '#C7D2FE', label: 'Forwarded to Embassy' };
    }
    if (status === 'applied') {
      return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE', label: 'Applied' };
    }
    if (status === 'file_being_prepared' || status === 'in_progress' || status === 'reviewed') {
      return { bg: '#F0F9FF', color: '#0284C7', border: '#BAE6FD', label: status === 'file_being_prepared' ? 'File Being Prepared' : status === 'reviewed' ? 'Reviewed' : 'In Progress' };
    }
    if (status === 'missing_documents') {
      return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', label: 'Missing Documents' };
    }
    if (status === 'rejected' || decision === 'rejected') {
      return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', label: 'Rejected' };
    }
    return { bg: '#F8FAFC', color: '#64748B', border: '#CBD5E1', label: 'Pending' };
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ backgroundColor: '#EA580C', color: '#FFFFFF', fontSize: '0.6875rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', letterSpacing: '0.5px' }}>
            MEDPATH ELITE
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Ahsora MedPath Elite Package</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          Your University Admission Milestones
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '14px' }}>
          Real-time tracking of all 9 stages in your Italian medical school admission dossier.
        </p>

        {/* Student Enrollment ID & Candidate Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              backgroundColor: '#ECFDF5',
              border: '1.5px solid #A7F3D0',
              color: '#047857',
              fontSize: '0.8125rem',
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🎓 Student Enrollment ID:{' '}
            <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#065F46' }}>
              {studentEnrollmentId || eliteRecord?.enrollmentNumber || 'AMA-27-0003'}
            </strong>
          </span>

          <span
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#475569',
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '12px',
            }}
          >
            Candidate: <strong>{eliteRecord?.studentName || currentUser.firstName || 'Enrolled Student'}</strong>
          </span>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div style={{ backgroundColor: '#0F172A', borderRadius: '20px', padding: '28px 32px', marginBottom: '28px', background: 'linear-gradient(135deg, #0F172A 0%, #14532D 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>Overall Progress</div>
            <div style={{ color: '#FFFFFF', fontSize: '2.2rem', fontWeight: 900 }}>{progressPercent}%</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>{completedCount} of {totalStages} stages completed</div>
            <div style={{ color: '#5CED73', fontSize: '0.875rem', fontWeight: 700, marginTop: '2px' }}>
              {progressPercent === 100 ? '🎉 Journey Complete!' : progressPercent > 50 ? '⚡ Great progress!' : '🚀 Journey Started'}
            </div>
          </div>
        </div>
        <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #5CED73, #818CF8)', borderRadius: '10px', transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Stages Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {STAGES.map((stage, idx) => {
          const rawStage = eliteRecord?.stages?.[stage.key];
          const stageStatus = typeof rawStage === 'object' ? (rawStage?.status || 'pending') : (rawStage || 'pending');
          const stageDecision = typeof rawStage === 'object' ? rawStage?.decision : undefined;
          const stageComments = typeof rawStage === 'object' ? rawStage?.comments : undefined;
          const stageDate = typeof rawStage === 'object' ? (rawStage?.actionDate || rawStage?.appliedDate) : undefined;
          const stageReviewer = typeof rawStage === 'object' ? (rawStage?.reviewerName || rawStage?.responsiblePerson) : undefined;

          const isCompleted =
            stageStatus === 'completed' ||
            stageStatus === 'approved' ||
            stageStatus === 'received' ||
            stageStatus === 'secured_medical_seat' ||
            stageDecision === 'accepted' ||
            stageDecision === 'forwarded_to_embassy';

          const badge = getStatusDisplay(stageStatus, stageDecision);

          return (
            <div
              key={stage.key}
              style={{
                backgroundColor: '#FFFFFF',
                border: `1.5px solid ${isCompleted ? '#86EFAC' : '#E2E8F0'}`,
                borderRadius: '18px',
                padding: '22px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: isCompleted ? '0 4px 14px rgba(22, 163, 74, 0.06)' : '0 2px 6px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: isCompleted ? '#F0FDF4' : stage.color + '15',
                    color: isCompleted ? '#16A34A' : stage.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1.5px solid ${isCompleted ? '#86EFAC' : stage.color + '40'}`,
                    flexShrink: 0,
                  }}>
                    {isCompleted ? <CheckCircle2 size={24} color="#16A34A" /> : stage.icon}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800 }}>STEP {idx + 1}</span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{stage.label}</h3>
                    </div>
                    <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '3px 0 0' }}>{stage.description}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`,
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '20px',
                  }}>
                    {isCompleted && '✓ '}
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Notice for CIMEA / DOV */}
              {stage.notice && (
                <div style={{
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  color: '#92400E',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <AlertCircle size={15} color="#B45309" />
                  <span>Notice: {stage.notice}</span>
                </div>
              )}

              {/* Reviewer / Advisor Comments Card */}
              {(stageComments || stageDate || stageReviewer) && (
                <div style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '0.85rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: stageComments ? '6px' : 0, flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageCircle size={14} color="#EA580C" />
                      Advisor Notes {stageReviewer ? `(${stageReviewer})` : ''}
                    </span>
                    {stageDate && (
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Date: {stageDate}
                      </span>
                    )}
                  </div>
                  {stageComments && (
                    <p style={{ color: '#475569', margin: 0, lineHeight: 1.5 }}>
                      {stageComments}
                    </p>
                  )}
                </div>
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
          <span style={{ color: '#EA580C' }}>Ahsora MedPath Elite</span> students
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
            href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20would%20like%20to%20upgrade%20to%20Ahsora%20MedPath%20Elite"
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
            Upgrade to MedPath Elite — €799
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
