'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, MedpathEliteStudent, MedpathStageDetail } from '@/lib/store';
import { getPackageByIdOrName } from '@/lib/packages';
import { StudentDocument } from '@/types';
import {
  Star, Users, CheckCircle2, Clock, Loader2, X,
  FileCheck, Building2, GraduationCap, Globe, Home, ChevronRight, Search,
  ArrowRight, Edit3, MessageSquare, Calendar, UserCheck, AlertTriangle,
  Download, Eye, Phone, Mail, Award, FileText, CheckCircle, ShieldCheck,
  ChevronLeft, ExternalLink, Send, Plus, FolderLock
} from 'lucide-react';

interface StageConfig {
  key: string;
  number: number;
  label: string;
  subtitle: string;
  notice?: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  type: 'evaluation' | 'application' | 'pre_enrollment' | 'cimea' | 'scholarship' | 'imat_reg' | 'imat_res' | 'visa' | 'arrival';
}

const STAGES_CONFIG: StageConfig[] = [
  {
    key: 'documents_evaluation',
    number: 1,
    label: 'Required Documents and Profile Evaluation',
    subtitle: 'Evaluate academic transcripts, apostilles, passport, and eligibility.',
    icon: <FileCheck size={20} />,
    color: '#059669',
    bg: '#ECFDF5',
    type: 'evaluation',
  },
  {
    key: 'university_application',
    number: 2,
    label: 'University Application',
    subtitle: 'Submit official university applications to target Italian medical faculties.',
    icon: <Building2 size={20} />,
    color: '#0E7490',
    bg: '#ECFEFF',
    type: 'application',
  },
  {
    key: 'pre_enrollment',
    number: 3,
    label: 'Pre-Enrollment',
    subtitle: 'Universitaly pre-enrollment portal submission and embassy forwarding.',
    icon: <Globe size={20} />,
    color: '#4F46E5',
    bg: '#EEF2FF',
    type: 'pre_enrollment',
  },
  {
    key: 'cimea_dov',
    number: 4,
    label: 'CIMEA / DOV',
    subtitle: 'Verification of academic comparability & Declaration of Value.',
    notice: 'Student will have to provide us CIMEA/DOV',
    icon: <ShieldCheck size={20} />,
    color: '#7C3AED',
    bg: '#F5F3FF',
    type: 'cimea',
  },
  {
    key: 'regional_scholarship',
    number: 5,
    label: 'Regional Scholarship',
    subtitle: 'DSU / EDISU / ALISEO regional scholarship dossier and financial ISEE submission.',
    icon: <Award size={20} />,
    color: '#D97706',
    bg: '#FFFBEB',
    type: 'scholarship',
  },
  {
    key: 'imat_registration',
    number: 6,
    label: 'IMAT Registration',
    subtitle: 'Official Universitaly test seat registration and test centre allocation.',
    icon: <Edit3 size={20} />,
    color: '#2563EB',
    bg: '#EFF6FF',
    type: 'imat_reg',
  },
  {
    key: 'imat_result',
    number: 7,
    label: 'IMAT Result',
    subtitle: 'Official score verification and medical ranking seat allocation.',
    icon: <GraduationCap size={20} />,
    color: '#059669',
    bg: '#F0FDF4',
    type: 'imat_res',
  },
  {
    key: 'visa_process',
    number: 8,
    label: 'Student Visa Process',
    subtitle: 'Preparation of visa file, financial proof, consulate appointment, and issuance.',
    icon: <Star size={20} />,
    color: '#EA580C',
    bg: '#FFF7ED',
    type: 'visa',
  },
  {
    key: 'arrival_support',
    number: 9,
    label: 'Arrival Support / Guidance',
    subtitle: 'Airport reception guidance, Italian tax code (Codice Fiscale), and residence permit (Permesso).',
    icon: <Home size={20} />,
    color: '#DC2626',
    bg: '#FEF2F2',
    type: 'arrival',
  },
];

