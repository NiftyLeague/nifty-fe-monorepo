'use client'

import ResponsiveCarousel from '@nl/ui/custom/responsive-carousel'

import type { NiftyCarouselProps } from './index'

const InteractiveCarousel = ({
  children,
  isMobileViewOnly = false,
  mobileItems = 1,
  tabletItems = 3,
  desktopItems = 4,
  superLargeDesktopItems = 5,
  hideGradient = false,
  ariaLabel = 'Featured content',
}: NiftyCarouselProps): React.ReactNode => (
  <>
    <ResponsiveCarousel
      ariaLabel={ariaLabel}
      autoPlay
      autoPlaySpeed={isMobileViewOnly ? 4000 : 2000}
      controlsOnMobileOnly={isMobileViewOnly}
      infinite
      mobileBreakpoint={615}
      slidesToShow={mobileItems}
      responsive={[
        {
          breakpoint: { max: 4000, min: 1500 },
          settings: { slidesToShow: superLargeDesktopItems },
        },
        { breakpoint: { max: 1500, min: 1024 }, settings: { slidesToShow: desktopItems } },
        { breakpoint: { max: 1024, min: 615 }, settings: { slidesToShow: tabletItems } },
        { breakpoint: { max: 615, min: 0 }, settings: { slidesToShow: mobileItems } },
      ]}
      showControls={isMobileViewOnly}
      showDots={isMobileViewOnly}
      slidePadding="1.25rem"
    >
      {children}
    </ResponsiveCarousel>
    {!hideGradient && <div className="dark-gradient-overlay !top-0 !h-full" />}
  </>
)

export default InteractiveCarousel
