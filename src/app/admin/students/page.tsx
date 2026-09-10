'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, XCircle, Clock, Search, RefreshCw, User, FileText, Download, X, Globe, Phone, Package, Mail } from 'lucide-react';
import { ACADEMY_PACKAGES, getPackageByIdOrName } from '@/lib/packages';

interface StudentProfile {
  id: string;
  ama_id?: string;
  full_name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  whatsapp_number?: string;
  whatsappNumber?: string;
  selected_package?: string;
  selectedPackage?: string;
  package_price?: string;
  packagePrice?: string;
  payment_approved: boolean;
  created_at?: string;
  createdAt?: string;
}

interface StudentDocument {
  id: string;
  title: string;
  category: string;
  file_name: string;
  file_size_bytes: number;
  status: string;
  created_at: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Modals
  const [viewingStudent, setViewingStudent] = useState<StudentProfile | null>(null);
  const [viewingDocs, setViewingDocs] = useState<StudentProfile | null>(null);
  const [studentDocs, setStudentDocs] = useState<StudentDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    let combinedList: StudentProfile[] = [];

    // 1. Fetch from Supabase
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        combinedList = data as StudentProfile[];
      }
    } catch (e) {
      console.warn('Supabase fetch error:', e);
    }

    // 2. Load cached local registrations for demo continuity
    try {
      const localListStr = localStorage.getItem('adminStudentList');
      if (localListStr) {
        const localList: any[] = JSON.parse(localListStr);
        localList.forEach((localItem) => {
          const exists = combinedList.some(
            (s) => s.id === localItem.id || (s.email && s.email.toLowerCase() === localItem.email.toLowerCase())
          );
          if (!exists) {
            combinedList.unshift({
              id: localItem.id,
              ama_id: localItem.ama_id,
              full_name: localItem.fullName || `${localItem.firstName || ''} ${localItem.lastName || ''}`.trim(),
              firstName: localItem.firstName,
              lastName: localItem.lastName,
              email: localItem.email,
              country: localItem.country,
              whatsapp_number: localItem.whatsappNumber,
              selected_package: localItem.selectedPackage,
              package_price: localItem.packagePrice,
              payment_approved: localItem.paymentApproved || false,
              created_at: localItem.createdAt || new Date().toISOString(),
            });
          }
        });
      }
    } catch (e) {
      console.error(e);
    }

    // Fallback sample data if empty
    if (combinedList.length === 0) {
      combinedList = [
        {
          id: 'demo-1',
          ama_id: 'AMA-849201',
          full_name: 'Zainab Al-Mansoor',
          email: 'zainab.mansoor@example.com',
          country: 'Italy',
          whatsapp_number: '+39 340 1234567',
          selected_package: 'Ahsora IMAT Ascend',
          package_price: '€299',
          payment_approved: true,
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 'demo-2',
          ama_id: 'AMA-392018',
          full_name: 'Arham Farooq',
          email: 'arham.farooq@example.com',
          country: 'Pakistan',
          whatsapp_number: '+92 300 9876543',
          selected_package: 'Ahsora Path Elite',
          package_price: '€799',
          payment_approved: false,
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: 'demo-3',
          ama_id: 'AMA-501928',
          full_name: 'Elena Vance',
          email: 'elena.vance@example.com',
          country: 'United Arab Emirates',
          whatsapp_number: '+971 50 1234567',
          selected_package: 'Ahsora IMAT Mastery',
          package_price: '€499',
          payment_approved: true,
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ];
    }

    setStudents(combinedList);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const toggleApproval = async (studentId: string, currentStatus: boolean) => {
    setUpdating(studentId);
    
    // Update local state
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, payment_approved: !currentStatus } : s))
    );

    // Update LocalStorage demo list
    try {
      const localListStr = localStorage.getItem('adminStudentList');
      if (localListStr) {
        const localList: any[] = JSON.parse(localListStr);
        const updated = localList.map((item) =>
          item.id === studentId ? { ...item, paymentApproved: !currentStatus } : item
        );
        localStorage.setItem('adminStudentList', JSON.stringify(updated));
      }
    } catch (e) {}

    // Update Supabase
    try {
      const supabase = createClient();
      await supabase
        .from('profiles')
        .update({ payment_approved: !currentStatus })
        .eq('id', studentId);
    } catch (e) {}

    setUpdating(null);
  };

  const openDocs = async (student: StudentProfile) => {
    setViewingDocs(student);
    setDocsLoading(true);
    setStudentDocs([]);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });
      setStudentDocs((data as StudentDocument[]) ?? []);
    } catch (e) {}
    setDocsLoading(false);
  };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const name = s.full_name || `${s.firstName || ''} ${s.lastName || ''}`;
    const email = s.email || '';
    const amaId = s.ama_id || '';
    const country = s.country || '';
    const pkg = s.selected_package || s.selectedPackage || '';
    const whatsapp = s.whatsapp_number || s.whatsappNumber || '';

    return (
      name.toLowerCase().includes(q) ||
      email.toLowerCase().includes(q) ||
      amaId.toLowerCase().includes(q) ||
      country.toLowerCase().includes(q) ||
      pkg.toLowerCase().includes(q) ||
      whatsapp.toLowerCase().includes(q)
    );
  });

  const approvedCount = students.filter((s) => s.payment_approved).length;
  const pendingCount = students.filter((s) => !s.payment_approved).length;

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          Student & Package Management
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          View all registered students, their purchased package plans, contact details, and payment approvals.
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Students', value: students.length, color: '#0F172A', bg: '#F8FAFC' },
          { label: 'Payment Approved', value: approvedCount, color: '#16A34A', bg: '#F0FFF4' },
          { label: 'Pending Payment', value: pendingCount, color: '#D97706', bg: '#FFFBEB' },
          {
            label: 'Total Revenue (Est.)',
            value: `€${students
              .filter((s) => s.payment_approved)
              .reduce((sum, s) => {
                const pkg = getPackageByIdOrName(s.selected_package || s.selectedPackage);
                return sum + pkg.numericPrice;
              }, 0)}`,
            color: '#2563EB',
            bg: '#EFF6FF',
          },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: stat.bg, border: '1px solid #E2E8F0', borderRadius: '14px', padding: '20px 24px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px', fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Refresh Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name, email, package, country, or WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '11px 16px 11px 42px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem', backgroundColor: '#FFF' }}
          />
        </div>
        <button
          onClick={fetchStudents}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.9375rem' }}
        >
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      {/* Main Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8', fontWeight: 600 }}>Loading students and packages...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <User size={44} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
            <div style={{ color: '#64748B', fontWeight: 600, fontSize: '1rem' }}>No student records found matching "{search}"</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student Info</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Purchased Package</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact & Location</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Access Control</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, i) => {
                  const pkgName = student.selected_package || student.selectedPackage || 'Ahsora IMAT Ascend';
                  const matchedPkg = getPackageByIdOrName(pkgName);
                  const pkgPrice = student.package_price || student.packagePrice || matchedPkg.price;
                  const fullName = student.full_name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';
                  const country = student.country || 'Italy';
                  const whatsapp = student.whatsapp_number || student.whatsappNumber || 'Not specified';

                  return (
                    <tr key={student.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      {/* Student Info */}
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem' }}>{fullName}</div>
                        <div style={{ color: '#64748B', fontSize: '0.8125rem', marginTop: '2px' }}>{student.email}</div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563EB', fontSize: '0.75rem', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '6px', marginTop: '4px', display: 'inline-block' }}>
                          {student.ama_id || 'AMA-NEW'}
                        </span>
                      </td>

                      {/* Purchased Package */}
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '6px 12px', borderRadius: '10px' }}>
                          <Package size={16} color="#16A34A" />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#15803D' }}>{matchedPkg.name}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#16A34A' }}>Amount: {pkgPrice}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact & Location */}
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontSize: '0.8125rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Globe size={14} color="#64748B" /> {country}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <Phone size={14} /> {whatsapp}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 18px' }}>
                        {student.payment_approved ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#F0FFF4', color: '#16A34A', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
                            <CheckCircle2 size={14} /> Access Active
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#FFFBEB', color: '#D97706', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
                            <Clock size={14} /> Pending Payment
                          </span>
                        )}
                      </td>

                      {/* Access Control */}
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            disabled={updating === student.id || student.payment_approved}
                            onClick={() => toggleApproval(student.id, false)}
                            style={{
                              padding: '7px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: updating === student.id || student.payment_approved ? 'not-allowed' : 'pointer',
                              fontWeight: 700,
                              fontSize: '0.8125rem',
                              backgroundColor: student.payment_approved ? '#E2E8F0' : '#16A34A',
                              color: student.payment_approved ? '#94A3B8' : '#FFFFFF',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            disabled={updating === student.id || !student.payment_approved}
                            onClick={() => toggleApproval(student.id, true)}
                            style={{
                              padding: '7px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: updating === student.id || !student.payment_approved ? 'not-allowed' : 'pointer',
                              fontWeight: 700,
                              fontSize: '0.8125rem',
                              backgroundColor: !student.payment_approved ? '#FEE2E2' : '#DC2626',
                              color: !student.payment_approved ? '#DC2626' : '#FFFFFF',
                              opacity: !student.payment_approved ? 0.6 : 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <XCircle size={14} /> Revoke
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => setViewingStudent(student)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.8125rem',
                              color: '#0F172A',
                            }}
                          >
                            Full Info
                          </button>
                          <button
                            onClick={() => openDocs(student)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.8125rem',
                              color: '#475569',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <FileText size={14} /> Docs
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Dossier Modal */}
      {viewingStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '580px', padding: '32px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button
              onClick={() => setViewingStudent(null)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                {(viewingStudent.full_name || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {viewingStudent.full_name || 'Student Dossier'}
                </h2>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '2px' }}>
                  Student ID: <strong>{viewingStudent.ama_id || 'AMA-NEW'}</strong>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '10px' }}>
                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Purchased Package</span>
                <span style={{ color: '#16A34A', fontWeight: 800, fontSize: '0.9375rem' }}>
                  {viewingStudent.selected_package || viewingStudent.selectedPackage || 'Ahsora IMAT Ascend'} ({viewingStudent.package_price || viewingStudent.packagePrice || '€299'})
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '10px' }}>
                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Email Address</span>
                <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '0.875rem' }}>{viewingStudent.email}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '10px' }}>
                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Country of Residence</span>
                <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '0.875rem' }}>{viewingStudent.country || 'Italy'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '10px' }}>
                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>WhatsApp Contact</span>
                <span style={{ color: '#2563EB', fontWeight: 700, fontSize: '0.875rem' }}>{viewingStudent.whatsapp_number || viewingStudent.whatsappNumber || 'Not specified'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '10px' }}>
                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Portal Status</span>
                <span style={{ color: viewingStudent.payment_approved ? '#16A34A' : '#D97706', fontWeight: 800, fontSize: '0.875rem' }}>
                  {viewingStudent.payment_approved ? 'APPROVED & ACTIVE' : 'PENDING PAYMENT REVIEW'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Registration Date</span>
                <span style={{ color: '#475569', fontSize: '0.875rem' }}>
                  {viewingStudent.created_at ? new Date(viewingStudent.created_at).toLocaleString() : 'Recent'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  toggleApproval(viewingStudent.id, viewingStudent.payment_approved);
                  setViewingStudent(null);
                }}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.875rem' }}
              >
                {viewingStudent.payment_approved ? 'Revoke Access' : 'Approve Payment & Grant Access'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocs && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '600px', padding: '32px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button
              onClick={() => setViewingDocs(null)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Student Documents
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '24px' }}>
              Viewing uploaded files for <strong>{viewingDocs.full_name || viewingDocs.email}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '80px' }}>
              {docsLoading ? (
                <div style={{ textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Loading documents...</div>
              ) : studentDocs.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94A3B8', padding: '24px' }}>
                  <FileText size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
                  No documents uploaded yet.
                </div>
              ) : (
                studentDocs.map((doc) => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#0F172A' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '2px' }}>
                          {doc.file_name} • {doc.file_size_bytes ? `${(doc.file_size_bytes / 1024 / 1024).toFixed(1)} MB` : ''} •
                          <span style={{ marginLeft: '6px', fontWeight: 600, color: doc.status === 'approved' ? '#16A34A' : doc.status === 'revision_requested' ? '#D97706' : '#3B82F6' }}>
                            {doc.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#475569' }}>
                      <Download size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
