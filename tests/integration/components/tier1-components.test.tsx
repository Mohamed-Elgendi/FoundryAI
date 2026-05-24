// @ts-nocheck
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/lib/theme/theme-context';
import BrainDumpSystem from '@/components/features/tier1/BrainDumpSystem';
import ConfidenceCore from '@/components/features/tier1/ConfidenceCore';
import BeliefArchitecture from '@/components/features/tier1/BeliefArchitecture';

jest.mock('@/layer-3-data/services/tier1-service', () => ({
  brainDumpService: {
    getBrainDumpData: jest.fn().mockResolvedValue({ dumps: [], cognitiveLoad: 50 }),
    saveBrainDump: jest.fn(),
  },
  confidenceService: {
    getConfidenceData: jest.fn().mockResolvedValue({
      score: { overallScore: 72, level: 3 },
      domains: [],
      evidence: [],
    }),
    addEvidence: jest.fn(),
  },
  beliefService: {
    getBeliefData: jest.fn().mockResolvedValue({
      score: { overallScore: 60, level: 2 },
      pyramid: [],
      calibration: null,
    }),
    saveCalibration: jest.fn(),
  },
}));

describe('Tier 1 Components', () => {
  describe('BrainDumpSystem', () => {
    it('should render brain dump interface', async () => {
      render(
        <ThemeProvider>
          <BrainDumpSystem />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText(/Brain Dump System/i)).toBeInTheDocument();
      });
    });
  });

  describe('ConfidenceCore', () => {
    it('should render confidence tracking interface', async () => {
      render(
        <ThemeProvider>
          <ConfidenceCore />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText(/Domain-Specific Confidence/i)).toBeInTheDocument();
      });
    });
  });

  describe('BeliefArchitecture', () => {
    it('should render belief management interface', async () => {
      render(
        <ThemeProvider>
          <BeliefArchitecture />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText(/Belief Architecture/i)).toBeInTheDocument();
      });
    });
  });
});
