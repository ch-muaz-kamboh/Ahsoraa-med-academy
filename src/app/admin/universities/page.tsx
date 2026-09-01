'use client';

import React from 'react';
import { Building2, ShieldCheck, MapPin, Plus } from 'lucide-react';
import { mockUniversities } from '@/lib/mock-data';

export default function AdminUniversitiesPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
            University Database & Verified Fact Management
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Manage medical faculty records, official source references, and last-verified review dates.
          </p>
        </div>

        <button
          onClick={() => alert('Opening University Creator modal...')}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.875rem' }}
        >
          <Plus size={16} />
          <span>Add University Record</span>
        </button>
      </div>

      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '14px 18px' }}>Institution Name</th>
              <th style={{ padding: '14px 18px' }}>Country</th>
              <th style={{ padding: '14px 18px' }}>Annual Tuition</th>
              <th style={{ padding: '14px 18px' }}>Language</th>
              <th style={{ padding: '14px 18px' }}>Last Fact-Checked</th>
              <th style={{ padding: '14px 18px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUniversities.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '16px 18px', fontWeight: 600, color: '#0F172A' }}>
                  {u.name}
                </td>
                <td style={{ padding: '16px 18px' }}>
                  <span className="badge badge-blue">{u.country}</span>
                </td>
                <td style={{ padding: '16px 18px', fontWeight: 700, color: '#0F172A' }}>
                  {u.currency === 'EUR' ? '€' : '$'}{u.tuitionFeeAnnual.toLocaleString()}/yr
                </td>
                <td style={{ padding: '16px 18px', color: '#10B981', fontWeight: 600 }}>
                  {u.language}
                </td>
                <td style={{ padding: '16px 18px', color: '#64748B' }}>
                  {u.lastVerifiedAt}
                </td>
                <td style={{ padding: '16px 18px' }}>
                  <button
                    onClick={() => alert(`Editing university record for ${u.name}`)}
                    className="btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    Edit
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
