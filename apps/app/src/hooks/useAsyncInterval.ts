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

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = async () => {
      await savedCallback.current?.()
    }

    let stopped = false
    let intervalId: ReturnType<typeof setIntervalAsync> | undefined

    const start = async () => {
      if (leading) await tick()
      if (!stopped && delay) intervalId = setIntervalAsync(tick, delay)
    }

    if (delay) void start()

    return () => {
      stopped = true
      if (intervalId) void clearIntervalAsync(intervalId)
    }
  }, [delay, leading])

  useEffect(() => {
    if (refreshKey) void savedCallback.current?.()
  }, [refreshKey])
}
