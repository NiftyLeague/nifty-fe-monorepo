'use client'

import { startTransition, useEffect, useState } from 'react'

import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

interface GoogleTagManagerComponent {
  default: React.ComponentType
}

/** Loads only the shared GTM client boundary, without Next-only Web Vitals code. */
export default function DeferredGoogleTagManager(): React.ReactNode {
  const [GoogleTagManager, setGoogleTagManager] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    let cancelled = false

    const activate = async () => {
      const module = (await import('./GoogleTagManager')) as GoogleTagManagerComponent
      if (!cancelled) {
        startTransition(() => setGoogleTagManager(() => module.default))
      }
    }

    const cleanup = scheduleDeferredActivation({ onActivate: activate })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return GoogleTagManager ? <GoogleTagManager /> : null
}
