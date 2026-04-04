import { Metadata } from 'next';
import { SpacedRepetition } from '@/components/tier5';

export const metadata: Metadata = {
  title: 'Knowledge Review | FoundryAI',
  description: 'Spaced repetition system for long-term learning retention.',
};

export default function ReviewPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <SpacedRepetition />
    </div>
  );
}
