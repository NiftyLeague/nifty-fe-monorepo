'use client'

import type { ComponentType } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

interface DeferredDashboardSectionProps {
  load: () => Promise<{ default: ComponentType }>
  label: string
  rootMargin?: string
}

export function DashboardSectionLoading({ label }: { label: string }): React.ReactNode {
  return (
    <div
      className="min-h-48"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading ${label}`}
    >
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

  useEffect(() => {
    if (!isNearViewport || LoadedSection) return

    let cancelled = false
    load()
      .then(({ default: Section }) => {
        if (!cancelled) setLoadedSection(() => Section)
      })
      .catch(console.error)

    return () => {
      cancelled = true
    }
  }, [isNearViewport, load, LoadedSection])

  return (
    <div ref={sectionRef} aria-busy={!LoadedSection}>
      {LoadedSection ? <LoadedSection /> : <DashboardSectionLoading label={label} />}
    </div>
  )
}
