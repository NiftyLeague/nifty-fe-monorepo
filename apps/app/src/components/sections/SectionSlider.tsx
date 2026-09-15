'use client'

import { PaginationControls } from '@/components/pagination/PaginationControls'
import { createMemo, type JSX } from 'solid-js'
import type { SxProps } from '@/types'
import ResponsiveCarousel from '@nl/ui/custom/responsive-carousel'
import type {
  ResponsiveCarouselRef,
  ResponsiveCarouselSettings,
} from '@nl/ui/custom/responsive-carousel'
import SectionTitle from './SectionTitle'

const sectionSpacing = 2 // 16px

interface Props {
  title: string | JSX.Element
  firstSection?: boolean
  actions?: JSX.Element
  sliderSettingsOverride?: ResponsiveCarouselSettings
  isSlider?: boolean
  children?: JSX.Element
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  styles?: { root?: SxProps; headerRow?: SxProps; mainRow?: SxProps }
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
}: Props & { children?: JSX.Element }): JSX.Element => {
  let refSlider: ResponsiveCarouselRef | undefined
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
      class="flex flex-col"
      style={{ gap: sectionSpacing * 8, ...(styles?.root as JSX.CSSProperties) }}
    >
      <div style={styles?.headerRow as JSX.CSSProperties}>
        <SectionTitle
          firstSection={firstSection}
          variant={variant}
          actions={
            <div class="flex flex-row gap-4">
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
      <div style={styles?.mainRow as JSX.CSSProperties}>
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
