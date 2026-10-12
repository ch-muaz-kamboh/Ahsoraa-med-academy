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
  UserPlus,
  Sparkles,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import SocialLinks from '@/components/common/SocialLinks';
import { saveStudentPackageMapping } from '@/lib/packages';

export default function LoginPage() {
  const router = useRouter();
  const { loginStudent, setAdminLoggedIn } = useAppStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rotating student admission updates
  const [notificationIndex, setNotificationIndex] = useState(0);
  const notifications = [
    {
      initials: 'JJ',
      name: 'Jayant J. (India)',
      action: 'joined the PREP Foundation',
      subtext: 'for medical studies · 14d ago',
      badge: 'IMAT Prep',
    },
    {
      initials: 'MK',
      name: 'Maria K. (Germany)',
      action: 'enrolled in IMAT Comprehensive',
      subtext: 'for medicine in Italy · 2d ago',
      badge: 'Medicine in Italy',
    },
    {
      initials: 'SA',
      name: 'Sameer A. (UAE)',
      action: 'scored 78.4 in Mock Exam',
      subtext: 'University of Milan prep · 5h ago',
      badge: 'Top Scorer',
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; }
        .ahsora-login-root {
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          display: flex;
          background: #F7FAF8;
          overflow-x: hidden;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
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

        .sign-in-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .register-now-btn {
          width: 100%;
          height: 48px;
          background: #ECFDF5;
          color: #065F46;
          border: 1.5px solid #A7F3D0;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .register-now-btn:hover {
          background: #D1FAE5;
          border-color: #059669;
          color: #047857;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.15);
        }

        .result-portal-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%);
          border: 1.5px solid #A7F3D0;
          border-radius: 14px;
          padding: 12px 14px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .result-portal-card:hover {
          border-color: #059669;
          background: #ECFDF5;
          box-shadow: 0 4px 16px rgba(5, 150, 105, 0.12);
          transform: translateY(-1px);
        }

        .result-btn {
          background: linear-gradient(135deg, #B48D39 0%, #99732B 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          padding: 8px 13px;
          font-size: 0.78rem;
          font-weight: 700;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 6px rgba(180, 141, 57, 0.3);
        }

        .social-proof-toast {
          position: fixed;
          bottom: 22px;
          right: 26px;
          z-index: 50;
          background: #FFFFFF;
          border: 1px solid #D1FAE5;
          border-radius: 16px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(6, 78, 59, 0.1), 0 1px 3px rgba(0, 0, 0, 0.04);
          animation: fadeIn 0.4s ease-out;
          max-width: 370px;
        }

        @media (max-width: 960px) {
          .left-hero-panel { display: none !important; }
          .right-auth-panel { width: 100% !important; flex: 1 !important; padding: 28px 18px !important; }
          .social-proof-toast { display: none !important; }
        }
      `}</style>

      <div className="ahsora-login-root">
        {/* ── LEFT HERO PANEL (AHSORA EMERALD & GOLD THEME) ─────────────── */}
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
            padding: '38px 46px',
            minHeight: '100vh',
          }}
        >
          {/* Authentic Doctor Photography Background with Deep Emerald Tint */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <Image
              src="/login-doctor-bg.jpg"
              alt="Ahsora Medical Doctor & Student"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              priority
            />
            {/* Emerald Vignette Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(145deg, rgba(2, 27, 20, 0.94) 0%, rgba(4, 52, 38, 0.78) 50%, rgba(2, 22, 16, 0.97) 100%)',
              }}
            />
            {/* Atmospheric Emerald & Gold Glows */}
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
              {/* Standalone Emblem (Mark only) */}
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
                    fontSize: '0.67rem',
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
                IMAT 2026 · Admissions Open
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
              The school of{' '}
              <span style={{ color: '#5CED73', textShadow: '0 0 20px rgba(92,237,115,0.4)' }}>
                tomorrow&apos;s
              </span>
              <br />
              physicians.
            </h1>

            {/* Mission Subtitle */}
            <p
              style={{
                color: '#CBD5E1',
                fontSize: '0.94rem',
                lineHeight: 1.7,
                margin: '0 0 30px 0',
                maxWidth: '450px',
              }}
            >
              Empowering future doctors worldwide — structured IMAT preparation, one-to-one mentorship and
              complete admissions support for medicine in Italy.
            </p>

            {/* Frosted Glass Stats Card (Emerald & Gold Accents) */}
            <div
              style={{
                background: 'rgba(4, 45, 33, 0.45)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(110, 231, 183, 0.22)',
                borderRadius: '16px',
                padding: '22px 26px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 900,
                    color: '#FCD34D',
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

              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '16px' }}>
                <div
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 900,
                    color: '#5CED73',
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

              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '16px' }}>
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
                Explore Programmes <ArrowRight size={14} color="#FCD34D" />
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

            {/* Official Social Channels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SocialLinks variant="dark" size="sm" />
            </div>
          </div>
        </div>

        {/* ── RIGHT AUTH PANEL (CREATIVE EMERALD & PORCELAIN THEME) ────── */}
        <div
          className="right-auth-panel"
          style={{
            flex: '0 0 48%',
            backgroundColor: '#F8FAF8',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '36px 44px',
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          {/* Top Brand Logo - Compact / Reduced width as requested */}
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '16px',
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
              maxWidth: '420px',
              background: '#FFFFFF',
              borderRadius: '22px',
              padding: '34px 34px 30px',
              boxShadow: '0 12px 36px rgba(6, 78, 59, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)',
              border: '1.5px solid #E6F4EA',
              margin: 'auto 0',
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

            {/* Header / Single Academy Portal Active Pill (No Guest button) */}
            <div style={{ marginBottom: '22px' }}>
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
                <GraduationCap size={17} color="#059669" />
                <span>Academy Student Portal</span>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10B981',
                    display: 'inline-block',
                    marginLeft: '3px',
                    animation: 'pulseDot 2s infinite ease-in-out',
                  }}
                />
              </div>
            </div>

            {/* Secure Sign-In Header */}
            <div style={{ marginBottom: '22px' }}>
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#059669',
                  letterSpacing: '1.6px',
                  textTransform: 'uppercase',
                  margin: '0 0 5px 0',
                }}
              >
                Secure Candidate Sign-In
              </p>
              <h2
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#0F291E',
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
                  marginBottom: '18px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  fontSize: '0.84rem',
                  color: '#991B1B',
                }}
              >
                <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {/* Username or Email Input */}
              <div className="login-input-group">
                <User
                  size={18}
                  color="#059669"
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

              {/* Password Input */}
              <div className="login-input-group">
                <Lock
                  size={18}
                  color="#059669"
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
                className="sign-in-btn"
                style={{ marginTop: '4px' }}
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
                    Authenticating…
                  </>
                ) : (
                  <>
                    SIGN IN <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Prominent Register Now Section (Forgot password removed) */}
            <div style={{ marginTop: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  New to Ahsora?
                </span>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              </div>

              <Link href="/register" className="register-now-btn">
                <UserPlus size={16} color="#059669" />
                Register New Account
                <ArrowRight size={14} color="#059669" />
              </Link>
            </div>

            {/* Subtle Divider */}
            <div style={{ height: '1px', background: '#F1F5F9', margin: '20px 0 16px 0' }} />

            {/* IMAT Result Portal Card */}
            <a
              href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20have%20a%20candidate%20code%20and%20want%20to%20check%20my%20IMAT%202026%20result."
              target="_blank"
              rel="noopener noreferrer"
              className="result-portal-card"
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#FCD34D',
                }}
              >
                <Award size={19} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    color: '#0F291E',
                    lineHeight: 1.2,
                  }}
                >
                  IMAT 2026 Result Portal
                </div>
                <div
                  style={{
                    fontSize: '0.73rem',
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
                Check Result <ArrowRight size={12} />
              </span>
            </a>
          </div>

          {/* Footer Metadata & Social Links */}
          <div style={{ marginTop: 'auto', paddingTop: '20px', textAlign: 'center', width: '100%', maxWidth: '420px' }}>
            {/* Social Media Links for Quick Access */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <SocialLinks variant="emerald" size="sm" />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                fontSize: '0.72rem',
                color: '#94A3B8',
                marginBottom: '8px',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} color="#059669" /> 256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span>Official IMAT Academy</span>
            </div>

            <p style={{ margin: 0, fontSize: '0.74rem', color: '#94A3B8' }}>
              © {new Date().getFullYear()} Ahsora Meds Academy
            </p>
          </div>

          {/* Floating Social Proof Toast */}
          <div className="social-proof-toast">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
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
                <strong style={{ color: '#0F291E' }}>{currentNotif.name}</strong>{' '}
                <span style={{ color: '#059669', fontWeight: 600 }}>{currentNotif.action}</span>
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
