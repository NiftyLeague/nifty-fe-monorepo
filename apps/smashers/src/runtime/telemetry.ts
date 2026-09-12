import { sendWebVitals } from '@nl/ui/gtm/events'
import { loadGoogleTagManager } from '@nl/ui/gtm/load'
import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

import { sentryOptions } from '@/constants/sentry'

/**
 * Deferred client telemetry: Google Tag Manager, Web Vitals and Sentry load on
 * first user interaction or at the first idle period (ceiling 3s), never on the
 * critical path. The activation primitive and the container loader are shared
 * with the other surfaces; the gating and the reported payload stay here because
 * they are per-app policy:
 *
 *  - The two enable flags are read from the document element, which the base
 *    layout sets from the build environment.
 *  - Web Vitals are reported through the shared `sendWebVitals`, whose payload
 *    is this app's shape (`metric_id`, `metric_rating`, raw values) unified
 *    across every surface in #1903.
 *
 * This replaces the Next instrumentation-client / layout DeferredSentry pair.
 * `@sentry/browser` replaces `@sentry/nextjs` because there is no Next runtime
 * to hook into, and the router-transition capture that existed only for the
 * Next App Router is intentionally gone.
 */
const SENTRY_ENABLED = document.documentElement.dataset.sentryEnabled === 'true'
const ANALYTICS_ENABLED = document.documentElement.dataset.analytics !== 'false'

scheduleDeferredActivation({
  delay: 0,
  idleTimeout: 3000,
  onActivate: () => {
    if (ANALYTICS_ENABLED) {
      loadGoogleTagManager('smashers-gtm')

      void import('web-vitals')
        .then(({ onCLS, onINP, onLCP }) => {
          const report = (metric: Parameters<typeof sendWebVitals>[0]) => sendWebVitals(metric)
          onCLS(report)
          onINP(report)
          onLCP(report)
        })
        .catch(() => {
          /* Analytics must not prevent navigation. */
        })
    }

    if (SENTRY_ENABLED) {
      void import('@sentry/browser')
        .then(({ init, browserTracingIntegration }) =>
          init({ integrations: [browserTracingIntegration()], ...sentryOptions })
        )
        .catch(() => {
          /* Monitoring is not on the rendering critical path. */
        })
    }
  },
})
