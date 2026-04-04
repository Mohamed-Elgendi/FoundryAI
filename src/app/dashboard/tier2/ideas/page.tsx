import { Metadata } from 'next';
import IdeaExtractionEngineEnhanced from '@/components/tier2/IdeaExtractionEngineEnhanced';

export const metadata: Metadata = {
  title: 'Idea Extraction | FoundryAI',
  description: 'Transform vague ideas into concrete, validated business opportunities.',
};

export default function IdeaExtractionPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <IdeaExtractionEngineEnhanced />
    </div>
  );
}
