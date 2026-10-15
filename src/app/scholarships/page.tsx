'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Calendar, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { mockScholarships } from '@/lib/mock-data';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

export default function ScholarshipsPage() {
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0F172A 100%)',
          color: '#FFFFFF',
          padding: '116px 20px 60px',
          borderBottom: '1px solid #1E293B',
          marginBottom: '40px',
        }}
      >
        <div className="container">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5CED73', textTransform: 'uppercase', letterSpacing: '1.5px', backgroundColor: 'rgba(92,237,115,0.15)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(92,237,115,0.3)' }}>
            Financial Aid & Grants
          </span>
          <h1 style={{ fontSize: '2.4rem', color: '#FFFFFF', marginTop: '16px', marginBottom: '8px' }}>
            Medical Scholarships & Government Grants
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1rem', maxWidth: '750px', margin: 0 }}>
            Verified government scholarships covering 100% of university tuition, living stipends, and accommodation in Italy, Hungary, and Europe.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Banner: Full 20 Regions Hub */}
        <div
          style={{
            background: 'linear-gradient(135deg, #022C22 0%, #064E3B 100%)',
            borderRadius: '16px',
            padding: '24px 28px',
            color: '#FFFFFF',
            marginBottom: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
            boxShadow: '0 8px 24px rgba(6,78,59,0.18)',
            border: '1.5px solid #059669',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(92,237,115,0.2)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800, color: '#5CED73', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              <ShieldCheck size={12} />
              New · Italy Scholarships Hub 2026/27
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Detailed Regional Directory: All 20 Italian Regions
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.88rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
              Compare official DSU calls across all 20 regions (ER.GO, ERSU Sicily, Lazio DiSCo, EDISU Piedmont, Lombardy), verified deadlines, ISEE Parificato cutoffs, and MUR-listed English medical degrees.
            </p>
          </div>

          <Link
            href="/universities/scholarships"
            style={{
              background: '#5CED73',
              color: '#022C22',
              borderRadius: '999px',
              padding: '12px 24px',
              fontWeight: 800,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(92,237,115,0.3)',
            }}
          >
            Explore 20-Region Directory <ArrowRight size={15} />
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '28px',
          }}
        >
          {mockScholarships.map((sch) => (
            <div
              key={sch.id}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-blue">{sch.country}</span>
                <span className="badge badge-green">
                  <ShieldCheck size={12} />
                  Verified: {sch.lastVerifiedAt}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '8px', lineHeight: 1.3 }}>
                {sch.title}
              </h3>

              <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 700, marginBottom: '14px' }}>
                {sch.coverageAmount}
              </div>

              <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                {sch.eligibilitySummary}
              </p>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.8125rem',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#0F172A',
                }}
              >
                <Calendar size={16} color="#D97706" />
                <span>Application Deadline: <strong>{sch.deadline}</strong></span>
              </div>

              <a
                href={`https://wa.me/393333444479?text=${encodeURIComponent(`Hi Ahsora, I would like to check my scholarship eligibility for ${sch.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ width: '100%', padding: '12px', justifyContent: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Check Scholarship Eligibility</span>
                <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>

      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
      />
    </div>
  );
}
