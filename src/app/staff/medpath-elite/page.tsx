'use client';

import React, { useState } from 'react';
import { useAppStore, MedpathEliteStudent, MedpathStageStatus } from '@/lib/store';
import {
  Star, Users, CheckCircle2, Clock, Loader2, X,
  FileCheck, Building2, GraduationCap, Globe, Home, ChevronRight, Search,
  ArrowRight, Edit3,
} from 'lucide-react';

const STAGES: {
  key: keyof MedpathEliteStudent['stages'];
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { key: 'pre_enrollment', label: 'Pre-Enrollment Documentation', description: 'Gather and verify all required academic and identity documents.', icon: <FileCheck size={20} />, color: '#2563EB' },
  { key: 'dov_submission', label: 'DOV Submission', description: 'Submit Dichiarazione di Valore through the Italian Consulate.', icon: <Globe size={20} />, color: '#7C3AED' },
  { key: 'university_application', label: 'University Application', description: 'Complete and submit applications to target Italian medical universities.', icon: <Building2 size={20} />, color: '#0E7490' },
  { key: 'admission_decision', label: 'Admission Decision', description: 'Await and review the admission outcome from the university.', icon: <GraduationCap size={20} />, color: '#059669' },
  { key: 'visa_process', label: 'Student Visa Process', description: 'Prepare and submit the Italian student visa application.', icon: <Star size={20} />, color: '#D97706' },
  { key: 'housing_arrival', label: 'Housing & Arrival Support', description: 'Secure accommodation and complete pre-arrival checklist.', icon: <Home size={20} />, color: '#DC2626' },
];

const STATUS_OPTS: { value: MedpathStageStatus; label: string; color: string; bg: string; border: string }[] = [
  { value: 'pending', label: 'Pending', color: '#64748B', bg: '#F8FAFC', border: '#CBD5E1' },
  { value: 'in_progress', label: 'In Progress', color: '#2563EB', bg: '#EFF6FF', border: '#93C5FD' },
  { value: 'completed', label: 'Completed', color: '#16A34A', bg: '#F0FFF4', border: '#86EFAC' },
];

function StatusBadge({ status }: { status: MedpathStageStatus }) {
  const opt = STATUS_OPTS.find((o) => o.value === status)!;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      backgroundColor: opt.bg,
      color: opt.color,
      border: `1px solid ${opt.border}`,
      fontSize: '0.75rem',
      fontWeight: 700,
      padding: '3px 10px',
      borderRadius: '20px',
    }}>
      {status === 'pending' && <Clock size={12} />}
      {status === 'in_progress' && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />}
      {status === 'completed' && <CheckCircle2 size={12} />}
      {opt.label}
    </span>
  );
}

