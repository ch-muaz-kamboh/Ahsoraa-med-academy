'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

import Logo from '@/components/brand/Logo';

export default function Footer() {
  const pathname = usePathname();

  // If inside portal, admin, or staff layout, hide public footer
  if (pathname?.startsWith('/portal') || pathname?.startsWith('/admin') || pathname?.startsWith('/staff')) {
    return null;
  }

  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#CBD5E1',
        borderTop: '1px solid #1E293B',
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
              <Logo height={64} />
            </Link>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Complete exam preparation, admissions consultancy, and university placement support across Italy, the UK, Germany, Hungary, and the USA.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5CED73', fontSize: '0.8125rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Certified Admissions &amp; Exam Mentors</span>
            </div>
          </div>

          {/* Academic Programs */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Courses &amp; Tests
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#94A3B8' }}>
              <li><Link href="/courses" style={{ color: '#94A3B8', textDecoration: 'none' }}>All Courses</Link></li>
              <li><Link href="/courses" style={{ color: '#94A3B8', textDecoration: 'none' }}>Admissions Prep Programs</Link></li>
              <li><Link href="/courses" style={{ color: '#94A3B8', textDecoration: 'none' }}>Language &amp; Placement Courses</Link></li>
              <li><Link href="/mock-tests" style={{ color: '#94A3B8', textDecoration: 'none' }}>Mock Tests &amp; Assessments</Link></li>
            </ul>
          </div>

          {/* Global Admissions */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              University Admissions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#94A3B8' }}>
              <li><Link href="/universities" style={{ color: '#94A3B8', textDecoration: 'none' }}>Universities in Italy</Link></li>
              <li><Link href="/universities" style={{ color: '#94A3B8', textDecoration: 'none' }}>Universities in Hungary</Link></li>
              <li><Link href="/scholarships" style={{ color: '#94A3B8', textDecoration: 'none' }}>Scholarships &amp; Grants</Link></li>
              <li><Link href="/visa" style={{ color: '#94A3B8', textDecoration: 'none' }}>Student Visa Roadmap</Link></li>
              <li><Link href="/about" style={{ color: '#94A3B8', textDecoration: 'none' }}>About Ahsora Meds</Link></li>
              <li><Link href="/terms" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms &amp; Purchase Policies</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Direct Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#94A3B8' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#5CED73" />
                <span>admissions@ahsorameds.com</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#5CED73" />
                <span>+39 333 344 4479</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="#5CED73" />
                <span>Messina, Italy • Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8125rem',
            color: '#64748B',
          }}
        >
          <div style={{ color: '#64748B' }}>
            © {new Date().getFullYear()} Ahsora Meds Academy. All rights reserved. Centralized pricing and verified admissions curriculum.
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Use &amp; Purchase</Link>
            <Link href="/refund-policy" style={{ color: '#64748B', textDecoration: 'none' }}>Cancellation &amp; Refunds</Link>
            <Link href="/admissions-disclaimer" style={{ color: '#64748B', textDecoration: 'none' }}>Admissions Disclaimer</Link>
            <Link href="/staff/dashboard" style={{ color: '#5CED73', fontWeight: 600, textDecoration: 'none' }}>Staff Portal</Link>
            <Link href="/admin/dashboard" style={{ color: '#64748B', textDecoration: 'none' }}>Admin Panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
