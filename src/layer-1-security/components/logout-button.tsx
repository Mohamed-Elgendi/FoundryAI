'use client';

import { useAuth } from '@/layer-1-security/auth';

export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <button
      onClick={signOut}
      className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
    >
      Sign Out
    </button>
  );
}
