'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

import Logo from '@/components/brand/Logo';

export default function Footer() {
  const pathname = usePathname();

  // If inside portal or admin layout, hide public footer
  if (pathname?.startsWith('/portal') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        paddingTop: '60px',
        paddingBottom: '40px',
        marginTop: '80px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Col */}
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '16px', textDecoration: 'none' }}>
              <Logo height={44} />
            </Link>
            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Complete exam preparation, admissions consultancy, and university placement support across Italy, the UK, Germany, Hungary, and the USA.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '0.8125rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Certified Admissions & Exam Mentors</span>
            </div>
          </div>

          {/* Academic Programs */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Courses & Tests
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#64748B' }}>
              <li><Link href="/courses">All Courses</Link></li>
              <li><Link href="/courses">Admissions Prep Programs</Link></li>
              <li><Link href="/courses">Language & Placement Courses</Link></li>
              <li><Link href="/mock-tests">Mock Tests & Assessments</Link></li>
            </ul>
          </div>

          {/* Global Admissions */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              University Admissions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#64748B' }}>
              <li><Link href="/universities">Universities in Italy</Link></li>
              <li><Link href="/universities">Universities in Hungary</Link></li>
              <li><Link href="/scholarships">Scholarships & Grants</Link></li>
              <li><Link href="/visa">Student Visa Roadmap</Link></li>
              <li><Link href="/about">About Ahsora Meds</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Direct Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#64748B' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#2563EB" />
                <span>admissions@ahsorameds.com</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#2563EB" />
                <span>+1 (800) 492-7637</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="#2563EB" />
                <span>London • Milan • Chicago</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #F1F5F9',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8125rem',
            color: '#94A3B8',
          }}
        >
          <div>
            © {new Date().getFullYear()} Ahsora Meds Academy Inc. All rights reserved. Centralized pricing and verified admissions curriculum.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/about">Privacy Policy</Link>
            <Link href="/about">Terms of Service</Link>
            <Link href="/about">Admissions Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
