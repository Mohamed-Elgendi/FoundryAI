import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

process.env.NEXT_PUBLIC_SUPABASE_URL ??=
  'https://placeholder.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??=
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';

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
    json: (data: unknown, init?: ResponseInit) => {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
      });
    },
    redirect: (url: string) =>
      new Response(null, { status: 302, headers: { Location: url } }),
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

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

if (typeof globalThis.Request === 'undefined') {
  globalThis.Response = class Response {
    body: unknown;
    status: number;
    headers: Headers;

    constructor(body?: unknown, init?: ResponseInit) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = new Headers(init?.headers);
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }

    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body ?? '');
    }
  } as typeof Response;

  globalThis.Request = class Request {
    url: string;
    method: string;
    headers: Headers;
    private bodyText?: string;

    constructor(input: string, init?: RequestInit) {
      this.url = input;
      this.method = init?.method ?? 'GET';
      this.headers = new Headers(init?.headers);
      if (typeof init?.body === 'string') {
        this.bodyText = init.body;
      }
    }

    async json() {
      return this.bodyText ? JSON.parse(this.bodyText) : {};
    }

    async text() {
      return this.bodyText ?? '';
    }
  } as typeof Request;
}

if (typeof window !== 'undefined') {
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
}

class MockTransformStream {
  readable: { getReader: jest.Mock };
  writable: { getWriter: jest.Mock };
  constructor() {
    this.readable = { getReader: jest.fn() };
    this.writable = { getWriter: jest.fn() };
  }
}

(global as typeof globalThis).TransformStream = MockTransformStream as typeof TransformStream;

global.ReadableStream = class ReadableStream {
  constructor(_underlyingSource?: unknown) {}
  getReader() {
    return { read: jest.fn(), releaseLock: jest.fn() };
  }
} as typeof ReadableStream;
