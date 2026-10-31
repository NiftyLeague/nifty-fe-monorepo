import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { mock } from 'bun:test'

try {
  // happy-dom 21 disables iframe page loading by default and reports the
  // failure synchronously on insertion. Enable it to match the async load
  // behaviour the suite was written against (happy-dom 20).
  GlobalRegistrator.register({ settings: { enableIframePageLoading: true } })
} catch {
  /* already registered */
}

if (typeof window !== 'undefined') {
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
  })
  class NoopObserver {
    disconnect = mock()
    observe = mock()
    takeRecords = mock(() => [])
    unobserve = mock()
  }
  Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: NoopObserver })
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: NoopObserver })
}
