'use client';

import React from 'react';
import { Plane, Calendar, CheckCircle2, ShieldCheck, MapPin, FileCheck } from 'lucide-react';
import { mockVisaCases } from '@/lib/mock-data';

export default function PortalVisaPage() {
  const visa = mockVisaCases[0];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          Visa & Embassy Roadmap
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Track your Type D National Student Visa application, appointment dates, and mandatory embassy document checklist.
        </p>
      </div>

      {/* Overview Card */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '6px' }}>
              Destination: {visa.destinationCountry}
            </span>
            <h2 style={{ fontSize: '1.3rem', color: '#0F172A' }}>{visa.visaType}</h2>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem' }}>
            <div>
              <span style={{ color: '#64748B' }}>Assigned Visa Specialist:</span>
              <div style={{ fontWeight: 600, color: '#0F172A' }}>{visa.officerName}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Embassy Appointment:</span>
              <div style={{ fontWeight: 700, color: '#2563EB' }}>
                Sept 12, 2026 (09:30 AM)
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
          <strong style={{ fontSize: '0.875rem', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
            Specialist Case Notes:
          </strong>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>
            {visa.notes}
          </p>
        </div>

        <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '16px' }}>
          Embassy Filing Checklist
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {visa.checklists.map((chk, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span style={{ fontSize: '0.875rem', color: '#0F172A' }}>{chk.item}</span>
              </div>
              <span className="badge badge-green">Ready</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
