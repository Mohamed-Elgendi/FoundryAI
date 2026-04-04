import { Metadata } from 'next';
import { AffirmationJournaling } from '@/components/tier1';

export const metadata: Metadata = {
  title: 'Affirmation & Journaling | FoundryAI',
  description: 'Morning and evening rituals for mind-body-soul alignment. Evidence-based affirmations and reflective journaling.',
};

export default function JournalPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <AffirmationJournaling />
    </div>
  );
}
