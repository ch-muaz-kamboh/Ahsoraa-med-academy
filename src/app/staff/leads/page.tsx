'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  Filter,
  Plus,
  Send,
  Calendar,
  Tag,
  ChevronRight,
  X,
  KanbanSquare,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Lead, LeadStage, ContactInquiry } from '@/types';

const STAGES: { key: LeadStage; label: string; color: string; bg: string }[] = [
  { key: 'new', label: 'New Inquiry', color: '#3B82F6', bg: '#EFF6FF' },
  { key: 'contacted', label: 'Contacted', color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'counselling_booked', label: 'Counselling Call', color: '#8B5CF6', bg: '#F5F3FF' },
  { key: 'proposal_sent', label: 'Proposal & Prep', color: '#EC4899', bg: '#FDF2F8' },
  { key: 'converted', label: 'Enrolled / Closed', color: '#10B981', bg: '#ECFDF5' },
];

export default function StaffLeadsPage() {
  const { leads, updateLeadStage, addLead } = useAppStore();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'inquiries'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCountry, setNewLeadCountry] = useState('Italy');
  const [newLeadExam, setNewLeadExam] = useState('IMAT (Italy)');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // Sample inquiries for staff counselling desk
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([
    {
      id: 'inq-staff-1',
      name: 'Elena Dumitru',
      email: 'elena.dumitru@example.com',
      phone: '+39 349 112 8844',
      topic: 'Italian Medical University Placement',
      message: 'Hello, I scored 65 in the IMAT and want guidance on applying to Milan Bicocca vs Pavia. Are non-EU seats still available?',
      status: 'new',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'inq-staff-2',
      name: 'Hamza Tariq',
      email: 'hamza.tariq@example.com',
      phone: '+92 300 123 4567',
      topic: 'Scholarships & Regional Aid',
      message: 'Could you please explain the DSU regional scholarship procedure and deadlines for Messina medical school?',
      status: 'in_review',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: 'inq-staff-3',
      name: 'Sara Lindqvist',
      email: 'sara.l@example.com',
      phone: '+46 70 123 4567',
      topic: 'EU Candidate Pre-Enrollment',
      message: 'Is the Universitaly portal registration open for EU students holding a Swedish diploma?',
      status: 'replied',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ]);

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadEmail.trim()) return;

    addLead({
      name: newLeadName.trim(),
      email: newLeadEmail.trim(),
      phone: newLeadPhone.trim() || 'N/A',
      country: newLeadCountry,
      targetExam: newLeadExam,
      notes: newLeadNotes.trim() ? [newLeadNotes.trim()] : [],
      stage: 'new',
      leadScore: 75,
      assignedCounselor: 'Staff Academic Team',
      tags: ['Staff Direct Entry'],
    });

    setShowAddModal(false);
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadNotes('');
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.targetExam.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q);

      const matchesStage = stageFilter === 'all' || l.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [leads, searchTerm, stageFilter]);

  const toggleInquiryStatus = (id: string) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === id) {
          const nextStatus = inq.status === 'new' ? 'in_review' : inq.status === 'in_review' ? 'replied' : 'resolved';
          return { ...inq, status: nextStatus };
        }
        return inq;
      })
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            Faculty Lead CRM &amp; Student Inquiries
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Review candidate inquiries, consultation stages, and student prospect engagement.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{ backgroundColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.875rem' }}
          >
            <Plus size={16} /> Add Candidate Lead
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>TOTAL CRM LEADS</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{leads.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>Active candidate profiles</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>NEW INQUIRIES</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {leads.filter((l) => l.stage === 'new').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#3B82F6', marginTop: '4px' }}>Pending initial contact</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>IN COUNSELLING</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {leads.filter((l) => l.stage === 'counselling_booked' || l.stage === 'contacted').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '4px' }}>Consultations underway</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #10B981' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>ENROLLED SUCCESS</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {leads.filter((l) => l.stage === 'converted').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>Converted to academy courses</div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('pipeline')}
          style={{
            padding: '10px 18px',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: activeTab === 'pipeline' ? '#059669' : '#64748B',
            borderBottom: activeTab === 'pipeline' ? '2px solid #059669' : 'none',
            background: 'none',
            border: 'none',
            borderBottomStyle: 'solid',
            borderBottomWidth: activeTab === 'pipeline' ? '2px' : '0',
            cursor: 'pointer',
          }}
        >
          Candidate Leads Pipeline ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          style={{
            padding: '10px 18px',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: activeTab === 'inquiries' ? '#059669' : '#64748B',
            background: 'none',
            border: 'none',
            borderBottomStyle: 'solid',
            borderBottomWidth: activeTab === 'inquiries' ? '2px' : '0',
            cursor: 'pointer',
          }}
        >
          Contact Desk Inquiries ({inquiries.length})
        </button>
      </div>

      {activeTab === 'pipeline' ? (
        <div>
          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                placeholder="Search candidates by name, email, target exam, country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.875rem',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="all">All Pipeline Stages</option>
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Leads Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredLeads.length === 0 ? (
              <div style={{ backgroundColor: '#FFFFFF', padding: '48px', textAlign: 'center', borderRadius: '12px', border: '1px solid #E2E8F0', color: '#64748B' }}>
                No candidate leads match your filter criteria.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const currentStageObj = STAGES.find((s) => s.key === lead.stage) || STAGES[0];
                return (
                  <div
                    key={lead.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>{lead.name}</span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            backgroundColor: currentStageObj.bg,
                            color: currentStageObj.color,
                          }}
                        >
                          {currentStageObj.label}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem', color: '#64748B', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={13} /> {lead.email}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={13} /> {lead.phone}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} /> {lead.country}
                        </span>
                        <span style={{ fontWeight: 600, color: '#059669' }}>
                          🎯 {lead.targetExam}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <select
                        value={lead.stage}
                        onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                        style={{
                          fontSize: '0.8125rem',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#F8FAFC',
                          fontWeight: 600,
                        }}
                      >
                        {STAGES.map((s) => (
                          <option key={s.key} value={s.key}>Move to: {s.label}</option>
                        ))}
                      </select>

                      <a
                        href={`https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline"
                        style={{ fontSize: '0.8125rem', padding: '6px 12px', textDecoration: 'none', color: '#059669', borderColor: '#BBF7D0' }}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Inquiries Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {inquiries.map((inq) => (
            <div key={inq.id} style={{ backgroundColor: '#FFFFFF', padding: '22px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{inq.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>({inq.email} • {inq.phone})</span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '10px',
                    backgroundColor: inq.status === 'new' ? '#FEF2F2' : inq.status === 'in_review' ? '#FFFBEB' : '#ECFDF5',
                    color: inq.status === 'new' ? '#DC2626' : inq.status === 'in_review' ? '#D97706' : '#059669',
                    textTransform: 'capitalize',
                  }}
                >
                  {inq.status.replace('_', ' ')}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669', marginBottom: '6px' }}>
                Topic: {inq.topic}
              </div>

              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                {inq.message}
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => toggleInquiryStatus(inq.id)}
                  className="btn-outline"
                  style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
                >
                  Advance Status ({inq.status})
                </button>
                <a
                  href={`mailto:${inq.email}?subject=Ahsora Academic Follow-up: ${encodeURIComponent(inq.topic)}`}
                  className="btn-primary"
                  style={{ backgroundColor: '#059669', fontSize: '0.8125rem', padding: '6px 14px', textDecoration: 'none' }}
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Lead Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '28px', position: 'relative' }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Add New Candidate Lead
            </h3>

            <form onSubmit={handleAddLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  placeholder="e.g. Maria Rossi"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                    placeholder="+39 340 1234567"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Country</label>
                  <input
                    type="text"
                    value={newLeadCountry}
                    onChange={(e) => setNewLeadCountry(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Target Exam</label>
                  <input
                    type="text"
                    value={newLeadExam}
                    onChange={(e) => setNewLeadExam(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Initial Notes</label>
                <textarea
                  rows={3}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  placeholder="Targeting Milan Bicocca non-EU quota..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ backgroundColor: '#059669', padding: '8px 16px', fontSize: '0.875rem' }}
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
