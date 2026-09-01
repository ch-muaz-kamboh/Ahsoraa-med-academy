'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Building2,
  MapPin,
  Globe,
  Award,
  CheckCircle,
  FileText,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { mockUniversities } from '@/lib/mock-data';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

export default function UniversityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const university =
    mockUniversities.find((u) => u.id === resolvedParams.id) || mockUniversities[0];

  if (!university) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px', fontSize: '0.875rem', color: '#64748B' }}>
          <Link href="/" style={{ color: '#2563EB' }}>Home</Link> /{' '}
          <Link href="/universities" style={{ color: '#2563EB' }}>Universities</Link> /{' '}
          <span>{university.name}</span>
        </div>

        {/* Hero Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '36px',
            marginBottom: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span className="badge badge-blue">
                <MapPin size={12} />
                {university.city}, {university.country}
              </span>
              <span className="badge badge-green">
                <ShieldCheck size={12} />
                Verified: {university.lastVerifiedAt}
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', color: '#0F172A', lineHeight: 1.2, marginBottom: '16px' }}>
              {university.name}
            </h1>

            <p style={{ color: '#475569', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {university.overview}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href={university.officialWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
                style={{ fontSize: '0.875rem' }}
              >
                <ExternalLink size={16} />
                Official Faculty Website
              </a>
            </div>
          </div>

          {/* Quick Facts Card */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '16px',
              border: '1px solid #BFDBFE',
              padding: '28px',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', color: '#1E3A8A', marginBottom: '16px' }}>
              Admissions Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DBEAFE', paddingBottom: '8px' }}>
                <span style={{ color: '#334155' }}>Annual Tuition:</span>
                <strong style={{ color: '#1E3A8A', fontSize: '1.1rem' }}>
                  {university.currency === 'EUR' ? '€' : '$'}
                  {university.tuitionFeeAnnual.toLocaleString()}/yr
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DBEAFE', paddingBottom: '8px' }}>
                <span style={{ color: '#334155' }}>Program:</span>
                <strong style={{ color: '#0F172A' }}>6-Year MD / MBBS</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DBEAFE', paddingBottom: '8px' }}>
                <span style={{ color: '#334155' }}>Language:</span>
                <strong style={{ color: '#10B981' }}>{university.language}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DBEAFE', paddingBottom: '8px' }}>
                <span style={{ color: '#334155' }}>Intakes:</span>
                <strong style={{ color: '#0F172A' }}>{university.intakes.join(', ')}</strong>
              </div>
            </div>

            <button
              onClick={() => setLeadModalOpen(true)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
            >
              <span>Apply to This University</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Detailed Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {/* Eligibility */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '14px' }}>
              Academic Eligibility & Prerequisites
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '16px' }}>
              {university.eligibility}
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#334155' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10B981" />
                <span>Minimum 12 years of formal education</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10B981" />
                <span>Passing score in official entrance exam</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10B981" />
                <span>Apostille & certified translation of certificates</span>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '14px' }}>
              Available English Medical Programs
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {university.programs.map((prog, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontWeight: 600,
                    color: '#0F172A',
                    fontSize: '0.9375rem',
                  }}
                >
                  {prog}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        defaultCountry={university.country}
      />
    </div>
  );
}
