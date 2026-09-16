import { createEffect } from 'solid-js'
import { Error404 } from '@nl/ui/custom/error-404'
import { GlobalErrorPage } from '@nl/ui/custom/global-error'

import { sentryOptions } from '@/constants/sentry'

/** Full-document fallback for errors that escape every route boundary. */
export function RootErrorBoundary(props: { error: unknown; reset: () => void }) {
  createEffect(() => {
    // The router hands the thrown value through as `unknown`; only report the
    // ones that are actual Errors so the Sentry payload stays structured.
    const error = props.error
    if (error instanceof Error) {
      void import('@/runtime/sentry').then(({ captureException }) =>
        captureException(error, sentryOptions)
      )
    }
  })

  return (
    <html class="dark" lang="en">
      <body class="m-0 bg-base-950 text-base-50">
        <GlobalErrorPage onRetry={props.reset} />
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
