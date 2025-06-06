'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import { useMediaQuery } from '@mui/material';
import SocialCards from '@/components/SocialCards';
import AnimatedWrapper from '@/components/AnimatedWrapper';

const Community: NextPage = () => {
  const desktop = useMediaQuery('(min-width:769px)');
  return (
    <>
      <div className="com-intro relative min-h-[88vh]">
        <div className="container mx-auto pt-5 sm:mt-5 px-0 sm:px-5" style={{ maxWidth: '90%' }}>
          <div className="relative m-0 flex flex-col md:flex-row z-[2]">
            <div className="w-full md:w-1/2 px-0 text-center md:text-left">
              <div className="mt-5">
                <AnimatedWrapper>
                  <h4 className="animated-header-text animated-header-text-start whitespace-nowrap">Nifty League</h4>
                </AnimatedWrapper>
              </div>
              <AnimatedWrapper>
                <h1 className="animated-header-text animated-header-text-start">Community</h1>
              </AnimatedWrapper>
              <div className="my-3">
                <AnimatedWrapper>
                  <p className="animated-header-text animated-header-text-start transition-delay-small">
                    Meet our global community of gamers
                  </p>
                </AnimatedWrapper>
              </div>
            </div>
            <div className="w-full sm:w-2/3 md:w-1/2 xl:w-1/3 relative mx-auto text-center">
              <AnimatedWrapper>
                <div className="relative animated-fade-start animated-fade transition-delay-medium">
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
              <div className="moon-grad">
                <Image
                  src="/img/gradient/purple-light-grad.svg"
                  priority
                  alt="gradient background"
                  width={685}
                  height={685}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-auto absolute bottom-0">
          <AnimatedWrapper>
            <div className="relative animated-fade-start animated-fade transition-delay-medium">
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
        <span className="earth-grad">
          <Image
            src="/img/gradient/purple-grad.svg"
            alt="Purple eclipse"
            width={704}
            height={704}
            sizes="100vw"
            className="w-full h-auto"
          />
        </span>
      </div>

      <div className="container mx-auto pb-5 md:pb-10 px-4 w-full">
        <div className="relative text-center py-8">
          <AnimatedWrapper>
            <h3 className="animated-header-text animated-header-text-start transition-delay-small">
              Join the conversation
            </h3>
          </AnimatedWrapper>
          <AnimatedWrapper>
            <p className="text-center animated-header-text animated-header-text-start transition-delay-medium my-3">
              Nifty League&apos;s community is unlike any other. Get your questions answered and connect with fellow
              DEGENs!
            </p>
          </AnimatedWrapper>
        </div>
      </div>

      <SocialCards />

      <div className="flex sliding-nfts relative mt-12 py-12 overflow-hidden">
        <div className="flex flex-col text-center relative p-0">
          <div className={`relative sliding-background-wrapper-${desktop ? 'desktop' : 'mobile'}`}>
            <div className="sliding-background" />
            <div className="dark-gradient-overlay" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
