'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import useMediaQuery from '@mui/material/useMediaQuery';

import { AnimatedWrapper } from '@nl/ui/animations';
import AnimatedAccordion from '@/components/AnimatedAccordion';
import ExternalIcon from '@/components/ExternalIcon';
import LearnCards from '@/components/LearnCards';
import { FAQS } from '@/constants/faq';

import styles from './index.module.css';

const Overview: NextPage = () => {
  const desktop = useMediaQuery('(min-width:769px)');
  return (
    <div className={cn(styles.container, 'mx-auto px-3')}>
      <div className={cn(styles.gradient1, 'purple-bg-orb')} />
      <div className="relative">
        <AnimatedWrapper>
          <h1 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">OVERVIEW</h1>
        </AnimatedWrapper>
        <div className="mt-3">
          <AnimatedWrapper>
            <p className="text-center transition-vertical-fade transition-vertical-fade-start delay-normal">
              Learn how to navigate the Nifty League Platform
            </p>
          </AnimatedWrapper>
        </div>
        <LearnCards />
        <div className={cn(styles.gradient2, 'purple-bg-orb')} />
        <div className={cn(styles.gradient3, 'purple-bg-orb')} />
      </div>

      <div className="pb-0 md:pb-5 pt-5">
        <div className="text-center mb-3 md:mb-5 relative">
          <AnimatedWrapper>
            <h2 className="transition-vertical-fade transition-vertical-fade-start delay-lite">
              Frequently Asked Questions
            </h2>
          </AnimatedWrapper>
          <div className={cn(styles.gradient4, 'purple-bg-orb')} />
        </div>

        {FAQS.map((faq, index) => (
          <AnimatedAccordion key={faq.question} index={index} question={faq.question} answer={faq.answer} />
        ))}

        <div className="flex justify-center my-3 md:my-4">
          <AnimatedWrapper>
            <Link href="/docs/faq/general" target="_blank" rel="noreferrer">
              <button className="theme-btn-primary theme-btn-purple transition-fade-slow transition-fade-start delay-normal">
                More FAQ
                <ExternalIcon />
              </button>
            </Link>
          </AnimatedWrapper>
        </div>
      </div>

      {/* eslint-disable no-constant-binary-expression */}
      {false && (
        <div className="m-0 p-0 relative stay-informed-section">
          <div className="p-0 w-full">
            {desktop ? (
              <Image
                alt="DGEN Network background desktop"
                className="pixelated"
                height={813}
                src="/img/backgrounds/dgen-network.webp"
                width={1440}
                priority
                sizes="100vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            ) : (
              <Image
                alt="DGEN Network background mobile"
                className="pixelated"
                height={500}
                src="/img/backgrounds/dgen-network-mobile.webp"
                width={375}
                priority
                sizes="100vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            )}
          </div>
          <div className="absolute text-center flex items-center flex-col mt-5 sm:pt-5">
            <h2 className="mt-4">Stay in the loop</h2>
            <p className="my-3 text-center">Meet our community and stay up to date with our roadmap or team updates</p>
            <a href="https://discord.gg/niftyleague" target="_blank" rel="noreferrer">
              <button className="theme-btn-primary theme-btn-purple w-auto my-3">
                <span className="mr-2">join our Discord server</span>
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
