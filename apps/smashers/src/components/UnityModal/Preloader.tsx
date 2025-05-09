import { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { isMobileOnly } from 'react-device-detect';
import cn from 'classnames';
import useStopwatch from '@/hooks/useStopwatch';
import styles from '@/styles/preloader.module.css';

const PreloaderSVG = () => (
  <svg id="preloader-arcade" viewBox="0 0 140 186">
    <title>Preloader Arcade</title>
    <g>
      <circle cx="122" cy="20" r="2"></circle>
      <circle cx="122" cy="14" r="2"></circle>
      <circle cx="12" cy="20" r="2"></circle>
      <circle cx="128" cy="20" r="2"></circle>
      <circle cx="18" cy="14" r="2"></circle>
      <circle cx="12" cy="14" r="2"></circle>
      <circle cx="18" cy="20" r="2"></circle>
      <circle cx="128" cy="14" r="2"></circle>
      <path d="M130.071,44l7.267-10.247C138.886,33.201,140,31.737,140,30V4c0-2.209-1.791-4-4-4H4C1.791,0,0,1.791,0,4v26c0,1.737,1.114,3.201,2.662,3.753L9.929,44H10v82L0,149v7c0,1.737,1.114,3.201,2.662,3.754L9.929,170H10v16h4v-16h112v16h4v-16h0.071l7.267-10.246c1.548-0.553,2.662-2.017,2.662-3.754v-7l-10-23V44H130.071z M4,4h132v26H4V4z M7.741,34H132.26l-4.256,6H11.996L7.741,34z M128.004,166H126H14h-2.004l-4.255-6H132.26L128.004,166z M136,149.832V156H4v-6.168L12.623,130h5.893c1.02,2.879,3.463,5.083,6.485,5.77V146h4v-10.23c3.022-0.687,5.465-2.891,6.485-5.77h91.892L136,149.832z M22,127c0-2.762,2.238-5,5-5s5,2.238,5,5s-2.238,5-5,5S22,129.762,22,127z M126,126H35.941c-0.498-4.5-4.309-8-8.941-8s-8.443,3.5-8.941,8H14V44h112V126z"></path>
      <path d="M85,146H75c-1.104,0-2,0.896-2,2s0.896,2,2,2h10c1.104,0,2-0.896,2-2S86.104,146,85,146z"></path>
      <path d="M65,146H55c-1.104,0-2,0.896-2,2s0.896,2,2,2h10c1.104,0,2-0.896,2-2S66.104,146,65,146z"></path>
      <path d="M125.959,138.338c0.025-0.111,0.041-0.224,0.041-0.338c0-1.657-2.687-3-6-3s-6,1.343-6,3c0,0.114,0.016,0.227,0.041,0.338C112.775,139.046,112,139.977,112,141c0,2.209,3.582,4,8,4s8-1.791,8-4C128,139.977,127.225,139.046,125.959,138.338z M120,143c-3.872,0-6-1.502-6-2c0-0.232,0.48-0.681,1.365-1.096c1.1,0.669,2.768,1.096,4.635,1.096s3.535-0.427,4.635-1.096C125.52,140.319,126,140.768,126,141C126,141.498,123.872,143,120,143z"></path>
      <path d="M109.959,144.338c0.025-0.111,0.041-0.224,0.041-0.338c0-1.657-2.687-3-6-3s-6,1.343-6,3c0,0.114,0.016,0.227,0.041,0.338C96.775,145.046,96,145.977,96,147c0,2.209,3.582,4,8,4s8-1.791,8-4C112,145.977,111.225,145.046,109.959,144.338z M104,149c-3.872,0-6-1.502-6-2c0-0.232,0.48-0.681,1.365-1.096c1.1,0.669,2.768,1.096,4.635,1.096s3.535-0.427,4.635-1.096C109.52,146.319,110,146.768,110,147C110,147.498,107.872,149,104,149z"></path>
      <path d="M42,118h56c11.046,0,20-8.954,20-20V72c0-11.046-8.954-20-20-20H42c-11.046,0-20,8.954-20,20v26C22,109.046,30.954,118,42,118z M26,72c0-8.822,7.178-16,16-16h56c8.822,0,16,7.178,16,16v26c0,8.822-7.178,16-16,16H42c-8.822,0-16-7.178-16-16V72z"></path>
    </g>
  </svg>
);

export default function Preloader({ ready, progress }: { ready: boolean; progress: number }): React.ReactNode {
  const loadingPercentage = Math.round(progress * 100);
  const [percent, setPercent] = useState(loadingPercentage);
  const { milliseconds, start, stop } = useStopwatch({ interval: 100 });

  useEffect(() => {
    if (!ready) start();
    return function cleanup() {
      stop();
    };
  }, [start, stop, ready]);

  useEffect(() => {
    if (loadingPercentage !== 90) {
      setPercent(loadingPercentage);
    } else {
      const id = setInterval(() => {
        setPercent(p => Math.round(p < 80 ? p + 10 : 90));
      }, 100);
      return () => clearInterval(id);
    }
    return undefined;
  }, [loadingPercentage, stop]);

  useEffect(() => {
    const htmlElement = document.querySelector('html') as HTMLElement;
    if (!ready) {
      htmlElement.style.overflow = 'hidden';
    } else {
      htmlElement.style.overflow = 'auto';
      stop();
    }
    return function cleanup() {
      htmlElement.style.overflow = 'auto';
    };
  }, [ready, stop]);

  return (
    <div
      className={styles.preloader_overlay}
      style={
        ready
          ? {
              transform: 'translateY(100%)',
              display: 'none',
            }
          : { transform: 'transform: translateY(0)' }
      }
    >
      <div id="js-preloader" className={styles.preloader}>
        <div className={cn(styles.preloader_inner, styles.fadeInUp)}>
          <div className={styles.pong_loader} />
          <div className={styles.pong_loader_left} />
          <div className={styles.pong_loader_right} />
          <svg role="img" className={cn(styles.df_icon, styles.df_icon_preloader_arcade)}>
            <PreloaderSVG />
          </svg>
        </div>
      </div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            value={percent}
            color="success"
            variant="determinate"
            style={{ width: 160, marginLeft: 32 }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" sx={{ color: 'white' }}>{`${Math.round(percent)}%`}</Typography>
        </Box>
      </Box>
      {isMobileOnly && milliseconds > 12000 ? 'For the best experience try us out on desktop!' : null}
    </div>
  );
}
