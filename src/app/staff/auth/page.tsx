'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Shield, Lock, Mail, User, BookOpen, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { StaffRole } from '@/types';
import Logo from '@/components/brand/Logo';

export default function StaffAuthPage() {
  const router = useRouter();
  const { loginStaffAccount, registerStaffAccount, staffLoggedIn } = useAppStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginStatusNotice, setLoginStatusNotice] = useState<'pending' | 'rejected' | null>(null);

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<StaffRole>('teacher');
  const [regSubjects, setRegSubjects] = useState('Biology, Biochemistry');
  const [regCohorts, setRegCohorts] = useState('IMAT 2026 Alpha Cohort');
  const [regSuccessMessage, setRegSuccessMessage] = useState('');
  const [regErrorMessage, setRegErrorMessage] = useState('');

  // Auto redirect if already logged in
  if (staffLoggedIn) {
    router.replace('/staff/dashboard');
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginStatusNotice(null);

    const result = loginStaffAccount(loginEmail, loginPassword);
    if (result.success) {
      router.push('/staff/dashboard');
    } else {
      if (result.status === 'pending') {
        setLoginStatusNotice('pending');
      } else if (result.status === 'rejected') {
        setLoginStatusNotice('rejected');
      } else {
        setLoginError(result.message);
      }
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccessMessage('');
    setRegErrorMessage('');

    const subjectsArr = regSubjects.split(',').map((s) => s.trim()).filter(Boolean);
    const cohortsArr = regCohorts.split(',').map((c) => c.trim()).filter(Boolean);

    const result = registerStaffAccount({
      email: regEmail,
      displayName: regName,
      accountType: 'staff',
      role: regRole,
      assignedSubjects: subjectsArr.length > 0 ? subjectsArr : ['Biology'],
      assignedCohorts: cohortsArr.length > 0 ? cohortsArr : ['IMAT 2026 Alpha Cohort'],
      password: regPassword,
    });

    if (result.success) {
      setRegSuccessMessage(result.message);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
    } else {
      setRegErrorMessage(result.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#FFFFFF',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#1E293B',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid #334155',
        }}
      >
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-block', marginBottom: '12px' }}>
            <Logo height={52} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
            Faculty & Staff Portal
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: 0 }}>
            Ahsora Medical Academy • Instructor & Admin Gateway
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#0F172A',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setLoginError('');
              setLoginStatusNotice(null);
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'signin' ? '#2563EB' : 'transparent',
              color: activeTab === 'signin' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Faculty Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setRegSuccessMessage('');
              setRegErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'signup' ? '#2563EB' : 'transparent',
              color: activeTab === 'signup' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Apply for Faculty Account
          </button>
        </div>

        {/* Sign In View */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {loginStatusNotice === 'pending' && (
              <div
                style={{
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #F59E0B',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#92400E',
                  fontSize: '0.875rem',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <Clock size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px', color: '#78350F' }}>
                    Registration Pending Approval
                  </strong>
                  Your faculty account request has been submitted and is currently awaiting Admin review. You will be able to log in once an Admin approves your request.
                </div>
              </div>
            )}

            {loginStatusNotice === 'rejected' && (
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #EF4444',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#991B1B',
                  fontSize: '0.875rem',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px', color: '#7F1D1D' }}>
                    Access Request Declined / Revoked
                  </strong>
                  Your faculty account access request has been declined or disabled by an administrator.
                </div>
              </div>
            )}

            {loginError && (
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #EF4444',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#991B1B',
                  fontSize: '0.875rem',
                }}
              >
                {loginError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Faculty Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="dr.farhan@ahsorameds.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '0.9375rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '0.9375rem',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '8px',
              }}
            >
              Sign In to Staff Workspace →
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8125rem', color: '#64748B' }}>
              Default Demo Staff Credentials: <br />
              <code style={{ color: '#38BDF8' }}>dr.farhan@ahsorameds.com</code> / <code style={{ color: '#38BDF8' }}>password123</code>
            </div>
          </form>
        )}

        {/* Sign Up View */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {regSuccessMessage && (
              <div
                style={{
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #10B981',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#065F46',
                  fontSize: '0.875rem',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px', color: '#047857' }}>
                    Request Submitted!
                  </strong>
                  {regSuccessMessage}
                </div>
              </div>
            )}

            {regErrorMessage && (
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #EF4444',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#991B1B',
                  fontSize: '0.875rem',
                }}
              >
                {regErrorMessage}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Full Name & Academic Title
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Dr. Ayesha Khan (Chemistry Specialist)"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Institutional Email Address
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@ahsorameds.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Account Password *
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Assigned Subjects (Comma-separated)
              </label>
              <input
                type="text"
                value={regSubjects}
                onChange={(e) => setRegSubjects(e.target.value)}
                placeholder="Biology, Organic Chemistry, IMAT"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Assigned Cohorts (Comma-separated)
              </label>
              <input
                type="text"
                value={regCohorts}
                onChange={(e) => setRegCohorts(e.target.value)}
                placeholder="IMAT 2026 Alpha Cohort, Intensive Track"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '8px',
              }}
            >
              Submit Faculty Sign-Up Request →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
