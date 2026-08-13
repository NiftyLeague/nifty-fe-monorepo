'use client'

import NextError from 'next/error'
import { useEffect } from 'react'

import { sentryOptions } from '@/constants/sentry'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    void import('@nl/sentry-client/bootstrap').then(({ captureException }) =>
      captureException(error, sentryOptions)
    )
  }, [error])

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
