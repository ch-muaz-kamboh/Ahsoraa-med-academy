'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ACADEMY_PACKAGES, CoursePackage, getPackageByIdOrName } from '@/lib/packages';
import { ArrowRight, Check, CheckCircle2, Globe, Lock, Mail, Phone, Sparkles, User, ShieldCheck } from 'lucide-react';
import Logo from '@/components/brand/Logo';

const COUNTRIES = [
  'Italy',
  'Pakistan',
  'India',
  'United Kingdom',
  'United Arab Emirates',
  'United States',
  'Saudi Arabia',
  'Germany',
  'Turkey',
  'Egypt',
  'Nigeria',
  'Canada',
  'Other',
];

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: 'Italy',
    whatsappNumber: '',
    selectedPackage: 'ascend', // default: Ahsora IMAT Ascend (€299)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPkg: CoursePackage = getPackageByIdOrName(formData.selectedPackage);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.whatsappNumber) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const pkgObj = getPackageByIdOrName(formData.selectedPackage);

    try {
      const supabase = createClient();

      // 1. SignUp via Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: fullName,
            country: formData.country,
            whatsapp_number: formData.whatsappNumber,
            selected_package: pkgObj.name,
            package_price: pkgObj.price,
          },
        },
      });

      if (signUpError) {
        // If account already exists or another error, warn or proceed to profile save
        console.warn('Supabase auth warning:', signUpError.message);
      }

      // 2. Insert or Upsert into profiles table if user created
      if (authData?.user) {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          full_name: fullName,
          email: formData.email,
          country: formData.country,
          whatsapp_number: formData.whatsappNumber,
          selected_package: pkgObj.name,
          package_price: pkgObj.price,
          payment_approved: false,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Supabase fallback:', err);
    }

    // Store in localStorage for demo fallback persistence
    const pendingStudent = {
      id: `usr-reg-${Date.now()}`,
      ama_id: `AMA-${Math.floor(100000 + Math.random() * 900000)}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: fullName,
      email: formData.email,
      country: formData.country,
      whatsappNumber: formData.whatsappNumber,
      selectedPackage: pkgObj.name,
      packagePrice: pkgObj.price,
      paymentApproved: false,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('recentRegistration', JSON.stringify(pendingStudent));
      
      // Also append to local pending students list for admin demo view
      const existingList = JSON.parse(localStorage.getItem('adminStudentList') || '[]');
      existingList.unshift(pendingStudent);
      localStorage.setItem('adminStudentList', JSON.stringify(existingList));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }

    setLoading(false);

    // Redirect to Pending Payment screen with selected package info!
    const targetUrl = `/pending-payment?package=${encodeURIComponent(pkgObj.name)}&price=${encodeURIComponent(pkgObj.price)}&email=${encodeURIComponent(formData.email)}`;
    router.push(targetUrl);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '24px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Logo height={42} />
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Student Registration Portal
              </h1>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '2px 0 0' }}>
                Join Ahsora Meds Academy • Medical Entrance & Licensing Prep
              </p>
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} /> Official Admission Portal
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '36px 40px' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '14px 18px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                marginBottom: '28px',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Section 1: Personal Details */}
            <div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#2563EB',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#EFF6FF',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  1
                </span>
                Personal & Contact Details
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {/* First Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    First Name <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zainab"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Second Name / Last Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Second / Last Name <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Al-Mansoor"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Email Address <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Password <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Country of Residence <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        backgroundColor: '#FFFFFF',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    WhatsApp Number <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Package Selection (4 Packages) */}
            <div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#2563EB',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#EFF6FF',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  2
                </span>
                Select Your Academy Package
              </div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '20px' }}>
                Choose the preparation plan that best matches your target medical exam goals.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {ACADEMY_PACKAGES.map((pkg) => {
                  const isSelected = formData.selectedPackage === pkg.id || formData.selectedPackage === pkg.name;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setFormData({ ...formData, selectedPackage: pkg.id })}
                      style={{
                        border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        borderRadius: '16px',
                        padding: '20px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isSelected ? '0 10px 25px -5px rgba(37, 99, 235, 0.2)' : 'none',
                      }}
                    >
                      {pkg.badge && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-12px',
                            right: '12px',
                            backgroundColor: isSelected ? '#2563EB' : '#0F172A',
                            color: '#FFFFFF',
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '12px',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {pkg.badge}
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            {pkg.name}
                          </h3>
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: isSelected ? '6px solid #2563EB' : '2px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              flexShrink: 0,
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: isSelected ? '#1D4ED8' : '#0F172A' }}>
                            {pkg.price}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '4px' }}>
                            / {pkg.period}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.4, marginBottom: '14px' }}>
                          {pkg.description}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {pkg.features.map((feat, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.75rem', color: '#334155' }}>
                              <CheckCircle2 size={14} color={isSelected ? '#2563EB' : '#16A34A'} style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Action Bar */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Selected Package:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                  {selectedPkg.name} — <span style={{ color: '#2563EB' }}>{selectedPkg.price}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  padding: '14px 32px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}
              >
                {loading ? (
                  'Processing Registration...'
                ) : (
                  <>
                    <span>Proceed to Payment Screen</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9375rem', color: '#64748B' }}>
            Already registered?{' '}
            <Link href="/portal" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
              Sign in to Student Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
