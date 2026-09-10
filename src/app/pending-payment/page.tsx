'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ACADEMY_PACKAGES, CoursePackage, getPackageByIdOrName } from '@/lib/packages';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Globe, LogOut, Phone, ShieldCheck, Sparkles, User, Mail } from 'lucide-react';
import Logo from '@/components/brand/Logo';

function PendingPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Extract from query params if passed from registration
  const queryPkgName = searchParams ? searchParams.get('package') : null;
  const queryPrice = searchParams ? searchParams.get('price') : null;
  const queryEmail = searchParams ? searchParams.get('email') : null;

  useEffect(() => {
    const loadProfileAndRegistration = async () => {
      let currentData: any = null;

      // 1. Check local storage recent registration
      try {
        const cached = localStorage.getItem('recentRegistration');
        if (cached) {
          currentData = JSON.parse(cached);
        }
      } catch (e) {
        console.error(e);
      }

      // 2. Query Supabase auth user profile if logged in
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileData) {
            if (profileData.payment_approved) {
              router.push('/portal/dashboard');
              return;
            }
            currentData = {
              ...currentData,
              ...profileData,
              fullName: profileData.full_name || currentData?.fullName,
              email: profileData.email || currentData?.email,
              country: profileData.country || currentData?.country,
              whatsappNumber: profileData.whatsapp_number || currentData?.whatsappNumber,
              selectedPackage: profileData.selected_package || currentData?.selectedPackage,
              packagePrice: profileData.package_price || currentData?.packagePrice,
              ama_id: profileData.ama_id || currentData?.ama_id,
            };
          }
        }
      } catch (e) {
        console.warn('Supabase fetch fallback:', e);
      }

      // 3. Apply query param overrides if present
      if (!currentData) {
        currentData = {
          fullName: 'Student Applicant',
          email: queryEmail || 'student@example.com',
          country: 'Italy',
          whatsappNumber: 'Not provided',
          selectedPackage: queryPkgName || 'Ahsora IMAT Ascend',
          packagePrice: queryPrice || '€299',
          ama_id: `AMA-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      } else {
        if (queryPkgName) currentData.selectedPackage = queryPkgName;
        if (queryPrice) currentData.packagePrice = queryPrice;
      }

      setStudentDetails(currentData);
      setLoading(false);
    };

    loadProfileAndRegistration();
  }, [router, searchParams, queryPkgName, queryPrice, queryEmail]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {}
    localStorage.removeItem('recentRegistration');
    router.push('/portal');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>Loading registration payment details...</div>
      </div>
    );
  }

  const matchedPkg: CoursePackage = getPackageByIdOrName(studentDetails?.selectedPackage);
  const pkgPrice = studentDetails?.packagePrice || matchedPkg.price;
  const pkgName = studentDetails?.selectedPackage || matchedPkg.name;

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
          maxWidth: '780px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
          overflow: 'hidden',
        }}
      >
        {/* Top Header */}
        <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo height={40} />
          <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} /> Payment Pending Review
          </div>
        </div>

        <div style={{ padding: '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Registration Received!
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9375rem', maxWidth: '560px', margin: '0 auto' }}>
              Thank you for registering with Ahsora Meds Academy. Please complete your package payment below to activate full portal access.
            </p>
          </div>

          {/* Selected Package Banner */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '2px solid #3B82F6',
              borderRadius: '18px',
              padding: '20px 24px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Selected Academy Package
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>
                {pkgName}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '4px' }}>
                {matchedPkg.description}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Payable</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#16A34A' }}>
                {pkgPrice}
              </div>
            </div>
          </div>

          {/* Student Profile Overview Card */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              📋 Student Information Summary
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={18} color="#2563EB" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Full Name</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>{studentDetails?.fullName || studentDetails?.full_name || 'Student'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#2563EB" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Email</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>{studentDetails?.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={18} color="#2563EB" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Country</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>{studentDetails?.country || 'Italy'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#2563EB" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>WhatsApp Number</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>{studentDetails?.whatsappNumber || studentDetails?.whatsapp_number || 'Not specified'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Transfer Details */}
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              💳 Payment Instructions & Bank Details
            </div>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #FEF3C7', borderRadius: '12px', padding: '16px' }}>
              {[
                { label: 'Bank Name', value: 'Ahsora Global Partner Bank (HBL / Meezan)' },
                { label: 'Account Title', value: 'Ahsora Meds Academy Pvt Ltd' },
                { label: 'Account Number', value: '0123-4567890-001' },
                { label: 'IBAN Code', value: 'PK01DEMO0000000001234567' },
                { label: 'SWIFT / BIC', value: 'DEMOPKKAXXX' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontSize: '0.875rem' }}>{label}</span>
                  <span style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'monospace' }}>{value}</span>
                </div>
              ))}
            </div>

            <p style={{ color: '#92400E', fontSize: '0.8125rem', marginTop: '16px', lineHeight: 1.6 }}>
              📨 After completing payment, send your transaction screenshot/receipt to <strong>admissions@ahsorameds.com</strong> or via WhatsApp to <strong>+92 300 1234567</strong> with your email (<strong>{studentDetails?.email}</strong>). Our admissions team will verify and activate your portal access within 12-24 hours.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ flex: 1, minWidth: '220px', padding: '14px', fontSize: '0.9375rem', fontWeight: 700, justifyContent: 'center' }}
            >
              Check Verification Status
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '14px 24px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PendingPaymentPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>Loading...</div>}>
      <PendingPaymentContent />
    </Suspense>
  );
}
