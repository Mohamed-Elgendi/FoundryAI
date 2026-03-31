/**
 * Logic Layer for Data Operations
 */

export class EventBus {
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

export interface LogicLayerConfig {
  enableCaching: boolean;
  enableValidation: boolean;
}

export function initializeLogicLayer(config: LogicLayerConfig): void {
  console.log('[Logic Layer] Initialized with config:', config);
}

export function executeBusinessLogic<T>(
  operation: string,
  data: T
): Promise<T> {
  console.log(`[Logic Layer] Executing ${operation}`);
  return Promise.resolve(data);
}
