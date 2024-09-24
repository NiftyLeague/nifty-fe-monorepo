'use client';

import Link from 'next/link';

// material-ui
import { useTheme, gridSpacing, styled } from '@nl/theme';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { Button, Card, CardContent, CardMedia, Grid2, Typography } from '@mui/material';

// project imports
import { DASHBOARD_PATH } from '@/config';
import AnimateButton from '@/components/extended/AnimateButton';

// styles
const CardMediaWrapper = styled('div')({
  maxWidth: 720,
  margin: '0 auto',
  position: 'relative',
});

const ErrorWrapper = styled('div')({
  maxWidth: 350,
  margin: '0 auto',
  textAlign: 'center',
});

const ErrorCard = styled(Card)({
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const CardMediaBlock = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  animation: '3s bounce ease-in-out infinite',
});

const CardMediaBlue = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  animation: '15s wings ease-in-out infinite',
});

const CardMediaPurple = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  animation: '12s wings ease-in-out infinite',
});

// ==============================|| ERROR PAGE ||============================== //

const NotFoundPage = () => {
  const theme = useTheme();

  return (
    <ErrorCard>
      <CardContent>
        <Grid2 container justifyContent="center" spacing={gridSpacing}>
          <Grid2 size={{ xs: 12 }}>
            <CardMediaWrapper>
              <CardMedia
                component="img"
                image={
                  theme.palette.mode === 'dark'
                    ? '/img/maintenance/img-error-bg-dark.svg'
                    : '/img/maintenance/img-error-bg.svg'
                }
                title="Slider5 image"
              />
              <CardMediaBlock src="/img/maintenance/img-error-text.svg" title="Slider 1 image" />
              <CardMediaBlue src="/img/maintenance/img-error-blue.svg" title="Slider 2 image" />
              <CardMediaPurple src="/img/maintenance/img-error-purple.svg" title="Slider 3 image" />
            </CardMediaWrapper>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <ErrorWrapper>
              <Grid2 container spacing={gridSpacing}>
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="h1" component="div">
                    Something is wrong
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="body2">
                    The page you are looking was moved, removed, renamed, or might never exist!{' '}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <AnimateButton>
                    <Button variant="contained" size="large" component={Link} href={DASHBOARD_PATH}>
                      <HomeTwoToneIcon sx={{ fontSize: '20px', mr: 0.75 }} /> Home
                    </Button>
                  </AnimateButton>
                </Grid2>
              </Grid2>
            </ErrorWrapper>
          </Grid2>
        </Grid2>
      </CardContent>
    </ErrorCard>
  );
};

export default NotFoundPage;
