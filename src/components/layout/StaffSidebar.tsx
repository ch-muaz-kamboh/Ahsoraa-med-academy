'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  HelpCircle,
  BookOpen,
  FileCheck2,
  Users,
  CheckSquare,
  UserCheck,
  Sparkles,
  LogOut,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { useAppStore } from '@/lib/store';
import { StaffPermission } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: StaffPermission;
  badge?: string;
}

export default function StaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { staffProfile, logoutStaffAccount } = useAppStore();

  const userPermissions: StaffPermission[] = staffProfile.permissions || [
    'schedule',
    'question_bank',
    'doubts',
    'assessments',
    'students',
    'attendance',
  ];

  const allPossibleNavItems: NavItem[] = [
    {
      label: 'Staff Dashboard',
      href: '/staff/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'My Schedule & Live',
      href: '/staff/schedule',
      icon: <Calendar size={18} />,
      permission: 'schedule',
      badge: 'Live',
    },
    {
      label: 'Question Bank',
      href: '/staff/question-bank',
      icon: <BookOpen size={18} />,
      permission: 'question_bank',
      badge: 'Drafts',
    },
    {
      label: 'Student Doubts',
      href: '/staff/doubts',
      icon: <HelpCircle size={18} />,
      permission: 'doubts',
      badge: 'Desk',
    },
    {
      label: 'Assessments & Snapshots',
      href: '/staff/assessments',
      icon: <FileCheck2 size={18} />,
      permission: 'assessments',
    },
    {
      label: 'My Students',
      href: '/staff/students',
      icon: <Users size={18} />,
      permission: 'students',
    },
    {
      label: 'Mark Attendance',
      href: '/staff/attendance',
      icon: <CheckSquare size={18} />,
      permission: 'attendance',
    },
    {
      label: 'Student Applications',
      href: '/admin/applications',
      icon: <FileCheck2 size={18} />,
      permission: 'applications',
    },
    {
      label: 'Lead CRM Management',
      href: '/admin/leads',
      icon: <Users size={18} />,
      permission: 'leads',
    },
    {
      label: 'Visa & Enrolment',
      href: '/admin/visa',
      icon: <UserCheck size={18} />,
      permission: 'visa',
    },
    {
      label: 'My Staff Profile',
      href: '/staff/profile',
      icon: <UserCheck size={18} />,
    },
  ];

  // Filter items based on active staff permissions
  const navItems = allPossibleNavItems.filter((item) => {
    if (!item.permission) return true; // Always show Dashboard and Profile
    return userPermissions.includes(item.permission);
  });

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        borderRight: '1px solid #1E293B',
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #1E293B' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
          <Logo height={48} variant="dark" />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
          <Sparkles size={14} />
          <span>STAFF WORKSPACE</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/staff/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : '#94A3B8',
                backgroundColor: isActive ? '#2563EB' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: isActive ? '#FFFFFF' : '#38BDF8' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  style={{
                    backgroundColor: isActive ? '#1D4ED8' : '#1E293B',
                    color: isActive ? '#FFFFFF' : '#38BDF8',
                    fontSize: '0.6875rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 600,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Staff User Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1E293B', backgroundColor: '#090D16' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {staffProfile.displayName || 'Staff User'}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {staffProfile.email || 'staff@ahsorameds.com'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => {
              logoutStaffAccount();
              router.push('/staff/auth');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FCA5A5',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <LogOut size={14} /> Log Out Staff Workspace
          </button>
        </div>
      </div>
    </aside>
  );
}
