import { useState, useEffect, useCallback } from 'react';

interface BrainDump {
  id: string;
  rawContent: string;
  wordCount: number;
  durationSeconds: number;
  cognitiveLoadBefore?: number;
  cognitiveLoadAfter?: number;
  dumpDate: string;
}

interface BrainDumpItem {
  id: string;
  itemContent: string;
  category: string;
  priority: string;
  isActionable: boolean;
  scheduledDate?: string;
  aiSuggestedAction?: string;
  completed: boolean;
}

interface UseBrainDumpReturn {
  dumps: BrainDump[];
  pendingItems: BrainDumpItem[];
  cognitiveLoad: number | null;
  isLoading: boolean;
  error: string | null;
  createDump: (data: CreateDumpData) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<BrainDumpItem>) => Promise<void>;
  refetch: () => void;
}

interface CreateDumpData {
  rawContent: string;
  durationSeconds: number;
  cognitiveLoadBefore?: number;
  cognitiveLoadAfter?: number;
  categorizedItems: Array<{
    content: string;
    category: string;
    priority?: string;
    scheduledDate?: string;
    aiSuggestedAction?: string;
  }>;
}

export function useBrainDump(limit: number = 10): UseBrainDumpReturn {
  const [dumps, setDumps] = useState<BrainDump[]>([]);
  const [pendingItems, setPendingItems] = useState<BrainDumpItem[]>([]);
  const [cognitiveLoad, setCognitiveLoad] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tier1/brain-dump?limit=${limit}&items=true`);
      if (!response.ok) throw new Error('Failed to fetch brain dumps');
      
      const data = await response.json();
      setDumps(data.dumps || []);
      setPendingItems(data.pendingItems || []);
      setCognitiveLoad(data.cognitiveLoad?.load_percentage || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createDump = async (data: CreateDumpData) => {
    try {
      const response = await fetch('/api/tier1/brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create brain dump');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updateItem = async (itemId: string, updates: Partial<BrainDumpItem>) => {
    try {
      const response = await fetch('/api/tier1/brain-dump/item', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, ...updates }),
      });
      
      if (!response.ok) throw new Error('Failed to update item');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    dumps,
    pendingItems,
    cognitiveLoad,
    isLoading,
    error,
    createDump,
    updateItem,
    refetch: fetchData,
  };
}
