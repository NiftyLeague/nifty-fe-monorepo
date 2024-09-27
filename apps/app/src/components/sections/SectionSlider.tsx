'use client';

import { Grid2, Stack } from '@mui/material';
import PaginationIconOnly from '@/components/pagination/PaginationIconOnly';
import { PropsWithChildren, ReactNode, useRef } from 'react';
import Slider, { Settings } from 'react-slick';
import { sectionSpacing } from '@nl/theme';
import SectionTitle from './SectionTitle';
import type { SxProps, Theme } from '@mui/system';

interface Props {
  title: string | React.ReactNode;
  firstSection?: boolean;
  actions?: ReactNode;
  sliderSettingsOverride?: Settings;
  isSlider?: boolean;
  children?: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  styles?: {
    root?: SxProps<Theme>;
    headerRow?: SxProps<Theme>;
    mainRow?: SxProps<Theme>;
  };
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
}: PropsWithChildren<Props>): JSX.Element => {
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
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
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
    <Grid2 container flexDirection="column" size={{ xs: 12 }} spacing={sectionSpacing} sx={{ ...styles?.root }}>
      <Grid2 size={{ xs: 12 }} sx={{ ...styles?.headerRow }}>
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
      </Grid2>
      <Grid2 size={{ xs: 12 }} sx={{ ...styles?.mainRow }}>
        {isSlider ? (
          <Slider {...settings} ref={refSlider}>
            {children}
          </Slider>
        ) : (
          children
        )}
      </Grid2>
    </Grid2>
  );
};

export default SectionSlider;
