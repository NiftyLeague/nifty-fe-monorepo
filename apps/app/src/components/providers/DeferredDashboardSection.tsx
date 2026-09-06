'use client'

import type { ComponentType } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@nl/ui/base/button'
import { Skeleton } from '@nl/ui/base/skeleton'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

interface DeferredDashboardSectionProps {
  load: () => Promise<{ default: ComponentType }>
  label: string
  rootMargin?: string
}

export function DashboardSectionLoading({ label }: { label: string }): React.ReactNode {
  return (
    <div
      className="flex min-h-48 flex-col gap-4 rounded-md border border-border bg-muted p-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading ${label}`}
    >
      <Skeleton className="h-6 w-40 rounded" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-20 w-full rounded" />
        <Skeleton className="h-20 w-full rounded" />
      </div>
      <span className="sr-only">Loading {label}</span>
    </div>
  )
}

/** Loads below-the-fold dashboard content shortly before it enters the viewport. */
export default function DeferredDashboardSection({
  load,
  label,
  rootMargin = '320px',
}: DeferredDashboardSectionProps): React.ReactNode {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(sectionRef, rootMargin)
  const [LoadedSection, setLoadedSection] = useState<ComponentType | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!isNearViewport || LoadedSection) return

    let cancelled = false
    setLoadError(false)
    load()
      .then(({ default: Section }) => {
        if (!cancelled) setLoadedSection(() => Section)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })

    return () => {
      cancelled = true
    }
  }, [isNearViewport, load, LoadedSection, retryCount])

  if (loadError) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
        <p>{label} could not be loaded.</p>
        <Button variant="outline" onClick={() => setRetryCount((count) => count + 1)}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div ref={sectionRef} aria-busy={!LoadedSection}>
      {LoadedSection ? <LoadedSection /> : <DashboardSectionLoading label={label} />}
    </div>
  )
}
