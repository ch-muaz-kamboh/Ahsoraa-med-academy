'use client';

import React, { useState, useEffect } from 'react';
import PortalSidebar from '@/components/layout/PortalSidebar';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Bell, Lock, Mail, User, Eye, EyeOff, Check, Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';

import Logo from '@/components/brand/Logo';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { studentLoggedIn, loginStudent, logoutStudent, liveTestSession } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Real User State
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
    setLoginEmail('');
    setLoginPassword('');
    setError('');
  };

  useEffect(() => {
    if (studentLoggedIn) {
      const fetchUser = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .single();

          if (profile && profile.full_name) {
            const fullName = profile.full_name;
            const fName = fullName.split(' ')[0];
            const inits = fullName.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || 'ST';
            setRealUser({ fullName, firstName: fName, initials: inits });
          }
        }
      };
      fetchUser();
    } else {
      setRealUser(null);
    }
  }, [studentLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please fill in both Email and Password fields.');
      return;
    }

    setAuthLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data, error: sbError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (!sbError && data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', data.user.id)
          .single();

        const fullName = profile?.full_name || data.user.user_metadata?.full_name || loginEmail.split('@')[0];
        const fName = fullName.split(' ')[0] || 'Student';
        const inits = fullName.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || 'ST';
        setRealUser({ fullName, firstName: fName, initials: inits });
        loginStudent(loginEmail);
        setAuthLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Supabase login fallback:', err);
    }

    // Demo login fallback: update store and realUser to the credentials entered
    loginStudent(loginEmail);
    const rawUsername = loginEmail.split('@')[0] || 'Student';
    const parts = rawUsername.split(/[._-]/);
    const fName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Student';
    const lName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
    const fullName = `${fName} ${lName}`.trim();
    const inits = `${fName[0] || 'S'}${lName[0] || 'T'}`.toUpperCase();

    setRealUser({ fullName, firstName: fName, initials: inits });
    setAuthLoading(false);
  };

  if (!studentLoggedIn) {
    return (
      <div style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #EEF2F6 0%, #E2E8F0 100%)',
        padding: '40px 20px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '520px',
          padding: '40px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Top Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)'
          }} />

          {/* Logo / Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Logo height={72} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Student Portal Sign In
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '6px' }}>
              Access your courses, mock test engine, and visa roadmap
            </p>
          </div>
          {/* Unified Student Portal Login Form */}
          {error && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                />
                <Mail size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                />
                <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: 2
                  }}
                >
                  {showPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
              <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} color="#2563EB" /> Demo & Live Access
              </span>
              <span style={{ color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}>Forgot Password?</span>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                justifyContent: 'center',
                fontSize: '0.9375rem',
                fontWeight: 700,
                borderRadius: '10px',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {authLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <User size={18} />}
              <span>Sign In to Student Portal</span>
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#64748B', marginTop: '8px', lineHeight: '1.4' }}>
              Enter your student email and password to log in or start learning instantly.
            </p>
          </form>
        </div>
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
