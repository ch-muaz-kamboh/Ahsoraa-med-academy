'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  getPortalTickerConfig,
  syncPortalTickerFromSupabase,
  PortalTickerConfig,
} from '@/lib/cms-store';
import { Megaphone, Sparkles } from 'lucide-react';

export default function PortalMovingStrip() {
  const [config, setConfig] = useState<PortalTickerConfig>(() => getPortalTickerConfig());

  const refreshConfig = useCallback(() => {
    setConfig(getPortalTickerConfig());
  }, []);

  useEffect(() => {
    refreshConfig();

    syncPortalTickerFromSupabase().then((synced) => {
      if (synced) setConfig(synced);
    });

    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setConfig(e.detail);
      } else {
        refreshConfig();
      }
    };

    window.addEventListener('ahsora_cms_portal_ticker_updated', handleUpdate);
    window.addEventListener('storage', refreshConfig);

    return () => {
      window.removeEventListener('ahsora_cms_portal_ticker_updated', handleUpdate);
      window.removeEventListener('storage', refreshConfig);
    };
  }, [refreshConfig]);

  if (!config.isActive || !config.items || config.items.length === 0) {
    return null;
  }

  const speed = config.speedSeconds || 26;
  const duplicated = [...config.items, ...config.items, ...config.items];

  // Theme styling based on config.bgStyle
  const themeStyles = {
    emerald: {
      background: 'linear-gradient(90deg, #022C22 0%, #064E3B 40%, #0F172A 100%)',
      borderBottom: '1px solid rgba(92, 237, 115, 0.25)',
      badgeBg: '#059669',
      badgeColor: '#FFFFFF',
      badgeBorder: '1px solid rgba(92, 237, 115, 0.4)',
      textColor: '#ECFDF5',
      dividerColor: 'rgba(92, 237, 115, 0.35)',
    },
    dark: {
      background: 'linear-gradient(90deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      borderBottom: '1px solid #334155',
      badgeBg: '#3B82F6',
      badgeColor: '#FFFFFF',
      badgeBorder: '1px solid rgba(59, 130, 246, 0.4)',
      textColor: '#F1F5F9',
      dividerColor: '#475569',
    },
    slate: {
      background: 'linear-gradient(90deg, #F8FAFC 0%, #F1F5F9 50%, #F8FAFC 100%)',
      borderBottom: '1px solid #E2E8F0',
      badgeBg: '#059669',
      badgeColor: '#FFFFFF',
      badgeBorder: '1px solid #059669',
      textColor: '#1E293B',
      dividerColor: '#CBD5E1',
    },
  };

  const theme = themeStyles[config.bgStyle] || themeStyles.emerald;

  return (
    <div
      id="portal-moving-announcement-strip"
      role="region"
      aria-label="Student Portal Live Announcements"
      style={{
        background: theme.background,
        borderBottom: theme.borderBottom,
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      {/* Left fixed badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0 14px',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 3,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            backgroundColor: theme.badgeBg,
            color: theme.badgeColor,
            border: theme.badgeBorder,
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '9999px',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 0 10px rgba(5, 150, 105, 0.3)',
          }}
        >
          <Megaphone size={11} />
          <span>PORTAL NOTICE</span>
        </span>
      </div>

      {/* Left gradient fade mask */}
      <div
        style={{
          position: 'absolute',
          left: '145px',
          top: 0,
          bottom: 0,
          width: '30px',
          background: 'linear-gradient(to right, rgba(2, 44, 34, 0.8), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Right gradient fade mask */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '40px',
          background: 'linear-gradient(to left, rgba(15, 23, 42, 0.9), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Marquee Track */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="portal-marquee-track"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            animation: `marqueeScroll ${speed}s linear infinite`,
            willChange: 'transform',
          }}
        >
          {duplicated.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 28px',
                color: theme.textColor,
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '-0.1px',
                cursor: 'default',
              }}
            >
              <span style={{ fontSize: '0.95rem' }}>{item.icon || '✨'}</span>
              <span>{item.text}</span>
              <span style={{ color: theme.dividerColor, marginLeft: '12px' }}>•</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .portal-marquee-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}
