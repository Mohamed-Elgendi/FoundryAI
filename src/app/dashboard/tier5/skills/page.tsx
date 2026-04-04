import { Metadata } from 'next';
import { SkillMatrix } from '@/components/tier5';

export const metadata: Metadata = {
  title: 'Skill Matrix | FoundryAI',
  description: 'Track your skills across all domains. Identify gaps and set targets.',
};

export default function SkillsPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <SkillMatrix />
    </div>
  );
}
