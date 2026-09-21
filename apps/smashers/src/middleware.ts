import { defineMiddleware } from 'astro:middleware'

import { captureServerError } from './runtime/sentry-server'

// The platform config used to apply these to every response; on Workers the
// `_headers` file only covers static assets, so SSR responses get them here.
const SECURITY_HEADERS = {
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

/**
 * Two jobs in one handler (Astro supports a single `onRequest`): report
 * unhandled route errors to Sentry — replacing the Next `instrumentation.ts`
 * `onRequestError` hook — and stamp the security headers the platform config
 * used to apply to every response.
 *
 * Middleware only runs for matched routes, which is sufficient here: the paths
 * that used to need a redirect (`/ios`, `/invite/...`) are real route files
 * because Astro resolves routing before middleware, so this hook has no
 * redirect responsibility left.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const response = await next()
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(name, value)
    }
    return response
  } catch (error) {
    await captureServerError(error, { request: context.request, url: context.url })
    // Re-throw so Astro still renders its error response for the visitor.
    throw error
  }
})
