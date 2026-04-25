// Affiliate Marketplace Service - ACTUAL IMPLEMENTATION
// Beast Mode - Production Ready

import { createBrowserSupabaseClient } from '@/layer-3-data/supabase/client';

const supabase = createBrowserSupabaseClient();

import type {
  Affiliate,
  AffiliateTier,
  Conversion,
  AffiliateLink,
  Click,
  AffiliateDashboard,
  AffiliateStats,
  ProductPerformance,
  MonthlyEarning,
  Payout,
  PayoutRequest,
  AffiliateProduct,
  ReferralTree,
  AffiliateNotification
} from '@/types/affiliate';

export class AffiliateService {
  private static instance: AffiliateService;

  static getInstance(): AffiliateService {
    if (!AffiliateService.instance) {
      AffiliateService.instance = new AffiliateService();
    }
    return AffiliateService.instance;
  }

  // ============== AFFILIATE MANAGEMENT ==============

  async getOrCreateAffiliate(userId: string): Promise<Affiliate> {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Create new affiliate
        const referralCode = this.generateReferralCode(userId);

        const { data: newAffiliate, error: createError } = await supabase
          .from('affiliates')
          .insert({
            user_id: userId,
            tier: 'bronze',
            commission_rate: 10,
            referral_code: referralCode,
            total_earnings: 0,
            pending_earnings: 0,
            lifetime_clicks: 0,
            lifetime_conversions: 0,
            conversion_rate: 0,
            status: 'active'
          })
          .select()
          .single();

        if (createError) throw createError;

        // Award points for becoming affiliate
        await this.awardAffiliateSignupPoints(userId);

        return newAffiliate;
      }

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching affiliate:', error);
      throw error;
    }
  }

  private generateReferralCode(userId: string): string {
    return `FND${userId.substring(0, 6).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  }

  private async awardAffiliateSignupPoints(userId: string): Promise<void> {
    try {
      const { gamificationService } = await import('./gamification-service');
      await gamificationService.awardPoints(
        userId,
        100,
        'Became an affiliate partner',
        { type: 'affiliate_signup' }
      );
    } catch (error) {
      console.error('Error awarding affiliate points:', error);
    }
  }

  async getAffiliate(affiliateId: string): Promise<Affiliate | null> {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('id', affiliateId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching affiliate:', error);
      return null;
    }
  }

  async updateAffiliateTier(affiliateId: string): Promise<Affiliate> {
    try {
      const affiliate = await this.getAffiliate(affiliateId);
      if (!affiliate) throw new Error('Affiliate not found');

      // Determine new tier based on conversions
      const newTier = this.calculateTier(affiliate.lifetimeConversions);

      if (newTier !== affiliate.tier) {
        // Tier upgrade!
        const tierRates = {
          'bronze': 10,
          'silver': 15,
          'gold': 25,
          'platinum': 35
        };

        const { data, error } = await supabase
          .from('affiliates')
          .update({
            tier: newTier,
            commission_rate: tierRates[newTier],
            updated_at: new Date().toISOString()
          })
          .eq('id', affiliateId)
          .select()
          .single();

        if (error) throw error;

        // Create notification
        await this.createNotification(
          affiliateId,
          'tier_upgrade',
          `Tier Upgrade: ${newTier.toUpperCase()}!`,
          `Congratulations! You've been upgraded to ${newTier} tier with ${tierRates[newTier]}% commission.`
        );

        return data;
      }

      return affiliate;
    } catch (error) {
      console.error('Error updating affiliate tier:', error);
      throw error;
    }
  }

  private calculateTier(conversions: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (conversions >= 100) return 'platinum';
    if (conversions >= 50) return 'gold';
    if (conversions >= 10) return 'silver';
    return 'bronze';
  }

  // ============== TRACKING & CONVERSIONS ==============

  async trackClick(
    affiliateId: string,
    linkId: string,
    metadata: {
      ipAddress: string;
      userAgent: string;
      referrer?: string;
      country?: string;
    }
  ): Promise<Click> {
    try {
      const { data, error } = await supabase
        .from('clicks')
        .insert({
          affiliate_id: affiliateId,
          link_id: linkId,
          ip_address: metadata.ipAddress,
          user_agent: metadata.userAgent,
          referrer: metadata.referrer,
          country: metadata.country,
          converted: false
        })
        .select()
        .single();

      if (error) throw error;

      // Update affiliate click count
      await supabase.rpc('increment_affiliate_clicks', { p_affiliate_id: affiliateId });

      return data;
    } catch (error) {
      console.error('Error tracking click:', error);
      throw error;
    }
  }

  async trackConversion(
    affiliateId: string,
    orderId: string,
    customerId: string,
    productId: string,
    productName: string,
    productPrice: number,
    clickId?: string
  ): Promise<Conversion> {
    try {
      const affiliate = await this.getAffiliate(affiliateId);
      if (!affiliate) throw new Error('Affiliate not found');

      // Calculate commission
      const commissionAmount = (productPrice * affiliate.commissionRate) / 100;

      const { data, error } = await supabase
        .from('conversions')
        .insert({
          affiliate_id: affiliateId,
          order_id: orderId,
          customer_id: customerId,
          product_id: productId,
          product_name: productName,
          product_price: productPrice,
          commission_amount: commissionAmount,
          status: 'pending',
          click_id: clickId
        })
        .select()
        .single();

      if (error) throw error;

      // Update affiliate stats
      await this.updateAffiliateStats(affiliateId, commissionAmount);

      // Create notification
      await this.createNotification(
        affiliateId,
        'conversion',
        'New Conversion!',
        `You earned $${commissionAmount.toFixed(2)} from ${productName}`
      );

      // Award points
      await this.awardConversionPoints(affiliate.userId, commissionAmount);

      return data;
    } catch (error) {
      console.error('Error tracking conversion:', error);
      throw error;
    }
  }

  private async updateAffiliateStats(
    affiliateId: string,
    commissionAmount: number
  ): Promise<void> {
    try {
      // Get current stats
      const { data: affiliate } = await supabase
        .from('affiliates')
        .select('*')
        .eq('id', affiliateId)
        .single();

      if (!affiliate) return;

      const newConversions = affiliate.lifetime_conversions + 1;
      const newEarnings = affiliate.total_earnings + commissionAmount;
      const newPending = affiliate.pending_earnings + commissionAmount;
      const newConversionRate = (newConversions / Math.max(affiliate.lifetime_clicks, 1)) * 100;

      await supabase
        .from('affiliates')
        .update({
          lifetime_conversions: newConversions,
          total_earnings: newEarnings,
          pending_earnings: newPending,
          conversion_rate: newConversionRate,
          updated_at: new Date().toISOString()
        })
        .eq('id', affiliateId);

      // Check for tier upgrade
      await this.updateAffiliateTier(affiliateId);
    } catch (error) {
      console.error('Error updating affiliate stats:', error);
    }
  }

  private async awardConversionPoints(userId: string, commissionAmount: number): Promise<void> {
    try {
      const { gamificationService } = await import('./gamification-service');
      const points = Math.floor(commissionAmount * 10);
      await gamificationService.awardPoints(
        userId,
        points,
        `Affiliate conversion earned`,
        { type: 'affiliate_conversion', amount: commissionAmount }
      );
    } catch (error) {
      console.error('Error awarding conversion points:', error);
    }
  }

  async approveConversion(conversionId: string): Promise<Conversion> {
    try {
      const { data, error } = await supabase
        .from('conversions')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', conversionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error approving conversion:', error);
      throw error;
    }
  }

  // ============== LINK MANAGEMENT ==============

  async createAffiliateLink(
    affiliateId: string,
    productId: string,
    customUrl?: string
  ): Promise<AffiliateLink> {
    try {
      const shortCode = Math.random().toString(36).substring(2, 8);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://foundryai-seven.vercel.app';

      const { data, error } = await supabase
        .from('affiliate_links')
        .insert({
          affiliate_id: affiliateId,
          product_id: productId,
          url: customUrl || `${baseUrl}/ref/${shortCode}`,
          short_url: `${baseUrl}/r/${shortCode}`,
          clicks: 0,
          conversions: 0,
          earnings: 0,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating affiliate link:', error);
      throw error;
    }
  }

  async getAffiliateLinks(affiliateId: string): Promise<AffiliateLink[]> {
    try {
      const { data, error } = await supabase
        .from('affiliate_links')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
      return [];
    }
  }

  // ============== DASHBOARD & STATS ==============

  async getDashboard(affiliateId: string): Promise<AffiliateDashboard> {
    try {
      const [affiliate, stats, recentConversions, topProducts, monthlyEarnings] = await Promise.all([
        this.getAffiliate(affiliateId),
        this.getStats(affiliateId),
        this.getRecentConversions(affiliateId, 10),
        this.getTopProducts(affiliateId, 5),
        this.getMonthlyEarnings(affiliateId, 12)
      ]);

      if (!affiliate) throw new Error('Affiliate not found');

      return {
        affiliate,
        stats,
        recentConversions,
        topProducts,
        monthlyEarnings
      };
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  }

  private async getStats(affiliateId: string): Promise<AffiliateStats> {
    try {
      // Get today's stats
      const today = new Date().toISOString().split('T')[0];
      const { data: todayClicks } = await supabase
        .from('clicks')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', affiliateId)
        .gte('created_at', today);

      const { data: todayConversions } = await supabase
        .from('conversions')
        .select('commission_amount')
        .eq('affiliate_id', affiliateId)
        .gte('created_at', today);

      // Get this month's stats
      const monthStart = new Date();
      monthStart.setDate(1);
      const { data: monthClicks } = await supabase
        .from('clicks')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', affiliateId)
        .gte('created_at', monthStart.toISOString());

      const { data: monthConversions } = await supabase
        .from('conversions')
        .select('commission_amount')
        .eq('affiliate_id', affiliateId)
        .gte('created_at', monthStart.toISOString());

      // Get affiliate data
      const { data: affiliate } = await supabase
        .from('affiliates')
        .select('*')
        .eq('id', affiliateId)
        .single();

      const todayEarnings = todayConversions?.reduce((sum, c) => sum + c.commission_amount, 0) || 0;
      const monthEarnings = monthConversions?.reduce((sum, c) => sum + c.commission_amount, 0) || 0;

      return {
        todayClicks: todayClicks?.length || 0,
        todayConversions: todayConversions?.length || 0,
        todayEarnings,
        thisMonthClicks: monthClicks?.length || 0,
        thisMonthConversions: monthConversions?.length || 0,
        thisMonthEarnings: monthEarnings,
        allTimeClicks: affiliate?.lifetime_clicks || 0,
        allTimeConversions: affiliate?.lifetime_conversions || 0,
        allTimeEarnings: affiliate?.total_earnings || 0,
        pendingPayout: affiliate?.pending_earnings || 0,
        conversionRate: affiliate?.conversion_rate || 0,
        averageOrderValue: affiliate?.lifetime_conversions > 0
          ? (affiliate.total_earnings / affiliate.lifetime_conversions) * (100 / affiliate.commission_rate)
          : 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        todayClicks: 0,
        todayConversions: 0,
        todayEarnings: 0,
        thisMonthClicks: 0,
        thisMonthConversions: 0,
        thisMonthEarnings: 0,
        allTimeClicks: 0,
        allTimeConversions: 0,
        allTimeEarnings: 0,
        pendingPayout: 0,
        conversionRate: 0,
        averageOrderValue: 0
      };
    }
  }

  private async getRecentConversions(
    affiliateId: string,
    limit: number
  ): Promise<Conversion[]> {
    try {
      const { data, error } = await supabase
        .from('conversions')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent conversions:', error);
      return [];
    }
  }

  private async getTopProducts(
    affiliateId: string,
    limit: number
  ): Promise<ProductPerformance[]> {
    try {
      const { data, error } = await supabase.rpc('get_affiliate_top_products', {
        p_affiliate_id: affiliateId,
        p_limit: limit
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  }

  private async getMonthlyEarnings(
    affiliateId: string,
    months: number
  ): Promise<MonthlyEarning[]> {
    try {
      const { data, error } = await supabase.rpc('get_affiliate_monthly_earnings', {
        p_affiliate_id: affiliateId,
        p_months: months
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching monthly earnings:', error);
      return [];
    }
  }

  // ============== PAYOUTS ==============

  async requestPayout(request: PayoutRequest): Promise<Payout> {
    try {
      const affiliate = await this.getAffiliate(request.affiliateId);
      if (!affiliate) throw new Error('Affiliate not found');

      if (affiliate.pendingEarnings < request.amount) {
        throw new Error('Insufficient pending earnings');
      }

      // Create payout request
      const { data, error } = await supabase
        .from('payouts')
        .insert({
          affiliate_id: request.affiliateId,
          amount: request.amount,
          status: 'pending',
          method: request.method
        })
        .select()
        .single();

      if (error) throw error;

      // Update affiliate pending earnings
      await supabase
        .from('affiliates')
        .update({
          pending_earnings: affiliate.pendingEarnings - request.amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.affiliateId);

      return data;
    } catch (error) {
      console.error('Error requesting payout:', error);
      throw error;
    }
  }

  async getPayouts(affiliateId: string): Promise<Payout[]> {
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payouts:', error);
      return [];
    }
  }

  // ============== NOTIFICATIONS ==============

  private async createNotification(
    affiliateId: string,
    type: 'conversion' | 'payout' | 'tier_upgrade' | 'milestone',
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase.from('affiliate_notifications').insert({
        affiliate_id: affiliateId,
        type,
        title,
        message,
        data,
        read: false
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  async getNotifications(affiliateId: string): Promise<AffiliateNotification[]> {
    try {
      const { data, error } = await supabase
        .from('affiliate_notifications')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('affiliate_notifications')
        .update({ read: true })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  }
}

export const affiliateService = AffiliateService.getInstance();
