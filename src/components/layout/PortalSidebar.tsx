import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileCheck2,
  FolderLock,
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
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/brand/Logo';

export default function PortalSidebar({ userFullName = 'Student', userInitials = 'ST' }: { userFullName?: string, userInitials?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setStudentLoggedIn, logoutStudent } = useAppStore();

  const [learnOpen, setLearnOpen] = useState<boolean>(true);
  const [practiceOpen, setPracticeOpen] = useState<boolean>(true);
  const [progressOpen, setProgressOpen] = useState<boolean>(true);
  const [medpathOpen, setMedpathOpen] = useState<boolean>(true);

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
        width: '260px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <Link
        href="/portal/dashboard"
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
        }}
      >
        <Logo height={48} />
      </Link>

      {/* User Badge */}
      <div
        style={{
          margin: '16px 16px 8px 16px',
          padding: '12px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#DBEAFE',
            color: '#1D4ED8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          {userInitials}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {userFullName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
            ● Enrolled Student
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Dashboard Link */}
        <Link
          href="/portal/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: pathname === '/portal/dashboard' ? 600 : 500,
            color: pathname === '/portal/dashboard' ? '#2563EB' : '#475569',
            backgroundColor: pathname === '/portal/dashboard' ? '#EFF6FF' : 'transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ color: pathname === '/portal/dashboard' ? '#2563EB' : '#64748B' }}>
            <LayoutDashboard size={18} />
          </span>
          <span>Dashboard</span>
        </Link>

        {/* Learn Section Dropdown */}
        <div>
          <button
            type="button"
            onClick={() => setLearnOpen(!learnOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isLearnActive ? '#2563EB' : '#334155',
              backgroundColor: isLearnActive ? '#EFF6FF' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <GraduationCap size={18} color={isLearnActive ? '#2563EB' : '#64748B'} />
              <span>Learn</span>
            </div>
            {learnOpen ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />}
          </button>

          {learnOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '28px', marginTop: '4px' }}>
              <Link
                href="/portal/learn/schedule"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname === '/portal/learn/schedule' ? 600 : 500,
                  color: pathname === '/portal/learn/schedule' ? '#2563EB' : '#64748B',
                  backgroundColor: pathname === '/portal/learn/schedule' ? '#DBEAFE' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Calendar size={15} />
                <span>1. Schedule</span>
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
                <span>2. Recorded Lectures</span>
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
                <span>3. Library</span>
              </Link>
            </div>
          )}
        </div>

        {/* Practice Section Dropdown */}
        <div>
          <button
            type="button"
            onClick={() => setPracticeOpen(!practiceOpen)}
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
              <span>Practice</span>
            </div>
            {practiceOpen ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />}
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
                <span>1. Practice Bank</span>
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
                <span>2. CBT Mock</span>
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
                <span>3. My Mistakes</span>
              </Link>
            </div>
          )}
        </div>

        {/* Progress Section Dropdown */}
        <div>
          <button
            type="button"
            onClick={() => setProgressOpen(!progressOpen)}
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
              <span>Progress</span>
            </div>
            {progressOpen ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />}
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
                <span>1. Analysis</span>
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
                <span>2. Streak History</span>
              </Link>
            </div>
          )}
        </div>

        {/* MedPath Elite Dropdown */}
        <div>
          <button
            type="button"
            onClick={() => setMedpathOpen(!medpathOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isMedpathActive ? '#2563EB' : '#334155',
              backgroundColor: isMedpathActive ? '#EFF6FF' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Award size={18} color={isMedpathActive ? '#2563EB' : '#7C3AED'} />
              <span style={{ fontWeight: 700 }}>MedPath Elite</span>
            </div>
            {medpathOpen ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />}
          </button>

          {medpathOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '28px', marginTop: '4px' }}>
              <Link
                href="/portal/medpath/applications"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname === '/portal/medpath/applications' ? 600 : 500,
                  color: pathname === '/portal/medpath/applications' ? '#2563EB' : '#64748B',
                  backgroundColor: pathname === '/portal/medpath/applications' ? '#DBEAFE' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Building size={15} />
                <span>1. Uni Applications & Status</span>
              </Link>

              <Link
                href="/portal/medpath/pre-enrolment"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: pathname === '/portal/medpath/pre-enrolment' ? 600 : 500,
                  color: pathname === '/portal/medpath/pre-enrolment' ? '#2563EB' : '#64748B',
                  backgroundColor: pathname === '/portal/medpath/pre-enrolment' ? '#DBEAFE' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Compass size={15} />
                <span>2. Pre-Enrolment Roadmap</span>
              </Link>
            </div>
          )}
        </div>

        {/* Document Vault */}
        <Link
          href="/portal/documents"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: pathname === '/portal/documents' ? 600 : 500,
            color: pathname === '/portal/documents' ? '#2563EB' : '#475569',
            backgroundColor: pathname === '/portal/documents' ? '#EFF6FF' : 'transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ color: pathname === '/portal/documents' ? '#2563EB' : '#64748B' }}>
            <FolderLock size={18} />
          </span>
          <span>Document Vault</span>
        </Link>

        {/* Ask Doubts / Mentorship link */}
        <Link
          href="/portal/doubts"
          style={{
            display: 'flex',
            alignItems: 'center',
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
          <span>Ask Doubts</span>
        </Link>
      </nav>

      {/* Footer / Logout & Back to Public */}
      <div style={{ padding: '16px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
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
          <span>Sign Out</span>
        </button>

        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
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
          <span>Exit to Public Site</span>
        </Link>
      </div>
    </aside>
  );
}
