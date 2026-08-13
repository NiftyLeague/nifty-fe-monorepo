import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, spyOn, jest } from 'bun:test'
import { mock } from 'bun:test'
import { useCopyToClipboard } from './useCopyToClipboard'
import { useMediaQuery } from './useMediaQuery'
import { STATUS, useStopwatch } from './useStopwatch'
import { useUserAgent } from './useUserAgent'

describe('useCopyToClipboard', () => {
  it('copies text and exposes the last successful value', async () => {
    const writeText = mock().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => expect(await result.current[1]('nifty')).toBe(true))

    expect(writeText).toHaveBeenCalledWith('nifty')
    expect(result.current[0]).toBe('nifty')
  })

  it('reports clipboard failures without retaining stale text', async () => {
    spyOn(console, 'warn').mockImplementation(() => undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mock().mockRejectedValue(new Error('denied')) },
    })
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => expect(await result.current[1]('blocked')).toBe(false))
    expect(result.current[0]).toBeNull()
  })
})

describe('useMediaQuery', () => {
  it('subscribes to media changes and updates the result', () => {
    let listener: (() => void) | undefined
    let matches = false
    const media = {
      get matches() {
        return matches
      },
      addListener: mock((callback: () => void) => {
        listener = callback
      }),
      removeListener: mock(),
    }
    spyOn(window, 'matchMedia').mockReturnValue(media as never)
    const { result, unmount } = renderHook(() => useMediaQuery('(min-width: 900px)'))

    expect(result.current).toBe(false)
    matches = true
    act(() => listener?.())
    expect(result.current).toBe(true)
    unmount()
    expect(media.removeListener).toHaveBeenCalled()
  })

  it('shares one native media listener between consumers of the same query', () => {
    let listener: (() => void) | undefined
    const media = {
      matches: true,
      addListener: mock((callback: () => void) => {
        listener = callback
      }),
      removeListener: mock(),
    }
    const matchMedia = spyOn(window, 'matchMedia').mockReturnValue(media as never)
    matchMedia.mockClear()
    const first = renderHook(() => useMediaQuery('(max-width: 640px)'))
    const second = renderHook(() => useMediaQuery('(max-width: 640px)'))

    expect(matchMedia).toHaveBeenCalledTimes(1)
    expect(media.addListener).toHaveBeenCalledTimes(1)
    expect(first.result.current).toBe(true)
    expect(second.result.current).toBe(true)

    first.unmount()
    expect(media.removeListener).not.toHaveBeenCalled()
    second.unmount()
    expect(media.removeListener).toHaveBeenCalledTimes(1)
    expect(listener).toBeDefined()
  })

  it('supports the modern media change event API', () => {
    let listener: (() => void) | undefined
    const media = {
      matches: false,
      addEventListener: mock((_event: string, callback: () => void) => {
        listener = callback
      }),
      removeEventListener: mock(),
    }
    const matchMedia = spyOn(window, 'matchMedia').mockReturnValue(media as never)
    matchMedia.mockClear()
    const hook = renderHook(() => useMediaQuery('(min-width: 1024px)'))

    expect(matchMedia).toHaveBeenCalledTimes(1)
    expect(media.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    expect(hook.result.current).toBe(false)

    media.matches = true
    act(() => listener?.())
    expect(hook.result.current).toBe(true)

    hook.unmount()
    expect(media.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})

describe('useStopwatch', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('moves through start, pause, restart, and stop states', () => {
    const onStart = mock()
    const onPause = mock()
    const onRestart = mock()
    const onStop = mock()
    const { result } = renderHook(() =>
      useStopwatch({ interval: 10, onStart, onPause, onRestart, onStop })
    )

    act(() => result.current.start())
    expect(result.current.status).toBe(STATUS.RUNNING)
    act(() => jest.advanceTimersByTime(10))
    expect(result.current.milliseconds).toBe(10)

    act(() => result.current.pause())
    expect(result.current.status).toBe(STATUS.PAUSED)
    act(() => result.current.restart())
    expect(result.current.status).toBe(STATUS.RUNNING)
    act(() => result.current.stop())
    expect(result.current).toMatchObject({ status: STATUS.STOPPED, milliseconds: 0 })
    expect(
      [onStart, onPause, onRestart, onStop].every((callback) => callback.mock.calls.length === 1)
    ).toBe(true)
  })
})

describe('useUserAgent', () => {
  it('classifies mobile and desktop agents', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      get: () => 'Mozilla/5.0 (iPhone)',
    })
    const mobile = renderHook(() => useUserAgent()).result.current
    expect(mobile.isIos()).toBe(true)
    expect(mobile.isMobile()).toBe(true)
    expect(mobile.isDesktop()).toBe(false)
  })
})
