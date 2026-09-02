'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, XCircle, Clock, Search, RefreshCw, User } from 'lucide-react';

interface StudentProfile {
  id: string;
  ama_id: string;
  full_name: string;
  email: string;
  payment_approved: boolean;
  created_at: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setStudents(data as StudentProfile[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const toggleApproval = async (studentId: string, currentStatus: boolean) => {
    setUpdating(studentId);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ payment_approved: !currentStatus })
      .eq('id', studentId);

    if (!error) {
      setStudents(prev =>
        prev.map(s => s.id === studentId ? { ...s, payment_approved: !currentStatus } : s)
      );
    }
    setUpdating(null);
  };

  const filtered = students.filter(s =>
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.ama_id?.toLowerCase().includes(search.toLowerCase())
  );

  const approvedCount = students.filter(s => s.payment_approved).length;
  const pendingCount = students.filter(s => !s.payment_approved).length;

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          Student Management
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Manage student registrations and payment approvals.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Students', value: students.length, color: '#0F172A', bg: '#F8FAFC' },
          { label: 'Approved', value: approvedCount, color: '#16A34A', bg: '#F0FFF4' },
          { label: 'Pending Payment', value: pendingCount, color: '#D97706', bg: '#FFFBEB' },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: stat.bg, border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px 24px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Refresh */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name, email, or AMA ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '11px 16px 11px 42px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.9375rem', backgroundColor: '#FFF' }}
          />
        </div>
        <button onClick={fetchStudents} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.9375rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>Loading students...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <User size={40} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
            <div style={{ color: '#64748B', fontWeight: 500 }}>No students found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Student ID', 'Full Name', 'Email', 'Registered', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => (
                <tr key={student.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#22C55E', fontSize: '0.875rem', backgroundColor: '#F0FFF4', padding: '4px 10px', borderRadius: '8px' }}>
                      {student.ama_id || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0F172A' }}>{student.full_name || '—'}</td>
                  <td style={{ padding: '16px 20px', color: '#64748B', fontSize: '0.875rem' }}>{student.email || '—'}</td>
                  <td style={{ padding: '16px 20px', color: '#94A3B8', fontSize: '0.8125rem' }}>
                    {new Date(student.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {student.payment_approved ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#F0FFF4', color: '#16A34A', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
                        <CheckCircle2 size={13} /> Approved
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#FFFBEB', color: '#D97706', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
                        <Clock size={13} /> Pending
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      disabled={updating === student.id}
                      onClick={() => toggleApproval(student.id, student.payment_approved)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: updating === student.id ? 'not-allowed' : 'pointer',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        backgroundColor: student.payment_approved ? '#FEF2F2' : '#F0FFF4',
                        color: student.payment_approved ? '#DC2626' : '#16A34A',
                        opacity: updating === student.id ? 0.6 : 1,
                        display: 'inline-flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      {updating === student.id ? 'Saving...' : (
                        student.payment_approved ? (
                          <><XCircle size={14} /> Revoke</>
                        ) : (
                          <><CheckCircle2 size={14} /> Approve</>
                        )
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
