import { Show, type Component, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { Button } from '@nl/ui/base/button'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import { DEFERRED_RETRY_BUTTON_CLASS } from '@nl/ui/lib/deferred-boundary'

interface DeferredSectionProps {
  label: string
  load: () => Promise<{ default: Component }>
  minHeightClassName?: string
  rootMargin?: string
  loadingMode?: 'skeleton' | 'minimal'
}

// Keep deferred sections close enough to the viewport to avoid showing a
// skeleton during normal scrolling without eagerly loading lower-page media.
export const DEFAULT_DEFERRED_SECTION_ROOT_MARGIN = '160px'

export function DeferredSectionLoading(props: {
  label: string
  minHeightClassName?: string
  loadingMode?: 'skeleton' | 'minimal'
}): JSX.Element {
  const minHeightClassName = () => props.minHeightClassName ?? 'min-h-48'
  if (props.loadingMode === 'minimal') {
    return (
      <div
        class={`deferred-section-minimal ${minHeightClassName()}`}
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={`Loading ${props.label}`}
      >
        <span class="sr-only">Loading {props.label}</span>
      </div>
    )
  }

  return (
    <div
      class={`flex ${minHeightClassName()} flex-col gap-4 rounded-md border border-border bg-muted p-4`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading ${props.label}`}
    >
      <DeferredSkeleton class="h-6 w-40 rounded" />
      <div class="grid gap-4 sm:grid-cols-2">
        <DeferredSkeleton class="h-20 w-full rounded" />
        <DeferredSkeleton class="h-20 w-full rounded" />
      </div>
      <span class="sr-only">Loading {props.label}</span>
    </div>
  )
}

export function DeferredSection(props: DeferredSectionProps): JSX.Element {
  let sectionEl: HTMLDivElement | undefined
  const isNearViewport = useOnScreen(
    () => sectionEl,
    props.rootMargin ?? DEFAULT_DEFERRED_SECTION_ROOT_MARGIN,
    { once: true }
  )
  const {
    Component: LoadedSection,
    hasError: loadError,
    retry,
  } = useDeferredComponent(props.load, isNearViewport)

  return (
    <div
      ref={(el) => (sectionEl = el)}
      class="deferred-section"
      aria-busy={!LoadedSection() && !loadError()}
    >
      <Show
        when={!loadError()}
        fallback={
          <div
            class={`flex ${props.minHeightClassName ?? 'min-h-48'} flex-col items-center justify-center gap-3`}
            role="alert"
          >
            <p>{props.label} could not be loaded.</p>
            <Button
              type="button"
              data-slot="button"
              class={DEFERRED_RETRY_BUTTON_CLASS}
              onClick={retry}
            >
              Retry
            </Button>
          </div>
        }
      >
        <Show
          when={LoadedSection()}
          fallback={
            <DeferredSectionLoading
              label={props.label}
              minHeightClassName={props.minHeightClassName}
              loadingMode={props.loadingMode}
            />
          }
        >
          {(Loaded) => <Dynamic component={Loaded()} />}
        </Show>
      </Show>
    </div>
  )
}

export default DeferredSection
