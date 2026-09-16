import { PaginationControls } from '@/components/pagination/PaginationControls'
import { createMemo, Show, type JSX } from 'solid-js'
import ResponsiveCarousel from '@nl/ui/custom/responsive-carousel'
import type {
  ResponsiveCarouselRef,
  ResponsiveCarouselSettings,
} from '@nl/ui/custom/responsive-carousel'
import SectionTitle from './SectionTitle'

interface Props {
  title: string | JSX.Element
  firstSection?: boolean
  actions?: JSX.Element
  sliderSettingsOverride?: ResponsiveCarouselSettings
  isSlider?: boolean
  children?: JSX.Element
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  class?: string
  mainRowClass?: string
}

const SectionSlider = (props: Props & { children?: JSX.Element }): JSX.Element => {
  let sliderApi: ResponsiveCarouselRef | undefined
  const isSlider = () => props.isSlider ?? true
  const variant = () => props.variant ?? 'h2'
  const settings = createMemo<ResponsiveCarouselSettings>(() => ({
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
    ...props.sliderSettingsOverride,
  }))

  const onClickNext = () => {
    sliderApi?.slickNext()
  }

  const onClickPrev = () => {
    sliderApi?.slickPrev()
  }

  return (
    <div class={`flex flex-col gap-4 ${props.class ?? ''}`}>
      <div>
        <SectionTitle
          firstSection={props.firstSection}
          variant={variant()}
          actions={
            <div class="flex flex-row gap-4">
              {props.actions}
              <Show when={isSlider()}>
                <PaginationControls
                  hasNext
                  hasPrev
                  nextLabel="Next slide"
                  previousLabel="Previous slide"
                  onClickNext={onClickNext}
                  onClickPrev={onClickPrev}
                />
              </Show>
            </div>
          }
        >
          {props.title}
        </SectionTitle>
      </div>
      <div class={props.mainRowClass ?? ''}>
        <Show when={isSlider()} fallback={props.children}>
          <ResponsiveCarousel
            {...settings()}
            ariaLabel={typeof props.title === 'string' ? props.title : 'Featured content'}
            ref={(api) => {
              sliderApi = api
            }}
            slidePadding="0"
            showControls={false}
          >
            {props.children}
          </ResponsiveCarousel>
        </Show>
      </div>
    </div>
  )
}

export default SectionSlider
