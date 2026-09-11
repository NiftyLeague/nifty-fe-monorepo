import { useEffect } from 'react'

import type { SentryInitOptions } from '@/runtime/sentry'

interface DeferredSentryProps {
  enabled: boolean
  options: SentryInitOptions
}

/**
 * Loads Sentry after idle so the error client stays off the critical path.
 * Mirrors the shared `@nl/sentry-client/react` boundary without its framework-only
 * client module.
 */
export default function DeferredSentry({ enabled, options }: DeferredSentryProps) {
  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const initialize = () => {
      void import('@/runtime/sentry')
        .then(({ initializeSentry }) => {
          if (!cancelled) return initializeSentry(options)
        })
        .catch(() => {
          /* Monitoring is not on the rendering critical path. */
        })
    }

    const idleId =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(initialize, { timeout: 2000 })
        : globalThis.setTimeout(initialize, 0)

    return () => {
      cancelled = true
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId as number)
      else globalThis.clearTimeout(idleId as number)
    }
  }, [enabled, options])

  return null
}
