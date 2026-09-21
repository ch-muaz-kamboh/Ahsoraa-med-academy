'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import StaffSidebar from '@/components/layout/StaffSidebar';
import { useAppStore } from '@/lib/store';
import { Shield, BookOpen, AlertCircle, Bell, LogOut } from 'lucide-react';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { staffProfile, staffLoggedIn, logoutStaffAccount } = useAppStore();

  const isAuthPage = pathname === '/staff/auth';

  useEffect(() => {
    if (!isAuthPage && (!staffLoggedIn || staffProfile.status !== 'approved')) {
      router.replace('/staff/auth');
    }
  }, [staffLoggedIn, staffProfile, isAuthPage, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!staffLoggedIn || staffProfile.status !== 'approved') {
    return null;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <StaffSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Staff Navigation Header */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
              Ahsora Academic Staff Portal
            </span>
            <span
              style={{
                backgroundColor: staffProfile.role === 'teacher' ? '#ECFDF5' : '#EFF6FF',
                color: staffProfile.role === 'teacher' ? '#059669' : '#2563EB',
                border: staffProfile.role === 'teacher' ? '1px solid #A7F3D0' : '1px solid #BFDBFE',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Shield size={12} />
              {staffProfile.role.toUpperCase().replace('_', ' ')} MODE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#2563EB" />
              <span>Assigned Subjects: <strong style={{ color: '#0F172A' }}>{staffProfile.assignedSubjects.join(', ')}</strong></span>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              {staffProfile.displayName.charAt(0)}
            </div>
            <button
              onClick={() => {
                logoutStaffAccount();
                router.push('/staff/auth');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FCA5A5',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content View */}
        <main style={{ flex: 1, padding: '32px' }}>{children}</main>
      </div>
    </div>
  );
}
