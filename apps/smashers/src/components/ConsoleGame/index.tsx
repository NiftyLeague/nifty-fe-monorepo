import { memo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import cn from 'classnames';

const AnimatedWrapper = dynamic(() => import('@/components/AnimatedWrapper'), { ssr: false });

import styles from './index.module.css';

const ConsoleGame = ({ src }: { src: string }) => {
  function playVid() {
    const vid = document.getElementById('console-video') as HTMLVideoElement;
    vid?.play();
  }

  return (
    <div style={{ position: 'relative' }}>
      <AnimatedWrapper>
        <div
          style={{ position: 'relative', display: 'flex', flexGrow: 1 }}
          className="animated-fade-slow animated-fade-start transition-delay-small animation-sm-hidden"
        >
          <Image
            alt="Classic Gaming Reinvented"
            className="pixelated"
            width={4842}
            height={3371}
            src="/img/console-game/classic-gaming-reinvented-notv.webp"
            priority
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
          <video
            id="console-video"
            width="100%"
            height="100%"
            muted
            autoPlay
            loop
            playsInline
            data-keepplaying
            className={styles.game_video}
          >
            <source src={src} type="video/mp4" />
          </video>
          <div
            onClick={playVid}
            className={cn(styles.bonk_note, 'animated-fade-start animated-fade transition-delay-medium')}
          >
            <Image
              alt="Classic Gaming Reinvented Bonk"
              className="pixelated"
              width={4842}
              height={3371}
              src="/img/console-game/bonk.webp"
              priority
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        </div>
      </AnimatedWrapper>
      <div className={styles.gaming_controller}>
        <AnimatedWrapper parallax parallaxDirection="bottom" transitionAmount="small">
          <div className="animation-bounce animated-fade-start animated-fade transition-delay-large">
            <Image
              alt="Classic Gaming Reinvented Controller Left"
              className="pixelated"
              width={4842}
              height={3371}
              src="/img/console-game/gaming_controller_left.webp"
              priority
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        </AnimatedWrapper>
      </div>
      <div className={styles.gaming_controller}>
        <AnimatedWrapper parallax parallaxDirection="bottom" transitionAmount="small">
          <div className="animation-bounce2 animated-fade-start animated-fade transition-delay-large">
            <Image
              alt="Classic Gaming Reinvented Controller Right"
              className="pixelated"
              width={4842}
              height={3371}
              src="/img/console-game/gaming_controller_right.webp"
              priority
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        </AnimatedWrapper>
      </div>
      <div className="radial-gradient-bg" style={{ height: '110%' }} />
    </div>
  );
};

const MemoizedConsoleGame = memo(ConsoleGame);
export default MemoizedConsoleGame;
