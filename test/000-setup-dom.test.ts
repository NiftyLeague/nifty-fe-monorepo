// Registers happy-dom as the global DOM environment for ALL test files.
// bun's `preload` runs in a separate realm whose globals don't propagate to
// test files, so we register here (in the test realm) where it DOES propagate
// to subsequently-loaded files in the same bun test invocation.
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { describe, expect, it, mock } from 'bun:test';

GlobalRegistrator.register();

// happy-dom doesn't implement these — define them after registration so they
// survive into sibling test files (which share this realm with isolate=false).
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

describe('dom environment', () => {
  it('registers happy-dom globals', () => {
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');
  });
});
