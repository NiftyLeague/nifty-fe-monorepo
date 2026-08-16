import type { NextPage } from 'next'

import OptimizedImage from '@nl/ui/custom/optimized-image'

import { DeferredCareersJobs } from '@/components/DeferredCareersSections'

const Careers: NextPage = () => (
  <div className="container pt-20">
    <section className="section flex items-center justify-center flex-wrap">
      <div className="w-full mb-5 md:w-1/2 md:pr-5 md:mb-0">
        <div className="relative flex-grow-1">
          <OptimizedImage
            src="/img/careers/careers_v02_2x.webp"
            alt="Satoshi moon"
            width={648}
            height={406}
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <div className="flex-1 text-center md:text-left">
          <div className="mb-3">
            <h3 className="whitespace-nowrap">JOIN NIFTY LEAGUE</h3>
          </div>
          <p>
            Nifty League&apos;s mission is to create an open & efficient path for indie studios to
            develop & publish groundbreaking games. We are backed by top VCs including RSE Ventures,
            Lerer Hippeau, Spartan Group, and Gary Vaynerchuk, and are looking to bulk out our
            engineering team with world-class Unity game developers. As a startup, we are lean, have
            low egos, work hard and love what we do. You will have a large amount of ownership and
            work directly with the co-founders and community. If this sounds exciting to you, keep
            reading!
          </p>
        </div>
      </div>
    </section>

    <section className="section">
      <DeferredCareersJobs />
    </section>
  </div>
)

export default Careers