export default function StaffMedpathElitePage() {
  const { eliteStudents, updateEliteStage, staffProfile } = useAppStore();
  const [allEliteList, setAllEliteList] = useState<MedpathEliteStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<MedpathEliteStudent | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const aggregateEliteStudents = async () => {
      setLoading(true);
      const combinedMap = new Map<string, MedpathEliteStudent>();

      // Helper to add/merge student
      const addOrMerge = (
        id: string,
        studentId: string,
        name: string,
        email: string,
        registeredAt?: string,
        stagesOverride?: MedpathEliteStudent['stages']
      ) => {
        if (!email) return;
        const key = email.toLowerCase();
        if (!combinedMap.has(key)) {
          combinedMap.set(key, {
            id: id || `elite-${Date.now()}`,
            studentId: studentId || id || `stu-${Date.now()}`,
            studentName: name || email.split('@')[0] || 'Elite Student',
            email: email,
            registeredAt: registeredAt || new Date().toISOString(),
            stages: stagesOverride || {
              pre_enrollment: 'pending',
              dov_submission: 'pending',
              university_application: 'pending',
              admission_decision: 'pending',
              visa_process: 'pending',
              housing_arrival: 'pending',
            },
          });
        }
      };

      // 1. Load from useAppStore() eliteStudents
      eliteStudents.forEach((s) => {
        addOrMerge(s.id, s.studentId, s.studentName, s.email, s.registeredAt, s.stages);
      });

      // 2. Load from localStorage ahsora_elite_students
      try {
        const savedEliteStr = localStorage.getItem('ahsora_elite_students');
        if (savedEliteStr) {
          const savedElite: MedpathEliteStudent[] = JSON.parse(savedEliteStr);
          savedElite.forEach((s) => addOrMerge(s.id, s.studentId, s.studentName, s.email, s.registeredAt, s.stages));
        }
      } catch (e) {}

      // 3. Load from localStorage adminStudentList for Path Elite packages
      try {
        const adminListStr = localStorage.getItem('adminStudentList');
        if (adminListStr) {
          const adminList: any[] = JSON.parse(adminListStr);
          adminList.forEach((item) => {
            const pkgName = item.selectedPackage || item.selected_package || '';
            const isElite = getPackageByIdOrName(pkgName).id === 'elite' || pkgName.toLowerCase().includes('path');
            if (isElite) {
              const name = item.fullName || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Elite Student';
              addOrMerge(item.id, item.id, name, item.email, item.createdAt || item.created_at);
            }
          });
        }
      } catch (e) {}

      // 4. Load from localStorage recentRegistration if Path Elite
      try {
        const recentStr = localStorage.getItem('recentRegistration');
        if (recentStr) {
          const recent = JSON.parse(recentStr);
          const pkgName = recent.selectedPackage || recent.selected_package || '';
          const isElite = getPackageByIdOrName(pkgName).id === 'elite' || pkgName.toLowerCase().includes('path');
          if (isElite) {
            const name = recent.fullName || `${recent.firstName || ''} ${recent.lastName || ''}`.trim() || 'Elite Student';
            addOrMerge(recent.id, recent.id, name, recent.email, recent.createdAt);
          }
        }
      } catch (e) {}

      // Convert Map to array
      let combined = Array.from(combinedMap.values());

      // Fallback demo student if none found
      if (combined.length === 0) {
        combined = [
          {
            id: 'demo-elite-1',
            studentId: 'demo-2',
            studentName: 'Arham Farooq',
            email: 'arham.farooq@example.com',
            registeredAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            stages: {
              pre_enrollment: 'completed',
              dov_submission: 'in_progress',
              university_application: 'pending',
              admission_decision: 'pending',
              visa_process: 'pending',
              housing_arrival: 'pending',
            },
          },
        ];
      }

      setAllEliteList(combined);
      setLoading(false);
    };

    aggregateEliteStudents();
  }, [eliteStudents]);

  const filtered = allEliteList.filter((s) => {
    const q = search.toLowerCase();
    return s.studentName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  const handleStageUpdate = (studentId: string, stage: keyof MedpathEliteStudent['stages'], status: MedpathStageStatus) => {
    setSaving(`${studentId}-${stage}`);
    updateEliteStage(studentId, stage, status);

    // Also update allEliteList local state and ahsora_elite_students in localStorage
    setAllEliteList((prev) => {
      const updated = prev.map((s) => (s.studentId === studentId || s.id === studentId ? { ...s, stages: { ...s.stages, [stage]: status } } : s));
      try {
        localStorage.setItem('ahsora_elite_students', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Update local selectedStudent state for immediate UI feedback
    setSelectedStudent((prev) => (prev ? { ...prev, stages: { ...prev.stages, [stage]: status } } : prev));

    setTimeout(() => {
      setSaving(null);
      setToast(`Stage updated: ${STAGES.find((s) => s.key === stage)?.label}`);
      setTimeout(() => setToast(null), 3000);
    }, 400);
  };

  const getProgress = (student: MedpathEliteStudent) => {
    const completed = Object.values(student.stages).filter((s) => s === 'completed').length;
    return { completed, total: STAGES.length, percent: Math.round((completed / STAGES.length) * 100) };
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 300,
          backgroundColor: '#0F172A', color: '#FFFFFF', padding: '12px 20px', borderRadius: '12px',
          fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}>
          <CheckCircle2 size={18} color="#4ADE80" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ backgroundColor: '#EA580C', color: '#FFFFFF', fontSize: '0.6875rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', letterSpacing: '0.5px' }}>
            STAFF PORTAL
          </span>
          <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>Medpath Elite Management</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          Medpath Elite Students
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Manage university admission journey stages for students enrolled in the Ahsora Path Elite package.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Elite Students', value: allEliteList.length, color: '#EA580C', bg: '#FFF7ED' },
          { label: 'In Progress', value: allEliteList.filter(s => Object.values(s.stages).some(v => v === 'in_progress')).length, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Fully Completed', value: allEliteList.filter(s => Object.values(s.stages).every(v => v === 'completed')).length, color: '#16A34A', bg: '#F0FFF4' },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: stat.bg, border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px 22px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px', fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '420px' }}>
        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '11px 16px 11px 42px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem', backgroundColor: '#FFF' }}
        />
      </div>

      {/* Student List */}
      {loading ? (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block', color: '#EA580C' }} />
          Loading MedPath Elite students...
        </div>
      ) : allEliteList.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
          <Users size={44} color="#CBD5E1" style={{ margin: '0 auto 16px', display: 'block' }} />
          <div style={{ color: '#64748B', fontWeight: 600, fontSize: '1rem', marginBottom: '6px' }}>No Elite students yet</div>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
            Students who register with the Ahsora Path Elite package will appear here when they log into the student portal.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((student) => {
            const { completed, total, percent } = getProgress(student);
            const isActive = Object.values(student.stages).some(v => v === 'in_progress');
            return (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${selectedStudent?.id === student.id ? '#EA580C' : '#E2E8F0'}`,
                  borderRadius: '16px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
              >
                {/* Avatar */}
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #EA580C, #F97316)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                  {student.studentName.charAt(0).toUpperCase()}
                </div>

                {/* Student Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem' }}>{student.studentName}</div>
                  <div style={{ color: '#64748B', fontSize: '0.8125rem', marginTop: '1px' }}>{student.email}</div>
                  {/* Mini progress bar */}
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '5px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden', maxWidth: '160px' }}>
                      <div style={{ height: '100%', width: `${percent}%`, background: percent === 100 ? '#16A34A' : 'linear-gradient(90deg, #EA580C, #F97316)', borderRadius: '10px', transition: 'width 0.3s ease' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{completed}/{total} stages</span>
                  </div>
                </div>

                {/* Status Tags */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {isActive && (
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #93C5FD', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>Active</span>
                  )}
                  {percent === 100 && (
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#F0FFF4', color: '#16A34A', border: '1px solid #86EFAC', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>✓ Complete</span>
                  )}
                </div>

                <ChevronRight size={18} color="#CBD5E1" style={{ flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-Over Detail Panel */}
      {selectedStudent && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setSelectedStudent(null)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 100 }}
          />

          {/* Panel */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#FFFFFF',
            zIndex: 110,
            overflowY: 'auto',
            boxShadow: '-10px 0 50px rgba(0,0,0,0.15)',
          }}>
            {/* Panel Header */}
            <div style={{ backgroundColor: '#0F172A', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #EA580C, #F97316)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0 }}>
                {selectedStudent.studentName.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.1rem' }}>{selectedStudent.studentName}</div>
                <div style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>{selectedStudent.email}</div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '6px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Progress Summary */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Overall Progress</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#EA580C' }}>
                  {getProgress(selectedStudent).percent}% ({getProgress(selectedStudent).completed}/{getProgress(selectedStudent).total})
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${getProgress(selectedStudent).percent}%`,
                  background: getProgress(selectedStudent).percent === 100 ? '#16A34A' : 'linear-gradient(90deg, #EA580C, #F97316)',
                  borderRadius: '8px',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>

            {/* Stage Editor */}
            <div style={{ padding: '20px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Edit3 size={16} color="#EA580C" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Edit Stage Status</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {STAGES.map((stage) => {
                  const currentStatus = selectedStudent.stages[stage.key];
                  const isSaving = saving === `${selectedStudent.studentId}-${stage.key}`;
                  return (
                    <div key={stage.key} style={{ border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px 18px', backgroundColor: '#FAFBFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ color: stage.color, flexShrink: 0 }}>{stage.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>{stage.label}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '1px' }}>{stage.description}</div>
                        </div>
                        {isSaving && <Loader2 size={16} color="#64748B" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
                      </div>

                      {/* Status buttons */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {STATUS_OPTS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleStageUpdate(selectedStudent.studentId, stage.key, opt.value)}
                            disabled={isSaving}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '8px',
                              border: `1.5px solid ${currentStatus === opt.value ? opt.color : '#E2E8F0'}`,
                              backgroundColor: currentStatus === opt.value ? opt.bg : '#FFFFFF',
                              color: currentStatus === opt.value ? opt.color : '#64748B',
                              fontWeight: currentStatus === opt.value ? 800 : 600,
                              fontSize: '0.8125rem',
                              cursor: isSaving ? 'not-allowed' : 'pointer',
                              transition: 'all 0.15s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            {opt.value === 'pending' && <Clock size={13} />}
                            {opt.value === 'in_progress' && <Loader2 size={13} />}
                            {opt.value === 'completed' && <CheckCircle2 size={13} />}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Registered date */}
            <div style={{ padding: '12px 28px 28px', color: '#94A3B8', fontSize: '0.8125rem' }}>
              Registered: {new Date(selectedStudent.registeredAt).toLocaleString()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
