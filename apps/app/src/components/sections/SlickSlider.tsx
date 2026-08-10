'use client'

import { forwardRef, type PropsWithChildren } from 'react'
import Slider, { type Settings } from 'react-slick'

import '@/styles/slick.css'

export type SlickSliderRef = Slider

interface Props {
  settings: Settings
}

const SlickSlider = forwardRef<SlickSliderRef, PropsWithChildren<Props>>(
  ({ settings, children }, ref) => (
    <Slider {...settings} ref={ref}>
      {children}
    </Slider>
  )
)

SlickSlider.displayName = 'SlickSlider'

export default SlickSlider
