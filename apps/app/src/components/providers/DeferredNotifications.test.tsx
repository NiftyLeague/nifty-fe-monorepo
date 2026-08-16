import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@/components/extended/Snackbar', () => ({
  default: () => <div data-testid="snackbar-loaded" />,
}))

mock.module('@nl/ui/base/sonner', () => ({
  Toaster: () => <div data-testid="toaster-loaded" />,
}))

describe('DeferredNotifications', () => {
  let DeferredNotifications: typeof import('./DeferredNotifications').default

  beforeEach(async () => {
    DeferredNotifications = (await import('./DeferredNotifications')).default
  })

  it('waits for interaction before loading notification UI', async () => {
    const originalRequestIdleCallback = window.requestIdleCallback
    const originalCancelIdleCallback = window.cancelIdleCallback
    const originalSetTimeout = window.setTimeout
    const originalClearTimeout = window.clearTimeout
    const timeoutCallbacks: TimerHandler[] = []

    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: mock(),
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

    const rendered = render(<DeferredNotifications />)

    try {
      expect(timeoutCallbacks).toHaveLength(1)
      expect(screen.queryByTestId('snackbar-loaded')).toBeNull()
      expect(screen.queryByTestId('toaster-loaded')).toBeNull()

      await act(async () => {
        window.dispatchEvent(new Event('pointerdown'))
        await new Promise<void>((resolve) => originalSetTimeout(resolve, 0))
      })

      expect(screen.getByTestId('snackbar-loaded')).toBeTruthy()
      expect(screen.getByTestId('toaster-loaded')).toBeTruthy()
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
