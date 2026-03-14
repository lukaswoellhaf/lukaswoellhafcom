import '@testing-library/jest-dom';
import { beforeAll, afterAll, beforeEach, vi } from 'vitest';

// localStorage mock (jsdom's built-in localStorage may not initialize properly)
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// IntersectionObserver mock (not implemented in jsdom)
const intersectionObserverMock = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(globalThis, 'IntersectionObserver', {
  value: intersectionObserverMock,
  writable: true,
  configurable: true,
});

beforeEach(() => {
  localStorageMock.clear();
  intersectionObserverMock.mockClear();
});

// Suppress console errors during tests to reduce noise
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = String(args[0]);
    // Suppress known benign errors
    if (message.includes('Failed to load translations')) return;
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
