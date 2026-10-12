'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/lib/store';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  ExternalLink,
  AlertCircle,
  Award,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { saveStudentPackageMapping } from '@/lib/packages';

export default function LoginPage() {
  const router = useRouter();
  const { loginStudent, setAdminLoggedIn } = useAppStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Social proof rotating notifications (matching reference screenshot)
  const [notificationIndex, setNotificationIndex] = useState(0);
  const notifications = [
    {
      initials: 'JJ',
      name: 'Jayant J. (India)',
      action: 'joined the PREP Foundation',
      subtext: 'for medical studies · 14d ago',
      color: '#15803D',
      bg: '#DCFCE7',
    },
    {
      initials: 'MK',
      name: 'Maria K. (Germany)',
      action: 'enrolled in IMAT Comprehensive',
      subtext: 'for medicine in Italy · 2d ago',
      color: '#1D4ED8',
      bg: '#DBEAFE',
    },
    {
      initials: 'SA',
      name: 'Sameer A. (UAE)',
      action: 'scored 78.4 in Mock Exam',
      subtext: 'University of Milan prep · 5h ago',
      color: '#7C3AED',
      bg: '#F3E8FF',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setNotificationIndex((prev) => (prev + 1) % notifications.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [notifications.length]);

  const currentNotif = notifications[notificationIndex];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Fast-path demo admin
    if (
      formData.email === 'admin' ||
      (formData.email.toLowerCase().includes('admin') && formData.password === 'password123')
    ) {
      setAdminLoggedIn(true);
      router.push('/admin/dashboard');
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setError(signInError.message || 'Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      const email = data.user?.email || formData.email;
      const meta = data.user?.user_metadata || {};
      const pkg = meta.selected_package || meta.selectedPackage;
      const price = meta.package_price || meta.packagePrice;
      const fullName = meta.full_name || `${meta.first_name || ''} ${meta.last_name || ''}`.trim();

      if (pkg) saveStudentPackageMapping(email, pkg, price);

      if (email.toLowerCase().includes('admin')) {
        setAdminLoggedIn(true);
        router.push('/admin/dashboard');
      } else {
        loginStudent(email, { selectedPackage: pkg, packagePrice: price, fullName });
        router.push('/portal/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
        
        * { box-sizing: border-box; }
        .login-page-root {
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          display: flex;
          background: #F8FAFC;
          overflow-x: hidden;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input {
          width: 100%;
          height: 52px;
          padding: 0 16px 0 48px;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-size: 0.9375rem;
          color: #0F172A;
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
          border-color: #2563EB;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .sign-in-button {
          width: 100%;
          height: 52px;
          background: #2563EB;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
          font-family: inherit;
        }

        .sign-in-button:not(:disabled):hover {
          background: #1D4ED8;
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(37, 99, 235, 0.4);
        }

        .sign-in-button:active {
          transform: translateY(0);
        }

        .sign-in-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .result-portal-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 12px 14px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .result-portal-card:hover {
          border-color: #7C3AED;
          background: #FAF5FF;
          box-shadow: 0 4px 16px rgba(124, 58, 237, 0.08);
          transform: translateY(-1px);
        }

        .result-btn {
          background: #701A75;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.78rem;
          font-weight: 700;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: background 0.2s;
        }

        .result-portal-card:hover .result-btn {
          background: #86198F;
        }

        .social-proof-toast {
          position: fixed;
          bottom: 24px;
          right: 28px;
          z-index: 50;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
          animation: fadeIn 0.4s ease-out;
          max-width: 380px;
        }

        @media (max-width: 960px) {
          .left-hero-panel { display: none !important; }
          .right-auth-panel { width: 100% !important; flex: 1 !important; padding: 32px 20px !important; }
          .social-proof-toast { display: none !important; }
        }
      `}</style>

      <div className="login-page-root">
        {/* ── LEFT HERO PANEL (MATCHING REFERENCE EXACTLY) ──────────────── */}
        <div
          className="left-hero-panel"
          style={{
            flex: '0 0 52%',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#071324',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '40px 48px',
            minHeight: '100vh',
          }}
        >
          {/* Authentic Doctor Photography Background */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <Image
              src="/login-doctor-bg.jpg"
              alt="Ahsora Medical Doctor & Student"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              priority
            />
            {/* Cinematic Moody Gradient Overlay for 100% Contrast */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(6, 17, 33, 0.94) 0%, rgba(7, 19, 36, 0.78) 45%, rgba(6, 15, 29, 0.96) 100%)',
              }}
            />
            {/* Soft Ambient Radial Lights */}
            <div
              style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '10%',
                right: '-5%',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
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
              {/* Logo Emblem Icon */}
              <Logo height={42} iconOnly />
              <div>
                <div
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    letterSpacing: '-0.3px',
                    lineHeight: 1.15,
                  }}
                >
                  Ahsora <span style={{ color: '#EAB308' }}>MedsAcademy</span>
                </div>
                <div
                  style={{
                    color: '#94A3B8',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                  }}
                >
                  Student &amp; Staff Portal
                </div>
              </div>
            </Link>
          </div>

          {/* Main Hero Story Block */}
          <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0 36px 0', maxWidth: '520px' }}>
            {/* Tagline Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <div style={{ width: '28px', height: '2px', background: '#38BDF8' }} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#38BDF8',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                IMAT 2026 · Admissions Open
              </span>
            </div>

            {/* Display Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.3rem, 4vw, 3.1rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.14,
                letterSpacing: '-1px',
                margin: '0 0 18px 0',
              }}
            >
              The school of{' '}
              <span style={{ color: '#60A5FA' }}>tomorrow&apos;s</span>
              <br />
              physicians.
            </h1>

            {/* Mission Subtitle */}
            <p
              style={{
                color: '#CBD5E1',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                margin: '0 0 32px 0',
                maxWidth: '440px',
              }}
            >
              Empowering future doctors worldwide — structured IMAT preparation, one-to-one mentorship and
              complete admissions support for medicine in Italy.
            </p>

            {/* Frosted Glass Stats Card (Matching Reference Screenshot) */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '22px 28px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}
                >
                  Rank 1
                </div>
                <div
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: '#94A3B8',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginTop: '6px',
                  }}
                >
                  Pavia · Messina · Catania
                </div>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '20px' }}>
                <div
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 900,
                    color: '#38BDF8',
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}
                >
                  84.7
                </div>
                <div
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: '#94A3B8',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginTop: '6px',
                  }}
                >
                  Highest IMAT · 2025
                </div>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '20px' }}>
                <div
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}
                >
                  10+
                </div>
                <div
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: '#94A3B8',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginTop: '6px',
                  }}
                >
                  Italian Universities
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
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#2563EB',
                color: '#FFFFFF',
                borderRadius: '999px',
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              Explore Ahsora MedsAcademy <ArrowRight size={15} />
            </Link>

            <Link
              href="/"
              style={{
                color: '#94A3B8',
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s',
              }}
            >
              ahsoramedsacademy.com <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* ── RIGHT AUTH PANEL ────────────────────────────────────────── */}
        <div
          className="right-auth-panel"
          style={{
            flex: '0 0 48%',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '40px 48px',
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          {/* Top Brand Logo (Aligned to Right/Center as in reference) */}
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '20px',
            }}
          >
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              <Logo height={42} />
            </Link>
          </div>

          {/* Main Floating Auth Card */}
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px 36px 32px',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.03)',
              border: '1px solid #EEF2F6',
              margin: 'auto 0',
            }}
          >
            {/* Header / Active Tab Pill (Guest Button Removed as requested) */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 18px',
                  background: '#F0F7FF',
                  border: '1.5px solid #BFDBFE',
                  borderRadius: '12px',
                  color: '#1D4ED8',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)',
                }}
              >
                <GraduationCap size={18} color="#2563EB" />
                <span>Academy Portal</span>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#2563EB',
                    display: 'inline-block',
                    marginLeft: '4px',
                    animation: 'pulseDot 2s infinite ease-in-out',
                  }}
                />
              </div>
            </div>

            {/* Secure Sign-In Eyebrow */}
            <div style={{ marginBottom: '24px' }}>
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#2563EB',
                  letterSpacing: '1.8px',
                  textTransform: 'uppercase',
                  margin: '0 0 6px 0',
                }}
              >
                Secure Sign-In
              </p>
              <h2
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 900,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.5px',
                  lineHeight: 1.2,
                }}
              >
                Welcome back.
              </h2>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '20px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  fontSize: '0.85rem',
                  color: '#991B1B',
                }}
              >
                <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Username or Email Input (User Icon as in reference screenshot) */}
              <div className="login-input-group">
                <User
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }}
                />
                <input
                  className="login-input"
                  type="text"
                  required
                  placeholder="Username or email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Password Input (Lock Icon as in reference screenshot) */}
              <div className="login-input-group">
                <Lock
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }}
                />
                <input
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  style={{ paddingRight: '48px' }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Sign In CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="sign-in-button"
                style={{ marginTop: '6px' }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#FFFFFF',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block',
                      }}
                    />
                    Signing in…
                  </>
                ) : (
                  <>
                    SIGN IN <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a
                href="https://wa.me/393333444479?text=Hello%20Ahsora%20Support,%20I%20need%20help%20with%20my%20password."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.875rem',
                  color: '#2563EB',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Subtle Divider */}
            <div style={{ height: '1px', background: '#F1F5F9', margin: '22px 0 18px 0' }} />

            {/* IMAT Result Portal Card (Matching Reference Screenshot) */}
            <a
              href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20have%20a%20candidate%20code%20and%20want%20to%20check%20my%20IMAT%202026%20result."
              target="_blank"
              rel="noopener noreferrer"
              className="result-portal-card"
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#581C87',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#FFFFFF',
                }}
              >
                <Award size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: '#0F172A',
                    lineHeight: 1.2,
                  }}
                >
                  IMAT 2026 Result Portal
                </div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '2px',
                  }}
                >
                  Have a candidate code? Check…
                </div>
              </div>
              <span className="result-btn">
                Check Result <ArrowRight size={13} />
              </span>
            </a>
          </div>

          {/* Footer Bottom Metadata & Security Badges */}
          <div style={{ marginTop: 'auto', paddingTop: '24px', textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                fontSize: '0.72rem',
                color: '#94A3B8',
                marginBottom: '10px',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="#10B981" /> 256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} color="#2563EB" /> Verified Admissions
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>
              © Ahsora MedsAcademy
            </p>
          </div>

          {/* Floating Social Proof Toast (Jayant J. joined PREP Foundation...) */}
          <div className="social-proof-toast">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: currentNotif.bg,
                color: currentNotif.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.8rem',
                flexShrink: 0,
              }}
            >
              {currentNotif.initials}
            </div>
            <div style={{ fontSize: '0.78rem', lineHeight: 1.35 }}>
              <div>
                <strong style={{ color: '#0F172A' }}>{currentNotif.name}</strong>{' '}
                <span style={{ color: '#2563EB', fontWeight: 600 }}>{currentNotif.action}</span>
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.7rem', marginTop: '2px' }}>
                {currentNotif.subtext}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
