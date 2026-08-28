import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test'

import ResponsiveCarousel from './index'

let restoreWindowAddEventListener: (() => void) | undefined
let restoreResizeObserver: (() => void) | undefined

afterEach(() => {
  restoreWindowAddEventListener?.()
  restoreWindowAddEventListener = undefined
  restoreResizeObserver?.()
  restoreResizeObserver = undefined
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

  it('uses the cached viewport width for button navigation', () => {
    const originalResizeObserver = globalThis.ResizeObserver
    let resizeCallback: ResizeObserverCallback | undefined

    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      value: class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback
        }
        observe() {}
        disconnect() {}
      },
    })
    restoreResizeObserver = () => {
      Object.defineProperty(globalThis, 'ResizeObserver', {
        configurable: true,
        value: originalResizeObserver,
      })
    }

    const { container, unmount } = render(
      <ResponsiveCarousel showControls>
        <div>First slide</div>
        <div>Second slide</div>
      </ResponsiveCarousel>
    )
    const viewport = container.querySelector(
      '[aria-label="Featured content slides"]'
    ) as HTMLDivElement
    let clientWidthReads = 0
    Object.defineProperty(viewport, 'clientWidth', {
      configurable: true,
      get: () => {
        clientWidthReads += 1
        return 640
      },
    })
    const scrollTo = mock()
    viewport.scrollTo = scrollTo

    act(() => resizeCallback?.([] as ResizeObserverEntry[], {} as ResizeObserver))
    const readsAfterResize = clientWidthReads
    fireEvent.click(container.querySelector('[aria-label="Go to next slide"]') as HTMLButtonElement)

    expect(readsAfterResize).toBe(1)
    expect(clientWidthReads).toBe(readsAfterResize)
    expect(scrollTo).toHaveBeenCalledWith({ left: 640, behavior: 'smooth' })
    unmount()
  })

  it('pauses autoplay while the carousel is outside the viewport', () => {
    const originalObserver = globalThis.IntersectionObserver
    let intersectionCallback: IntersectionObserverCallback | undefined
    let observedElement: Element | undefined

    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: class {
        constructor(callback: IntersectionObserverCallback) {
          intersectionCallback = callback
        }
        observe(element: Element) {
          observedElement = element
        }
        unobserve() {}
        disconnect() {}
      },
    })

    const setIntervalSpy = spyOn(window, 'setInterval')
    const clearIntervalSpy = spyOn(window, 'clearInterval')

    try {
      const { unmount } = render(
        <ResponsiveCarousel autoPlay>
          <div>First slide</div>
          <div>Second slide</div>
        </ResponsiveCarousel>
      )

      expect(setIntervalSpy).not.toHaveBeenCalled()
      expect(observedElement).toBeDefined()

      act(() =>
        intersectionCallback?.(
          [{ target: observedElement!, isIntersecting: true } as IntersectionObserverEntry],
          {} as never
        )
      )
      expect(setIntervalSpy).toHaveBeenCalledTimes(1)

      act(() =>
        intersectionCallback?.(
          [{ target: observedElement!, isIntersecting: false } as IntersectionObserverEntry],
          {} as never
        )
      )
      expect(clearIntervalSpy).toHaveBeenCalledTimes(1)

      unmount()
    } finally {
      Object.defineProperty(globalThis, 'IntersectionObserver', {
        configurable: true,
        value: originalObserver,
      })
    }
  })
})
