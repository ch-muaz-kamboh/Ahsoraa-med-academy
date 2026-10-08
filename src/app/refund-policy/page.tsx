'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, Mail, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '116px 20px 60px',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600, color: '#FDE68A', marginBottom: '20px' }}>
            <RotateCcw size={16} />
            ACADEMY CANCELLATION & REFUND POLICY
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.2 }}>
            Cancellation and Refund Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Clear and transparent policies governing course cancellations, cooling-off periods, and payment disputes.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '860px', margin: '36px auto 0', padding: '0 20px' }}>
        <article style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', color: '#334155', lineHeight: 1.8, fontSize: '0.96rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px', marginBottom: '28px' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: '#64748B', display: 'block' }}>Document Version</span>
              <strong style={{ color: '#0F172A' }}>Section B — Customer Facing Policy</strong>
            </div>
            <Link
              href="/terms"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                color: '#059669',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={16} /> Full Terms of Use & Course Purchase
            </Link>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
            1. Overview & General Policy
          </h2>
          <p>
            We do not offer a paid-course trial or general discretionary refunds after an accepted purchase. Please review the course inclusions, access dates, technical requirements, teaching arrangements, and price before completing payment.
          </p>
          <p>
            Subject to mandatory legal rights, we do not refund a correctly delivered course solely because a student changes their mind, does not attend live classes, voluntary non-use of portal tools, receives an unwanted examination score, or is refused admission, a scholarship, or a visa. Free public mock tests do not create a paid-course trial period.
          </p>

          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', margin: '24px 0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              Summary of Non-Refundable Scenarios:
            </h3>
            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#475569', fontSize: '0.9rem' }}>
              <li>Change of mind after course credentials and portal access are delivered</li>
              <li>Absence or non-attendance during scheduled live classes</li>
              <li>Personal timetable changes, school exams, or travel conflicts</li>
              <li>Performance outcomes on the official IMAT or medical school entrance test</li>
              <li>Official visa delays or embassy decisions beyond Academy control</li>
            </ul>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginTop: '32px', marginBottom: '14px' }}>
            2. Statutory Cooling-Off & Defective Deliveries
          </h2>
          <p>
            This policy does not remove mandatory cancellation or withdrawal rights, rights arising from non-delivery or defective services, correction of duplicate charges, or any specific guarantee expressly made as part of your purchase. We provide the remedies required by the law applicable to your order.
          </p>
          <p>
            Where a statutory cooling-off period applies (such as applicable EU consumer distance selling regulations), a customer may exercise it by an unequivocal cancellation statement within that period, unless a valid legal digital exception applies. Merely logging into the portal does not automatically waive statutory rights.
          </p>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginTop: '32px', marginBottom: '14px' }}>
            3. How to Request a Cancellation or Correction
          </h2>
          <p>
            To request cancellation or report a payment or delivery issue, please reach out with your name, registered email address, and order reference:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', margin: '20px 0' }}>
            <div style={{ border: '1px solid #BBF7D0', backgroundColor: '#F0FFF4', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Email Cancellation Desk</div>
              <a href="mailto:admissions@ahsorameds.com" style={{ color: '#059669', fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none', display: 'block', marginTop: '4px' }}>
                admissions@ahsorameds.com
              </a>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Subject: "Cancellation Request - [Order ID]"</div>
            </div>

            <div style={{ border: '1px solid #A7F3D0', backgroundColor: '#ECFDF5', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#065F46', textTransform: 'uppercase' }}>WhatsApp Admissions Desk</div>
              <a href="https://wa.me/393333444479" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none', display: 'block', marginTop: '4px' }}>
                +39 333 344 4479
              </a>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Fastest support for active students</div>
            </div>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginTop: '32px', marginBottom: '14px' }}>
            4. Refund Processing
          </h2>
          <p>
            Approved or legally required monetary refunds are processed without undue delay using the original payment method unless another lawful method is agreed. We do not charge an arbitrary cancellation fee that unlawfully reduces statutory refunds.
          </p>

        </article>
      </div>
    </div>
  );
}
