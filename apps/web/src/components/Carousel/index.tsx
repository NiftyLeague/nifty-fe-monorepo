'use client'

import { Children, memo, useRef, type ReactNode } from 'react'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

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

const loadInteractiveCarousel = () => import('./InteractiveCarousel')

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
  const isNearViewport = useOnScreen(containerRef, '300px 0px', { once: true })
  const { Component: InteractiveCarousel } = useDeferredComponent<NiftyCarouselProps>(
    loadInteractiveCarousel,
    isNearViewport
  )

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
