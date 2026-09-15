import { createEffect } from 'solid-js'
import { Error404 } from '@nl/ui/custom/error-404'
import { GlobalErrorPage } from '@nl/ui/custom/global-error'

import { sentryOptions } from '@/constants/sentry'

/** Full-document fallback for errors that escape every route boundary. */
export function RootErrorBoundary({ error, reset }: { error: unknown; reset: () => void }) {
  createEffect(() => {
    // The router hands the thrown value through as `unknown`; only report the
    // ones that are actual Errors so the Sentry payload stays structured.
    if (error instanceof Error) {
      void import('@/runtime/sentry').then(({ captureException }) =>
        captureException(error, sentryOptions)
      )
    }
  }, [error])

  return (
    <html class="dark" lang="en">
      <body style={{ 'background-color': '#09090b', color: '#fafafa', margin: 0 }}>
        <GlobalErrorPage onRetry={reset} />
      </body>
    </html>
  )
}

export function RootNotFound() {
  return (
    <div class="dark">
      <Error404 class="min-h-[75vh] overflow-auto" />
    </div>
  )
}
