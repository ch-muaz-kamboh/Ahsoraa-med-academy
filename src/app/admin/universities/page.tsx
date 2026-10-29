'use client';

import React, { useState } from 'react';
import { Building2, ShieldCheck, MapPin, Plus, Table as TableIcon, GraduationCap } from 'lucide-react';
import { mockUniversities } from '@/lib/mock-data';
import CutoffTableManager from '@/components/admin/CutoffTableManager';

export default function AdminUniversitiesPage() {
  const [activeTab, setActiveTab] = useState<'cutoffs' | 'directory'>('cutoffs');

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>
            Italian Universities &amp; Cutoff Management
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem', margin: 0 }}>
            Manage official IMAT cutoff tables (EU &amp; Non-EU), add custom columns or rows, and maintain verified medical faculty facts.
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #E2E8F0',
          marginBottom: '28px',
        }}
      >
        <button
          onClick={() => setActiveTab('cutoffs')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            fontSize: '0.9375rem',
            fontWeight: 800,
            cursor: 'pointer',
            color: activeTab === 'cutoffs' ? '#059669' : '#64748B',
            borderBottom: activeTab === 'cutoffs' ? '3px solid #059669' : '3px solid transparent',
            marginBottom: '-2px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <TableIcon size={18} />
          <span>IMAT Cutoff Tables &amp; Quotas (EU &amp; Non-EU)</span>
          <span style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px' }}>
            Live
          </span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            fontSize: '0.9375rem',
            fontWeight: 800,
            cursor: 'pointer',
            color: activeTab === 'directory' ? '#059669' : '#64748B',
            borderBottom: activeTab === 'directory' ? '3px solid #059669' : '3px solid transparent',
            marginBottom: '-2px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <Building2 size={18} />
          <span>Verified Institutions Directory ({mockUniversities.length})</span>
        </button>
      </div>

      {/* Tab 1: Cutoff Table Manager */}
      {activeTab === 'cutoffs' && (
        <div>
          <CutoffTableManager />
        </div>
      )}

      {/* Tab 2: Directory */}
      {activeTab === 'directory' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
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
      )}
    </div>
  );
}
