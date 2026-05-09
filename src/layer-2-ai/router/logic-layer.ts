/**
 * LAYER 5: LOGIC LAYER
 * ====================
 * Business logic and event orchestration
 */

// Simple event bus for decoupled communication
class EventBus {
  private listeners: Map<string, Array<(data: unknown) => void>> = new Map();

  on(event: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) callbacks.splice(index, 1);
      }
    };
  }

  emit(event: string, data?: unknown): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }
}

export const globalEventBus = new EventBus();

// Business logic orchestrators
export function initializeLogicLayer(): void {
  console.log('[Logic Layer] Initialized');
}
