'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Tag, Clock, User, Sparkles, BookOpen, X } from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';
import { getNewsPosts, NewsItem } from '@/lib/cms-store';

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [selectedPost, setSelectedPost] = useState<NewsItem | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);

  useEffect(() => {
    setPosts(getNewsPosts());
  }, []);

  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0F172A 100%)',
          color: '#FFFFFF',
          padding: '116px 0 60px',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
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
            }}
          >
            Ahsora Blog &amp; Updates
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              marginTop: '16px',
              marginBottom: '20px',
              letterSpacing: '-1px',
              lineHeight: 1.15,
            }}
          >
            News, Guides &amp; Official Updates
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Stay up to date with the latest IMAT news, Italian university admission announcements, study tips, and expert guides from the Ahsora team.
          </p>
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      {featured && (
        <section style={{ padding: '60px 0 40px', backgroundColor: '#FFFFFF' }}>
          <div className="container">
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
              <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>{featured.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="#059669" /> {featured.author}
                </span>
                <button
                  onClick={() => setSelectedPost(featured)}
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 24px',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(5,150,105,0.25)',
                  }}
                >
                  Read Full Article <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ALL POSTS GRID ── */}
      <section style={{ padding: '20px 0 80px', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
            Latest Articles &amp; Updates ({posts.length})
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {rest.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setSelectedPost(post)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 30px -10px rgba(15,23,42,0.1)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#6EE7B7';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#E2E8F0';
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

                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, margin: 0 }}>
                  {post.excerpt}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={12} color="#059669" />
                    {post.readTime}
                  </span>
                  <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read Article <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLE MODAL ── */}
      {selectedPost && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '36px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPost(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                {selectedPost.category}
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>{selectedPost.date} • {selectedPost.readTime}</span>
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', lineHeight: 1.3 }}>
              {selectedPost.title}
            </h2>

            <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} /> Author: {selectedPost.author}
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '18px 20px', borderRadius: '12px', borderLeft: '4px solid #059669', marginBottom: '24px', fontSize: '0.95rem', color: '#334155', lineHeight: 1.7 }}>
              {selectedPost.excerpt}
            </div>

            <div style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {selectedPost.content}
            </div>

            <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedPost(null)}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.875rem', borderRadius: '10px' }}
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEWSLETTER ── */}
      <section style={{ padding: '70px 0', backgroundColor: '#0F172A', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '580px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>Stay Updated</h2>
          <p style={{ color: '#94A3B8', marginBottom: '32px', lineHeight: 1.7 }}>
            Get the latest IMAT news, admission deadlines, and study tips delivered straight to your inbox.
          </p>
          <button onClick={() => setLeadOpen(true)} className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem', backgroundColor: '#059669' }}>
            Subscribe to Updates
          </button>
        </div>
      </section>

      <LeadCaptureModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} />
    </div>
  );
}
