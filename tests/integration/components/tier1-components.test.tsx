// @ts-nocheck
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/lib/theme/theme-context';
import { BrainDumpSystem } from '@/components/tier1/BrainDumpSystem';
import { ConfidenceCore } from '@/components/tier1/ConfidenceCore';
import { BeliefArchitecture } from '@/components/tier1/BeliefArchitecture';

// Mock Supabase
jest.mock('@/layer-3-data/supabase/client', () => ({
  createBrowserSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: { code: 'PGRST116' }
          })),
        })),
      })),
    })),
  })),
}));

describe('Tier 1 Components', () => {
  describe('BrainDumpSystem', () => {
    it('should render brain dump interface', () => {
      render(
        <ThemeProvider>
          <BrainDumpSystem />
        </ThemeProvider>
      );

      expect(screen.getByText(/Brain Dump/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add Item/i })).toBeInTheDocument();
    });
  });

  describe('ConfidenceCore', () => {
    it('should render confidence tracking interface', () => {
      render(
        <ThemeProvider>
          <ConfidenceCore />
        </ThemeProvider>
      );

      expect(screen.getByText(/Confidence/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('BeliefArchitecture', () => {
    it('should render belief management interface', () => {
      render(
        <ThemeProvider>
          <BeliefArchitecture />
        </ThemeProvider>
      );

      expect(screen.getByText(/Belief/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Belief/i })).toBeInTheDocument();
    });
  });
});
