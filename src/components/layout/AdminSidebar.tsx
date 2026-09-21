'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  KanbanSquare,
  GraduationCap,
  FolderCheck,
  BookOpenCheck,
  Database,
  FileSignature,
  Building2,
  Plane,
  History,
  ShieldCheck,
  LogOut,
  Calendar,
  Video,
  Library,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

import Logo from '@/components/brand/Logo';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { currentRole, staffAccounts, staffQuestions, setAdminLoggedIn } = useAppStore();

  const pendingCount = staffAccounts ? staffAccounts.filter((a) => a.status === 'pending').length : 0;
  const pendingMcqCount = staffQuestions ? staffQuestions.filter((q) => q.status === 'in_review').length : 0;

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/admin/students', label: 'Student Management', icon: <GraduationCap size={18} /> },
    { href: '/admin/staff-requests', label: `Faculty Requests ${pendingCount > 0 ? `(${pendingCount})` : ''}`, icon: <ShieldCheck size={18} />, badge: pendingCount },
    { href: '/admin/question-bank/review', label: `MCQ Approvals ${pendingMcqCount > 0 ? `(${pendingMcqCount})` : ''}`, icon: <FolderCheck size={18} />, badge: pendingMcqCount },
    { href: '/admin/tests', label: 'Mock Tests', icon: <BookOpenCheck size={18} /> },
    { href: '/admin/question-bank', label: 'Question Bank', icon: <Database size={18} /> },
    { href: '/admin/learn/schedule', label: 'Schedule Manager', icon: <Calendar size={18} /> },
    { href: '/admin/learn/lectures', label: 'Video Lectures', icon: <Video size={18} /> },
    { href: '/admin/learn/library', label: 'Library Resources', icon: <Library size={18} /> },
    { href: '/admin/content', label: 'Website Content', icon: <FileSignature size={18} /> },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Logo height={48} />
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '0 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
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
                color: isActive ? '#FFFFFF' : '#94A3B8',
                backgroundColor: isActive ? '#2563EB' : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ color: isActive ? '#FFFFFF' : '#64748B' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => setAdminLoggedIn(false)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FCA5A5',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <LogOut size={16} />
          <span>Log Out Admin Workspace</span>
        </button>
      </div>
    </aside>
  );
}
