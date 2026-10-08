'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  RotateCcw,
  Scale,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export default function TermsAndConditionsPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'refund'>('terms');

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Top Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '60px 20px',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600, color: '#93C5FD', marginBottom: '20px' }}>
            <Scale size={16} />
            LEGAL AGREEMENT & ACADEMY POLICIES
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.2 }}>
            Terms of Use & Course Purchase Terms
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
            These terms govern your purchase and use of Ahsora Meds Academy courses, portal tools, and academic preparation services. Please review our policies, rights, and responsibilities.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '28px', fontSize: '0.875rem', color: '#CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#60A5FA" />
              <span><strong>Effective Date:</strong> 1 May 2026</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} color="#60A5FA" />
              <span><strong>Version:</strong> 0.8 (Customer Release)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#34D399" />
              <span><strong>Governing Law:</strong> International & Pakistan Consumer Rules</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ maxWidth: '1100px', margin: '32px auto 0', padding: '0 20px' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('terms')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9375rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backgroundColor: activeTab === 'terms' ? '#2563EB' : '#FFFFFF',
              color: activeTab === 'terms' ? '#FFFFFF' : '#475569',
              boxShadow: activeTab === 'terms' ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
            }}
          >
            <FileText size={18} />
            Section A: Terms of Use & Course Purchase
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9375rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backgroundColor: activeTab === 'refund' ? '#2563EB' : '#FFFFFF',
              color: activeTab === 'refund' ? '#FFFFFF' : '#475569',
              boxShadow: activeTab === 'refund' ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
            }}
          >
            <RotateCcw size={18} />
            Section B: Cancellation & Refund Policy
          </button>

          <Link
            href="/privacy"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.9375rem',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              textDecoration: 'none',
              marginLeft: 'auto',
              border: '1px solid #E2E8F0',
            }}
          >
            <ShieldCheck size={18} color="#2563EB" />
            View Privacy Policy &rarr;
          </Link>
        </div>

        {/* Tab 1: Section A - Terms of Use and Course Purchase Terms */}
        {activeTab === 'terms' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '36px', alignItems: 'start' }}>
            
            {/* Article Content */}
            <article style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', color: '#334155', lineHeight: 1.75, fontSize: '0.96rem' }}>
              
              <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '16px 20px', marginBottom: '32px', color: '#1E40AF', fontSize: '0.9rem' }}>
                <strong>Important Notice:</strong> These Terms and Conditions remain in effect until superseded by an updated version, subject to the notice and change provisions in section 19. This stated date does not retrospectively impose new terms on purchases made before those terms were presented and accepted.
              </div>

              {/* 1. Who We Are */}
              <section id="section-1" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>1</span>
                  Who we are
                </h2>
                <p>
                  <strong>Ahsorameds.com</strong> is operated by <strong>Ahsora Meds Academy</strong> (“Academy”, “we”, “us”). Our teaching staff, admissions team, management team, and IT team reside and work across multiple countries, including Italy and Pakistan. We provide our medical entrance courses and related services to students internationally.
                </p>
                <p>
                  For orders, access assistance, complaints, and cancellation requests, contact:
                </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px 18px', marginTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>OFFICIAL EMAIL</span>
                    <a href="mailto:admissions@ahsorameds.com" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>admissions@ahsorameds.com</a>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>WHATSAPP ADMISSIONS DESK</span>
                    <a href="https://wa.me/393333444479" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>+39 333 344 4479</a>
                  </div>
                </div>
                <p style={{ marginTop: '14px', fontSize: '0.875rem', color: '#64748B' }}>
                  These terms govern use of our website and student services and purchases accepted by the Academy. They do not replace employment, contractor or confidentiality agreements for staff.
                </p>
              </section>

              {/* 2. Your Agreement */}
              <section id="section-2" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>2</span>
                  Your agreement and purchased package
                </h2>
                <p>
                  The purchaser is the person entering into and paying for the contract. The student is the named individual authorised to use the purchased course. Where these are different people, the purchaser must ensure that the student receives and understands the relevant access and conduct rules.
                </p>
                <p>
                  Before payment, we provide the course description, included features, total price, applicable access dates or duration, delivery arrangements, and cancellation information. Your contract comprises that information, your order confirmation, these terms, and any expressly agreed package-specific or instalment terms. Mandatory law prevails. A specific written commitment made as part of your purchase prevails over conflicting general wording in these terms.
                </p>
                <p>
                  An order is accepted when we send an order confirmation expressly accepting it. A payment receipt alone is not acceptance unless it says otherwise. If we decline an order, we return the amount collected for that order. We do not change the agreed price after acceptance without your agreement.
                </p>
                <p>
                  <strong>Authorised sales and corrections:</strong> Payments must be made through checkout or payment instructions issued by an authorised Academy representative. Customers should verify unexpected changes of payment details using our published contact channels. We may reject an order before acceptance for objectively reasonable reasons such as unavailable capacity, failed payment verification or suspected fraud.
                </p>
              </section>

              {/* 3. Eligibility */}
              <section id="section-3" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>3</span>
                  Eligibility and students under 18
                </h2>
                <p>
                  Students under 18 may enrol through a parent or legal guardian who is legally capable of contracting, accepts the purchase terms as purchaser, and authorises the student’s participation. Where the applicable age of contractual capacity is higher, the same requirement applies until that age is reached.
                </p>
                <p>
                  A parent or guardian may assist with administration and supervise the child’s use, but this does not entitle another person to take the course or assessments using the student’s identity. Reasonable assistance and agreed accessibility arrangements are permitted.
                </p>
              </section>

              {/* 4. Course Content & Scope */}
              <section id="section-4" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>4</span>
                  Course content and scope
                </h2>
                <p>
                  Our courses may include live teaching, recorded lessons, teacher support, question banks, mock examinations, progress analytics, and digital learning resources. Only the features expressly included in the package purchased form part of that purchase.
                </p>
                <p>
                  Question counts, mock-test numbers, teaching hours, and portal periods are those stated for your package when purchased (e.g., <strong>Ahsora IMAT Ascend</strong> €299, <strong>Ahsora IMAT Mastery</strong> €499, or <strong>Ahsora Path Elite</strong> €799). General descriptions of our wider services do not include every service in every course.
                </p>
                <p>
                  Free public mock examinations and freely accessible materials are separate from paid courses. A free mock is not a trial purchase or a promise of access to all paid features.
                </p>
              </section>

              {/* 5. Prices, Payments and Instalments */}
              <section id="section-5" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>5</span>
                  Prices, payments and instalments
                </h2>
                <p>
                  Courses are normally purchased through a one-time payment. An instalment arrangement applies only if we expressly agree it in writing. Its schedule must identify the total price, amounts, due dates, and consequences of missed payments before acceptance.
                </p>
                <p>
                  The checkout identifies the billing currency, total payable price, and applicable taxes or charges collected by us. Any external currency-conversion or bank fees are governed by the customer’s payment provider. We do not add undisclosed mandatory Academy fees after payment.
                </p>
                <p>
                  There is no automatic renewal unless a separately disclosed renewal arrangement is expressly accepted. A new course or extension requires a separate purchase.
                </p>
              </section>

              {/* 6. Activation, access periods and downloads */}
              <section id="section-6" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>6</span>
                  Activation, access periods and downloads
                </h2>
                <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#92400E', fontSize: '0.875rem' }}>
                  <strong>Activation Timeframe:</strong> Access is normally activated within <strong>3–4 working days</strong> after cleared payment and receipt of any information reasonably required for enrolment (Monday–Friday).
                </div>
                <p>
                  The duration or fixed expiry date for each course is stated before purchase and confirmed with the order. Unless the purchased package expressly provides otherwise, missed study time, voluntary non-use, and missed classes do not extend access or create a right to transfer, defer, or freeze a course.
                </p>
                <p>
                  Some resources may be downloaded using the download function we provide; others are available only within the portal. Download permission does not permit sharing or resale.
                </p>
              </section>

              {/* 7. Live Teaching */}
              <section id="section-7" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>7</span>
                  Live teaching and student responsibilities
                </h2>
                <p>
                  Where included (such as in the <strong>Mastery</strong> and <strong>Path Elite</strong> tracks), live teaching is delivered through Microsoft Teams or another designated platform. Students must maintain a suitable device and internet connection.
                </p>
                <p>
                  A student’s absence does not automatically entitle them to a replacement individual class or refund. Recordings are included where expressly stated for your package. Students must not record sessions or distribute class links without prior written authorization.
                </p>
              </section>

              {/* 8. Intellectual Property */}
              <section id="section-8" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>8</span>
                  Intellectual property and permitted use
                </h2>
                <p>
                  All Academy-created books, notes, original questions, explanations, recordings, and branding belong exclusively to the Academy or its licensors. Purchase grants the named student a personal, limited, non-transferable licence for individual study.
                </p>
                <p>
                  You must not share, resell, publish, scrape, or redistribute protected materials, lend or sell an account, or train commercial AI models on Academy materials.
                </p>
              </section>

              {/* 9. Account Security */}
              <section id="section-9" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>9</span>
                  Account security and prohibited conduct
                </h2>
                <p>
                  Each student account is for the sole use of its registered student. Keep credentials confidential. Impersonation, credential sharing, assessment interference, malicious script introduction, or disruption of classes is strictly prohibited.
                </p>
              </section>

              {/* 10. Educational Outcomes / Admissions Disclaimer */}
              <section id="section-10" style={{ marginBottom: '36px' }}>
                <div style={{ backgroundColor: '#F1F5F9', borderLeft: '4px solid #2563EB', padding: '16px 20px', borderRadius: '0 10px 10px 0', marginBottom: '16px' }}>
                  <h2 id="admissions-disclaimer" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>10</span>
                    Educational outcomes and independent authorities (Admissions Disclaimer)
                  </h2>
                </div>
                <p>
                  We provide rigorous test preparation and academic mentorship with reasonable care and skill. <strong>We do not guarantee examination scores, admission to specific universities, scholarships, visas, or immigration status.</strong>
                </p>
                <p>
                  Admission decisions remain solely with official universities and testing bodies (such as MUR, CINECA, and individual Italian/European universities). Practice mock test scores are educational diagnostics and not guaranteed score forecasts.
                </p>
              </section>

              {/* 11. Consultancy and Third-Party Expenses */}
              <section id="section-11" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>11</span>
                  Consultancy and third-party expenses
                </h2>
                <p>
                  Course fees do not cover third-party external registration fees (e.g. IMAT registration fees, Universitaly portal fees, embassy visa fees, courier charges, or document translations) unless explicitly detailed in an Elite agreement.
                </p>
              </section>

              {/* 12. Suspension and Termination */}
              <section id="section-12" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>12</span>
                  Suspension and termination
                </h2>
                <p>
                  We may restrict or terminate access for substantiated serious misconduct, credential reselling, piracy, or repeated material breaches. A fair opportunity to explain suspected irregular activity is provided wherever reasonable.
                </p>
              </section>

              {/* 13. Cancellation and Refunds Summary */}
              <section id="section-13" style={{ marginBottom: '36px' }}>
                <h2 id="cancellation" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>13</span>
                  Cancellation and refunds
                </h2>
                <p>
                  We do not offer a general discretionary refund or paid-course trial period after an accepted purchase. Statutory cooling-off rights and remedies for defective delivery remain fully respected. See Section B below for our complete Cancellation and Refund Policy.
                </p>
              </section>

              {/* 14. Availability */}
              <section id="section-14" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>14</span>
                  Availability and service changes
                </h2>
                <p>
                  We take reasonable steps to ensure uninterrupted online portal access. Scheduled maintenance will be communicated in advance when practicable.
                </p>
              </section>

              {/* 15. Responsibility and limits */}
              <section id="section-15" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>15</span>
                  Responsibility and limits
                </h2>
                <p>
                  Nothing in these terms limits liability for death or injury caused by negligence, fraud, or rights that cannot be lawfully excluded under applicable consumer law.
                </p>
              </section>

              {/* 16. Complaints and Payment Disputes */}
              <section id="section-16" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>16</span>
                  Complaints and payment disputes
                </h2>
                <p>
                  If you encounter any problem, please write to <strong>admissions@ahsorameds.com</strong> with your order reference. We aim to acknowledge complaints within 48 hours and investigate promptly.
                </p>
              </section>

              {/* 17. Privacy and External Services */}
              <section id="section-17" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>17</span>
                  Privacy and external services
                </h2>
                <p>
                  Our data handling is governed by our dedicated <Link href="/privacy" style={{ color: '#2563EB', fontWeight: 600 }}>Privacy Policy</Link>. Accepting these purchase terms does not imply blanket consent to marketing or unauthorized data usage.
                </p>
              </section>

              {/* 18. Governing Law */}
              <section id="section-18" style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>18</span>
                  International customers, governing law and courts
                </h2>
                <p>
                  Subject to mandatory rules that cannot be excluded under relevant international consumer conflict-of-law provisions, this agreement is governed by the laws of Pakistan. Consumers retain their non-excludable statutory rights in their country of residence.
                </p>
              </section>

              {/* 19. Amendments */}
              <section id="section-19">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>19</span>
                  Amendments and other provisions
                </h2>
                <p>
                  We may revise terms for future orders with prior notice where required. Existing orders retain their agreed entitlements for their paid term.
                </p>
              </section>

            </article>

            {/* Sticky Sidebar Navigation */}
            <aside style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '22px', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Table of Contents
                </h3>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
                  {[
                    { id: 'section-1', title: '1. Who we are' },
                    { id: 'section-2', title: '2. Your agreement' },
                    { id: 'section-3', title: '3. Eligibility (<18)' },
                    { id: 'section-4', title: '4. Course content' },
                    { id: 'section-5', title: '5. Prices & payments' },
                    { id: 'section-6', title: '6. Activation (3-4d)' },
                    { id: 'section-7', title: '7. Live teaching' },
                    { id: 'section-8', title: '8. Intellectual property' },
                    { id: 'section-9', title: '9. Account security' },
                    { id: 'section-10', title: '10. Admissions Disclaimer' },
                    { id: 'section-11', title: '11. Consultancy costs' },
                    { id: 'section-12', title: '12. Suspension' },
                    { id: 'section-13', title: '13. Refunds' },
                    { id: 'section-16', title: '16. Complaints' },
                    { id: 'section-18', title: '18. Governing law' },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      style={{ color: '#475569', textDecoration: 'none', padding: '4px 6px', borderRadius: '6px', transition: 'all 0.15s ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#2563EB')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Help Card */}
              <div style={{ backgroundColor: '#EFF6FF', padding: '20px', borderRadius: '14px', border: '1px solid #BFDBFE' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>Questions on our terms?</h4>
                <p style={{ fontSize: '0.8125rem', color: '#3B82F6', lineHeight: 1.5, marginBottom: '14px' }}>
                  Reach our admissions and legal support desk directly via email or WhatsApp.
                </p>
                <a
                  href="mailto:admissions@ahsorameds.com"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, color: '#1D4ED8', textDecoration: 'none', marginBottom: '8px' }}
                >
                  <Mail size={14} /> admissions@ahsorameds.com
                </a>
                <a
                  href="https://wa.me/393333444479"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, color: '#059669', textDecoration: 'none' }}
                >
                  <Phone size={14} /> +39 333 344 4479
                </a>
              </div>
            </aside>

          </div>
        )}

        {/* Tab 2: Section B - Cancellation & Refund Policy */}
        {activeTab === 'refund' && (
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <article style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', color: '#334155', lineHeight: 1.8, fontSize: '0.96rem' }}>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '20px' }}>
                <RotateCcw size={16} />
                CUSTOMER-FACING CANCELLATION & REFUND POLICY
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                Cancellation and Refund Policy
              </h2>

              <p>
                We do not offer a paid-course trial or general discretionary refunds after an accepted purchase. Please review the course inclusions, access dates, technical requirements, teaching arrangements, and price before paying.
              </p>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', margin: '24px 0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                  What is not covered by refunds:
                </h3>
                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#475569' }}>
                  <li>Change of mind after course activation</li>
                  <li>Failure to attend live sessions or non-use of portal features</li>
                  <li>Personal scheduling conflicts or timetable changes on the student’s side</li>
                  <li>Dissatisfaction with an official exam score or IMAT test outcome</li>
                  <li>Rejection of a university admission application, scholarship, or visa by official authorities</li>
                </ul>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '28px', marginBottom: '12px' }}>
                Statutory Cooling-Off & Defective Services
              </h3>
              <p>
                This policy does not remove mandatory cancellation or withdrawal rights, rights arising from non-delivery or defective services, correction of duplicate charges, or any specific guarantee expressly made as part of your purchase. Where applicable consumer protection laws (such as EU consumer distance selling rules) grant statutory withdrawal periods, those rights are fully respected.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '28px', marginBottom: '12px' }}>
                How to Request Cancellation or Report a Problem
              </h3>
              <p>
                To request cancellation or report a payment or delivery issue, please contact us with your full name, order identifier, and date of purchase:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', margin: '20px 0' }}>
                <div style={{ border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontWeight: 700, color: '#1E40AF', marginBottom: '4px' }}>Email Support</div>
                  <a href="mailto:admissions@ahsorameds.com" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
                    admissions@ahsorameds.com
                  </a>
                </div>
                <div style={{ border: '1px solid #A7F3D0', backgroundColor: '#ECFDF5', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontWeight: 700, color: '#065F46', marginBottom: '4px' }}>WhatsApp Desk</div>
                  <a href="https://wa.me/393333444479" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
                    +39 333 344 4479
                  </a>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
                Approved or legally required monetary refunds are processed without undue delay using the original payment method unless another lawful method is agreed. We do not charge an arbitrary cancellation fee that unlawfully reduces statutory refunds.
              </p>

            </article>
          </div>
        )}

      </div>
    </div>
  );
}
