'use client'

import { useCallback, useEffect, useRef } from 'react'

type Callback = (...args: never[]) => void

/**
 * Shares one small, cancellable debounce implementation across client apps.
 * The callback ref keeps the pending timer on the same schedule while still
 * invoking the latest callback after a render.
 */
export function useDebouncedCallback<T extends Callback>(callback: T, delay: number) {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const cancel = useCallback(() => {
    if (timeoutRef.current === null) return
    clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }, [])

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      cancel()
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        callbackRef.current(...args)
      }, delay)
    },
    [cancel, delay]
  )

  useEffect(() => cancel, [cancel])

  return debounced
}

export default useDebouncedCallback
