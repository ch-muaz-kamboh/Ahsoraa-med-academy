'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  GraduationCap,
  FolderCheck,
  TrendingUp,
  ArrowUpRight,
  KanbanSquare,
  FileSignature,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { mockApplicationCases } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const { leads, documents, courses } = useAppStore();

  const activeLeadsCount = leads.length;
  const pendingDocsCount = documents.filter((d) => d.status === 'under_review' || d.status === 'revision_requested').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          Executive Management Dashboard
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Real-time metrics across student admissions, CRM pipeline, course revenue, and document verification.
        </p>
      </div>

      {/* KPI Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Active CRM Leads</span>
            <Users size={18} color="#22C55E" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{activeLeadsCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, marginTop: '4px' }}>
            +18% from last week
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Monthly Revenue</span>
            <DollarSign size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>$48,920</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, marginTop: '4px' }}>
            Centralized Checkout Sync
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Active Admissions</span>
            <GraduationCap size={18} color="#22C55E" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>142</div>
          <div style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: 600, marginTop: '4px' }}>
            Italy, Hungary, UK, Germany
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Pending Documents</span>
            <FolderCheck size={18} color="#D97706" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706' }}>{pendingDocsCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            Requires Staff Approval
          </div>
        </div>
      </div>

      {/* 2-Column Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        {/* Recent Leads Pipeline */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', color: '#0F172A' }}>Recent Enquiry Leads</h3>
            <Link href="/admin/leads" style={{ fontSize: '0.8125rem', color: '#22C55E', fontWeight: 600 }}>
              Open CRM Pipeline →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leads.slice(0, 4).map((ld) => (
              <div
                key={ld.id}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9375rem' }}>
                    {ld.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {ld.targetExam} • {ld.country} • Score: {ld.leadScore}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-blue">{ld.stage.replace('_', ' ')}</span>
                  <Link
                    href="/admin/leads"
                    className="btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Actions */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '16px' }}>
            Operational Shortcuts
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              href="/admin/leads"
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
            >
              <KanbanSquare size={16} />
              <span>CRM Lead Pipeline</span>
            </Link>

            <Link
              href="/admin/documents"
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
            >
              <FolderCheck size={16} />
              <span>Document Verification Queue</span>
            </Link>

            <Link
              href="/admin/courses"
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
            >
              <GraduationCap size={16} />
              <span>Centralized Course Pricing</span>
            </Link>

            <Link
              href="/admin/tests"
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
            >
              <FileSignature size={16} />
              <span>CBT Test Question Bank</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
