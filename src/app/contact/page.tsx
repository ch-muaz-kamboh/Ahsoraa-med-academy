'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import SocialLinks from '@/components/common/SocialLinks';
import { useAppStore } from '@/lib/store';
import { ContactInquiry } from '@/types';

export default function ContactPage() {
  const { addLead } = useAppStore();
  const [leadOpen, setLeadOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [referenceId, setReferenceId] = useState('');

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    setFormStatus('submitting');
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Prospective Student';
    const inqId = `inq-${Date.now()}`;
    const refCode = `INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInquiry: ContactInquiry = {
      id: inqId,
      name: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      topic,
      message: message.trim(),
      source: 'Contact Page Form',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Local Storage for offline resilience and cross-tab sync
    try {
      const existing: ContactInquiry[] = JSON.parse(
        localStorage.getItem('ahsora_contact_inquiries') || '[]'
      );
      existing.unshift(newInquiry);
      localStorage.setItem('ahsora_contact_inquiries', JSON.stringify(existing));
    } catch (err) {
      console.warn('Local storage inquiry write warning:', err);
    }

    // 2. Add as CRM lead in store
    try {
      addLead({
        name: fullName,
        email: email.trim(),
        phone: phone.trim() || 'Not provided',
        country: 'Global / Online',
        city: '',
        academicBackground: 'Contact Form Inquiry',
        targetExam: topic.includes('IMAT') ? 'IMAT 2027' : topic,
        targetCountry: 'Italy',
        budgetRange: 'Standard',
        source: 'Contact Page Form',
        priority: 'warm',
        stage: 'new',
        notes: `[Topic: ${topic}] ${message.trim()}`,
      });
    } catch (err) {
      console.warn('Store lead capture notice:', err);
    }

    // 3. Sync to Supabase leads table
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.from('leads').insert([
        {
          name: fullName,
          email: email.trim(),
          phone: phone.trim() || null,
          target_exam: topic,
          target_country: 'Italy',
          academic_background: 'Contact Page Inquiry',
          status: 'new',
          notes: `[${refCode} | ${topic}] ${message.trim()}`,
        },
      ]);
    } catch (err) {
      console.warn('Supabase contact form sync notice:', err);
    }

    // 4. Dispatch browser custom event for instant Admin Portal sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ahsora_contact_updated', { detail: newInquiry }));
      window.dispatchEvent(new CustomEvent('ahsora_leads_updated', { detail: newInquiry }));
      window.dispatchEvent(new Event('storage'));
    }

    setReferenceId(refCode);
    setFormStatus('success');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      
      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0F172A 100%)', color: '#FFFFFF', padding: '116px 0 60px', borderBottom: '1px solid #1E293B' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5CED73', textTransform: 'uppercase', letterSpacing: '1.5px', backgroundColor: 'rgba(92,237,115,0.15)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(92,237,115,0.3)' }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#FFFFFF', marginTop: '16px', marginBottom: '20px', letterSpacing: '-1px', lineHeight: 1.15 }}>
            Contact Ahsora Meds
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.1rem', lineHeight: 1.7 }}>
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
                    <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '8px' }}>Mon-Fri from 9am to 6pm (CET).</p>
                    <a href="tel:+393333444479" style={{ color: '#D97706', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}>+39 333 3444 479</a>
                  </div>
                </div>

                {/* Office */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={24} color="#059669" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Our Offices</h3>
                    <p style={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                      <strong>Italy:</strong> Via Roma, 98124 Messina, Italy<br />
                      <strong>Pakistan:</strong> S19 Panoramic Complex, Mall Road, Lahore, Pakistan
                    </p>
                  </div>
                </div>

                {/* Social Media Channels */}
                <div style={{ marginTop: '8px', paddingTop: '24px', borderTop: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Follow Our Official Channels
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '14px' }}>
                    Get daily IMAT question walkthroughs, Italian admission news, and updates:
                  </p>
                  <SocialLinks variant="emerald" showLabels />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', padding: '40px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Send us a message</h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '24px' }}>We typically respond within 24 hours.</p>

              {formStatus === 'success' ? (
                <div style={{ backgroundColor: '#F0FFF4', border: '1px solid #BBF7D0', borderRadius: '16px', padding: '32px 24px', textAlign: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 16px rgba(34, 197, 94, 0.25)' }}>
                    <CheckCircle size={30} color="#FFF" />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                    Reference: {referenceId || 'RECEIVED'}
                  </span>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534', marginTop: '10px', marginBottom: '8px' }}>Inquiry Logged &amp; Synchronized!</h4>
                  <p style={{ color: '#14532D', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 20px' }}>
                    Your message has been safely received by our admissions team and registered in our central portal. An advisor will review your query and reply within 24 hours.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a
                      href={`https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20just%20submitted%20inquiry%20${referenceId || ''}%20on%20your%20website`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ padding: '10px 20px', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Phone size={15} />
                      WhatsApp Instant Follow-up
                    </a>
                    <button
                      onClick={() => setFormStatus('idle')}
                      style={{
                        padding: '10px 18px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>First Name</label>
                      <input
                        required
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem' }}
                        placeholder="John"
                      />
                    </div>
                    <div style={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Last Name</label>
                      <input
                        required
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem' }}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 calc(50% - 8px)', minWidth: '180px' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email Address</label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem' }}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div style={{ flex: '1 1 calc(50% - 8px)', minWidth: '180px' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Phone / WhatsApp <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>(with country code)</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem' }}
                        placeholder="+39 333 123 4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Inquiry Topic</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem', backgroundColor: '#FFF', color: '#0F172A' }}
                    >
                      <option>General Inquiry</option>
                      <option>IMAT Preparation & Courses</option>
                      <option>Admissions & Mentorship</option>
                      <option>Italian Medical University Placement</option>
                      <option>Scholarships & Financial Aid</option>
                      <option>Visa & Declaration of Value (DoV)</option>
                      <option>Billing & Payment Options</option>
                      <option>Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Message</label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9375rem', resize: 'vertical' }}
                      placeholder="Write your questions or background here..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {formStatus === 'submitting' ? 'Submitting & Syncing...' : (
                      <>
                        <Send size={18} />
                        Send Message &amp; Sync with Admissions
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
          <a
            href="https://wa.me/393333444479?text=Hi%20Ahsora,%20I%20would%20like%20to%20book%20free%20counselling"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '14px 36px', fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Book Free Counselling
          </a>
        </div>
      </section>

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} />
    </div>
  );
}
