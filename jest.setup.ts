import '@testing-library/jest-dom'

// Polyfill structuredClone if not already provided
if (typeof globalThis.structuredClone === 'undefined') {
  const clone = <T>(val: T): T => JSON.parse(JSON.stringify(val));
  globalThis.structuredClone = clone as any;
  if (typeof window !== 'undefined') {
    (window as any).structuredClone = clone;
  }
}

// Polyfill Web Fetch APIs for Next.js server utilities
if (typeof (global as any).Request === 'undefined' && typeof globalThis.Request !== 'undefined') {
  (global as any).Request = globalThis.Request;
  (global as any).Response = globalThis.Response;
  (global as any).Headers = globalThis.Headers;
  (global as any).FormData = globalThis.FormData;
}

// Polyfill window.matchMedia if running in browser/jsdom
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
}

// Polyfill ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// Polyfill IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
} as any;
