import dynamic from 'next/dynamic';
import Image from 'next/image';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';

import styles from './index.module.css';

const GameSection = () => {
  function playVid() {
    const vid = document.getElementById('level-video') as HTMLVideoElement;
    vid?.play();
  }
  return (
    <Container className={styles.container}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6 }} className={styles.section}>
          <div style={{ marginBottom: 25 }}>
            <AnimatedWrapper>
              <h2 className="transition-vertical-fade transition-vertical-fade-start delay-lite">
                FREE-TO-PLAY
                <br />
                <span className="font-default font-normal">PARTY PLATFORM FIGHTER</span>
              </h2>
            </AnimatedWrapper>
          </div>
          <div style={{ position: 'relative' }}>
            <AnimatedWrapper>
              <p className="transition-vertical-fade transition-vertical-fade-start delay-normal">
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} className={styles.section}>
          <div className={styles.highlight_video} onClick={playVid}>
            <AnimatedWrapper>
              <div className="relative transition-quick-pop transition-quick-pop-start delay-lite">
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
              </div>
            </AnimatedWrapper>
          </div>
        </Grid>
      </Grid>
      <Grid container marginTop={8}>
        <AnimatedWrapper>
          <div
            style={{ position: 'relative' }}
            className="text-center transition-fade-slow transition-fade-start delay-lite"
          >
            <Image
              src="/img/games/smashers/party_modes.gif"
              alt="Smashers Party Modes"
              width={1350}
              height={556}
              style={{ width: '100%', height: 'auto', borderRadius: '40px / 40px' }}
              unoptimized
            />
          </div>
        </AnimatedWrapper>
      </Grid>
    </Container>
  );
};

export default GameSection;
