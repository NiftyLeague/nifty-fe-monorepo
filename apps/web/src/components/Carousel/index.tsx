import { Show, type JSX } from 'solid-js'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

export interface NiftyCarouselProps {
  children?: JSX.Element
  isMobileViewOnly?: boolean
  mobileItems?: number
  tabletItems?: number
  desktopItems?: number
  superLargeDesktopItems?: number
  hideGradient?: boolean
  ariaLabel?: string
}

const loadInteractiveCarousel = () => import('./InteractiveCarousel')

// Keep the interactive carousel close enough to the viewport for a smooth
// handoff without loading its client bundle during the first scroll segment.
export const CAROUSEL_ROOT_MARGIN = '160px 0px'

const NiftyCarousel = (props: NiftyCarouselProps) => {
  let containerEl: HTMLDivElement | undefined
  const isNearViewport = useOnScreen(() => containerEl, CAROUSEL_ROOT_MARGIN, { once: true })
  const { Component: InteractiveCarousel } = useDeferredComponent<NiftyCarouselProps>(
    loadInteractiveCarousel,
    isNearViewport
  )

  return (
    <div ref={(el) => (containerEl = el)} class="relative">
      <Show
        when={InteractiveCarousel()}
        fallback={
          <StaticCarousel mobileItems={props.mobileItems} hideGradient={props.hideGradient}>
            {props.children}
          </StaticCarousel>
        }
      >
        {(DeferredCarousel) => {
          const CarouselComponent = DeferredCarousel()
          return (
            <CarouselComponent
              isMobileViewOnly={props.isMobileViewOnly}
              mobileItems={props.mobileItems}
              tabletItems={props.tabletItems}
              desktopItems={props.desktopItems}
              superLargeDesktopItems={props.superLargeDesktopItems}
              hideGradient={props.hideGradient}
              ariaLabel={props.ariaLabel}
            >
              {props.children}
            </CarouselComponent>
          )
        }}
      </Show>
    </div>
  )
}

const StaticCarousel = (
  props: Pick<NiftyCarouselProps, 'children' | 'mobileItems' | 'hideGradient'>
) => {
  const itemBasis = `${100 / (props.mobileItems ?? 1)}%`
  const items = () => {
    const raw = props.children
    return Array.isArray(raw) ? raw : raw !== undefined && raw !== null ? [raw] : []
  }

  return (
    <>
      <div class="overflow-hidden">
        <div class="flex items-stretch">
          {items().map((child, _index) => (
            <div
              class="min-w-0 grow-0 shrink-0 basis-(--carousel-item-basis) px-5"
              style={{ '--carousel-item-basis': itemBasis }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      <Show when={!props.hideGradient}>
        <div class="dark-gradient-overlay !top-0 !h-full" />
      </Show>
    </>
  )
}

export default NiftyCarousel
