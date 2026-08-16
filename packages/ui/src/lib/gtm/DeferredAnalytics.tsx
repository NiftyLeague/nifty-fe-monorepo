'use client'

import { useEffect, useState } from 'react'

interface DeferredAnalyticsProps {
  includeWebVitals?: boolean
}

interface AnalyticsComponents {
  googleTagManager: React.ComponentType
  webVitals?: React.ComponentType
}

const ANALYTICS_DELAY = 5000
const ANALYTICS_ACTIVATION_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const

const DeferredAnalytics = ({
  includeWebVitals = true,
}: DeferredAnalyticsProps): React.ReactNode => {
  const [components, setComponents] = useState<AnalyticsComponents | null>(null)

  useEffect(() => {
    let cancelled = false
    let activated = false
    let idleId: number | null = null
    let timeoutId: number | null = null

    const removeInteractionListeners = () => {
      for (const eventName of ANALYTICS_ACTIVATION_EVENTS) {
        window.removeEventListener(eventName, activate)
      }
    }

    const cancelDeferredActivation = () => {
      if (idleId !== null) {
        window.cancelIdleCallback?.(idleId)
        idleId = null
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    const activate = async () => {
      if (cancelled || activated) return
      activated = true
      removeInteractionListeners()
      cancelDeferredActivation()

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

    for (const eventName of ANALYTICS_ACTIVATION_EVENTS) {
      window.addEventListener(eventName, activate, { once: true, passive: true })
    }

    if (window.requestIdleCallback) {
      timeoutId = window.setTimeout(() => {
        timeoutId = null
        idleId = window.requestIdleCallback(activate, { timeout: 1000 })
      }, ANALYTICS_DELAY)
    } else {
      timeoutId = window.setTimeout(activate, ANALYTICS_DELAY)
    }

    return () => {
      cancelled = true
      removeInteractionListeners()
      cancelDeferredActivation()
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
