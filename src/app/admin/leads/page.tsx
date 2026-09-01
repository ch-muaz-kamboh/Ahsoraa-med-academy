'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Filter,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Lead, LeadStage } from '@/types';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

export default function AdminLeadsPage() {
  const { leads, updateLeadStage } = useAppStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const stages: { stage: LeadStage; title: string; color: string }[] = [
    { stage: 'new', title: 'New Leads', color: '#14B8A6' },
    { stage: 'contacted', title: 'Contacted', color: '#6366F1' },
    { stage: 'qualified', title: 'Qualified', color: '#8B5CF6' },
    { stage: 'counselling_booked', title: 'Counselling Booked', color: '#F59E0B' },
    { stage: 'proposal_sent', title: 'Proposal Sent', color: '#EC4899' },
    { stage: 'converted', title: 'Converted / Enrolled', color: '#10B981' },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '4px' }}>
            CRM Leads & Admissions Pipeline
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Manage prospective student enquiries, track counselling appointments, and assign admissions advisors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '4px',
              display: 'flex',
              gap: '4px',
            }}
          >
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                backgroundColor: viewMode === 'kanban' ? '#0D7C7A' : 'transparent',
                color: viewMode === 'kanban' ? '#FFFFFF' : '#64748B',
              }}
            >
              Kanban Pipeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                backgroundColor: viewMode === 'table' ? '#0D7C7A' : 'transparent',
                color: viewMode === 'table' ? '#FFFFFF' : '#64748B',
              }}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.875rem' }}
          >
            <Plus size={16} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            alignItems: 'start',
            overflowX: 'auto',
            paddingBottom: '20px',
          }}
        >
          {stages.map((col) => {
            const colLeads = leads.filter((l) => l.stage === col.stage);
            return (
              <div
                key={col.stage}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: '400px',
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '10px',
                    borderBottom: `2px solid ${col.color}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                    <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>{col.title}</strong>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: '#F1F5F9',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      color: '#475569',
                    }}
                  >
                    {colLeads.length}
                  </span>
                </div>

                {/* Lead Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {colLeads.map((ld) => (
                    <div
                      key={ld.id}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onClick={() => setSelectedLead(ld)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#0D7C7A' }}>
                          {ld.leadCode}
                        </span>
                        <span className={ld.priority === 'hot' ? 'badge badge-red' : 'badge badge-amber'} style={{ padding: '1px 6px', fontSize: '0.6875rem' }}>
                          {ld.priority.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem', marginBottom: '4px' }}>
                        {ld.name}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>
                        {ld.targetExam} • {ld.country}
                      </div>

                      {/* Move Stage Selector */}
                      <div
                        style={{
                          marginTop: '8px',
                          borderTop: '1px solid #E2E8F0',
                          paddingTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <select
                          className="form-select"
                          style={{ fontSize: '0.75rem', padding: '2px 6px', width: 'auto' }}
                          value={ld.stage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateLeadStage(ld.id, e.target.value as LeadStage)}
                        >
                          {stages.map((s) => (
                            <option key={s.stage} value={s.stage}>
                              Move to {s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '14px 16px' }}>Code</th>
                <th style={{ padding: '14px 16px' }}>Lead Name</th>
                <th style={{ padding: '14px 16px' }}>Target Exam & Country</th>
                <th style={{ padding: '14px 16px' }}>Contact</th>
                <th style={{ padding: '14px 16px' }}>Stage</th>
                <th style={{ padding: '14px 16px' }}>Counsellor</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((ld) => (
                <tr key={ld.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0D7C7A' }}>
                    {ld.leadCode}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0F172A' }}>
                    {ld.name}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>
                    {ld.targetExam} ({ld.targetCountry})
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.8125rem' }}>
                    {ld.email}<br />{ld.phone}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-blue">{ld.stage.replace('_', ' ')}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>
                    {ld.assignedCounsellor || 'Unassigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Lead Drawer/Modal */}
      {selectedLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '4px' }}>
                  {selectedLead.leadCode}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#0F172A', margin: 0 }}>
                  {selectedLead.name}
                </h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="btn-outline" style={{ padding: '4px 10px' }}>
                Close
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', marginBottom: '20px' }}>
              <div>Email: <strong>{selectedLead.email}</strong></div>
              <div>Phone / WhatsApp: <strong>{selectedLead.phone}</strong></div>
              <div>Location: <strong>{selectedLead.country}</strong></div>
              <div>Target Exam: <strong>{selectedLead.targetExam}</strong></div>
              <div>Target Country: <strong>{selectedLead.targetCountry}</strong></div>
              <div>Academic Background: <strong>{selectedLead.academicBackground}</strong></div>
              <div>Budget: <strong>{selectedLead.budgetRange}</strong></div>
              {selectedLead.notes && <div>Staff Notes: <p style={{ color: '#64748B', marginTop: '4px' }}>{selectedLead.notes}</p></div>}
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  updateLeadStage(selectedLead.id, 'converted');
                  setSelectedLead(null);
                }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', backgroundColor: '#10B981' }}
              >
                Convert to Student Account
              </button>
            </div>
          </div>
        </div>
      )}

      <LeadCaptureModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
