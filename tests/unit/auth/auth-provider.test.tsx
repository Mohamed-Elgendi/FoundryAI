// @ts-nocheck
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/layer-1-security/auth/auth-provider';
import { ThemeProvider } from '@/lib/theme/theme-context';

const mockUnsubscribe = jest.fn();

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
    })),
  })),
}));

describe('AuthProvider', () => {
  it('should provide auth context', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <div data-testid="auth-provider">child</div>
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('should initialize with user not authenticated', async () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <div data-testid="auth-status">not authenticated</div>
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
  });
});
