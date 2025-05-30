'use client';

import { memo, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import cn from 'classnames';

// Lazy load AnimatedWrapper with no SSR
const AnimatedWrapper = dynamic(() => import('@/components/AnimatedWrapper'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '300px' }} />,
});

import styles from './index.module.css';

const ConsoleGame = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(error => {
        console.log('Play failed:', error);
      });
    } else {
      videoRef.current.pause();
    }
  }, []);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);

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
            width={1920}
            height={1080}
            src="/img/console-game/classic-gaming-reinvented-notv.webp"
            priority
            fetchPriority="high"
            sizes="(max-width: 1200px) 100vw, 1200px"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            loading="eager"
          />
          <video
            ref={videoRef}
            id="console-video"
            width="100%"
            height="100%"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            className={styles.game_video}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handlePause}
          >
            <source src={src} type="video/mp4" />
          </video>
          <div
            onClick={togglePlay}
            style={{ cursor: 'pointer' }}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className={cn(styles.bonk_note, 'animated-fade-start animated-fade transition-delay-medium')}
          >
            <Image
              alt="Classic Gaming Reinvented Bonk"
              className="pixelated"
              width={1920}
              height={1080}
              src="/img/console-game/bonk.webp"
              loading="lazy"
              sizes="(max-width: 1200px) 100vw, 1200px"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
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
              width={1920}
              height={1080}
              src="/img/console-game/gaming_controller_left.webp"
              loading="lazy"
              sizes="(max-width: 1200px) 100vw, 1200px"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
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
              width={1920}
              height={1080}
              src="/img/console-game/gaming_controller_right.webp"
              loading="lazy"
              sizes="(max-width: 1200px) 100vw, 1200px"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </AnimatedWrapper>
      </div>
      <div className={cn(styles.console_gradient, 'radial-gradient-bg')} />
    </div>
  );
};

const MemoizedConsoleGame = memo(ConsoleGame);
export default MemoizedConsoleGame;
