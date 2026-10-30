'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import SocialLinks from '@/components/common/SocialLinks';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // If inside portal, admin, or staff layout, hide public footer
  if (pathname?.startsWith('/portal') || pathname?.startsWith('/admin') || pathname?.startsWith('/staff')) {
    return null;
  }

  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #071912 0%, #0F2018 50%, #081510 100%)',
        color: '#CBD5E1',
        borderTop: '1px solid rgba(16, 185, 129, 0.15)',
        paddingTop: '36px',
        paddingBottom: '24px',
        marginTop: '44px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '28px',
            marginBottom: '28px',
          }}
        >
          {/* Brand Col */}
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '12px', textDecoration: 'none' }}>
              <Logo height={38} variant="white" />
            </Link>
            <p style={{ color: '#94A3B8', fontSize: '0.84rem', lineHeight: 1.55, marginBottom: '12px' }}>
              {t('footer.tagline', 'Complete exam preparation, admissions consultancy, and verified medical university placement support in Italy.')}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5CED73', fontSize: '0.8rem', fontWeight: 600, marginBottom: '14px' }}>
              <ShieldCheck size={15} />
              <span>{t('footer.certified', 'Certified Admissions & Exam Mentors')}</span>
            </div>

            {/* Social Media Links - Inline with heading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A7F3D0', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                Follow Our Official Channels:
              </span>
              <SocialLinks variant="dark" size="sm" />
            </div>
          </div>

          {/* Academic Programs */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Courses &amp; Tests
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#94A3B8' }}>
              <li><Link href="/imat-preparation-courses" style={{ color: '#94A3B8', textDecoration: 'none' }}>All Courses</Link></li>
              <li><Link href="/imat-preparation-courses" style={{ color: '#94A3B8', textDecoration: 'none' }}>Admissions Prep Programs</Link></li>
              <li><Link href="/imat-preparation-courses" style={{ color: '#94A3B8', textDecoration: 'none' }}>Language &amp; Placement Courses</Link></li>
              <li><Link href="/free-mock" style={{ color: '#94A3B8', textDecoration: 'none' }}>Mock Tests &amp; Assessments</Link></li>
              <li>
                <a
                  href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20have%20an%20inquiry%20about%20courses%20and%20test%20prep"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#5CED73', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}
                >
                  <Phone size={13} color="#25D366" />
                  <span>WhatsApp Prep Desk</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Global Admissions */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              University Admissions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#94A3B8' }}>
              <li><Link href="/medical-universities-italy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Universities in Italy</Link></li>
              <li><Link href="/medical-universities-italy/scholarships" style={{ color: '#94A3B8', textDecoration: 'none' }}>Scholarships &amp; Grants</Link></li>
              <li><Link href="/licensing-exams" style={{ color: '#94A3B8', textDecoration: 'none' }}>Student Visa Roadmap</Link></li>
              <li><Link href="/about" style={{ color: '#94A3B8', textDecoration: 'none' }}>About Ahsora Meds</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Direct Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: '#94A3B8' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#5CED73" />
                <a href="mailto:admissions@ahsorameds.com" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#5CED73'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
                  admissions@ahsorameds.com
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#5CED73" />
                <a href="https://wa.me/393333444479" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease', display: 'inline-flex', alignItems: 'center', gap: '6px' }} onMouseEnter={e => e.currentTarget.style.color = '#5CED73'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
                  <span>+39 333 344 4479</span>
                  <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(37, 211, 102, 0.18)', color: '#25D366', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>WhatsApp</span>
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color="#5CED73" />
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
            © {new Date().getFullYear()} Ahsora Meds Academy. {t('footer.rights', 'All rights reserved.')} Centralized pricing and verified admissions curriculum.
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Use &amp; Purchase</Link>
            <Link href="/refund-policy" style={{ color: '#64748B', textDecoration: 'none' }}>Cancellation &amp; Refunds</Link>
            <Link href="/admissions-disclaimer" style={{ color: '#64748B', textDecoration: 'none' }}>Admissions Disclaimer</Link>
            <Link href="/staff/auth" style={{ color: '#5CED73', fontWeight: 600, textDecoration: 'none' }}>Staff Portal</Link>
            <Link href="/admin/dashboard" style={{ color: '#64748B', textDecoration: 'none' }}>Admin Panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
