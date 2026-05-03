'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Crown, Zap, CheckCircle, Star } from 'lucide-react';

const PLANS = [
  { id: 'free', name: 'Free', price: 0, features: ['Basic features', '5 AI generations/day', 'Community support'] },
  { id: 'pro', name: 'Pro', price: 29, features: ['All Free features', 'Unlimited AI', 'Priority support', 'Advanced analytics'] },
  { id: 'enterprise', name: 'Enterprise', price: 99, features: ['All Pro features', 'Custom AI models', 'Dedicated support', 'API access'] },
];

export default function MembershipPage() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_membership_plan');
    if (saved) setCurrentPlan(saved);
  }, []);

  const upgrade = (planId) => {
    setCurrentPlan(planId);
    localStorage.setItem('foundryai_membership_plan', planId);
    toast({ title: `Upgraded to ${planId}!`, description: 'Welcome to your new plan' });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Membership</h1><p className="text-slate-600 dark:text-slate-400 mt-1">Manage your subscription and unlock premium features</p></div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={currentPlan === 'free' ? 'border-blue-500' : ''}>
          <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-slate-500"/>Free</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-slate-500">/mo</span></div>
            <ul className="space-y-2 text-sm">
              {PLANS[0].features.map((f, i) => <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/>{f}</li>)}
            </ul>
            <Button disabled={currentPlan === 'free'} variant={currentPlan === 'free' ? 'default' : 'outline'} className="w-full">{currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}</Button>
          </CardContent>
        </Card>
        <Card className={currentPlan === 'pro' ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-violet-200'}>
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-violet-500"/>Pro</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$29<span className="text-sm font-normal text-slate-500">/mo</span></div>
            <ul className="space-y-2 text-sm">
              {PLANS[1].features.map((f, i) => <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/>{f}</li>)}
            </ul>
            <Button onClick={() => upgrade('pro')} variant={currentPlan === 'pro' ? 'default' : 'outline'} className="w-full bg-violet-600 hover:bg-violet-700">{currentPlan === 'pro' ? 'Current Plan' : 'Upgrade'}</Button>
          </CardContent>
        </Card>
        <Card className={currentPlan === 'enterprise' ? 'border-yellow-500' : 'border-yellow-200'}>
          <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-500"/>Enterprise</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$99<span className="text-sm font-normal text-slate-500">/mo</span></div>
            <ul className="space-y-2 text-sm">
              {PLANS[2].features.map((f, i) => <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/>{f}</li>)}
            </ul>
            <Button onClick={() => upgrade('enterprise')} variant={currentPlan === 'enterprise' ? 'default' : 'outline'} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500">{currentPlan === 'enterprise' ? 'Current Plan' : 'Upgrade'}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
