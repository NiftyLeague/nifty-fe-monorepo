import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { mock } from 'bun:test';

if (typeof (globalThis as any).document === 'undefined') {
  try {
    GlobalRegistrator.register();
  } catch {
    /* already registered */
  }
}

if (typeof window !== 'undefined' && !(window as any).matchMedia) {
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
}
if (typeof window !== 'undefined' && !(window as any).IntersectionObserver) {
  class NoopObserver {
    disconnect = mock();
    observe = mock();
    takeRecords = mock(() => []);
    unobserve = mock();
  }
  Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: NoopObserver });
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: NoopObserver });
}

describe('dom environment', () => {
  it('registers happy-dom globals', () => {
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');
  });
});
