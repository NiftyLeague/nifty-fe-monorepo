import { DeferredConsoleGame } from '@nl/ui/custom/deferred-console-game'
import { SocialsFooter } from '@nl/ui/custom/socials-footer'

import { DeferredDegensSection, DeferredGameSection } from '@/components/DeferredHomeSections'
import Header, { type ActiveModal } from '@/components/Header'

type NextSearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Home({ searchParams }: { searchParams: NextSearchParams }) {
  const { referral } = await searchParams
  const activeModal: ActiveModal = referral ? 'play' : null

  return (
    <main>
      <section id="header">
        <Header activeModal={activeModal} />
      </section>
      <section id="console-game">
        <DeferredConsoleGame src="/video/smashers.mp4" />
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
    </main>
  )
}
