import { createFileRoute } from '@tanstack/react-router'

import GameList from '@/pages/games/_GameList'
import DeferredWeb3GameList from '@/pages/games/DeferredWeb3GameList'
import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import StaticSection from '@/components/sections/StaticSection'
import { APP_DESCRIPTION, APP_TITLE, buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/')({
  head: () => buildHead({ title: APP_TITLE, description: APP_DESCRIPTION, absoluteTitle: true }),
  component: Home,
})

function Home() {
  return (
    <PublicContentContainer>
      <h1 className="sr-only">Nifty League App</h1>
      <StaticSection firstSection title="Flagship Games">
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <GameList />
        </div>
      </StaticSection>
      <StaticSection firstSection title="Mini Games">
        <DeferredWeb3GameList />
      </StaticSection>
    </PublicContentContainer>
  )
}
