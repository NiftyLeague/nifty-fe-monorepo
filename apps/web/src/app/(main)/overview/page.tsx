import type { NextPage } from 'next'

import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'
import {
  DeferredOverviewCommunity,
  DeferredOverviewFAQ,
} from '@/components/DeferredOverviewSections'
import LearnCards from '@/components/LearnCards'

const Overview: NextPage = () => (
  <>
    <div className="container relative pt-20">
      <div className="purple-bg-orb orb-top-right" />
      <section className="section relative">
        <h1 className="text-center">OVERVIEW</h1>
        <div className="mt-3">
          <p className="text-center">Learn how to navigate the Nifty League Platform</p>
        </div>
        <LearnCards />
        <div className="purple-bg-orb orb-bottom-left" />
        <div className="purple-bg-orb orb-bottom-right" />
      </section>

      <section className="section">
        <div className="text-center mb-5 relative">
          <h2>Frequently Asked Questions</h2>
          <div className="purple-bg-orb" style={{ left: 'calc(50% - 200px)', top: '100px' }} />
        </div>

        <DeferredOverviewFAQ />

        <ThemeBtnGroup
          className="mt-6 xl:mt-8"
          primary={{
            href: '/docs/faq/general',
            title: 'More FAQ',
            external: true,
            className: 'theme-btn-purple',
          }}
        />
      </section>
    </div>

    <DeferredOverviewCommunity />
  </>
)

export default Overview
