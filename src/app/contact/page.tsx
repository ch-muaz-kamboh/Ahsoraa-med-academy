'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

export default function ContactPage() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      
      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #F0FFF4 0%, #FFFFFF 60%)', padding: '80px 0 60px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#0F172A', marginTop: '12px', marginBottom: '20px', letterSpacing: '-1px', lineHeight: 1.15 }}>
            Contact Ahsora Meds
          </h1>
          <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Have questions about IMAT preparation, university admissions, or our courses? Our team of educational advisors and doctors is here to help.
          </p>
        </div>
      </section>

      {/* ── CONTACT INFO & FORM ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'flex-start' }}>
            
            {/* Contact Information */}
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>How can we help?</h2>
              <p style={{ color: '#64748B', lineHeight: 1.7, marginBottom: '40px' }}>
                Whether you need advice on which package fits your study style or want detailed information about the Italian medical university application process, reach out to us through any of these channels.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Email */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={24} color="#22C55E" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Email Us</h3>
                    <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '8px' }}>For general inquiries and support.</p>
                    <a href="mailto:admissions@ahsorameds.com" style={{ color: '#16A34A', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}>admissions@ahsorameds.com</a>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={24} color="#D97706" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Call Us</h3>
                    <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '8px' }}>Mon-Fri from 9am to 6pm (GMT).</p>
                    <a href="tel:+18004927637" style={{ color: '#D97706', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}>+1 (800) 492-7637</a>
                  </div>
                </div>

                {/* Office */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={24} color="#2563EB" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Global Offices</h3>
                    <p style={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                      Our mentors and advisors operate out of London, Milan, and Chicago to support students across all timezones.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Form */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', padding: '40px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Send us a message</h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '24px' }}>We typically respond within 24 hours.</p>

              {formStatus === 'success' ? (
                <div style={{ backgroundColor: '#F0FFF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Send size={24} color="#FFF" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>Message Sent Successfully!</h4>
                  <p style={{ color: '#14532D', fontSize: '0.9375rem' }}>Thank you for reaching out. An advisor will get back to you shortly.</p>
                  <button onClick={() => setFormStatus('idle')} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#16A34A', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>First Name</label>
                      <input required type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem' }} placeholder="John" />
                    </div>
                    <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Last Name</label>
                      <input required type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem' }} placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email Address</label>
                    <input required type="email" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem' }} placeholder="john@example.com" />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Topic</label>
                    <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem', backgroundColor: '#FFF', color: '#0F172A' }}>
                      <option>General Inquiry</option>
                      <option>Course Information</option>
                      <option>Mentorship & Guidance</option>
                      <option>Technical Support</option>
                      <option>Billing & Payments</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Message</label>
                    <textarea required rows={5} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem', resize: 'vertical' }} placeholder="How can we help you?"></textarea>
                  </div>

                  <button type="submit" disabled={formStatus === 'submitting'} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {formStatus === 'submitting' ? 'Sending...' : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </section>

      {/* ── FAST TRACK CTA ── */}
      <section style={{ padding: '60px 0', backgroundColor: '#0F172A', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <MessageSquare size={36} color="#22C55E" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>Need immediate advice?</h2>
          <p style={{ color: '#94A3B8', marginBottom: '32px', lineHeight: 1.7 }}>
            Skip the form and talk directly with one of our expert counsellors. We'll assess your profile and recommend the best pathway for your medical career.
          </p>
          <button onClick={() => setLeadOpen(true)} className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            Book Free Counselling
          </button>
        </div>
      </section>

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} />
    </div>
  );
}
