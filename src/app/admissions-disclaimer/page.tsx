'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, AlertTriangle, Mail } from 'lucide-react';

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. No Guarantee of Admission',
    body: [
      'Ahsora Med Academy provides educational preparation, mentoring, and administrative guidance only. We are not a university, admissions authority, or government body, and we do not make admission decisions.',
      'Enrolling in any Ahsora package — including Ahsora Path Elite — does not guarantee a place at any university, a specific IMAT / entrance exam score, a ranking position, or acceptance into any degree programme.',
    ],
  },
  {
    title: '2. Third-Party Decisions',
    body: [
      'Admission outcomes, rankings, cut-off scores, Declarations of Value (DOV), visa approvals, scholarships (e.g. DSU / regional grants), and housing allocations are decided solely by universities, ministries, embassies, and other independent third parties.',
      'These bodies may change their rules, deadlines, quotas, fees, or requirements at any time. We are not responsible for such changes or for decisions made by them.',
    ],
  },
  {
    title: '3. Accuracy of Information',
    body: [
      'We make reasonable efforts to keep exam dates, deadlines, and procedural guidance accurate and up to date. However, official sources (university bandi, MUR, Universitaly, embassies) always prevail. Students are responsible for verifying critical information directly with the relevant authority.',
    ],
  },
  {
    title: '4. Student Responsibilities',
    body: [
      'Students are responsible for submitting complete, truthful, and timely applications and documents, meeting all eligibility criteria, paying official fees, and attending required exams, interviews, and appointments.',
      'Delays or refusals caused by incomplete documents, missed deadlines, or inaccurate information provided by the student are outside the Academy’s control.',
    ],
  },
  {
    title: '5. Results & Testimonials',
    body: [
      'Past student results, success rates, and testimonials shown on our website reflect individual experiences and are not a promise or prediction of future outcomes.',
    ],
  },
];

export default function AdmissionsDisclaimerPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '60px 20px',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(92, 237, 115, 0.12)', border: '1px solid rgba(92, 237, 115, 0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600, color: '#5CED73', marginBottom: '20px' }}>
            <GraduationCap size={16} />
            ADMISSIONS DISCLAIMER
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.2, color: '#FFFFFF' }}>
            Admissions Disclaimer
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Important information about the limits of our services regarding university admissions, exam results, visas, and scholarships.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '860px', margin: '36px auto 0', padding: '0 20px' }}>
        <article style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', color: '#334155', lineHeight: 1.8, fontSize: '0.96rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px', marginBottom: '28px' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: '#64748B', display: 'block' }}>Effective Date</span>
              <strong style={{ color: '#0F172A' }}>1 May 2026</strong>
            </div>
            <Link href="/terms" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Full Terms &amp; Conditions
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '16px 20px', marginBottom: '32px', color: '#92400E', fontSize: '0.9rem' }}>
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '3px' }} />
            <span>
              <strong>Please read carefully:</strong> by registering, you confirm that you understand Ahsora Med Academy cannot guarantee admission, exam scores, visas, or scholarships.
            </span>
          </div>

          {SECTIONS.map((s) => (
            <section key={s.title} style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} style={{ marginBottom: '12px' }}>{p}</p>
              ))}
            </section>
          ))}

          <div style={{ border: '1px solid #BBF7D0', backgroundColor: '#F0FFF4', borderRadius: '12px', padding: '18px', marginTop: '12px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Questions?</div>
            <a href="mailto:admissions@ahsorameds.com" style={{ color: '#059669', fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Mail size={16} /> admissions@ahsorameds.com
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
