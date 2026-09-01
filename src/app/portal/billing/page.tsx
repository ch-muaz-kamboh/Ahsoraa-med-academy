'use client';

import React from 'react';
import { Receipt, CheckCircle, Download, CreditCard, ShieldCheck } from 'lucide-react';

export default function PortalBillingPage() {
  const invoices = [
    {
      id: 'inv-8812',
      orderNumber: 'ORD-2026-USMLE-01',
      productName: 'USMLE Step 1: Clinical High-Yield Mastery Course',
      amount: '$699.00',
      date: '2026-01-15',
      status: 'Paid',
      method: 'Credit Card (Stripe)',
    },
    {
      id: 'inv-8813',
      orderNumber: 'ORD-2026-IT-ADMISSION',
      productName: 'Italian Public Medical University Admissions & DOV Package',
      amount: '$1,250.00',
      date: '2026-02-10',
      status: 'Paid',
      method: 'Bank Wire Transfer',
    },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          Orders, Invoices & Subscriptions
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Centralized billing records, tax invoices, and payment receipts.
        </p>
      </div>

      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
        <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '16px' }}>
          Transaction History
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {invoices.map((inv) => (
            <div
              key={inv.id}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Receipt size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', color: '#0F172A', marginBottom: '2px' }}>
                    {inv.productName}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {inv.orderNumber} • Date: {inv.date} • Method: {inv.method}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
                    {inv.amount}
                  </div>
                  <span className="badge badge-green">✓ {inv.status}</span>
                </div>

                <button
                  onClick={() => alert(`Downloading official PDF tax receipt for ${inv.orderNumber}`)}
                  className="btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  <Download size={14} /> Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
