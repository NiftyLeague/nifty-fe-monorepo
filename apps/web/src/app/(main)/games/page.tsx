'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';

import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import { cn } from '@nl/ui/lib/utils';

import ViewDocsBtn from '@/components/ViewDocsBtn';
import { NIFTY_GAMES } from '@/constants/games';
import styles from './index.module.css';

const Games: NextPage = () => {
  const desktop = useMediaQuery('(min-width:769px)');
  return (
    <div className="container pt-20">
      <div className={cn(styles.gradient1, 'purple-bg-orb')} />
      <section className="section flex items-center justify-center flex-wrap">
        {desktop ? (
          <div className="w-1/2 px-2 lg:px-3">
            <AnimatedWrapper>
              <div className="animate-zoom-out transition-fade-start transition-fade delay-long">
                <video id="lobby" width="100%" height="100%" muted autoPlay loop playsInline data-keepplaying>
                  <source src="/video/lobby.mp4" type="video/mp4" />
                </video>
              </div>
            </AnimatedWrapper>
          </div>
        ) : (
          <div className="w-1/3">
            <AnimatedWrapper>
              <div className="animate-zoom-out transition-fade-start transition-fade delay-long">
                <Image
                  alt="Arcade"
                  width={339}
                  height={661}
                  src="/img/games/smashers/arcade.webp"
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto', marginBottom: '6rem' }}
                />
              </div>
            </AnimatedWrapper>
          </div>
        )}
        <div className="w-full md:w-1/2 px-2 lg:px-3">
          <div className="mb-4">
            <AnimatedWrapper>
              <h1 className="text-center transition-fade-slow transition-fade-start delay-lite whitespace-nowrap">
                GAMES
              </h1>
            </AnimatedWrapper>
          </div>
          <div className="mb-5">
            <AnimatedWrapper>
              <p className="text-center transition-fade-slow transition-fade-start delay-normal">
                Join thousands of players around the world competing for the top spot in Nifty League!{' '}
              </p>
            </AnimatedWrapper>
          </div>
        </div>
      </section>

      <section className="section">
        {NIFTY_GAMES.map(({ name, description, video, tag, action }, index) => (
          <article className="flex flex-col-reverse md:flex-row relative mb-8" key={name}>
            <div className={cn(styles.block, 'w-full md:w-7/12 pr-0 md:pr-5')}>
              <div className="flex flex-row items-center justify-between mb-3">
                <AnimatedWrapper>
                  <h4 className="m-0 transition-vertical-fade transition-vertical-fade-start delay-lite">{name}</h4>
                </AnimatedWrapper>
                <AnimatedWrapper>
                  <p className={cn(styles.tagGame, 'm-0 transition-fade-slow transition-fade-start delay-normal')}>
                    {tag}
                  </p>
                </AnimatedWrapper>
              </div>
              <AnimatedWrapper>
                <p className="transition-vertical-fade transition-vertical-fade-start delay-normal">{description}</p>
              </AnimatedWrapper>
              <div className="flex justify-center md:justify-start mt-4">
                {action.isComingSoon ? (
                  <AnimatedWrapper>
                    <div className="transition-fade-slow transition-fade-start delay-normal">
                      <button className="theme-btn-transparent theme-btn-rounded min-w-fit disabled px-3">
                        COMING SOON
                      </button>
                    </div>
                  </AnimatedWrapper>
                ) : null}
                {action.link ? (
                  <AnimatedWrapper>
                    <Link
                      href={action.link}
                      target="_blank"
                      rel="noreferrer"
                      style={action.isDisabled ? { pointerEvents: 'none', color: 'var(--color-foreground)' } : {}}
                    >
                      <button
                        disabled={action.isDisabled}
                        className={
                          action.isDisabled
                            ? 'theme-btn-transparent theme-btn-rounded'
                            : 'theme-btn-primary theme-btn-rounded transition-fade-slow transition-fade-start delay-normal'
                        }
                      >
                        {action.title}
                      </button>
                    </Link>
                  </AnimatedWrapper>
                ) : null}
                {action.secondaryLink ? (
                  <AnimatedWrapper>
                    <Link href={action.secondaryLink}>
                      <button className="theme-btn-primary theme-btn-rounded mx-3 transition-fade-slow transition-fade-start delay-normal">
                        {action.secondaryTitle}
                      </button>
                    </Link>
                  </AnimatedWrapper>
                ) : null}
              </div>
            </div>
            <div className="w-full md:w-5/12">
              <AnimatedWrapper>
                <div className="relative text-right transition-fade-slow transition-fade-start delay-normal mb-4">
                  {video.includes('youtube') ? (
                    <iframe
                      src={video}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={name}
                      className={styles.video}
                    />
                  ) : (
                    <video
                      id="console-video"
                      width="100%"
                      height="100%"
                      muted
                      autoPlay
                      loop
                      playsInline
                      data-keepplaying
                      className={styles.video}
                    >
                      <source src={video} type="video/mp4" />
                    </video>
                  )}
                </div>
              </AnimatedWrapper>
            </div>
            <div
              className={cn(
                index === 0 ? styles.gradient2 : index === 1 ? styles.gradient1 : styles.gradient3,
                'purple-bg-orb',
              )}
            />
          </article>
        ))}

        <ViewDocsBtn href="/docs/guides/nifty-smashers/general-info" />
      </section>
    </div>
  );
};

export default Games;
