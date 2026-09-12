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
 *  - The web-vitals payload this app has always sent (`metric_id`,
 *    `metric_rating`) differs from the shared `sendWebVitals` shape
 *    (`metric_label`, `non_interaction`), so adopting that helper is an
 *    analytics decision rather than a refactor.
 */
const settings = document.getElementById('web-telemetry')

if (settings) {
  scheduleDeferredActivation({
    delay: 0,
    idleTimeout: 3000,
    onActivate: () => {
      if (settings.dataset.analytics === 'true') {
        loadGoogleTagManager('web-gtm')
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
