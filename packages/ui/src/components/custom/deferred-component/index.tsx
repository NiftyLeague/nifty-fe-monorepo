import { Show, type Component, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { DEFERRED_RETRY_BUTTON_CLASS } from '@nl/ui/lib/deferred-boundary'

export interface DeferredComponentProps<T extends object> {
  disabledFallback?: JSX.Element
  enabled?: boolean
  errorFallback?: (onRetry: () => void) => JSX.Element
  label: string
  load: () => Promise<{ default: Component<T> }>
  loadingFallback?: JSX.Element
  props: T
}

function DefaultLoading(props: { label: string }) {
  return (
    <div class="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
      <DeferredSkeleton aria-hidden="true" class="h-8 w-32" />
      <span class="sr-only">Loading {props.label}</span>
    </div>
  )
}

function DefaultError(props: { label: string; onRetry: () => void }) {
  return (
    <div class="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
      <p>{props.label} could not be loaded.</p>
      <button
        type="button"
        data-slot="button"
        class={DEFERRED_RETRY_BUTTON_CLASS}
        onClick={props.onRetry}
      >
        Retry
      </button>
    </div>
  )
}

/**
 * Shared, cancellable lazy-component boundary for client-only features.
 * Keeping retry and accessibility behavior here prevents each app wrapper
 * from carrying its own copy of the same loading state machine.
 */
export function DeferredComponent<T extends object>(props: DeferredComponentProps<T>): JSX.Element {
  const {
    Component: LoadedComponent,
    hasError: loadError,
    retry,
  } = useDeferredComponent(props.load, () => props.enabled ?? true)

  return (
    <Show when={props.enabled ?? true} fallback={props.disabledFallback ?? null}>
      <Show
        when={!loadError()}
        fallback={
          props.errorFallback ? (
            props.errorFallback(retry)
          ) : (
            <DefaultError label={props.label} onRetry={retry} />
          )
        }
      >
        <Show
          when={LoadedComponent()}
          fallback={props.loadingFallback ?? <DefaultLoading label={props.label} />}
        >
          {(Loaded) => <Dynamic component={Loaded()} {...props.props} />}
        </Show>
      </Show>
    </Show>
  )
}

export default DeferredComponent
