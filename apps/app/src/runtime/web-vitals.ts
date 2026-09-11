import { sendWebVitals } from '@nl/ui/gtm/events'

/**
 * Reports Core Web Vitals to the GTM data layer.
 *
 * The shared `sendWebVitals` helper already owns the event shape, category, and
 * integer rounding that this app has always sent; only the subscription differs,
 * because TanStack Start has no framework web-vitals hook. The `web-vitals`
 * package reports the same metric names, so the payload is unchanged.
 */

const reported = new Set<string>()

const report = (metric: { id: string; name: string; value: number }) => {
  if (reported.has(metric.name)) return
  reported.add(metric.name)

  sendWebVitals(metric as Parameters<typeof sendWebVitals>[0])
}

/** Subscribes to web-vitals metrics. Safe to call more than once per page. */
export const startWebVitalsReporting = async (): Promise<void> => {
  const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals')
  onCLS(report)
  onINP(report)
  onLCP(report)
  onFCP(report)
  onTTFB(report)
}
