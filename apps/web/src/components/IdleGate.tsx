'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

/**
 * Delays third-party media (YouTube iframes) until the first-party page has
 * finished loading and the browser is idle. The trailer still autoplays once
 * mounted; on constrained connections this keeps the visitor's bandwidth on the
 * page's own LCP image instead of the embed's player payload.
 *
 * The idle step is the shared activation primitive rather than a second
 * implementation of it. The load wait stays here because the primitive schedules
 * from the moment it is called, and this gate must not fire before `load`.
 */
export default function IdleGate({
  children,
  fallback,
}: {
  children: ReactNode
  fallback: ReactNode
}) {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let release: (() => void) | undefined
    let cap: ReturnType<typeof setTimeout> | undefined

    const schedule = () => {
      if (release) return
      cap = undefined
      release = scheduleDeferredActivation({
        delay: 0,
        idleTimeout: 2500,
        onActivate: () => setIdle(true),
      })
    }

    if (document.readyState === 'complete') schedule()
    else {
      window.addEventListener('load', schedule, { once: true })
      // Never hold the embed past a hard cap, even if load stalls.
      cap = setTimeout(schedule, 6000)
    }

    return () => {
      window.removeEventListener('load', schedule)
      if (cap) clearTimeout(cap)
      release?.()
    }
  }, [])

  return <>{idle ? children : fallback}</>
}
