'use client'

import dynamic from 'next/dynamic'
import PaginationIconOnly from '@/components/pagination/PaginationIconOnly'
import { PropsWithChildren, ReactNode, useRef } from 'react'
import type { SxProps, Theme } from '@/types'
import type { Settings } from 'react-slick'
import SectionTitle from './SectionTitle'
import type { SlickSliderRef } from './SlickSlider'

const SlickSlider = dynamic(() => import('./SlickSlider'))

const sectionSpacing = 2 // 16px

interface Props {
  title: string | React.ReactNode
  firstSection?: boolean
  actions?: ReactNode
  sliderSettingsOverride?: Settings
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
  const refSlider = useRef<SlickSliderRef>(null)
  const settings = {
    dots: false,
    swipeToSlide: false,
    focusOnSelect: false,
    swipe: false,
    arrows: false,
    centerPadding: '0',
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    rows: 1,
    lazyLoad: true,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
    ...sliderSettingsOverride,
  } as Settings

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
                <PaginationIconOnly onClickNext={onClickNext} onClickPrev={onClickPrev} />
              )}
            </div>
          }
        >
          {title}
        </SectionTitle>
      </div>
      <div style={styles?.mainRow as React.CSSProperties}>
        {isSlider ? (
          <SlickSlider settings={settings} ref={refSlider}>
            {children}
          </SlickSlider>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default SectionSlider
