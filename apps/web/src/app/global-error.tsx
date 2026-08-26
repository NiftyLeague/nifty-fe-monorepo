'use client'

import { useEffect } from 'react'

import { GlobalErrorPage } from '@nl/ui/custom/global-error'

import { sentryOptions } from '@/constants/sentry'

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    void import('@nl/sentry-client/bootstrap').then(({ captureException }) =>
      captureException(error, sentryOptions)
    )
  }, [error])

  return (
    <html className="dark" lang="en">
      <body style={{ backgroundColor: '#09090b', color: '#fafafa', margin: 0 }}>
        <GlobalErrorPage onRetry={retry} />
      </body>
    </html>
  )
}
