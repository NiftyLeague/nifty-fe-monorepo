const settings = document.getElementById('web-telemetry')
if (settings) {
  let started = false
  const activate = () => {
    if (started) return
    started = true
    for (const name of ['pointerdown', 'keydown', 'touchstart'])
      window.removeEventListener(name, activate)
    if (settings.dataset.analytics === 'true') {
      const layer = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []
      ;(window as unknown as { dataLayer: unknown[] }).dataLayer = layer
      layer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
      const script = document.createElement('script')
      script.id = 'web-gtm'
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
  }
  for (const name of ['pointerdown', 'keydown', 'touchstart'])
    window.addEventListener(name, activate, { once: true, passive: true })
  if ('requestIdleCallback' in window) window.requestIdleCallback(activate, { timeout: 3000 })
  else setTimeout(activate, 3000)
}
