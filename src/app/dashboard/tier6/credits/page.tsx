// Credits Dashboard Page - ACTUAL IMPLEMENTATION
import { CreditDashboard } from '@/components/tier6/CreditDashboard';

export default function CreditsPage() {
  // In production, get userId from auth session
  const userId = 'temp-user-id'; // TODO: Replace with actual auth

  return (
    <div className="container mx-auto px-4 py-8">
      <CreditDashboard userId={userId} />
    </div>
  );
}
