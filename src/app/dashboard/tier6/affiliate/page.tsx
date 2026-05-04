'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Users, DollarSign, TrendingUp, Copy, Gift } from 'lucide-react';

export default function AffiliatePage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralCode] = useState('FOUNDRY-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_referrals');
    if (saved) setReferrals(JSON.parse(saved));
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: 'Code copied!' });
  };

  const totalEarnings = referrals.reduce((sum, r) => sum + (r.earnings || 0), 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Affiliate Program</h1><p className="text-slate-600 dark:text-slate-400 mt-1">Refer others and earn 30% commission</p></div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4 text-blue-500"/>Referrals</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{referrals.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500"/>Earnings</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalEarnings}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-violet-500"/>Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">30%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Gift className="w-4 h-4 text-orange-500"/>Bonus</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">$50</div><p className="text-xs text-slate-500">Per 5 referrals</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Copy className="w-5 h-5"/>Your Referral Code</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Input value={referralCode} readOnly className="font-mono text-lg" />
          <Button onClick={copyCode}>Copy</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recent Referrals</h3>
        {referrals.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700"><CardContent className="p-8 text-center"><p className="text-slate-500">No referrals yet. Share your code!</p></CardContent></Card>
        ) : (
          referrals.map((ref) => (
            <Card key={ref.id}><CardContent className="p-4 flex justify-between items-center"><span>{ref.email}</span><span className="text-green-600 font-bold">+${ref.earnings}</span></CardContent></Card>
          ))
        )}
      </div>
    </div>
  );
}
