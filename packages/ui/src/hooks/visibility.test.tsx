const stubGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
}
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { mock } from 'bun:test'
import { useOnScreen } from './useOnScreen'
import { useParallax } from './useParallax'

describe('useOnScreen', () => {
  let intersectionCallback: IntersectionObserverCallback
  const observe = mock()
  const unobserve = mock()

  beforeEach(() => {
    observe.mockClear()
    unobserve.mockClear()
    stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersectionCallback = callback
        }
        observe = observe
        unobserve = unobserve
      }
    )
  })

  it('observes the referenced element, updates visibility, and cleans up', () => {
    const element = document.createElement('div')
    const ref = { current: element }
    const { result, unmount } = renderHook(() => useOnScreen(ref, '20px'))

    expect(observe).toHaveBeenCalledWith(element)
    act(() =>
      intersectionCallback(
        [{ target: element, isIntersecting: true } as IntersectionObserverEntry],
        {} as never
      )
    )
    expect(result.current).toBe(true)
    unmount()
    expect(unobserve).toHaveBeenCalledWith(element)
  })

  it('can stop observing after the first intersection', () => {
    const element = document.createElement('div')
    const ref = { current: element }
    const { result } = renderHook(() => useOnScreen(ref, '20px', { once: true }))

    act(() =>
      intersectionCallback(
        [{ target: element, isIntersecting: true } as IntersectionObserverEntry],
        {} as never
      )
    )

    expect(result.current).toBe(true)
    expect(unobserve).toHaveBeenCalledWith(element)

    act(() =>
      intersectionCallback(
        [{ target: element, isIntersecting: false } as IntersectionObserverEntry],
        {} as never
      )
    )
    expect(result.current).toBe(true)
  })

  it('stays false when no element is mounted', () => {
    expect(renderHook(() => useOnScreen({ current: null })).result.current).toBe(false)
    expect(observe).not.toHaveBeenCalled()
  })

  it('treats the element as visible when IntersectionObserver is unavailable', () => {
    const originalObserver = globalThis.IntersectionObserver
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: undefined,
    })

    try {
      const { result } = renderHook(() => useOnScreen({ current: document.createElement('div') }))

      expect(result.current).toBe(true)
    } finally {
      Object.defineProperty(globalThis, 'IntersectionObserver', {
        configurable: true,
        value: originalObserver,
      })
    }
  })

  it('shares one observer across consumers that use the same rootMargin', () => {
    const constructorCalls = mock()
    stubGlobal(
      'IntersectionObserver',
      class {
        constructor() {
          constructorCalls()
        }
        observe = observe
        unobserve = unobserve
      }
    )

    const firstElement = document.createElement('div')
    const secondElement = document.createElement('div')
    renderHook(() => useOnScreen({ current: firstElement }, '10px'))
    renderHook(() => useOnScreen({ current: secondElement }, '10px'))

    expect(constructorCalls).toHaveBeenCalledTimes(1)
    expect(observe).toHaveBeenCalledWith(firstElement)
    expect(observe).toHaveBeenCalledWith(secondElement)
  })

  it('creates a separate observer for a distinct rootMargin', () => {
    const constructorCalls = mock()
    stubGlobal(
      'IntersectionObserver',
      class {
        constructor() {
          constructorCalls()
        }
        observe = observe
        unobserve = unobserve
      }
    )

    renderHook(() => useOnScreen({ current: document.createElement('div') }, '40px'))
    renderHook(() => useOnScreen({ current: document.createElement('div') }, '50px'))

    expect(constructorCalls).toHaveBeenCalledTimes(2)
  })

  it('keeps notifying remaining consumers after a sibling unmounts', () => {
    stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersectionCallback = callback
        }
        observe = observe
        unobserve = unobserve
      }
    )

    const firstElement = document.createElement('div')
    const secondElement = document.createElement('div')
    const first = renderHook(() => useOnScreen({ current: firstElement }, '70px'))
    const second = renderHook(() => useOnScreen({ current: secondElement }, '70px'))

    first.unmount()
    expect(unobserve).toHaveBeenCalledWith(firstElement)

    act(() =>
      intersectionCallback(
        [{ target: secondElement, isIntersecting: true } as IntersectionObserverEntry],
        {} as never
      )
    )
    expect(second.result.current).toBe(true)
  })

  it('disconnects a shared observer after its last consumer unmounts', () => {
    const disconnect = mock()
    stubGlobal(
      'IntersectionObserver',
      class {
        observe = observe
        unobserve = unobserve
        disconnect = disconnect
      }
    )

    const hook = renderHook(() => useOnScreen({ current: document.createElement('div') }, '80px'))
    hook.unmount()

    expect(disconnect).toHaveBeenCalledTimes(1)
  })
})

