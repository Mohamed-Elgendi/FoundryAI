// React Hook for Affiliate System - ACTUAL IMPLEMENTATION
// Beast Mode - Production Ready

'use client';

import { useState, useEffect, useCallback } from 'react';
import { affiliateService } from '@/layer-3-data/services/affiliate-service';
import type { Affiliate, AffiliateDashboard, AffiliateLink, Conversion, Payout } from '@/types/affiliate';

interface UseAffiliateReturn {
  affiliate: Affiliate | null;
  dashboard: AffiliateDashboard | null;
  links: AffiliateLink[];
  payouts: Payout[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createLink: (productId: string, customUrl?: string) => Promise<AffiliateLink | null>;
  requestPayout: (amount: number, method: 'stripe' | 'paypal' | 'bank_transfer') => Promise<Payout | null>;
}

export function useAffiliate(userId?: string): UseAffiliateReturn {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [dashboard, setDashboard] = useState<AffiliateDashboard | null>(null);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get or create affiliate
      const aff = await affiliateService.getOrCreateAffiliate(userId);
      setAffiliate(aff);

      // Fetch dashboard
      const dash = await affiliateService.getDashboard(aff.id);
      setDashboard(dash);

      // Fetch links
      const linkData = await affiliateService.getAffiliateLinks(aff.id);
      setLinks(linkData);

      // Fetch payouts
      const payoutData = await affiliateService.getPayouts(aff.id);
      setPayouts(payoutData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch affiliate data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createLink = useCallback(async (
    productId: string,
    customUrl?: string
  ): Promise<AffiliateLink | null> => {
    if (!affiliate) return null;

    try {
      const link = await affiliateService.createAffiliateLink(affiliate.id, productId, customUrl);
      await fetchData();
      return link;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
      return null;
    }
  }, [affiliate, fetchData]);

  const requestPayout = useCallback(async (
    amount: number,
    method: 'stripe' | 'paypal' | 'bank_transfer'
  ): Promise<Payout | null> => {
    if (!affiliate) return null;

    try {
      const payout = await affiliateService.requestPayout({
        affiliateId: affiliate.id,
        amount,
        method
      });
      await fetchData();
      return payout;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request payout');
      return null;
    }
  }, [affiliate, fetchData]);

  return {
    affiliate,
    dashboard,
    links,
    payouts,
    loading,
    error,
    refresh: fetchData,
    createLink,
    requestPayout
  };
}
