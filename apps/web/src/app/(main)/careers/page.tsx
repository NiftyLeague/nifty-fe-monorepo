import type { NextPage } from 'next';
import Image from 'next/image';

import { AnimatedWrapper } from '@nl/ui/custom/AnimatedWrapper';
import JobCard from '@/components/Careers/JobCard';
import { JOBS } from '@/constants/careers';

const Careers: NextPage = () => (
  <div className="container pt-20">
    <section className="section flex items-center justify-center flex-wrap">
      <div className="w-full mb-5 md:w-1/2 md:pr-5 md:mb-0">
        <AnimatedWrapper>
          <div className="relative flex-grow-1 transition-fade-start transition-fade delay-lite">
            <Image
              src="/img/careers/careers_v02_2x.webp"
              alt="Satoshi moon"
              width={648}
              height={406}
              priority
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </AnimatedWrapper>
      </div>
      <div className="w-full md:w-1/2">
        <div className="flex-1 text-center md:text-left">
          <div className="mb-3">
            <AnimatedWrapper>
              <h3 className="transition-vertical-fade transition-vertical-fade-start whitespace-nowrap">
                JOIN NIFTY LEAGUE
              </h3>
            </AnimatedWrapper>
          </div>
          <AnimatedWrapper>
            <p className="transition-vertical-fade transition-vertical-fade-start delay-lite">
              Nifty League&apos;s mission is to create an open & efficient path for indie studios to develop & publish
              groundbreaking games. We are backed by top VCs including RSE Ventures, Lerer Hippeau, Spartan Group, and
              Gary Vaynerchuk, and are looking to bulk out our engineering team with world-class Unity game developers.
              As a startup, we are lean, have low egos, work hard and love what we do. You will have a large amount of
              ownership and work directly with the co-founders and community. If this sounds exciting to you, keep
              reading!
            </p>
          </AnimatedWrapper>
        </div>
      </div>
    </section>

    <section className="section">
      {JOBS.map(details => (
        <JobCard key={details.id} details={details} />
      ))}
    </section>
  </div>
);

export default Careers;
