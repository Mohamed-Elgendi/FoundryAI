'use client';

import { useEffect, useState, Suspense } from 'react';
import { DashboardProvider, DashboardShell } from '@/lib/layers/frontend-layer';
import { useAuth } from '@/lib/auth/auth-context';
import { supabase } from '@/lib/db/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  User, 
  Mail, 
  CreditCard, 
  Crown, 
  Loader2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  email: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  createdAt: string;
}

function SettingsContent() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Show success/error messages from URL params
  useEffect(() => {
    if (success) {
      setMessage({ type: 'success', text: 'Subscription updated successfully!' });
    } else if (canceled) {
      setMessage({ type: 'error', text: 'Subscription update was canceled.' });
    }
  }, [success, canceled]);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        // Get user profile from Supabase
        let userData = null;
        let queryError = null;

        if (supabase) {
          const result = await supabase
            .from('users')
            .select('subscription_tier, subscription_status, created_at')
            .eq('id', user.id)
            .single();
          
          if (result) {
            userData = result.data;
            queryError = result.error;
          }
        }

        if (queryError) {
          console.error('Error loading profile:', queryError);
          // Use defaults if error
          setProfile({
            email: user.email || '',
            subscriptionTier: 'free',
            subscriptionStatus: 'active',
            createdAt: user.created_at || new Date().toISOString(),
          });
        } else {
          setProfile({
            email: user.email || '',
            subscriptionTier: userData?.subscription_tier || 'free',
            subscriptionStatus: userData?.subscription_status || 'active',
            createdAt: userData?.created_at || new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const openBillingPortal = async () => {
    if (!user) return;

    setIsPortalLoading(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If no billing account, redirect to pricing
        router.push('/pricing');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal');
    } finally {
      setIsPortalLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  const isPro = profile.subscriptionTier === 'pro';
  const isEnterprise = profile.subscriptionTier === 'enterprise';
  const isPaid = isPro || isEnterprise;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-600 mt-1">Manage your account and subscription</p>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-slate-400" />
          Profile
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4" />
              {profile.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Member Since
            </label>
            <p className="text-slate-600">
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-slate-400" />
          Subscription
        </h3>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold text-slate-900 capitalize">
                {profile.subscriptionTier}
              </span>
              {isPaid && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  profile.subscriptionStatus === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {profile.subscriptionStatus}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              {isPaid 
                ? 'You have access to all premium features'
                : 'Upgrade to unlock more features'
              }
            </p>
          </div>

          {isPaid ? (
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-slate-400" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          {isPaid ? (
            <button
              onClick={openBillingPortal}
              disabled={isPortalLoading}
              className="w-full py-2.5 px-4 bg-slate-100 text-slate-900 font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPortalLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Manage Billing
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <Link
              href="/pricing"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Pro
            </Link>
          )}

          {!isEnterprise && (
            <Link
              href="/pricing"
              className="block w-full py-2.5 px-4 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-center"
            >
              {isPaid ? 'Change Plan' : 'View All Plans'}
            </Link>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Plan Features</h3>
        
        <ul className="space-y-3">
          {[
            { name: 'Plans per month', value: isEnterprise ? 'Unlimited' : isPro ? '50' : '5' },
            { name: 'Refinements per plan', value: isEnterprise ? 'Unlimited' : isPro ? '10' : '2' },
            { name: 'Export options', value: isPaid ? 'PDF, Markdown, JSON' : 'JSON only' },
            { name: 'Support', value: isEnterprise ? 'Priority phone' : isPro ? 'Email' : 'Community' },
          ].map((item, i) => (
            <li key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-slate-600">{item.name}</span>
              <span className="font-medium text-slate-900">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sign Out Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Account Session</h3>
        <p className="text-sm text-slate-500 mb-4">
          Sign out of your account on this device.
        </p>
        <button
          onClick={() => {
            const event = new CustomEvent('settings-signout');
            window.dispatchEvent(event);
          }}
          className="w-full py-2.5 px-4 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Listen for sign out event from SettingsContent
  useEffect(() => {
    const handleSettingsSignOut = () => {
      handleSignOut();
    };
    window.addEventListener('settings-signout', handleSettingsSignOut);
    return () => window.removeEventListener('settings-signout', handleSettingsSignOut);
  }, []);

  return (
    <DashboardProvider>
      <DashboardShell 
        user={user ? { name: user.user_metadata?.name || user.email?.split('@')[0] || 'User', email: user.email || '', role: 'Member' } : undefined}
        onSignOut={handleSignOut}
      >
        <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
          <SettingsContent />
        </Suspense>
      </DashboardShell>
    </DashboardProvider>
  );
}
