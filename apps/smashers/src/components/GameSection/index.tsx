import dynamic from 'next/dynamic';
import cn from 'classnames';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';

const AnimatedWrapper = dynamic(() => import('@/components/AnimatedWrapper'), { ssr: false });

import styles from './index.module.css';

const GameSection = () => {
  function playVid() {
    const vid = document.getElementById('level-video') as HTMLVideoElement;
    vid?.play();
  }
  return (
    <Container className={styles.container}>
      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12, sm: 6 }} className={styles.section}>
          <div style={{ marginBottom: 25 }}>
            <AnimatedWrapper>
              <h2 className="animated-header-text animated-header-text-start transition-delay-small">
                FREE TO PLAY
                <br />
                <span className="white-space-no-wrap">PLATFORM FIGHTER</span>
              </h2>
            </AnimatedWrapper>
          </div>
          <div style={{ position: 'relative' }}>
            <AnimatedWrapper>
              <p className="animated-header-text animated-header-text-start transition-delay-medium">
                Nifty Smashers is a free 3D platform fighting game that supports up to 16 online players. Available on
                iOS & Android devices - <strong>full cross-play coming soon!</strong>
              </p>
            </AnimatedWrapper>
          </div>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }} className={styles.section}>
          <div className={styles.highlight_video} onClick={playVid}>
            <AnimatedWrapper>
              <div className="quick-pop-anim quick-pop-anim-start transition-delay-small">
                <video id="level-video" width="100%" height="100%" muted autoPlay loop playsInline data-keepplaying>
                  <source src="/video/rocket.mp4" type="video/mp4" />
                </video>
                <div className={cn(styles.gradient, 'radial-gradient-bg')} />
              </div>
            </AnimatedWrapper>
          </div>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default GameSection;
