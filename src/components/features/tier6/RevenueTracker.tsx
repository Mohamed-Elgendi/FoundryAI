'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target,
  Plus,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Wallet
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueStream {
  id: string;
  name: string;
  type: string;
  status: string;
  monthlyRevenue: number;
  monthlyTarget: number;
}

interface RevenueGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progressPercentage: number;
  targetDate: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  date: string;
  description: string;
}

export default function RevenueTracker() {
  const [activeTab, setActiveTab] = useState('overview');
  const [streams, setStreams] = useState<RevenueStream[]>([]);
  const [goals, setGoals] = useState<RevenueGoal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    mrr: 0,
    arr: 0,
    totalRevenue: 0,
    growthRate: 0,
  });

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStreams([
        { id: '1', name: 'SaaS Product', type: 'saas', status: 'active', monthlyRevenue: 2500, monthlyTarget: 5000 },
        { id: '2', name: 'AI Agency', type: 'services', status: 'active', monthlyRevenue: 3500, monthlyTarget: 4000 },
        { id: '3', name: 'Digital Products', type: 'product', status: 'active', monthlyRevenue: 800, monthlyTarget: 2000 },
      ]);

      setGoals([
        { id: '1', name: 'First $1K MRR', targetAmount: 1000, currentAmount: 1000, progressPercentage: 100, targetDate: '2024-06-01' },
        { id: '2', name: 'Reach $10K MRR', targetAmount: 10000, currentAmount: 6800, progressPercentage: 68, targetDate: '2024-12-31' },
        { id: '3', name: 'Annual $100K', targetAmount: 100000, currentAmount: 35000, progressPercentage: 35, targetDate: '2024-12-31' },
      ]);

      setTransactions([
        { id: '1', amount: 2500, type: 'recurring', date: '2024-01-15', description: 'SaaS Monthly Subscriptions' },
        { id: '2', amount: 3500, type: 'recurring', date: '2024-01-15', description: 'Agency Retainers' },
        { id: '3', amount: 800, type: 'one_time', date: '2024-01-10', description: 'Template Sales' },
        { id: '4', amount: 1500, type: 'one_time', date: '2024-01-08', description: 'Consulting Project' },
      ]);

      setChartData([
        { date: 'Jan', revenue: 4200, target: 5000 },
        { date: 'Feb', revenue: 5100, target: 5500 },
        { date: 'Mar', revenue: 5800, target: 6000 },
        { date: 'Apr', revenue: 6200, target: 6500 },
        { date: 'May', revenue: 6800, target: 7000 },
        { date: 'Jun', revenue: 6800, target: 7500 },
      ]);

      setStats({
        mrr: 6800,
        arr: 81600,
        totalRevenue: 35000,
        growthRate: 12.5,
      });
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setIsLoading(false);
    }
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
          <DollarSign className="w-8 h-8 text-violet-600" />
          Revenue Tracker
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Track your income across all streams. Monitor MRR, set goals, and celebrate milestones.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 mb-1">Monthly Recurring</div>
            <div className="text-2xl font-bold">${stats.mrr.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{stats.growthRate}% this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 mb-1">Annual Run Rate</div>
            <div className="text-2xl font-bold">${stats.arr.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Projected ARR</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-slate-500">All time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 mb-1">Active Streams</div>
            <div className="text-2xl font-bold">{streams.length}</div>
            <div className="text-xs text-slate-500">Revenue sources</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="streams">Streams</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} name="Actual" />
                    <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streams" className="space-y-4">
          <div className="grid gap-4">
            {streams.map((stream) => (
              <Card key={stream.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{stream.name}</div>
                      <div className="text-sm text-slate-600 capitalize">{stream.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${stream.monthlyRevenue.toLocaleString()}/mo</div>
                      <div className="text-xs text-slate-500">
                        Target: ${stream.monthlyTarget.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={(stream.monthlyRevenue / stream.monthlyTarget) * 100} 
                    className="mt-3 h-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Revenue Stream
          </Button>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <Badge className={goal.progressPercentage >= 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}>
                      {goal.progressPercentage}%
                    </Badge>
                  </div>
                  <CardDescription>
                    Target: ${goal.targetAmount.toLocaleString()} by {new Date(goal.targetDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={goal.progressPercentage} className="h-3" />
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-slate-600">Current: ${goal.currentAmount.toLocaleString()}</span>
                    <span className="text-slate-600">
                      {goal.progressPercentage >= 100 ? 'Achieved!' : `$${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-slate-600">
                        {new Date(transaction.date).toLocaleDateString()} • {transaction.type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">+${transaction.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Record Transaction
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
