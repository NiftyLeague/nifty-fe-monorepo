import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, spyOn } from 'bun:test'

import { useDocumentVisibility } from './useDocumentVisibility'

const setDocumentHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: hidden })
}

describe('useDocumentVisibility', () => {
  const originalHidden = document.hidden

  afterEach(() => {
    setDocumentHidden(originalHidden)
  })

  it('tracks visibility changes without creating duplicate listeners', () => {
    setDocumentHidden(false)
    const addEventListener = spyOn(document, 'addEventListener')
    const removeEventListener = spyOn(document, 'removeEventListener')

    const first = renderHook(() => useDocumentVisibility())
    const second = renderHook(() => useDocumentVisibility())

    expect(first.result.current).toBe(true)
    expect(second.result.current).toBe(true)
    expect(
      addEventListener.mock.calls.filter(([type]) => type === 'visibilitychange')
    ).toHaveLength(1)

    setDocumentHidden(true)
    act(() => document.dispatchEvent(new Event('visibilitychange')))

    expect(first.result.current).toBe(false)
    expect(second.result.current).toBe(false)

    first.unmount()
    expect(removeEventListener).not.toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    second.unmount()
    expect(removeEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
  })
})
