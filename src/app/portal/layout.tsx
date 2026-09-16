'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PortalSidebar from '@/components/layout/PortalSidebar';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Bell, Lock, Mail, User, Eye, EyeOff, Check, Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';

import Logo from '@/components/brand/Logo';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { studentLoggedIn, loginStudent, logoutStudent, liveTestSession } = useAppStore();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [realUser, setRealUser] = useState<{ fullName: string, firstName: string, initials: string } | null>(null);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    setRealUser(null);
    logoutStudent();
    router.push('/login');
  };

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (!studentLoggedIn) {
            loginStudent(user.email || 'student@example.com');
          }
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .maybeSingle();

          const fullName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';
          const fName = fullName.split(' ')[0] || 'Student';
          const inits = fullName.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || 'ST';
          if (isMounted) setRealUser({ fullName, firstName: fName, initials: inits });
        } else if (!studentLoggedIn) {
          if (isMounted) setRealUser(null);
        }
      } catch (e) {
        console.error('Error fetching Supabase user in PortalLayout:', e);
      } finally {
        if (isMounted) setCheckingAuth(false);
      }
    };
    fetchUser();
    return () => { isMounted = false; };
  }, [studentLoggedIn, loginStudent]);

  useEffect(() => {
    if (!checkingAuth && !studentLoggedIn) {
      router.push('/login');
    }
  }, [checkingAuth, studentLoggedIn, router]);

  if (checkingAuth || !studentLoggedIn) {
    return (
      <div style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC'
      }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#2563EB' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar */}
      <PortalSidebar 
        userFullName={realUser?.fullName || 'Loading...'} 
        userInitials={realUser?.initials || ''} 
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
              Welcome back, <span style={{ color: '#2563EB' }}>{realUser ? realUser.firstName : 'Student'}!</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Bell size={18} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                {realUser ? realUser.initials : 'ST'}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #FECACA',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Sign out of student portal"
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Live Broadcast Exam Alert for All Students */}
        {liveTestSession?.isLive && (
          <div
            style={{
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              padding: '16px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
              position: 'sticky',
              top: '64px',
              zIndex: 25,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#DC2626',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                🚨 MANDATORY LIVE EXAM
              </span>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{liveTestSession.testTitle}</strong>
                <span style={{ fontSize: '0.8125rem', opacity: 0.9, marginLeft: '8px' }}>
                  Started by Administrator • Participation is required for all active students!
                </span>
              </div>
            </div>

            <Link
              href={`/portal/tests/${liveTestSession.testId}/take`}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#DC2626',
                fontWeight: 800,
                fontSize: '0.875rem',
                padding: '8px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Join Live Exam Now →</span>
            </Link>
          </div>
        )}

        {/* Page Content */}
        <div style={{ padding: '32px 28px', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
