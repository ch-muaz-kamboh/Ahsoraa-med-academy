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
  FileSignature,
  Building2,
  Plane,
  History,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

import Logo from '@/components/brand/Logo';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { currentRole } = useAppStore();

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/admin/students', label: 'Student Management', icon: <GraduationCap size={18} /> },
    { href: '/admin/tests', label: 'Tests', icon: <BookOpenCheck size={18} /> },
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
      <div style={{ padding: '16px', borderTop: '1px solid #1E293B' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#94A3B8',
          }}
        >
          <LogOut size={16} />
          <span>Exit to Public Portal</span>
        </Link>
      </div>
    </aside>
  );
}
