import '@testing-library/jest-dom';
import { beforeAll, afterAll } from 'vitest';

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
