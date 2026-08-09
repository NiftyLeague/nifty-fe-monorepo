import { afterEach, describe, expect, it, jest, mock } from 'bun:test'

import { sleep, withCache } from './api'

afterEach(() => {
  jest.useRealTimers()
})

describe('withCache', () => {
  it('caches a successful value until the TTL expires', async () => {
    const resolve = mock<() => Promise<string>>().mockResolvedValue('value')
    const cached = withCache(1_000, resolve)

    await expect(cached()).resolves.toBe('value')
    await expect(cached()).resolves.toBe('value')
    expect(resolve).toHaveBeenCalledTimes(1)
  })

  it('coalesces concurrent requests into one upstream call', async () => {
    let release: (value: string) => void = () => undefined
    const resolve = mock(
      () =>
        new Promise<string>((done) => {
          release = done
        })
    )
    const cached = withCache(1_000, resolve)

    const first = cached()
    const second = cached()
    expect(resolve).toHaveBeenCalledTimes(1)

    release('shared')
    await expect(Promise.all([first, second])).resolves.toEqual(['shared', 'shared'])
  })

  it('does not cache null results', async () => {
    const resolve = mock<() => Promise<string | null>>()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce('recovered')
    const cached = withCache(1_000, resolve)

    await expect(cached()).resolves.toBeNull()
    await expect(cached()).resolves.toBe('recovered')
    expect(resolve).toHaveBeenCalledTimes(2)
  })

  it('returns the last good value when a refresh fails', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(0)
    const resolve = mock<() => Promise<string>>()
      .mockResolvedValueOnce('last-good')
      .mockRejectedValueOnce(new Error('upstream unavailable'))
    const cached = withCache(100, resolve)

    await expect(cached()).resolves.toBe('last-good')
    jest.setSystemTime(101)
    await expect(cached()).resolves.toBe('last-good')
    expect(resolve).toHaveBeenCalledTimes(2)
  })

  it('propagates an upstream error when no cached value exists', async () => {
    const resolve = mock<() => Promise<string>>().mockRejectedValue(new Error('unavailable'))
    const cached = withCache(1_000, resolve)

    await expect(cached()).rejects.toThrow('unavailable')
  })
})

describe('sleep', () => {
  it('resolves after the requested delay', async () => {
    jest.useFakeTimers()
    const pending = sleep(25)

    await jest.advanceTimersByTime(25)
    await expect(pending).resolves.toBeUndefined()
  })
})
