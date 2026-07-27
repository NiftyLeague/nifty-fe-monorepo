import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'
import { useScrollDetection } from './useScrollDetection'

type ObserverCb = (entries: { isIntersecting: boolean }[]) => void

function installObserver() {
  const observe = mock()
  const unobserve = mock()
  const disconnect = mock()
  let capturedCb: ObserverCb | undefined

  class MockObserver {
    constructor(cb: ObserverCb) {
      capturedCb = cb
    }
    observe = observe
    unobserve = unobserve
    disconnect = disconnect
  }
  Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: MockObserver })
  return { observe, unobserve, trigger: (v: boolean) => capturedCb?.([{ isIntersecting: v }]) }
}

describe('useScrollDetection', () => {
  it('returns a ref and defaults isIntersecting to false', () => {
    installObserver()
    const { result } = renderHook(() => useScrollDetection())
    expect(result.current.ref).toBeTruthy()
    expect(result.current.isIntersecting).toBe(false)
  })

  it('observes the element and updates isIntersecting when it enters view', () => {
    const { observe, unobserve, trigger } = installObserver()
    const el = document.createElement('div')

    const { result, rerender, unmount } = renderHook(() => useScrollDetection())
    // attach ref then re-run the effect
    act(() => {
      result.current.ref.current = el
    })
    rerender()

    expect(observe).toHaveBeenCalled()

    act(() => trigger(true))
    expect(result.current.isIntersecting).toBe(true)

    act(() => trigger(false))
    expect(result.current.isIntersecting).toBe(false)

    unmount()
    expect(unobserve).toHaveBeenCalled()
  })

  it('does nothing when no element is attached', () => {
    const { observe } = installObserver()
    renderHook(() => useScrollDetection())
    expect(observe).not.toHaveBeenCalled()
  })
})
