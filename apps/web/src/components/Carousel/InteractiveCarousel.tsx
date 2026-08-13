'use client'

import {
  Children,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@nl/ui/base/button'

import type { NiftyCarouselProps } from './index'
import styles from './carousel.module.css'

const MOBILE_BREAKPOINT = 615

const InteractiveCarousel = ({
  children,
  isMobileViewOnly = false,
  mobileItems = 1,
  tabletItems = 3,
  desktopItems = 4,
  superLargeDesktopItems = 5,
  hideGradient = false,
  ariaLabel = 'Featured content',
}: NiftyCarouselProps): React.ReactNode => {
  const slides = Children.toArray(children)
  const viewportRef = useRef<HTMLDivElement>(null)
  const viewportId = useId()
  const activeIndexRef = useRef(0)
  const scrollFrameRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const getMetrics = useCallback(() => {
    const viewport = viewportRef.current
    const firstSlide = viewport?.querySelector<HTMLElement>('[data-carousel-slide]')
    const slideWidth = firstSlide?.getBoundingClientRect().width ?? 0
    const maxScroll = viewport ? Math.max(0, viewport.scrollWidth - viewport.clientWidth) : 0

    return {
      slideWidth,
      maxIndex: slideWidth ? Math.max(0, Math.round(maxScroll / slideWidth)) : 0,
    }
  }, [])

  const scrollToIndex = useCallback(
    (requestedIndex: number) => {
      const viewport = viewportRef.current
      const { slideWidth, maxIndex: measuredMaxIndex } = getMetrics()
      if (!viewport || !slideWidth) return

      const nextIndex =
        measuredMaxIndex === 0
          ? 0
          : requestedIndex > measuredMaxIndex
            ? 0
            : requestedIndex < 0
              ? measuredMaxIndex
              : requestedIndex

      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
      viewport.scrollTo({
        left: nextIndex * slideWidth,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    },
    [getMetrics, prefersReducedMotion]
  )

  useEffect(() => {
    const updateViewport = () => {
      const { maxIndex: measuredMaxIndex } = getMetrics()
      const nextIndex = Math.min(activeIndexRef.current, measuredMaxIndex)

      setIsMobileViewport(window.innerWidth < MOBILE_BREAKPOINT)
      setMaxIndex(measuredMaxIndex)
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
    }

    updateViewport()

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(updateViewport) : null
    if (resizeObserver && viewportRef.current) resizeObserver.observe(viewportRef.current)
    window.addEventListener('resize', updateViewport, { passive: true })

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setPrefersReducedMotion(motionQuery.matches)
    updateMotionPreference()
    motionQuery.addEventListener?.('change', updateMotionPreference)

    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
        scrollFrameRef.current = null
      }
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updateViewport)
      motionQuery.removeEventListener?.('change', updateMotionPreference)
    }
  }, [getMetrics])

  useEffect(() => {
    if (isPaused || prefersReducedMotion || maxIndex === 0) return

    const interval = window.setInterval(
      () => {
        if (!document.hidden) scrollToIndex(activeIndexRef.current + 1)
      },
      isMobileViewOnly ? 4000 : 2000
    )

    return () => window.clearInterval(interval)
  }, [isMobileViewOnly, isPaused, maxIndex, prefersReducedMotion, scrollToIndex])

  const handleScroll = () => {
    if (scrollFrameRef.current !== null) return

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null

      const viewport = viewportRef.current
      const { slideWidth, maxIndex: measuredMaxIndex } = getMetrics()
      if (!viewport || !slideWidth) return

      const nextIndex = Math.min(
        measuredMaxIndex,
        Math.max(0, Math.round(viewport.scrollLeft / slideWidth))
      )
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    scrollToIndex(activeIndexRef.current + (event.key === 'ArrowRight' ? 1 : -1))
  }

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false)
  }

  const viewportStyle = {
    '--mobile-items': mobileItems,
    '--tablet-items': tabletItems,
    '--desktop-items': desktopItems,
    '--super-large-desktop-items': superLargeDesktopItems,
  } as CSSProperties
  const showControls = isMobileViewOnly && isMobileViewport && maxIndex > 0
  const showDots = showControls && maxIndex > 0

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={styles.root}
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
        style={viewportStyle}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
      >
        <ul className={styles.track}>
          {slides.map((slide, index) => (
            <li
              key={index}
              data-carousel-slide
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              {slide}
            </li>
          ))}
        </ul>
      </div>

      {showControls ? (
        <div className={styles.controls} aria-label="Carousel controls">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Go to previous slide"
            aria-controls={viewportId}
            onClick={() => scrollToIndex(activeIndexRef.current - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Go to next slide"
            aria-controls={viewportId}
            onClick={() => scrollToIndex(activeIndexRef.current + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      {showDots ? (
        <div className={styles.dots} role="group" aria-label="Choose slide">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="icon"
              className={index === activeIndex ? styles.activeDot : styles.dot}
              aria-label={`Go to slide ${index + 1}`}
              aria-controls={viewportId}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      ) : null}

      {!hideGradient && <div className="dark-gradient-overlay !top-[13%] !h-[82%]" />}
    </div>
  )
}

export default InteractiveCarousel
