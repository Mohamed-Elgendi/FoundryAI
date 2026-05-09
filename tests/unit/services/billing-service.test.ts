// @ts-nocheck
import { BillingService } from '@/layer-3-data/services/billing-service';

// Mock Supabase
jest.mock('@/layer-3-data/supabase/client', () => ({
  createBrowserSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              user_id: 'user-123',
              credits: 100,
              tier: 'pro',
              created_at: new Date().toISOString()
            },
            error: null
          })),
        })),
      })),
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
      const result = await service.getUserCredits('user-123');
      
      expect(result).toBeDefined();
      expect(result.credits).toBe(100);
      expect(result.tier).toBe('pro');
    });
  });

  describe('calculateUsageCost', () => {
    it('should calculate usage cost correctly', () => {
      const usage = {
        planGeneration: 1,
        refinement: 2,
        export: 1
      };

      const cost = service.calculateUsageCost(usage);
      
      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });
  });

  describe('deductCredits', () => {
    it('should deduct credits from user account', async () => {
      const result = await service.deductCredits('user-123', 50, 'Plan generation');
      
      expect(result).toBeDefined();
      expect(result.credits).toBe(50); // 100 - 50
    });
  });
});
