import { createEffect, onCleanup, type Accessor } from 'solid-js'
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async/dynamic'

type RefreshKey = string | number | Accessor<string | number | undefined> | undefined

export default function useAsyncInterval(
  callback: () => Promise<void>,
  delay: number | undefined,
  leading = true,
  ...refreshKeys: RefreshKey[]
): void {
  createEffect(() => {
    const tick = async () => {
      await callback()
    }

    let stopped = false
    let intervalId: ReturnType<typeof setIntervalAsync> | undefined

    const start = async () => {
      if (leading) await tick()
      if (!stopped && delay) intervalId = setIntervalAsync(tick, delay)
    }

    if (delay) void start()

    onCleanup(() => {
      stopped = true
      if (intervalId) void clearIntervalAsync(intervalId)
    })
  })

  createEffect(() => {
    const keys = refreshKeys.map((key) => (typeof key === 'function' ? key() : key))
    if (keys.some((key) => key !== undefined && key !== '')) void callback()
  })
}
