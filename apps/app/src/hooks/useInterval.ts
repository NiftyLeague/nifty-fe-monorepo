import { createEffect, onCleanup } from 'solid-js'

function useInterval(callback: () => void, delay: number | null) {
  createEffect(() => {
    if (delay == null) return

    // Decorative timers (sprite swaps, tickers) have no reason to run while
    // the tab is hidden; browsers coalesce hidden-tab timers to >=1s anyway,
    // so skip the work entirely instead of queueing stale ticks.
    const id = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      callback()
    }, delay)

    onCleanup(() => clearInterval(id))
  })
}

export default useInterval
