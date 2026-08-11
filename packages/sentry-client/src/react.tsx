'use client'

import { useEffect } from 'react'

type SentryInitOptions = Parameters<(typeof import('@sentry/nextjs'))['init']>[0]

interface DeferredSentryProps {
  enabled: boolean
  options: SentryInitOptions
}

export default function DeferredSentry({ enabled, options }: DeferredSentryProps) {
  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    void import('./bootstrap').then(({ scheduleSentryInit }) => {
      if (!cancelled) scheduleSentryInit(true, options)
    })

    return () => {
      cancelled = true
    }
  }, [enabled, options])

  return null
}
