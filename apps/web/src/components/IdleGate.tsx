'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

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
