'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  Gift,
  TrendingUp,
  History,
  Zap,
  Calendar,
  Award,
  Star,
  Sparkles
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CoinTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
  multiplierApplied?: number;
}

interface Redemption {
  id: string;
  type: string;
  coinsSpent: number;
  valueReceived: number;
  description: string;
  redeemedAt: string;
}

export default function CoinsWallet() {
  const [activeTab, setActiveTab] = useState('balance');
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState({
    lifetimeEarned: 0,
    lifetimeSpent: 0,
    multiplier: 1,
    dailyStreak: 0,
  });
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCoinData();
  }, []);

  const loadCoinData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setBalance(1250);
      setStats({
        lifetimeEarned: 3000,
        lifetimeSpent: 1750,
        multiplier: 1.5,
        dailyStreak: 7,
      });

      setTransactions([
        { id: '1', amount: 100, type: 'login_bonus', description: 'Daily login bonus', createdAt: '2024-01-20', multiplierApplied: 1.5 },
        { id: '2', amount: 50, type: 'streak_bonus', description: '7-day streak bonus', createdAt: '2024-01-20' },
        { id: '3', amount: 250, type: 'achievement', description: 'Unlocked: First Dollar', createdAt: '2024-01-19' },
        { id: '4', amount: -500, type: 'redemption', description: 'Subscription discount', createdAt: '2024-01-15' },
        { id: '5', amount: 150, type: 'referral', description: 'Referral bonus: user123', createdAt: '2024-01-14' },
      ]);

      setRedemptions([
        { id: '1', type: 'subscription_discount', coinsSpent: 500, valueReceived: 25, description: '1 month free on Builder plan', redeemedAt: '2024-01-15' },
      ]);
    } catch (error) {
      console.error('Error loading coin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      login_bonus: Calendar,
      streak_bonus: Zap,
      achievement: Award,
      redemption: Gift,
      referral: TrendingUp,
    };
    return icons[type] || Coins;
  };

  const getTransactionColor = (type: string) => {
    const colors: Record<string, string> = {
      login_bonus: 'text-blue-600 bg-blue-100',
      streak_bonus: 'text-amber-600 bg-amber-100',
      achievement: 'text-purple-600 bg-purple-100',
      redemption: 'text-rose-600 bg-rose-100',
      referral: 'text-emerald-600 bg-emerald-100',
    };
    return colors[type] || 'text-slate-600 bg-slate-100';
  };

  const redemptionOptions = [
    { type: 'subscription_discount', name: '1 Month Free', description: 'Get 1 month free on any plan', coinsCost: 500, value: 29 },
    { type: 'feature_unlock', name: 'Premium Feature', description: 'Unlock any premium feature for 30 days', coinsCost: 300, value: 15 },
    { type: 'coaching_session', name: 'Coaching Session', description: '30-min 1-on-1 coaching session', coinsCost: 1000, value: 50 },
  ];

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
          <Coins className="w-8 h-8 text-amber-500" />
          Foundry Coins
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Earn coins through daily activity, achievements, and referrals. Redeem for premium benefits.
        </p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-amber-200">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-amber-700 mb-2">Current Balance</div>
              <div className="text-6xl font-bold text-amber-900">{balance.toLocaleString()}</div>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700">
                  {stats.multiplier}x Multiplier Active
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-900">{stats.lifetimeEarned.toLocaleString()}</div>
                <div className="text-sm text-amber-700">Lifetime Earned</div>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-900">{stats.lifetimeSpent.toLocaleString()}</div>
                <div className="text-sm text-amber-700">Lifetime Spent</div>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-900">{stats.dailyStreak}</div>
                <div className="text-sm text-amber-700">Day Streak</div>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-900">{transactions.length}</div>
                <div className="text-sm text-amber-700">Transactions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="redeem">Redeem</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How to Earn Coins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Daily Login</div>
                      <div className="text-sm text-slate-600">Log in every day</div>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">+100 coins</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium">Streak Bonus</div>
                      <div className="text-sm text-slate-600">Maintain daily streaks</div>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">+50 coins</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Achievements</div>
                      <div className="text-sm text-slate-600">Unlock milestones</div>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">+100-2500 coins</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium">Referrals</div>
                      <div className="text-sm text-slate-600">Refer new users</div>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">+150 coins</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redeem" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {redemptionOptions.map((option) => (
              <Card key={option.type} className={balance < option.coinsCost ? 'opacity-60' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">{option.name}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-500" />
                    <span className="text-2xl font-bold">{option.coinsCost}</span>
                    <span className="text-slate-600">coins</span>
                  </div>
                  <div className="text-sm text-emerald-600">
                    ${option.value} value
                  </div>
                  <Button 
                    className="w-full"
                    disabled={balance < option.coinsCost}
                  >
                    {balance < option.coinsCost ? 'Insufficient Coins' : 'Redeem'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type);
                  const colorClass = getTransactionColor(transaction.type);
                  
                  return (
                    <div 
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-slate-600">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                            {transaction.multiplierApplied && (
                              <span className="ml-2 text-amber-600">
                                {transaction.multiplierApplied}x multiplier
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold ${transaction.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
