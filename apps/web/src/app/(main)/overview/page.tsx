'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import useMediaQuery from '@mui/material/useMediaQuery';

import AnimatedAccordion from '@/components/AnimatedAccordion';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import ExternalIcon from '@/components/ExternalIcon';
import LearnCards from '@/components/LearnCards';
import { FAQS } from '@/constants/faq';

import styles from './index.module.css';

const Overview: NextPage = () => {
  const desktop = useMediaQuery('(min-width:769px)');
  return (
    <div className={cn(styles.container, 'mx-auto px-3')}>
      <div className={cn(styles.gradient1, 'radial-gradient-piece')} />
      <div className="position-relative">
        <AnimatedWrapper>
          <h1 className="text-center animated-header-text animated-header-text-start transition-delay-small">
            OVERVIEW
          </h1>
        </AnimatedWrapper>
        <div className="mt-3">
          <AnimatedWrapper>
            <p className="text-center animated-header-text animated-header-text-start transition-delay-medium">
              Learn how to navigate the Nifty League Platform
            </p>
          </AnimatedWrapper>
        </div>
        <LearnCards />
        <div className={cn(styles.gradient2, 'radial-gradient-piece')} />
        <div className={cn(styles.gradient3, 'radial-gradient-piece')} />
      </div>

      <div className="pb-0 pb-md-5 pt-5">
        <div className="text-center mb-3 mb-md-5 position-relative">
          <AnimatedWrapper>
            <h2 className="animated-header-text animated-header-text-start transition-delay-small">
              Frequently Asked Questions
            </h2>
          </AnimatedWrapper>
          <div className={cn(styles.gradient4, 'radial-gradient-piece')} />
        </div>

        {FAQS.map((faq, index) => (
          <AnimatedAccordion key={faq.question} index={index} question={faq.question} answer={faq.answer} />
        ))}

        <div className="d-flex justify-content-center my-3 my-md-4">
          <AnimatedWrapper>
            <Link href="/docs/faq/general" target="_blank" rel="noreferrer">
              <button className="btn theme-btn-primary theme-learn-btn animated-fade-slow animated-fade-start transition-delay-medium">
                More FAQ
                <ExternalIcon />
              </button>
            </Link>
          </AnimatedWrapper>
        </div>
      </div>

      {/* eslint-disable no-constant-binary-expression */}
      {false && (
        <div className="row m-0 p-0 position-relative stay-informed-section">
          <div className="p-0 w-100">
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
          <div className="position-absolute text-center d-flex align-items-center flex-column mt-5 pt-sm-5">
            <h2 className="mt-4">Stay in the loop</h2>
            <p className="my-3 text-m-center">
              Meet our community and stay up to date with our roadmap or team updates
            </p>
            <a href="https://discord.gg/niftyleague" target="_blank" rel="noreferrer">
              <button className="btn theme-btn-primary theme-learn-btn w-auto my-3">
                <span className="me-2">join our Discord server</span>
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
