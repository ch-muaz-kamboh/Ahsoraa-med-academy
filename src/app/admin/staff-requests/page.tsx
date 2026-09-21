'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ShieldCheck, UserCheck, UserX, Clock, Mail, CheckCircle2, Shield, Settings, Key, Check } from 'lucide-react';
import { StaffAccountStatus, ALL_STAFF_PERMISSIONS, StaffPermission } from '@/types';

export default function AdminStaffRequestsPage() {
  const { staffAccounts, approveStaffAccount, declineStaffAccount, updateStaffPermissions } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<StaffAccountStatus | 'all'>('all');

  // Permission modal state
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<StaffPermission[]>([]);
  const [toastMsg, setToastMsg] = useState('');

  const pendingCount = staffAccounts.filter((a) => a.status === 'pending').length;

  const filteredAccounts = staffAccounts.filter((acc) => {
    if (filterStatus === 'all') return true;
    return acc.status === filterStatus;
  });

  const editingStaff = staffAccounts.find((a) => a.id === editingStaffId);

  const handleOpenPermissionsModal = (staffId: string) => {
    const acc = staffAccounts.find((a) => a.id === staffId);
    if (acc) {
      setEditingStaffId(staffId);
      setSelectedPermissions(
        acc.permissions || ['schedule', 'question_bank', 'doubts', 'assessments', 'students', 'attendance']
      );
    }
  };

  const handleTogglePermission = (permKey: StaffPermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  const handleSavePermissions = () => {
    if (!editingStaffId) return;
    updateStaffPermissions(editingStaffId, selectedPermissions);
    setEditingStaffId(null);
    setToastMsg('Staff permissions updated successfully!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#0F172A', color: '#FFF',
          padding: '12px 20px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 999,
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '28px 32px',
          borderRadius: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
            <ShieldCheck size={14} />
            <span>Governance & Granular Permission Control</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0' }}>
            Faculty & Staff Access Management
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: 0 }}>
            Approve sign-up requests and grant or revoke access permissions for specific portal modules at any time.
          </p>
        </div>

        {pendingCount > 0 && (
          <div
            style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #F59E0B',
              borderRadius: '12px',
              padding: '12px 20px',
              color: '#78350F',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Clock size={20} color="#D97706" />
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#92400E' }}>
                {pendingCount} Pending Request{pendingCount > 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: '0.75rem' }}>Requires Admin Verification</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: `All Staff (${staffAccounts.length})` },
          { id: 'pending', label: `Pending Approvals (${pendingCount})` },
          { id: 'approved', label: `Approved (${staffAccounts.filter((a) => a.status === 'approved').length})` },
          { id: 'rejected', label: `Declined / Revoked (${staffAccounts.filter((a) => a.status === 'rejected').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: filterStatus === tab.id ? 700 : 500,
              backgroundColor: filterStatus === tab.id ? '#2563EB' : '#FFFFFF',
              color: filterStatus === tab.id ? '#FFFFFF' : '#64748B',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Staff Accounts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredAccounts.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#64748B', border: '1px solid #E2E8F0' }}>
            <UserCheck size={36} color="#94A3B8" style={{ marginBottom: '8px' }} />
            <p style={{ margin: 0 }}>No faculty account requests found for this status filter.</p>
          </div>
        ) : (
          filteredAccounts.map((account) => {
            const activePermsCount = (account.permissions || ['schedule', 'question_bank', 'doubts', 'assessments', 'students', 'attendance']).length;

            return (
              <div
                key={account.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px', flex: 1 }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: account.status === 'approved' ? '#ECFDF5' : account.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                      color: account.status === 'approved' ? '#059669' : account.status === 'pending' ? '#D97706' : '#DC2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.125rem',
                      flexShrink: 0
                    }}
                  >
                    {account.displayName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        {account.displayName}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor:
                            account.status === 'approved'
                              ? '#D1FAE5'
                              : account.status === 'pending'
                              ? '#FEF3C7'
                              : '#FEE2E2',
                          color:
                            account.status === 'approved'
                              ? '#065F46'
                              : account.status === 'pending'
                              ? '#92400E'
                              : '#991B1B',
                        }}
                      >
                        {account.status ? account.status.toUpperCase() : 'APPROVED'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span><Mail size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> {account.email}</span>
                      <span>• Access Modules: <strong style={{ color: '#2563EB' }}>{activePermsCount} Enabled</strong></span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '6px' }}>
                      Assigned Subjects: <strong>{account.assignedSubjects.join(', ')}</strong> | Cohorts: <strong>{account.assignedCohorts.join(' & ')}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleOpenPermissionsModal(account.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#F8FAFC',
                      color: '#334155',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      border: '1px solid #CBD5E1',
                      cursor: 'pointer',
                    }}
                  >
                    <Settings size={16} /> Manage Permissions
                  </button>

                  {account.status !== 'approved' && (
                    <button
                      onClick={() => approveStaffAccount(account.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <UserCheck size={16} /> Approve Access
                    </button>
                  )}

                  {account.status !== 'rejected' && (
                    <button
                      onClick={() => declineStaffAccount(account.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <UserX size={16} /> {account.status === 'approved' ? 'Revoke Access' : 'Decline Request'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Permissions Control Modal */}
      {editingStaffId && editingStaff && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', maxWidth: '600px', width: '100%', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Manage Staff Options Access
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  User: <strong>{editingStaff.displayName}</strong> ({editingStaff.email})
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '20px', lineHeight: 1.5 }}>
              Select which portal options and feature modules this staff member is allowed to see and access:
            </p>

            {/* Permissions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {ALL_STAFF_PERMISSIONS.map((perm) => {
                const isChecked = selectedPermissions.includes(perm.key);
                return (
                  <label
                    key={perm.key}
                    onClick={() => handleTogglePermission(perm.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: isChecked ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      backgroundColor: isChecked ? '#EFF6FF' : '#F8FAFC',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // handled by parent onClick
                      style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: isChecked ? '#1E40AF' : '#0F172A' }}>
                        {perm.label}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                        {perm.description}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setEditingStaffId(null)}
                style={{ backgroundColor: '#F1F5F9', border: 'none', color: '#475569', padding: '10px 18px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                style={{ backgroundColor: '#2563EB', border: 'none', color: '#FFFFFF', padding: '10px 22px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={16} /> Save Access Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
