import dynamic from 'next/dynamic';
import Image from 'next/image';
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
                FREE-TO-PLAY
                <br />
                <span>PARTY PLATFORM FIGHTER</span>
              </h2>
            </AnimatedWrapper>
          </div>
          <div style={{ position: 'relative' }}>
            <AnimatedWrapper>
              <p className="animated-header-text animated-header-text-start transition-delay-medium">
                Nifty Smashers is an <strong>online multiplayer</strong> that blends elements of a{' '}
                <strong>casual party survival</strong> experience with the fast-paced action of a{' '}
                <strong>platform fighter</strong>!
                <br />
                <br />
                Play on iOS, Android, and Steam with <strong>full cross-play support</strong>! Jump in and brawl
                anytime, anywhere!
              </p>
            </AnimatedWrapper>
          </div>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }} className={styles.section}>
          <div className={styles.highlight_video} onClick={playVid}>
            <AnimatedWrapper>
              <div className="quick-pop-anim quick-pop-anim-start transition-delay-small">
                <video
                  id="level-video"
                  width="100%"
                  height="100%"
                  style={{ borderRadius: '40px / 40px' }}
                  muted
                  autoPlay
                  loop
                  playsInline
                  data-keepplaying
                >
                  <source src="/video/rocket.mp4" type="video/mp4" />
                </video>
                <div className={cn(styles.gradient, 'radial-gradient-bg')} style={{ borderRadius: '40px / 40px' }} />
              </div>
            </AnimatedWrapper>
          </div>
        </Grid2>
      </Grid2>
      <Grid2 container marginTop={8}>
        <AnimatedWrapper>
          <div
            style={{ position: 'relative' }}
            className="text-align-center animated-fade-slow animated-fade-start transition-delay-small"
          >
            <Image
              src="/img/games/smashers/party_modes.gif"
              alt="Smashers Party Modes"
              width={1350}
              height={556}
              style={{ width: '100%', height: 'auto', borderRadius: '40px / 40px' }}
            />
          </div>
        </AnimatedWrapper>
      </Grid2>
    </Container>
  );
};

export default GameSection;
