'use client';

import React from 'react';
import { History, Shield, Lock, AlertCircle, Clock } from 'lucide-react';
import { mockAuditLogs } from '@/lib/mock-data';

export default function AdminAuditLogsPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          Compliance & Security Audit Logs
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Immutable log of all authorization checks, status modifications, pricing changes, and role events according to PRD Rule 72.
        </p>
      </div>

      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '14px 18px' }}>Timestamp</th>
              <th style={{ padding: '14px 18px' }}>Actor</th>
              <th style={{ padding: '14px 18px' }}>Role</th>
              <th style={{ padding: '14px 18px' }}>Action Event</th>
              <th style={{ padding: '14px 18px' }}>Entity</th>
              <th style={{ padding: '14px 18px' }}>Audit Details</th>
            </tr>
          </thead>
          <tbody>
            {mockAuditLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 18px', color: '#64748B', fontSize: '0.8125rem' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: '#0F172A' }}>
                  {log.actorName}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span className="badge badge-blue">{log.actorRole.replace('_', ' ')}</span>
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: '#0D7C7A' }}>
                  {log.action}
                </td>
                <td style={{ padding: '14px 18px', color: '#334155' }}>
                  {log.entityType}
                </td>
                <td style={{ padding: '14px 18px', color: '#64748B', fontSize: '0.8125rem' }}>
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
