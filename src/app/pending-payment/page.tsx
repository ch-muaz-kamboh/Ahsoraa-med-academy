'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getPackageByIdOrName, CoursePackage } from '@/lib/packages';
import { useAppStore } from '@/lib/store';
import { Clock, Globe, LogOut, Phone, User, Mail, MapPin, Hash, RefreshCw, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/brand/Logo';

function PendingPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginStudent } = useAppStore();

  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Extract from query params if passed from registration or login
  const queryPkgName = searchParams ? searchParams.get('package') : null;
  const queryPrice = searchParams ? searchParams.get('price') : null;
  const queryEmail = searchParams ? searchParams.get('email') : null;

  const activateAndEnterPortal = useCallback(
    (data: any) => {
      const email = (data?.email || queryEmail || '').trim();
      const fullName = data?.fullName || data?.full_name || 'Student';
      const firstName = data?.firstName || fullName.split(' ')[0] || 'Student';
      const lastName = data?.lastName || fullName.split(' ').slice(1).join(' ') || '';
      const pkg = data?.selectedPackage || data?.selected_package || queryPkgName || 'Ahsora IMAT Ascend';
      const price = data?.packagePrice || data?.package_price || queryPrice || '€299';

      loginStudent(email, firstName, lastName, {
        selectedPackage: pkg,
        packagePrice: price,
        country: data?.country || '',
        phone: data?.whatsappNumber || data?.whatsapp_number || data?.phone || '',
        whatsappNumber: data?.whatsappNumber || data?.whatsapp_number || data?.phone || '',
        address: data?.address || '',
        ama_id: data?.ama_id || '',
        id: data?.id,
      });

      router.push('/portal/dashboard');
    },
    [loginStudent, queryEmail, queryPkgName, queryPrice, router]
  );

  const loadProfileAndRegistration = useCallback(
    async (isManualCheck = false) => {
      if (isManualCheck) {
        setCheckingStatus(true);
        setStatusMessage(null);
      }

      // 1. Check query param first (authoritative from the registration checkout button)
      let currentData: any = null;

      // 2. Check local storage recent registration or currentUser
      try {
        const cached = localStorage.getItem('recentRegistration');
        if (cached) {
          currentData = JSON.parse(cached);
        }
        if (!currentData) {
          const curUser = localStorage.getItem('ahsora_currentUser');
          if (curUser) {
            currentData = JSON.parse(curUser);
          }
        }
      } catch (e) {
        console.error(e);
      }

      // If query parameters are present, prioritize them over stale cached records
      if (queryPkgName) {
        currentData = {
          ...currentData,
          selectedPackage: queryPkgName,
          packagePrice: queryPrice || currentData?.packagePrice,
        };
      }

      const targetEmail = (queryEmail || currentData?.email || '').toLowerCase().trim();

      // 2. Check local admin approval list (if admin approved on the same device/browser)
      let locallyApproved = false;
      if (targetEmail) {
        try {
          const approvedEmailsRaw = localStorage.getItem('ahsora_approved_emails');
          if (approvedEmailsRaw) {
            const approvedEmails: string[] = JSON.parse(approvedEmailsRaw);
            if (approvedEmails.some((em) => em.toLowerCase().trim() === targetEmail)) {
              locallyApproved = true;
            }
          }
          const adminListRaw = localStorage.getItem('adminStudentList');
          if (adminListRaw) {
            const adminList: any[] = JSON.parse(adminListRaw);
            const matchedLocal = adminList.find((s) => (s.email || '').toLowerCase().trim() === targetEmail);
            if (matchedLocal) {
              currentData = {
                ...currentData,
                ...matchedLocal,
                fullName: matchedLocal.fullName || matchedLocal.full_name || currentData?.fullName,
                country: matchedLocal.country || currentData?.country,
                address: matchedLocal.address || currentData?.address,
                whatsappNumber: matchedLocal.whatsappNumber || matchedLocal.whatsapp_number || matchedLocal.phone || currentData?.whatsappNumber,
                selectedPackage: matchedLocal.selectedPackage || matchedLocal.selected_package || currentData?.selectedPackage,
                packagePrice: matchedLocal.packagePrice || matchedLocal.package_price || currentData?.packagePrice,
                ama_id: matchedLocal.ama_id || currentData?.ama_id,
              };
              if (matchedLocal.paymentApproved === true || matchedLocal.payment_approved === true) {
                locallyApproved = true;
              }
            }
          }
        } catch { }
      }

      // 3. Query server API /api/admin/students for live cross-device approval & synced student metadata
      let serverApproved: boolean | null = null;
      if (targetEmail) {
        try {
          const res = await fetch(`/api/admin/students?t=${Date.now()}`, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.students)) {
              const matchedServer = json.students.find(
                (s: any) => (s.email || '').toLowerCase().trim() === targetEmail
              );
              if (matchedServer) {
                serverApproved = Boolean(matchedServer.payment_approved ?? matchedServer.paymentApproved);
                currentData = {
                  ...currentData,
                  ...matchedServer,
                  fullName: matchedServer.full_name || matchedServer.fullName || currentData?.fullName,
                  country: matchedServer.country || currentData?.country,
                  address: matchedServer.address || currentData?.address,
                  whatsappNumber:
                    matchedServer.whatsapp_number ||
                    matchedServer.whatsappNumber ||
                    matchedServer.phone ||
                    currentData?.whatsappNumber,
                  selectedPackage:
                    queryPkgName ||
                    matchedServer.selected_package ||
                    matchedServer.selectedPackage ||
                    currentData?.selectedPackage,
                  packagePrice:
                    queryPrice ||
                    matchedServer.package_price ||
                    matchedServer.packagePrice ||
                    currentData?.packagePrice,
                  ama_id: matchedServer.ama_id || currentData?.ama_id,
                };
              }
            }
          }
        } catch (err) {
          console.warn('Server approval check warning:', err);
        }
      }

      // 4. Query Supabase auth user profile if logged in
      let profileApproved = false;
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const meta = user.user_metadata || {};
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profileData) {
            if (profileData.payment_approved === true) {
              profileApproved = true;
            }
            currentData = {
              ...currentData,
              ...profileData,
              fullName: currentData?.fullName || currentData?.full_name || profileData.full_name || meta.full_name,
              email: currentData?.email || profileData.email || user.email,
              country: currentData?.country || profileData.country || meta.country,
              address: currentData?.address || profileData.address || meta.address,
              whatsappNumber:
                currentData?.whatsappNumber ||
                currentData?.whatsapp_number ||
                profileData.whatsapp_number ||
                meta.whatsapp_number,
              selectedPackage:
                currentData?.selectedPackage ||
                currentData?.selected_package ||
                profileData.selected_package ||
                meta.selected_package,
              packagePrice:
                currentData?.packagePrice ||
                currentData?.package_price ||
                profileData.package_price ||
                meta.package_price,
              ama_id: profileData.ama_id || currentData?.ama_id || meta.ama_id,
            };
          }
        }
      } catch (e) {
        console.warn('Supabase fetch fallback:', e);
      }

      // 5. Apply query param overrides if present
      if (!currentData) {
        currentData = {
          fullName: 'Student Applicant',
          email: queryEmail || '',
          country: '',
          address: '',
          whatsappNumber: '',
          selectedPackage: queryPkgName || 'Ahsora IMAT Ascend',
          packagePrice: queryPrice || '€299',
          ama_id: '',
        };
      } else {
        if (queryPkgName) currentData.selectedPackage = queryPkgName;
        if (queryPrice) currentData.packagePrice = queryPrice;
        if (queryEmail && !currentData.email) currentData.email = queryEmail;
      }

      const isFinalApproved =
        serverApproved === true || locallyApproved === true || (serverApproved === null && profileApproved === true);

      if (isFinalApproved) {
        activateAndEnterPortal(currentData);
        return;
      }

      setStudentDetails(currentData);
      setLoading(false);
      if (isManualCheck) {
        setCheckingStatus(false);
        setStatusMessage(
          'Your account is still awaiting Admin payment verification. Once the admin approves your account in Student Management, click "Check Approval Status" to enter your portal immediately.'
        );
      }
    },
    [activateAndEnterPortal, queryEmail, queryPkgName, queryPrice]
  );

  useEffect(() => {
    loadProfileAndRegistration(false);
    // Poll every 8 seconds so when Admin clicks Approve, the student is automatically let in
    const interval = setInterval(() => {
      loadProfileAndRegistration(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [loadProfileAndRegistration]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) { }
    localStorage.removeItem('recentRegistration');
    localStorage.removeItem('ahsora_studentLoggedIn');
    router.push('/login');
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
        padding: '175px 20px 60px',
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
              backgroundColor: '#F0FFF4',
              border: '2px solid #10B981',
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
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
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
                <User size={18} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Full Name</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>{studentDetails?.fullName || studentDetails?.full_name || 'Student'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Email</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>{studentDetails?.email || '—'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={18} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Country</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>{studentDetails?.country || '—'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>WhatsApp Number</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>{studentDetails?.whatsappNumber || studentDetails?.whatsapp_number || studentDetails?.phone || '—'}</div>
                </div>
              </div>

              {studentDetails?.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} color="#059669" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Physical Address</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>{studentDetails.address}</div>
                  </div>
                </div>
              )}

              {studentDetails?.ama_id && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Hash size={18} color="#059669" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Enrollment ID</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#059669', fontFamily: 'monospace' }}>{studentDetails.ama_id}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {statusMessage && (
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '20px',
                color: '#1E40AF',
                fontSize: '0.875rem',
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              ℹ️ {statusMessage}
            </div>
          )}

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
              📨 After completing payment, send your transaction screenshot/receipt to <strong>ahsoramedsacademy@gmail.com</strong> or via WhatsApp to <a href="https://wa.me/393333444479" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: 800 }}>+39 333 3444 479</a> with your email (<strong>{studentDetails?.email}</strong>). Our admissions team will verify and activate your portal access within 12-24 hours.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/393333444479?text=${encodeURIComponent(`Hi Ahsora Admissions, I have submitted payment for ${pkgName} (${pkgPrice}) under email ${studentDetails?.email}. Here is my payment receipt:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#16A34A',
                borderColor: '#16A34A',
                padding: '14px 24px',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                flex: 1,
                minWidth: '220px',
              }}
            >
              Send Receipt via WhatsApp
            </a>
            <button
              onClick={() => loadProfileAndRegistration(true)}
              disabled={checkingStatus}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '14px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                cursor: checkingStatus ? 'wait' : 'pointer',
              }}
            >
              <RefreshCw size={16} />
              {checkingStatus ? 'Checking Status...' : 'Check Approval Status'}
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
