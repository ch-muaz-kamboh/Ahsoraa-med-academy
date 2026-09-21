'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ShieldCheck, UserCheck, UserX, Clock, Mail, BookOpen, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { StaffAccountStatus } from '@/types';

export default function AdminStaffRequestsPage() {
  const { staffAccounts, approveStaffAccount, declineStaffAccount } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<StaffAccountStatus | 'all'>('all');

  const pendingCount = staffAccounts.filter((a) => a.status === 'pending').length;

  const filteredAccounts = staffAccounts.filter((acc) => {
    if (filterStatus === 'all') return true;
    return acc.status === filterStatus;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
            <ShieldCheck size={14} />
            <span>Governance & Access Management</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0' }}>
            Faculty & Staff Access Approvals
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: 0 }}>
            Review pending sign-up requests from teachers and academic staff. Approve credentials or revoke access at any time.
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
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
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
          filteredAccounts.map((account) => (
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px' }}>
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
                    <span>• Role: <strong style={{ color: '#0F172A' }}>{account.role.toUpperCase().replace('_', ' ')}</strong></span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '6px' }}>
                    Assigned Subjects: <strong>{account.assignedSubjects.join(', ')}</strong> | Cohorts: <strong>{account.assignedCohorts.join(' & ')}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
          ))
        )}
      </div>
    </div>
  );
}
