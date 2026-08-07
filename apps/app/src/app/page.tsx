'use client'

import SectionSlider from '@/components/sections/SectionSlider'
import GameList from '@/app/(public-routes)/games/_GameList'
import Web3GameList from '@/app/(public-routes)/games/_Web3GameList'

const Home = () => {
  return (
    <>
      <SectionSlider firstSection title="Free-2-Play Games" isSlider={false}>
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <GameList />
        </div>
      </SectionSlider>
      <SectionSlider
        firstSection
        title="Web3 Games"
        isSlider={false}
        // actions={
        //   <Link href="/games">
        //     <Button variant="outlined">View All Games</Button>
        //   </Link>
        // }
      >
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <Web3GameList />
        </div>
      </SectionSlider>
    </>
  )
}

export default Home
