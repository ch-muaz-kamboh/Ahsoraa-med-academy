'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/lib/store';
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  Stethoscope,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { saveStudentPackageMapping } from '@/lib/packages';

export default function LoginPage() {
  const router = useRouter();
  const { loginStudent, setAdminLoggedIn } = useAppStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Fallback for default admin demo credentials
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

      if (pkg) {
        saveStudentPackageMapping(email, pkg, price);
      }

      if (email.toLowerCase().includes('admin')) {
        setAdminLoggedIn(true);
        router.push('/admin/dashboard');
      } else {
        loginStudent(email, {
          selectedPackage: pkg,
          packagePrice: price,
          fullName: fullName,
        });
        router.push('/portal/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        backgroundImage: `
          radial-gradient(circle at 15% 20%, rgba(5, 150, 105, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 85% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.6) 0%, transparent 70%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background ambient light grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Navigation Back to Website */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '28px',
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94A3B8',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            padding: '8px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94A3B8';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
          }}
        >
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>

      {/* Central Login Card Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Main Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            padding: '44px 38px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            position: 'relative',
          }}
        >
          {/* Header & Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Logo height={48} />
              </Link>
            </div>

            {/* Pill Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #A7F3D0',
                  borderRadius: '999px',
                  padding: '4px 12px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    display: 'inline-block',
                  }}
                />
                Student &amp; Faculty Portal
              </span>
            </div>

            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.5px',
                margin: '0 0 6px 0',
              }}
            >
              Welcome back
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
              Sign in to access your live classes, CBT mocks &amp; curriculum
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                lineHeight: 1.45,
                animation: 'fadeIn 0.2s ease-out',
              }}
            >
              <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.875rem' }}>Authentication Notice</strong>
                {error}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '6px',
                  letterSpacing: '0.2px',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="#94A3B8"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 44px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.9375rem',
                    color: '#0F172A',
                    backgroundColor: '#F8FAFC',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669';
                    e.target.style.backgroundColor = '#FFFFFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#CBD5E1';
                    e.target.style.backgroundColor = '#F8FAFC';
                    e.target.style.boxShadow = 'none';
                  }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#334155',
                    letterSpacing: '0.2px',
                  }}
                >
                  Password
                </label>
                <a
                  href="https://wa.me/393333444479?text=Hello%20Ahsora%20Support,%20I%20need%20help%20recovering%20my%20student%20portal%20password."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#059669',
                    textDecoration: 'none',
                  }}
                >
                  Forgot password?
                </a>
              </div>

              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="#94A3B8"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '13px 44px 13px 44px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    outline: 'none',
                    fontSize: '0.9375rem',
                    color: '#0F172A',
                    backgroundColor: '#F8FAFC',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669';
                    e.target.style.backgroundColor = '#FFFFFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#CBD5E1';
                    e.target.style.backgroundColor = '#F8FAFC';
                    e.target.style.boxShadow = 'none';
                  }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                boxShadow: '0 8px 24px -4px rgba(5, 150, 105, 0.4)',
                transition: 'all 0.2s',
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(5, 150, 105, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(5, 150, 105, 0.4)';
              }}
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
                      display: 'inline-block',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Registration Link Card */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #F1F5F9',
              fontSize: '0.9rem',
              color: '#64748B',
            }}
          >
            Don&apos;t have an enrolled account yet?{' '}
            <Link
              href="/register"
              style={{
                color: '#059669',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '4px',
              }}
            >
              Register here <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Micro Trust Indicators under Card */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            fontSize: '0.75rem',
            color: '#94A3B8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#10B981" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GraduationCap size={14} color="#10B981" />
            <span>Official IMAT Portal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Stethoscope size={14} color="#10B981" />
            <span>Doctor-Led Academy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
