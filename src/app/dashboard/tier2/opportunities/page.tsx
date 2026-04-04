import { Metadata } from 'next';
import OpportunityRadarEnhanced from '@/components/tier2/OpportunityRadarEnhanced';

export const metadata: Metadata = {
  title: 'Opportunity Radar | FoundryAI',
  description: 'AI-powered market intelligence scanning 12 business archetypes for validated opportunities.',
};

export default function OpportunityRadarPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <OpportunityRadarEnhanced />
    </div>
  );
}
