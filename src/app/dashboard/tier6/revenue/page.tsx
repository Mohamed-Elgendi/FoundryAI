import { Metadata } from 'next';
import { RevenueTracker } from '@/components/tier6';

export const metadata: Metadata = {
  title: 'Revenue | FoundryAI',
  description: 'Track your income across all streams. Monitor MRR, set goals, and celebrate milestones.',
};

export default function RevenuePage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <RevenueTracker />
    </div>
  );
}