export default function StaffMedpathElitePage() {
  const { eliteStudents, updateEliteStage, staffProfile, documents, updateDocStatus } = useAppStore();
  const [allStudents, setAllStudents] = useState<MedpathEliteStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'elite'>('all');
  const [selectedStudent, setSelectedStudent] = useState<MedpathEliteStudent | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<StudentDocument | null>(null);

  // Helper to sync and aggregate all enrolled active students
  const loadAggregatedStudents = async () => {
    setLoading(true);
    const map = new Map<string, MedpathEliteStudent>();

    // Helper to add or merge student
    const addOrMerge = (
      id: string,
      studentId: string,
      name: string,
      email: string,
      phone?: string,
      enrollmentNumber?: string,
      country?: string,
      registeredAt?: string,
      stagesOverride?: Record<string, any>
    ) => {
      if (!email) return;
      const cleanEmail = email.toLowerCase().trim();
      const existing = map.get(cleanEmail);

      const defaultStages: Record<string, any> = {
        documents_evaluation: { status: 'pending', actionDate: '', reviewerName: '', comments: '' },
        university_application: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
        pre_enrollment: { status: 'pending', appliedDate: '', decision: 'pending', responsiblePerson: '', comments: '' },
        cimea_dov: { status: 'pending', actionDate: '', comments: '' },
        regional_scholarship: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
        imat_registration: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
        imat_result: { status: 'pending', actionDate: '', comments: '' },
        visa_process: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
        arrival_support: { status: 'pending', actionDate: '', comments: '' },
      };

      if (!existing) {
        map.set(cleanEmail, {
          id: id || `elite-${Date.now()}`,
          studentId: studentId || id || `stu-${Date.now()}`,
          studentName: name || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: phone || '',
          enrollmentNumber: enrollmentNumber || `AMA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          country: country || 'International',
          registeredAt: registeredAt || new Date().toISOString(),
          stages: stagesOverride ? { ...defaultStages, ...stagesOverride } : defaultStages,
        });
      } else {
        if (name && existing.studentName === cleanEmail.split('@')[0]) existing.studentName = name;
        if (phone && !existing.phone) existing.phone = phone;
        if (enrollmentNumber && !existing.enrollmentNumber) existing.enrollmentNumber = enrollmentNumber;
        if (country && !existing.country) existing.country = country;
        if (stagesOverride) {
          existing.stages = { ...existing.stages, ...stagesOverride };
        }
      }
    };

    // 1. Load from ahsora_elite_students in localStorage
    try {
      const savedStr = localStorage.getItem('ahsora_elite_students');
      if (savedStr) {
        const list: MedpathEliteStudent[] = JSON.parse(savedStr);
        list.forEach((s) => {
          addOrMerge(
            s.id,
            s.studentId,
            s.studentName,
            s.email,
            s.phone,
            s.enrollmentNumber,
            s.country,
            s.registeredAt,
            s.stages
          );
        });
      }
    } catch (e) {}

    // 2. Load from useAppStore eliteStudents
    eliteStudents.forEach((s) => {
      addOrMerge(
        s.id,
        s.studentId,
        s.studentName,
        s.email,
        s.phone,
        s.enrollmentNumber,
        s.country,
        s.registeredAt,
        s.stages
      );
    });

    // 3. Load from adminStudentList in localStorage (contains all actively enrolled students with access)
    try {
      const adminListStr = localStorage.getItem('adminStudentList');
      if (adminListStr) {
        const adminList: any[] = JSON.parse(adminListStr);
        adminList.forEach((item) => {
          const isAccessGranted =
            item.paymentApproved === true ||
            item.payment_approved === true ||
            item.status === 'active' ||
            item.accessGranted === true;

          const pkg = item.selectedPackage || item.selected_package || '';
          const isElitePkg = getPackageByIdOrName(pkg).id === 'elite' || pkg.toLowerCase().includes('path');

          // Include if payment approved / active or explicitly elite
          if (isAccessGranted || isElitePkg || item.email) {
            const name = item.fullName || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Enrolled Student';
            addOrMerge(
              item.id,
              item.id,
              name,
              item.email,
              item.whatsappNumber || item.phone || '',
              item.ama_id || `AMA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              item.country || 'International',
              item.createdAt || item.created_at,
              item.stages
            );
          }
        });
      }
    } catch (e) {}

    // 4. Load from recentRegistration
    try {
      const recentStr = localStorage.getItem('recentRegistration');
      if (recentStr) {
        const recent = JSON.parse(recentStr);
        const name = recent.fullName || `${recent.firstName || ''} ${recent.lastName || ''}`.trim() || 'Enrolled Student';
        addOrMerge(
          recent.id,
          recent.id,
          name,
          recent.email,
          recent.whatsappNumber || recent.phone || '',
          recent.ama_id || `AMA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          recent.country || 'International',
          recent.createdAt,
          recent.stages
        );
      }
    } catch (e) {}

    // 5. Load from ahsora_currentUser
    try {
      const curStr = localStorage.getItem('ahsora_currentUser');
      if (curStr) {
        const cur = JSON.parse(curStr);
        if (cur.email) {
          const name = `${cur.firstName || ''} ${cur.lastName || ''}`.trim() || 'Active Student';
          addOrMerge(
            cur.id,
            cur.id,
            name,
            cur.email,
            cur.phone,
            cur.ama_id || 'AMA-2026-0482',
            cur.country,
            cur.createdAt,
            cur.stages
          );
        }
      }
    } catch (e) {}

    let combined = Array.from(map.values());

    // Fallback seed students for demo continuity if empty
    if (combined.length === 0) {
      combined = [
        {
          id: 'elite-seed-1',
          studentId: 'stu-seed-1',
          studentName: 'Zainab Fatima',
          email: 'zainab.fatima@student.ahsora.com',
          phone: '+92 300 1234567',
          enrollmentNumber: 'AMA-2026-1049',
          country: 'Pakistan',
          registeredAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          stages: {
            documents_evaluation: { status: 'approved', actionDate: '2026-03-10', reviewerName: 'Dr. Farhan Ahmed', comments: 'All A-Level transcripts, FSc equivalency and passport verified.' },
            university_application: { status: 'applied', appliedDate: '2026-03-15', decision: 'accepted', comments: 'Application accepted by University of Milan (La Statale).' },
            pre_enrollment: { status: 'applied', appliedDate: '2026-03-20', decision: 'forwarded_to_embassy', responsiblePerson: 'Adv Ahmad Jahangir', comments: 'Universitaly pre-enrollment summary forwarded to Embassy Islamabad.' },
            cimea_dov: { status: 'completed', actionDate: '2026-04-02', comments: 'CIMEA Statement of Comparability received and archived.' },
            regional_scholarship: { status: 'applied', appliedDate: '2026-04-10', decision: 'pending', comments: 'DSU scholarship financial documents submitted.' },
            imat_registration: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
            imat_result: { status: 'pending', actionDate: '', comments: '' },
            visa_process: { status: 'file_being_prepared', appliedDate: '', decision: 'pending', comments: 'Bank statement and accommodation certificate being verified.' },
            arrival_support: { status: 'pending', actionDate: '', comments: '' },
          },
        },
        {
          id: 'elite-seed-2',
          studentId: 'stu-seed-2',
          studentName: 'Hamza Tariq',
          email: 'hamza.tariq@student.ahsora.com',
          phone: '+971 50 9876543',
          enrollmentNumber: 'AMA-2026-2180',
          country: 'United Arab Emirates',
          registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          stages: {
            documents_evaluation: { status: 'missing_documents', actionDate: '2026-04-12', reviewerName: 'Staff Reviewer', comments: 'Official High School apostille and English language proof missing.' },
            university_application: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
            pre_enrollment: { status: 'pending', appliedDate: '', decision: 'pending', responsiblePerson: '', comments: '' },
            cimea_dov: { status: 'pending', actionDate: '', comments: '' },
            regional_scholarship: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
            imat_registration: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
            imat_result: { status: 'pending', actionDate: '', comments: '' },
            visa_process: { status: 'pending', appliedDate: '', decision: 'pending', comments: '' },
            arrival_support: { status: 'pending', actionDate: '', comments: '' },
          },
        },
      ];
    }

    setAllStudents(combined);
    setLoading(false);
  };

  useEffect(() => {
    loadAggregatedStudents();

    const handleStorageUpdate = () => {
      loadAggregatedStudents();
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('ahsora_elite_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('ahsora_elite_updated', handleStorageUpdate);
    };
  }, [eliteStudents]);

  // Keep selectedStudent synced with allStudents
  useEffect(() => {
    if (selectedStudent) {
      const match = allStudents.find(
        (s) => s.id === selectedStudent.id || s.email.toLowerCase() === selectedStudent.email.toLowerCase()
      );
      if (match) setSelectedStudent(match);
    }
  }, [allStudents]);

  // Filter students
  const filteredStudents = allStudents.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.studentName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.enrollmentNumber && s.enrollmentNumber.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q));

    return matchesSearch;
  });

  // Calculate progress for a student
  const getStudentProgress = (student: MedpathEliteStudent) => {
    const stages = student.stages || {};
    let completedCount = 0;

    STAGES_CONFIG.forEach((cfg) => {
      const st = stages[cfg.key];
      const statusVal = typeof st === 'object' ? st?.status : st;
      const decisionVal = typeof st === 'object' ? st?.decision : undefined;

      if (
        statusVal === 'approved' ||
        statusVal === 'completed' ||
        statusVal === 'received' ||
        decisionVal === 'accepted' ||
        decisionVal === 'forwarded_to_embassy' ||
        decisionVal === 'approved' ||
        statusVal === 'secured_medical_seat'
      ) {
        completedCount++;
      }
    });

    const percent = Math.round((completedCount / STAGES_CONFIG.length) * 100);
    return { completed: completedCount, total: STAGES_CONFIG.length, percent };
  };

  // Stage update handler
  const handleStageFieldChange = (
    stageKey: string,
    field: keyof MedpathStageDetail | 'decision',
    value: string
  ) => {
    if (!selectedStudent) return;
    setSavingKey(`${selectedStudent.id}-${stageKey}`);

    const existingStageVal = selectedStudent.stages?.[stageKey];
    const prevObj: any = typeof existingStageVal === 'object' && existingStageVal !== null
      ? existingStageVal
      : { status: existingStageVal || 'pending' };

    const updatedStageObj = {
      ...prevObj,
      [field]: value,
      updatedAt: new Date().toISOString(),
    };

    // Auto fill reviewer or responsible person if empty and updating
    if (field === 'status' && !updatedStageObj.reviewerName) {
      updatedStageObj.reviewerName = staffProfile.displayName || 'Staff Advisor';
    }
    if (field === 'status' && !updatedStageObj.actionDate) {
      updatedStageObj.actionDate = new Date().toISOString().split('T')[0];
    }

    // Call store update
    updateEliteStage(selectedStudent.email || selectedStudent.studentId, stageKey, updatedStageObj);

    // Update local state for immediate reactivity
    setSelectedStudent((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        stages: {
          ...prev.stages,
          [stageKey]: updatedStageObj,
        },
      };
    });

    setAllStudents((prev) =>
      prev.map((s) => {
        if (s.id === selectedStudent.id || s.email.toLowerCase() === selectedStudent.email.toLowerCase()) {
          return {
            ...s,
            stages: {
              ...s.stages,
              [stageKey]: updatedStageObj,
            },
          };
        }
        return s;
      })
    );

    // Save to localStorage ahsora_elite_students
    try {
      const savedStr = localStorage.getItem('ahsora_elite_students');
      let currentArr: MedpathEliteStudent[] = savedStr ? JSON.parse(savedStr) : [];
      const idx = currentArr.findIndex(
        (c) => c.email.toLowerCase() === selectedStudent.email.toLowerCase() || c.id === selectedStudent.id
      );
      if (idx !== -1) {
        currentArr[idx] = {
          ...currentArr[idx],
          stages: { ...currentArr[idx].stages, [stageKey]: updatedStageObj },
        };
      } else {
        currentArr.push({
          ...selectedStudent,
          stages: { ...selectedStudent.stages, [stageKey]: updatedStageObj },
        });
      }
      localStorage.setItem('ahsora_elite_students', JSON.stringify(currentArr));
      window.dispatchEvent(new Event('ahsora_elite_updated'));
    } catch (e) {}

    setTimeout(() => {
      setSavingKey(null);
      setToast('Stage details updated successfully');
      setTimeout(() => setToast(null), 2500);
    }, 300);
  };

  // Filter student uploaded documents
  const studentDocs = documents.filter((d) => {
    if (!selectedStudent) return false;
    const sEmail = (selectedStudent.email || '').toLowerCase().trim();
    const dEmail = (d.studentEmail || '').toLowerCase().trim();
    if (dEmail && dEmail === sEmail) return true;
    if (d.studentId && (d.studentId === selectedStudent.id || d.studentId === selectedStudent.studentId)) return true;
    return false;
  });

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 400,
          backgroundColor: '#0F172A', color: '#FFFFFF', padding: '12px 20px', borderRadius: '12px',
          fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}>
          <CheckCircle2 size={18} color="#4ADE80" />
          {toast}
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)', zIndex: 1200, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '24px',
          }}
          onClick={() => setPreviewDoc(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '750px', width: '100%',
              maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{previewDoc.title}</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{previewDoc.fileName} • {previewDoc.category}</span>
              </div>
              <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748B' }}>✕</button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', textAlign: 'center', flex: 1, backgroundColor: '#F8FAFC' }}>
              {previewDoc.fileDataUrl?.startsWith('data:image/') ? (
                <img src={previewDoc.fileDataUrl} alt={previewDoc.title} style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain', borderRadius: '8px' }} />
              ) : previewDoc.fileDataUrl?.startsWith('data:application/pdf') ? (
                <iframe src={previewDoc.fileDataUrl} style={{ width: '100%', height: '55vh', border: 'none', borderRadius: '8px' }} />
              ) : (
                <div style={{ padding: '40px 20px', color: '#64748B' }}>
                  <FileText size={48} color="#EA580C" style={{ margin: '0 auto 16px', display: 'block' }} />
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: '#0F172A', marginBottom: '6px' }}>{previewDoc.fileName}</p>
                  <p style={{ fontSize: '0.85rem' }}>Encrypted student document stored in Ahsora Vault.</p>
                </div>
              )}
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  if (previewDoc.fileDataUrl) {
                    const a = document.createElement('a');
                    a.href = previewDoc.fileDataUrl;
                    a.download = previewDoc.fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }
                }}
                className="btn-primary"
                style={{ fontSize: '0.875rem' }}
              >
                <Download size={15} /> Download Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ backgroundColor: '#EA580C', color: '#FFFFFF', fontSize: '0.6875rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', letterSpacing: '0.5px' }}>
            STAFF & ADMISSIONS PORTAL
          </span>
          <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>Medpath Elite Candidate Management</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          MedPath Elite Admission Tracker
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '780px' }}>
          Monitor active enrolled students granted access, review their uploaded admission documents, and advance each student through all 9 official Italian university application stages.
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Active Enrolled Students', value: allStudents.length, color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' },
          { label: 'Documents Pending Review', value: documents.filter(d => d.status === 'under_review').length, color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' },
          { label: 'Visa Files in Preparation', value: allStudents.filter(s => s.stages?.visa_process?.status === 'file_being_prepared').length, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
          { label: 'Medical Seats Secured', value: allStudents.filter(s => s.stages?.imat_result?.status === 'secured_medical_seat').length, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: stat.bg, border: `1px solid ${stat.border}`, borderRadius: '16px', padding: '20px 24px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px', fontWeight: 700 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '480px' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by student name, enrollment #, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 16px 11px 42px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              outline: 'none',
              fontSize: '0.9375rem',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
            Showing <strong>{filteredStudents.length}</strong> enrolled students
          </span>
        </div>
      </div>

      {/* Main Student Directory Grid */}
      {loading ? (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
          <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 14px', display: 'block', color: '#EA580C' }} />
          Loading actively enrolled students...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '60px 24px', textAlign: 'center' }}>
          <Users size={48} color="#CBD5E1" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>No students found</h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
            No students matching &quot;{search}&quot;. Students enrolled with MedPath Elite or approved payment automatically show up here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
          {filteredStudents.map((student) => {
            const { completed, total, percent } = getStudentProgress(student);
            const isSelected = selectedStudent?.id === student.id;

            return (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${isSelected ? '#EA580C' : '#E2E8F0'}`,
                  borderRadius: '18px',
                  padding: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 10px 25px -5px rgba(234, 88, 12, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  }
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #EA580C, #FB923C)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.25rem',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(234, 88, 12, 0.25)',
                      }}
                    >
                      {student.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                        {student.studentName}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} />
                        <span>{student.email}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      backgroundColor: '#ECFDF5',
                      color: '#047857',
                      border: '1px solid #A7F3D0',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      letterSpacing: '0.3px',
                      flexShrink: 0,
                    }}
                  >
                    ENROLLED
                  </span>
                </div>

                {/* Metadata Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                  <span style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '8px', color: '#475569', fontWeight: 700 }}>
                    ID: {student.enrollmentNumber || 'AMA-2026-PENDING'}
                  </span>
                  {student.phone && (
                    <span style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '8px', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={11} /> {student.phone}
                    </span>
                  )}
                  {student.country && (
                    <span style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '8px', color: '#475569' }}>
                      📍 {student.country}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Journey Milestones</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#EA580C' }}>
                      {completed}/{total} stages ({percent}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percent}%`,
                        background: percent === 100 ? '#16A34A' : 'linear-gradient(90deg, #EA580C, #F97316)',
                        borderRadius: '10px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Click CTA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#EA580C', fontWeight: 700 }}>
                  <span>Open Complete Student File</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── COMPLETE STUDENT DETAIL SLIDE-OVER / DOSSIER ── */}
      {selectedStudent && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setSelectedStudent(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(3px)',
              zIndex: 200,
            }}
          />

          {/* Dossier Panel */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '820px',
              backgroundColor: '#FFFFFF',
              zIndex: 210,
              overflowY: 'auto',
              boxShadow: '-12px 0 60px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Dossier Header */}
            <div style={{ backgroundColor: '#0F172A', padding: '24px 32px', color: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <button
                  onClick={() => setSelectedStudent(null)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ChevronLeft size={16} /> Back to Student List
                </button>

                <button
                  onClick={() => setSelectedStudent(null)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Student Identity Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, #EA580C, #FB923C)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.6rem',
                    flexShrink: 0,
                    boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)',
                  }}
                >
                  {selectedStudent.studentName.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                      {selectedStudent.studentName}
                    </h2>
                    <span style={{ backgroundColor: '#EA580C', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '2px 10px', borderRadius: '12px' }}>
                      MEDPATH ELITE
                    </span>
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span>Enrollment #: <strong style={{ color: '#F8FAFC' }}>{selectedStudent.enrollmentNumber || 'AMA-2026-PENDING'}</strong></span>
                    <span>•</span>
                    <span>{selectedStudent.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Details Information Card */}
            <div style={{ padding: '24px 32px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                Student Basic Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Full Name</div>
                  <div style={{ fontSize: '0.9375rem', color: '#0F172A', fontWeight: 800, marginTop: '2px' }}>{selectedStudent.studentName}</div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Enrollment Number</div>
                  <div style={{ fontSize: '0.9375rem', color: '#EA580C', fontWeight: 800, marginTop: '2px' }}>{selectedStudent.enrollmentNumber || 'AMA-2026-0482'}</div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Email Address</div>
                  <div style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 700, marginTop: '2px', wordBreak: 'break-all' }}>
                    <a href={`mailto:${selectedStudent.email}`} style={{ color: '#0284C7', textDecoration: 'none' }}>{selectedStudent.email}</a>
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Contact / WhatsApp</div>
                  <div style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{selectedStudent.phone || 'Not provided'}</span>
                    {selectedStudent.phone && (
                      <a
                        href={`https://wa.me/${selectedStudent.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          backgroundColor: '#25D366', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px',
                          fontSize: '0.7rem', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px',
                        }}
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Country of Residence</div>
                  <div style={{ fontSize: '0.9375rem', color: '#0F172A', fontWeight: 800, marginTop: '2px' }}>{selectedStudent.country || 'International'}</div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Target Examination</div>
                  <div style={{ fontSize: '0.9375rem', color: '#059669', fontWeight: 800, marginTop: '2px' }}>Italy IMAT 2026 / Medicine</div>
                </div>
              </div>
            </div>

            {/* ── STUDENT UPLOADED DOCUMENTS SECTION ── */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FolderLock size={20} color="#EA580C" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Uploaded Documents (Document Vault)
                  </h3>
                  <span style={{ backgroundColor: '#FFF7ED', color: '#EA580C', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', border: '1px solid #FED7AA' }}>
                    {studentDocs.length} files
                  </span>
                </div>
              </div>

              {studentDocs.length === 0 ? (
                <div style={{ backgroundColor: '#F8FAFC', border: '1.5px dashed #CBD5E1', borderRadius: '14px', padding: '32px', textAlign: 'center' }}>
                  <FileText size={36} color="#94A3B8" style={{ margin: '0 auto 10px', display: 'block' }} />
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    No documents uploaded by this student yet
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', maxWidth: '420px', margin: '0 auto' }}>
                    When {selectedStudent.studentName} uploads their passport, diploma, or CIMEA into the Document Vault, you will be able to inspect, review, and download them here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {studentDocs.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>{doc.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            {doc.fileName} • {(doc.fileSizeBytes / 1000000).toFixed(1)} MB • {doc.category}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {doc.fileDataUrl && (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            style={{
                              padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF', color: '#334155', fontSize: '0.78rem', fontWeight: 700,
                              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px',
                            }}
                          >
                            <Eye size={13} /> View File
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (doc.fileDataUrl) {
                              const a = document.createElement('a');
                              a.href = doc.fileDataUrl;
                              a.download = doc.fileName;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }
                          }}
                          style={{
                            padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF', color: '#334155', fontSize: '0.78rem', fontWeight: 700,
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px',
                          }}
                        >
                          <Download size={13} /> Download
                        </button>
                        <select
                          value={doc.status}
                          onChange={(e) => updateDocStatus(doc.id, e.target.value as any)}
                          style={{
                            padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1',
                            fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#FFFFFF', color: '#0F172A',
                          }}
                        >
                          <option value="under_review">Under Review</option>
                          <option value="approved">Approved & Verified</option>
                          <option value="revision_requested">Revision Requested</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── THE 9 ADVANCED STAGES IN EXACT SEQUENCE ── */}
            <div style={{ padding: '28px 32px 60px' }}>
              <div style={{ marginBottom: '22px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>
                  Italian University Admission Stages (1 to 9)
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                  Update stage statuses, record decision dates, reviewer names, and log detailed custom reviewer notes for the student.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {STAGES_CONFIG.map((cfg) => {
                  const stageData: any = selectedStudent.stages?.[cfg.key] || {};
                  const currentStatus = typeof stageData === 'object' ? (stageData.status || 'pending') : stageData;
                  const currentDecision = typeof stageData === 'object' ? (stageData.decision || 'pending') : 'pending';
                  const isSaving = savingKey === `${selectedStudent.id}-${cfg.key}`;

                  return (
                    <div
                      key={cfg.key}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      }}
                    >
                      {/* Stage Card Header */}
                      <div
                        style={{
                          backgroundColor: cfg.bg,
                          padding: '16px 22px',
                          borderBottom: '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              backgroundColor: cfg.color,
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              fontSize: '0.95rem',
                              flexShrink: 0,
                            }}
                          >
                            {cfg.number}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                              {cfg.label}
                            </h4>
                            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0' }}>
                              {cfg.subtitle}
                            </p>
                          </div>
                        </div>

                        {isSaving && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#EA580C', fontWeight: 700 }}>
                            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                            <span>Saving...</span>
                          </div>
                        )}
                      </div>

                      {/* Notice Banner (for CIMEA / DOV) */}
                      {cfg.notice && (
                        <div
                          style={{
                            backgroundColor: '#FEF3C7',
                            borderBottom: '1px solid #FDE68A',
                            padding: '10px 22px',
                            color: '#92400E',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <AlertTriangle size={16} color="#B45309" />
                          <span>Notice: {cfg.notice}</span>
                        </div>
                      )}

                      {/* Stage Specific Controls */}
                      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* ── STAGE 1: Required Documents and profile Evaluation ── */}
                        {cfg.type === 'evaluation' && (
                          <>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                Stage Status (Evaluation Outcome)
                              </label>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                  { val: 'pending', label: 'Pending', color: '#64748B', bg: '#F8FAFC' },
                                  { val: 'reviewed', label: 'Reviewed', color: '#0284C7', bg: '#F0F9FF' },
                                  { val: 'approved', label: 'Approved', color: '#16A34A', bg: '#F0FDF4' },
                                  { val: 'rejected', label: 'Rejected', color: '#DC2626', bg: '#FEF2F2' },
                                  { val: 'missing_documents', label: 'Missing Documents', color: '#D97706', bg: '#FFFBEB' },
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    onClick={() => handleStageFieldChange(cfg.key, 'status', opt.val)}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '10px',
                                      border: `1.5px solid ${currentStatus === opt.val ? opt.color : '#CBD5E1'}`,
                                      backgroundColor: currentStatus === opt.val ? opt.bg : '#FFFFFF',
                                      color: currentStatus === opt.val ? opt.color : '#64748B',
                                      fontWeight: currentStatus === opt.val ? 800 : 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {currentStatus === opt.val && '✓ '}
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                  Reviewer Name (Kis ne approve / review kiya)
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Dr. Farhan Ahmed"
                                  value={stageData.reviewerName || ''}
                                  onChange={(e) => handleStageFieldChange(cfg.key, 'reviewerName', e.target.value)}
                                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                  Action / Approval Date
                                </label>
                                <input
                                  type="date"
                                  value={stageData.actionDate || ''}
                                  onChange={(e) => handleStageFieldChange(cfg.key, 'actionDate', e.target.value)}
                                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                Reviewer Comment (Konsay documents missing hain ya kiyun reject kiya)
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Write custom reviewer notes regarding document evaluation, missing apostilles, or approval remarks..."
                                value={stageData.comments || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'comments', e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'vertical' }}
                              />
                            </div>
                          </>
                        )}

                        {/* ── STAGE 2: University Application ── */}
                        {cfg.type === 'application' && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                  Application Status
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {['pending', 'applied'].map((opt) => (
                                    <button
                                      key={opt}
                                      onClick={() => handleStageFieldChange(cfg.key, 'status', opt)}
                                      style={{
                                        padding: '7px 16px',
                                        borderRadius: '8px',
                                        border: `1.5px solid ${currentStatus === opt ? '#0E7490' : '#CBD5E1'}`,
                                        backgroundColor: currentStatus === opt ? '#ECFEFF' : '#FFFFFF',
                                        color: currentStatus === opt ? '#0E7490' : '#64748B',
                                        fontWeight: currentStatus === opt ? 800 : 600,
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                      }}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                  Applied Date (Kis date ko apply kiya)
                                </label>
                                <input
                                  type="date"
                                  value={stageData.appliedDate || ''}
                                  onChange={(e) => handleStageFieldChange(cfg.key, 'appliedDate', e.target.value)}
                                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                University Admission Decision
                              </label>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                  { val: 'pending', label: 'Decision: Pending', color: '#64748B', bg: '#F8FAFC' },
                                  { val: 'accepted', label: 'Accepted', color: '#16A34A', bg: '#F0FDF4' },
                                  { val: 'rejected', label: 'Rejected', color: '#DC2626', bg: '#FEF2F2' },
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    onClick={() => handleStageFieldChange(cfg.key, 'decision', opt.val)}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '8px',
                                      border: `1.5px solid ${currentDecision === opt.val ? opt.color : '#CBD5E1'}`,
                                      backgroundColor: currentDecision === opt.val ? opt.bg : '#FFFFFF',
                                      color: currentDecision === opt.val ? opt.color : '#64748B',
                                      fontWeight: currentDecision === opt.val ? 800 : 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                Reviewer Decision Date & Reason / Comment
                              </label>
                              <textarea
                                rows={2}
                                placeholder="Kis date ko accept ya reject hua and kis vajah se hua..."
                                value={stageData.comments || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'comments', e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'vertical' }}
                              />
                            </div>
                          </>
                        )}

                        {/* ── STAGE 3: Pre-enrollment ── */}
                        {cfg.type === 'pre_enrollment' && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                  Pre-Enrollment Status
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {['pending', 'applied'].map((opt) => (
                                    <button
                                      key={opt}
                                      onClick={() => handleStageFieldChange(cfg.key, 'status', opt)}
                                      style={{
                                        padding: '7px 16px',
                                        borderRadius: '8px',
                                        border: `1.5px solid ${currentStatus === opt ? '#4F46E5' : '#CBD5E1'}`,
                                        backgroundColor: currentStatus === opt ? '#EEF2FF' : '#FFFFFF',
                                        color: currentStatus === opt ? '#4F46E5' : '#64748B',
                                        fontWeight: currentStatus === opt ? 800 : 600,
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                      }}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                  Applied Date (Kis date ko apply kiya)
                                </label>
                                <input
                                  type="date"
                                  value={stageData.appliedDate || ''}
                                  onChange={(e) => handleStageFieldChange(cfg.key, 'appliedDate', e.target.value)}
                                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Pre-Enrollment Decision
                              </label>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                  { val: 'pending', label: 'Decision: Pending', color: '#64748B', bg: '#F8FAFC' },
                                  { val: 'forwarded_to_embassy', label: 'Forwarded to Relevant Embassy/Consulate', color: '#16A34A', bg: '#F0FDF4' },
                                  { val: 'rejected', label: 'Rejected', color: '#DC2626', bg: '#FEF2F2' },
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    onClick={() => handleStageFieldChange(cfg.key, 'decision', opt.val)}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '8px',
                                      border: `1.5px solid ${currentDecision === opt.val ? opt.color : '#CBD5E1'}`,
                                      backgroundColor: currentDecision === opt.val ? opt.bg : '#FFFFFF',
                                      color: currentDecision === opt.val ? opt.color : '#64748B',
                                      fontWeight: currentDecision === opt.val ? 800 : 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                  Admission Responsible Person (Zimadar Admi)
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Adv Ahmad Jahangir"
                                  value={stageData.responsiblePerson || ''}
                                  onChange={(e) => handleStageFieldChange(cfg.key, 'responsiblePerson', e.target.value)}
                                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                  Decision / Forward Date
                                </label>
                                <input
                                  type="date"
                                  value={stageData.actionDate || ''}
                                  onChange={(e) => handleStageFieldChange(cfg.key, 'actionDate', e.target.value)}
                                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                Comment (Kis vajah se accept/reject/forward hua)
                              </label>
                              <textarea
                                rows={2}
                                placeholder="Admission responsible person comment on pre-enrollment status and embassy instructions..."
                                value={stageData.comments || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'comments', e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'vertical' }}
                              />
                            </div>
                          </>
                        )}

                        {/* ── STAGE 4: CIMEA / DOV ── */}
                        {cfg.type === 'cimea' && (
                          <>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                CIMEA / DOV Verification Status
                              </label>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                  { val: 'pending', label: 'Pending', color: '#64748B', bg: '#F8FAFC' },
                                  { val: 'in_progress', label: 'In Progress', color: '#0284C7', bg: '#F0F9FF' },
                                  { val: 'completed', label: 'Completed', color: '#16A34A', bg: '#F0FDF4' },
                                  { val: 'received', label: 'Received', color: '#7C3AED', bg: '#F5F3FF' },
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    onClick={() => handleStageFieldChange(cfg.key, 'status', opt.val)}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '10px',
                                      border: `1.5px solid ${currentStatus === opt.val ? opt.color : '#CBD5E1'}`,
                                      backgroundColor: currentStatus === opt.val ? opt.bg : '#FFFFFF',
                                      color: currentStatus === opt.val ? opt.color : '#64748B',
                                      fontWeight: currentStatus === opt.val ? 800 : 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                Status Date
                              </label>
                              <input
                                type="date"
                                value={stageData.actionDate || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'actionDate', e.target.value)}
                                style={{ width: '220px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                CIMEA / DOV Custom Note
                              </label>
                              <textarea
                                rows={2}
                                placeholder="Add custom status updates or instructions regarding CIMEA Statement of Comparability / DOV..."
                                value={stageData.comments || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'comments', e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'vertical' }}
                              />
                            </div>
                          </>
                        )}

                        {/* ── STAGE 5: Regional Scholarship ── */}
                        {cfg.type === 'scholarship' && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                  Scholarship Application Status
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {[
                                    { val: 'pending', label: 'Application Pending' },
                                    { val: 'applied', label: 'Applied' },
                                  ].map((opt) => (
                                    <button
                                      key={opt.val}
                                      onClick={() => handleStageFieldChange(cfg.key, 'status', opt.val)}
                                      style={{
                                        padding: '7px 14px',
                                        borderRadius: '8px',
                                        border: `1.5px solid ${currentStatus === opt.val ? '#D97706' : '#CBD5E1'}`,
                                        backgroundColor: currentStatus === opt.val ? '#FFFBEB' : '#FFFFFF',
                                        color: currentStatus === opt.val ? '#D97706' : '#64748B',
                                        fontWeight: currentStatus === opt.val ? 800 : 600,
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                  Applied Date
                                </label>
                                <input
                                  type="date"
                                  value={stageData.appliedDate || ''}
                                  onChange={(e) => handleStageFieldChange(cfg.key, 'appliedDate', e.target.value)}
                                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Scholarship Result
                              </label>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                  { val: 'pending', label: 'Result: Pending', color: '#64748B', bg: '#F8FAFC' },
                                  { val: 'approved', label: 'Approved (Winner / Eligible)', color: '#16A34A', bg: '#F0FDF4' },
                                  { val: 'rejected', label: 'Rejected', color: '#DC2626', bg: '#FEF2F2' },
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    onClick={() => handleStageFieldChange(cfg.key, 'decision', opt.val)}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '8px',
                                      border: `1.5px solid ${currentDecision === opt.val ? opt.color : '#CBD5E1'}`,
                                      backgroundColor: currentDecision === opt.val ? opt.bg : '#FFFFFF',
                                      color: currentDecision === opt.val ? opt.color : '#64748B',
                                      fontWeight: currentDecision === opt.val ? 800 : 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                Scholarship Comment (Apni marzi ka comment)
                              </label>
                              <textarea
                                rows={2}
                                placeholder="Add notes on DSU ranking, stipend disbursement, ISEE parity, or appeal status..."
                                value={stageData.comments || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'comments', e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'vertical' }}
                              />
                            </div>
                          </>
                        )}

                        {/* ── STAGE 6: IMAT Registration ── */}
                        {cfg.type === 'imat_reg' && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                  Registration Status
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {['pending', 'applied'].map((opt) => (
                                    <button
                                      key={opt}
                                      onClick={() => handleStageFieldChange(cfg.key, 'status', opt)}
                                      style={{
                                        padding: '7px 16px',
                                        borderRadius: '8px',
                                        border: `1.5px solid ${currentStatus === opt ? '#2563EB' : '#CBD5E1'}`,
                                        backgroundColor: currentStatus === opt ? '#EFF6FF' : '#FFFFFF',
                                        color: currentStatus === opt ? '#2563EB' : '#64748B',
                                        fontWeight: currentStatus === opt ? 800 : 600,
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                      }}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                  Registration Date
                                </label>
                                <input
                                  type="date"
                                  value={stageData.appliedDate || ''}
                                  onChange={(e) => handleStageFieldChange(cfg.key, 'appliedDate', e.target.value)}
                                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Registration Decision / Seat Allocation
                              </label>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                  { val: 'pending', label: 'Decision: Pending', color: '#64748B', bg: '#F8FAFC' },
                                  { val: 'approved', label: 'Approved (Seat Confirmed)', color: '#16A34A', bg: '#F0FDF4' },
                                  { val: 'rejected', label: 'Rejected', color: '#DC2626', bg: '#FEF2F2' },
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    onClick={() => handleStageFieldChange(cfg.key, 'decision', opt.val)}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '8px',
                                      border: `1.5px solid ${currentDecision === opt.val ? opt.color : '#CBD5E1'}`,
                                      backgroundColor: currentDecision === opt.val ? opt.bg : '#FFFFFF',
                                      color: currentDecision === opt.val ? opt.color : '#64748B',
                                      fontWeight: currentDecision === opt.val ? 800 : 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                IMAT Registration Comment
                              </label>
                              <textarea
                                rows={2}
                                placeholder="Add test centre location, candidate payment receipt #, or registration confirmation notes..."
                                value={stageData.comments || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'comments', e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'vertical' }}
                              />
                            </div>
                          </>
                        )}

                        {/* ── STAGE 7: IMAT Result ── */}
                        {cfg.type === 'imat_res' && (
                          <>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                IMAT Official Result Outcome
                              </label>
                              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {[
                                  { val: 'pending', label: 'Pending', color: '#64748B', bg: '#F8FAFC' },
                                  { val: 'secured_medical_seat', label: '🎉 Congratulations: Secured Medical Seat', color: '#16A34A', bg: '#F0FDF4' },
                                  { val: 'better_luck_next_time', label: 'Better Luck Next Time', color: '#64748B', bg: '#F1F5F9' },
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    onClick={() => handleStageFieldChange(cfg.key, 'status', opt.val)}
                                    style={{
                                      padding: '8px 16px',
                                      borderRadius: '10px',
                                      border: `1.5px solid ${currentStatus === opt.val ? opt.color : '#CBD5E1'}`,
                                      backgroundColor: currentStatus === opt.val ? opt.bg : '#FFFFFF',
                                      color: currentStatus === opt.val ? opt.color : '#475569',
                                      fontWeight: currentStatus === opt.val ? 800 : 600,
                                      fontSize: '0.85rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                Result Announcement Date
                              </label>
                              <input
                                type="date"
                                value={stageData.actionDate || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'actionDate', e.target.value)}
                                style={{ width: '220px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                Score & University Allocation Notes
                              </label>
                              <textarea
                                rows={2}
                                placeholder="Record official test score (e.g. 64.2 / 90) and allocated university..."
                                value={stageData.comments || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'comments', e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'vertical' }}
                              />
                            </div>
                          </>
                        )}

                        {/* ── STAGE 8: Student Visa Process ── */}
                        {cfg.type === 'visa' && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                  Visa Filing Status
                                </label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  {[
                                    { val: 'pending', label: 'Pending' },
                                    { val: 'file_being_prepared', label: 'File being Prepared' },
                                    { val: 'applied', label: 'Applied' },
                                  ].map((opt) => (
                                    <button
                                      key={opt.val}
                                      onClick={() => handleStageFieldChange(cfg.key, 'status', opt.val)}
                                      style={{
                                        padding: '7px 14px',
                                        borderRadius: '8px',
                                        border: `1.5px solid ${currentStatus === opt.val ? '#EA580C' : '#CBD5E1'}`,
                                        backgroundColor: currentStatus === opt.val ? '#FFF7ED' : '#FFFFFF',
                                        color: currentStatus === opt.val ? '#EA580C' : '#64748B',
                                        fontWeight: currentStatus === opt.val ? 800 : 600,
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                  Submission / Appointment Date
                                </label>
                                <input
                                  type="date"
                                  value={stageData.appliedDate || ''}
                                  onChange={(e) => handleStageFieldChange(cfg.key, 'appliedDate', e.target.value)}
                                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Embassy Visa Decision
                              </label>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                  { val: 'pending', label: 'Decision: Pending', color: '#64748B', bg: '#F8FAFC' },
                                  { val: 'approved', label: 'Visa Approved / Issued', color: '#16A34A', bg: '#F0FDF4' },
                                  { val: 'rejected', label: 'Rejected', color: '#DC2626', bg: '#FEF2F2' },
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    onClick={() => handleStageFieldChange(cfg.key, 'decision', opt.val)}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '8px',
                                      border: `1.5px solid ${currentDecision === opt.val ? opt.color : '#CBD5E1'}`,
                                      backgroundColor: currentDecision === opt.val ? opt.bg : '#FFFFFF',
                                      color: currentDecision === opt.val ? opt.color : '#64748B',
                                      fontWeight: currentDecision === opt.val ? 800 : 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                Visa Dossier & Consulate Remarks
                              </label>
                              <textarea
                                rows={2}
                                placeholder="Add consulate tracking number, insurance, financial statement verification, or rejection reasons..."
                                value={stageData.comments || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'comments', e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'vertical' }}
                              />
                            </div>
                          </>
                        )}

                        {/* ── STAGE 9: Arrival Support / Guidance ── */}
                        {cfg.type === 'arrival' && (
                          <>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                Arrival & Ground Support Status
                              </label>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                  { val: 'pending', label: 'Pending', color: '#64748B', bg: '#F8FAFC' },
                                  { val: 'in_progress', label: 'In Progress (Arrival Scheduled)', color: '#0284C7', bg: '#F0F9FF' },
                                  { val: 'completed', label: 'Completed (Settled in Italy)', color: '#16A34A', bg: '#F0FDF4' },
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    onClick={() => handleStageFieldChange(cfg.key, 'status', opt.val)}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '10px',
                                      border: `1.5px solid ${currentStatus === opt.val ? opt.color : '#CBD5E1'}`,
                                      backgroundColor: currentStatus === opt.val ? opt.bg : '#FFFFFF',
                                      color: currentStatus === opt.val ? opt.color : '#64748B',
                                      fontWeight: currentStatus === opt.val ? 800 : 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                Arrival Support Comments
                              </label>
                              <textarea
                                rows={2}
                                placeholder="Accommodation booking, Codice Fiscale, Italian SIM card, and university matriculation notes..."
                                value={stageData.comments || ''}
                                onChange={(e) => handleStageFieldChange(cfg.key, 'comments', e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'vertical' }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
