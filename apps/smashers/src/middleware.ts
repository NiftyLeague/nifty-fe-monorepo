import { defineMiddleware } from 'astro:middleware'

import { captureServerError } from './runtime/sentry-server'

/**
 * Reports unhandled route errors to Sentry, replacing the Next
 * `instrumentation.ts` `onRequestError` hook.
 *
 * Middleware only runs for matched routes, which is sufficient here: the paths
 * that used to need a redirect (`/ios`, `/invite/...`) are real route files
 * because Astro resolves routing before middleware, so this hook has no
 * redirect responsibility left.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  try {
    return await next()
  } catch (error) {
    await captureServerError(error, { request: context.request, url: context.url })
    // Re-throw so Astro still renders its error response for the visitor.
    throw error
  }
})
