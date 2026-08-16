'use client'

import { useEffect, useState } from 'react'

import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

interface DeferredAnalyticsProps {
  includeWebVitals?: boolean
}

interface AnalyticsComponents {
  googleTagManager: React.ComponentType
  webVitals?: React.ComponentType
}

const DeferredAnalytics = ({
  includeWebVitals = true,
}: DeferredAnalyticsProps): React.ReactNode => {
  const [components, setComponents] = useState<AnalyticsComponents | null>(null)

  useEffect(() => {
    let cancelled = false

    const activate = async () => {
      if (cancelled) return

      const [googleTagManagerModule, webVitalsModule] = await Promise.all([
        import('./GoogleTagManager'),
        includeWebVitals ? import('./WebVitals') : Promise.resolve(undefined),
      ])

      if (!cancelled) {
        setComponents({
          googleTagManager: googleTagManagerModule.default,
          webVitals: webVitalsModule?.default,
        })
      }
    }

    const cleanup = scheduleDeferredActivation({ onActivate: activate })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [includeWebVitals])

  if (!components) return null

  const GoogleTagManager = components.googleTagManager
  const WebVitals = components.webVitals

  return (
    <>
      <GoogleTagManager />
      {WebVitals && <WebVitals />}
    </>
  )
}

export default DeferredAnalytics
