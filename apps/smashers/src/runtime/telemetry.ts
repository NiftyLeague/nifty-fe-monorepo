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
 *  - The web-vitals payload this app has always sent (`metric_id`,
 *    `metric_rating`) differs from the shared `sendWebVitals` shape
 *    (`metric_label`, `non_interaction`), so adopting that helper is an
 *    analytics decision rather than a refactor.
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
      const layer = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []

      void import('web-vitals')
        .then(({ onCLS, onINP, onLCP }) => {
          const report = (metric: { name: string; value: number; id: string; rating: string }) =>
            layer.push({
              event: 'web_vitals',
              metric_name: metric.name,
              metric_value: metric.value,
              metric_id: metric.id,
              metric_rating: metric.rating,
            })
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
