'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { UserCheck, Shield, BookOpen, Mail, Key, CheckCircle2 } from 'lucide-react';

export default function StaffProfilePage() {
  const { staffProfile } = useAppStore();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
          Staff Account & RBAC Profile
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Your verified Ahsora Meds Academy instructor account and active subject/cohort permissions.
        </p>
      </div>

      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #E2E8F0' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
            }}
          >
            {staffProfile.displayName.charAt(0)}
          </div>

          <div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
              {staffProfile.displayName}
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} />
              <span>{staffProfile.email}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Active RBAC Role
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2563EB', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} />
              <span>{staffProfile.role.toUpperCase().replace('_', ' ')}</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Account Status
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span>ACTIVE & VERIFIED</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
            Assigned Teaching Scopes
          </h3>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '6px' }}>Assigned Subjects:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {staffProfile.assignedSubjects.map((sub) => (
                <span key={sub} className="badge badge-blue" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>
                  {sub}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '6px' }}>Assigned Student Cohorts:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {staffProfile.assignedCohorts.map((co) => (
                <span key={co} className="badge badge-green" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>
                  {co}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
