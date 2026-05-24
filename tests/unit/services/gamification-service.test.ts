// @ts-nocheck
jest.mock('@/layer-3-data/supabase/client', () => {
  const mockClient = {
    rpc: jest.fn(),
    from: jest.fn(),
  };
  return {
    createBrowserSupabaseClient: () => mockClient,
  };
});

import { createBrowserSupabaseClient } from '@/layer-3-data/supabase/client';
import { GamificationService } from '@/layer-3-data/services/gamification-service';

const mockSupabaseClient = createBrowserSupabaseClient();

describe('GamificationService', () => {
  let service: GamificationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = GamificationService.getInstance();
  });

  describe('awardPoints', () => {
    it('should award points to user', async () => {
      mockSupabaseClient.rpc.mockResolvedValueOnce({
        data: {
          user_id: 'user-123',
          total_points: 150,
          current_level: 2,
        },
        error: null,
      });
      jest.spyOn(service, 'checkAndAwardBadges').mockResolvedValue([]);

      const result = await service.awardPoints('user-123', 50, 'Test achievement');

      expect(result).toBeDefined();
      expect(result.total_points).toBe(150);
      expect(result.user_id).toBe('user-123');
    });
  });

  describe('getUserPoints', () => {
    it('should get user points', async () => {
      const chain = { eq: jest.fn(), single: jest.fn() };
      chain.eq.mockReturnValue(chain);
      chain.single.mockResolvedValueOnce({
        data: {
          user_id: 'user-123',
          total_points: 100,
          current_level: 1,
        },
        error: null,
      });
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue(chain),
      });

      const result = await service.getUserPoints('user-123');

      expect(result).toBeDefined();
      expect(result?.total_points).toBe(100);
    });
  });

  describe('awardBadge', () => {
    it('should award badge to user', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValueOnce({
              data: {
                user_id: 'user-123',
                badge_id: 'badge-123',
              },
              error: null,
            }),
          }),
        }),
      });

      const result = await service.awardBadge('user-123', 'badge-123');

      expect(result).toBeDefined();
      expect(result?.badge_id).toBe('badge-123');
    });
  });
});
