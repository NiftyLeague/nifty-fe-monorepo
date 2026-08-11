import { DeferredConsoleGame } from '@nl/ui/custom/deferred-console-game'
import { SocialsFooter } from '@nl/ui/custom/socials-footer'

import { DeferredDegensSection, DeferredGameSection } from '@/components/DeferredHomeSections'
import HomeInteractive from '@/components/HomeInteractive'

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
        <DeferredGameSection />
      </section>
      <section id="degens-section" className="container section relative">
        <div className="purple-bg-orb orb-top-right" />
        <div className="purple-bg-orb orb-bottom-left" />
        <DeferredDegensSection />
      </section>
      <SocialsFooter />
    </HomeInteractive>
  )
}
