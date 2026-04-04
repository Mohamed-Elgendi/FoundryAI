import { Metadata } from 'next';
import { SuccessMindsetForge } from '@/components/tier1';

export const metadata: Metadata = {
  title: 'Success Mindset Forge | FoundryAI',
  description: 'Master the 7 pillars of success mindset through the 4-week Infinite Growth Protocol.',
};

export default function MindsetPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <SuccessMindsetForge />
    </div>
  );
}
