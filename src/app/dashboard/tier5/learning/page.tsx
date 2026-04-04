import { Metadata } from 'next';
import { LearningPathManager } from '@/components/tier5';

export const metadata: Metadata = {
  title: 'Learning Paths | FoundryAI',
  description: 'Structured learning paths for each business archetype. Master the skills you need.',
};

export default function LearningPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <LearningPathManager />
    </div>
  );
}
