'use client';

import React, { useEffect, useState } from 'react';
import { Globe, MapPin, Phone, Package, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

export default function StaffStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/students?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.students)) {
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
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Package size={13} color="#059669" /> <strong>{pkg}</strong> {price ? `(${price})` : ''}
                      </span>
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

                <div>
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
