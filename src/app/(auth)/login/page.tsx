'use client';

import React, { useState } from 'react';
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
  ShieldCheck,
  UserPlus,
  Sparkles,
  BookOpen,
  Target,
  Compass,
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; }
        .ahsora-login-root {
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          display: flex;
          background: #F7FAF8;
          overflow-x: hidden;
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
          height: 50px;
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

        @media (max-width: 960px) {
          .left-hero-panel { display: none !important; }
          .right-auth-panel { width: 100% !important; flex: 1 !important; padding: 28px 18px !important; }
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
            {/* Tagline Badge — IMAT 2027 Admissions Open */}
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
                IMAT 2027 · ADMISSIONS OPEN
              </span>
            </div>

            {/* Display Headline: Prepare Smarter. Pursue Medicine in Italy. */}
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
              Prepare Smarter.{' '}
              <br />
              <span style={{ color: '#5CED73', textShadow: '0 0 20px rgba(92,237,115,0.4)' }}>
                Pursue Medicine in Italy.
              </span>
            </h1>

            {/* Subtitle: Join a community of aspiring doctors... */}
            <p
              style={{
                color: '#CBD5E1',
                fontSize: '0.96rem',
                lineHeight: 1.7,
                margin: '0 0 30px 0',
                maxWidth: '450px',
              }}
            >
              Join a community of aspiring doctors and take the next step towards your future in medicine.
            </p>

            {/* 3 Pillars / Badges: UNDERSTAND The IMAT | PREPARE With purpose | PLAN Your next step */}
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
                    UNDERSTAND
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#E2E8F0',
                  }}
                >
                  The IMAT
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
                    PREPARE
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#E2E8F0',
                  }}
                >
                  With purpose
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
                    PLAN
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#E2E8F0',
                  }}
                >
                  Your next step
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

        {/* ── RIGHT AUTH PANEL ────────────────────────────────────────── */}
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
          {/* Top Brand Logo - Compact / Reduced width */}
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
              padding: '36px 34px',
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
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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

            {/* Register Now Section (Forgot password and 2026 result removed) */}
            <div style={{ marginTop: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
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
        </div>
      </div>
    </>
  );
}
