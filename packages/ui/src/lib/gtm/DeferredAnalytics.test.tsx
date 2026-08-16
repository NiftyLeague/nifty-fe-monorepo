import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('next/script', () => ({
  default: ({ id }: { id?: string }) => <script data-testid={id} />,
}))

mock.module('./GoogleTagManager', () => ({
  default: () => <div data-testid="gtm-loaded" />,
}))

mock.module('./WebVitals', () => ({
  default: () => null,
}))

describe('DeferredAnalytics', () => {
  let DeferredAnalytics: typeof import('./DeferredAnalytics').default

  beforeEach(async () => {
    DeferredAnalytics = (await import('./DeferredAnalytics')).default
  })

  it('waits for interaction before loading analytics', async () => {
    const originalRequestIdleCallback = window.requestIdleCallback
    const originalCancelIdleCallback = window.cancelIdleCallback
    const originalSetTimeout = window.setTimeout
    const originalClearTimeout = window.clearTimeout
    const idleCallbacks: IdleRequestCallback[] = []
    const timeoutCallbacks: TimerHandler[] = []

    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: (callback: IdleRequestCallback) => {
        idleCallbacks.push(callback)
        return 1
      },
    })
    Object.defineProperty(window, 'cancelIdleCallback', {
      configurable: true,
      value: mock(),
    })
    Object.defineProperty(window, 'setTimeout', {
      configurable: true,
      value: (callback: TimerHandler) => {
        timeoutCallbacks.push(callback)
        return 1
      },
    })
    Object.defineProperty(window, 'clearTimeout', {
      configurable: true,
      value: mock(),
    })

    const rendered = render(<DeferredAnalytics includeWebVitals={false} />)

    try {
      expect(timeoutCallbacks).toHaveLength(1)
      expect(idleCallbacks).toHaveLength(0)
      expect(screen.queryByTestId('gtm-loaded')).toBeNull()

      await act(async () => {
        window.dispatchEvent(new Event('pointerdown'))
        await new Promise<void>((resolve) => originalSetTimeout(resolve, 0))
        await new Promise<void>((resolve) => originalSetTimeout(resolve, 0))
      })

      expect(screen.getByTestId('gtm-loaded')).toBeTruthy()
    } finally {
      rendered.unmount()
      Object.defineProperty(window, 'requestIdleCallback', {
        configurable: true,
        value: originalRequestIdleCallback,
      })
      Object.defineProperty(window, 'cancelIdleCallback', {
        configurable: true,
        value: originalCancelIdleCallback,
      })
      Object.defineProperty(window, 'setTimeout', {
        configurable: true,
        value: originalSetTimeout,
      })
      Object.defineProperty(window, 'clearTimeout', {
        configurable: true,
        value: originalClearTimeout,
      })
    }
  })
})
