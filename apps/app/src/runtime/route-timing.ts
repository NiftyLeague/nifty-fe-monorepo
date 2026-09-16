import type { RouterEvents } from '@tanstack/solid-router'

import { sendEvent } from '@nl/ui/gtm/events'
import { CATEGORIES } from '@nl/ui/gtm/constants'

interface SubscribableRouter {
  subscribe: <TType extends keyof RouterEvents>(
    eventType: TType,
    fn: (event: RouterEvents[TType]) => void
  ) => () => void
}

/**
 * Reports SPA route-transition latency to the data layer and the Performance
 * timeline. `onBeforeNavigate`→`onResolved` measures the full nav cost —
 * intent preload, loaders, and commit — for path-changing navigations only;
 * pure search/hash updates are excluded.
 *
 * Started from `DeferredAnalytics` so it inherits the telemetry gate and stays
 * off the critical path.
 */
export function startRouteTransitionReporting(router: SubscribableRouter): () => void {
  let navigationStartedAt = 0

  const unsubscribers = [
    router.subscribe('onBeforeNavigate', (event) => {
      if (event.pathChanged) navigationStartedAt = performance.now()
    }),
    router.subscribe('onResolved', (event) => {
      if (!event.pathChanged || navigationStartedAt === 0) return
      const startedAt = navigationStartedAt
      navigationStartedAt = 0
      const duration = performance.now() - startedAt

      performance.measure?.(`route: ${event.toLocation.pathname}`, {
        start: startedAt,
        duration,
      })
      sendEvent('route_transition', {
        event_category: CATEGORIES.ENGAGEMENT,
        event_label: event.toLocation.pathname,
        value: Math.round(duration),
      })
    }),
  ]

  return () => {
    for (const unsubscribe of unsubscribers) unsubscribe()
  }
}
