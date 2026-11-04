'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Package,
  Award,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { getPackageByIdOrName, resolveEffectivePackage, getStudentTier } from '@/lib/packages';

export default function StudentAccountPage() {
  const { currentUser } = useAppStore();
  const [copiedId, setCopiedId] = useState(false);
  const [loading, setLoading] = useState(true);

  // Authoritative synced registration data
  const [studentData, setStudentData] = useState<{
    fullName: string;
    email: string;
    whatsapp: string;
    country: string;
    address: string;
    packageName: string;
    packagePrice: string;
    amaId: string;
    enrolledAt: string;
    paymentApproved: boolean;
  }>({
    fullName: currentUser?.firstName
      ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
      : 'Student',
    email: currentUser?.email || '',
    whatsapp: currentUser?.whatsappNumber || currentUser?.phone || '',
    country: currentUser?.country || '',
    address: currentUser?.address || '',
    packageName: currentUser?.selectedPackage || 'Ahsora IMAT Ascend',
    packagePrice: currentUser?.packagePrice || '€99',
    amaId: currentUser?.ama_id || currentUser?.amaId || 'AMA-NEW',
    enrolledAt: currentUser?.createdAt || '',
    paymentApproved: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadAccountData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let email = user?.email || currentUser?.email || '';
        let meta = user?.user_metadata || {};

        let fullName =
          meta.full_name ||
          (meta.first_name ? `${meta.first_name} ${meta.last_name || ''}`.trim() : '') ||
          currentUser?.firstName
            ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
            : 'Enrolled Student';
        let whatsapp =
          meta.whatsapp_number ||
          meta.phone ||
          currentUser?.whatsappNumber ||
          currentUser?.phone ||
          '';
        let country = meta.country || currentUser?.country || '';
        let address = meta.address || currentUser?.address || '';
        let pkgName =
          meta.selected_package ||
          meta.selectedPackage ||
          currentUser?.selectedPackage ||
          'Ahsora IMAT Ascend';
        let pkgPrice =
          meta.package_price ||
          meta.packagePrice ||
          currentUser?.packagePrice ||
          '';
        let amaId =
          meta.ama_id ||
          currentUser?.ama_id ||
          currentUser?.amaId ||
          '';
        let approved = true;
        let enrolledDate = user?.created_at || currentUser?.createdAt || '';

        // Query /api/admin/students for canonical DB records
        if (email) {
          try {
            const res = await fetch(`/api/admin/students?t=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
              const json = await res.json();
              if (json.success && Array.isArray(json.students)) {
                const matched = json.students.find(
                  (s: any) => (s.email || '').toLowerCase().trim() === email.toLowerCase().trim()
                );
                if (matched) {
                  if (matched.full_name) fullName = matched.full_name;
                  if (matched.whatsapp_number) whatsapp = matched.whatsapp_number;
                  if (matched.country && matched.country !== 'International') country = matched.country;
                  if (matched.address && matched.address !== 'Address on file') address = matched.address;
                  if (matched.selected_package) pkgName = matched.selected_package;
                  if (matched.package_price) pkgPrice = matched.package_price;
                  if (matched.ama_id) amaId = matched.ama_id;
                  if (matched.payment_approved !== undefined) approved = Boolean(matched.payment_approved);
                  if (matched.created_at) enrolledDate = matched.created_at;
                }
              }
            }
          } catch (e) {
            console.warn('Student account fetch fallback note:', e);
          }
        }

        const matchedPkg = getPackageByIdOrName(pkgName);

        if (isMounted) {
          setStudentData({
            fullName: fullName || 'Enrolled Student',
            email: email || 'student@ahsora.com',
            whatsapp: whatsapp || 'Not specified',
            country: country || 'International',
            address: address || 'On official academic record',
            packageName: matchedPkg.name,
            packagePrice: pkgPrice || matchedPkg.price,
            amaId: amaId || (user?.id ? `AMA-${user.id.slice(0, 6).toUpperCase()}` : 'AMA-VERIFIED'),
            enrolledAt: enrolledDate || new Date().toISOString(),
            paymentApproved: approved,
          });
        }
      } catch (err) {
        console.error('Error loading account:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAccountData();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const copyEnrollmentId = () => {
    if (studentData.amaId) {
      navigator.clipboard.writeText(studentData.amaId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const matchedPkg = getPackageByIdOrName(studentData.packageName);
  const tier = getStudentTier(matchedPkg.name);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 20px 60px' }}>
      {/* Page Title & Breadcrumb */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#64748B', marginBottom: '8px' }}>
          <Link href="/portal/dashboard" style={{ color: '#64748B', textDecoration: 'none' }}>
            Portal
          </Link>
          <span>/</span>
          <span style={{ color: '#059669', fontWeight: 600 }}>My Account</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              My Account
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#64748B' }}>
              Official registration credentials and verified student enrollment information
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                fontSize: '0.8125rem',
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={16} color="#059669" />
              Verified Enrollment Record
            </span>
          </div>
        </div>
      </div>

      {/* Main Official Identity Card Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F291E 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 12px 30px -10px rgba(15, 23, 42, 0.45)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Subtle Decorative Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(92, 237, 115, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar Pill */}
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#FFFFFF',
                boxShadow: '0 8px 20px rgba(5, 150, 105, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                flexShrink: 0,
              }}
            >
              {studentData.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'ST'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  {studentData.fullName}
                </h2>
                <span
                  style={{
                    backgroundColor: 'rgba(92, 237, 115, 0.15)',
                    border: '1px solid rgba(92, 237, 115, 0.35)',
                    color: '#5CED73',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <Sparkles size={11} /> {studentData.paymentApproved ? 'Active Student' : 'Pending'}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '4px' }}>
                {studentData.email}
              </div>
            </div>
          </div>

          {/* Prominent Official Enrolment No. Box */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '14px',
              padding: '14px 20px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              minWidth: '220px',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={13} color="#5CED73" />
              Official Enrolment No.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#5CED73',
                  letterSpacing: '0.06em',
                }}
              >
                {studentData.amaId}
              </span>
              <button
                type="button"
                onClick={copyEnrollmentId}
                title="Copy Official Enrolment No."
                style={{
                  backgroundColor: copiedId ? '#059669' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
              >
                {copiedId ? <Check size={12} color="#FFFFFF" /> : <Copy size={12} />}
                {copiedId ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Grid (Only Basic Info Submitted at Registration) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        {/* 1. Official Enrolment Number */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px 22px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Enrolment Number
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Permanent Academy Candidate ID</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              {studentData.amaId}
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '6px' }}>
              Locked
            </span>
          </div>
        </div>

        {/* 2. Full Name */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px 22px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Full Name
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>As registered on official certificate</div>
            </div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>
            {studentData.fullName}
          </div>
        </div>

        {/* 3. Email Address */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px 22px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Email Address
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Primary login & academy communications</div>
            </div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', wordBreak: 'break-all' }}>
            {studentData.email}
          </div>
        </div>

        {/* 4. WhatsApp Number */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px 22px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                WhatsApp Number
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>For academic updates & tutor access</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>
              {studentData.whatsapp}
            </span>
            {studentData.whatsapp && studentData.whatsapp !== 'Not specified' ? (
              <a
                href={`https://wa.me/${studentData.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}
                title="Open WhatsApp chat"
              >
                Open <ExternalLink size={12} />
              </a>
            ) : null}
          </div>
        </div>

        {/* 5. Country of Residence */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px 22px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Country of Residence
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Official nationality & quota eligibility</div>
            </div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>
            {studentData.country}
          </div>
        </div>

        {/* 6. Physical Address */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px 22px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Physical Address
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Billing & dispatch address on file</div>
            </div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontWeight: 600, fontSize: '0.875rem', color: '#0F172A', wordBreak: 'break-word', lineHeight: 1.4 }}>
            {studentData.address}
          </div>
        </div>

        {/* 7. Enrolled Academic Package */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px 22px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gridColumn: '1 / -1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: tier === 'elite' ? '#FFF7ED' : tier === 'mastery' ? '#ECFDF5' : '#F0F9FF',
                  color: tier === 'elite' ? '#EA580C' : tier === 'mastery' ? '#059669' : '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Package size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Enrolled Academic Package
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Active tier granting academy portal access</div>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 900,
                color: tier === 'elite' ? '#C2410C' : tier === 'mastery' ? '#047857' : '#0284C7',
                backgroundColor: tier === 'elite' ? '#FFF7ED' : tier === 'mastery' ? '#F0FFF4' : '#F0F9FF',
                border: `1px solid ${tier === 'elite' ? '#FED7AA' : tier === 'mastery' ? '#BBF7D0' : '#BAE6FD'}`,
                padding: '6px 14px',
                borderRadius: '8px',
              }}
            >
              Amount Paid: {studentData.packagePrice}
            </span>
          </div>

          <div
            style={{
              backgroundColor: '#F8FAFC',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                {studentData.packageName}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                Full access to syllabus question bank, timed mock simulations, and lecture recordings
              </div>
            </div>
            <Link
              href="/portal/courses"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#059669',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Browse Curriculum <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Immutable Data Notice & Support Link */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '22px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#F1F5F9',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <Lock size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Official Academy Record Locked
          </div>
          <p style={{ margin: 0, fontSize: '0.835rem', color: '#64748B', lineHeight: 1.5 }}>
            To safeguard official exam accreditation and candidate ranking integrity, information submitted during registration cannot be edited directly by candidates. If you need to officially update your contact details or address on file, please reach out directly to the Ahsora Academic Registrar.
          </p>
          <div style={{ marginTop: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/393333444479?text=${encodeURIComponent(`Hello Ahsora Registrar, I am enrolled as ${studentData.fullName} (ID: ${studentData.amaId}). I would like to request an update to my account details.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#059669',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.2)',
              }}
            >
              <Phone size={13} />
              Contact Registrar on WhatsApp
            </a>
            <a
              href="mailto:support@ahsorameds.com"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#475569',
                border: '1px solid #CBD5E1',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Mail size={13} />
              Email Student Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
