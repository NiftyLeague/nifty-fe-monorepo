'use client';

import { Grid, Stack } from '@mui/material';
import PaginationIconOnly from '@/components/pagination/PaginationIconOnly';
import { PropsWithChildren, ReactNode, useRef } from 'react';
import Slider, { Settings } from 'react-slick';
import { sectionSpacing } from '@/theme/constants';
import SectionTitle from './SectionTitle';

interface Props {
  title: string | React.ReactNode;
  firstSection?: boolean;
  actions?: ReactNode;
  sliderSettingsOverride?: Settings;
  isSlider?: boolean;
  children?: React.ReactNode;
}

const SectionSlider = ({
  title,
  firstSection,
  children,
  actions,
  sliderSettingsOverride,
  isSlider = true,
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
    <Grid container spacing={sectionSpacing}>
      <Grid item xs={12}>
        <SectionTitle
          firstSection={firstSection}
          actions={
            <Stack direction="row" gap={2}>
              {actions}
              {isSlider && <PaginationIconOnly onClickNext={onClickNext} onClickPrev={onClickPrev} />}
            </Stack>
          }
        >
          {title}
        </SectionTitle>
      </Grid>
      <Grid item xs={12}>
        {isSlider ? (
          <Slider {...settings} ref={refSlider}>
            {children}
          </Slider>
        ) : (
          children
        )}
      </Grid>
    </Grid>
  );
};

export default SectionSlider;
