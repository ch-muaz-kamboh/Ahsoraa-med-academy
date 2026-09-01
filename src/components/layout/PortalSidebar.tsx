'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  Users2,
  HelpCircle,
  FolderLock,
  Globe2,
  Receipt,
  LogOut,
  GraduationCap,
  PlaneTakeoff,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import Logo from '@/components/brand/Logo';

export default function PortalSidebar() {
  const pathname = usePathname();
  const { currentRole, setRole, currentUser } = useAppStore();

  const links = [
    { href: '/portal/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/portal/courses', label: 'My Courses & LMS', icon: <BookOpen size={18} /> },
    { href: '/portal/tests', label: 'CBT Mock Tests', icon: <FileCheck2 size={18} /> },
    { href: '/portal/mentorship', label: 'Doctor Mentorship', icon: <Users2 size={18} /> },
    { href: '/portal/doubts', label: '1-on-1 Doubt Clearing', icon: <HelpCircle size={18} /> },
    { href: '/portal/documents', label: 'Document Legalization', icon: <FolderLock size={18} /> },
    { href: '/portal/applications', label: 'University Applications', icon: <Globe2 size={18} /> },
    { href: '/portal/visa', label: 'Visa & Embassy Roadmap', icon: <PlaneTakeoff size={18} /> },
    { href: '/portal/billing', label: 'Tuition & Billing', icon: <Receipt size={18} /> },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <Link
        href="/portal/dashboard"
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
        }}
      >
        <Logo height={38} />
      </Link>

      {/* User Badge */}
      <div
        style={{
          margin: '16px 16px 8px 16px',
          padding: '12px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#DBEAFE',
            color: '#1D4ED8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          {currentUser.firstName[0]}
          {currentUser.lastName[0]}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {currentUser.firstName} {currentUser.lastName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
            ● Enrolled Student
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/portal/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#2563EB' : '#475569',
                backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ color: isActive ? '#2563EB' : '#64748B' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Back to Public */}
      <div style={{ padding: '16px', borderTop: '1px solid #F1F5F9' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#64748B',
            fontWeight: 500,
          }}
        >
          <LogOut size={16} />
          <span>Exit to Public Site</span>
        </Link>
      </div>
    </aside>
  );
}
