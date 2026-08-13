'use client'

import type { ComponentType, ReactNode } from 'react'

import { Button } from '@nl/ui/base/button'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { Skeleton } from '@nl/ui/base/skeleton'

export interface DeferredComponentProps<T extends object> {
  enabled?: boolean
  errorFallback?: (onRetry: () => void) => ReactNode
  label: string
  load: () => Promise<{ default: ComponentType<T> }>
  loadingFallback?: ReactNode
  props: T
}

function DefaultLoading({ label }: Pick<DeferredComponentProps<object>, 'label'>) {
  return (
    <div className="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
      <Skeleton aria-hidden="true" className="h-8 w-32" />
      <span className="sr-only">Loading {label}</span>
    </div>
  )
}

function DefaultError({ label, onRetry }: { label: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
      <p>{label} could not be loaded.</p>
      <Button type="button" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

/**
 * Shared, cancellable lazy-component boundary for client-only features.
 * Keeping retry and accessibility behavior here prevents each app wrapper
 * from carrying its own copy of the same loading state machine.
 */
export function DeferredComponent<T extends object>({
  enabled = true,
  errorFallback,
  label,
  load,
  loadingFallback,
  props,
}: DeferredComponentProps<T>): ReactNode {
  const {
    Component: LoadedComponent,
    hasError: loadError,
    retry,
  } = useDeferredComponent(load, enabled)

  if (!enabled) return null

  if (loadError) {
    return errorFallback ? errorFallback(retry) : <DefaultError label={label} onRetry={retry} />
  }

  if (!LoadedComponent) return loadingFallback ?? <DefaultLoading label={label} />

  return <LoadedComponent {...props} />
}

export default DeferredComponent
