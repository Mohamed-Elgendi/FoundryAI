import { Metadata } from 'next';
import { AffiliateDashboard } from '@/components/tier6';

export const metadata: Metadata = {
  title: 'Affiliate | FoundryAI',
  description: 'Refer others to FoundryAI and earn commission on their subscriptions.',
};

export default function AffiliatePage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <AffiliateDashboard />
    </div>
  );
}
