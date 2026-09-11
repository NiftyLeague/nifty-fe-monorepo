import { startTransition, useEffect, useState } from 'react'

import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

/**
 * Defers analytics until first interaction or idle, matching the app's previous
 * deferred GTM boundary while keeping the Web Vitals reporter app-local (the
 * shared one is built on Next's web-vitals hook).
 */
export default function DeferredAnalytics(): React.ReactNode {
  const [GoogleTagManager, setGoogleTagManager] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    let cancelled = false

    const activate = async () => {
      const [gtmModule] = await Promise.all([
        import('@nl/ui/gtm/deferred-manager'),
        import('@/runtime/web-vitals')
          .then(({ startWebVitalsReporting }) => startWebVitalsReporting())
          .catch(() => {
            /* Analytics must never block the page. */
          }),
      ])

      if (!cancelled) {
        startTransition(() => setGoogleTagManager(() => gtmModule.default))
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
