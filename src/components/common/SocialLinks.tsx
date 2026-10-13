'use client';

import React from 'react';

export const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/ahsorameds.imat?utm_source=qr&rpxt=MXdkZ3J1eXgwcmxocQ==',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    color: '#E1306C',
    hoverBg: 'rgba(225, 48, 108, 0.15)',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@ahsoramedsacademy?si=RN6b0xCofOXTexCr',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: '#FF0000',
    hoverBg: 'rgba(255, 0, 0, 0.15)',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/share/g/1Gu5u6Xoao/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: '#1877F2',
    hoverBg: 'rgba(24, 119, 242, 0.15)',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/393333444479',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 2C6.496 2 2 6.495 2 12.03c0 1.97.57 3.82 1.56 5.39L2.2 21.8l4.53-1.33c1.51.91 3.27 1.41 5.3 1.41 5.535 0 10.031-4.495 10.031-10.03C22.062 6.495 17.566 2 12.031 2zm5.88 14.18c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.14.07-3.69-.97-3.15-1.28-5.18-4.49-5.34-4.7-.16-.21-1.27-1.69-1.27-3.23 0-1.54.81-2.3 1.1-2.61.29-.31.63-.39.84-.39.21 0 .42 0 .6.01.19.01.45-.07.7.53.26.63.89 2.16.97 2.32.08.16.13.35.03.56-.1.21-.16.34-.31.52-.16.18-.33.4-.47.54-.16.15-.32.32-.14.63.18.31.81 1.33 1.73 2.15 1.19 1.06 2.19 1.39 2.5 1.55.31.16.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.16.29.1 1.83.86 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.16 1.44z"/>
      </svg>
    ),
    color: '#25D366',
    hoverBg: 'rgba(37, 211, 102, 0.15)',
  },
];

interface SocialLinksProps {
  className?: string;
  variant?: 'light' | 'dark' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export default function SocialLinks({
  className = '',
  variant = 'emerald',
  size = 'md',
  showLabels = false,
}: SocialLinksProps) {
  const isDark = variant === 'dark';
  const isEmerald = variant === 'emerald';

  const baseItemStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '10px',
    textDecoration: 'none',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    padding: showLabels ? '8px 14px' : size === 'sm' ? '6px' : '9px',
    background: isDark
      ? 'rgba(255, 255, 255, 0.06)'
      : isEmerald
      ? 'rgba(6, 78, 59, 0.08)'
      : 'rgba(15, 23, 42, 0.05)',
    border: isDark
      ? '1px solid rgba(255, 255, 255, 0.12)'
      : isEmerald
      ? '1px solid rgba(6, 78, 59, 0.15)'
      : '1px solid rgba(15, 23, 42, 0.1)',
    color: isDark ? '#E2E8F0' : isEmerald ? '#065F46' : '#334155',
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
      }}
    >
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Follow Ahsora on ${item.name}`}
          aria-label={item.name}
          style={baseItemStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.color = item.color;
            e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.14)' : item.hoverBg;
            e.currentTarget.style.borderColor = item.color;
            e.currentTarget.style.boxShadow = `0 4px 12px ${item.hoverBg}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.color = isDark ? '#E2E8F0' : isEmerald ? '#065F46' : '#334155';
            e.currentTarget.style.background = isDark
              ? 'rgba(255, 255, 255, 0.06)'
              : isEmerald
              ? 'rgba(6, 78, 59, 0.08)'
              : 'rgba(15, 23, 42, 0.05)';
            e.currentTarget.style.borderColor = isDark
              ? 'rgba(255, 255, 255, 0.12)'
              : isEmerald
              ? 'rgba(6, 78, 59, 0.15)'
              : '1px solid rgba(15, 23, 42, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {item.icon}
          {showLabels && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.name}</span>
          )}
        </a>
      ))}
    </div>
  );
}
