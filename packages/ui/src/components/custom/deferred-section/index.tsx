'use client'

import { memo, useRef, type ComponentType } from 'react'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import { DEFERRED_RETRY_BUTTON_CLASS } from '@nl/ui/lib/deferred-boundary'

interface DeferredSectionProps {
  label: string
  load: () => Promise<{ default: ComponentType }>
  minHeightClassName?: string
  rootMargin?: string
  loadingMode?: 'skeleton' | 'minimal'
}

// Keep deferred sections close enough to the viewport to avoid showing a
// skeleton during normal scrolling without eagerly loading lower-page media.
export const DEFAULT_DEFERRED_SECTION_ROOT_MARGIN = '160px'

export function DeferredSectionLoading({
  label,
  minHeightClassName = 'min-h-48',
  loadingMode = 'skeleton',
}: Pick<DeferredSectionProps, 'label' | 'minHeightClassName' | 'loadingMode'>): React.ReactNode {
  if (loadingMode === 'minimal') {
    return (
      <div
        className={`deferred-section-minimal ${minHeightClassName}`}
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={`Loading ${label}`}
      >
        <span className="sr-only">Loading {label}</span>
      </div>
    )
  }

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

export const DeferredSection = memo(function DeferredSection({
  label,
  load,
  minHeightClassName,
  rootMargin = DEFAULT_DEFERRED_SECTION_ROOT_MARGIN,
  loadingMode,
}: DeferredSectionProps): React.ReactNode {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(sectionRef, rootMargin, { once: true })
  const {
    Component: LoadedSection,
    hasError: loadError,
    retry,
  } = useDeferredComponent(load, isNearViewport)

  return (
    <div ref={sectionRef} className="deferred-section" aria-busy={!LoadedSection && !loadError}>
      {loadError ? (
        <div
          className={`flex ${minHeightClassName ?? 'min-h-48'} flex-col items-center justify-center gap-3`}
          role="alert"
        >
          <p>{label} could not be loaded.</p>
          <button
            type="button"
            data-slot="button"
            className={DEFERRED_RETRY_BUTTON_CLASS}
            onClick={retry}
          >
            Retry
          </button>
        </div>
      ) : LoadedSection ? (
        <LoadedSection />
      ) : (
        <DeferredSectionLoading
          label={label}
          minHeightClassName={minHeightClassName}
          loadingMode={loadingMode}
        />
      )}
    </div>
  )
})

export default DeferredSection
