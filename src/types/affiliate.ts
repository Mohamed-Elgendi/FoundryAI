// Affiliate Marketplace Types - ACTUAL IMPLEMENTATION
// Beast Mode - Production Ready

export interface Affiliate {
  id: string;
  userId: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  commissionRate: number;
  referralCode: string;
  totalEarnings: number;
  pendingEarnings: number;
  lifetimeClicks: number;
  lifetimeConversions: number;
  conversionRate: number;
  stripeConnectAccountId?: string;
  status: 'active' | 'suspended' | 'terminated';
  createdAt: Date;
  updatedAt: Date;
}

export interface AffiliateTier {
  id: string;
  name: 'bronze' | 'silver' | 'gold' | 'platinum';
  displayName: string;
  minConversions: number;
  commissionRate: number;
  benefits: string[];
  color: string;
}

export interface Conversion {
  id: string;
  affiliateId: string;
  orderId: string;
  customerId: string;
  productId: string;
  productName: string;
  productPrice: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  cookieId?: string;
  clickId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  approvedAt?: Date;
  paidAt?: Date;
}

export interface AffiliateLink {
  id: string;
  affiliateId: string;
  productId: string;
  url: string;
  shortUrl?: string;
  clicks: number;
  conversions: number;
  earnings: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Click {
  id: string;
  affiliateId: string;
  linkId: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  country?: string;
  converted: boolean;
  conversionId?: string;
  createdAt: Date;
}

export interface AffiliateDashboard {
  affiliate: Affiliate;
  stats: AffiliateStats;
  recentConversions: Conversion[];
  topProducts: ProductPerformance[];
  monthlyEarnings: MonthlyEarning[];
}

export interface AffiliateStats {
  todayClicks: number;
  todayConversions: number;
  todayEarnings: number;
  thisMonthClicks: number;
  thisMonthConversions: number;
  thisMonthEarnings: number;
  allTimeClicks: number;
  allTimeConversions: number;
  allTimeEarnings: number;
  pendingPayout: number;
  conversionRate: number;
  averageOrderValue: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  clicks: number;
  conversions: number;
  earnings: number;
  conversionRate: number;
}

export interface MonthlyEarning {
  month: string;
  clicks: number;
  conversions: number;
  earnings: number;
}

export interface Payout {
  id: string;
  affiliateId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'stripe' | 'paypal' | 'bank_transfer' | 'crypto';
  stripeTransferId?: string;
  processedAt?: Date;
  createdAt: Date;
}

export interface PayoutRequest {
  affiliateId: string;
  amount: number;
  method: 'stripe' | 'paypal' | 'bank_transfer';
  notes?: string;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  commissionRate: number;
  commissionAmount: number;
  imageUrl?: string;
  category: string;
  tags: string[];
  active: boolean;
  createdAt: Date;
}

export interface MarketplaceListing {
  product: AffiliateProduct;
  topAffiliates: Affiliate[];
  totalSales: number;
  totalRevenue: number;
  averageCommission: number;
}

export interface ReferralTree {
  affiliateId: string;
  level: number;
  earnings: number;
  subAffiliates: ReferralTree[];
}

export interface TwoTierCommission {
  primaryAffiliateId: string;
  subAffiliateId: string;
  conversionId: string;
  primaryCommission: number;
  subCommission: number;
  tier: number;
  createdAt: Date;
}

export interface AffiliateNotification {
  id: string;
  affiliateId: string;
  type: 'conversion' | 'payout' | 'tier_upgrade' | 'milestone';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}
