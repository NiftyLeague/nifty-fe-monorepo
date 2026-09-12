import { sendWebVitals } from '@nl/ui/gtm/events'
import { loadGoogleTagManager } from '@nl/ui/gtm/load'
import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

/**
 * Deferred client telemetry for the marketing site.
 *
 * Google Tag Manager, Web Vitals, and Sentry load on first user interaction or
 * at the first idle period (ceiling 3s), never on the critical path. The
 * activation primitive and the container loader are shared with the other
 * surfaces; the gating and the reported payload stay here because they are
 * per-app policy:
 *
 *  - GTM is included only when the page says `data-analytics="true"`, and the
 *    module only ships on a production build (see layouts/Base.astro).
 *  - Web Vitals are reported through the shared `sendWebVitals`, whose payload
 *    is this app's shape (`metric_id`, `metric_rating`, raw values) unified
 *    across every surface in #1903.
 */
const settings = document.getElementById('web-telemetry')

if (settings) {
  scheduleDeferredActivation({
    delay: 0,
    idleTimeout: 3000,
    onActivate: () => {
      if (settings.dataset.analytics === 'true') {
        loadGoogleTagManager('web-gtm')
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
      void import('@sentry/browser')
        .then(({ init, browserTracingIntegration }) =>
          init({
            integrations: [browserTracingIntegration()],
            dsn: 'https://97a944f1560b45018f013090ced577b3@o1377979.ingest.us.sentry.io/4504089815351296',
            sendDefaultPii: true,
            tracesSampleRate: 0.1,
            debug: false,
          })
        )
        .catch(() => {
          /* Monitoring is not on the rendering critical path. */
        })
    },
  })
}
