import { Metadata } from 'next';
import { CoinsWallet } from '@/components/tier6';

export const metadata: Metadata = {
  title: 'Foundry Coins | FoundryAI',
  description: 'Earn coins through daily activity, achievements, and referrals. Redeem for premium benefits.',
};

export default function CoinsPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <CoinsWallet />
    </div>
  );
}
