'use client'

import type { ComponentType } from 'react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@nl/ui/base/button'
import { Skeleton } from '@nl/ui/base/skeleton'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

interface DeferredSectionProps {
  label: string
  load: () => Promise<{ default: ComponentType }>
  minHeightClassName?: string
  rootMargin?: string
}

export function DeferredSectionLoading({
  label,
  minHeightClassName = 'min-h-48',
}: Pick<DeferredSectionProps, 'label' | 'minHeightClassName'>): React.ReactNode {
  return (
    <div
      className={`flex ${minHeightClassName} flex-col gap-4 rounded-md border border-border bg-muted p-4`}
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

export function DeferredSection({
  label,
  load,
  minHeightClassName,
  rootMargin = '320px',
}: DeferredSectionProps): React.ReactNode {
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

  return (
    <div ref={sectionRef} aria-busy={!LoadedSection && !loadError}>
      {loadError ? (
        <div
          className={`flex ${minHeightClassName ?? 'min-h-48'} flex-col items-center justify-center gap-3`}
          role="alert"
        >
          <p>{label} could not be loaded.</p>
          <Button variant="outline" onClick={() => setRetryCount((count) => count + 1)}>
            Retry
          </Button>
        </div>
      ) : LoadedSection ? (
        <LoadedSection />
      ) : (
        <DeferredSectionLoading label={label} minHeightClassName={minHeightClassName} />
      )}
    </div>
  )
}

export default DeferredSection
