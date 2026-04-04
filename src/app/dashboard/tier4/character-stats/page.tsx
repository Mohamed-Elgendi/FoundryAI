import { Metadata } from 'next';
import { CharacterStatsDashboard } from '@/components/tier4';

export const metadata: Metadata = {
  title: 'Character Stats | FoundryAI',
  description: 'Track your 7 core attributes, level up your founder character, and unlock achievements.',
};

export default function CharacterStatsPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <CharacterStatsDashboard />
    </div>
  );
}
