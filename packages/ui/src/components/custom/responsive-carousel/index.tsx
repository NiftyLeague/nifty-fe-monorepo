import {
  children as resolveChildren,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  onCleanup,
  onMount,
  Show,
  type JSX,
} from 'solid-js'
import { ChevronLeft, ChevronRight } from 'lucide-solid'

import { IconButton } from '@nl/ui/base/icon-button'
import { useDocumentVisibility } from '@nl/ui/hooks/useDocumentVisibility'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

import styles from './responsive-carousel.module.css'

export interface ResponsiveCarouselSettings {
  slidesToShow?: number
  slidesToScroll?: number
  infinite?: boolean
  rows?: number
  slidesPerRow?: number
  responsive?: Array<{
    breakpoint: number | { max?: number; min?: number }
    settings: Pick<ResponsiveCarouselSettings, 'slidesToShow' | 'rows' | 'slidesPerRow'>
  }>
}

export interface ResponsiveCarouselRef {
  slickNext: () => void
  slickPrev: () => void
}

export interface ResponsiveCarouselProps extends ResponsiveCarouselSettings {
  children: JSX.Element
  ariaLabel?: string
  autoPlay?: boolean
  autoPlaySpeed?: number
  controlsOnMobileOnly?: boolean
  mobileBreakpoint?: number
  showControls?: boolean
  showDots?: boolean
  className?: string
  slidePadding?: string
  /** Receives `{ slickNext, slickPrev }` — Solid's equivalent of the React ref API. */
  ref?: (api: ResponsiveCarouselRef) => void
}

const DEFAULT_ITEMS = 1
const DEFAULT_ROWS = 1
const DEFAULT_SLIDES_PER_ROW = 1
const DEFAULT_MOBILE_BREAKPOINT = 640

type EffectiveSettings = Required<
  Pick<
    ResponsiveCarouselSettings,
    'slidesToShow' | 'slidesToScroll' | 'infinite' | 'rows' | 'slidesPerRow'
  >
>

type ResponsiveBreakpoint = NonNullable<
  ResponsiveCarouselSettings['responsive']
>[number]['breakpoint']

const getBreakpointMax = (breakpoint: ResponsiveBreakpoint) =>
  typeof breakpoint === 'number' ? breakpoint : (breakpoint.max ?? Number.POSITIVE_INFINITY)

const resolveSettings = (
  settings: ResponsiveCarouselSettings,
  viewportWidth: number,
  sortedResponsive: NonNullable<ResponsiveCarouselSettings['responsive']>
): EffectiveSettings => {
  const base: EffectiveSettings = {
    slidesToShow: Math.max(1, settings.slidesToShow ?? DEFAULT_ITEMS),
    slidesToScroll: Math.max(1, settings.slidesToScroll ?? 1),
    infinite: settings.infinite ?? false,
    rows: Math.max(1, settings.rows ?? DEFAULT_ROWS),
    slidesPerRow: Math.max(1, settings.slidesPerRow ?? DEFAULT_SLIDES_PER_ROW),
  }

  if (!sortedResponsive.length || viewportWidth <= 0) return base

  const matchingBreakpoint = sortedResponsive.find(({ breakpoint }) => {
    if (typeof breakpoint === 'number') return viewportWidth <= breakpoint
    return (
      viewportWidth <= (breakpoint.max ?? Number.POSITIVE_INFINITY) &&
      viewportWidth >= (breakpoint.min ?? 0)
    )
  })

  if (!matchingBreakpoint) return base

  return {
    ...base,
    ...Object.fromEntries(
      Object.entries(matchingBreakpoint.settings).filter(([, value]) => value !== undefined)
    ),
  } as EffectiveSettings
}

