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
      const updateHeight = () => {
        if (!isShowing) {
          document.documentElement.style.setProperty('--top-offer-bar-height', '0px');
          return;
        }
        const bar = document.getElementById('global-top-offer-bar');
        const h = bar ? `${bar.offsetHeight}px` : (window.innerWidth <= 640 ? '64px' : '46px');
        document.documentElement.style.setProperty('--top-offer-bar-height', h);
      };

      updateHeight();
      const timer = setTimeout(updateHeight, 60);
      window.addEventListener('resize', updateHeight);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateHeight);
      };
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
        background: 'linear-gradient(90deg, #022018 0%, #064E3B 45%, #0B1F2E 100%)',
        borderBottom: '1px solid rgba(92, 237, 115, 0.3)',
        color: '#FFFFFF',
        position: 'relative',
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.28)',
      }}
    >
      <div className="container top-offer-container">
        {/* Row 1 on mobile / Left group on desktop */}
        <div className="top-offer-row-main">
          {offer.discountBadgeText && (
            <span className="top-offer-badge">
              <Sparkles size={11} className="top-offer-badge-sparkle" />
              <span>{offer.discountBadgeText}</span>
            </span>
          )}

          <div className="top-offer-title-wrap">
            <span className="top-offer-title">
              {offer.offerTitle}
            </span>
            {offer.promoCode && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="top-offer-code-btn top-offer-code-desktop"
                title="Click to copy promo code"
              >
                {copied ? <Check size={11} color="#5CED73" /> : <Copy size={11} />}
                <span>{copied ? 'COPIED' : offer.promoCode}</span>
              </button>
            )}
          </div>

          {/* Mobile-only Top Right Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="top-offer-dismiss-mobile"
            aria-label="Dismiss offer bar"
            title="Dismiss offer notification"
          >
            <X size={14} />
          </button>
        </div>

        {/* Row 2 on mobile / Right group on desktop */}
        <div className="top-offer-row-actions">
          {offer.promoCode && (
            <button
              type="button"
              onClick={handleCopyCode}
              className="top-offer-code-btn top-offer-code-mobile"
              title="Click to copy promo code"
            >
              {copied ? <Check size={11} color="#5CED73" /> : <Copy size={11} />}
              <span>{copied ? 'COPIED' : offer.promoCode}</span>
            </button>
          )}

          {/* Countdown Blocks */}
          <div className="top-offer-countdown">
            <Timer size={12} color="#5CED73" style={{ marginRight: '2px', flexShrink: 0 }} />
            {[
              { val: timeLeft.days, unit: 'd' },
              { val: timeLeft.hours, unit: 'h' },
              { val: timeLeft.minutes, unit: 'm' },
              { val: timeLeft.seconds, unit: 's' },
            ].map((t, idx) => (
              <React.Fragment key={idx}>
                <span className={`top-offer-timer-num ${t.unit === 's' ? 'top-offer-timer-sec' : ''}`}>
                  {String(t.val).padStart(2, '0')}{t.unit}
                </span>
                {idx < 3 && <span className={`top-offer-timer-sep ${idx === 2 ? 'top-offer-timer-sec' : ''}`}>:</span>}
              </React.Fragment>
            ))}
          </div>

          {/* CTA Link */}
          <Link
            href="/courses#programmes"
            className="top-offer-cta"
          >
            <span className="top-offer-cta-full">Claim Discount</span>
            <span className="top-offer-cta-short">Claim</span>
            <ArrowRight size={12} />
          </Link>

          {/* Desktop-only Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="top-offer-dismiss-desktop"
            aria-label="Dismiss offer bar"
            title="Dismiss offer notification"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .top-offer-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 46px;
          padding-top: 6px;
          padding-bottom: 6px;
          gap: 12px;
        }
        .top-offer-row-main {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .top-offer-badge {
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 9999px;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .top-offer-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
        }
        .top-offer-title {
          font-size: 0.875rem;
          font-weight: 800;
          color: #5CED73;
          letter-spacing: -0.2px;
          white-space: nowrap;
        }
        .top-offer-code-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.45);
          color: #FCD34D;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .top-offer-code-btn:hover {
          background-color: rgba(245, 158, 11, 0.28);
        }
        .top-offer-code-mobile {
          display: none;
        }
        .top-offer-row-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .top-offer-countdown {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: rgba(0, 0, 0, 0.32);
          padding: 3px 9px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          flex-shrink: 0;
        }
        .top-offer-timer-num {
          font-size: 0.78rem;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          color: #FFFFFF;
        }
        .top-offer-timer-sep {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.7rem;
        }
        .top-offer-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.35);
          transition: all 0.15s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .top-offer-cta:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-1px);
        }
        .top-offer-cta-short {
          display: none;
        }
        .top-offer-dismiss-desktop {
          background-color: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: color 0.15s ease;
        }
        .top-offer-dismiss-desktop:hover {
          color: #FFFFFF;
        }
        .top-offer-dismiss-mobile {
          display: none;
        }

        /* ── Mobile Layout (<= 640px) ── */
        @media (max-width: 640px) {
          .top-offer-container {
            flex-direction: column !important;
            padding: 5px 12px 6px !important;
            gap: 5px !important;
            min-height: auto !important;
          }
          .top-offer-row-main {
            width: 100% !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 6px !important;
          }
          .top-offer-badge {
            font-size: 0.62rem !important;
            padding: 2px 6px !important;
          }
          .top-offer-title-wrap {
            flex: 1 1 auto !important;
            overflow: hidden !important;
            min-width: 0 !important;
          }
          .top-offer-title {
            font-size: 0.76rem !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: block !important;
            color: #5CED73 !important;
          }
          .top-offer-code-desktop {
            display: none !important;
          }
          .top-offer-dismiss-desktop {
            display: none !important;
          }
          .top-offer-dismiss-mobile {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 24px !important;
            height: 24px !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.16) !important;
            color: rgba(255, 255, 255, 0.8) !important;
            cursor: pointer !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
            transition: all 0.15s ease !important;
          }
          .top-offer-dismiss-mobile:active {
            background: rgba(255, 255, 255, 0.25) !important;
            transform: scale(0.92) !important;
          }
          .top-offer-row-actions {
            width: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 6px !important;
          }
          .top-offer-code-mobile {
            display: inline-flex !important;
            align-items: center !important;
            gap: 3px !important;
            font-size: 0.68rem !important;
            padding: 3px 8px !important;
            border-radius: 9999px !important;
            flex-shrink: 0 !important;
          }
          .top-offer-countdown {
            padding: 3px 8px !important;
            gap: 3px !important;
            border-radius: 9999px !important;
            flex-shrink: 0 !important;
          }
          .top-offer-timer-num {
            font-size: 0.72rem !important;
          }
          .top-offer-cta {
            font-size: 0.72rem !important;
            padding: 3px 10px !important;
            border-radius: 9999px !important;
            flex-shrink: 0 !important;
          }
        }

        /* ── Phones under 480px ── */
        @media (max-width: 480px) {
          .top-offer-timer-sec {
            display: none !important;
          }
          .top-offer-cta-full {
            display: none !important;
          }
          .top-offer-cta-short {
            display: inline !important;
          }
        }

        /* ── Narrow Phones (<= 360px) ── */
        @media (max-width: 360px) {
          .top-offer-container {
            padding: 4px 8px 5px !important;
          }
          .top-offer-title {
            font-size: 0.7rem !important;
          }
          .top-offer-code-mobile {
            font-size: 0.64rem !important;
            padding: 2px 6px !important;
          }
          .top-offer-timer-num {
            font-size: 0.66rem !important;
          }
          .top-offer-cta {
            font-size: 0.66rem !important;
            padding: 2px 7px !important;
          }
        }
      `}</style>
    </aside>
  );
}
