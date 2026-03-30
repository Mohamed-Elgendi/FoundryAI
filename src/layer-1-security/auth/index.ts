import { useAuth } from './auth-provider';

export { useAuth, AuthProvider } from './auth-provider';

// Convenience hooks for common auth patterns

/**
 * Hook for requiring authentication
 * Returns user or redirects to login
 */
export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  return {
    user,
    isLoading,
    isAuthenticated,
    isReady: !isLoading
  };
}

/**
 * Hook for accessing user tier
 */
export function useUserTier() {
  const { profile, isLoading } = useAuth();
  
  return {
    tier: profile?.tier || 'free',
    isLoading,
    isPaid: ['starter', 'pro', 'elite', 'legend'].includes(profile?.tier || '')
  };
}

/**
 * Hook for accessing user archetype
 */
export function useUserArchetype() {
  const { profile, user } = useAuth();
  
  return {
    archetype: profile?.archetype || null,
    userId: user?.id || null
  };
}
