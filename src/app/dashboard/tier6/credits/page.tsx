'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Coins, TrendingUp, Gift, Zap, History } from 'lucide-react';

const TRANSACTIONS = [
  { id: 1, type: 'earned', amount: 100, description: 'Daily login bonus', date: '2026-05-01' },
  { id: 2, type: 'spent', amount: -50, description: 'AI generation', date: '2026-05-02' },
  { id: 3, type: 'earned', amount: 200, description: 'Referral bonus', date: '2026-05-03' },
];

export default function CreditsPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedBalance = localStorage.getItem('foundryai_credits_balance');
    const savedTransactions = localStorage.getItem('foundryai_credits_transactions');
    setBalance(savedBalance ? parseInt(savedBalance) : 1250);
    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : TRANSACTIONS);
  }, []);

  const earnDaily = () => {
    const newBalance = balance + 100;
    setBalance(newBalance);
    localStorage.setItem('foundryai_credits_balance', newBalance.toString());
    toast({ title: '+100 credits earned!', description: 'Daily login bonus' });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white">FoundryCoins</h1><p className="text-slate-600 dark:text-slate-400 mt-1">Platform credits for AI features and premium tools</p></div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Coins className="w-4 h-4 text-yellow-500"/>Balance</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-yellow-600">{balance}</div><p className="text-xs text-slate-500">Available credits</p></CardContent>
        </Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500"/>Earned</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500"/>Spent</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{Math.abs(transactions.filter(t => t.type === 'spent').reduce((sum, t) => sum + t.amount, 0))}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Gift className="w-4 h-4 text-violet-500"/>Daily</CardTitle></CardHeader><CardContent><Button onClick={earnDaily} size="sm" className="w-full">Claim 100</Button></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><History className="w-5 h-5"/>Transaction History</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div><p className="font-medium">{t.description}</p><p className="text-xs text-slate-400">{t.date}</p></div>
              <span className={`font-bold ${t.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>{t.amount > 0 ? '+' : ''}{t.amount}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
