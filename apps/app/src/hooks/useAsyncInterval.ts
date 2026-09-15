'use client'

import { createEffect } from 'solid-js'
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async/dynamic'

export default function useAsyncInterval(
  callback: () => Promise<void>,
  delay: number | undefined,
  leading = true,
  refreshKey = ''
): void {
  let savedCallback: any = callback

  createEffect(() => {
    savedCallback.current = callback
  }, [callback])

  createEffect(() => {
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

  createEffect(() => {
    if (refreshKey) void savedCallback.current?.()
  }, [refreshKey])
}
