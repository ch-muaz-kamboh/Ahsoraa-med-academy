'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/types';
import Link from 'next/link';
import { Shield, GraduationCap, Users, UserCheck, Eye } from 'lucide-react';

export default function RoleSwitcherBar() {
  const { currentRole, setRole, currentUser } = useAppStore();

  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'student', label: 'Student View', icon: <GraduationCap size={14} /> },
    { role: 'admin', label: 'Admin Ops View', icon: <Shield size={14} /> },
    { role: 'counsellor', label: 'Counsellor View', icon: <UserCheck size={14} /> },
    { role: 'faculty', label: 'Mentor View', icon: <Users size={14} /> },
    { role: 'visitor', label: 'Guest Visitor', icon: <Eye size={14} /> },
  ];

  return (
    <aside aria-label="Interactive Demo Bar" style={{
      backgroundColor: '#1E293B',
      color: '#FFFFFF',
      fontSize: '0.8125rem',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
      borderBottom: '1px solid #334155',
      zIndex: 100,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          backgroundColor: '#2563EB',
          color: '#FFFFFF',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          letterSpacing: '0.5px'
        }}>
          AHSORA LIVE PREVIEW
        </span>
        <span style={{ color: '#94A3B8' }}>
          Active Persona: <strong style={{ color: '#FFFFFF' }}>{currentUser.firstName} ({currentRole.toUpperCase()})</strong>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ color: '#94A3B8', fontSize: '0.75rem', marginRight: '4px' }}>Switch Role:</span>
        {roles.map((item) => {
          const isActive = currentRole === item.role;
          return (
            <button
              key={item.role}
              onClick={() => setRole(item.role)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: isActive ? '#2563EB' : '#334155',
                color: isActive ? '#FFFFFF' : '#CBD5E1',
                transition: 'all 0.15s ease',
                border: isActive ? '1px solid #60A5FA' : '1px solid transparent'
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}

        <div style={{ borderLeft: '1px solid #475569', paddingLeft: '8px', display: 'flex', gap: '6px' }}>
          <Link
            href="/portal/dashboard"
            style={{
              fontSize: '0.75rem',
              color: '#93C5FD',
              textDecoration: 'underline',
              padding: '2px 6px'
            }}
          >
            Portal Dashboard →
          </Link>
          <Link
            href="/admin/dashboard"
            style={{
              fontSize: '0.75rem',
              color: '#FCD34D',
              textDecoration: 'underline',
              padding: '2px 6px'
            }}
          >
            Admin Panel →
          </Link>
        </div>
      </div>
    </aside>
  );
}
