/**
 * Event Bus Tests
 *
 * Tests for emit, on, once.
 */

import { EventBus } from "@/lib/event-bus";

describe("Event Bus", () => {
  afterEach(() => {
    EventBus.reset();
  });

  it("emit triggers handler", async () => {
    const bus = EventBus.getInstance();
    const handler = jest.fn();
    bus.on("test.event", handler);
    await bus.emit("test.event", { data: "test" });
    expect(handler).toHaveBeenCalledWith({ data: "test" });
  });

  it("once runs handler once", async () => {
    const bus = EventBus.getInstance();
    const handler = jest.fn();
    bus.once("test.event", handler);
    await bus.emit("test.event", {});
    await bus.emit("test.event", {});
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("on runs handler multiple times", async () => {
    const bus = EventBus.getInstance();
    const handler = jest.fn();
    bus.on("test.event", handler);
    await bus.emit("test.event", {});
    await bus.emit("test.event", {});
    await bus.emit("test.event", {});
    expect(handler).toHaveBeenCalledTimes(3);
  });

  it("off removes handler", async () => {
    const bus = EventBus.getInstance();
    const handler = jest.fn();
    const unsubscribe = bus.on("test.event", handler);
    unsubscribe();
    await bus.emit("test.event", {});
    expect(handler).not.toHaveBeenCalled();
  });

  it("clear removes all handlers", async () => {
    const bus = EventBus.getInstance();
    const handler = jest.fn();
    bus.on("test.event", handler);
    bus.clear();
    await bus.emit("test.event", {});
    expect(handler).not.toHaveBeenCalled();
  });
});
