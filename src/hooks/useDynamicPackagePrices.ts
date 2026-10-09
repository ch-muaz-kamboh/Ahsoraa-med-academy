'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getDynamicPackagePrices,
  syncPricesFromSupabase,
  DynamicPackagePrice,
  getPackagePriceDisplay,
} from '@/lib/cms-store';

export function useDynamicPackagePrices() {
  const [prices, setPrices] = useState<DynamicPackagePrice[]>(() => getDynamicPackagePrices());

  const refreshPrices = useCallback(() => {
    setPrices(getDynamicPackagePrices());
  }, []);

  useEffect(() => {
    refreshPrices();

    syncPricesFromSupabase().then((p) => {
      if (p && p.length > 0) setPrices(p);
    });

    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setPrices(e.detail);
      } else {
        refreshPrices();
      }
    };

    window.addEventListener('ahsora_cms_prices_updated', handleUpdate);
    window.addEventListener('storage', refreshPrices);

    return () => {
      window.removeEventListener('ahsora_cms_prices_updated', handleUpdate);
      window.removeEventListener('storage', refreshPrices);
    };
  }, [refreshPrices]);

  const getPrice = useCallback(
    (id: string, fallback?: string) => {
      const targetId = id === 'ascent' ? 'ascend' : id;
      const found = prices.find((p) => p.id === targetId || p.id === id);
      if (!found) {
        return getPackagePriceDisplay(targetId, fallback);
      }
      return {
        price: found.price,
        originalPrice: (found.isDiscountActive ?? true) ? (found.originalPrice || null) : null,
        badge: (found.isDiscountActive ?? true) ? (found.discountBadge || null) : null,
      };
    },
    [prices]
  );

  const isAvailable = useCallback(
    (id: string) => {
      const targetId = id === 'ascent' ? 'ascend' : id;
      const found = prices.find((p) => p.id === targetId || p.id === id);
      return found?.isAvailable !== false;
    },
    [prices]
  );

  const getDisabledNotice = useCallback(
    (id: string) => {
      const targetId = id === 'ascent' ? 'ascend' : id;
      const found = prices.find((p) => p.id === targetId || p.id === id);
      return found?.disabledNotice || 'Currently Unavailable';
    },
    [prices]
  );

  return { prices, getPrice, isAvailable, getDisabledNotice, refreshPrices };
}
