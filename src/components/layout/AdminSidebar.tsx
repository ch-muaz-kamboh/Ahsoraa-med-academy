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
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

import Logo from '@/components/brand/Logo';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { currentRole, staffAccounts, staffQuestions, setAdminLoggedIn } = useAppStore();

  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('ahsora_admin_sidebar_collapsed');
      if (saved === 'true') setCollapsed(true);
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ahsora_admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const pendingCount = staffAccounts ? staffAccounts.filter((a) => a.status === 'pending').length : 0;
  const pendingMcqCount = staffQuestions ? staffQuestions.filter((q) => q.status === 'in_review').length : 0;

  const [unreadInquiries, setUnreadInquiries] = React.useState<number>(0);
  React.useEffect(() => {
    const checkCount = () => {
      try {
        const saved = localStorage.getItem('ahsora_contact_inquiries');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUnreadInquiries(parsed.filter((p: any) => p.status === 'new').length);
        }
      } catch {}
    };
    checkCount();
    window.addEventListener('ahsora_contact_updated', checkCount);
    window.addEventListener('storage', checkCount);
    return () => {
      window.removeEventListener('ahsora_contact_updated', checkCount);
      window.removeEventListener('storage', checkCount);
    };
  }, []);

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/admin/leads', label: `Leads & Inquiries ${unreadInquiries > 0 ? `(${unreadInquiries})` : ''}`, icon: <KanbanSquare size={18} /> },
    { href: '/admin/students', label: 'Student Management', icon: <GraduationCap size={18} /> },
    { href: '/admin/staff-requests', label: `Faculty Requests ${pendingCount > 0 ? `(${pendingCount})` : ''}`, icon: <ShieldCheck size={18} />, badge: pendingCount },
    { href: '/admin/question-bank/review', label: `MCQ Approvals ${pendingMcqCount > 0 ? `(${pendingMcqCount})` : ''}`, icon: <FolderCheck size={18} />, badge: pendingMcqCount },
    { href: '/admin/tests', label: 'Mock Tests', icon: <BookOpenCheck size={18} /> },
    { href: '/admin/question-bank', label: 'Question Bank', icon: <Database size={18} /> },
    { href: '/admin/learn/schedule', label: 'Schedule Manager', icon: <Calendar size={18} /> },
    { href: '/admin/learn/lectures', label: 'Video Lectures', icon: <Video size={18} /> },
    { href: '/admin/learn/library', label: 'Library Resources', icon: <Library size={18} /> },
    { href: '/admin/content', label: 'CMS & Website Manager', icon: <FileSignature size={18} /> },
  ];

  return (
    <aside
      style={{
        width: collapsed ? '76px' : '260px',
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
      }}
    >
      {/* Brand Header + Retract Toggle */}
      <div
        style={{
          padding: collapsed ? '18px 12px' : '20px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: '10px',
        }}
      >
        {!collapsed && <Logo height={40} variant="white" />}
        <button
          onClick={toggleSidebar}
          title={collapsed ? 'Expand Sidebar' : 'Minimize / Retract Sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#1E293B',
            color: '#E2E8F0',
            border: '1px solid #334155',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: collapsed ? '12px 8px' : '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: '12px',
                padding: collapsed ? '12px 0' : '10px 14px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : '#94A3B8',
                backgroundColor: isActive ? '#059669' : 'transparent',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <span style={{ color: isActive ? '#FFFFFF' : '#64748B', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
              {collapsed && item.badge && item.badge > 0 ? (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '10px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                  }}
                />
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: collapsed ? '12px 8px' : '16px', borderTop: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={toggleSidebar}
          title={collapsed ? 'Expand Sidebar' : 'Minimize Sidebar'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '9px 12px',
            borderRadius: '8px',
            backgroundColor: '#1E293B',
            color: '#94A3B8',
            border: '1px solid #334155',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Retract Sidebar</span>}
        </button>

        <button
          onClick={() => setAdminLoggedIn(false)}
          title="Log Out Admin Workspace"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: collapsed ? '10px 0' : '10px 14px',
            borderRadius: '8px',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FCA5A5',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <LogOut size={16} />
          {!collapsed && <span>Log Out Admin Workspace</span>}
        </button>
      </div>
    </aside>
  );
}
