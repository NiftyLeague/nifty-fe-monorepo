import { createFileRoute } from '@tanstack/solid-router'

import GameList from '@/pages/games/_GameList'
import DeferredWeb3GameList from '@/pages/games/DeferredWeb3GameList'
import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import StaticSection from '@/components/sections/StaticSection'
import { APP_DESCRIPTION, APP_TITLE, buildHead } from '@/runtime/metadata'
import { buildImagePreloadLink } from '@/runtime/image-preloads'

export const Route = createFileRoute('/_public/')({
  head: () => {
    const head = buildHead({
      path: '/',
      title: APP_TITLE,
      description: APP_DESCRIPTION,
      absoluteTitle: true,
    })
    return {
      ...head,
      links: [
        ...(head.links ?? []),
        // The first flagship card's poster wins LCP; preloading keeps it ahead
        // of the module chunk queue.
        buildImagePreloadLink(
          'https://cdn.niftyleague.com/media/img/games/smashers/smashers-poster.jpg'
        ),
      ],
    }
  },
  component: Home,
})

function Home() {
  return (
    <PublicContentContainer>
      <h1 class="sr-only">Nifty League App</h1>
      <StaticSection firstSection title="Flagship Games">
        <div class="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <GameList />
        </div>
      </StaticSection>
      <StaticSection firstSection title="Mini Games">
        <DeferredWeb3GameList />
      </StaticSection>
    </PublicContentContainer>
  )
}
