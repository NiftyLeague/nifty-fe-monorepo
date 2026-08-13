'use client'

import { PaginationControls } from '@/components/pagination/PaginationControls'
import { PropsWithChildren, ReactNode, useMemo, useRef } from 'react'
import type { SxProps, Theme } from '@/types'
import ResponsiveCarousel from '@nl/ui/custom/responsive-carousel'
import type {
  ResponsiveCarouselRef,
  ResponsiveCarouselSettings,
} from '@nl/ui/custom/responsive-carousel'
import SectionTitle from './SectionTitle'

const sectionSpacing = 2 // 16px

interface Props {
  title: string | React.ReactNode
  firstSection?: boolean
  actions?: ReactNode
  sliderSettingsOverride?: ResponsiveCarouselSettings
  isSlider?: boolean
  children?: React.ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  styles?: { root?: SxProps<Theme>; headerRow?: SxProps<Theme>; mainRow?: SxProps<Theme> }
}

const SectionSlider = ({
  title,
  firstSection,
  children,
  actions,
  sliderSettingsOverride,
  isSlider = true,
  variant = 'h2',
  styles,
}: PropsWithChildren<Props>): React.ReactNode => {
  const refSlider = useRef<ResponsiveCarouselRef>(null)
  const settings = useMemo<ResponsiveCarouselSettings>(
    () => ({
      slidesToShow: 4,
      slidesToScroll: 1,
      infinite: true,
      rows: 1,
      responsive: [
        { breakpoint: 1536, settings: { slidesToShow: 4 } },
        { breakpoint: 1280, settings: { slidesToShow: 3 } },
        { breakpoint: 1024, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
        { breakpoint: 640, settings: { slidesToShow: 1 } },
      ],
      ...sliderSettingsOverride,
    }),
    [sliderSettingsOverride]
  )

  const onClickNext = () => {
    refSlider?.current?.slickNext()
  }

  const onClickPrev = () => {
    refSlider?.current?.slickPrev()
  }

  return (
    <div
      className="flex flex-col"
      style={{ gap: sectionSpacing * 8, ...(styles?.root as React.CSSProperties) }}
    >
      <div style={styles?.headerRow as React.CSSProperties}>
        <SectionTitle
          firstSection={firstSection}
          variant={variant}
          actions={
            <div className="flex flex-row gap-4">
              {actions}
              {isSlider && (
                <PaginationControls
                  hasNext
                  hasPrev
                  nextLabel="Next slide"
                  previousLabel="Previous slide"
                  onClickNext={onClickNext}
                  onClickPrev={onClickPrev}
                />
              )}
            </div>
          }
        >
          {title}
        </SectionTitle>
      </div>
      <div style={styles?.mainRow as React.CSSProperties}>
        {isSlider ? (
          <ResponsiveCarousel
            {...settings}
            ariaLabel={typeof title === 'string' ? title : 'Featured content'}
            ref={refSlider}
            slidePadding="0"
            showControls={false}
          >
            {children}
          </ResponsiveCarousel>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default SectionSlider
