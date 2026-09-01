'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  GraduationCap,
  Award,
  BookOpen,
  Globe2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Building,
  HelpCircle,
  FileCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { mockCourses, mockUniversities, mockScholarships } from '@/lib/mock-data';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

export default function HomePage() {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState('USMLE Step 1');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Ahsora Meds Academy prepare students for European medical entrance exams (IMAT)?',
      a: 'Our IMAT curriculum covers all 4 tested sections (Biology, Chemistry, Physics & Mathematics, and Critical Reasoning/Reading). We provide 60+ hours of video lectures, 2,000+ past question decompositions, and 12 full-length simulated CBT mock tests matching the exact Italian Ministry scoring algorithm.',
    },
    {
      q: 'Can non-EU international students apply for English-taught medical programs in Italy?',
      a: 'Yes. Public Italian universities reserve dedicated quota seats for Non-EU students. With our admissions guidance, we assist you through Universitaly pre-enrolment, Declaration of Value (DOV)/CIMEA legalization, Italian DSU regional scholarships (up to €7,200/yr stipend), and embassy Type-D student visa applications.',
    },
    {
      q: 'How does the CBT Test & Assessment Engine work?',
      a: 'Our mock test platform replicates real licensing test conditions with synchronized server timers, question palettes, mark-for-review flags, negative marking deductions, and instant multi-dimensional performance breakdowns across subjects, topics, and peer percentiles.',
    },
    {
      q: 'Are the course prices and university fees centralized?',
      a: 'Yes. All pricing is synchronized in real-time from our centralized pricing registry. There are no hidden fees or discrepancies across pages.',
    },
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '70px 0 80px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1000px',
            height: '400px',
            background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.08) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                border: '1px solid #BFDBFE',
                borderRadius: '9999px',
                padding: '6px 16px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                marginBottom: '24px',
                boxShadow: '0 1px 2px rgba(37, 99, 235, 0.1)',
              }}
            >
              <Sparkles size={16} />
              <span>OFFICIAL 2026/2027 ADMISSIONS & EXAM PREP INTAKE</span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-1.5px',
                lineHeight: 1.15,
                marginBottom: '20px',
              }}
            >
              Achieve Your Global Goals with{' '}
              <span style={{ color: '#2563EB' }}>Expert Admissions & Exam Prep</span>
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '36px',
                maxWidth: '720px',
                margin: '0 auto 36px auto',
              }}
            >
              From standardized exam prep and university shortlisting to verified admissions in Italy, the UK, Germany, and Hungary — we guide your entire academic journey.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '48px',
              }}
            >
              <button
                onClick={() => setLeadModalOpen(true)}
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px' }}
              >
                <span>Book Free Counselling</span>
                <ArrowRight size={18} />
              </button>

              <Link
                href="/courses"
                className="btn-secondary"
                style={{ padding: '14px 26px', fontSize: '1rem', borderRadius: '12px' }}
              >
                <span>Explore Medical Courses</span>
              </Link>
            </div>

            {/* Trust Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '16px',
                padding: '24px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB' }}>96.8%</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Licensing Pass Rate</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>$4.2M+</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Student Scholarships Won</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB' }}>1,850+</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Doctors & Students Trained</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>100%</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Verified Fact-Checked Data</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE COMPLETE JOURNEY ARCHITECTURE */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 50px auto' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '1px' }}>
              End-to-End Ecosystem
            </span>
            <h2 style={{ fontSize: '2rem', color: '#0F172A', marginTop: '6px', marginBottom: '12px' }}>
              One Unified System for Your Medical Career
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
              We eliminate chaotic WhatsApp chats and lost spreadsheets. Every step is managed in your secure student portal.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                icon: <BookOpen size={24} color="#2563EB" />,
                step: '01. Preparation',
                title: 'High-Yield Courses & LMS',
                desc: 'Organ-systems video modules, clinical vignettes, and downloadable high-yield summary sheets.',
              },
              {
                icon: <FileCheck size={24} color="#2563EB" />,
                step: '02. Assessment',
                title: 'CBT Exam Simulation Engine',
                desc: 'Timed computer-based tests with exact negative marking, question palettes, and topic weakness analytics.',
              },
              {
                icon: <Building size={24} color="#2563EB" />,
                step: '03. Admissions',
                title: 'University Shortlisting',
                desc: 'Direct applications to top medical faculties in Italy, Hungary, the UK, and Germany with verified deadlines.',
              },
              {
                icon: <GraduationCap size={24} color="#2563EB" />,
                step: '04. Visa & Arrival',
                title: 'Document & Visa Vault',
                desc: 'DOV/CIMEA legalization, financial sponsor declarations, and embassy appointment interview prep.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '10px' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED COURSES & LICENSING PROGRAMS */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                Academic Programs
              </span>
              <h2 style={{ fontSize: '2rem', color: '#0F172A', marginTop: '6px' }}>
                Featured Medical Licensure & Prep Courses
              </h2>
            </div>
            <Link href="/courses" className="btn-secondary">
              <span>View All Courses</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {mockCourses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image */}
                <div
                  style={{
                    height: '180px',
                    backgroundImage: `url(${course.thumbnailUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    {course.badge || course.category}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '14px',
                      right: '14px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {course.durationHours} Hours
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
                    Exam: <strong style={{ color: '#0F172A' }}>{course.targetExam}</strong>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', color: '#0F172A', marginBottom: '10px', lineHeight: 1.4 }}>
                    {course.title}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                    {course.summary}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '16px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A' }}>
                        ${course.price}
                        {course.comparePrice && (
                          <span style={{ fontSize: '0.875rem', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '6px', fontWeight: 400 }}>
                            ${course.comparePrice}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 600 }}>
                        ★ {course.rating} ({course.studentsCount} students)
                      </div>
                    </div>

                    <Link
                      href={`/courses/${course.slug}`}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                    >
                      Enrol Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. UNIVERSITY & SCHOLARSHIP DIRECTORY SPOTLIGHT */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                Global Admissions Intelligence
              </span>
              <h2 style={{ fontSize: '2rem', color: '#0F172A', marginTop: '6px' }}>
                Top Medical Faculties (English Taught)
              </h2>
            </div>
            <Link href="/universities" className="btn-secondary">
              <span>Search All Medical Universities</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {mockUniversities.slice(0, 3).map((uni) => (
              <div
                key={uni.id}
                className="card"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-blue">{uni.country}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    World Rank: #{uni.rankingWorld}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '8px' }}>
                  {uni.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '16px', flex: 1 }}>
                  {uni.overview}
                </p>

                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.8125rem',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748B' }}>Annual Tuition:</span>
                    <strong style={{ color: '#0F172A' }}>
                      {uni.currency === 'EUR' ? '€' : '$'}
                      {uni.tuitionFeeAnnual.toLocaleString()}/yr
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Language:</span>
                    <strong style={{ color: '#10B981' }}>{uni.language}</strong>
                  </div>
                </div>

                <Link
                  href={`/universities/${uni.id}`}
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
                >
                  View Admission Criteria →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CBT ASSESSMENT ENGINE BANNER */}
      <section style={{ padding: '60px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '20px',
              padding: '48px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '12px' }}>
                LIVE EXAM SIMULATOR
              </span>
              <h2 style={{ fontSize: '2.2rem', color: '#1E3A8A', marginBottom: '16px', lineHeight: 1.2 }}>
                Test Yourself on Real USMLE & IMAT Mock Blocks
              </h2>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Experience exact test-taking conditions: synchronized countdown timers, question palettes, mark-for-review flags, negative marking deductions, and instant subject-by-subject accuracy analytics.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link
                  href="/portal/tests/tst-01/take"
                  className="btn-primary"
                  style={{ padding: '12px 24px' }}
                >
                  <FileCheck size={18} />
                  <span>Start Free Diagnostic Mock Block</span>
                </Link>
                <Link
                  href="/mock-tests"
                  className="btn-outline"
                  style={{ padding: '12px 20px' }}
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #DBEAFE',
                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <strong style={{ fontSize: '0.9375rem', color: '#0F172A' }}>Performance Analytics Engine</strong>
                <span className="badge badge-green">98.4% Accuracy</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#64748B' }}>
                    <span>Cardiovascular Pathology</span>
                    <strong style={{ color: '#0F172A' }}>85%</strong>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', backgroundColor: '#2563EB' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#64748B' }}>
                    <span>Renal Acid-Base Physiology</span>
                    <strong style={{ color: '#0F172A' }}>92%</strong>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '92%', height: '100%', backgroundColor: '#10B981' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#64748B' }}>
                    <span>Pharmacology & Autonomics</span>
                    <strong style={{ color: '#0F172A' }}>74%</strong>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '74%', height: '100%', backgroundColor: '#F59E0B' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQS ACCORDION */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
              Common Questions
            </span>
            <h2 style={{ fontSize: '2rem', color: '#0F172A', marginTop: '6px' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: '#0F172A',
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ color: '#2563EB', fontSize: '1.25rem', fontWeight: 700 }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 20px 20px 20px',
                        color: '#64748B',
                        fontSize: '0.9375rem',
                        lineHeight: 1.6,
                        borderTop: '1px solid #F1F5F9',
                        paddingTop: '14px',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM LEAD CTA */}
      <section
        style={{
          backgroundColor: '#1E3A8A',
          color: '#FFFFFF',
          padding: '70px 0',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.4rem', color: '#FFFFFF', marginBottom: '16px' }}>
            Ready to Begin Your Medical Career?
          </h2>
          <p style={{ color: '#BFDBFE', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Speak directly with our senior admissions counsellors and exam mentors. Get a personalized roadmap tailored to your budget and target country.
          </p>
          <button
            onClick={() => setLeadModalOpen(true)}
            className="btn-primary"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#1E3A8A',
              padding: '14px 32px',
              fontSize: '1.0625rem',
              fontWeight: 700,
            }}
          >
            <span>Book Free 1-on-1 Counselling</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        defaultExam={selectedExam}
      />
    </div>
  );
}
