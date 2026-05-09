import { Metadata } from 'next';
import { SelfDiscoveryAssessment } from '@/components/tier4';

export const metadata: Metadata = {
  title: 'Self Discovery | FoundryAI',
  description: 'Scientific assessments to discover your entrepreneurial DNA and optimal business fit.',
};

export default function SelfDiscoveryPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <SelfDiscoveryAssessment />
    </div>
  );
}
