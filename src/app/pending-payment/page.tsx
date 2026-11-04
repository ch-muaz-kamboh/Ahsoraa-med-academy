'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getPackageByIdOrName, CoursePackage } from '@/lib/packages';
import { useAppStore } from '@/lib/store';
import {
  Clock,
  Globe,
  LogOut,
  Phone,
  User,
  Mail,
  MapPin,
  Hash,
  RefreshCw,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Send,
  Zap,
} from 'lucide-react';
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

  // Extract from query params safely
  const queryPkgName = searchParams ? searchParams.get('package') : null;
  const queryPrice = searchParams ? searchParams.get('price') : null;
  const queryEmail = searchParams ? searchParams.get('email') : null;

  const activateAndEnterPortal = useCallback(
    (data: any) => {
      try {
        const email = String(data?.email || queryEmail || '').trim();
        const fullName = String(data?.fullName || data?.full_name || 'Student');
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = data?.firstName || nameParts[0] || 'Student';
        const lastName = data?.lastName || nameParts.slice(1).join(' ') || '';
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
      } catch (err) {
        console.warn('Portal auto-redirect notice:', err);
      }
    },
    [loginStudent, queryEmail, queryPkgName, queryPrice, router]
  );

  const loadProfileAndRegistration = useCallback(
    async (isManualCheck = false) => {
      if (isManualCheck) {
        setCheckingStatus(true);
        setStatusMessage(null);
      }

      let currentData: any = null;

      // 1. Check local storage recent registration or currentUser
      try {
        if (typeof window !== 'undefined') {
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
        }
      } catch (e) {
        console.warn('LocalStorage read notice:', e);
      }

      // If query parameters are present, prioritize them
      if (queryPkgName) {
        currentData = {
          ...currentData,
          selectedPackage: queryPkgName,
          packagePrice: queryPrice || currentData?.packagePrice || getPackageByIdOrName(queryPkgName).price,
        };
      }

      const targetEmail = String(queryEmail || currentData?.email || '').toLowerCase().trim();

      // 2. Check local admin approval list (if admin approved on the same device/browser)
      let locallyApproved = false;
      if (targetEmail && typeof window !== 'undefined') {
        try {
          const approvedEmailsRaw = localStorage.getItem('ahsora_approved_emails');
          if (approvedEmailsRaw) {
            const approvedEmails: string[] = JSON.parse(approvedEmailsRaw);
            if (Array.isArray(approvedEmails) && approvedEmails.some((em) => String(em).toLowerCase().trim() === targetEmail)) {
              locallyApproved = true;
            }
          }
          const adminListRaw = localStorage.getItem('adminStudentList');
          if (adminListRaw) {
            const adminList: any[] = JSON.parse(adminListRaw);
            if (Array.isArray(adminList)) {
              const matchedLocal = adminList.find(
                (s) => s && String(s.email || '').toLowerCase().trim() === targetEmail
              );
              if (matchedLocal) {
                currentData = {
                  ...currentData,
                  ...matchedLocal,
                  fullName: matchedLocal.fullName || matchedLocal.full_name || currentData?.fullName,
                  country: matchedLocal.country || currentData?.country,
                  address: matchedLocal.address || currentData?.address,
                  whatsappNumber:
                    matchedLocal.whatsappNumber ||
                    matchedLocal.whatsapp_number ||
                    matchedLocal.phone ||
                    currentData?.whatsappNumber,
                  selectedPackage:
                    matchedLocal.selectedPackage ||
                    matchedLocal.selected_package ||
                    currentData?.selectedPackage,
                  packagePrice:
                    matchedLocal.packagePrice ||
                    matchedLocal.package_price ||
                    currentData?.packagePrice,
                  ama_id: matchedLocal.ama_id || currentData?.ama_id,
                };
                if (matchedLocal.paymentApproved === true || matchedLocal.payment_approved === true) {
                  locallyApproved = true;
                }
              }
            }
          }
        } catch (e) {
          console.warn('Local admin check notice:', e);
        }
      }

      // 3. Query server API /api/admin/students for live cross-device approval & synced student metadata
      let serverApproved: boolean | null = null;
      if (targetEmail) {
        try {
          const res = await fetch(`/api/admin/students?t=${Date.now()}`, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (json && json.success && Array.isArray(json.students)) {
              const matchedServer = json.students.find(
                (s: any) => s && String(s.email || '').toLowerCase().trim() === targetEmail
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
          'Your registration is safely recorded! Once our admissions team approves your payment, you will instantly get full portal access. You can also recheck status at any time.'
        );
      }
    },
    [activateAndEnterPortal, queryEmail, queryPkgName, queryPrice]
  );

  useEffect(() => {
    loadProfileAndRegistration(false);
    // Poll every 10 seconds so when Admin approves, the student enters seamlessly
    const interval = setInterval(() => {
      loadProfileAndRegistration(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [loadProfileAndRegistration]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('recentRegistration');
        localStorage.removeItem('ahsora_studentLoggedIn');
      } catch {}
    }
    router.push('/login');
  };

  const effectivePackageName = queryPkgName || studentDetails?.selectedPackage || studentDetails?.selected_package;
  const matchedPkg: CoursePackage = getPackageByIdOrName(effectivePackageName);
  const pkgName = matchedPkg.name;
  const pkgPrice = queryPrice || studentDetails?.packagePrice || studentDetails?.package_price || matchedPkg.price;

  const studentName = String(studentDetails?.fullName || studentDetails?.full_name || 'Student');
  const studentEmail = String(studentDetails?.email || queryEmail || '');
  const studentPhone = String(studentDetails?.whatsappNumber || studentDetails?.whatsapp_number || studentDetails?.phone || '');
  const studentCountry = String(studentDetails?.country || 'International');
  const studentAmaId = String(studentDetails?.ama_id || '');

  // Log conversion and registration_received Google tag events safely
  useEffect(() => {
    if (!loading) {
      try {
        const numericVal = parseFloat(String(pkgPrice).replace(/[^0-9.]/g, '')) || 0;
        event('registration_received', {
          package_name: pkgName,
          package_price: numericVal,
          ama_id: studentAmaId,
          student_country: studentCountry,
        });
        event('conversion', {
          send_to: 'G-ZLZPB1DD0Y',
          value: numericVal,
          currency: 'EUR',
        });
      } catch (err) {
        console.warn('Analytics event warning:', err);
      }
    }
  }, [loading, pkgName, pkgPrice, studentAmaId, studentCountry]);

  // Template message for WhatsApp
  const whatsappTemplate = `Hi Ahsora Med Academy Admissions Team! 🎓

I have just completed my registration. Here are my enrollment details:
• Name: ${studentName}
• Email: ${studentEmail || 'Registered'}
• WhatsApp Number: ${studentPhone || 'Not specified'}
• Package Name: ${pkgName} (${pkgPrice})
• Enrollment ID: ${studentAmaId || 'Pending'}
• Country: ${studentCountry}

Please let me know the payment method suitable for me and provide instructions so I can complete payment and receive my portal access within 24 hours. Thank you!`;

  const whatsappUrl = `https://wa.me/393333444479?text=${encodeURIComponent(whatsappTemplate)}`;

  // Template for Gmail / Email
  const emailSubject = `Registration Received - Payment Method Inquiry (${studentName} - ${studentAmaId || pkgName})`;
  const emailTemplate = `Dear Ahsora Meds Academy Admissions Team,

I have submitted my registration for Ahsora Med Academy. Here are my registration details:

• Name: ${studentName}
• Email: ${studentEmail || 'Registered'}
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
        backgroundColor: '#0A0F1D',
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, rgba(10, 15, 29, 0) 65%), linear-gradient(180deg, #090D1A 0%, #0D1527 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(140px, 18vw, 190px) 18px 70px',
        fontFamily: 'var(--font-heading), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            padding: '22px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Logo height={38} />
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34D399',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.8125rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              letterSpacing: '0.3px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981',
                display: 'inline-block',
              }}
            />
            Registration Received
          </div>
        </div>

        <div style={{ padding: 'clamp(28px, 4vw, 44px)' }}>
          {/* Main Hero Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                color: '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                boxShadow: '0 12px 28px -6px rgba(5, 150, 105, 0.3), inset 0 0 0 2px #A7F3D0',
              }}
            >
              <CheckCircle2 size={42} strokeWidth={2.3} />
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                fontWeight: 900,
                color: '#0F172A',
                marginBottom: '12px',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
              }}
            >
              Registration Received!
            </h1>

            <p
              style={{
                color: '#475569',
                fontSize: 'clamp(0.98rem, 1.8vw, 1.125rem)',
                maxWidth: '680px',
                margin: '0 auto',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              Our team will contact you and let you know the payment method suitable for you. After the payment, you will get portal access within 24 hours.
            </p>
          </div>

          {/* TWO PRIMARY ACTION BUTTONS (GMAIL & WHATSAPP) */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '22px',
              border: '1.5px solid #E2E8F0',
              padding: 'clamp(20px, 3vw, 28px)',
              marginBottom: '32px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '8px',
                }}
              >
                <Zap size={14} /> Fast-Track Payment Support
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                Connect directly with Admissions to get payment details immediately:
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
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
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  padding: '20px 22px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #EA4335 0%, #D93025 100%)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  boxShadow: '0 12px 28px -6px rgba(234, 67, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 18px 36px -8px rgba(234, 67, 53, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(234, 67, 53, 0.4)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Mail size={20} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.2px' }}>Contact via Email</span>
                  </div>
                  <ExternalLink size={18} style={{ opacity: 0.85 }} />
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.92)', lineHeight: 1.4, paddingLeft: '48px' }}>
                  Opens direct Gmail compose with your registration details pre-filled.
                </div>
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
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  padding: '20px 22px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  boxShadow: '0 12px 28px -6px rgba(37, 211, 102, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 18px 36px -8px rgba(37, 211, 102, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(37, 211, 102, 0.4)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MessageCircle size={20} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.2px' }}>Contact via WhatsApp</span>
                  </div>
                  <ExternalLink size={18} style={{ opacity: 0.85 }} />
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.92)', lineHeight: 1.4, paddingLeft: '48px' }}>
                  Instant WhatsApp chat with admissions coordinator (+39 333 344 4479).
                </div>
              </a>
            </div>

            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Don't use web Gmail?{' '}
                <a href={mailtoUrl} style={{ color: '#0284C7', textDecoration: 'underline', fontWeight: 600 }}>
                  Open default email client
                </a>
              </span>
            </div>
          </div>

          {/* Selected Package Banner */}
          <div
            style={{
              background: matchedPkg.id === 'elite'
                ? 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'
                : 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
              border: matchedPkg.id === 'elite' ? '2px solid #F97316' : '2px solid #10B981',
              borderRadius: '20px',
              padding: '24px 28px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: matchedPkg.id === 'elite' ? '#C2410C' : '#047857',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '4px',
                }}
              >
                Selected Academy Package
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                {pkgName}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '4px', maxWidth: '500px', lineHeight: 1.45 }}>
                {matchedPkg.description}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Package Fee</div>
              <div
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                  fontWeight: 900,
                  color: matchedPkg.id === 'elite' ? '#EA580C' : '#059669',
                  lineHeight: 1.1,
                }}
              >
                {pkgPrice}
              </div>
            </div>
          </div>

          {/* Student Profile Overview Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '24px 28px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={18} color="#059669" /> Registered Applicant Details
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="#059669" />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Full Name</div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>{studentName}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={18} color="#059669" />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Registered Email</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', wordBreak: 'break-all' }}>{studentEmail || '—'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={18} color="#059669" />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>WhatsApp Number</div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#059669' }}>{studentPhone || '—'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={18} color="#059669" />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Country</div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A' }}>{studentCountry}</div>
                </div>
              </div>

              {studentAmaId && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hash size={18} color="#059669" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Enrollment ID</div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#059669', fontFamily: 'monospace' }}>{studentAmaId}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3-Step Enrollment Timeline Card */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '24px 28px',
              marginBottom: '32px',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
              ⚡ What Happens Next
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>1. Registration Logged</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '3px', lineHeight: 1.45 }}>
                    Your applicant record and package choice are safely saved in our directory.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0284C7', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                  2
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>2. Payment Coordination</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '3px', lineHeight: 1.45 }}>
                    Our team provides the most convenient payment method (Bank Transfer, Card, etc.).
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#8B5CF6', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                  3
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>3. Portal Access Within 24h</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '3px', lineHeight: 1.45 }}>
                    Upon payment confirmation, your student portal and prep materials unlock instantly.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Alert if Manual Check Ran */}
          {statusMessage && (
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '24px',
                color: '#1E40AF',
                fontSize: '0.9rem',
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
                padding: '14px 22px',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '9px',
                borderRadius: '14px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                cursor: checkingStatus ? 'wait' : 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <RefreshCw size={17} className={checkingStatus ? 'animate-spin' : ''} />
              {checkingStatus ? 'Checking Status with Server...' : 'Check Approval Status'}
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: '14px 24px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
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
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0F1D',
            color: '#FFFFFF',
            fontWeight: 700,
          }}
        >
          Loading registration details...
        </div>
      }
    >
      <PendingPaymentContent />
    </Suspense>
  );
}
