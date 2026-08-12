import type { NextPage } from 'next'

import { DeferredTeamCarousel } from '@/components/DeferredTeamSections'
import ThemeBtnGroup from '@/components/ThemeBtnGroup'
import TeamDesktop from '@/components/TeamDesktop'

const Team: NextPage = () => {
  return (
    <>
      <div className="container pt-20">
        <section className="section relative">
          <div className="flex flex-col items-center">
            <h1 className="text-center">NIFTY DAO</h1>
            <div className="mt-5 sm:mt-3 max-w-2xl">
              <p className="text-center p1">
                Nifty League is a game studio at the cutting edge of Web3. Our mission is to inspire
                indie game developers to build a decentralized future with us by establishing a game
                studio focused on unparalleled quality and player experiences.
              </p>
              <br />
              <p className="text-center p1">
                We will gradually transfer ownership of Nifty League to our DAO in order to
                decentralize the platform and encourage others to build with us! Our vision is to
                power rapid growth and development through community contributions enabling us to
                build a gaming platform like no other. Simply put, DAOs are the future. We see only
                one route to becoming the world&apos;s leading gaming platform and that&apos;s by
                building together. 💜
              </p>
            </div>

            <ThemeBtnGroup
              primary={{ href: '/careers', title: 'JOIN US' }}
              secondary={{ href: '/roadmap', title: 'VIEW OUR ROADMAP' }}
            />
          </div>
          <div className="purple-bg-orb orb-top-right" />
        </section>

        <section className="section relative">
          <h4 className="text-center">MEET THE DEGENS WHO MAKE NIFTY LEAGUE POSSIBLE</h4>
          <TeamDesktop />
          <div
            className="teams-slider slider px-0 block md:hidden"
            style={{ alignItems: 'center', maxWidth: '100%', textAlign: 'center', minHeight: 300 }}
          >
            <DeferredTeamCarousel />
          </div>
          <div className="purple-bg-orb orb-top-left" />
        </section>
      </div>
    </>
  )
}

export default Team
