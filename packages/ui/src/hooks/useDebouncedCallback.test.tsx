import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, jest, mock } from 'bun:test'

import { useDebouncedCallback } from './useDebouncedCallback'

describe('useDebouncedCallback', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('coalesces calls and invokes the latest callback', () => {
    const callback = mock()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    act(() => {
      result.current('first')
      result.current('second')
      jest.advanceTimersByTime(299)
    })
    expect(callback).not.toHaveBeenCalled()

    act(() => jest.advanceTimersByTime(1))
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('second')
  })

  it('uses the callback from the latest render without restarting the timer', () => {
    const callback = mock()
    const { result, rerender } = renderHook(
      ({ prefix }: { prefix: string }) =>
        useDebouncedCallback((value: string) => callback(`${prefix}:${value}`), 300),
      { initialProps: { prefix: 'old' } }
    )

    act(() => result.current('value'))
    rerender({ prefix: 'new' })
    act(() => jest.advanceTimersByTime(300))

    expect(callback).toHaveBeenCalledWith('new:value')
  })

  it('cancels pending work when the consumer unmounts', () => {
    const callback = mock()
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300))

    act(() => result.current('value'))
    unmount()
    act(() => jest.advanceTimersByTime(300))

    expect(callback).not.toHaveBeenCalled()
  })
})
