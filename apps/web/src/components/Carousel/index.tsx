'use client'

import {
  Children,
  memo,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'

export interface NiftyCarouselProps {
  children: ReactNode
  isMobileViewOnly?: boolean
  mobileItems?: number
  tabletItems?: number
  desktopItems?: number
  superLargeDesktopItems?: number
  hideGradient?: boolean
  ariaLabel?: string
}

const NiftyCarousel = ({
  children,
  isMobileViewOnly = false,
  mobileItems = 1,
  tabletItems = 3,
  desktopItems = 4,
  superLargeDesktopItems = 5,
  hideGradient = false,
  ariaLabel = 'Featured content',
}: NiftyCarouselProps): React.ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null)
  const loadRequestedRef = useRef(false)
  const mountedRef = useRef(true)
  const [InteractiveCarousel, setInteractiveCarousel] =
    useState<ComponentType<NiftyCarouselProps>>()

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const loadInteractiveCarousel = () => {
      if (loadRequestedRef.current) return
      loadRequestedRef.current = true

      void import('./InteractiveCarousel').then(({ default: LoadedCarousel }) => {
        if (mountedRef.current) setInteractiveCarousel(() => LoadedCarousel)
      })
    }

    if (!('IntersectionObserver' in window)) {
      loadInteractiveCarousel()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          loadInteractiveCarousel()
        }
      },
      { rootMargin: '300px 0px' }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {InteractiveCarousel ? (
        <InteractiveCarousel
          isMobileViewOnly={isMobileViewOnly}
          mobileItems={mobileItems}
          tabletItems={tabletItems}
          desktopItems={desktopItems}
          superLargeDesktopItems={superLargeDesktopItems}
          hideGradient={hideGradient}
          ariaLabel={ariaLabel}
        >
          {children}
        </InteractiveCarousel>
      ) : (
        <StaticCarousel mobileItems={mobileItems} hideGradient={hideGradient}>
          {children}
        </StaticCarousel>
      )}
    </div>
  )
}

const StaticCarousel = ({
  children,
  mobileItems,
  hideGradient,
}: Pick<NiftyCarouselProps, 'children' | 'mobileItems' | 'hideGradient'>) => {
  const itemBasis = `${100 / (mobileItems ?? 1)}%`

  return (
    <>
      <div className="overflow-hidden">
        <div className="flex items-stretch">
          {Children.toArray(children).map((child, index) => (
            <div key={index} className="min-w-0 shrink-0 px-5" style={{ flex: `0 0 ${itemBasis}` }}>
              {child}
            </div>
          ))}
        </div>
      </div>
      {!hideGradient && <div className="dark-gradient-overlay !top-[13%] !h-[82%]" />}
    </>
  )
}

const MemoizedNiftyCarousel = memo(NiftyCarousel)
export default MemoizedNiftyCarousel
