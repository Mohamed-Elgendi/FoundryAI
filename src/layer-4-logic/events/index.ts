/**
 * Layer 4: Logic - Events
 * Event handling and pub/sub
 */

export type EventHandler = (data: unknown) => void;

export class EventManager {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(event: string, handler: EventHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);

    return () => {
      const handlers = this.handlers.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) handlers.splice(index, 1);
      }
    };
  }

  publish(event: string, data?: unknown): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}

export const globalEventManager = new EventManager();
