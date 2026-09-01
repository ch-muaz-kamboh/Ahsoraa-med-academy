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

export default function AdminSidebar() {
  const pathname = usePathname();
  const { currentRole } = useAppStore();

  const links = [
    { href: '/admin/dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/admin/leads', label: 'CRM Leads & Pipeline', icon: <KanbanSquare size={18} /> },
    { href: '/admin/applications', label: 'Admissions Cases', icon: <GraduationCap size={18} /> },
    { href: '/admin/documents', label: 'Document Approvals', icon: <FolderCheck size={18} /> },
    { href: '/admin/courses', label: 'Courses & Pricing', icon: <BookOpenCheck size={18} /> },
    { href: '/admin/tests', label: 'Test & Question Bank', icon: <FileSignature size={18} /> },
    { href: '/admin/universities', label: 'University Database', icon: <Building2 size={18} /> },
    { href: '/admin/visa', label: 'Visa Operations', icon: <Plane size={18} /> },
    { href: '/admin/audit-logs', label: 'Compliance Audit Logs', icon: <History size={18} /> },
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
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/logo.png"
            alt="Ahsora Meds Academy"
            style={{
              height: '34px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>
            AHSORA <span style={{ color: '#60A5FA' }}>OPS</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 600 }}>
            Staff & Admin Platform
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div style={{ padding: '16px' }}>
        <div
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '8px',
            padding: '8px 12px',
            border: '1px solid #334155',
            fontSize: '0.75rem',
          }}
        >
          <span style={{ color: '#94A3B8' }}>Active Access: </span>
          <strong style={{ color: '#38BDF8', textTransform: 'uppercase' }}>
            {currentRole.replace('_', ' ')}
          </strong>
        </div>
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
