'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import PortalSidebar from '@/components/layout/PortalSidebar';
import { useAppStore } from '@/lib/store';
import { Bell, Lock, Mail, User, Eye, EyeOff, Check, Loader2, LogOut, Flame, Clock, Sparkles, GraduationCap, AlertTriangle, CheckCircle2, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { getStudentNotifications, markAllNotificationsAsRead, markNotificationAsRead, StudentPortalNotification } from '@/lib/notifications';
import { createClient } from '@/lib/supabase/client';


import {
  getStudentPackageMapping,
  saveStudentPackageMapping,
  resolveEffectivePackage,
  getPackageByIdOrName,
  getStudentTier,
} from '@/lib/packages';
import Logo from '@/components/brand/Logo';
import PortalMovingStrip from '@/components/portal/PortalMovingStrip';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const { studentLoggedIn, setStudentLoggedIn, loginStudent, logoutStudent, liveTestSession, testAttempts, studentMistakes, currentUser, updateProfile } = useAppStore();

  const activeStreakDays = React.useMemo(() => {
    const dates = new Set<string>();
    testAttempts.forEach((a) => {
      const d = a.submittedAt || a.startedAt;
      if (d) dates.add(new Date(d).toDateString());
    });
    studentMistakes.forEach((m) => {
      if (m.failedAt) dates.add(new Date(m.failedAt).toDateString());
    });
    return dates.size;
  }, [testAttempts, studentMistakes]);

  // Instant auth determination: do not show blocking loader if already verified in store or localStorage
  const isAlreadyLoggedIn = studentLoggedIn || (typeof window !== 'undefined' && localStorage.getItem('ahsora_studentLoggedIn') === 'true');
  const [checkingAuth, setCheckingAuth] = useState(!isAlreadyLoggedIn);
  const hasFetchedRef = useRef(false);

  // Student Notifications State
  const [notifications, setNotifications] = useState<StudentPortalNotification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const email = currentUser?.email || 'student@ahsora.com';
    const loadNotifs = () => setNotifications(getStudentNotifications(email));
    loadNotifs();

    window.addEventListener('ahsora_portal_notifications_updated', loadNotifs);
    window.addEventListener('ahsora_elite_updated', loadNotifs);
    window.addEventListener('storage', loadNotifs);

    const handleClickOutside = (e: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('ahsora_portal_notifications_updated', loadNotifs);
      window.removeEventListener('ahsora_elite_updated', loadNotifs);
      window.removeEventListener('storage', loadNotifs);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currentUser?.email]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasUrgentNotif = notifications.some((n) => !n.read && (n.level === 'urgent' || n.type === 'medpath_rejected'));

  const isPortalLocked = liveTestSession && currentUser && testAttempts.some(attempt => attempt.testId === liveTestSession.testId && attempt.studentId === currentUser.id && attempt.status === 'in_progress');
  const hasCompletedLiveTest = liveTestSession && currentUser && testAttempts.some(attempt => attempt.testId === liveTestSession.testId && attempt.studentId === currentUser.id && attempt.status === 'completed');

  // Enforce lockdown: if locked and not on the test page, force redirect
  useEffect(() => {
    if (isPortalLocked && liveTestSession) {
      const targetUrl = `/portal/tests/${liveTestSession.testId}/take`;
      if (!pathname?.startsWith(targetUrl)) {
        router.replace(targetUrl);
      }
    }
  }, [isPortalLocked, liveTestSession, pathname, router]);

  // Pre-seed realUser from current store or localStorage to prevent any UI flicker
  const [realUser, setRealUser] = useState<{ fullName: string, firstName: string, initials: string } | null>(() => {
    if (currentUser?.firstName) {
      const fullName = `${currentUser.firstName} ${currentUser.lastName || ''}`.trim();
      return {
        fullName,
        firstName: currentUser.firstName,
        initials: `${currentUser.firstName[0]}${currentUser.lastName?.[0] || ''}`.toUpperCase(),
      };
    }
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ahsora_currentUser');
        if (saved) {
          const parsed = JSON.parse(saved);
          const fName = parsed.firstName || 'Student';
          const lName = parsed.lastName || '';
          return {
            fullName: `${fName} ${lName}`.trim(),
            firstName: fName,
            initials: `${fName[0]}${lName[0] || ''}`.toUpperCase(),
          };
        }
      } catch {}
    }
    return null;
  });

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    setRealUser(null);
    logoutStudent();
    router.push('/login');
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    // Hard fallback safety: Never leave student stuck on loader for more than 1.2s under any network condition
    const safetyTimer = setTimeout(() => {
      setCheckingAuth(false);
    }, 1200);

    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const userMeta = user.user_metadata || {};
          const metaPackage = userMeta.selected_package || userMeta.selectedPackage;
          const metaPrice = userMeta.package_price || userMeta.packagePrice;
          const userEmail = user.email || '';
          const emailLower = userEmail.toLowerCase().trim();

          // Fetch profile name and approval status from profiles table
          let dbFullName = '';
          let profileApproved = false;
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email, payment_approved')
              .eq('id', user.id)
              .maybeSingle();
            if (profile?.full_name) dbFullName = profile.full_name;
            if (profile?.payment_approved === true) profileApproved = true;
          } catch (err) {
            console.warn('Profile fetch note:', err);
          }

          // Check local approval list
          let locallyApproved = false;
          try {
            const approvedRaw = localStorage.getItem('ahsora_approved_emails');
            if (approvedRaw) {
              const list: string[] = JSON.parse(approvedRaw);
              if (list.some((em) => em.toLowerCase().trim() === emailLower)) {
                locallyApproved = true;
              }
            }
          } catch {}

          // Check server /api/admin/students for authoritative approval & synced student metadata
          let serverApproved: boolean | null = null;
          let serverPkg = '';
          let serverPrice = '';
          let serverCountry = '';
          let serverAddress = '';
          let serverPhone = '';
          let serverAmaId = '';
          try {
            const res = await fetch(`/api/admin/students?t=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
              const json = await res.json();
              if (json.success && Array.isArray(json.students)) {
                const matched = json.students.find(
                  (s: any) => (s.email || '').toLowerCase().trim() === emailLower
                );
                if (matched) {
                  serverApproved = Boolean(matched.payment_approved ?? matched.paymentApproved);
                  serverPkg = matched.selected_package || matched.selectedPackage || '';
                  serverPrice = matched.package_price || matched.packagePrice || '';
                  serverCountry = matched.country || '';
                  serverAddress = matched.address || '';
                  serverPhone = matched.whatsapp_number || matched.whatsappNumber || matched.phone || '';
                  serverAmaId = matched.ama_id || '';
                  if (matched.full_name || matched.fullName) {
                    dbFullName = matched.full_name || matched.fullName;
                  }
                }
              }
            }
          } catch {}

          // Resolve effective package
          const resolvedPkgName =
            serverPkg ||
            metaPackage ||
            getStudentPackageMapping(userEmail)?.selectedPackage ||
            resolveEffectivePackage({ email: userEmail, selectedPackage: currentUser?.selectedPackage });
          const matchedPkg = getPackageByIdOrName(resolvedPkgName);
          const resolvedPrice =
            serverPrice || metaPrice || getStudentPackageMapping(userEmail)?.packagePrice || matchedPkg.price;

          saveStudentPackageMapping(userEmail, matchedPkg.name, resolvedPrice);

          const isApproved =
            serverApproved === true ||
            locallyApproved === true ||
            (serverApproved === null && profileApproved === true);

          if (!isApproved) {
            setStudentLoggedIn(false);
            setRealUser(null);
            router.replace(
              `/pending-payment?package=${encodeURIComponent(matchedPkg.name)}&price=${encodeURIComponent(resolvedPrice)}&email=${encodeURIComponent(userEmail)}`
            );
            return;
          }

          const fullName = dbFullName || userMeta.full_name || `${userMeta.first_name || ''} ${userMeta.last_name || ''}`.trim() || userEmail.split('@')[0] || 'Student';
          const fName = fullName.split(' ')[0] || 'Student';
          const inits = fullName.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || 'ST';

          if (!studentLoggedIn) {
            loginStudent(userEmail, fName, fullName.split(' ').slice(1).join(' '), {
              selectedPackage: matchedPkg.name,
              packagePrice: resolvedPrice,
              fullName,
              country: serverCountry || userMeta.country || '',
              address: serverAddress || userMeta.address || '',
              phone: serverPhone || userMeta.whatsapp_number || userMeta.phone || '',
              whatsappNumber: serverPhone || userMeta.whatsapp_number || userMeta.phone || '',
              ama_id: serverAmaId || userMeta.ama_id || '',
              id: user.id,
            });
          } else {
            updateProfile({
              id: user.id,
              email: userEmail,
              selectedPackage: matchedPkg.name,
              packagePrice: resolvedPrice,
              firstName: fName,
              lastName: fullName.split(' ').slice(1).join(' ') || currentUser.lastName,
              ...(serverCountry || userMeta.country ? { country: serverCountry || userMeta.country } : {}),
              ...(serverAddress || userMeta.address ? { address: serverAddress || userMeta.address } : {}),
              ...(serverPhone || userMeta.whatsapp_number
                ? {
                    phone: serverPhone || userMeta.whatsapp_number,
                    whatsappNumber: serverPhone || userMeta.whatsapp_number,
                  }
                : {}),
              ...(serverAmaId || userMeta.ama_id ? { ama_id: serverAmaId || userMeta.ama_id } : {}),
            });
          }

          setRealUser({ fullName, firstName: fName, initials: inits });
        } else {
          // No active Supabase session found: check local storage fallback
          if (typeof window !== 'undefined') {
            const isLocal = localStorage.getItem('ahsora_studentLoggedIn') === 'true';
            if (!isLocal && !studentLoggedIn) {
              setRealUser(null);
            }
          }
        }
      } catch (e) {
        console.error('Error fetching Supabase user in PortalLayout:', e);
      } finally {
        clearTimeout(safetyTimer);
        setCheckingAuth(false);
      }
    };

    fetchUser();

    return () => {
      clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    if (!checkingAuth) {
      const isLocal = typeof window !== 'undefined' && localStorage.getItem('ahsora_studentLoggedIn') === 'true';
      if (!studentLoggedIn && !isLocal) {
        router.push('/login');
      }
    }
  }, [checkingAuth, studentLoggedIn, router]);

  const isAuthenticated = studentLoggedIn || (typeof window !== 'undefined' && localStorage.getItem('ahsora_studentLoggedIn') === 'true');

  if (checkingAuth && !isAuthenticated) {
    return (
      <div style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC'
      }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#059669' }} />
      </div>
    );
  }

  if (!isAuthenticated && !checkingAuth) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.04) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.04) 0px, transparent 50%), #F8FAFC',
    }}>
      {/* Sidebar */}
      <PortalSidebar 
        userFullName={realUser?.fullName || 'Loading...'} 
        userInitials={realUser?.initials || ''} 
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Student Portal Dynamic Moving Strip (Admin Controlled) */}
        <PortalMovingStrip />

        {/* Top bar */}
        {(() => {
          const effectivePkg = resolveEffectivePackage(currentUser);
          const studentTier = getStudentTier(effectivePkg);
          const currentPkgObj = getPackageByIdOrName(effectivePkg);

          return (
            <header
              style={{
                height: '70px',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 28px',
                position: 'sticky',
                top: 0,
                zIndex: 30,
                pointerEvents: isPortalLocked ? 'none' : 'auto',
                opacity: isPortalLocked ? 0.6 : 1,
                boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.04)',
              }}
            >
              {/* Left: Candidate Greeting & Academic Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      boxShadow: '0 0 10px #10B981',
                    }}
                    title="Active Study Session"
                  />
                  <span style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>
                    {t('portal.welcome_back', 'Welcome')},{' '}
                    <span style={{ color: '#059669', fontWeight: 800 }}>
                      Dr. {realUser ? realUser.firstName : t('portal.student', 'Student')}
                    </span>
                  </span>
                </div>

                <div
                  style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    color: '#B45309',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                  className="sm:inline-flex"
                >
                  <Flame size={13} color="#F59E0B" />
                  <span>{activeStreakDays}-Day Streak</span>
                </div>

                <div
                  style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 11px',
                    borderRadius: '20px',
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    color: '#15803D',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                  className="md:inline-flex"
                >
                  <Clock size={13} color="#16A34A" />
                  <span>IMAT 2027: ~150 Days</span>
                </div>
              </div>

              {/* Right: Tier Badge, Language, Notifications, Avatar, Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Student Package Tier Badge */}
                <div
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background:
                      studentTier === 'elite'
                        ? 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'
                        : studentTier === 'mastery'
                        ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)'
                        : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
                    color:
                      studentTier === 'elite'
                        ? '#C2410C'
                        : studentTier === 'mastery'
                        ? '#047857'
                        : '#334155',
                    border:
                      studentTier === 'elite'
                        ? '1px solid #FDBA74'
                        : studentTier === 'mastery'
                        ? '1px solid #86EFAC'
                        : '1px solid #CBD5E1',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <Sparkles size={12} />
                  <span>{currentPkgObj.name}</span>
                </div>

                {/* Functional Language Switcher for Student Portal */}
                <LanguageSwitcher variant="portal" />

                {/* Notification Bell with interactive dropdown - Only for MedPath Elite students */}
                {studentTier === 'elite' && (
                  <div style={{ position: 'relative' }} ref={notifDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowNotifMenu(!showNotifMenu)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: showNotifMenu ? '#EEF2FF' : '#F8FAFC',
                      border: showNotifMenu ? '1.5px solid #6366F1' : '1px solid #E2E8F0',
                      color: showNotifMenu ? '#4F46E5' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.15s ease',
                      outline: 'none',
                    }}
                    title={t('portal.notifications', 'Notifications')}
                  >
                    <Bell size={17} />
                    {unreadCount > 0 ? (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-4px',
                          minWidth: '18px',
                          height: '18px',
                          borderRadius: '10px',
                          backgroundColor: hasUrgentNotif ? '#DC2626' : '#10B981',
                          color: '#FFFFFF',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 4px',
                          border: '2px solid #FFFFFF',
                          boxShadow: hasUrgentNotif ? '0 0 8px rgba(220,38,38,0.5)' : 'none',
                        }}
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    ) : (
                      <span
                        style={{
                          position: 'absolute',
                          top: '7px',
                          right: '8px',
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: '#94A3B8',
                          border: '1.5px solid #FFFFFF',
                        }}
                      />
                    )}
                  </button>

                  {/* Notification Dropdown Menu */}
                  {showNotifMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '48px',
                        right: 0,
                        width: '380px',
                        maxWidth: '90vw',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15), 0 0 1px 1px rgba(0,0,0,0.05)',
                        zIndex: 600,
                        overflow: 'hidden',
                      }}
                    >
                      {/* Dropdown Header */}
                      <div
                        style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid #F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#F8FAFC',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A' }}>
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span
                              style={{
                                backgroundColor: hasUrgentNotif ? '#FEE2E2' : '#DCFCE7',
                                color: hasUrgentNotif ? '#DC2626' : '#15803D',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '12px',
                              }}
                            >
                              {unreadCount} unread
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              markAllNotificationsAsRead(currentUser?.email || 'student@ahsora.com');
                              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                            }}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#6366F1',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '4px 6px',
                            }}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notification List */}
                      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748B' }}>
                            <Bell size={28} color="#CBD5E1" style={{ margin: '0 auto 8px' }} />
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#334155' }}>
                              No notifications yet
                            </div>
                            <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>
                              Updates regarding your MedPath stages, mock test results, and reviews will appear here.
                            </div>
                          </div>
                        ) : (
                          notifications.slice(0, 20).map((notif) => {
                            const isRej = notif.type === 'medpath_rejected' || notif.level === 'urgent';
                            const isApp = notif.type === 'medpath_approved' || notif.level === 'success';

                            return (
                              <div
                                key={notif.id}
                                onClick={() => {
                                  markNotificationAsRead(notif.id, currentUser?.email || 'student@ahsora.com');
                                  setNotifications((prev) =>
                                    prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                                  );
                                  if (notif.actionUrl) {
                                    setShowNotifMenu(false);
                                    router.push(notif.actionUrl);
                                  }
                                }}
                                style={{
                                  padding: '14px 18px',
                                  borderBottom: '1px solid #F1F5F9',
                                  backgroundColor: !notif.read
                                    ? isRej
                                      ? '#FEF2F2'
                                      : isApp
                                      ? '#F0FDF4'
                                      : '#F8FAFC'
                                    : '#FFFFFF',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  gap: '12px',
                                  alignItems: 'flex-start',
                                  transition: 'background-color 0.15s ease',
                                }}
                              >
                                <div
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    backgroundColor: isRej ? '#FEE2E2' : isApp ? '#DCFCE7' : '#EEF2FF',
                                    color: isRej ? '#DC2626' : isApp ? '#16A34A' : '#4F46E5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    marginTop: '2px',
                                  }}
                                >
                                  {isRej ? <AlertTriangle size={16} /> : isApp ? <CheckCircle2 size={16} /> : <Bell size={16} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                    <div
                                      style={{
                                        fontSize: '0.8125rem',
                                        fontWeight: notif.read ? 600 : 800,
                                        color: isRej ? '#991B1B' : '#0F172A',
                                      }}
                                    >
                                      {notif.title}
                                    </div>
                                    {!notif.read && (
                                      <span
                                        style={{
                                          width: '6px',
                                          height: '6px',
                                          borderRadius: '50%',
                                          backgroundColor: isRej ? '#DC2626' : '#10B981',
                                          flexShrink: 0,
                                        }}
                                      />
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '0.78rem',
                                      color: isRej ? '#7F1D1D' : '#475569',
                                      marginTop: '3px',
                                      lineHeight: 1.4,
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {notif.message}
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      marginTop: '6px',
                                    }}
                                  >
                                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                                      {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                                    </span>
                                    {notif.actionUrl && (
                                      <span
                                        style={{
                                          fontSize: '0.72rem',
                                          color: isRej ? '#DC2626' : '#6366F1',
                                          fontWeight: 700,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '2px',
                                        }}
                                      >
                                        Open Track <ChevronRight size={12} />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Dropdown Footer */}
                      <div
                        style={{
                          padding: '10px 16px',
                          borderTop: '1px solid #F1F5F9',
                          backgroundColor: '#F8FAFC',
                          textAlign: 'center',
                        }}
                      >
                        <Link
                          href="/portal/medpath"
                          onClick={() => setShowNotifMenu(false)}
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#4F46E5',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          View MedPath Elite Application Track <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

                {/* Profile Pill & Avatar (Links to My Account) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link
                    href="/portal/account"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '11px',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      boxShadow: '0 4px 10px rgba(5, 150, 105, 0.25)',
                      border: '2px solid #FFFFFF',
                      textDecoration: 'none',
                      transition: 'transform 0.15s ease',
                    }}
                    title={realUser?.fullName ? `${realUser.fullName} (My Account)` : 'My Account'}
                  >
                    {realUser ? realUser.initials : 'MD'}
                  </Link>

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 13px',
                      borderRadius: '9px',
                      border: '1px solid #FEE2E2',
                      backgroundColor: '#FFF5F5',
                      color: '#DC2626',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    title={t('portal.logout', 'Sign out of student portal')}
                  >
                    <LogOut size={14} />
                    <span style={{ display: 'none' }} className="sm:inline">
                      {t('portal.logout', 'Log Out')}
                    </span>
                  </button>
                </div>
              </div>
            </header>
          );
        })()}

        {/* Live Broadcast Exam Alert for All Students */}
        {liveTestSession?.isLive && !isPortalLocked && (
          <div
            style={{
              backgroundColor: hasCompletedLiveTest ? '#10B981' : '#DC2626',
              color: '#FFFFFF',
              padding: '16px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: hasCompletedLiveTest ? '0 4px 14px rgba(16, 185, 129, 0.35)' : '0 4px 14px rgba(220, 38, 38, 0.35)',
              position: 'sticky',
              top: '64px',
              zIndex: 25,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: hasCompletedLiveTest ? '#10B981' : '#DC2626',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                {hasCompletedLiveTest ? '✅ EXAM COMPLETED' : '🚨 MANDATORY LIVE EXAM'}
              </span>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{liveTestSession.testTitle}</strong>
                <span style={{ fontSize: '0.8125rem', opacity: 0.9, marginLeft: '8px' }}>
                  {hasCompletedLiveTest ? 'You have successfully completed this live exam.' : 'Started by Administrator • Participation is required for all active students!'}
                </span>
              </div>
            </div>

            {!hasCompletedLiveTest && (
              <Link
                href={`/portal/tests/${liveTestSession.testId}/take`}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#DC2626',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Join Live Exam Now →</span>
              </Link>
            )}
          </div>
        )}

        {/* Page Content */}
        <div style={{ padding: '36px 32px 64px', flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}
