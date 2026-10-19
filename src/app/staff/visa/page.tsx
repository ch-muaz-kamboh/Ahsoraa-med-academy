'use client';

import React, { useState } from 'react';
import {
  Plane,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  Shield,
  Search,
  ExternalLink,
} from 'lucide-react';
import { mockVisaCases } from '@/lib/mock-data';

export default function StaffVisaPage() {
  const [cases, setCases] = useState(mockVisaCases);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleChecklist = (caseId: string, itemIdx: number) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const updatedChecklists = [...c.checklists];
          updatedChecklists[itemIdx] = {
            ...updatedChecklists[itemIdx],
            completed: !updatedChecklists[itemIdx].completed,
          };
          return { ...c, checklists: updatedChecklists };
        }
        return c;
      })
    );
  };

  const filtered = cases.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      (c.studentName || '').toLowerCase().includes(q) ||
      c.destinationCountry.toLowerCase().includes(q) ||
      c.visaType.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
          Visa Case Management &amp; Embassy Operations
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Coordinate candidate Italian Type-D study visas, Universitaly summaries, CIMEA/DOV checklists, and mock embassy interviews.
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>ACTIVE VISA CASES</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{cases.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>Tracked embassy files</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>CIMEA / DOV READY</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {cases.filter((c) => c.checklists.some((ch) => ch.item.includes('CIMEA') && ch.completed)).length || 2}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#3B82F6', marginTop: '4px' }}>Apostilled documents verified</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>UPCOMING APPOINTMENTS</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            3
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '4px' }}>Booked with Italian Consulate</div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderLeft: '4px solid #10B981' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>EMBASSY MOCK INTERVIEWS</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            Completed
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>Faculty consultation ready</div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', maxWidth: '400px', position: 'relative' }}>
        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        <input
          type="text"
          placeholder="Filter visa cases by student or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 38px',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            backgroundColor: '#FFFFFF',
          }}
        />
      </div>

      {/* Visa Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filtered.map((vc) => {
          const completedCount = vc.checklists.filter((ch) => ch.completed).length;
          const totalCount = vc.checklists.length;
          const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div key={vc.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '26px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                    <Plane size={13} /> Destination: {vc.destinationCountry}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    Candidate: {vc.studentName || 'Elena Dumitru'} ({vc.visaType})
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 700, backgroundColor: '#ECFDF5', padding: '6px 14px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                    Appointment: Sept 12, 2026
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#64748B', marginBottom: '6px' }}>
                  <span>Checklist Milestones ({completedCount}/{totalCount})</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{percent}% Prepared</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${percent}%`, height: '100%', backgroundColor: '#059669', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Officer Notes */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '18px', fontSize: '0.875rem', color: '#334155' }}>
                <strong style={{ color: '#0F172A' }}>Counselor Notes:</strong> {vc.notes}
              </div>

              {/* Checklist items */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {vc.checklists.map((chk, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleChecklist(vc.id, idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.8125rem',
                      color: chk.completed ? '#047857' : '#475569',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: chk.completed ? '#F0FDF4' : '#F8FAFC',
                      border: `1px solid ${chk.completed ? '#BBF7D0' : '#E2E8F0'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <CheckCircle2 size={16} color={chk.completed ? '#10B981' : '#94A3B8'} />
                    <span style={{ fontWeight: chk.completed ? 600 : 500 }}>{chk.item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
