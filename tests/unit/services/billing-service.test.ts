// @ts-nocheck
import { BillingService } from '@/layer-3-data/services/billing-service';

const mockSingle = jest.fn();

jest.mock('@/layer-3-data/supabase/client', () => ({
  createBrowserSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: mockSingle,
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
    })),
  })),
}));

describe('BillingService', () => {
  let service: BillingService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = BillingService.getInstance();
  });

  describe('getUserCredits', () => {
    it('should get user credits', async () => {
      mockSingle.mockResolvedValueOnce({
        data: {
          user_id: 'user-123',
          balance: 100,
          lifetime_earned: 200,
          lifetime_spent: 100,
        },
        error: null,
      });

      const result = await service.getUserCredits('user-123');

      expect(result).toBeDefined();
      expect(result?.balance).toBe(100);
    });
  });

  describe('calculateCredits', () => {
    it('should calculate credits for a feature', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' },
      });

      const result = await service.calculateCredits('plan_generation', 100, 200);

      expect(result.totalCredits).toBeGreaterThan(0);
      expect(result.breakdown.base).toBeGreaterThanOrEqual(1);
    });
  });

  describe('consumeCredits', () => {
    it('should reject when balance is insufficient', async () => {
      mockSingle.mockResolvedValueOnce({
        data: {
          user_id: 'user-123',
          balance: 10,
          lifetime_earned: 10,
          lifetime_spent: 0,
          auto_recharge_enabled: false,
        },
        error: null,
      });

      const result = await service.consumeCredits('user-123', 'plan_generation', 50);

      expect(result.success).toBe(false);
      expect(result.remainingBalance).toBe(10);
    });
  });
});
