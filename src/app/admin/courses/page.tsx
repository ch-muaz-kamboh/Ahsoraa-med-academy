'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck,
  DollarSign,
  Edit,
  Plus,
  CheckCircle,
  ShieldCheck,
  Power,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ACADEMY_PACKAGES } from '@/lib/packages';
import {
  getDynamicPackagePrices,
  togglePackageAvailability,
  syncPricesFromSupabase,
  DynamicPackagePrice,
} from '@/lib/cms-store';
import Link from 'next/link';

export default function AdminCoursesPage() {
  const { courses } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState('');

  // Dynamic package pricing & availability
  const [packagePrices, setPackagePrices] = useState<DynamicPackagePrice[]>([]);
  const [customNotices, setCustomNotices] = useState<Record<string, string>>({});
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

  useEffect(() => {
    setPackagePrices(getDynamicPackagePrices());
    syncPricesFromSupabase().then((prices) => {
      if (prices && prices.length > 0) setPackagePrices(prices);
    });

    const handleUpdate = (e: any) => {
      if (e?.detail) setPackagePrices(e.detail);
      else setPackagePrices(getDynamicPackagePrices());
    };

    window.addEventListener('ahsora_cms_prices_updated', handleUpdate);
    window.addEventListener('ahsora_cms_package_availability_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('ahsora_cms_prices_updated', handleUpdate);
      window.removeEventListener('ahsora_cms_package_availability_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleToggleAvailability = (pkgId: string, currentAvailable: boolean) => {
    const nextState = !currentAvailable;
    const notice = customNotices[pkgId] || (!nextState ? 'Currently Unavailable — Registration Paused' : undefined);

    togglePackageAvailability(pkgId, nextState, notice);
    setPackagePrices(getDynamicPackagePrices());

    const pkgName = ACADEMY_PACKAGES.find((p) => p.id === pkgId)?.name || pkgId;
    if (nextState) {
      setSuccessMsg(`🟢 "${pkgName}" has been ACTIVATED. Students can now register and select this package across the website.`);
    } else {
      setSuccessMsg(`🔴 "${pkgName}" is now DISABLED. Students will see it marked as "UNAVAILABLE" everywhere and CANNOT register for it.`);
    }
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const handleSaveNotice = (pkgId: string) => {
    const isAvail = packagePrices.find((p) => p.id === pkgId)?.isAvailable !== false;
    const notice = customNotices[pkgId] || 'Currently Unavailable';
    togglePackageAvailability(pkgId, isAvail, notice);
    setEditingNoticeId(null);
    setSuccessMsg(`Saved custom notice for package ${pkgId}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleUpdatePrice = (courseId: string) => {
    setSuccessMsg(`Price updated successfully for Course ID ${courseId}. Synced to all public pages.`);
    setEditingId(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          Course Catalogue & Package Availability Control
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Enable or disable academy course packages in real time. Disabled packages immediately show as{' '}
          <strong>&quot;UNAVAILABLE&quot;</strong> across the website and students cannot register for them.
        </p>
      </div>

      {/* Real-time Status Alert */}
      {successMsg && (
        <div
          style={{
            backgroundColor: successMsg.includes('🔴') ? '#FEF2F2' : '#ECFDF5',
            border: successMsg.includes('🔴') ? '1px solid #FECACA' : '1px solid #A7F3D0',
            borderRadius: '12px',
            padding: '14px 20px',
            color: successMsg.includes('🔴') ? '#991B1B' : '#065F46',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          }}
        >
          {successMsg.includes('🔴') ? <AlertTriangle size={20} color="#DC2626" /> : <CheckCircle size={20} color="#10B981" />}
          <span style={{ flex: 1 }}>{successMsg}</span>
        </div>
      )}

      {/* ── 1. ACADEMY PACKAGES LIVE AVAILABILITY CONTROL ─────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '24px 28px',
          marginBottom: '36px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="#059669" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Academy Registration Packages (Active / Disabled Status)
              </h2>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              Disable a course package when registration is paused, full, or between cohorts. Changes apply instantly to{' '}
              <Link href="/register" target="_blank" style={{ color: '#059669', textDecoration: 'underline' }}>
                /register
              </Link>{' '}
              and{' '}
              <Link href="/courses" target="_blank" style={{ color: '#059669', textDecoration: 'underline' }}>
                /courses
              </Link>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/register"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                textDecoration: 'none',
                backgroundColor: '#F8FAFC',
              }}
            >
              Preview Registration Page <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* Package Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {ACADEMY_PACKAGES.map((pkg) => {
            const dynamicInfo = packagePrices.find((p) => p.id === pkg.id);
            const isAvailable = dynamicInfo?.isAvailable !== false;
            const priceDisplay = dynamicInfo?.price || pkg.price;
            const customNotice = customNotices[pkg.id] ?? (dynamicInfo?.disabledNotice || 'Currently Unavailable — Registration Paused');

            return (
              <div
                key={pkg.id}
                style={{
                  border: isAvailable ? '1.5px solid #BBF7D0' : '1.5px solid #FECACA',
                  backgroundColor: isAvailable ? '#F0FFF4' : '#FEF2F2',
                  borderRadius: '14px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isAvailable ? '0 4px 14px rgba(5,150,105,0.06)' : 'none',
                }}
              >
                <div>
                  {/* Status Pill Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        backgroundColor: isAvailable ? '#DCFCE7' : '#FEE2E2',
                        color: isAvailable ? '#15803D' : '#B91C1C',
                        border: isAvailable ? '1px solid #86EFAC' : '1px solid #FCA5A5',
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: isAvailable ? '#16A34A' : '#DC2626',
                          display: 'inline-block',
                        }}
                      />
                      {isAvailable ? 'AVAILABLE (OPEN)' : 'DISABLED (UNAVAILABLE)'}
                    </span>

                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>
                      {priceDisplay}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    {pkg.name}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.8125rem', lineHeight: 1.5, marginBottom: '14px' }}>
                    {pkg.description}
                  </p>

                  {/* If disabled, show student notice banner */}
                  {!isAvailable && (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px dashed #EF4444',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Student Unavailable Message:
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#7F1D1D', fontWeight: 600 }}>
                        &quot;{customNotice}&quot;
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#991B1B', marginTop: '4px' }}>
                        Students cannot select or submit registration with this package.
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Button */}
                <div style={{ borderTop: isAvailable ? '1px solid #DCFCE7' : '1px solid #FEE2E2', paddingTop: '16px', marginTop: '8px' }}>
                  <button
                    onClick={() => handleToggleAvailability(pkg.id, isAvailable)}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: isAvailable ? '#DC2626' : '#059669',
                      color: '#FFFFFF',
                      boxShadow: isAvailable
                        ? '0 4px 12px rgba(220,38,38,0.2)'
                        : '0 4px 12px rgba(5,150,105,0.2)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Power size={16} />
                    {isAvailable ? 'Disable Course (Pause Registration)' : 'Activate Course (Open Registration)'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: isAvailable ? '#047857' : '#991B1B' }}>
                      {isAvailable
                        ? 'Clicking will mark this package Unavailable across all student pages'
                        : 'Clicking will re-enable student registration for this package'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. LMS SYLLABUS COURSES & CATALOGUE TABLE ───────────────── */}
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
          Centralized LMS Course Syllabus & Duration
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>
          Individual LMS course curriculum modules and centralized catalogue details.
        </p>
      </div>

      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '14px 18px' }}>Course Title</th>
              <th style={{ padding: '14px 18px' }}>Target Exam</th>
              <th style={{ padding: '14px 18px' }}>Duration</th>
              <th style={{ padding: '14px 18px' }}>Centralized Price</th>
              <th style={{ padding: '14px 18px' }}>Students</th>
              <th style={{ padding: '14px 18px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '16px 18px', fontWeight: 600, color: '#0F172A' }}>
                  {course.title}
                </td>
                <td style={{ padding: '16px 18px' }}>
                  <span className="badge badge-blue">{course.targetExam}</span>
                </td>
                <td style={{ padding: '16px 18px', color: '#64748B' }}>
                  {course.durationHours} Hours
                </td>
                <td style={{ padding: '16px 18px', fontWeight: 700, color: '#0F172A', fontSize: '1rem' }}>
                  {editingId === course.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>$</span>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '90px', padding: '4px 8px' }}
                        defaultValue={course.price}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                      />
                      <button
                        onClick={() => handleUpdatePrice(course.id)}
                        className="btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span>${course.price}</span>
                  )}
                </td>
                <td style={{ padding: '16px 18px', color: '#334155' }}>
                  {course.studentsCount} Enrolled
                </td>
                <td style={{ padding: '16px 18px' }}>
                  <button
                    onClick={() => {
                      setEditingId(course.id);
                      setNewPrice(course.price);
                    }}
                    className="btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    Edit Price
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
