// @ts-nocheck
'use client';

import { useState } from 'react';
import { useAuth } from '@/layer-1-security/auth';

export function LogoutButton() {
  const { signOut } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmSignOut = () => {
    signOut();
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={handleSignOutClick}
        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
      >
        Sign Out
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Sign Out?</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Are you sure you want to sign out?</p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
