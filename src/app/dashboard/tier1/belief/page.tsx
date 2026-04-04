import { Metadata } from 'next';
import { BeliefArchitecture } from '@/components/tier1';

export const metadata: Metadata = {
  title: 'Belief Architecture | FoundryAI',
  description: 'Build unshakeable belief through evidence-based confidence. Track your belief scores and evidence stack.',
};

export default function BeliefPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <BeliefArchitecture />
    </div>
  );
}
