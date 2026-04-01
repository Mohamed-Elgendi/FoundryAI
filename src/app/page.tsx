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

  // Show landing page immediately - no loading delay
  // Auth check happens in background, redirect if already logged in
  if (isAuthenticated && !isLoading) {
    return null; // Will redirect
  }

  return <LandingPage />;
}
