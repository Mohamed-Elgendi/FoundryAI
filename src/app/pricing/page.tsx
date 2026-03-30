'use client';

import { useState } from 'react';
import { useAuth } from '@/layer-1-security/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Check, 
  Crown, 
  Zap, 
  Building2, 
  Sparkles,
  Loader2,
  ArrowRight
} from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Zap,
    color: 'from-slate-500 to-slate-600',
    features: [
      '5 plans per month',
      '2 refinements per plan',
      'Basic market research',
      'Community support',
      'Opportunity Radar access',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious entrepreneurs',
    icon: Crown,
    color: 'from-violet-500 to-indigo-600',
    features: [
      '50 plans per month',
      '10 refinements per plan',
      'Advanced market research',
      'Export to PDF & Markdown',
      'Priority email support',
      'Competitor analysis',
      'Revenue projections',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49',
    period: '/user/month',
    description: 'For teams & agencies',
    icon: Building2,
    color: 'from-amber-500 to-orange-600',
    features: [
      'Unlimited plans',
      'Unlimited refinements',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Priority phone support',
      'White-label options',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (planId === 'free') {
      router.push('/');
      return;
    }

    setLoadingPlan(planId);

    try {
      const priceId = planId === 'pro' 
        ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID 
        : process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID;

      if (!priceId) {
        alert('Stripe not configured. Please contact support.');
        return;
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user?.id,
          userEmail: user?.email,
          tier: planId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
        <div className="container px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">FoundryAI</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-slate-600">
            Start free, upgrade when you need more power. All plans include core features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isLoading = loadingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 transition-all hover:shadow-xl ${
                  plan.popular 
                    ? 'border-violet-500 shadow-lg scale-105 z-10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-violet-500' : 'text-slate-400'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ or Trust */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-slate-500 text-sm">
            All plans include secure data storage, 99.9% uptime SLA, and 24/7 support monitoring. 
            Cancel anytime, no questions asked.
          </p>
        </div>
      </main>
    </div>
  );
}
