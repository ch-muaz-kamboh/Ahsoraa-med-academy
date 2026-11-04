'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNewsPosts, syncNewsFromSupabase, NewsItem } from '@/lib/cms-store';
import { useAppStore } from '@/lib/store';
import { Calendar, ArrowRight, Tag, Clock, User, Sparkles, BookOpen, X, CheckCircle2, Mail } from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import { NewsletterSubscriber } from '@/types';

export default function NewsContent() {
  const { addLead } = useAppStore();
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [selectedPost, setSelectedPost] = useState<NewsItem | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);

  // Freeze background scroll & handle Esc key when fullscreen article reader is active
  useEffect(() => {
    if (!selectedPost) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPost(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPost]);

  // Newsletter State
  const [newsName, setNewsName] = useState('');
  const [newsEmail, setNewsEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleNewsSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail.trim() || !newsEmail.includes('@')) return;

    setNewsStatus('submitting');
    const subscriberName = newsName.trim() || 'Newsletter Reader';
    const email = newsEmail.trim();

    const sub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      name: subscriberName,
      email,
      source: 'News & Updates Newsletter',
      status: 'subscribed',
      subscribedAt: new Date().toISOString(),
    };

    // 1. LocalStorage
    try {
      const existing: NewsletterSubscriber[] = JSON.parse(
        localStorage.getItem('ahsora_subscribers') || '[]'
      );
      const filtered = existing.filter((s) => s.email.toLowerCase() !== email.toLowerCase());
      filtered.unshift(sub);
      localStorage.setItem('ahsora_subscribers', JSON.stringify(filtered));
    } catch (err) {
      console.warn('Newsletter storage write notice:', err);
    }

    // 2. CRM lead
    try {
      addLead({
        name: subscriberName,
        email,
        phone: 'Not provided',
        country: 'Global / Online',
        city: '',
        academicBackground: 'Newsletter Reader',
        targetExam: 'IMAT 2027',
        targetCountry: 'Italy',
        budgetRange: 'Standard',
        source: 'News & Updates Newsletter',
        priority: 'warm',
        stage: 'new',
        notes: 'Subscribed to Medical Admissions & IMAT Newsletter updates',
      });
    } catch {}

    // 3. Supabase Cloud Sync
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.from('leads').insert([
        {
          name: subscriberName,
          email,
          phone: null,
          target_exam: 'IMAT 2027',
          target_country: 'Italy',
          academic_background: 'Newsletter Subscriber',
          status: 'new',
          notes: 'Subscribed via /imat-news-and-updates page email updates',
        },
      ]);
    } catch (err) {
      console.warn('Supabase news newsletter sync error:', err);
    }

    // 4. Dispatch browser events for instant Admin portal sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ahsora_subscribers_updated', { detail: sub }));
      window.dispatchEvent(new CustomEvent('ahsora_leads_updated', { detail: sub }));
      window.dispatchEvent(new Event('storage'));
    }

    setNewsStatus('success');
  };

  useEffect(() => {
    const refresh = () => setPosts(getNewsPosts());
    refresh();
    syncNewsFromSupabase().then((p) => {
      if (p && p.length > 0) setPosts(p);
    });

    window.addEventListener('ahsora_cms_news_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('ahsora_cms_news_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* ── HERO ── */}
      <section
        className="news-hero page-hero"
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0F172A 100%)',
          color: '#FFFFFF',
          padding: '175px 0 60px',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <div className="container" style={{ maxWidth: '840px', textAlign: 'center', padding: '0 20px', margin: '0 auto' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#5CED73',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              backgroundColor: 'rgba(92,237,115,0.15)',
              padding: '4px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(92,237,115,0.3)',
              display: 'inline-block',
            }}
          >
            Ahsora Blog &amp; Updates
          </span>

          {/* H1 SEO Heading */}
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              marginTop: '16px',
              marginBottom: '20px',
              letterSpacing: '-1px',
              lineHeight: 1.18,
            }}
          >
            IMAT News &amp; Updates: Italian Medical School Admissions
          </h1>

          {/* GEO Direct Answer Snippet for AI Bot Scraping */}
          <div
            style={{
              marginTop: '18px',
              marginBottom: '24px',
              padding: '16px 22px',
              borderRadius: '14px',
              backgroundColor: 'rgba(92, 237, 115, 0.08)',
              border: '1px solid rgba(92, 237, 115, 0.28)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              textAlign: 'left',
              maxWidth: '820px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#5CED73',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  backgroundColor: 'rgba(92, 237, 115, 0.18)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                Official Admissions Desk Summary
              </span>
            </div>
            <p
              style={{
                margin: 0,
                color: '#E2E8F0',
                fontSize: '0.94rem',
                lineHeight: 1.65,
                fontWeight: 500,
              }}
            >
              Ahsora Meds Academy provides verified updates on the International Medical Admissions Test (IMAT), including syllabus changes, Universitaly registration windows, and real-time scrolling list analysis for English-taught Medicine (LM41) in Italy.
            </p>
          </div>

          <p style={{ color: '#CBD5E1', fontSize: '1.08rem', lineHeight: 1.7, maxWidth: '720px', margin: '0 auto' }}>
            Stay up to date with the latest IMAT news, Italian university admission announcements, study tips, and expert guides from the Ahsora team.
          </p>
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      {featured && (
        <section style={{ padding: '60px 0 40px', backgroundColor: '#FFFFFF' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ⭐ Featured Announcement
              </span>
            </div>
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '2px solid #6EE7B7',
                borderRadius: '24px',
                padding: '40px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 10px 30px -10px rgba(5,150,105,0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFF',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  🔔 {featured.category}
                </span>
                <span style={{ color: '#64748B', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={13} /> {featured.date}
                </span>
                <span style={{ color: '#64748B', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} /> {featured.readTime}
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, margin: 0 }}>
                {featured.title}
              </h2>
              <p
                style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}
                dangerouslySetInnerHTML={{ __html: featured.excerpt }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="#059669" /> {featured.author}
                </span>
                <Link
                  href={`/imat-news-and-updates/${featured.slug}`}
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 24px',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(5,150,105,0.25)',
                  }}
                >
                  Read Full Article <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ALL POSTS GRID OR EMPTY STATE ── */}
      <section style={{ padding: '20px 0 80px', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
            Latest Articles &amp; Updates ({posts.length})
          </div>

          {posts.length === 0 ? (
            /* Enhanced Empty State UI per DEV TICKET */
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '2px dashed #CBD5E1',
                borderRadius: '20px',
                padding: '56px 28px',
                textAlign: 'center',
                maxWidth: '680px',
                margin: '20px auto',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <BookOpen size={30} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                2027 IMAT Guides in Final Review
              </h3>
              <p
                style={{
                  color: '#475569',
                  fontSize: '1.02rem',
                  lineHeight: 1.65,
                  maxWidth: '540px',
                  margin: '0 auto 24px',
                }}
              >
                Our 2027 IMAT preparation guides are being finalized. Subscribe to our newsletter below to be notified when our first deep-dive article drops.
              </p>
              <a
                href="#admissions-newsletter"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <Mail size={16} /> Subscribe to Admissions Alerts
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/imat-news-and-updates/${post.slug}`}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        border: '1px solid #A7F3D0',
                        padding: '3px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <Tag size={10} style={{ marginRight: '4px' }} />
                      {post.category}
                    </span>
                    <span style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>{post.date}</span>
                  </div>

                  <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', lineHeight: 1.4, margin: 0 }}>
                    {post.title}
                  </h3>

                  <p
                    style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, margin: 0 }}
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={12} color="#059669" />
                      {post.readTime}
                    </span>
                    <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FULL SCREEN ARTICLE READER MODAL (Utilizes Full Horizontal Space & Mobile Optimized) ── */}
      {selectedPost && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0F172A',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <style>{`
            .ahsora-article-fullscreen-grid {
              display: grid;
              grid-template-columns: minmax(0, 1fr) 340px;
              gap: 32px;
              align-items: start;
            }
            .ahsora-article-canvas {
              padding: 40px 48px;
            }
            .ahsora-article-scroll-body {
              padding: 36px 24px 80px;
            }
            @media (max-width: 1080px) {
              .ahsora-article-fullscreen-grid {
                grid-template-columns: 1fr;
                gap: 24px;
              }
            }
            @media (max-width: 768px) {
              .ahsora-article-canvas {
                padding: 24px 18px !important;
                border-radius: 16px !important;
              }
              .ahsora-article-scroll-body {
                padding: 16px 12px 60px !important;
              }
            }
          `}</style>

          {/* Top Fullscreen Header Navigation Bar */}
          <div
            className="ahsora-article-topbar"
            style={{
              minHeight: '60px',
              backgroundColor: '#0F172A',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 20px',
              flexShrink: 0,
              color: '#FFFFFF',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              <button
                onClick={() => setSelectedPost(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                  e.currentTarget.style.borderColor = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                title="Close fullscreen article (or press Esc)"
              >
                <X size={16} /> Close
              </button>

              <span
                style={{
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  flexShrink: 0,
                }}
              >
                {selectedPost.category}
              </span>

              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#E2E8F0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedPost.title}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <Link
                href={`/imat-news-and-updates/${selectedPost.slug}`}
                style={{
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  padding: '7px 14px',
                  borderRadius: '9px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                Dedicated Page <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Fullscreen Wide Content Body */}
          <div
            className="ahsora-article-scroll-body"
            style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: '#F8FAFC',
            }}
          >
            <div
              className="ahsora-article-fullscreen-grid"
              style={{
                maxWidth: '1440px',
                width: '100%',
                margin: '0 auto',
              }}
            >
              {/* Main Wide Reading Canvas */}
              <div
                className="ahsora-article-canvas"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
                  minWidth: 0,
                }}
              >
                {/* Meta details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #A7F3D0' }}>
                    {selectedPost.category}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#059669" /> {selectedPost.date}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#059669" /> {selectedPost.readTime}
                  </span>
                </div>

                {/* Main Article Title */}
                <h1
                  style={{
                    fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                    fontWeight: 900,
                    color: '#0F172A',
                    lineHeight: 1.25,
                    marginBottom: '22px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {selectedPost.title}
                </h1>

                {/* Author Info Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    padding: '14px 18px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    marginBottom: '28px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                      }}
                    >
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>
                        {selectedPost.author}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Ahsora Academic Medical Advisory & Admissions Panel
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 10px', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
                    Verified Editorial ✓
                  </span>
                </div>

                {/* Lead Excerpt Callout */}
                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    borderLeft: '5px solid #059669',
                    padding: '22px 26px',
                    borderRadius: '0 14px 14px 0',
                    marginBottom: '32px',
                    fontSize: '1.08rem',
                    lineHeight: 1.75,
                    color: '#064E3B',
                    fontWeight: 500,
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedPost.excerpt }}
                />

                {/* Full Article Content Utilizing Wide Horizontal Space */}
                <div
                  className="rich-article-content prose-article"
                  style={{
                    fontSize: '1.05rem',
                    color: '#334155',
                    lineHeight: 1.9,
                    wordBreak: 'break-word',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: /<[a-z][\s\S]*>/i.test(selectedPost.content || '')
                      ? selectedPost.content
                      : (selectedPost.content || '')
                          .split(/\n\s*\n/)
                          .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
                          .join(''),
                  }}
                />

                {/* Footer Controls */}
                <div
                  style={{
                    marginTop: '44px',
                    paddingTop: '24px',
                    borderTop: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <button
                    onClick={() => setSelectedPost(null)}
                    style={{
                      padding: '11px 22px',
                      fontSize: '0.875rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#475569',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ← Close Fullscreen Reader
                  </button>

                  <Link
                    href={`/imat-news-and-updates/${selectedPost.slug}`}
                    style={{
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      padding: '11px 26px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      borderRadius: '10px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                    }}
                  >
                    View Full Dedicated Page <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Right Sticky Sidebar Utilizing Horizontal Space */}
              <div
                style={{
                  position: 'sticky',
                  top: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {/* Article Overview Card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '24px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                    Article Quick Overview
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Category</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669' }}>{selectedPost.category}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Estimated Read</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>{selectedPost.readTime}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Published Date</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>{selectedPost.date}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Accreditation</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669' }}>Italian IMAT LM-41</span>
                    </div>
                  </div>
                </div>

                {/* Official Ahsora Course CTA Card */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
                    borderRadius: '18px',
                    padding: '24px',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px -6px rgba(5, 150, 105, 0.4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={16} color="#5CED73" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5CED73', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      IMAT 2027 Preparation
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                    Master Your Medical School Admission
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#D1FAE5', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    Join hundreds of successful candidates with simulated CBT exams, verified question banks, and doctor tutoring.
                  </p>
                  <Link
                    href="/imat-preparation-courses"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: '#5CED73',
                      color: '#064E3B',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      fontSize: '0.8125rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    Explore Courses &amp; Enrol
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NEWSLETTER ── */}
      <section id="admissions-newsletter" style={{ padding: '70px 0', backgroundColor: '#0F172A', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(5, 150, 105, 0.2)', border: '1px solid rgba(5, 150, 105, 0.4)', borderRadius: '20px', padding: '4px 14px', marginBottom: '14px' }}>
            <Mail size={14} color="#34D399" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Weekly Admissions Digest</span>
          </div>

          {/* H2 SEO Heading */}
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            Get IMAT Updates &amp; MUR Decree Alerts
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: '28px', lineHeight: 1.7, fontSize: '0.98rem' }}>
            Get the latest IMAT test announcements, ministerial decree breakdowns, and verified Italian medical school admissions news straight to your inbox.
          </p>

          {newsStatus === 'success' ? (
            <div style={{ backgroundColor: 'rgba(5, 150, 105, 0.15)', border: '1px solid #059669', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={36} color="#34D399" />
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>You're Subscribed!</div>
              <p style={{ color: '#A7F3D0', fontSize: '0.875rem', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
                Your email has been registered and synced with our admissions dispatch team. You'll receive all upcoming IMAT updates and score reports.
              </p>
              <button
                onClick={() => {
                  setNewsStatus('idle');
                  setNewsEmail('');
                  setNewsName('');
                }}
                style={{ marginTop: '8px', background: 'none', border: 'none', color: '#34D399', fontSize: '0.8125rem', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Subscribe another address
              </button>
            </div>
          ) : (
            <form onSubmit={handleNewsSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={newsName}
                  onChange={(e) => setNewsName(e.target.value)}
                  style={{
                    flex: '1 1 180px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    backgroundColor: '#1E293B',
                    color: '#FFFFFF',
                    outline: 'none',
                    fontSize: '0.9375rem',
                  }}
                />
                <input
                  required
                  type="email"
                  placeholder="Your Email Address"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  style={{
                    flex: '1 1 240px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    backgroundColor: '#1E293B',
                    color: '#FFFFFF',
                    outline: 'none',
                    fontSize: '0.9375rem',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={newsStatus === 'submitting'}
                className="btn-primary"
                style={{
                  padding: '13px 28px',
                  fontSize: '0.95rem',
                  backgroundColor: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '10px',
                }}
              >
                {newsStatus === 'submitting' ? 'Subscribing...' : 'Subscribe to Updates'}
                <ArrowRight size={16} />
              </button>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                🔒 Zero spam. Unsubscribe at any time. Fully synced with admissions portal.
              </span>
            </form>
          )}
        </div>
      </section>

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} />

      <style jsx global>{`
        .rich-article-content h2 {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0F172A;
          margin: 24px 0 12px;
          line-height: 1.3;
        }
        .rich-article-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0F172A;
          margin: 18px 0 8px;
        }
        .rich-article-content p {
          margin-bottom: 16px;
        }
        .rich-article-content a {
          color: #059669;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.15s ease;
        }
        .rich-article-content a:hover {
          color: #047857;
        }
        .rich-article-content mark {
          background-color: #FEF08A;
          color: #0F172A;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
        .rich-article-content blockquote {
          border-left: 4px solid #059669;
          background-color: #F8FAFC;
          padding: 14px 20px;
          margin: 18px 0;
          border-radius: 0 10px 10px 0;
          font-style: italic;
          color: #334155;
        }
        .rich-article-content ul, .rich-article-content ol {
          padding-left: 24px;
          margin: 14px 0;
        }
        .rich-article-content li {
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}
