'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  HelpCircle,
  BookOpen,
  FileCheck2,
  Users,
  CheckSquare,
  UserCheck,
  ShieldAlert,
  LogOut,
  Sparkles,
  Layers,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { useAppStore } from '@/lib/store';
import { StaffRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: StaffRole[];
  badge?: string;
}

export default function StaffSidebar() {
  const pathname = usePathname();
  const { staffProfile, setStaffRole } = useAppStore();

  const navItems: NavItem[] = [
    {
      label: 'Staff Dashboard',
      href: '/staff/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'My Schedule & Live',
      href: '/staff/schedule',
      icon: <Calendar size={18} />,
      badge: 'Live',
    },
    {
      label: 'Question Bank',
      href: '/staff/question-bank',
      icon: <BookOpen size={18} />,
      badge: 'Drafts',
    },
    {
      label: 'Assessments & Snapshots',
      href: '/staff/assessments',
      icon: <FileCheck2 size={18} />,
    },
    {
      label: 'My Students',
      href: '/staff/students',
      icon: <Users size={18} />,
    },
    {
      label: 'Mark Attendance',
      href: '/staff/attendance',
      icon: <CheckSquare size={18} />,
    },
    {
      label: 'Student Doubts',
      href: '/staff/doubts',
      icon: <HelpCircle size={18} />,
      badge: 'Desk',
    },
    {
      label: 'My Staff Profile',
      href: '/staff/profile',
      icon: <UserCheck size={18} />,
    },
  ];

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
          <span>FACULTY WORKSPACE V1</span>
        </div>
      </div>

      {/* Role Scoping Switcher */}
      <div style={{ padding: '14px 20px', backgroundColor: '#1E293B', borderBottom: '1px solid #334155' }}>
        <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94A3B8', marginBottom: '6px' }}>
          Active Role Scope
        </div>
        <select
          value={staffProfile.role}
          onChange={(e) => setStaffRole(e.target.value as StaffRole)}
          style={{
            width: '100%',
            backgroundColor: '#0F172A',
            color: '#38BDF8',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <option value="teacher">👨‍🏫 Teacher (Scoped)</option>
          <option value="academic_admin">🎓 Academic Admin</option>
          <option value="super_admin">⚡ Super Admin</option>
          <option value="admissions_staff">📋 Admissions Staff</option>
        </select>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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
          {staffProfile.displayName}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '10px' }}>
          {staffProfile.email}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            href="/admin/dashboard"
            style={{
              flex: 1,
              textAlign: 'center',
              backgroundColor: '#1E293B',
              color: '#CBD5E1',
              padding: '6px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Admin Ops →
          </Link>
        </div>
      </div>
    </aside>
  );
}
