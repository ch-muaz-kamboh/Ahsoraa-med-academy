'use client';

import React, { useEffect, useState } from 'react';
import { Globe, MapPin, Phone, Package, CheckCircle2, Clock, RefreshCw, Trash2 } from 'lucide-react';

export default function StaffStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteStudent = async (stu: any) => {
    const studentName = stu.full_name || stu.fullName || stu.email || 'this student';
    const confirmDelete = window.confirm(
      `Are you sure you want to PERMANENTLY delete student:\n\n${studentName} (${stu.email || 'No email'})\n\nThis will remove them from the list and delete their account from the database. This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setDeletingId(stu.id || stu.email);

    try {
      await fetch('/api/admin/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: stu.id,
          studentEmail: stu.email,
        }),
      });
    } catch (e) {
      console.warn('API delete error:', e);
    }

    setStudents((prev) =>
      prev.filter(
        (s) =>
          s.id !== stu.id &&
          (!stu.email || (s.email || '').toLowerCase().trim() !== (stu.email || '').toLowerCase().trim())
      )
    );

    // Clean local storage lists
    try {
      const cleanEmail = (stu.email || '').toLowerCase().trim();
      const adminListRaw = localStorage.getItem('adminStudentList');
      if (adminListRaw) {
        const list = JSON.parse(adminListRaw);
        if (Array.isArray(list)) {
          const filtered = list.filter(
            (s: any) =>
              s.id !== stu.id &&
              (!cleanEmail || (s.email || '').toLowerCase().trim() !== cleanEmail)
          );
          localStorage.setItem('adminStudentList', JSON.stringify(filtered));
        }
      }
      const cachedStr = localStorage.getItem('ahsora_cached_admin_students');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        if (Array.isArray(list)) {
          const filtered = list.filter(
            (s: any) =>
              s.id !== stu.id &&
              (!cleanEmail || (s.email || '').toLowerCase().trim() !== cleanEmail)
          );
          localStorage.setItem('ahsora_cached_admin_students', JSON.stringify(filtered));
        }
      }
    } catch (e) {}

    setDeletingId(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ahsora_student_updated'));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    // 1. One-time clean out of legacy mock/placeholder accounts from client storage
    if (typeof window !== 'undefined') {
      try {
        if (localStorage.getItem('ahsora_cleanup_v7') !== 'true') {
          localStorage.removeItem('adminStudentList');
          localStorage.removeItem('ahsora_cached_admin_students');
          localStorage.setItem('ahsora_cleanup_v7', 'true');
        }
      } catch (e) { }
    }

    try {
      const res = await fetch(`/api/admin/students?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.students) && json.students.length > 0) {
          setStudents(json.students);
          setLoading(false);
          return;
        }
      }
    } catch {}

    try {
      const localRaw = localStorage.getItem('adminStudentList');
      if (localRaw) {
        setStudents(JSON.parse(localRaw));
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            Enrolled Students & Cohort Directory
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Live synced student profiles, packages, contact details, and enrollment status.
          </p>
        </div>
        <button
          onClick={loadStudents}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            backgroundColor: '#FFFFFF',
            color: '#334155',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
          Loading synced student records...
        </div>
      ) : students.length === 0 ? (
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '48px', textAlign: 'center', color: '#64748B' }}>
          No enrolled students found yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {students.map((stu) => {
            const name = stu.full_name || stu.fullName || `${stu.firstName || ''} ${stu.lastName || ''}`.trim() || 'Student';
            const pkg = stu.selected_package || stu.selectedPackage || 'Ahsora IMAT Ascend';
            const price = stu.package_price || stu.packagePrice || '';
            const country = stu.country || '—';
            const address = stu.address || '—';
            const phone = stu.whatsapp_number || stu.whatsappNumber || stu.phone || '—';
            const isApproved = Boolean(stu.payment_approved ?? stu.paymentApproved);

            return (
              <div
                key={stu.id || stu.email}
                className="card"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#F0FFF4',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.125rem',
                      flexShrink: 0,
                    }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                      {name}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '6px' }}>
                      {stu.email} {stu.ama_id ? `• ID: ${stu.ama_id}` : ''}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.8rem', color: '#475569' }}>
                      {(() => {
                        const isElite = pkg.toLowerCase().includes('elite');
                        const isMastery = pkg.toLowerCase().includes('mastery');
                        return (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: isElite ? '#FFF7ED' : isMastery ? '#F0FFF4' : '#F0F9FF',
                              border: `1px solid ${isElite ? '#FED7AA' : isMastery ? '#BBF7D0' : '#BAE6FD'}`,
                              color: isElite ? '#C2410C' : isMastery ? '#047857' : '#0369A1',
                              fontWeight: 700,
                            }}
                          >
                            <Package size={13} color={isElite ? '#EA580C' : isMastery ? '#059669' : '#0284C7'} />
                            <span>{pkg}</span> {price ? <span style={{ opacity: 0.85 }}>({price})</span> : ''}
                          </span>
                        );
                      })()}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={13} color="#64748B" /> {country}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="#EA580C" /> {address}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} color="#059669" /> {phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isApproved ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#F0FDF4',
                        color: '#16A34A',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                      }}
                    >
                      <CheckCircle2 size={14} /> Active
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#FFFBEB',
                        color: '#D97706',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                      }}
                    >
                      <Clock size={14} /> Pending Approval
                    </span>
                  )}

                  <button
                    onClick={() => deleteStudent(stu)}
                    disabled={deletingId === (stu.id || stu.email)}
                    title="Permanently delete student from list and database"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #FECACA',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: deletingId === (stu.id || stu.email) ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#DC2626';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEF2F2';
                      e.currentTarget.style.color = '#DC2626';
                    }}
                  >
                    <Trash2 size={13} /> {deletingId === (stu.id || stu.email) ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
