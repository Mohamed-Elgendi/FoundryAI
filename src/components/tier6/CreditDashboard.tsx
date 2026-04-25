'use client';

import { useState } from 'react';
import { useCredits } from '@/hooks/useCredits';
import { Coins, TrendingUp, ShoppingCart, AlertCircle, Zap, CreditCard, Receipt } from 'lucide-react';

interface CreditDashboardProps {
  userId: string;
}

const CREDIT_PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 1000, price: 9.99, bonus: 0 },
  { id: 'pro', name: 'Pro', credits: 5000, price: 39.99, bonus: 500, popular: true },
  { id: 'enterprise', name: 'Enterprise', credits: 20000, price: 99.99, bonus: 3000 }
];

export function CreditDashboard({ userId }: CreditDashboardProps) {
  const { credits, transactions, stats, loading, error, refresh } = useCredits(userId);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="credit-loading p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="credit-error p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading credits: {error}</p>
        <button
          onClick={refresh}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <ShoppingCart className="w-5 h-5 text-green-500" />;
      case 'usage': return <Zap className="w-5 h-5 text-orange-500" />;
      case 'bonus': return <Coins className="w-5 h-5 text-yellow-500" />;
      case 'refund': return <Receipt className="w-5 h-5 text-blue-500" />;
      default: return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="credit-dashboard space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-500" />
          Credits & Billing
        </h2>
        <button
          onClick={() => setShowPurchaseModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Buy Credits
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Available Credits</p>
            <p className="text-5xl font-bold">{credits?.balance?.toLocaleString() || 0}</p>
          </div>
          <div className="text-right">
            <p className="text-orange-100 text-sm">Lifetime Earned</p>
            <p className="text-2xl font-semibold">
              {credits?.lifetimeEarned?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Low Balance Warning */}
        {(credits?.balance || 0) < 100 && (
          <div className="mt-4 p-3 bg-red-500 bg-opacity-50 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">
              Your balance is low. Purchase more credits to continue using AI features.
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-blue-900">This Month</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{stats?.totalCalls || 0}</p>
          <p className="text-sm text-blue-600">API Calls</p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-orange-900">Credits Used</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">{stats?.totalCredits || 0}</p>
          <p className="text-sm text-orange-600">This Month</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-green-900">Lifetime Spent</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {credits?.lifetimeSpent?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-green-600">Total Credits</p>
        </div>
      </div>

      {/* Usage Breakdown */}
      {stats && Object.keys(stats.byFeature).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Usage by Feature</h3>
          <div className="space-y-3">
            {Object.entries(stats.byFeature).map(([feature, data]) => (
              <div key={feature} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {feature.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {data.calls} calls • {data.credits} credits
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (data.credits / (stats.totalCredits || 1)) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {transactions.slice(0, 10).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getTransactionIcon(tx.type)}
                <div>
                  <p className="font-medium text-gray-900 capitalize">{tx.type}</p>
                  <p className="text-sm text-gray-500">{tx.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Purchase Credits</h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {CREDIT_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPackage === pkg.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{pkg.name}</h4>
                        {pkg.popular && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">
                        {pkg.credits.toLocaleString()} credits
                      </p>
                      {pkg.bonus > 0 && (
                        <p className="text-green-600 text-sm">
                          +{pkg.bonus.toLocaleString()} bonus credits
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${pkg.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                // TODO: Integrate with Stripe
                console.log('Purchase:', selectedPackage);
                setShowPurchaseModal(false);
              }}
              disabled={!selectedPackage}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
