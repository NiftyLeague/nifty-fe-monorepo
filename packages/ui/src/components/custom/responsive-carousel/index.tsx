'use client'

import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { IconButton } from '@nl/ui/base/icon-button'
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
  children: ReactNode
  ariaLabel?: string
  autoPlay?: boolean
  autoPlaySpeed?: number
  controlsOnMobileOnly?: boolean
  mobileBreakpoint?: number
  showControls?: boolean
  showDots?: boolean
  className?: string
  slidePadding?: string
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
  viewportWidth: number
): EffectiveSettings => {
  const base: EffectiveSettings = {
    slidesToShow: Math.max(1, settings.slidesToShow ?? DEFAULT_ITEMS),
    slidesToScroll: Math.max(1, settings.slidesToScroll ?? 1),
    infinite: settings.infinite ?? false,
    rows: Math.max(1, settings.rows ?? DEFAULT_ROWS),
    slidesPerRow: Math.max(1, settings.slidesPerRow ?? DEFAULT_SLIDES_PER_ROW),
  }

  if (!settings.responsive?.length || viewportWidth <= 0) return base

  const matchingBreakpoint = [...settings.responsive]
    .sort((left, right) => getBreakpointMax(left.breakpoint) - getBreakpointMax(right.breakpoint))
    .find(({ breakpoint }) => {
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

const ResponsiveCarousel = forwardRef<ResponsiveCarouselRef, ResponsiveCarouselProps>(
  (
    {
      children,
      ariaLabel = 'Featured content',
      autoPlay = false,
      autoPlaySpeed = 4000,
      controlsOnMobileOnly = false,
      mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
      showControls = false,
      showDots = false,
      className,
      slidePadding,
      slidesToShow,
      slidesToScroll,
      infinite,
      rows,
      slidesPerRow,
      responsive,
    },
    ref
  ) => {
    const slides = useMemo(() => Children.toArray(children), [children])
    const settings = useMemo<ResponsiveCarouselSettings>(
      () => ({ slidesToShow, slidesToScroll, infinite, rows, slidesPerRow, responsive }),
      [infinite, responsive, rows, slidesPerRow, slidesToScroll, slidesToShow]
    )
    const viewportRef = useRef<HTMLDivElement>(null)
    const viewportId = useId()
    const activeIndexRef = useRef(0)
    const scrollFrameRef = useRef<number | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [viewportWidth, setViewportWidth] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
    const isInViewport = useOnScreen(viewportRef, '0px', { enabled: autoPlay })

    const effectiveSettings = useMemo(
      () => resolveSettings(settings, viewportWidth),
      [settings, viewportWidth]
    )
    const itemsPerPage =
      effectiveSettings.slidesToShow * effectiveSettings.rows * effectiveSettings.slidesPerRow
    const pages = useMemo(() => {
      const result: ReactNode[][] = []

      for (let index = 0; index < slides.length; index += itemsPerPage) {
        result.push(slides.slice(index, index + itemsPerPage))
      }

      return result
    }, [itemsPerPage, slides])
    const maxIndex = Math.max(0, pages.length - 1)
    const isMobileViewport = viewportWidth > 0 && viewportWidth < mobileBreakpoint
    const shouldShowControls =
      showControls && (!controlsOnMobileOnly || isMobileViewport) && maxIndex > 0
    const shouldShowDots = showDots && shouldShowControls

    const getPageWidth = useCallback(() => viewportRef.current?.clientWidth ?? 0, [])

    const goToIndex = useCallback(
      (requestedIndex: number) => {
        const viewport = viewportRef.current
        const pageWidth = getPageWidth()
        if (!viewport || !pageWidth || maxIndex === 0) return

        const pageCount = maxIndex + 1
        const nextIndex = effectiveSettings.infinite
          ? ((requestedIndex % pageCount) + pageCount) % pageCount
          : Math.min(maxIndex, Math.max(0, requestedIndex))

        activeIndexRef.current = nextIndex
        setActiveIndex(nextIndex)
        viewport.scrollTo({
          left: nextIndex * pageWidth,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        })
      },
      [effectiveSettings, getPageWidth, maxIndex, prefersReducedMotion]
    )

    const moveBy = useCallback(
      (direction: 1 | -1) => {
        goToIndex(
          activeIndexRef.current + direction * Math.max(1, effectiveSettings.slidesToScroll)
        )
      },
      [effectiveSettings.slidesToScroll, goToIndex]
    )

    const slickNext = useCallback(() => {
      moveBy(1)
    }, [moveBy])

    const slickPrev = useCallback(() => {
      moveBy(-1)
    }, [moveBy])

    useImperativeHandle(ref, () => ({ slickNext, slickPrev }), [slickNext, slickPrev])

    useEffect(() => {
      const updateViewport = () =>
        setViewportWidth(viewportRef.current?.clientWidth ?? window.innerWidth)

      updateViewport()
      const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(updateViewport) : null
      if (resizeObserver && viewportRef.current) resizeObserver.observe(viewportRef.current)
      // ResizeObserver already tracks the element's effective width. Keep the
      // window listener only as the compatibility path for older browsers so
      // every carousel does not process the same resize twice.
      if (!resizeObserver) window.addEventListener('resize', updateViewport, { passive: true })

      return () => {
        if (scrollFrameRef.current !== null) {
          window.cancelAnimationFrame(scrollFrameRef.current)
          scrollFrameRef.current = null
        }
        resizeObserver?.disconnect()
        if (!resizeObserver) window.removeEventListener('resize', updateViewport)
      }
    }, [])

    useEffect(() => {
      const nextIndex = Math.min(activeIndexRef.current, maxIndex)
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
    }, [maxIndex])

    useEffect(() => {
      if (!autoPlay || !isInViewport || isPaused || prefersReducedMotion || maxIndex === 0) return

      const interval = window.setInterval(() => {
        if (!document.hidden) slickNext()
      }, autoPlaySpeed)

      return () => window.clearInterval(interval)
    }, [autoPlay, autoPlaySpeed, isInViewport, isPaused, maxIndex, prefersReducedMotion, slickNext])

    const handleScroll = () => {
      if (scrollFrameRef.current !== null) return

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null
        const pageWidth = getPageWidth()
        const viewport = viewportRef.current
        if (!viewport || !pageWidth) return

        const nextIndex = Math.min(
          maxIndex,
          Math.max(0, Math.round(viewport.scrollLeft / pageWidth))
        )
        if (nextIndex === activeIndexRef.current) return

        activeIndexRef.current = nextIndex
        setActiveIndex(nextIndex)
      })
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      event.preventDefault()
      if (event.key === 'ArrowRight') slickNext()
      else slickPrev()
    }

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false)
    }

    const carouselStyle = {
      '--carousel-columns': effectiveSettings.slidesToShow,
      '--carousel-rows': effectiveSettings.rows * effectiveSettings.slidesPerRow,
    } as CSSProperties

    return (
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className={`${styles.root} ${className ?? ''}`.trim()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={handleBlur}
      >
        <div
          id={viewportId}
          ref={viewportRef}
          tabIndex={0}
          aria-label={`${ariaLabel} slides`}
          className={styles.viewport}
          style={carouselStyle}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
        >
          <div className={styles.track}>
            {pages.map((page, pageIndex) => (
              <div key={pageIndex} className={styles.page}>
                {page.map((slide, slideIndex) => {
                  const absoluteIndex = pageIndex * itemsPerPage + slideIndex

                  return (
                    <div
                      key={absoluteIndex}
                      className={styles.slide}
                      style={{ '--carousel-slide-padding': slidePadding } as CSSProperties}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${absoluteIndex + 1} of ${slides.length}`}
                    >
                      {slide}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {shouldShowControls ? (
          <div className={styles.controls} aria-label="Carousel controls">
            <IconButton
              aria-label="Go to previous slide"
              aria-controls={viewportId}
              onClick={slickPrev}
            >
              <ChevronLeft aria-hidden="true" />
            </IconButton>
            <IconButton
              aria-label="Go to next slide"
              aria-controls={viewportId}
              onClick={slickNext}
            >
              <ChevronRight aria-hidden="true" />
            </IconButton>
          </div>
        ) : null}

        {shouldShowDots ? (
          <div className={styles.dots} role="group" aria-label="Choose slide">
            {pages.map((_, index) => (
              <IconButton
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                aria-controls={viewportId}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={index === activeIndex ? styles.activeDot : styles.dot}
                onClick={() => goToIndex(index)}
              />
            ))}
          </div>
        ) : null}
      </div>
    )
  }
)

ResponsiveCarousel.displayName = 'ResponsiveCarousel'

export default ResponsiveCarousel
