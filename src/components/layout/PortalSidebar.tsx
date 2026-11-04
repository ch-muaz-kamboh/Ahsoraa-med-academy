import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileCheck2,
  FolderLock,
  Settings,
  BookOpen,
  LogOut,
  Globe,
  GraduationCap,
  Calendar,
  Video,
  Library,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  BarChart2,
  Flame,
  Building,
  Award,
  Compass,
  ChevronLeft,
  Lock,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/brand/Logo';
import {
  ACADEMY_PACKAGES,
  getPackageByIdOrName,
  getStudentTier,
  isScheduleLocked,
  isMedpathLocked,
  isDocumentVaultLocked,
  resolveEffectivePackage,
  saveStudentPackageMapping,
} from '@/lib/packages';

export default function PortalSidebar({ userFullName = 'Student', userInitials = 'ST' }: { userFullName?: string, userInitials?: string }) {
  const { t } = useLanguage();
  const {
    currentUser,
    testAttempts,
    liveTestSession,
    updateProfile,
  } = useAppStore();
  const isPortalLocked = liveTestSession && testAttempts.some(attempt => attempt.testId === liveTestSession.testId && attempt.studentId === currentUser.id && attempt.status === 'in_progress');
  const effectivePkg = resolveEffectivePackage(currentUser);
  const studentTier = getStudentTier(effectivePkg);
  const currentPkgObj = getPackageByIdOrName(effectivePkg);
  const scheduleLocked = isScheduleLocked(effectivePkg);
  const medpathLocked = isMedpathLocked(effectivePkg);
  const docVaultLocked = isDocumentVaultLocked(effectivePkg);

  const [showSettings, setShowSettings] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.whatsappNumber || currentUser?.phone || '');
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  useEffect(() => {
    if (currentUser?.whatsappNumber || currentUser?.phone) {
      setWhatsappNumber(currentUser.whatsappNumber || currentUser.phone || '');
    }
  }, [currentUser?.whatsappNumber, currentUser?.phone]);
  const pathname = usePathname();
  const router = useRouter();
  const { setStudentLoggedIn, logoutStudent, studentMistakes } = useAppStore();
  const unresolvedMistakesCount = studentMistakes ? studentMistakes.filter((m) => !m.isResolved).length : 0;
  
  // Compute initials from actual user data instead of relying on props default
  const computedInitials = currentUser?.firstName 
    ? `${currentUser.firstName[0]}${currentUser.lastName ? currentUser.lastName[0] : ''}`.toUpperCase() 
    : userInitials;

  const [learnOpen, setLearnOpen] = useState<boolean>(true);
  const [practiceOpen, setPracticeOpen] = useState<boolean>(true);
  const [progressOpen, setProgressOpen] = useState<boolean>(false);
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);

  // Initialize and persist sidebar collapse preference
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('ahsora_portal_sidebar_collapsed');
      if (saved === 'true') {
        setSidebarExpanded(false);
      }
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ahsora_portal_sidebar_collapsed', next ? 'false' : 'true');
      } catch {}
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    logoutStudent();
  };

  const isLearnActive = pathname?.startsWith('/portal/learn');
  const isPracticeActive = pathname === '/portal/practice' || pathname?.startsWith('/portal/practice/') || pathname?.startsWith('/portal/tests');
  const isProgressActive = pathname?.startsWith('/portal/progress');
  const isMedpathActive = pathname?.startsWith('/portal/medpath');

  return (
    <aside
      style={{
        width: sidebarExpanded ? '260px' : '72px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'relative',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'visible',
        zIndex: 50,
        pointerEvents: isPortalLocked ? 'none' : 'auto',
        opacity: isPortalLocked ? 0.6 : 1,
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Header with logo and smooth sidebar toggle */}
      <div
        style={{
          padding: sidebarExpanded ? '18px 20px' : '18px 0',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '84px',
          width: '100%',
        }}
      >
        <Link
          href="/portal/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            overflow: 'hidden',
          }}
          title={sidebarExpanded ? undefined : 'Ahsora Meds Academy'}
        >
          <Logo height={sidebarExpanded ? 40 : 30} iconOnly={!sidebarExpanded} />
        </Link>

        {/* Toggle button placed precisely on the border */}
        <button
          type="button"
          onClick={toggleSidebar}
          style={{
            position: 'absolute',
            right: '-14px',
            top: '28px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#1E293B',
            transition: 'all 0.18s ease',
            zIndex: 60,
          }}
          title={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Student Profile & Settings */}
      <div
        style={{
          padding: sidebarExpanded ? '18px 20px' : '16px 0',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarExpanded ? 'space-between' : 'center',
          flexDirection: sidebarExpanded ? 'row' : 'column',
          gap: sidebarExpanded ? '12px' : '8px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
            width: sidebarExpanded ? 'auto' : '100%',
            overflow: 'hidden',
          }}
          title={!sidebarExpanded ? `${currentUser.firstName || 'Student'} (${currentPkgObj.name})` : undefined}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              fontWeight: 'bold',
              flexShrink: 0,
            }}
          >
            {computedInitials}
          </div>
          {sidebarExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#1E293B',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748B',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {currentUser.email}
              </span>
              <div style={{ marginTop: '4px' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: studentTier === 'elite' ? '#FFEDD5' : '#DCFCE7',
                    color: studentTier === 'elite' ? '#C2410C' : studentTier === 'mastery' ? '#047857' : '#15803D',
                    border: `1px solid ${studentTier === 'elite' ? '#FED7AA' : '#BBF7D0'}`,
                    display: 'inline-block',
                    lineHeight: 1.3,
                  }}
                >
                  {currentPkgObj.name}
                </span>
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            borderRadius: '6px',
          }}
          title="Account Settings"
        >
          <Settings size={sidebarExpanded ? 19 : 17} />
        </button>
      </div>

      {/* Scrollable Navigation Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', width: '100%' }}>

        {/* Dashboard Link */}
        <div style={{ padding: sidebarExpanded ? '0 12px' : '0 8px', marginBottom: '6px' }}>
          <Link
            href="/portal/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarExpanded ? 'flex-start' : 'center',
              gap: '12px',
              padding: sidebarExpanded ? '10px 14px' : '10px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: pathname === '/portal/dashboard' ? '#059669' : '#334155',
              backgroundColor: pathname === '/portal/dashboard' ? '#F0FFF4' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              width: '100%',
            }}
            title={!sidebarExpanded ? t('portal.dashboard', 'Dashboard') : undefined}
          >
            <LayoutDashboard size={18} color={pathname === '/portal/dashboard' ? '#059669' : '#64748B'} />
            {sidebarExpanded && <span>{t('portal.dashboard', 'Dashboard')}</span>}
          </Link>
        </div>

        {/* Learn Section Dropdown */}
        <div style={{ padding: sidebarExpanded ? '0 12px' : '0 8px' }}>
          <button
            type="button"
            onClick={() => {
              if (!sidebarExpanded) {
                setSidebarExpanded(true);
                setLearnOpen(true);
              } else {
                setLearnOpen(!learnOpen);
              }
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarExpanded ? 'space-between' : 'center',
              padding: sidebarExpanded ? '10px 14px' : '10px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isLearnActive ? '#059669' : '#334155',
              backgroundColor: isLearnActive ? '#F0FFF4' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              opacity: isPortalLocked ? 0.5 : 1,
              pointerEvents: isPortalLocked ? 'none' : 'auto',
            }}
            title={!sidebarExpanded ? t('portal.learn', 'Learn') : undefined}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <GraduationCap size={18} color={isLearnActive ? '#059669' : '#64748B'} />
              {sidebarExpanded && <span>{t('portal.learn', 'Learn')}</span>}
            </div>
            {sidebarExpanded && (learnOpen ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />)}
          </button>

          {sidebarExpanded && learnOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '28px', marginTop: '4px' }}>
              <Link
                href="/portal/learn/schedule"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname === '/portal/learn/schedule' ? 600 : 500,
                  color: pathname === '/portal/learn/schedule' ? '#059669' : scheduleLocked ? '#94A3B8' : '#64748B',
                  backgroundColor: pathname === '/portal/learn/schedule' ? '#DCFCE7' : 'transparent',
                  transition: 'all .15s ease',
                  opacity: scheduleLocked && pathname !== '/portal/learn/schedule' ? 0.8 : 1,
                }}
                title={scheduleLocked ? 'Locked for Ascend students (Mastery/Elite only)' : '1. Schedule'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={15} color={pathname === '/portal/learn/schedule' ? '#059669' : scheduleLocked ? '#94A3B8' : '#64748B'} />
                  {sidebarExpanded && <span>1. Schedule</span>}
                </div>
                {sidebarExpanded && scheduleLocked ? (
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      backgroundColor: '#F1F5F9',
                      color: '#64748B',
                      border: '1px solid #CBD5E1',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      lineHeight: 1.4,
                    }}
                  >
                    <Lock size={10} /> MASTERY+
                  </span>
                ) : sidebarExpanded ? (
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #BBF7D0',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      lineHeight: 1.4,
                    }}
                  >
                    LIVE
                  </span>
                ) : null}
              </Link>

              <Link
                href="/portal/learn/lectures"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname === '/portal/learn/lectures' ? 600 : 500,
                  color: pathname === '/portal/learn/lectures' ? '#059669' : '#64748B',
                  backgroundColor: pathname === '/portal/learn/lectures' ? '#DCFCE7' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Video size={15} />
                {sidebarExpanded && <span>{t('portal.recorded_lectures', '2. Recorded Lectures')}</span>}
              </Link>

              <Link
                href="/portal/learn/library"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname === '/portal/learn/library' ? 600 : 500,
                  color: pathname === '/portal/learn/library' ? '#059669' : '#64748B',
                  backgroundColor: pathname === '/portal/learn/library' ? '#DCFCE7' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Library size={15} />
                {sidebarExpanded && <span>{t('portal.library', '3. Library')}</span>}
              </Link>
            </div>
          )}
        </div>

        {/* Practice Section Dropdown */}
        <div style={{ padding: sidebarExpanded ? '0 12px' : '0 8px', marginTop: '4px' }}>
          <button
            type="button"
            onClick={() => {
              if (!sidebarExpanded) {
                setSidebarExpanded(true);
                setPracticeOpen(true);
              } else {
                setPracticeOpen(!practiceOpen);
              }
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarExpanded ? 'space-between' : 'center',
              padding: sidebarExpanded ? '10px 14px' : '10px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isPracticeActive ? '#059669' : '#334155',
              backgroundColor: isPracticeActive ? '#F0FFF4' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title={!sidebarExpanded ? t('portal.practice', 'Practice') : undefined}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <BookOpen size={18} color={isPracticeActive ? '#059669' : '#64748B'} />
              {sidebarExpanded && <span>{t('portal.practice', 'Practice')}</span>}
            </div>
            {sidebarExpanded && (practiceOpen ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />)}
          </button>

          {sidebarExpanded && practiceOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '28px', marginTop: '4px' }}>
              <Link
                href="/portal/practice"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname === '/portal/practice' ? 600 : 500,
                  color: pathname === '/portal/practice' ? '#059669' : '#64748B',
                  backgroundColor: pathname === '/portal/practice' ? '#DCFCE7' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <BookOpen size={15} />
                {sidebarExpanded && <span>{t('portal.practice_bank', '1. Practice Bank')}</span>}
              </Link>

              <Link
                href="/portal/tests"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname?.startsWith('/portal/tests') ? 600 : 500,
                  color: pathname?.startsWith('/portal/tests') ? '#059669' : '#64748B',
                  backgroundColor: pathname?.startsWith('/portal/tests') ? '#DCFCE7' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <FileCheck2 size={15} />
                {sidebarExpanded && <span>{t('portal.cbt_mock', '2. CBT Mock')}</span>}
              </Link>

              <Link
                href="/portal/practice/mistakes"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname === '/portal/practice/mistakes' ? 600 : 500,
                  color: pathname === '/portal/practice/mistakes' ? '#059669' : '#64748B',
                  backgroundColor: pathname === '/portal/practice/mistakes' ? '#DCFCE7' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <AlertCircle size={15} color={pathname === '/portal/practice/mistakes' ? '#059669' : '#EF4444'} />
                {sidebarExpanded && (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>3. My Mistakes</span>
                    {unresolvedMistakesCount > 0 && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          padding: '2px 7px',
                          borderRadius: '10px',
                          lineHeight: 1,
                        }}
                      >
                        {unresolvedMistakesCount}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Progress / Analysis Section Link */}
        <div style={{ padding: sidebarExpanded ? '0 12px' : '0 8px', marginTop: '4px' }}>
          <Link
            href="/portal/progress/analysis"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              justifyContent: sidebarExpanded ? 'flex-start' : 'center',
              padding: sidebarExpanded ? '10px 14px' : '10px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isProgressActive ? '#059669' : '#334155',
              backgroundColor: isProgressActive ? '#F0FFF4' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            title={!sidebarExpanded ? 'Progress Analysis' : undefined}
          >
            <TrendingUp size={18} color={isProgressActive ? '#059669' : '#64748B'} />
            {sidebarExpanded && <span>Progress Analysis</span>}
          </Link>
        </div>

        {/* MedPath Elite — Direct Link (locked for Ascend and Mastery) */}
        <div style={{ padding: sidebarExpanded ? '0 12px' : '0 8px', marginTop: '4px' }}>
          <Link
            href="/portal/medpath"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarExpanded ? 'space-between' : 'center',
              padding: sidebarExpanded ? '10px 14px' : '10px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isMedpathActive ? '#EA580C' : medpathLocked ? '#64748B' : '#334155',
              backgroundColor: isMedpathActive ? '#FFF7ED' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              border: isMedpathActive ? '1px solid #FED7AA' : '1px solid transparent',
              opacity: medpathLocked && !isMedpathActive ? 0.8 : 1,
              width: '100%',
            }}
            title={medpathLocked ? 'Locked for Ascend & Mastery students (Elite only)' : 'MedPath Elite'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <Award size={18} color={isMedpathActive ? '#EA580C' : medpathLocked ? '#94A3B8' : '#7C3AED'} />
              {sidebarExpanded && <span style={{ fontWeight: 700 }}>MedPath Elite</span>}
            </div>
            {sidebarExpanded && (
              <span
                style={{
                  fontSize: '0.625rem',
                  backgroundColor: medpathLocked ? '#F1F5F9' : '#FFEDD5',
                  color: medpathLocked ? '#64748B' : '#C2410C',
                  border: medpathLocked ? '1px solid #CBD5E1' : '1px solid #FED7AA',
                  padding: '1px 6px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  lineHeight: 1.4,
                }}
              >
                {medpathLocked ? <Lock size={10} /> : null}
                {medpathLocked ? 'ELITE ONLY' : 'VIP'}
              </span>
            )}
          </Link>
        </div>

        {/* Document Vault — Direct Link (locked for Ascend and Mastery) */}
        <div style={{ padding: sidebarExpanded ? '0 12px' : '0 8px', marginTop: '4px' }}>
          <Link
            href="/portal/documents"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarExpanded ? 'space-between' : 'center',
              gap: '12px',
              padding: sidebarExpanded ? '10px 14px' : '10px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: pathname === '/portal/documents' ? 600 : 500,
              color: pathname === '/portal/documents' ? '#059669' : docVaultLocked ? '#64748B' : '#475569',
              backgroundColor: pathname === '/portal/documents' ? '#F0FFF4' : 'transparent',
              transition: 'all 0.15s ease',
              opacity: docVaultLocked && pathname !== '/portal/documents' ? 0.8 : 1,
              width: '100%',
            }}
            title={docVaultLocked ? 'Locked for Ascend & Mastery students (Elite only)' : 'Document Vault'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <span style={{ color: pathname === '/portal/documents' ? '#059669' : docVaultLocked ? '#94A3B8' : '#64748B' }}>
                <FolderLock size={18} />
              </span>
              {sidebarExpanded && <span>{t('portal.documents', 'Document Vault')}</span>}
            </div>
            {sidebarExpanded && (
              <span
                style={{
                  fontSize: '0.625rem',
                  backgroundColor: docVaultLocked ? '#F1F5F9' : '#DCFCE7',
                  color: docVaultLocked ? '#64748B' : '#047857',
                  border: docVaultLocked ? '1px solid #CBD5E1' : '1px solid #BBF7D0',
                  padding: '1px 6px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  lineHeight: 1.4,
                }}
              >
                {docVaultLocked ? <Lock size={10} /> : null}
                {docVaultLocked ? 'ELITE ONLY' : 'INCLUDED'}
              </span>
            )}
          </Link>
        </div>

        <div style={{ padding: sidebarExpanded ? '0 12px' : '0 8px', marginTop: '4px' }}>
          {/* Ask Doubts / Mentorship link */}
          <Link
            href="/portal/doubts"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarExpanded ? 'flex-start' : 'center',
              gap: '12px',
              padding: sidebarExpanded ? '10px 14px' : '10px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: pathname === '/portal/doubts' ? 600 : 500,
              color: pathname === '/portal/doubts' ? '#059669' : '#475569',
              backgroundColor: pathname === '/portal/doubts' ? '#F0FFF4' : 'transparent',
              transition: 'all 0.15s ease',
              width: '100%',
            }}
            title={!sidebarExpanded ? t('portal.doubts', 'Ask Doubts') : undefined}
          >
            <span style={{ color: pathname === '/portal/doubts' ? '#059669' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={18} />
            </span>
            {sidebarExpanded && <span>{t('portal.doubts', 'Ask Doubts')}</span>}
          </Link>
        </div>

      </div>{/* END Scrollable Navigation Area */}

      {/* Footer / Logout & Back to Public */}
      <div
        style={{
          padding: sidebarExpanded ? '16px' : '12px 6px',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
            gap: '10px',
            padding: sidebarExpanded ? '10px 14px' : '10px 0',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#DC2626',
            fontWeight: 600,
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.15s ease',
          }}
          title={!sidebarExpanded ? t('portal.logout', 'Sign Out') : undefined}
        >
          <LogOut size={16} />
          {sidebarExpanded && <span>{t('portal.logout', 'Sign Out')}</span>}
        </button>

        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
            gap: '10px',
            padding: sidebarExpanded ? '8px 14px' : '8px 0',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            color: '#64748B',
            fontWeight: 500,
            textDecoration: 'none',
            width: '100%',
          }}
          title={!sidebarExpanded ? 'Exit to Public Site' : undefined}
        >
          <Globe size={15} />
          {sidebarExpanded && <span>Exit to Public Site</span>}
        </Link>
      </div>
    {/* Settings Modal */}
    {showSettings && (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15,23,42,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '440px',
          padding: '28px',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
          border: '1px solid #E2E8F0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Student Settings</h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748B' }}>Your official student academy credentials</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              style={{
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
                fontSize: '1rem',
              }}
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSavingSettings(true);
              try {
                const supabase = createClient();
                if (currentUser?.id) {
                  await supabase.from('profiles').update({
                    whatsapp_number: whatsappNumber,
                    phone: whatsappNumber,
                  }).eq('id', currentUser.id);
                }
                updateProfile({
                  whatsappNumber: whatsappNumber,
                  phone: whatsappNumber,
                });
                setSavedSettingsSuccess(true);
                setTimeout(() => {
                  setSavedSettingsSuccess(false);
                  setShowSettings(false);
                }, 900);
              } catch (err) {
                console.error('Settings update error', err);
                updateProfile({
                  whatsappNumber: whatsappNumber,
                  phone: whatsappNumber,
                });
                setSavedSettingsSuccess(true);
                setTimeout(() => {
                  setSavedSettingsSuccess(false);
                  setShowSettings(false);
                }, 900);
              } finally {
                setSavingSettings(false);
              }
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* 1. Official Enrollment ID */}
            <div style={{ padding: '14px 16px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                Official Enrollment ID
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', letterSpacing: '0.05em' }}>
                  {currentUser?.ama_id || currentUser?.amaId || (currentUser?.id ? `AMA-${currentUser.id.slice(0, 6).toUpperCase()}` : 'AMA-PENDING')}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                  Verified
                </span>
              </div>
            </div>

            {/* 2. Enrolled Package Name */}
            <div style={{ padding: '14px 16px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                Enrolled Academic Package
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: studentTier === 'elite' ? '#C2410C' : studentTier === 'mastery' ? '#047857' : '#0F172A' }}>
                  {currentPkgObj.name}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', backgroundColor: '#FFFFFF', padding: '3px 10px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                  {currentPkgObj.price}
                </span>
              </div>
            </div>

            {/* 3. Real WhatsApp Number */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+39 333 123 4567"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.925rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Official WhatsApp used for academic alerts, tutor sessions, and study materials.
              </span>
            </div>

            {savedSettingsSuccess && (
              <div style={{ padding: '10px 14px', backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '8px', color: '#065F46', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                ✓ Settings saved successfully!
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '10px 18px',
                  background: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Close
              </button>
              <button
                type="submit"
                disabled={savingSettings}
                style={{
                  padding: '10px 22px',
                  background: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: savingSettings ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                }}
              >
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </aside>
  );
}
