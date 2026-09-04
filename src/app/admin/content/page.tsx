'use client';

import React, { useState } from 'react';
import { Save, AlertCircle, FileSignature } from 'lucide-react';

export default function AdminContentPage() {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Local state for the CMS form fields. 
  // In a real app, these would be fetched from Supabase on mount.
  const [content, setContent] = useState({
    heroHeadlinePart1: 'THE IMAT IS THE TEST.',
    heroHeadlinePart2: 'YOUR JOURNEY IS MUCH BIGGER.',
    heroSubtitle: 'Master the IMAT and secure your spot in a top Italian medical university with our comprehensive preparation platform.',
    heroPrimaryBtn: 'EXPLORE PROGRAMMES',
    heroSecondaryBtn: 'TAKE A FREE IMAT MOCK',
    finalCtaHeading: 'Ready to Start Your Medical Journey?',
    finalCtaSubheading: 'Join students worldwide who have successfully entered Italian medical schools with Ahsora.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Website content successfully updated! (Mock mode)');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 800);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileSignature size={28} color="#059669" /> Website Content
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Update the text that appears on the public landing page. Changes are saved immediately.
        </p>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#F0FFF4', border: '1px solid #16A34A', color: '#15803D', padding: '12px 16px', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '24px', fontWeight: 600 }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Hero Section Content */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
            Hero Section
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Headline (Part 1 - Black Text)
                </label>
                <input
                  type="text"
                  name="heroHeadlinePart1"
                  value={content.heroHeadlinePart1}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Headline (Part 2 - Green Text)
                </label>
                <input
                  type="text"
                  name="heroHeadlinePart2"
                  value={content.heroHeadlinePart2}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                Hero Subtitle
              </label>
              <textarea
                name="heroSubtitle"
                value={content.heroSubtitle}
                onChange={handleChange}
                rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Primary Button Text
                </label>
                <input
                  type="text"
                  name="heroPrimaryBtn"
                  value={content.heroPrimaryBtn}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  name="heroSecondaryBtn"
                  value={content.heroSecondaryBtn}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
            Final Call to Action (Bottom of Page)
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                CTA Heading
              </label>
              <input
                type="text"
                name="finalCtaHeading"
                value={content.finalCtaHeading}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                CTA Subheading
              </label>
              <textarea
                name="finalCtaSubheading"
                value={content.finalCtaSubheading}
                onChange={handleChange}
                rows={2}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none', resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* Note */}
        <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <AlertCircle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ color: '#B45309', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
            <strong>Note:</strong> Currently in mock mode. Connecting these values to the actual <code>page.tsx</code> frontend will require linking this to the Supabase database table in a future phase.
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#059669',
              color: '#FFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Save size={18} />
            {saving ? 'Saving Changes...' : 'Save Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
