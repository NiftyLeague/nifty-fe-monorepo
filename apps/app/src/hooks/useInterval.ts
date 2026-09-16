import { createEffect, onCleanup } from 'solid-js'

function useInterval(callback: () => void, delay: number | null) {
  let savedCallback = callback

  createEffect(() => {
    savedCallback = callback
  })

  createEffect(() => {
    if (delay == null) return

    const id = setInterval(() => savedCallback(), delay)

    onCleanup(() => clearInterval(id))
  })
}

export default useInterval
