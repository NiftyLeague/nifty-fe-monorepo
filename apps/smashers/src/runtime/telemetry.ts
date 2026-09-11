import { sentryOptions } from '@/constants/sentry'

/**
 * Deferred client telemetry: Google Tag Manager, Web Vitals and Sentry load on
 * first user interaction or idle, never on the critical path.
 *
 * This replaces the Next instrumentation-client / layout DeferredSentry pair.
 * `@sentry/browser` replaces `@sentry/nextjs` because there is no Next runtime
 * to hook into, and the router-transition capture that existed only for the
 * Next App Router is intentionally gone.
 */
const SENTRY_ENABLED = document.documentElement.dataset.sentryEnabled === 'true'
const ANALYTICS_ENABLED = document.documentElement.dataset.analytics !== 'false'

const ACTIVATION_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const

let started = false
const activate = () => {
  if (started) return
  started = true
  for (const name of ACTIVATION_EVENTS) window.removeEventListener(name, activate)

  if (ANALYTICS_ENABLED) {
    const layer = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []
    ;(window as unknown as { dataLayer: unknown[] }).dataLayer = layer
    layer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

    const script = document.createElement('script')
    script.id = 'smashers-gtm'
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MHCXVXJZ'
    document.head.append(script)

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
}

for (const name of ACTIVATION_EVENTS) {
  window.addEventListener(name, activate, { once: true, passive: true })
}
if ('requestIdleCallback' in window) window.requestIdleCallback(activate, { timeout: 3000 })
else setTimeout(activate, 3000)
