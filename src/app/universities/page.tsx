'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, Search, Building2, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { mockUniversities } from '@/lib/mock-data';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

export default function UniversitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedUniForModal, setSelectedUniForModal] = useState('');

  const countries = ['All', 'Italy', 'Hungary', 'Germany', 'Georgia'];

  const filteredUnis = mockUniversities.filter((u) => {
    const matchesCountry = selectedCountry === 'All' || u.country === selectedCountry;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.overview.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
            Verified Admissions Database
          </span>
          <h1 style={{ fontSize: '2.4rem', color: '#0F172A', marginTop: '4px', marginBottom: '8px' }}>
            Top Medical Universities in Europe & Beyond
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '750px' }}>
            Search official English-taught medical faculties with verified tuition fees, intake deadlines, and admission criteria.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: selectedCountry === c ? '#2563EB' : '#F1F5F9',
                  color: selectedCountry === c ? '#FFFFFF' : '#475569',
                  transition: 'all 0.15s ease',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search
              size={18}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search university or city..."
              className="form-input"
              style={{ paddingLeft: '38px', borderRadius: '8px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Universities Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '28px',
          }}
        >
          {filteredUnis.map((uni) => (
            <div
              key={uni.id}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-blue">
                  <MapPin size={12} />
                  {uni.city}, {uni.country}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                  World Rank #{uni.rankingWorld}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '10px', lineHeight: 1.3 }}>
                {uni.name}
              </h3>

              <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                {uni.overview}
              </p>

              {/* Specs Box */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '0.8125rem',
                  marginBottom: '20px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Annual Tuition:</span>
                  <strong style={{ color: '#0F172A' }}>
                    {uni.currency === 'EUR' ? '€' : '$'}
                    {uni.tuitionFeeAnnual.toLocaleString()}/yr
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Program Duration:</span>
                  <strong style={{ color: '#0F172A' }}>{uni.durationYears} Years (MD)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Teaching Language:</span>
                  <strong style={{ color: '#10B981' }}>{uni.language}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Last Fact-Checked:</span>
                  <span style={{ color: '#64748B' }}>{uni.lastVerifiedAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href={`/universities/${uni.id}`}
                  className="btn-outline"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}
                >
                  View Details
                </Link>
                <button
                  onClick={() => {
                    setSelectedUniForModal(uni.name);
                    setLeadModalOpen(true);
                  }}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}
                >
                  Apply Here
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        defaultCountry={selectedCountry !== 'All' ? selectedCountry : 'Italy'}
      />
    </div>
  );
}
