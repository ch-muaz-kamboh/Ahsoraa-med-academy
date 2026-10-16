'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  FileCheck,
  Globe,
  Award,
  Menu,
  X,
  PhoneCall,
  User,
  Shield,
  CreditCard,
  MessageSquare,
  Newspaper,
  Book,
  Scale,
  ChevronDown,
  BarChart3,
} from 'lucide-react';
import LeadCaptureModal from '../public/LeadCaptureModal';

import Logo from '@/components/brand/Logo';
import TopOfferBar from './TopOfferBar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // If inside portal, admin layout, or student portal login page, hide the public navbar & offer bar
  if (pathname?.startsWith('/portal') || pathname?.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  const universitySubLinks = [
    { href: '/universities', label: '1. Universities', desc: 'Browse all 28 Italian medical faculties' },
    { href: '/universities/scholarships', label: '2. Scholarships', desc: '20 Italian regions DSU & financial aid directory' },
    { href: '/universities#cutoff-history', label: '3. IMAT Cutoff Scores', desc: 'EU & Non-EU historical score rankings' },
  ];

  const navLinks = [
    { href: '/', label: t('nav.home', 'Home'), icon: null },
    { href: '/courses', label: t('nav.courses', 'Courses'), icon: <BookOpen size={14} /> },
    { href: '/imat', label: t('nav.imat', 'IMAT'), icon: <FileCheck size={14} /> },
    { href: '/universities', label: t('nav.universities', 'Universities'), icon: <Globe size={14} />, isDropdown: true },
    { href: '/resources', label: t('nav.resources', 'Resources'), icon: <Book size={14} /> },
    { href: '/news', label: t('nav.news', 'News & Blogs'), icon: <Newspaper size={14} /> },
    { href: '/licensing-exams', label: t('nav.licensing', 'Licensing Exams'), icon: <Scale size={14} /> },
    { href: '/contact', label: t('nav.contact', 'Contact Us'), icon: <MessageSquare size={14} /> },
    { href: '/about', label: t('nav.about', 'About'), icon: null },
  ];

  return (
    <>
      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Global Live Offer & Countdown Announcement Bar - disappears smoothly on scroll */}
        <div
          style={{
            maxHeight: scrolled ? '0px' : '85px',
            opacity: scrolled ? 0 : 1,
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
            pointerEvents: scrolled ? 'none' : 'auto',
          }}
        >
          <TopOfferBar />
        </div>

        <div
          className="container nav-main-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '60px',
          }}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Logo height={32} />
          </Link>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '12px',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.isDropdown && pathname?.startsWith('/universities'));

              if (link.isDropdown) {
                return (
                  <div
                    key={link.href}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: isActive ? '#16A34A' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                        transition: 'color 0.15s ease',
                        padding: '6px 0',
                      }}
                    >
                      {link.icon}
                      {link.label}
                      <ChevronDown
                        size={13}
                        style={{
                          transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          color: isActive ? '#16A34A' : '#64748B',
                        }}
                      />
                    </Link>

                    {/* Universities Dropdown Menu */}
                    {dropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '-10px',
                          width: '270px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '14px',
                          border: '1.5px solid #E2E8F0',
                          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(0,0,0,0.04)',
                          padding: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          zIndex: 60,
                          animation: 'fadeIn 0.18s ease-out',
                        }}
                      >
                        {universitySubLinks.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setDropdownOpen(false)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '8px 12px',
                                borderRadius: '9px',
                                textDecoration: 'none',
                                backgroundColor: isSubActive ? '#F0FDF4' : 'transparent',
                                transition: 'background 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#F8FAFC';
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = isSubActive ? '#F0FDF4' : 'transparent';
                              }}
                            >
                              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: isSubActive ? '#059669' : '#0F172A' }}>
                                {sub.label}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                                {sub.desc}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: isActive ? '#16A34A' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LanguageSwitcher variant="navbar" />

            <Link
              href="/free-mock"
              className="nav-free-mock-btn"
              style={{
                padding: '6px 13px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#16A34A',
                border: '1px solid #16A34A',
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{t('nav.free_mock', 'Take Free Mock')}</span>
            </Link>

            <Link
              href="/portal/dashboard"
              className="btn-primary nav-portal-btn"
              style={{
                padding: '6px 14px',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '7px',
                whiteSpace: 'nowrap',
              }}
            >
              <User size={15} />
              <span>{t('nav.portal', 'Portal')}</span>
            </Link>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              style={{
                display: 'none',
                padding: '8px',
                color: '#0F172A',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                backgroundColor: mobileMenuOpen ? '#F1F5F9' : 'transparent',
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              padding: '16px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto',
              boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
            }}
          >
            {/* Language Switcher in Mobile Drawer */}
            <LanguageSwitcher variant="mobile" />

            {/* Quick Actions in Mobile Drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
              <Link
                href="/free-mock"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1.5px solid #059669',
                  color: '#059669',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <span>Take Free IMAT Mock Test</span>
              </Link>
              <Link
                href="/portal/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <User size={16} />
                <span>Student Portal &amp; Dashboard</span>
              </Link>
            </div>

            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.href} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        fontSize: '0.975rem',
                        fontWeight: 700,
                        color: pathname === link.href ? '#059669' : '#0F172A',
                        padding: '10px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                    <div style={{ paddingLeft: '28px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {universitySubLinks.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: pathname === sub.href ? '#059669' : '#64748B',
                            padding: '6px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '0.975rem',
                    fontWeight: 600,
                    color: pathname === link.href ? '#059669' : '#334155',
                    padding: '10px 0',
                    borderBottom: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div style={{ paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <Link
                href="/staff/auth"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}
              >
                <span>Faculty &amp; Staff Login &rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <style jsx global>{`
        @media (min-width: 1060px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
          .show-mobile {
            display: none;
          }
        }
        @media (max-width: 1059px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
          .hide-mobile {
            display: none;
          }
          .show-mobile {
            display: inline;
          }
        }
        @media (max-width: 640px) {
          .nav-main-row {
            height: 54px !important;
          }
          .nav-free-mock-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* Lead Capture Form Modal */}
      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
      />
    </>
  );
}
