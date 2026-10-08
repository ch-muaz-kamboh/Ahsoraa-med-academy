import React, { useState } from 'react';

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
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [password, setPassword] = useState('');
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
        width: sidebarExpanded ? '260px' : '80px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'relative',
        transition: 'width 0.2s ease',
        overflow: 'visible',
        zIndex: 50,
        pointerEvents: isPortalLocked ? 'none' : 'auto',
        opacity: isPortalLocked ? 0.6 : 1,
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Removed floating toggle button, now placed in header */}

      {/* Header with logo and sidebar toggle */}
      <div
        style={{
          padding: sidebarExpanded ? '18px 20px' : '18px 0',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '84px',
        }}
      >
        <Link href="/portal/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Logo height={sidebarExpanded ? 48 : 32} />
        </Link>
        {/* Toggle button placed to the right */}
        <button
          onClick={() => setSidebarExpanded((prev) => !prev)}
          style={{
            position: 'absolute',
            right: '-14px',
            top: '28px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569',
            transition: 'all 0.15s ease',
            zIndex: 10,
          }}
          aria-label="Toggle sidebar"
        >
          {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Student Profile & Settings */}
      <div style={{ 
        padding: sidebarExpanded ? '20px' : '20px 0', 
        borderBottom: '1px solid #E2E8F0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: sidebarExpanded ? 'space-between' : 'center',
        flexDirection: sidebarExpanded ? 'row' : 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', fontWeight: 'bold', flexShrink: 0 }}>
            {computedInitials}
          </div>
          {sidebarExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentUser.firstName} {currentUser.lastName}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentUser.email}</span>
              <div style={{ marginTop: '4px' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: studentTier === 'elite' ? '#FFEDD5' : studentTier === 'mastery' ? '#DBEAFE' : '#DCFCE7',
                    color: studentTier === 'elite' ? '#C2410C' : studentTier === 'mastery' ? '#1D4ED8' : '#15803D',
                    border: `1px solid ${studentTier === 'elite' ? '#FED7AA' : studentTier === 'mastery' ? '#BFDBFE' : '#BBF7D0'}`,
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
          onClick={() => setShowSettings(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Scrollable Navigation Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>

        {/* Dashboard Link */}
        <div style={{ padding: '0 12px', marginBottom: '6px' }}>
          <Link
            href="/portal/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: pathname === '/portal/dashboard' ? '#2563EB' : '#334155',
              backgroundColor: pathname === '/portal/dashboard' ? '#EFF6FF' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <LayoutDashboard size={18} color={pathname === '/portal/dashboard' ? '#2563EB' : '#64748B'} />
            {sidebarExpanded && <span>Dashboard</span>}
          </Link>
        </div>

        {/* Learn Section Dropdown */}
        <div style={{ padding: '0 12px' }}>
          <button
            type="button"
            onClick={() => {
              setLearnOpen(!learnOpen);
              if (!sidebarExpanded) setSidebarExpanded(true);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarExpanded ? 'space-between' : 'center',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isLearnActive ? '#2563EB' : '#334155',
              backgroundColor: isLearnActive ? '#EFF6FF' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              opacity: isPortalLocked ? 0.5 : 1,
              pointerEvents: isPortalLocked ? 'none' : 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <GraduationCap size={18} color={isLearnActive ? '#2563EB' : '#64748B'} />
              {sidebarExpanded && <span>Learn</span>}
            </div>
            {sidebarExpanded && (learnOpen ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />)}
          </button>

          {learnOpen && (
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
                  color: pathname === '/portal/learn/schedule' ? '#2563EB' : scheduleLocked ? '#94A3B8' : '#64748B',
                  backgroundColor: pathname === '/portal/learn/schedule' ? '#DBEAFE' : 'transparent',
                  transition: 'all .15s ease',
                  opacity: scheduleLocked && pathname !== '/portal/learn/schedule' ? 0.8 : 1,
                }}
                title={scheduleLocked ? 'Locked for Ascend students (Mastery/Elite only)' : '1. Schedule'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={15} color={pathname === '/portal/learn/schedule' ? '#2563EB' : scheduleLocked ? '#94A3B8' : '#64748B'} />
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
                  color: pathname === '/portal/learn/lectures' ? '#2563EB' : '#64748B',
                  backgroundColor: pathname === '/portal/learn/lectures' ? '#DBEAFE' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Video size={15} />
                {sidebarExpanded && <span>2. Recorded Lectures</span>}
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
                  color: pathname === '/portal/learn/library' ? '#2563EB' : '#64748B',
                  backgroundColor: pathname === '/portal/learn/library' ? '#DBEAFE' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Library size={15} />
                {sidebarExpanded && <span>3. Library</span>}
              </Link>
            </div>
          )}
        </div>

        {/* Practice Section Dropdown */}
        <div style={{ padding: '0 12px', marginTop: '4px' }}>
          <button
            type="button"
            onClick={() => {
              setPracticeOpen(!practiceOpen);
              if (!sidebarExpanded) setSidebarExpanded(true);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isPracticeActive ? '#2563EB' : '#334155',
              backgroundColor: isPracticeActive ? '#EFF6FF' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={18} color={isPracticeActive ? '#2563EB' : '#64748B'} />
              {sidebarExpanded && <span>Practice</span>}
            </div>
            {sidebarExpanded && (practiceOpen ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />)}
          </button>

          {practiceOpen && (
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
                  color: pathname === '/portal/practice' ? '#2563EB' : '#64748B',
                  backgroundColor: pathname === '/portal/practice' ? '#DBEAFE' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <BookOpen size={15} />
                {sidebarExpanded && <span>1. Practice Bank</span>}
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
                  color: pathname?.startsWith('/portal/tests') ? '#2563EB' : '#64748B',
                  backgroundColor: pathname?.startsWith('/portal/tests') ? '#DBEAFE' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <FileCheck2 size={15} />
                {sidebarExpanded && <span>2. CBT Mock</span>}
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
                  color: pathname === '/portal/practice/mistakes' ? '#2563EB' : '#64748B',
                  backgroundColor: pathname === '/portal/practice/mistakes' ? '#DBEAFE' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <AlertCircle size={15} color={pathname === '/portal/practice/mistakes' ? '#2563EB' : '#EF4444'} />
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

        {/* Progress Section Dropdown */}
        <div style={{ padding: '0 12px', marginTop: '4px' }}>
          <button
            type="button"
            onClick={() => {
              setProgressOpen(!progressOpen);
              if (!sidebarExpanded) setSidebarExpanded(true);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isProgressActive ? '#2563EB' : '#334155',
              backgroundColor: isProgressActive ? '#EFF6FF' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <TrendingUp size={18} color={isProgressActive ? '#2563EB' : '#64748B'} />
              {sidebarExpanded && <span>Progress</span>}
            </div>
            {sidebarExpanded && (progressOpen ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />)}
          </button>

          {progressOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '28px', marginTop: '4px' }}>
              <Link
                href="/portal/progress/analysis"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname === '/portal/progress/analysis' ? 600 : 500,
                  color: pathname === '/portal/progress/analysis' ? '#2563EB' : '#64748B',
                  backgroundColor: pathname === '/portal/progress/analysis' ? '#DBEAFE' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <BarChart2 size={15} />
                {sidebarExpanded && <span>1. Analysis</span>}
              </Link>

              <Link
                href="/portal/progress/streak"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname === '/portal/progress/streak' ? 600 : 500,
                  color: pathname === '/portal/progress/streak' ? '#2563EB' : '#64748B',
                  backgroundColor: pathname === '/portal/progress/streak' ? '#DBEAFE' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Flame size={15} color={pathname === '/portal/progress/streak' ? '#2563EB' : '#F59E0B'} />
                {sidebarExpanded && <span>2. Streak History</span>}
              </Link>
            </div>
          )}
        </div>

        {/* MedPath Elite — Direct Link (locked for Ascend and Mastery) */}
        <div style={{ padding: '0 12px', marginTop: '4px' }}>
          <Link
            href="/portal/medpath"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarExpanded ? 'space-between' : 'center',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isMedpathActive ? '#EA580C' : medpathLocked ? '#64748B' : '#334155',
              backgroundColor: isMedpathActive ? '#FFF7ED' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              border: isMedpathActive ? '1px solid #FED7AA' : '1px solid transparent',
              opacity: medpathLocked && !isMedpathActive ? 0.8 : 1,
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
        <div style={{ padding: '0 12px', marginTop: '4px' }}>
          <Link
            href="/portal/documents"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarExpanded ? 'space-between' : 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: pathname === '/portal/documents' ? 600 : 500,
              color: pathname === '/portal/documents' ? '#2563EB' : docVaultLocked ? '#64748B' : '#475569',
              backgroundColor: pathname === '/portal/documents' ? '#EFF6FF' : 'transparent',
              transition: 'all 0.15s ease',
              opacity: docVaultLocked && pathname !== '/portal/documents' ? 0.8 : 1,
            }}
            title={docVaultLocked ? 'Locked for Ascend & Mastery students (Elite only)' : 'Document Vault'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: pathname === '/portal/documents' ? '#2563EB' : docVaultLocked ? '#94A3B8' : '#64748B' }}>
                <FolderLock size={18} />
              </span>
              {sidebarExpanded && <span>Document Vault</span>}
            </div>
            {sidebarExpanded && (
              <span
                style={{
                  fontSize: '0.625rem',
                  backgroundColor: docVaultLocked ? '#F1F5F9' : '#DBEAFE',
                  color: docVaultLocked ? '#64748B' : '#1D4ED8',
                  border: docVaultLocked ? '1px solid #CBD5E1' : '1px solid #BFDBFE',
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

        <div style={{ padding: '0 12px', marginTop: '4px' }}>
          {/* Ask Doubts / Mentorship link */}
          <Link
            href="/portal/doubts"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: pathname === '/portal/doubts' ? 600 : 500,
            color: pathname === '/portal/doubts' ? '#2563EB' : '#475569',
            backgroundColor: pathname === '/portal/doubts' ? '#EFF6FF' : 'transparent',
            transition: 'all 0.15s ease',
          }}
        >
            <span style={{ color: pathname === '/portal/doubts' ? '#2563EB' : '#64748B' }}>
              <HelpCircle size={18} />
            </span>
            {sidebarExpanded && <span>Ask Doubts</span>}
          </Link>
        </div>

      </div>{/* END Scrollable Navigation Area */}

      {/* Footer / Logout & Back to Public */}
      <div style={{ padding: '16px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
            gap: '10px',
            padding: '10px 14px',
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
        >
          <LogOut size={16} />
          {sidebarExpanded && <span>Sign Out</span>}
        </button>

        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
            gap: '10px',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            color: '#64748B',
            fontWeight: 500,
            textDecoration: 'none',
          }}
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
          borderRadius: '12px',
          width: '90%',
          maxWidth: '400px',
          padding: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}>
          <h2 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 600 }}>Settings</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              // Update email and phone via Supabase
              try {
                const supabase = createClient();
                if (email !== currentUser.email) {
                  await supabase.auth.updateUser({ email });
                }
                if (phone !== currentUser.phone) {
                  // Assuming a custom field in profile table
                  await supabase.from('profiles').update({ phone }).eq('id', currentUser.id);
                }
                if (password) {
                  await supabase.auth.updateUser({ password });
                }
                // Update local store
                updateProfile({ email, phone });
                setShowSettings(false);
              } catch (err) {
                console.error('Profile update error', err);
              }
            }}
          >
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Enrolled Package Plan
              </label>
              <select
                value={studentTier}
                onChange={(e) => {
                  const targetPkg = ACADEMY_PACKAGES.find((p) => p.id === e.target.value);
                  if (targetPkg) {
                    updateProfile({ selectedPackage: targetPkg.name, packagePrice: targetPkg.price });
                    saveStudentPackageMapping(currentUser.email, targetPkg.name, targetPkg.price);
                    try {
                      const recentStr = localStorage.getItem('recentRegistration');
                      if (recentStr) {
                        const parsed = JSON.parse(recentStr);
                        parsed.selectedPackage = targetPkg.name;
                        parsed.packagePrice = targetPkg.price;
                        localStorage.setItem('recentRegistration', JSON.stringify(parsed));
                      }
                    } catch {}
                    try {
                      fetch('/api/admin/students', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          studentEmail: currentUser.email,
                          selectedPackage: targetPkg.name,
                          packagePrice: targetPkg.price,
                        }),
                      }).catch(() => {});
                    } catch {}
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0F172A',
                }}
              >
                {ACADEMY_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.price})
                  </option>
                ))}
              </select>
              <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>
                Selected plan controls access: <strong>Ascend</strong> locks Schedule, MedPath & Docs. <strong>Mastery</strong> unlocks Schedule. <strong>Elite</strong> unlocks everything.
              </div>
            </div>

            <label style={{ display: 'block', marginBottom: '8px' }}>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                required
              />
            </label>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Phone
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              New Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
              />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button type="button" onClick={() => setShowSettings(false)} style={{ padding: '8px 16px', background: '#F1F5F9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
            </div>
          </form>
        </div>
      </div>
    )}
    </aside>
  );
}
