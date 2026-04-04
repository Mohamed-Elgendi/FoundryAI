'use client';

import React, { useState } from 'react';
import { useRevenueDashboard, useRevenueTransactions, useRevenueGoals, useRevenueAnalytics } from '@/hooks/useRevenue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  Plus,
  Filter
} from 'lucide-react';

export function RevenueDashboard() {
  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useRevenueDashboard();
  const { data: analytics, isLoading: analyticsLoading } = useRevenueAnalytics('month');
  const { goals, isLoading: goalsLoading } = useRevenueGoals();
  const [activeTab, setActiveTab] = useState('overview');

  if (dashboardLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-24 bg-slate-200 animate-pulse rounded mb-4" />
                <div className="h-8 w-20 bg-slate-200 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-700">Failed to load revenue data: {dashboardError}</p>
          <Button onClick={refetchDashboard} variant="outline" className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const growthRate = analytics?.growthRate || 0;
  const isPositiveGrowth = growthRate >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Revenue Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track your income streams and financial goals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetchDashboard}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Revenue
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(dashboard?.totalRevenue || 0)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{formatCurrency(dashboard?.mtdRevenue || 0)}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            {analytics && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                {isPositiveGrowth ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{Math.abs(growthRate).toFixed(1)}% vs last month</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Year to Date</p>
                <p className="text-2xl font-bold">{formatCurrency(dashboard?.ytdRevenue || 0)}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{dashboard?.totalTransactions || 0}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            {analytics && (
              <p className="text-sm text-muted-foreground mt-2">
                Avg: {formatCurrency(analytics.averageOrderValue)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Trend (30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboard?.dailyTrend && dashboard.dailyTrend.length > 0 ? (
                  <div className="h-64 flex items-end gap-2">
                    {dashboard.dailyTrend.map((day, idx) => {
                      const max = Math.max(...dashboard.dailyTrend.map(d => d.revenue));
                      const height = max > 0 ? (day.revenue / max) * 100 : 0;
                      return (
                        <div
                          key={idx}
                          className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-colors relative group"
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {new Date(day.date).toLocaleDateString()}: {formatCurrency(day.revenue)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No revenue data available yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revenue by Source */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue by Source</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboard?.revenueBySource && Object.keys(dashboard.revenueBySource).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(dashboard.revenueBySource)
                      .sort(([, a], [, b]) => b - a)
                      .map(([source, amount]) => {
                        const total = Object.values(dashboard.revenueBySource).reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? (amount / total) * 100 : 0;
                        return (
                          <div key={source}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="capitalize font-medium">{source}</span>
                              <span className="text-sm">{formatCurrency(amount)} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No revenue sources tracked yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="streams">
          <RevenueStreamsView />
        </TabsContent>

        <TabsContent value="goals">
          <RevenueGoalsView />
        </TabsContent>

        <TabsContent value="transactions">
          <RevenueTransactionsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RevenueStreamsView() {
  const { streams, isLoading } = useRevenueStreams();

  if (isLoading) {
    return <div className="text-center py-8">Loading streams...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {streams.map((stream) => (
        <Card key={stream.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{stream.name}</CardTitle>
              <Badge variant={stream.isActive ? 'default' : 'secondary'}>
                {stream.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground capitalize">{stream.streamType}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{stream.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="font-semibold">${stream.totalRevenue?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Customers</p>
                <p className="font-semibold">{stream.customerCount || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Transactions</p>
                <p className="font-semibold">{stream.totalTransactions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {streams.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="p-8 text-center">
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-muted-foreground">No revenue streams set up yet</p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Stream
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RevenueGoalsView() {
  const { goals, isLoading } = useRevenueGoals();

  if (isLoading) {
    return <div className="text-center py-8">Loading goals...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {goals.map((goal) => {
        const progress = goal.targetAmount > 0 
          ? Math.min(100, ((goal.currentAmount || 0) / goal.targetAmount) * 100) 
          : 0;
        
        return (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{goal.name}</CardTitle>
                <Badge 
                  variant={goal.status === 'achieved' ? 'default' : 'outline'}
                  className={goal.status === 'achieved' ? 'bg-green-500' : ''}
                >
                  {goal.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground capitalize">{goal.goalType} Goal</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="font-semibold">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current: ${goal.currentAmount?.toLocaleString() || 0}</span>
                <span className="font-medium">Target: ${goal.targetAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {goals.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-muted-foreground">No revenue goals set yet</p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Set Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RevenueTransactionsView() {
  const { transactions, isLoading, loadMore, total } = useRevenueTransactions({ limit: 20 });

  if (isLoading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions ({total})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${tx.transactionType === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {tx.transactionType === 'income' ? (
                    <ArrowUpRight className={`w-4 h-4 ${tx.transactionType === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{tx.description || tx.source}</p>
                  <p className="text-xs text-muted-foreground capitalize">{tx.source} • {new Date(tx.transactionDate || '').toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.transactionType === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.transactionType === 'income' ? '+' : '-'}${Math.abs(tx.amount || 0).toFixed(2)}
                </p>
                <Badge variant="outline" className="text-xs capitalize">
                  {tx.paymentStatus}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {transactions.length < total && (
          <Button variant="outline" className="w-full mt-4" onClick={loadMore}>
            Load More
          </Button>
        )}

        {transactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No transactions recorded yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RevenueDashboard;
