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
} from 'lucide-react';
import LeadCaptureModal from '../public/LeadCaptureModal';

import Logo from '@/components/brand/Logo';
import TopOfferBar from './TopOfferBar';

export default function Navbar() {
  const pathname = usePathname();
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

  // If inside portal or admin layout, hide the public navbar
  if (pathname?.startsWith('/portal') || pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: null },
    { href: '/courses', label: 'Courses', icon: <BookOpen size={14} /> },
    { href: '/imat', label: 'IMAT', icon: <FileCheck size={14} /> },
    { href: '/universities', label: 'Universities', icon: <Globe size={14} /> },
    { href: '/resources', label: 'Resources', icon: <Book size={14} /> },
    { href: '/news', label: 'News & Blogs', icon: <Newspaper size={14} /> },
    { href: '/licensing-exams', label: 'Licensing Exams', icon: <Scale size={14} /> },
    { href: '/contact', label: 'Contact Us', icon: <MessageSquare size={14} /> },
    { href: '/about', label: 'About', icon: null },
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
            maxHeight: scrolled ? '0px' : '90px',
            opacity: scrolled ? 0 : 1,
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
            pointerEvents: scrolled ? 'none' : 'auto',
          }}
        >
          <TopOfferBar />
        </div>

        <div
          className="container"
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
              const isActive = pathname === link.href;
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
              <span>Take Free Mock</span>
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
              <span>Portal</span>
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

            {navLinks.map((link) => (
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
            ))}

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
        @media (max-width: 580px) {
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
