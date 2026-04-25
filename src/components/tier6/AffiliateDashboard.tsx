// @ts-nocheck
'use client';

import { useState } from 'react';
import { useAffiliate } from '@/hooks/useAffiliate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  MousePointer,
  TrendingUp,
  Copy,
  Share2,
  Award,
  Link,
  BarChart3,
  Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AffiliateDashboardProps {
  userId: string;
}

export default function AffiliateDashboard({ userId }: AffiliateDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const { affiliate, dashboard, links, payouts, loading, error, createLink, requestPayout } = useAffiliate(userId);

  const copyLink = () => {
    if (affiliate?.referral_code) {
      const link = `${process.env.NEXT_PUBLIC_APP_URL || 'https://foundryai-seven.vercel.app'}/signup?ref=${affiliate.referral_code}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTierName = (tier: string) => {
    const tiers: Record<string, string> = {
      'bronze': 'Bronze Partner',
      'silver': 'Silver Partner', 
      'gold': 'Gold Partner',
      'platinum': 'Platinum Partner'
    };
    return tiers[tier] || 'Bronze Partner';
  };

  const getTierCommission = (rate: number) => {
    return rate || 10;
  };

  const stats = dashboard?.stats;
  const conversions = dashboard?.recentConversions || [];
  const chartData = dashboard?.monthlyEarnings?.map((m: any) => ({
    date: m.month,
    clicks: m.clicks,
    conversions: m.conversions,
    earnings: m.earnings
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading affiliate data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-violet-600" />
          Affiliate Program
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Refer others to FoundryAI and earn {getTierCommission(affiliate?.commission_rate || 10)}% commission on their subscriptions.
        </p>
      </div>

      {/* Referral Link Card */}
      {stats && (
        <Card className="bg-gradient-to-r from-violet-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-violet-700 mb-1">Your Referral Link</div>
                <div className="font-mono text-sm bg-white p-3 rounded border break-all">
                  {stats.referralLink}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={copyLink} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Total Clicks</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalClicks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Conversions</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalConversions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Conversion Rate</span>
              </div>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Total Earnings</span>
              </div>
              <div className="text-2xl font-bold">${stats.totalEarnings}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tier Progress */}
      {stats && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Current Tier: {getTierName(stats.currentTier)}
                </CardTitle>
                <CardDescription>
                  {getTierCommission(stats.currentTier)}% commission rate
                </CardDescription>
              </div>
              <Badge className="bg-amber-100 text-amber-800">
                Tier {stats.currentTier}/4
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Next Tier: {getTierName(stats.currentTier + 1)}</span>
                <span className="text-slate-600">
                  {stats.totalConversions}/25 referrals for next tier
                </span>
              </div>
              <Progress value={(stats.totalConversions / 25) * 100} className="h-3" />
              <p className="text-sm text-slate-600">
                Refer 25 people to unlock {getTierName(stats.currentTier + 1)} tier with {getTierCommission(stats.currentTier + 1)}% commission
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Performance</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#8b5cf6" name="Clicks" />
                    <Line yAxisId="left" type="monotone" dataKey="conversions" stroke="#10b981" name="Conversions" />
                    <Line yAxisId="right" type="monotone" dataKey="earnings" stroke="#f59e0b" name="Earnings ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversions.map((conversion) => (
                  <div 
                    key={conversion.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">{conversion.customerEmail}</div>
                      <div className="text-sm text-slate-600">
                        {new Date(conversion.convertedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">+${conversion.commissionAmount.toFixed(2)}</div>
                      <Badge 
                        variant="outline" 
                        className={
                          conversion.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          conversion.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }
                      >
                        {conversion.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings">
          {stats && (
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-slate-600">Pending</div>
                      <div className="text-2xl font-bold text-amber-600">${stats.pendingEarnings}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Paid</div>
                      <div className="text-2xl font-bold text-emerald-600">${stats.paidEarnings}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Total</div>
                      <div className="text-2xl font-bold">${stats.totalEarnings}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button className="w-full" size="lg">
                Request Payout
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
