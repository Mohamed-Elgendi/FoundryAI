import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next/server
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: ResponseInit) => {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json' },
      });
    },
    redirect: (url: string) => new Response(null, { status: 302, headers: { Location: url } }),
  },
}));
jest.mock('next/headers', () => ({
  cookies() {
    return {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };
  },
}));

// Global test utilities
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Add missing Web APIs for Node.js test environment
global.Request = class Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    return new URL(input.toString()) as any;
  }
} as any;

global.Response = class Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {}
  json() { return Promise.resolve({}); }
  text() { return Promise.resolve(''); }
} as any;

class MockTransformStream {
  readable: any;
  writable: any;
  constructor() {
    this.readable = { getReader: jest.fn() };
    this.writable = { getWriter: jest.fn() };
  }
}

(global as any).TransformStream = MockTransformStream;

// Mock ReadableStream
global.ReadableStream = class ReadableStream {
  constructor(underlyingSource?: any) {}
  getReader() { return { read: jest.fn(), releaseLock: jest.fn() }; }
} as any;
