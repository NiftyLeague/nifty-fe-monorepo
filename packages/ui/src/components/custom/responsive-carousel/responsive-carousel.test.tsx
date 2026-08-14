import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, mock } from 'bun:test'

import ResponsiveCarousel from './index'

let restoreWindowAddEventListener: (() => void) | undefined

afterEach(() => {
  restoreWindowAddEventListener?.()
  restoreWindowAddEventListener = undefined
})

describe('ResponsiveCarousel', () => {
  it('uses ResizeObserver without adding a duplicate window resize listener', () => {
    const originalAddEventListener = window.addEventListener
    const addEventListener = mock<typeof window.addEventListener>()

    window.addEventListener = addEventListener
    restoreWindowAddEventListener = () => {
      window.addEventListener = originalAddEventListener
    }

    const { unmount } = render(
      <ResponsiveCarousel>
        <div>Slide</div>
      </ResponsiveCarousel>
    )

    expect(addEventListener.mock.calls.some(([type]) => type === 'resize')).toBe(false)
    unmount()
  })
})
