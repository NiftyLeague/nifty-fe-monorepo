'use client';

import type { NextPage } from 'next';
import Image from 'next/image';

import { cn } from '@nl/ui/utils';
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery';
import { AnimatedWrapper } from '@nl/ui/custom/animated-wrapper';
import SocialCards from '@/components/SocialCards';

import styles from './index.module.css';

const Community: NextPage = () => {
  const desktop = useMediaQuery('(min-width:769px)');
  return (
    <>
      <section className="relative min-h-screen">
        <div className="container pt-40 relative flex flex-col md:flex-row z-[2]">
          <div className="w-full md:w-1/2 px-0 text-center md:text-left">
            <AnimatedWrapper>
              <h4 className="transition-vertical-fade transition-vertical-fade-start whitespace-nowrap">
                Nifty League
              </h4>
              <h2 className="transition-vertical-fade transition-vertical-fade-start">Community</h2>
              <p className="mt-3 transition-vertical-fade transition-vertical-fade-start delay-lite">
                Meet our global community of gamers
              </p>
            </AnimatedWrapper>
          </div>
          <div className="w-full sm:w-2/3 md:w-1/2 xl:w-1/3 relative mx-auto text-center">
            <AnimatedWrapper>
              <div className="relative transition-fade-start transition-fade delay-normal">
                <Image
                  src="/img/space/moon-satoshi.webp"
                  alt="Satoshi moon"
                  width={445}
                  height={437}
                  priority
                  sizes="100vw"
                  className="w-full h-auto"
                />
              </div>
            </AnimatedWrapper>
            <div className={styles.moon_grad}>
              <Image
                src="/img/gradient/purple-light-grad.svg"
                priority
                alt="gradient background"
                width={685}
                height={685}
              />
            </div>
            <div className="purple-bg-orb orb-top-right" />
          </div>
        </div>

        <div className="w-full h-auto absolute -bottom-10 md:-bottom-20">
          <AnimatedWrapper>
            <div className="relative transition-fade-start transition-fade delay-normal">
              <Image
                src="/img/space/earth-darkened.webp"
                width={1684}
                height={525}
                alt="Earth"
                priority
                sizes="100vw"
                className="w-full h-auto"
              />
            </div>
          </AnimatedWrapper>
          <div className="dark-gradient-overlay" />
        </div>
        <span className={styles.earth_grad}>
          <Image
            src="/img/gradient/purple-grad.svg"
            alt="Purple eclipse"
            width={704}
            height={704}
            sizes="100vw"
            className="w-full h-auto"
          />
        </span>
      </section>

      <section className="container section">
        <div className="relative text-center mb-8">
          <AnimatedWrapper>
            <h3 className="transition-vertical-fade transition-vertical-fade-start delay-lite">
              Join the conversation
            </h3>
          </AnimatedWrapper>
          <AnimatedWrapper>
            <p className="text-center my-3 mx-auto max-w-2xl transition-vertical-fade transition-vertical-fade-start delay-normal">
              Nifty League&apos;s community is unlike any other. Get your questions answered and connect with fellow
              DEGENs!
            </p>
          </AnimatedWrapper>
        </div>

        <SocialCards />
      </section>

      <section className="section flex sliding-nfts relative overflow-hidden">
        <div className="flex flex-col text-center relative p-0">
          <div className={cn('relative', `sliding-background-wrapper-${desktop ? 'desktop' : 'mobile'}`)}>
            <div className="sliding-background" />
            <div className="dark-gradient-overlay" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Community;
