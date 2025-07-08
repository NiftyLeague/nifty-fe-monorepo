'use client';

import Image from 'next/image';
import { memo, useRef, useState, useCallback } from 'react';
import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import { cn } from '@nl/ui/lib/utils';

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
    <div className="relative overflow-hidden">
      <AnimatedWrapper>
        <div
          style={{ position: 'relative', display: 'flex', flexGrow: 1 }}
          className="transition-fade-slow transition-fade-start delay-lite md:animation-hidden"
        >
          <Image
            alt="Game Console Backdrop"
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
            className={cn(styles.bonk_note, 'transition-fade-start transition-fade delay-normal')}
          >
            <Image
              alt="Bonk Sticker"
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
        <AnimatedWrapper parallax parallaxDirection="down" parallaxIntensity="normal">
          <div className="animate-hover transition-fade-start transition-fade delay-long">
            <Image
              alt="Controller Left"
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
        <AnimatedWrapper parallax parallaxDirection="down" parallaxIntensity="normal">
          <div className="animate-hover2 transition-fade-start transition-fade delay-long">
            <Image
              alt="Controller Right"
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
      <div className="dark-gradient-overlay" />
    </div>
  );
};

const MemoizedConsoleGame = memo(ConsoleGame);
export default MemoizedConsoleGame;
