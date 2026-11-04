'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getPackageByIdOrName, CoursePackage } from '@/lib/packages';
import { useAppStore } from '@/lib/store';
import { Clock, Globe, LogOut, Phone, User, Mail, MapPin, Hash, RefreshCw, CheckCircle2, MessageCircle, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { event } from '@/lib/gtag';

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
          packagePrice: queryPrice || currentData?.packagePrice || getPackageByIdOrName(queryPkgName).price,
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

  const effectivePackageName = queryPkgName || studentDetails?.selectedPackage || studentDetails?.selected_package;
  const matchedPkg: CoursePackage = getPackageByIdOrName(effectivePackageName);
  const pkgName = matchedPkg.name;
  const pkgPrice = queryPrice || studentDetails?.packagePrice || studentDetails?.package_price || matchedPkg.price;

  const studentName = studentDetails?.fullName || studentDetails?.full_name || 'Student';
  const studentEmail = studentDetails?.email || queryEmail || '';
  const studentPhone = studentDetails?.whatsappNumber || studentDetails?.whatsapp_number || studentDetails?.phone || '';
  const studentCountry = studentDetails?.country || 'International';
  const studentAmaId = studentDetails?.ama_id || '';

  // Template message for WhatsApp
  const whatsappTemplate = `Hi Ahsora Med Academy Admissions Team! 🎓

I have just completed my registration. Here are my enrollment details:
• Name: ${studentName}
• Email: ${studentEmail}
• WhatsApp Number: ${studentPhone || 'Not specified'}
• Package Name: ${pkgName} (${pkgPrice})
• Enrollment ID: ${studentAmaId || 'Pending'}
• Country: ${studentCountry}

Please let me know the payment method suitable for me and provide instructions so I can complete payment and receive portal access within 24 hours. Thank you!`;

  const whatsappUrl = `https://wa.me/393333444479?text=${encodeURIComponent(whatsappTemplate)}`;

  // Log conversion and registration_received Google tag events
  useEffect(() => {
    if (!loading && (studentDetails || queryPkgName)) {
      event('registration_received', {
        package_name: pkgName,
        package_price: pkgPrice,
        ama_id: studentAmaId,
        student_country: studentCountry,
      });
      event('conversion', {
        send_to: 'G-ZLZPB1DD0Y',
        value: pkgPrice,
        currency: 'EUR',
      });
    }
  }, [loading, studentDetails, queryPkgName, pkgName, pkgPrice, studentAmaId, studentCountry]);

  // Template for Gmail / Email
  const emailSubject = `Registration Received - Payment Method Inquiry (${studentName} - ${studentAmaId || pkgName})`;
  const emailTemplate = `Dear Ahsora Meds Academy Admissions Team,

I have submitted my registration for Ahsora Med Academy. Here are my registration details:

• Name: ${studentName}
• Email: ${studentEmail}
• WhatsApp Number: ${studentPhone || 'Not specified'}
• Package Name: ${pkgName} (${pkgPrice})
• Enrollment ID: ${studentAmaId || 'Pending'}
• Country: ${studentCountry}

Please let me know the payment method suitable for me and provide instructions so I can complete payment and receive my portal access within 24 hours.

Thank you!
${studentName}`;

  // Direct Gmail web compose link
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ahsoramedsacademy@gmail.com&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailTemplate)}`;
  const mailtoUrl = `mailto:ahsoramedsacademy@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailTemplate)}`;

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
          maxWidth: '820px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* Top Header */}
        <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <Logo height={40} />
          <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> Registration Received
          </div>
        </div>

        <div style={{ padding: '36px 32px' }}>
          {/* Main Hero Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.25)',
              }}
            >
              <CheckCircle2 size={38} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginBottom: '10px', letterSpacing: '-0.5px' }}>
              Registration Received!
            </h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
              Our team will contact you and let you know the payment method suitable for you. After the payment, you will receive full portal access within 24 hours.
            </p>
          </div>

          {/* 3-Step Enrollment Timeline Card */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '18px',
              padding: '24px',
              marginBottom: '28px',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
              ⚡ What Happens Next
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>1. Registration Logged</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', lineHeight: 1.4 }}>
                    Your student file &amp; package choice have been safely recorded in our admissions directory.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0284C7', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                  2
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>2. Payment Coordination</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', lineHeight: 1.4 }}>
                    Our team will contact you via WhatsApp or Email to coordinate the easiest payment method for your country.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#8B5CF6', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                  3
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>3. Portal Access Within 24h</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', lineHeight: 1.4 }}>
                    Once payment is received, your portal access and course materials unlock immediately within 24 hours.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Package Banner */}
          <div
            style={{
              backgroundColor: matchedPkg.id === 'elite' ? '#FFF7ED' : '#F0FDF4',
              border: matchedPkg.id === 'elite' ? '2px solid #F97316' : '2px solid #10B981',
              borderRadius: '18px',
              padding: '20px 26px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: matchedPkg.id === 'elite' ? '#C2410C' : '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Selected Academy Package
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', marginTop: '3px' }}>
                {pkgName}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '4px', maxWidth: '520px', lineHeight: 1.4 }}>
                {matchedPkg.description}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Package Fee</div>
              <div style={{ fontSize: '2.3rem', fontWeight: 900, color: matchedPkg.id === 'elite' ? '#EA580C' : '#16A34A', lineHeight: 1.1 }}>
                {pkgPrice}
              </div>
            </div>
          </div>

          {/* Student Profile Overview Card */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '24px', marginBottom: '32px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📋</span> Official Enrollment Summary
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="#059669" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Student Full Name</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{studentName}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={18} color="#059669" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Registered Email</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', wordBreak: 'break-all' }}>{studentEmail || '—'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={18} color="#059669" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>WhatsApp Number</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>{studentPhone || '—'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={18} color="#059669" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Country of Residence</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{studentCountry}</div>
                </div>
              </div>

              {studentAmaId && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hash size={18} color="#059669" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Enrollment ID</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>{studentAmaId}</div>
                  </div>
                </div>
              )}

              {studentDetails?.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={18} color="#EA580C" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Physical Address</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>{studentDetails.address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Two Direct Contact Action Buttons (Requested) */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                Want to accelerate your payment and get your portal access even faster?
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                Click below to instantly connect with our admissions team with your details pre-filled:
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {/* Button 1: Contact via Email (Direct Gmail Compose) */}
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  event('contact_admissions_email', {
                    package: pkgName,
                    student_name: studentName,
                    ama_id: studentAmaId,
                  });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  padding: '16px 24px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 20px -4px rgba(220, 38, 38, 0.35)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Mail size={20} />
                <span>Contact via Email</span>
                <ExternalLink size={14} style={{ opacity: 0.8 }} />
              </a>

              {/* Button 2: Contact via WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  event('contact_admissions_whatsapp', {
                    package: pkgName,
                    student_name: studentName,
                    ama_id: studentAmaId,
                  });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  padding: '16px 24px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 20px -4px rgba(22, 163, 74, 0.35)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803D';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#16A34A';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <MessageCircle size={20} />
                <span>Contact via WhatsApp</span>
                <ExternalLink size={14} style={{ opacity: 0.8 }} />
              </a>
            </div>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Don't use web Gmail? <a href={mailtoUrl} style={{ color: '#0284C7', textDecoration: 'underline' }}>Open in default mail client</a>
              </span>
            </div>
          </div>

          {/* Status Alert if Manual Check Ran */}
          {statusMessage && (
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #BFDBFE',
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

          {/* Bottom Utility Controls */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', borderTop: '1px solid #F1F5F9', paddingTop: '24px' }}>
            <button
              onClick={() => loadProfileAndRegistration(true)}
              disabled={checkingStatus}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '14px 20px',
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                cursor: checkingStatus ? 'wait' : 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <RefreshCw size={16} className={checkingStatus ? 'animate-spin' : ''} />
              {checkingStatus ? 'Verifying with Admissions Server...' : 'Check Approval Status'}
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: '14px 24px',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#EF4444';
                e.currentTarget.style.borderColor = '#FCA5A5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748B';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <LogOut size={16} /> Exit / Sign Out
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
