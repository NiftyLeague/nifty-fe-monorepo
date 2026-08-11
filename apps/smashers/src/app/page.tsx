import { DeferredConsoleGame } from '@nl/ui/custom/deferred-console-game'
import { SocialsFooter } from '@nl/ui/custom/socials-footer'

import HomeInteractive from '@/components/HomeInteractive'
import DegensSection from '@/components/DegensSection'
import GameSection from '@/components/GameSection'

type NextSearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Home({ searchParams }: { searchParams: NextSearchParams }) {
  const { referral } = await searchParams
  return (
    <HomeInteractive hasReferral={Boolean(referral)}>
      <section id="console-game">
        <DeferredConsoleGame src="/video/smashers-960p.mp4" />
      </section>
      <section id="game-section" className="container section relative">
        <div className="purple-bg-orb orb-top-left" />
        <GameSection />
      </section>
      <section id="degens-section" className="container section relative">
        <div className="purple-bg-orb orb-top-right" />
        <div className="purple-bg-orb orb-bottom-left" />
        <DegensSection />
      </section>
      <SocialsFooter />
    </HomeInteractive>
  )
}
