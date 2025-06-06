'use client';

import cn from 'classnames';
import type { NextPage } from 'next';
import Link from 'next/link';

import Carousel from '@/components/Carousel';
import { RenderTeamCardItem } from '@/components/Carousel/TeamCardItem';
import TeamDesktop from '@/components/TeamDesktop';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { CORE_TEAM, DEGEN_DELEGATES } from '@/constants/team';
import styles from './index.module.css';

const Team: NextPage = () => {
  return (
    <>
      <div className={cn(styles.container, 'mx-auto px-3')}>
        <div className="about-intro mt-5 pt-5 relative">
          <div className="flex flex-col m-0 p-0 sm:pt-5 relative items-center">
            <AnimatedWrapper>
              <h1 className="text-center animated-header-text animated-header-text-start transition-delay-small">
                NIFTY DAO
              </h1>
            </AnimatedWrapper>
            <div className={cn(styles.body, 'mt-5 sm:mt-3')}>
              <AnimatedWrapper>
                <p className="text-center p1 animated-header-text animated-header-text-start transition-delay-medium">
                  Nifty League is a game studio at the cutting edge of Web3. Our mission is to inspire indie game
                  developers to build a decentralized future with us by establishing a game studio focused on
                  unparalleled quality and player experiences.
                </p>
                <br />
              </AnimatedWrapper>
              <AnimatedWrapper>
                <p className="text-center p1 animated-header-text animated-header-text-start transition-delay-medium">
                  We will gradually transfer ownership of Nifty League to our DAO in order to decentralize the platform
                  and encourage others to build with us! Our vision is to power rapid growth and development through
                  community contributions enabling us to build a gaming platform like no other. Simply put, DAOs are the
                  future. We see only one route to becoming the world&apos;s leading gaming platform and that&apos;s by
                  building together. 💜
                </p>
              </AnimatedWrapper>
            </div>

            <div className="display-buttons mt-3 md:mt-4 flex justify-center desktop">
              <AnimatedWrapper>
                <Link href="/careers">
                  <button className="theme-btn-primary mx-2 animated-fade-slow animated-fade-start transition-delay-medium">
                    Join Us
                  </button>
                </Link>
              </AnimatedWrapper>
              <AnimatedWrapper>
                <Link href="/roadmap">
                  <button className="theme-btn-transparent mx-2 animated-fade-slow animated-fade-start transition-delay-medium">
                    Check our roadmap
                  </button>
                </Link>
              </AnimatedWrapper>
            </div>
          </div>
          <div className={cn(styles.gradient1, 'purple-bg-orb')} />
        </div>
      </div>

      <div className={cn(styles.container, 'mx-auto px-3')}>
        <div className={cn(styles.section, 'relative pb-5')}>
          <AnimatedWrapper>
            <h4 className="text-center animated-header-text animated-header-text-start transition-delay-small">
              MEET THE DEGENS WHO MAKE NIFTY LEAGUE POSSIBLE
            </h4>
          </AnimatedWrapper>
          <TeamDesktop />
          <section
            className="teams-slider slider px-0 block md:hidden"
            style={{ alignItems: 'center', maxWidth: '100%', textAlign: 'center', minHeight: 300 }}
          >
            <Carousel isMobileViewOnly hideGradient tabletItems={2}>
              {[...CORE_TEAM, ...DEGEN_DELEGATES].map(RenderTeamCardItem)}
            </Carousel>
          </section>
        </div>
      </div>
    </>
  );
};

export default Team;
