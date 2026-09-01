'use client';

import React from 'react';
import { Plane, Calendar, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { mockVisaCases } from '@/lib/mock-data';

export default function AdminVisaPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          Visa Case Management & Embassy Operations
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Monitor student visa appointments, embassy mock interviews, and financial sponsorship compliance.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {mockVisaCases.map((vc) => (
          <div key={vc.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '4px' }}>
                  Destination: {vc.destinationCountry}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
                  Student Case: Arham Farooq ({vc.visaType})
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-green">
                  Appointment: Sept 12, 2026
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px', fontSize: '0.875rem' }}>
              <strong>Officer Notes:</strong> {vc.notes}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              {vc.checklists.map((chk, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8125rem',
                    color: '#334155',
                  }}
                >
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>{chk.item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
