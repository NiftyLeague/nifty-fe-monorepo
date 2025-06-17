'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@nl/ui/lib/utils';
import useMediaQuery from '@mui/material/useMediaQuery';

import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import AnimatedAccordion from '@/components/AnimatedAccordion';
import ExternalIcon from '@/components/ExternalIcon';
import LearnCards from '@/components/LearnCards';
import { FAQS } from '@/constants/faq';

import styles from './index.module.css';

const Overview: NextPage = () => {
  const desktop = useMediaQuery('(min-width:769px)');
  return (
    <>
      <div className="container pt-20">
        <div className={cn(styles.gradient1, 'purple-bg-orb')} />
        <section className="section">
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
        </section>

        <section className="section">
          <div className="text-center mb-5 relative">
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

          <div className="flex justify-center mt-8">
            <AnimatedWrapper>
              <Link href="/docs/faq/general" target="_blank" rel="noreferrer">
                <button className="theme-btn-primary theme-btn-purple transition-fade-slow transition-fade-start delay-lite">
                  More FAQ
                  <ExternalIcon />
                </button>
              </Link>
            </AnimatedWrapper>
          </div>
        </section>
      </div>

      <section className="section relative w-full">
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
        <div className="dark-gradient-overlay" />
        <div className="w-full h-auto absolute top-0 text-center flex items-center flex-col mt-40 md:mt-10 lg:mt-20">
          <h2 className="mt-4">Stay in the loop</h2>
          <p className="my-3 px-4 text-center">
            Meet our community and stay up to date with our roadmap or team updates
          </p>
          <a href="https://discord.gg/niftyleague" target="_blank" rel="noreferrer">
            <button className="theme-btn-primary w-auto my-3">join our Discord server</button>
          </a>
        </div>
      </section>
    </>
  );
};

export default Overview;
