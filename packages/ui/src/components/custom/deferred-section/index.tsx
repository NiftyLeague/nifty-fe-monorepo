'use client'

import type { ComponentType } from 'react'
import { useRef } from 'react'

import { buttonVariants } from '@nl/ui/base/button-variants'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import { cn } from '@nl/ui/utils'

import { buttonVariants } from '../../base/button-variants'

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
      <DeferredSkeleton className="h-6 w-40 rounded" />
      <div className="grid gap-4 sm:grid-cols-2">
        <DeferredSkeleton className="h-20 w-full rounded" />
        <DeferredSkeleton className="h-20 w-full rounded" />
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
  const isNearViewport = useOnScreen(sectionRef, rootMargin, { once: true })
  const {
    Component: LoadedSection,
    hasError: loadError,
    retry,
  } = useDeferredComponent(load, isNearViewport)

  return (
    <div ref={sectionRef} aria-busy={!LoadedSection && !loadError}>
      {loadError ? (
        <div
          className={`flex ${minHeightClassName ?? 'min-h-48'} flex-col items-center justify-center gap-3`}
          role="alert"
        >
          <p>{label} could not be loaded.</p>
          <button type="button" className={buttonVariants({ variant: 'outline' })} onClick={retry}>
            Retry
          </button>
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
