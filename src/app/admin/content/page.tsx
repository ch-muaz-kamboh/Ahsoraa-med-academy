'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Save, FileSignature, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminContentPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [content, setContent] = useState({
    hero_headline_1: 'THE IMAT IS THE TEST.',
    hero_headline_2: 'YOUR JOURNEY IS MUCH BIGGER.',
    hero_subtitle: 'Master the IMAT and secure your spot in a top Italian medical university with our comprehensive preparation platform.',
    hero_btn_primary: 'EXPLORE PROGRAMMES',
    hero_btn_secondary: 'TAKE A FREE IMAT MOCK',
    cta_heading: 'Ready to Start Your Medical Journey?',
    cta_subheading: 'Join students worldwide who have successfully entered Italian medical schools with Ahsora.',
  });

  const fetchContent = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && data) {
      setContent({
        hero_headline_1: data.hero_headline_1 || '',
        hero_headline_2: data.hero_headline_2 || '',
        hero_subtitle: data.hero_subtitle || '',
        hero_btn_primary: data.hero_btn_primary || '',
        hero_btn_secondary: data.hero_btn_secondary || '',
        cta_heading: data.cta_heading || '',
        cta_subheading: data.cta_subheading || '',
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const supabase = createClient();
    const { error } = await supabase
      .from('site_content')
      .update({
        hero_headline_1: content.hero_headline_1,
        hero_headline_2: content.hero_headline_2,
        hero_subtitle: content.hero_subtitle,
        hero_btn_primary: content.hero_btn_primary,
        hero_btn_secondary: content.hero_btn_secondary,
        cta_heading: content.cta_heading,
        cta_subheading: content.cta_subheading,
      })
      .eq('id', 1);

    setSaving(false);
    if (error) {
      setErrorMsg('Failed to save: ' + error.message);
    } else {
      setSuccessMsg('✅ Website content updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: '#64748B' }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading current content...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileSignature size={28} color="#059669" /> Website Content
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Update the text that appears on the public landing page. Changes save directly to the database.
        </p>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#F0FFF4', border: '1px solid #16A34A', color: '#15803D', padding: '12px 16px', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '24px', fontWeight: 600 }}>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #EF4444', color: '#DC2626', padding: '12px 16px', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '24px', fontWeight: 600 }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Hero Section */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
            Hero Section
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Headline Line 1 (Black Text)
                </label>
                <input type="text" name="hero_headline_1" value={content.hero_headline_1} onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Headline Line 2 (Green Text)
                </label>
                <input type="text" name="hero_headline_2" value={content.hero_headline_2} onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Hero Subtitle</label>
              <textarea name="hero_subtitle" value={content.hero_subtitle} onChange={handleChange} rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Primary Button Text</label>
                <input type="text" name="hero_btn_primary" value={content.hero_btn_primary} onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Secondary Button Text</label>
                <input type="text" name="hero_btn_secondary" value={content.hero_btn_secondary} onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none' }} />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
            Final Call to Action
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>CTA Heading</label>
              <input type="text" name="cta_heading" value={content.cta_heading} onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>CTA Subheading</label>
              <textarea name="cta_subheading" value={content.cta_subheading} onChange={handleChange} rows={2}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', outline: 'none', resize: 'vertical' }} />
            </div>
          </div>
        </div>

        <div>
          <button type="submit" disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#059669', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '0.9375rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
