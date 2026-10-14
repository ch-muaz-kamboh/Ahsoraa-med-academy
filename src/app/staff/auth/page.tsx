'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Target,
  Compass,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import SocialLinks from '@/components/common/SocialLinks';
import { StaffRole } from '@/types';

export default function StaffAuthPage() {
  const router = useRouter();
  const { loginStaffAccount, registerStaffAccount, staffLoggedIn } = useAppStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginStatusNotice, setLoginStatusNotice] = useState<'pending' | 'rejected' | null>(null);

  // Predefined options
  const PRESET_SUBJECTS = [
    'Biology & Human Anatomy',
    'General Chemistry',
    'Organic Chemistry & Biochemistry',
    'Physics & Mathematics',
    'Logical Reasoning & Critical Thinking',
    'IMAT Exam Preparation',
    'MedPath Elite Mentorship',
    'University Admissions & DOV',
  ];

  const PRESET_COHORTS = [
    'IMAT 2026 Alpha Cohort',
    'IMAT 2026 Beta Cohort',
    'MedPath Elite Track',
    'Intensive Revision Track',
  ];

  // Sign Up State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<StaffRole>('teacher');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Biology & Human Anatomy']);
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>(['IMAT 2026 Alpha Cohort']);
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState('');
  const [regErrorMessage, setRegErrorMessage] = useState('');

  // Auto redirect if already logged in
  if (staffLoggedIn) {
    router.replace('/staff/dashboard');
  }

  const handleToggleSubject = (subj: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subj) ? (prev.length > 1 ? prev.filter((s) => s !== subj) : prev) : [...prev, subj]
    );
  };

  const handleAddCustomSubject = () => {
    if (customSubjectInput.trim() && !selectedSubjects.includes(customSubjectInput.trim())) {
      setSelectedSubjects((prev) => [...prev, customSubjectInput.trim()]);
      setCustomSubjectInput('');
    }
  };

  const handleToggleCohort = (cohort: string) => {
    setSelectedCohorts((prev) =>
      prev.includes(cohort) ? (prev.length > 1 ? prev.filter((c) => c !== cohort) : prev) : [...prev, cohort]
    );
  };

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

    const result = registerStaffAccount({
      email: regEmail,
      displayName: regName,
      accountType: 'staff',
      role: regRole,
      assignedSubjects: selectedSubjects.length > 0 ? selectedSubjects : ['Biology & Human Anatomy'],
      assignedCohorts: selectedCohorts.length > 0 ? selectedCohorts : ['IMAT 2026 Alpha Cohort'],
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; }
        .ahsora-login-root {
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          display: flex;
          background: #F7FAF8;
          overflow-x: hidden;
        }

        .login-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input {
          width: 100%;
          height: 50px;
          padding: 0 16px 0 46px;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-size: 0.9375rem;
          color: #0F291E;
          background: #FFFFFF;
          outline: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }

        .login-input::placeholder {
          color: #94A3B8;
          font-weight: 400;
        }

        .login-input:focus {
          border-color: #059669;
          background: #FFFFFF;
          box-shadow: 0 0 0 3.5px rgba(5, 150, 105, 0.15);
        }

        .sign-in-btn {
          width: 100%;
          height: 50px;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.28);
          font-family: inherit;
        }

        .sign-in-btn:not(:disabled):hover {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(5, 150, 105, 0.38);
        }

        .sign-in-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 960px) {
          .left-hero-panel { display: none !important; }
          .right-auth-panel { width: 100% !important; flex: 1 !important; padding: 120px 20px 40px !important; }
        }
      `}</style>

      <div className="ahsora-login-root">
        {/* ── LEFT HERO PANEL (MATCHING STUDENT PORTAL AESTHETIC) ─────────── */}
        <div
          className="left-hero-panel"
          style={{
            flex: '0 0 52%',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#021B14',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '172px 46px 40px',
            minHeight: '100vh',
          }}
        >
          {/* Doctor Background with Deep Emerald Tint */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <Image
              src="/login-doctor-bg.jpg"
              alt="Ahsora Faculty & Doctors"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              priority
            />
            {/* Vignette Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(145deg, rgba(2, 27, 20, 0.94) 0%, rgba(4, 52, 38, 0.8) 50%, rgba(2, 22, 16, 0.97) 100%)',
              }}
            />
            {/* Atmospheric Glows */}
            <div
              style={{
                position: 'absolute',
                top: '-8%',
                left: '-8%',
                width: '420px',
                height: '420px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '12%',
                right: '-6%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Top Brand Header */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
              }}
            >
              <Logo height={38} iconOnly />
              <div>
                <div
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    letterSpacing: '-0.2px',
                    lineHeight: 1.15,
                  }}
                >
                  AHSORA <span style={{ color: '#FCD34D' }}>MEDS ACADEMY</span>
                </div>
                <div
                  style={{
                    color: '#6EE7B7',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                  }}
                >
                  Faculty &amp; Staff Gateway
                </div>
              </div>
            </Link>
          </div>

          {/* Main Story Block */}
          <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0 32px 0', maxWidth: '520px' }}>
            {/* Tagline Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(110, 231, 183, 0.35)',
                marginBottom: '18px',
              }}
            >
              <Sparkles size={13} color="#FCD34D" />
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#A7F3D0',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                }}
              >
                AHSORA FACULTY &amp; MENTOR NETWORK
              </span>
            </div>

            {/* Display Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.3rem, 4vw, 3.1rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-1px',
                margin: '0 0 16px 0',
              }}
            >
              Inspire Excellence.{' '}
              <br />
              <span style={{ color: '#5CED73', textShadow: '0 0 20px rgba(92,237,115,0.4)' }}>
                Mentor Future Doctors.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                color: '#CBD5E1',
                fontSize: '0.96rem',
                lineHeight: 1.7,
                margin: '0 0 30px 0',
                maxWidth: '460px',
              }}
            >
              Access your instructor portal, schedule live interactive lectures, answer student doubts, and track mock test diagnostics across student cohorts.
            </p>

            {/* 3 Pillars: TEACH | MENTOR | EVALUATE */}
            <div
              style={{
                background: 'rgba(4, 45, 33, 0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(110, 231, 183, 0.25)',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <BookOpen size={15} color="#FCD34D" />
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 900,
                      color: '#FCD34D',
                      letterSpacing: '0.5px',
                    }}
                  >
                    TEACH
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#E2E8F0',
                  }}
                >
                  Live Lectures
                </div>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.12)', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Target size={15} color="#5CED73" />
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 900,
                      color: '#5CED73',
                      letterSpacing: '0.5px',
                    }}
                  >
                    MENTOR
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#E2E8F0',
                  }}
                >
                  1-on-1 Doubts
                </div>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.12)', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Compass size={15} color="#FFFFFF" />
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      letterSpacing: '0.5px',
                    }}
                  >
                    EVALUATE
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#E2E8F0',
                  }}
                >
                  Mock Scores
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Row */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                href="/courses"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#FFFFFF',
                  borderRadius: '999px',
                  padding: '11px 22px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
                  transition: 'all 0.2s',
                }}
              >
                Academy Ecosystem <ArrowRight size={14} color="#FCD34D" />
              </Link>

              <Link
                href="/"
                style={{
                  color: '#94A3B8',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ahsoramedsacademy.com <ExternalLink size={12} />
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SocialLinks variant="dark" size="sm" />
            </div>
          </div>
        </div>

        {/* ── RIGHT AUTH PANEL (IDENTICAL CARD STRUCTURE) ────────────────── */}
        <div
          className="right-auth-panel"
          style={{
            flex: '0 0 48%',
            backgroundColor: '#F8FAF8',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '172px 44px 40px',
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          {/* Top Logo */}
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '28px',
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'opacity 0.2s',
              }}
            >
              <Logo height={34} />
            </Link>
          </div>

          {/* Main Floating Auth Card */}
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#FFFFFF',
              borderRadius: '22px',
              padding: '36px 34px',
              boxShadow: '0 12px 36px rgba(6, 78, 59, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)',
              border: '1.5px solid #E6F4EA',
              margin: '36px 0 auto 0',
              position: 'relative',
            }}
          >
            {/* Top Emerald Accent Bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '32px',
                right: '32px',
                height: '3px',
                background: 'linear-gradient(90deg, #059669 0%, #FCD34D 50%, #059669 100%)',
                borderRadius: '0 0 4px 4px',
              }}
            />

            {/* Portal Badge Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '8px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: '#ECFDF5',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: '12px',
                  color: '#065F46',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)',
                }}
              >
                <Shield size={16} color="#059669" />
                <span>Staff &amp; Faculty Portal</span>
              </div>

              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                Secure Access
              </span>
            </div>

            {/* Tab Switcher: Sign In vs Apply */}
            <div
              style={{
                display: 'flex',
                background: '#F1F5F9',
                padding: '4px',
                borderRadius: '12px',
                marginBottom: '26px',
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
                  padding: '10px 14px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'signin' ? '#065F46' : '#64748B',
                  fontWeight: activeTab === 'signin' ? 800 : 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'signin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
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
                  padding: '10px 14px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: activeTab === 'signup' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'signup' ? '#065F46' : '#64748B',
                  fontWeight: activeTab === 'signup' ? 800 : 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
              >
                Apply for Account
              </button>
            </div>

            {/* SIGN IN TAB */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {loginStatusNotice === 'pending' && (
                  <div
                    style={{
                      backgroundColor: '#FEF3C7',
                      border: '1.5px solid #F59E0B',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      color: '#92400E',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <Clock size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '2px' }}>Application Pending Review</div>
                      <div>Your faculty application has been received and is awaiting administrator verification.</div>
                    </div>
                  </div>
                )}

                {loginStatusNotice === 'rejected' && (
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1.5px solid #EF4444',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      color: '#991B1B',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '2px' }}>Account Not Approved</div>
                      <div>This faculty account application could not be verified. Please contact administrative support.</div>
                    </div>
                  </div>
                )}

                {loginError && (
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1.5px solid #FCA5A5',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#991B1B',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: '#334155',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Faculty Email
                  </label>
                  <div className="login-input-group">
                    <Mail size={18} color="#059669" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="instructor@ahsora.com"
                      className="login-input"
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label
                      style={{
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: '#334155',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Password
                    </label>
                  </div>
                  <div className="login-input-group">
                    <Lock size={18} color="#059669" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="login-input"
                      style={{ paddingRight: '46px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="sign-in-btn" style={{ marginTop: '6px' }}>
                  <span>Access Faculty Dashboard</span>
                  <ArrowRight size={18} />
                </button>

                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '0.8rem',
                    color: '#64748B',
                    textAlign: 'center',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>Demo Faculty:</span>{' '}
                  <code style={{ color: '#059669', fontWeight: 600 }}>doctor@ahsora.com</code> • Password:{' '}
                  <code style={{ color: '#059669', fontWeight: 600 }}>password123</code>
                </div>
              </form>
            )}

            {/* SIGN UP / APPLICATION TAB */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {regSuccessMessage && (
                  <div
                    style={{
                      backgroundColor: '#ECFDF5',
                      border: '1.5px solid #10B981',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      color: '#065F46',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '2px' }}>Application Submitted!</div>
                      <div>{regSuccessMessage}</div>
                    </div>
                  </div>
                )}

                {regErrorMessage && (
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1.5px solid #FCA5A5',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#991B1B',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{regErrorMessage}</span>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Full Legal Name
                  </label>
                  <div className="login-input-group">
                    <User size={18} color="#059669" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Dr. Sofia Rossi"
                      className="login-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Academic / Professional Email
                  </label>
                  <div className="login-input-group">
                    <Mail size={18} color="#059669" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="sofia.rossi@unimi.it"
                      className="login-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Create Password
                  </label>
                  <div className="login-input-group">
                    <Lock size={18} color="#059669" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="login-input"
                      style={{ paddingRight: '46px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Primary Faculty Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as StaffRole)}
                    className="login-input"
                    style={{ paddingLeft: '16px', height: '48px', cursor: 'pointer' }}
                  >
                    <option value="teacher">Lecturer / Subject Instructor</option>
                    <option value="mentor">Senior Medical Student Mentor</option>
                    <option value="evaluator">Mock Exam Evaluator &amp; Grader</option>
                    <option value="admissions_advisor">University Admissions &amp; DOV Advisor</option>
                  </select>
                </div>

                {/* Subject Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Assigned Teaching Subjects
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '110px', overflowY: 'auto', padding: '6px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    {PRESET_SUBJECTS.map((subj) => {
                      const selected = selectedSubjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => handleToggleSubject(subj)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            border: `1px solid ${selected ? '#059669' : '#CBD5E1'}`,
                            backgroundColor: selected ? '#ECFDF5' : '#FFFFFF',
                            color: selected ? '#065F46' : '#475569',
                            fontSize: '0.75rem',
                            fontWeight: selected ? 700 : 500,
                            cursor: 'pointer',
                          }}
                        >
                          {subj}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button type="submit" className="sign-in-btn" style={{ marginTop: '8px' }}>
                  <span>Submit Faculty Application</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* Bottom Switch to Student Portal */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
              <Link
                href="/login"
                style={{
                  color: '#059669',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <GraduationCap size={16} />
                <span>Looking for Student Portal? Sign in as student &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Legal Footnote */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8' }}>
            &copy; {new Date().getFullYear()} Ahsora Med Academy • Official Faculty Gateway
          </div>
        </div>
      </div>
    </>
  );
}
