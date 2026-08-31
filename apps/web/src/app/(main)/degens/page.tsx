import type { NextPage } from 'next'

import { DeferredConsoleGame } from '@nl/ui/custom/deferred-console-game'
import { ConsoleGameBackdrop } from '@nl/ui/custom/console-game-backdrop'
import { DeferredYouTubeEmbed } from '@nl/ui/custom/deferred-youtube-embed'

import { DeferredDegenSpecialsTable } from '@/components/DeferredDegenSections'
import DegenGallery from '@/components/DegenGallery'
import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'

const Degens: NextPage = () => (
  <>
    <section className="relative xl:-top-20 2xl:-top-35">
      <DeferredConsoleGame deferVideo src="/video/unboxing.mp4">
        <ConsoleGameBackdrop loading="eager" />
      </DeferredConsoleGame>
    </section>

    <div className="container">
      <section className="section">
        <div className="flex items-center justify-center flex-wrap mb-4 md:mb-5">
          <div className="w-full md:w-1/2 md:pr-4">
            <div className="mb-4">
              <h1 className="text-center">DEGENs</h1>
            </div>
            <div className="mb-4">
              <h6 className="text-center">COMMUNITY DESIGNED NFTs</h6>
            </div>
            <div className="relative">
              <p className="text-center">
                The Nifty League DEGENs were specially crafted by the community with members
                pitching in and deciding how THEY wanted their DEGENs to look. This involved
                selecting special features that they wanted including selection of cothing, tribe,
                and weapons among a few others. This led to the birth of 10,000 Nifty League NFTs on
                the Ethereum blockchain. The NFTs are all sold out however they are forever tradable
                on secondary markets such as OpenSea.
              </p>
              <div className="purple-bg-orb orb-top-left" />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative text-right mb-4 md:mb-0 ps-0 lg:pl-5">
              <DeferredYouTubeEmbed
                src="https://www.youtube.com/embed/WWLqE1tnf6U"
                title="Nifty League DEGENs"
                className="h-[315px] w-full"
              />
            </div>
          </div>
        </div>

        <ThemeBtnGroup
          className="mt-6 xl:mt-10"
          primary={{
            href: 'https://app.niftyleague.com/degens',
            title: 'SEE ALL DEGENS',
            external: true,
          }}
        />
      </section>

      <DegenGallery />

      <section className="section">
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="mb-5">
            <h2 className="text-center">DEGEN TRIBES</h2>
          </div>
          <div className="relative">
            <p className="text-center">
              There are 7 genesis DEGEN tribes each with their own special abilities in our games.
              These NFTs are digital assets that represent special game avatars inside the Nifty
              League ecosystem. Owners can also use their DEGEN NFTs in several other partner
              projects such as WORLDWIDE WEBB or CRYPTO FOXES.
            </p>
            <div className="purple-bg-orb orb-top-left" />
          </div>
        </div>

        <DeferredDegenSpecialsTable />

        <ThemeBtnGroup
          className="mt-6 xl:mt-8"
          primary={{ href: '/docs/overview/nfts/degens/about', title: 'VIEW DOCS', external: true }}
        />
      </section>
    </div>
  </>
)

export default Degens
