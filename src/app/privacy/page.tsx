'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Clock,
  Mail,
  Phone,
  Globe,
  Database,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0F172A 100%)',
          color: '#FFFFFF',
          padding: '116px 20px 60px',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(92, 237, 115, 0.12)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600, color: '#5CED73', border: '1px solid rgba(92, 237, 115, 0.25)', marginBottom: '20px' }}>
            <ShieldCheck size={16} />
            STUDENT PRIVACY & DATA TRANSPARENCY
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.2 }}>
            Website Privacy Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
            How Ahsora Med Academy handles personal information, student records, learning diagnostics, and data privacy rights across Italy, Pakistan, and internationally.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '28px', fontSize: '0.875rem', color: '#CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#5CED73" />
              <span><strong>Effective Date:</strong> 1 May 2026</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} color="#34D399" />
              <span><strong>Operations:</strong> Italy, Pakistan & International</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={16} color="#FBBF24" />
              <span><strong>Compliance:</strong> GDPR & Global Student Privacy Standards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1100px', margin: '36px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '36px', alignItems: 'start' }}>
          
          {/* Privacy Notice Document */}
          <article style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', color: '#334155', lineHeight: 1.8, fontSize: '0.96rem' }}>
            
            {/* Section 1 */}
            <section id="section-1" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>1</span>
                Who we are and how to contact us
              </h2>
              <p>
                <strong>Ahsora Meds Academy</strong> operates Ahsorameds.com and provides online educational courses, entrance exam preparation, learning resources, and related student support to students worldwide. We operate across multiple locations, including Italy and Pakistan. Our admissions, administration, and teaching staff reside and work in Italy, Pakistan, and other countries.
              </p>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px 20px', marginTop: '12px' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>PRIVACY INQUIRIES & DATA RIGHTS DESK</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#059669" />
                  <a href="mailto:admissions@ahsorameds.com?subject=Privacy%20Request" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
                    admissions@ahsorameds.com
                  </a>
                  <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>(Include “Privacy Request” in the subject line)</span>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="section-2" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>2</span>
                What this policy covers
              </h2>
              <p>
                This policy explains how we handle personal information when you visit our website, submit an inquiry, register an account, enroll in or access a course, use our student portal, participate in live masterclasses, attempt CBT mock tests, or communicate with our mentorship team.
              </p>
              <p>
                It covers students, parents, legal guardians, and individuals paying on behalf of enrolled students. Using our website or portal does not constitute blanket consent to every use of personal information.
              </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>3</span>
                Information we collect
              </h2>
              <p>We collect information directly relevant to the educational services you use:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Enquiries and contact details:</strong> Full name, email address, WhatsApp/phone number, target country, target university/exam, and messages.</li>
                <li><strong>Account and enrolment information:</strong> Student credentials, chosen package (Ascend, Mastery, or Path Elite), enrolment date, and verified student ID.</li>
                <li><strong>Purchase and payment records:</strong> Purchaser details, course fee, payment verification references, and receipt proofs. We do not store card security PINs or full bank credentials.</li>
                <li><strong>Learning performance:</strong> CBT mock test responses, score breakdowns, subject accuracy, question bank progress, mistake notebook entries, and attendance logs.</li>
                <li><strong>Live session data:</strong> Display name, chat messages, and microphone/video contributions where actively enabled in interactive masterclasses.</li>
                <li><strong>Technical logs:</strong> IP address, browser type, login timestamps, and session security signals.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="section-4" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>4</span>
                Where information comes from
              </h2>
              <p>
                Most information is provided directly by you when enrolling, taking tests, or contacting instructors. In certain cases, we receive verification information from parents/guardians (for minor students) or authorized payment verification channels.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>5</span>
                How and why we use information
              </h2>
              <p>We process personal data for clear, lawful academic purposes:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Course delivery & portal access:</strong> Setting up accounts, providing lecture videos, test banks, and interactive classes.</li>
                <li><strong>Student progress analytics:</strong> Evaluating diagnostic mock test performance and delivering personalized feedback.</li>
                <li><strong>Payment administration:</strong> Verifying course tuition and issuing authentic enrolment confirmations.</li>
                <li><strong>Service security:</strong> Protecting academic content from unauthorized piracy, account sharing, or malicious intrusion.</li>
                <li><strong>Direct communication:</strong> Sending schedule updates, class links, and academic reminders via email or WhatsApp.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>6</span>
                Learning analytics and account-security reviews
              </h2>
              <p>
                Diagnostics, percentile estimates, and progress statistics displayed on the student portal are formative educational tools designed to optimize study habits. They do not constitute official admission decisions.
              </p>
              <p>
                We do not employ solely automated decision-making systems that carry legal effects. Security reviews for account irregularities involve human oversight.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>7</span>
                Live classes, recordings and student visibility
              </h2>
              <p>
                Interactive live classes (for Mastery and Elite students) may take place on platforms such as Microsoft Teams. Your display name and shared contributions in group sessions are visible to the instructor and cohort participants.
              </p>
              <p>
                Students are prohibited from recording, screenshotting, or distributing fellow students' personal information. Where masterclasses are recorded by the Academy, they are retained solely within the secure portal for enrolled students' revision.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>8</span>
                Cookies and similar technologies
              </h2>
              <p>
                We use strictly necessary cookies and local storage tokens to maintain authenticated sessions, secure CBT test submissions, and save student preferences. We do not sell tracking data to third-party data brokers.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>9</span>
                Marketing and publicity
              </h2>
              <p>
                We only send promotional emails or WhatsApp updates where you have opted in. You can unsubscribe at any time. We never publish student names, testimonials, or exam scores publicly without explicit written consent.
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>10</span>
                Who receives information
              </h2>
              <p>
                Access to student data is restricted strictly to authorized Academy instructors, admissions coordinators, technical hosting infrastructure, and payment service providers. We do not sell personal data to advertisers.
              </p>
            </section>

            {/* Section 11 */}
            <section id="section-11" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>11</span>
                International processing
              </h2>
              <p>
                Because Ahsora Meds Academy operates internationally across Italy, Pakistan, and Europe, data may be processed by authorized personnel across these jurisdictions with appropriate security measures, confidentiality agreements, and data transfer safeguards.
              </p>
            </section>

            {/* Section 12 */}
            <section id="section-12" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>12</span>
                How long we keep information
              </h2>
              <p>
                We retain student records only for as long as necessary to administer active course access, maintain historical test results for student review, and comply with standard financial record-keeping obligations.
              </p>
            </section>

            {/* Section 13 */}
            <section id="section-13" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>13</span>
                Your choices and rights
              </h2>
              <p>
                Depending on applicable jurisdiction (including under GDPR), students have the right to request access to their personal data, correct inaccurate details, request deletion, restrict processing, or receive a portable copy of test attempts.
              </p>
              <p>
                To exercise any of these rights, email <strong>admissions@ahsorameds.com</strong> with “Privacy Request”.
              </p>
            </section>

            {/* Section 14 */}
            <section id="section-14" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>14</span>
                Students under 18
              </h2>
              <p>
                Students under 18 may enroll through our parent/guardian checkout process. We collect only data strictly necessary for learning and academic mentorship, respecting children's privacy standards.
              </p>
            </section>

            {/* Section 15 */}
            <section id="section-15" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>15</span>
                Protecting information
              </h2>
              <p>
                We employ standard organizational and technical safeguards, including HTTPS encryption, secure database access tokens, and access isolation between staff roles. Never share your password or payment codes with anyone.
              </p>
            </section>

            {/* Section 16 & 17 */}
            <section id="section-16" style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>16</span>
                External websites and services
              </h2>
              <p>
                Our portal may link to external university portals or official testing authorities (e.g. Universitaly, MUR). Third-party sites are governed by their respective privacy statements.
              </p>
            </section>

            <section id="section-17">
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>17</span>
                Changes to this policy
              </h2>
              <p>
                We may periodically update this policy to reflect operational or regulatory improvements. Material updates will be announced on our website and portal with a revised effective date.
              </p>
            </section>

          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '22px', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Quick Jump
              </h3>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
                {[
                  { id: 'section-1', title: '1. Who we are' },
                  { id: 'section-3', title: '3. Data collected' },
                  { id: 'section-5', title: '5. Purpose & use' },
                  { id: 'section-7', title: '7. Live recordings' },
                  { id: 'section-8', title: '8. Cookies' },
                  { id: 'section-11', title: '11. International data' },
                  { id: 'section-13', title: '13. Your choices & rights' },
                  { id: 'section-14', title: '14. Under 18 policy' },
                  { id: 'section-15', title: '15. Security' },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    style={{ color: '#475569', textDecoration: 'none', padding: '4px 6px', borderRadius: '6px' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#15803D')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            <div style={{ backgroundColor: '#F0FDF4', padding: '20px', borderRadius: '14px', border: '1px solid #BBF7D0' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>Your Data Rights</h4>
              <p style={{ fontSize: '0.8125rem', color: '#15803D', lineHeight: 1.5, marginBottom: '14px' }}>
                Have questions or wish to request data correction or deletion?
              </p>
              <a
                href="mailto:admissions@ahsorameds.com?subject=Privacy%20Request"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, color: '#166534', textDecoration: 'none' }}
              >
                <Mail size={14} /> admissions@ahsorameds.com
              </a>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <Link
                href="/terms"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 700, color: '#059669', textDecoration: 'none' }}
              >
                <FileText size={16} /> Terms of Use & Course Purchase &rarr;
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
