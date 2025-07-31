import type { NextPage } from 'next';
import Image from 'next/image';

import { Accordion } from '@nl/ui/custom/Accordion';
import { AnimatedWrapper } from '@nl/ui/custom/AnimatedWrapper';
import ThemeBtnGroup from '@/components/ThemeBtnGroup';
import LearnCards from '@/components/LearnCards';
import { FAQS } from '@/constants/faq';

const Overview: NextPage = () => (
  <>
    <div className="container relative pt-20">
      <div className="purple-bg-orb orb-top-right" />
      <section className="section relative">
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
        <div className="purple-bg-orb orb-bottom-left" />
        <div className="purple-bg-orb orb-bottom-right" />
      </section>

      <section className="section">
        <div className="text-center mb-5 relative">
          <AnimatedWrapper>
            <h2 className="transition-vertical-fade transition-vertical-fade-start delay-lite">
              Frequently Asked Questions
            </h2>
          </AnimatedWrapper>
          <div className="purple-bg-orb" style={{ left: 'calc(50% - 200px)', top: '100px' }} />
        </div>

        <Accordion items={FAQS} defaultValue="item-1" />

        <ThemeBtnGroup
          className="mt-6 xl:mt-8"
          primary={{ href: '/docs/faq/general', title: 'More FAQ', external: true, className: 'theme-btn-purple' }}
        />
      </section>
    </div>

    <section className="section relative w-full">
      {/* Desktop Image - hidden by default on small screens */}
      <Image
        alt="DGEN Network background desktop"
        className="pixelated hidden md:block"
        src="/img/backgrounds/dgen-network.webp"
        width={1440}
        height={813}
        priority
        sizes="100vw"
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
      {/* Mobile Image - shown by default on small screens */}
      <Image
        alt="DGEN Network background mobile"
        className="pixelated block md:hidden"
        src="/img/backgrounds/dgen-network-mobile.webp"
        width={375}
        height={500}
        priority
        sizes="100vw"
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
      <div className="dark-gradient-overlay" />
      <div className="w-full h-auto absolute top-0 text-center flex items-center flex-col mt-40 md:mt-10 lg:mt-20">
        <h2 className="mt-4">Stay in the loop</h2>
        <p className="my-3 px-4 text-center">Meet our community and stay up to date with our roadmap or team updates</p>
        <ThemeBtnGroup
          className="mt-2 xl:mt-2"
          primary={{ href: 'https://discord.gg/niftyleague', title: 'JOIN DISCORD', external: true }}
        />
      </div>
    </section>
  </>
);

export default Overview;