export function ResponsiveCarousel(props: ResponsiveCarouselProps) {
  const slides = createMemo(() => resolveChildren(() => props.children).toArray() as JSX.Element[])
  const sortedResponsive = createMemo(() => {
    if (!props.responsive?.length)
      return [] as NonNullable<ResponsiveCarouselSettings['responsive']>
    return [...props.responsive].toSorted(
      (left, right) => getBreakpointMax(left.breakpoint) - getBreakpointMax(right.breakpoint)
    )
  })
  const settings = createMemo<ResponsiveCarouselSettings>(() => ({
    slidesToShow: props.slidesToShow,
    slidesToScroll: props.slidesToScroll,
    infinite: props.infinite,
    rows: props.rows,
    slidesPerRow: props.slidesPerRow,
    responsive: props.responsive,
  }))

  let viewportEl: HTMLDivElement | undefined
  const viewportId = createUniqueId()
  let activeIndex = 0
  let viewportWidthValue = 0
  let scrollFrame: number | null = null
  const [currentIndex, setCurrentIndex] = createSignal(0)
  const [viewportWidth, setViewportWidth] = createSignal(0)
  const [isPaused, setIsPaused] = createSignal(false)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isDocumentVisible = useDocumentVisibility()
  const autoPlay = () => props.autoPlay ?? false
  const isInViewport = useOnScreen(() => viewportEl, '0px', { enabled: autoPlay })

  const effectiveSettings = createMemo(() =>
    resolveSettings(settings(), viewportWidth(), sortedResponsive())
  )
  const itemsPerPage = () =>
    effectiveSettings().slidesToShow * effectiveSettings().rows * effectiveSettings().slidesPerRow
  const pages = createMemo(() => {
    const result: JSX.Element[][] = []
    const allSlides = slides()
    for (let index = 0; index < allSlides.length; index += itemsPerPage()) {
      result.push(allSlides.slice(index, index + itemsPerPage()))
    }
    return result
  })
  const maxIndex = () => Math.max(0, pages().length - 1)
  const isMobileViewport = () =>
    viewportWidth() > 0 && viewportWidth() < (props.mobileBreakpoint ?? DEFAULT_MOBILE_BREAKPOINT)
  const shouldShowControls = () =>
    (props.showControls ?? false) &&
    (!(props.controlsOnMobileOnly ?? false) || isMobileViewport()) &&
    maxIndex() > 0
  const shouldShowDots = () => (props.showDots ?? false) && shouldShowControls()

  const getPageWidth = () => viewportWidthValue

  const goToIndex = (requestedIndex: number) => {
    const viewport = viewportEl
    const pageWidth = getPageWidth()
    if (!viewport || !pageWidth || maxIndex() === 0) return

    const pageCount = maxIndex() + 1
    const nextIndex = effectiveSettings().infinite
      ? ((requestedIndex % pageCount) + pageCount) % pageCount
      : Math.min(maxIndex(), Math.max(0, requestedIndex))

    activeIndex = nextIndex
    setCurrentIndex(nextIndex)
    viewport.scrollTo({
      left: nextIndex * pageWidth,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  const moveBy = (direction: 1 | -1) => {
    goToIndex(activeIndex + direction * Math.max(1, effectiveSettings().slidesToScroll))
  }

  const slickNext = () => moveBy(1)
  const slickPrev = () => moveBy(-1)

  props.ref?.({ slickNext, slickPrev })

  onMount(() => {
    const updateViewport = () => {
      const nextWidth = viewportEl?.clientWidth ?? window.innerWidth
      if (nextWidth === viewportWidthValue) return

      viewportWidthValue = nextWidth
      setViewportWidth(nextWidth)
    }

    updateViewport()
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(updateViewport) : null
    if (resizeObserver && viewportEl) resizeObserver.observe(viewportEl)
    // ResizeObserver already tracks the element's effective width. Keep the
    // window listener only as the compatibility path for older browsers so
    // every carousel does not process the same resize twice.
    if (!resizeObserver) window.addEventListener('resize', updateViewport, { passive: true })

    onCleanup(() => {
      if (scrollFrame !== null) {
        window.cancelAnimationFrame(scrollFrame)
        scrollFrame = null
      }
      resizeObserver?.disconnect()
      if (!resizeObserver) window.removeEventListener('resize', updateViewport)
    })
  })

  createEffect(() => {
    const nextIndex = Math.min(activeIndex, maxIndex())
    activeIndex = nextIndex
    setCurrentIndex(nextIndex)
  })

  createEffect(() => {
    if (
      !autoPlay() ||
      !isInViewport() ||
      !isDocumentVisible() ||
      isPaused() ||
      prefersReducedMotion() ||
      maxIndex() === 0
    )
      return

    const interval = window.setInterval(slickNext, props.autoPlaySpeed ?? 4000)
    onCleanup(() => window.clearInterval(interval))
  })

  const handleScroll = () => {
    if (scrollFrame !== null) return

    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = null
      const pageWidth = getPageWidth()
      const viewport = viewportEl
      if (!viewport || !pageWidth) return

      const nextIndex = Math.min(
        maxIndex(),
        Math.max(0, Math.round(viewport.scrollLeft / pageWidth))
      )
      if (nextIndex === activeIndex) return

      activeIndex = nextIndex
      setCurrentIndex(nextIndex)
    })
  }

  const handleKeyDown = (event: KeyboardEvent & { currentTarget: HTMLDivElement }) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    if (event.key === 'ArrowRight') slickNext()
    else slickPrev()
  }

  const handleBlur = (event: FocusEvent & { currentTarget: HTMLDivElement }) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false)
  }

  const carouselStyle = () =>
    ({
      '--carousel-columns': effectiveSettings().slidesToShow,
      '--carousel-rows': effectiveSettings().rows * effectiveSettings().slidesPerRow,
    }) as JSX.CSSProperties

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={props.ariaLabel ?? 'Featured content'}
      class={`${styles.root} ${props.className ?? ''}`.trim()}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={handleBlur}
    >
      <div
        id={viewportId}
        ref={(el) => (viewportEl = el)}
        tabIndex={0}
        aria-label={`${props.ariaLabel ?? 'Featured content'} slides`}
        class={styles.viewport}
        style={carouselStyle()}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
      >
        <div class={styles.track}>
          <For each={pages()}>
            {(page, pageIndex) => (
              <div class={styles.page}>
                <For each={page}>
                  {(slide, slideIndex) => {
                    const absoluteIndex = pageIndex() * itemsPerPage() + slideIndex()
                    return (
                      <div
                        class={styles.slide}
                        style={
                          { '--carousel-slide-padding': props.slidePadding } as JSX.CSSProperties
                        }
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${absoluteIndex + 1} of ${slides().length}`}
                      >
                        {slide}
                      </div>
                    )
                  }}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>

      <Show when={shouldShowControls()}>
        <div class={styles.controls} aria-label="Carousel controls">
          <IconButton
            aria-label="Go to previous slide"
            aria-controls={viewportId}
            onClick={slickPrev}
          >
            <ChevronLeft aria-hidden="true" />
          </IconButton>
          <IconButton aria-label="Go to next slide" aria-controls={viewportId} onClick={slickNext}>
            <ChevronRight aria-hidden="true" />
          </IconButton>
        </div>
      </Show>

      <Show when={shouldShowDots()}>
        <div class={styles.dots} role="group" aria-label="Choose slide">
          <For each={pages()}>
            {(_, index) => (
              <IconButton
                aria-label={`Go to slide ${index() + 1}`}
                aria-controls={viewportId}
                aria-current={index() === currentIndex() ? 'true' : undefined}
                class={index() === currentIndex() ? styles.activeDot : styles.dot}
                onClick={() => goToIndex(index())}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default ResponsiveCarousel
