'use client'

import { useEffect, useState } from 'react'

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

    if (window.requestIdleCallback) {
      const idleId = window.requestIdleCallback(
        () => {
          void activate()
        },
        { timeout: 2000 }
      )
      return () => {
        cancelled = true
        window.cancelIdleCallback?.(idleId)
      }
    }

    const timeoutId = window.setTimeout(() => {
      void activate()
    }, 1000)
    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
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
