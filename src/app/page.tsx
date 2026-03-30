'use client';

import { useEffect } from 'react';
import { useAuth } from '@/layer-1-security/auth';
import { useRouter } from 'next/navigation';
import { LandingPage } from './landing/LandingPage';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Authenticated users are redirected (return null while redirecting)
  return null;
}
