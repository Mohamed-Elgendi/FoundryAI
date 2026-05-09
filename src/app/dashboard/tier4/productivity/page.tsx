import { Metadata } from 'next';
import { ProductivityOptimizer } from '@/components/tier4';

export const metadata: Metadata = {
  title: 'Productivity | FoundryAI',
  description: 'Optimize your work patterns based on your chronotype and track deep work sessions.',
};

export default function ProductivityPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <ProductivityOptimizer />
    </div>
  );
}
