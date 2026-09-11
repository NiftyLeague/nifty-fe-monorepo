import { useEffect } from 'react'
import { Error404 } from '@nl/ui/custom/error-404'
import { GlobalErrorPage } from '@nl/ui/custom/global-error'
import RouteLoading from '@nl/ui/custom/route-loading'

import { sentryOptions } from '@/constants/sentry'

/** Full-document fallback for errors that escape every route boundary. */
export function RootErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    void import('@/runtime/sentry').then(({ captureException }) =>
      captureException(error, sentryOptions)
    )
  }, [error])

  return (
    <html className="dark" lang="en">
      <body style={{ backgroundColor: '#09090b', color: '#fafafa', margin: 0 }}>
        <GlobalErrorPage onRetry={reset} />
      </body>
    </html>
  )
}

export function RootNotFound() {
  return (
    <div className="dark">
      <Error404 className="min-h-[75vh] overflow-auto" />
    </div>
  )
}

export function RoutePending() {
  return <RouteLoading label="Loading Nifty League" />
}
