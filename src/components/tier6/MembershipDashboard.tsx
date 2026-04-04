'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Coins, 
  CreditCard,
  CheckCircle2,
  Star,
  Zap,
  Infinity,
  Users,
  Shield,
  ArrowRight
} from 'lucide-react';

interface MembershipTier {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limits: {
    brainDumpsPerDay: number;
    focusSessionsPerDay: number;
    aiRequestsPerDay: number;
    storageMb: number;
  };
  isHighlighted?: boolean;
  badgeColor: string;
}

interface UserSubscription {
  tierId: string;
  status: string;
  billingInterval: string;
  currentPeriodEnd: string;
}

interface CoinBalance {
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  multiplier: number;
  dailyLoginStreak: number;
}

export default function MembershipDashboard() {
  const [activeTab, setActiveTab] = useState('tiers');
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [coins, setCoins] = useState<CoinBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMembershipData();
  }, []);

  const loadMembershipData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 700));
      
      setTiers([
        {
          id: '1',
          name: 'Free Forever',
          slug: 'free',
          description: 'Start with $0 and access core foundation systems',
          monthlyPrice: 0,
          annualPrice: 0,
          features: [
            'Brain Dump System',
            'Basic Focus Timer',
            'Emotion Check-ins',
            '7-Dimension Tracking',
            'Community Access',
          ],
          limits: {
            brainDumpsPerDay: 3,
            focusSessionsPerDay: 5,
            aiRequestsPerDay: 5,
            storageMb: 100,
          },
          badgeColor: 'bg-slate-100',
        },
        {
          id: '2',
          name: 'Builder',
          slug: 'builder',
          description: 'Accelerate your journey with enhanced AI assistance',
          monthlyPrice: 29,
          annualPrice: 290,
          features: [
            'All Free Features',
            'AI Build Assistant',
            'Opportunity Radar',
            'Template Gallery',
            'Priority Support',
            'Analytics Dashboard',
          ],
          limits: {
            brainDumpsPerDay: 10,
            focusSessionsPerDay: 20,
            aiRequestsPerDay: 50,
            storageMb: 1000,
          },
          badgeColor: 'bg-blue-100',
        },
        {
          id: '3',
          name: 'Founder',
          slug: 'founder',
          description: 'Full platform access for serious entrepreneurs',
          monthlyPrice: 79,
          annualPrice: 790,
          features: [
            'All Builder Features',
            'Unlimited AI Access',
            'White-glove Onboarding',
            '1-on-1 Coaching',
            'API Access',
            'Custom Integrations',
          ],
          limits: {
            brainDumpsPerDay: -1,
            focusSessionsPerDay: -1,
            aiRequestsPerDay: -1,
            storageMb: 10000,
          },
          isHighlighted: true,
          badgeColor: 'bg-violet-100',
        },
        {
          id: '4',
          name: 'Scale',
          slug: 'scale',
          description: 'For teams and businesses ready to scale',
          monthlyPrice: 199,
          annualPrice: 1990,
          features: [
            'All Founder Features',
            'Team Seats (5)',
            'Advanced Analytics',
            'Custom Workflows',
            'Dedicated Account Manager',
            'SLA Guarantee',
          ],
          limits: {
            brainDumpsPerDay: -1,
            focusSessionsPerDay: -1,
            aiRequestsPerDay: -1,
            storageMb: 100000,
          },
          badgeColor: 'bg-amber-100',
        },
      ]);

      setSubscription({
        tierId: '2',
        status: 'active',
        billingInterval: 'monthly',
        currentPeriodEnd: '2024-12-31T23:59:59Z',
      });

      setCoins({
        balance: 1250,
        lifetimeEarned: 3000,
        lifetimeSpent: 1750,
        multiplier: 1.5,
        dailyLoginStreak: 7,
      });
    } catch (error) {
      console.error('Error loading membership data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLimit = (limit: number) => limit === -1 ? 'Unlimited' : limit.toString();

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
          <Crown className="w-8 h-8 text-violet-600" />
          Membership & Coins
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Manage your subscription and Foundry Coins. Upgrade to unlock more features and faster growth.
        </p>
      </div>

      {/* Coin Balance Card */}
      {coins && (
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <Coins className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-amber-700">Foundry Coins</div>
                  <div className="text-4xl font-bold text-amber-900">{coins.balance.toLocaleString()}</div>
                  {coins.multiplier > 1 && (
                    <div className="text-sm text-amber-600">
                      {coins.multiplier}x Multiplier Active
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm text-amber-700">
                  Lifetime: {coins.lifetimeEarned.toLocaleString()} earned
                </div>
                <div className="text-sm text-amber-700">
                  {coins.lifetimeSpent.toLocaleString()} spent
                </div>
                <div className="flex items-center gap-1 text-amber-700">
                  <Zap className="w-4 h-4" />
                  {coins.dailyLoginStreak} day streak
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tiers">Membership Tiers</TabsTrigger>
          <TabsTrigger value="current">Current Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => {
              const isCurrentPlan = subscription?.tierId === tier.id;
              
              return (
                <Card 
                  key={tier.id}
                  className={`relative ${tier.isHighlighted ? 'ring-2 ring-violet-500 shadow-lg' : ''}`}
                >
                  {tier.isHighlighted && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-violet-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-emerald-600 text-white">Current</Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className={`p-2 rounded-lg inline-block ${tier.badgeColor}`}>
                      <Crown className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg mt-2">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold">${tier.monthlyPrice}</span>
                      <span className="text-slate-600">/month</span>
                      {tier.annualPrice > 0 && (
                        <div className="text-sm text-slate-500">
                          ${Math.round(tier.annualPrice / 12)}/month billed annually
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2 text-sm">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Brain Dumps</span>
                        <span className="font-medium">{formatLimit(tier.limits.brainDumpsPerDay)}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Focus Sessions</span>
                        <span className="font-medium">{formatLimit(tier.limits.focusSessionsPerDay)}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Requests</span>
                        <span className="font-medium">{formatLimit(tier.limits.aiRequestsPerDay)}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage</span>
                        <span className="font-medium">{tier.limits.storageMb >= 1000 ? `${tier.limits.storageMb / 1000}GB` : `${tier.limits.storageMb}MB`}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      variant={isCurrentPlan ? 'outline' : 'default'}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? 'Current Plan' : tier.monthlyPrice === 0 ? 'Get Started Free' : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="current">
          {subscription && (
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Manage your subscription details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {tiers.find(t => t.id === subscription.tierId)?.name}
                      </div>
                      <div className="text-sm text-slate-600 capitalize">
                        {subscription.billingInterval} billing
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 capitalize">
                    {subscription.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Current period ends</span>
                    <span className="font-medium">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">Change Plan</Button>
                  <Button variant="outline" className="flex-1">Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
