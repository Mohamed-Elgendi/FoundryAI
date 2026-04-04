'use client';

import { useState, useEffect } from 'react';
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
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  conversionRate: number;
  currentTier: number;
  affiliateCode: string;
  referralLink: string;
}

interface Conversion {
  id: string;
  customerEmail: string;
  orderValue: number;
  commissionAmount: number;
  status: string;
  convertedAt: string;
}

export default function AffiliateDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [chartData, setChartData] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 700));
      
      setStats({
        totalClicks: 342,
        totalConversions: 18,
        totalEarnings: 1560,
        pendingEarnings: 420,
        paidEarnings: 1140,
        conversionRate: 5.26,
        currentTier: 2,
        affiliateCode: 'FA7X9K2M',
        referralLink: 'https://foundryai.com/signup?ref=FA7X9K2M',
      });

      setConversions([
        { id: '1', customerEmail: 'user1@example.com', orderValue: 79, commissionAmount: 23.70, status: 'approved', convertedAt: '2024-01-15' },
        { id: '2', customerEmail: 'user2@example.com', orderValue: 199, commissionAmount: 59.70, status: 'pending', convertedAt: '2024-01-14' },
        { id: '3', customerEmail: 'user3@example.com', orderValue: 29, commissionAmount: 8.70, status: 'approved', convertedAt: '2024-01-12' },
        { id: '4', customerEmail: 'user4@example.com', orderValue: 79, commissionAmount: 23.70, status: 'paid', convertedAt: '2024-01-10' },
      ]);

      setChartData([
        { date: 'Week 1', clicks: 45, conversions: 2, earnings: 60 },
        { date: 'Week 2', clicks: 52, conversions: 3, earnings: 90 },
        { date: 'Week 3', clicks: 48, conversions: 4, earnings: 120 },
        { date: 'Week 4', clicks: 61, conversions: 5, earnings: 150 },
        { date: 'Week 5', clicks: 58, conversions: 2, earnings: 60 },
        { date: 'Week 6', clicks: 78, conversions: 2, earnings: 60 },
      ]);
    } catch (error) {
      console.error('Error loading affiliate data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTierName = (tier: number) => {
    const tiers = ['Starter', 'Pro', 'Elite', 'Legendary'];
    return tiers[tier - 1] || 'Starter';
  };

  const getTierCommission = (tier: number) => {
    const rates = [30, 35, 40, 50];
    return rates[tier - 1] || 30;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
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
          Refer others to FoundryAI and earn {getTierCommission(stats?.currentTier || 1)}% commission on their subscriptions.
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