describe('useParallax', () => {
  let intersectionCallback: IntersectionObserverCallback

  beforeEach(() => {
    stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersectionCallback = callback
        }
        observe = mock()
        unobserve = mock()
        disconnect = mock()
      }
    )
  })

  function elementWithTop(top: number, withChild = true) {
    const element = document.createElement('div')
    if (withChild) {
      const child = document.createElement('span')
      child.className = 'parallax-child'
      element.append(child)
    }
    spyOn(element, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect)
    return element
  }

  function markIntersecting(element: Element, isIntersecting = true) {
    act(() =>
      intersectionCallback(
        [{ target: element, isIntersecting } as IntersectionObserverEntry],
        {} as never
      )
    )
  }

  it('applies vertical movement to the child and removes its scroll listener', () => {
    spyOn(window, 'addEventListener')
    spyOn(window, 'removeEventListener')
    const element = elementWithTop(100)
    const { unmount } = renderHook(() =>
      useParallax({ current: element }, { enabled: true, direction: 'down', intensity: 'strong' })
    )
    markIntersecting(element)

    expect((element.firstElementChild as HTMLElement).style.transform).toBe(
      `translateY(${(-100 * 100 * 2) / window.innerHeight}px)`
    )
    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    })
    unmount()
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('supports horizontal movement and falls back to the element itself', () => {
    const element = elementWithTop(50, false)
    renderHook(() =>
      useParallax({ current: element }, { enabled: true, direction: 'right', intensity: 'lite' })
    )
    markIntersecting(element)

    expect(element.style.transform).toBe(`translateX(${(-50 * 100 * 0.5) / window.innerHeight}px)`)
  })

  it('shares one scroll listener and coalesces updates into one animation frame', () => {
    const addEventListener = spyOn(window, 'addEventListener')
    const removeEventListener = spyOn(window, 'removeEventListener')
    const originalRequestAnimationFrame = window.requestAnimationFrame
    const originalCancelAnimationFrame = window.cancelAnimationFrame
    let animationFrameCallback: FrameRequestCallback | undefined

    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        animationFrameCallback = callback
        return 1
      },
    })
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: () => undefined,
    })

    try {
      const firstElement = elementWithTop(100)
      const secondElement = elementWithTop(200)
      const first = renderHook(() =>
        useParallax(
          { current: firstElement },
          { enabled: true, direction: 'down', intensity: 'normal' }
        )
      )
      const second = renderHook(() =>
        useParallax(
          { current: secondElement },
          { enabled: true, direction: 'up', intensity: 'normal' }
        )
      )
      markIntersecting(firstElement)
      markIntersecting(secondElement)

      expect(addEventListener).toHaveBeenCalledTimes(1)
      window.dispatchEvent(new Event('scroll'))
      window.dispatchEvent(new Event('scroll'))
      expect(animationFrameCallback).toBeDefined()

      firstElement.getBoundingClientRect = () => ({ top: 150 }) as DOMRect
      secondElement.getBoundingClientRect = () => ({ top: 250 }) as DOMRect
      act(() => animationFrameCallback?.(1))

      expect((firstElement.firstElementChild as HTMLElement).style.transform).toBe(
        `translateY(${(-150 * 100) / window.innerHeight}px)`
      )
      expect((secondElement.firstElementChild as HTMLElement).style.transform).toBe(
        `translateY(${(250 * 100) / window.innerHeight}px)`
      )

      first.unmount()
      expect(removeEventListener).not.toHaveBeenCalledWith('scroll', expect.any(Function))
      second.unmount()
      expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    } finally {
      Object.defineProperty(window, 'requestAnimationFrame', {
        configurable: true,
        value: originalRequestAnimationFrame,
      })
      Object.defineProperty(window, 'cancelAnimationFrame', {
        configurable: true,
        value: originalCancelAnimationFrame,
      })
    }
  })

  it('stops the shared scroll subscription when the element leaves the near-viewport margin', () => {
    const addEventListener = spyOn(window, 'addEventListener')
    const removeEventListener = spyOn(window, 'removeEventListener')
    const element = elementWithTop(100)
    renderHook(() =>
      useParallax({ current: element }, { enabled: true, direction: 'down', intensity: 'normal' })
    )

    expect(addEventListener).not.toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    })

    markIntersecting(element)
    expect(addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    })

    markIntersecting(element, false)
    expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('does nothing while disabled or before the ref is mounted', () => {
    const addEventListener = spyOn(window, 'addEventListener')
    renderHook(() =>
      useParallax({ current: null }, { enabled: true, direction: 'up', intensity: 'normal' })
    )
    renderHook(() =>
      useParallax(
        { current: elementWithTop(10) },
        { enabled: false, direction: 'left', intensity: 'extreme' }
      )
    )

    expect(addEventListener).not.toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.anything()
    )
  })
})
