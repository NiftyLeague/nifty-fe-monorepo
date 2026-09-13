import { createFileRoute } from '@tanstack/react-router'

import DeferredWeb3GameList from '@/pages/games/DeferredWeb3GameList'
import GameList from '@/pages/games/_GameList'
import StaticSection from '@/components/sections/StaticSection'

export const Route = createFileRoute('/_public/games/')({
  component: GamesPage,
})

function GamesPage() {
  return (
    <>
      <StaticSection firstSection title="Flagship Games">
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <GameList />
        </div>
      </StaticSection>
      <StaticSection firstSection title="Mini Games">
        <DeferredWeb3GameList />
      </StaticSection>
    </>
  )
}
