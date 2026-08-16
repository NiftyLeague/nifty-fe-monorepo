import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import DeferredExternalScript from '.'

describe('DeferredExternalScript', () => {
  beforeEach(() => {
    document.getElementById('test-external-script')?.remove()
  })

  it('waits for interaction before appending the script', () => {
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

    const rendered = render(<DeferredExternalScript id="test-external-script" src="/stats.js" />)

    try {
      expect(timeoutCallbacks).toHaveLength(1)
      expect(idleCallbacks).toHaveLength(0)
      expect(document.getElementById('test-external-script')).toBeNull()

      act(() => window.dispatchEvent(new Event('pointerdown')))

      const script = document.getElementById('test-external-script')
      expect(script?.getAttribute('src')).toBe('/stats.js')
      expect(script?.async).toBe(true)
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

  it('shares one activation timer across deferred scripts', () => {
    const originalSetTimeout = window.setTimeout
    const originalClearTimeout = window.clearTimeout
    const timeoutCallbacks: TimerHandler[] = []

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

    const rendered = render(
      <>
        <DeferredExternalScript id="test-external-script" src="/stats.js" />
        <DeferredExternalScript id="test-external-script-two" src="/other-stats.js" />
      </>
    )

    try {
      expect(timeoutCallbacks).toHaveLength(1)

      act(() => window.dispatchEvent(new Event('pointerdown')))

      expect(document.getElementById('test-external-script')?.getAttribute('src')).toBe('/stats.js')
      expect(document.getElementById('test-external-script-two')?.getAttribute('src')).toBe(
        '/other-stats.js'
      )
    } finally {
      rendered.unmount()
      document.getElementById('test-external-script-two')?.remove()
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
