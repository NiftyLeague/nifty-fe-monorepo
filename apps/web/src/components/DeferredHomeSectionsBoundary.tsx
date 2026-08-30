'use client'

import { useRef } from 'react'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import { DEFERRED_RETRY_BUTTON_CLASS } from '@nl/ui/lib/deferred-boundary'

import { HOME_SECTION_CONFIG, HOME_SECTION_ROOT_MARGIN } from './home-section-config'

const loadDeferredHomeSections = () => import('./DeferredHomeSections')

function DeferredHomeSectionPlaceholders({
  firstRef,
}: {
  firstRef: React.RefObject<HTMLDivElement | null>
}) {
  return HOME_SECTION_CONFIG.map(({ label, minHeightClassName }, index) => (
    <div
      key={label}
      ref={index === 0 ? firstRef : undefined}
      className={`deferred-section-minimal ${minHeightClassName}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading ${label}`}
    >
      <span className="sr-only">Loading {label}</span>
    </div>
  ))
}

export function DeferredHomeSectionsBoundary() {
  const firstSectionRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(firstSectionRef, HOME_SECTION_ROOT_MARGIN, { once: true })
  const {
    Component: DeferredHomeSections,
    hasError,
    retry,
  } = useDeferredComponent(loadDeferredHomeSections, isNearViewport)

  if (hasError) {
    return (
      <div className="flex min-h-[32rem] flex-col items-center justify-center gap-3" role="alert">
        <p>Homepage sections could not be loaded.</p>
        <button
          type="button"
          data-slot="button"
          className={DEFERRED_RETRY_BUTTON_CLASS}
          onClick={retry}
        >
          Retry
        </button>
      </div>
    )
  }

  return DeferredHomeSections ? (
    <DeferredHomeSections />
  ) : (
    <DeferredHomeSectionPlaceholders firstRef={firstSectionRef} />
  )
}

export default DeferredHomeSectionsBoundary
