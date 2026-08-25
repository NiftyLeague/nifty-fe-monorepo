'use client'

import { startTransition, useEffect, useState } from 'react'

import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

export interface UseDeferredActivationOptions {
  delay?: number
  enabled?: boolean
}

/**
 * Gates non-essential client work behind shared interaction/idle activation.
 * Multiple consumers share the underlying listeners and timer through
 * scheduleDeferredActivation, so mounting more deferred features does not
 * multiply global event handlers.
 */
export default function useDeferredActivation({
  delay,
  enabled = true,
}: UseDeferredActivationOptions = {}): boolean {
  const [isActivated, setIsActivated] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setIsActivated(false)
      return
    }

    let active = true
    const cleanup = scheduleDeferredActivation({
      delay,
      onActivate: () => {
        if (!active) return
        startTransition(() => setIsActivated(true))
      },
    })

    return () => {
      active = false
      cleanup()
    }
  }, [delay, enabled])

  return isActivated
}
