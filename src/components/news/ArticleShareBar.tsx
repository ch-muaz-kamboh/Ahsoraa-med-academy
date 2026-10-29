'use client';

import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Mail,
  MessageCircle,
  Send,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Sparkles
} from 'lucide-react';

interface ArticleShareBarProps {
  title: string;
  url: string;
  excerpt?: string;
  variant?: 'header' | 'footer' | 'floating';
}

export default function ArticleShareBar({
  title,
  url,
  excerpt = '',
  variant = 'header',
}: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [showInstaModal, setShowInstaModal] = useState(false);

  const cleanUrl = url.startsWith('http') ? url : `https://ahsorameds.com${url.startsWith('/') ? '' : '/'}${url}`;
  const shareText = `${title} — Ahsora Meds Academy`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cleanUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = cleanUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleInstagramShare = async () => {
    // If Web Share API is available (especially on iOS & Android phones)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} | Ahsora Meds Academy`,
          url: cleanUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy modal
      }
    }
    // Fallback on desktop: copy link and show guidance modal
    await handleCopyLink();
    setShowInstaModal(true);
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.82 2.791.82 3.181 0 5.767-2.587 5.768-5.766.001-3.18-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.503-4.477 9.98-9.98 9.98-1.749 0-3.385-.453-4.81-1.246l-5.21 1.365 1.393-5.083c-.899-1.488-1.423-3.23-1.423-5.016 0-5.503 4.477-9.98 9.98-9.98 5.503 0 9.98 4.477 9.98 9.98z" />
        </svg>
      ),
      bg: '#25D366',
      color: '#FFFFFF',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${cleanUrl}`)}`,
      action: null,
    },
    {
      name: 'Telegram',
      icon: <Send size={14} />,
      bg: '#229ED9',
      color: '#FFFFFF',
      href: `https://t.me/share/url?url=${encodeURIComponent(cleanUrl)}&text=${encodeURIComponent(shareText)}`,
      action: null,
    },
    {
      name: 'Facebook',
      icon: <Facebook size={14} />,
      bg: '#1877F2',
      color: '#FFFFFF',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`,
      action: null,
    },
    {
      name: 'X (Twitter)',
      icon: <Twitter size={14} />,
      bg: '#0F172A',
      color: '#FFFFFF',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(cleanUrl)}`,
      action: null,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={14} />,
      bg: '#0A66C2',
      color: '#FFFFFF',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cleanUrl)}`,
      action: null,
    },
    {
      name: 'Reddit',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-1.5 3.515 3.515-1.5C7.686 23.657 10.686 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.5 13.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm-13 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm6.5 4.5c-2.33 0-4.318-1.5-4.887-3.5h9.774c-.569 2-2.557 3.5-4.887 3.5z" />
        </svg>
      ),
      bg: '#FF4500',
      color: '#FFFFFF',
      href: `https://reddit.com/submit?url=${encodeURIComponent(cleanUrl)}&title=${encodeURIComponent(shareText)}`,
      action: null,
    },
    {
      name: 'Instagram',
      icon: <Instagram size={14} />,
      bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      color: '#FFFFFF',
      href: null,
      action: handleInstagramShare,
    },
    {
      name: 'Email',
      icon: <Mail size={14} />,
      bg: '#475569',
      color: '#FFFFFF',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this IMAT / medical admission article from Ahsora Meds Academy:\n\n${title}\n\nRead here: ${cleanUrl}`)}`,
      action: null,
    },
  ];

  // ── 1. HEADER VARIANT ──────────────────────────────────────────────────────
  if (variant === 'header') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.78rem', color: '#CBD5E1', fontWeight: 600, marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Share2 size={13} color="#34D399" /> Share:
        </span>

        {shareLinks.map((item) => {
          if (item.action) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                style={{
                  background: item.bg,
                  color: item.color,
                  border: 'none',
                  borderRadius: '20px',
                  padding: '5px 11px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                title={`Share on ${item.name}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            );
          }

          return (
            <a
              key={item.name}
              href={item.href || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: item.bg,
                color: item.color,
                borderRadius: '20px',
                padding: '5px 11px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              title={`Share on ${item.name}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          );
        })}

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          style={{
            backgroundColor: copied ? '#059669' : 'rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s ease',
          }}
          title="Copy article URL"
        >
          {copied ? <Check size={13} color="#A7F3D0" /> : <Copy size={13} />}
          <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
        </button>

        {/* Instagram Share Info Modal */}
        {showInstaModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15,23,42,0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '460px',
                padding: '28px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Instagram size={28} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Article Link Copied for Instagram!
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                The link has been copied to your clipboard. You can paste it directly into an:
                <br />
                <strong style={{ color: '#0F172A' }}>• Instagram Story Link Sticker</strong>
                <br />
                <strong style={{ color: '#0F172A' }}>• Direct Message (DM) to friends or study groups</strong>
                <br />
                <strong style={{ color: '#0F172A' }}>• Your Instagram Bio / Broadcast Channel</strong>
              </p>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.8rem',
                  color: '#334155',
                  wordBreak: 'break-all',
                  marginBottom: '20px',
                }}
              >
                {cleanUrl}
              </div>

              <button
                onClick={() => setShowInstaModal(false)}
                className="btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
              >
                Got It ✓
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── 2. FOOTER / WIDE VIRALITY CARD VARIANT ──────────────────────────────────
  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        border: '1.5px solid #E2E8F0',
        borderRadius: '16px',
        padding: '24px 28px',
        margin: '40px 0 20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkles size={18} color="#059669" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Share this Guide with Fellow IMAT Aspirants
            </h4>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.84rem', margin: 0 }}>
            Help friends preparing for Italian medical universities stay ahead with verified cutoff data and admissions insights.
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          style={{
            backgroundColor: copied ? '#059669' : '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s ease',
          }}
        >
          {copied ? <Check size={14} color="#A7F3D0" /> : <Copy size={14} />}
          <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Article Link'}</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        {shareLinks.map((item) => {
          if (item.action) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                style={{
                  background: item.bg,
                  color: item.color,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            );
          }

          return (
            <a
              key={item.name}
              href={item.href || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: item.bg,
                color: item.color,
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          );
        })}
      </div>

      {/* Instagram Share Info Modal */}
      {showInstaModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15,23,42,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '460px',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Instagram size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Article Link Copied for Instagram!
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              The link has been copied to your clipboard. Paste it directly in an Instagram Story Link sticker, your Bio, or direct messages.
            </p>

            <button
              onClick={() => setShowInstaModal(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
            >
              Done ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
