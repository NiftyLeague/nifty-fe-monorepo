'use client'

import { useEffect, useRef } from 'react'
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async/dynamic'

export default function useAsyncInterval(
  callback: () => Promise<void>,
  delay: number | undefined,
  leading = true,
  refreshKey = ''
): void {
  const savedCallback = useRef(callback)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    const tick = async () => {
      const { current } = savedCallback
      if (current) await current()
    }

    let stopped = false
    let intervalId: ReturnType<typeof setIntervalAsync> | undefined
    const handleInterval = async () => {
      if (leading) await tick()
      if (!stopped && delay) intervalId = setIntervalAsync(tick, delay)
    }

    if (delay) {
      // eslint-disable-next-line no-void
      void handleInterval()
    }

    return () => {
      stopped = true
      if (intervalId) void clearIntervalAsync(intervalId)
    }
  }, [delay, leading])

  // Optional manual refresh keys
  useEffect(() => {
    const handleCallback = async () => {
      const { current } = savedCallback
      if (current) await current()
    }
    // eslint-disable-next-line no-void
    if (refreshKey) void handleCallback()
  }, [refreshKey])
}
