'use client';

import React, { useState } from 'react';
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

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  // If inside portal or admin layout, hide the public navbar
  if (pathname?.startsWith('/portal') || pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: null },
    { href: '/about', label: 'About', icon: null },
    { href: '/courses', label: 'Courses', icon: <BookOpen size={16} /> },
    { href: '/imat', label: 'IMAT', icon: <FileCheck size={16} /> },
    { href: '/resources', label: 'Resources', icon: <Book size={16} /> },
    { href: '/universities', label: 'Universities', icon: <Globe size={16} /> },
    { href: '/licensing-exams', label: 'Licensing Exams', icon: <Scale size={16} /> },
    { href: '/news', label: 'News & blogs', icon: <Newspaper size={16} /> },
    { href: '/contact', label: 'Contact Us', icon: <MessageSquare size={16} /> },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
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
            <Logo height={56} />
          </Link>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '16px',
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
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                   color: isActive ? '#22C55E' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/#packages"
              className="btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '0.875rem',
                backgroundColor: '#22C55E',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CreditCard size={16} />
              <span className="hide-mobile">View Packages</span>
              <span className="show-mobile">Packages</span>
            </Link>

            <Link
              href="/portal/dashboard"
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.875rem' }}
            >
              <User size={16} />
              <span className="hide-mobile">Student Portal</span>
            </Link>

            <Link
              href="/admin/dashboard"
              className="btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: '0.875rem',
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                border: '1px solid #334155',
              }}
            >
              <Shield size={16} color="#F59E0B" />
              <span className="hide-mobile">Admin Panel</span>
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
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: pathname === link.href ? '#22C55E' : '#334155',
                  padding: '8px 0',
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '6px 0',
                }}
              >
                Staff / Admin Portal →
              </Link>
            </div>
          </div>
        )}
      </header>

      <style jsx global>{`
        @media (min-width: 900px) {
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
        @media (max-width: 899px) {
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
      `}</style>

      {/* Lead Capture Form Modal */}
      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
      />
    </>
  );
}
