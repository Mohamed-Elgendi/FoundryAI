// @ts-nocheck
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/layer-1-security/auth/auth-provider';
import { ThemeProvider } from '@/lib/theme/theme-context';

// Mock Supabase
jest.mock('@/layer-3-data/supabase/client', () => ({
  createBrowserSupabaseClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  })),
}));

describe('AuthProvider', () => {
  it('should provide auth context', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('should initialize with user not authenticated', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </ThemeProvider>
    );

    const { isAuthenticated, isLoading, user } = useAuth();
    expect(isAuthenticated).toBe(false);
    expect(isLoading).toBe(false);
    expect(user).toBe(null);
  });
});

function TestComponent() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <div data-testid="auth-provider">
      <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not authenticated'}</span>
      <span data-testid="loading-status">{isLoading ? 'loading' : 'not loading'}</span>
    </div>
  );
}
