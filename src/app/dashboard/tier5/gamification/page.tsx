// Gamification Dashboard Page - ACTUAL IMPLEMENTATION
import { GamificationDashboard } from '@/components/tier5/GamificationDashboard';

export default function GamificationPage() {
  // In production, get userId from auth session
  const userId = 'temp-user-id'; // TODO: Replace with actual auth

  return (
    <div className="container mx-auto px-4 py-8">
      <GamificationDashboard />
    </div>
  );
}
