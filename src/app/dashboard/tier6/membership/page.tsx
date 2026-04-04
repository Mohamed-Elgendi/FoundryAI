import { Metadata } from 'next';
import { MembershipDashboard } from '@/components/tier6';

export const metadata: Metadata = {
  title: 'Membership | FoundryAI',
  description: 'Manage your subscription and Foundry Coins. Upgrade to unlock more features.',
};

export default function MembershipPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <MembershipDashboard />
    </div>
  );
}
