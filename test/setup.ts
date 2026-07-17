import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, mock } from 'bun:test';

afterEach(() => {
  cleanup();
  mock.restore();
});

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: mock().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: mock(),
    removeEventListener: mock(),
    addListener: mock(),
    removeListener: mock(),
    dispatchEvent: mock(),
  })),
});

class NoopObserver {
  disconnect = mock();
  observe = mock();
  takeRecords = mock(() => []);
  unobserve = mock();
}

Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: NoopObserver });
Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: NoopObserver });
