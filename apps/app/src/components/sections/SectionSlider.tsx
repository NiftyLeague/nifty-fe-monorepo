'use client';

import { Box, Stack } from '@mui/material';
import PaginationIconOnly from '@/components/pagination/PaginationIconOnly';
import { PropsWithChildren, ReactNode, useRef } from 'react';
import type { SxProps, Theme } from '@mui/system';
import Slider, { Settings } from 'react-slick';
import { sectionSpacing } from '@nl/theme';
import SectionTitle from './SectionTitle';

import '@/styles/slick.css';

interface Props {
  title: string | React.ReactNode;
  firstSection?: boolean;
  actions?: ReactNode;
  sliderSettingsOverride?: Settings;
  isSlider?: boolean;
  children?: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  styles?: { root?: SxProps<Theme>; headerRow?: SxProps<Theme>; mainRow?: SxProps<Theme> };
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
  const refSlider = useRef<Slider>(null);
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
  } as Settings;

  const onClickNext = () => {
    refSlider?.current?.slickNext();
  };

  const onClickPrev = () => {
    refSlider?.current?.slickPrev();
  };

  return (
    <Stack direction="column" spacing={sectionSpacing} sx={{ ...styles?.root }}>
      <Box sx={{ ...styles?.headerRow }}>
        <SectionTitle
          firstSection={firstSection}
          variant={variant}
          actions={
            <Stack direction="row" gap={2}>
              {actions}
              {isSlider && <PaginationIconOnly onClickNext={onClickNext} onClickPrev={onClickPrev} />}
            </Stack>
          }
        >
          {title}
        </SectionTitle>
      </Box>
      <Box sx={{ ...styles?.mainRow }}>
        {isSlider ? (
          <Slider {...settings} ref={refSlider}>
            {children}
          </Slider>
        ) : (
          children
        )}
      </Box>
    </Stack>
  );
};

export default SectionSlider;
