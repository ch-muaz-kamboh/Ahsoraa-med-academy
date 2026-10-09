'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles, Timer, ArrowRight, X, Copy, Check } from 'lucide-react';
import { getSaleOfferConfig, syncSaleOfferFromSupabase, SaleOfferConfig } from '@/lib/cms-store';

export default function TopOfferBar() {
  const [offer, setOffer] = useState<SaleOfferConfig>(() => getSaleOfferConfig());
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const refreshConfig = useCallback(() => {
    const local = getSaleOfferConfig();
    setOffer(local);
  }, []);

  useEffect(() => {
    refreshConfig();

    syncSaleOfferFromSupabase().then((synced) => {
      if (synced) setOffer(synced);
    });

    const handleOfferUpdate = (e: any) => {
      if (e?.detail) {
        setOffer(e.detail);
      } else {
        refreshConfig();
      }
    };

    window.addEventListener('ahsora_cms_sale_offer_updated', handleOfferUpdate);
    window.addEventListener('storage', refreshConfig);

    return () => {
      window.removeEventListener('ahsora_cms_sale_offer_updated', handleOfferUpdate);
      window.removeEventListener('storage', refreshConfig);
    };
  }, [refreshConfig]);

  // Countdown timer interval
  useEffect(() => {
    if (!offer?.endDate || !offer?.isSaleActive || dismissed) return;

    const calculateTime = () => {
      const target = new Date(offer.endDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (isNaN(target) || diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [offer?.endDate, offer?.isSaleActive, dismissed]);

  // Set CSS variable on root for layout spacing awareness
  useEffect(() => {
    const isShowing = !!(offer && offer.isSaleActive && !dismissed);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--top-offer-bar-height',
        isShowing ? '46px' : '0px'
      );
    }
  }, [offer, dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (offer?.promoCode && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(offer.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!offer || !offer.isSaleActive || dismissed) {
    return null;
  }

  return (
    <aside
      id="global-top-offer-bar"
      aria-label="Promotional Offer Announcement"
      style={{
        background: 'linear-gradient(90deg, #022C22 0%, #064E3B 38%, #0F172A 100%)',
        borderBottom: '1px solid rgba(92, 237, 115, 0.35)',
        color: '#FFFFFF',
        position: 'relative',
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '46px',
          paddingTop: '6px',
          paddingBottom: '6px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Left / Center: Offer badge & Title message */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            flex: 1,
            minWidth: '260px',
          }}
        >
          {offer.discountBadgeText && (
            <span
              style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '0.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)',
                animation: 'pulse 2.5s infinite',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={11} />
              {offer.discountBadgeText}
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 800,
                color: '#5CED73',
                letterSpacing: '-0.2px',
              }}
            >
              {offer.offerTitle}
            </span>

            {offer.promoCode && (
              <button
                type="button"
                onClick={handleCopyCode}
                title="Click to copy promo code"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  color: '#FCD34D',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>Code: <strong>{offer.promoCode}</strong></span>
                {copied ? <Check size={12} color="#5CED73" /> : <Copy size={11} />}
              </button>
            )}
          </div>
        </div>

        {/* Right side: Countdown Timer & CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Countdown Blocks */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              padding: '3px 6px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <Timer size={13} color="#5CED73" style={{ marginRight: '2px' }} />
            {[
              { val: timeLeft.days, unit: 'd' },
              { val: timeLeft.hours, unit: 'h' },
              { val: timeLeft.minutes, unit: 'm' },
              { val: timeLeft.seconds, unit: 's' },
            ].map((t, idx) => (
              <React.Fragment key={idx}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    fontVariantNumeric: 'tabular-nums',
                    color: '#FFFFFF',
                  }}
                >
                  {String(t.val).padStart(2, '0')}{t.unit}
                </span>
                {idx < 3 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>:</span>}
              </React.Fragment>
            ))}
          </div>

          {/* CTA Link */}
          <Link
            href="/courses#programmes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '5px 12px',
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.35)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Claim Discount</span>
            <ArrowRight size={13} />
          </Link>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss offer bar"
            title="Dismiss offer notification"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.65)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
