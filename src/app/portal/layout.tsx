'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import PortalSidebar from '@/components/layout/PortalSidebar';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Bell, Lock, Mail, User, Eye, EyeOff, Check, Loader2, LogOut, Flame, Clock, Sparkles, GraduationCap } from 'lucide-react';
import Link from 'next/link';

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
  const { studentLoggedIn, loginStudent, logoutStudent, liveTestSession, testAttempts, currentUser, updateProfile } = useAppStore();

  // Instant auth determination: do not show blocking loader if already verified in store or localStorage
  const isAlreadyLoggedIn = studentLoggedIn || (typeof window !== 'undefined' && localStorage.getItem('ahsora_studentLoggedIn') === 'true');
  const [checkingAuth, setCheckingAuth] = useState(!isAlreadyLoggedIn);
  const hasFetchedRef = useRef(false);

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

          // Fetch profile name from profiles table
          let dbFullName = '';
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', user.id)
              .maybeSingle();
            if (profile?.full_name) dbFullName = profile.full_name;
          } catch (err) {
            console.warn('Profile fetch note:', err);
          }

          // Resolve effective package
          const resolvedPkgName =
            metaPackage ||
            getStudentPackageMapping(userEmail)?.selectedPackage ||
            resolveEffectivePackage({ email: userEmail, selectedPackage: currentUser?.selectedPackage });
          const matchedPkg = getPackageByIdOrName(resolvedPkgName);
          const resolvedPrice = metaPrice || getStudentPackageMapping(userEmail)?.packagePrice || matchedPkg.price;

          saveStudentPackageMapping(userEmail, matchedPkg.name, resolvedPrice);

          const fullName = dbFullName || userMeta.full_name || `${userMeta.first_name || ''} ${userMeta.last_name || ''}`.trim() || userEmail.split('@')[0] || 'Student';
          const fName = fullName.split(' ')[0] || 'Student';
          const inits = fullName.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || 'ST';

          if (!studentLoggedIn) {
            loginStudent(userEmail, {
              selectedPackage: matchedPkg.name,
              packagePrice: resolvedPrice,
              fullName,
            });
          } else {
            updateProfile({
              selectedPackage: matchedPkg.name,
              packagePrice: resolvedPrice,
              firstName: fName,
              lastName: fullName.split(' ').slice(1).join(' ') || currentUser.lastName,
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
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
                  <span>5-Day Streak</span>
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

                {/* Notification Bell */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                  }}
                  title={t('portal.notifications', 'Notifications')}
                >
                  <Bell size={17} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '7px',
                      right: '8px',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      border: '1.5px solid #FFFFFF',
                    }}
                  />
                </div>

                {/* Profile Pill & Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
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
                    }}
                    title={realUser?.fullName || 'Candidate Profile'}
                  >
                    {realUser ? realUser.initials : 'MD'}
                  </div>

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
        <div style={{ padding: '32px 28px', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
