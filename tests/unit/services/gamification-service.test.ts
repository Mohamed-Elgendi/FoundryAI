// @ts-nocheck
import { GamificationService } from '@/layer-3-data/services/gamification-service';

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
    rpc: jest.fn(() => ({
      data: { points: 100 },
      error: null
    })),
  })),
}));

describe('GamificationService', () => {
  let service: GamificationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = GamificationService.getInstance();
  });

  describe('awardPoints', () => {
    it('should award points to user', async () => {
      const result = await service.awardPoints('user-123', 50, 'Test achievement');
      
      expect(result).toBeDefined();
      expect(result.points).toBe(50);
      expect(result.userId).toBe('user-123');
    });
  });

  describe('getUserPoints', () => {
    it('should get user points', async () => {
      const result = await service.getUserPoints('user-123');
      
      expect(result).toBeDefined();
      expect(result.total_points).toBe(100);
    });
  });

  describe('awardBadge', () => {
    it('should award badge to user', async () => {
      const badge = {
        id: 'badge-123',
        name: 'Test Badge',
        description: 'Test badge description',
        category: 'learning',
        rarity: 'common',
        points_awarded: 10,
        criteria: {},
        active: true,
        created_at: new Date().toISOString()
      };

      const result = await service.awardBadge('user-123', badge);
      
      expect(result).toBeDefined();
      expect(result.badge_id).toBe('badge-123');
    });
  });
});
