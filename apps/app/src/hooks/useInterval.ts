'use client'

import { createEffect } from 'solid-js'

function useInterval(callback: () => void, delay: number | null) {
  let savedCallback: any = callback

  createEffect(() => {
    savedCallback.current = callback
  }, [callback])

  createEffect(() => {
    if (delay == null) return

    const id = setInterval(() => savedCallback.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}

export default useInterval
