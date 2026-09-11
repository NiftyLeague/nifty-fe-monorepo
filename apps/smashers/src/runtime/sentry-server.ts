import { sentryOptions } from '@/constants/sentry'

/**
 * Server-side error capture.
 *
 * The Next build initialised Sentry on the server and edge runtimes and
 * forwarded request errors from `instrumentation.ts`. Astro's SSR function has
 * no framework error hook, so `src/middleware.ts` reports the same class of
 * failures from a catch-all around the route handler.
 *
 * The SDK is imported lazily and only in production, matching the previous
 * production-gated setup: importing it in dev would add start-up cost and
 * noise for errors that never leave the machine.
 */
type ServerSentry = typeof import('@sentry/node')

let serverSentryPromise: Promise<ServerSentry | undefined> | undefined

const isProduction = (): boolean =>
  process.env.PUBLIC_DEPLOY_ENV === 'production' || process.env.VERCEL_ENV === 'production'

const loadServerSentry = (): Promise<ServerSentry | undefined> => {
  serverSentryPromise ??= isProduction()
    ? import('@sentry/node').then((sentry) => {
        sentry.init({
          ...sentryOptions,
          // Server functions are short-lived; tracing them adds overhead without
          // adding signal beyond what the client sampling already covers.
          tracesSampleRate: 0,
        })
        return sentry
      })
    : Promise.resolve(undefined)
  return serverSentryPromise
}

export const captureServerError = async (
  error: unknown,
  context: { request: Request; url: URL }
): Promise<void> => {
  try {
    const sentry = await loadServerSentry()
    if (!sentry) return

    sentry.captureException(error, {
      tags: {
        method: context.request.method,
        route: context.url.pathname,
      },
    })
  } catch {
    // Observability must never turn a handled error into a failed response.
  }
}
