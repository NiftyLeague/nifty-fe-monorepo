import { Outlet, createFileRoute } from '@tanstack/react-router'

import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/games')({
  head: () => buildHead({ path: '/games', title: 'Games' }),
  component: GamesLayout,
})

function GamesLayout() {
  return (
    <PublicContentContainer>
      <Outlet />
    </PublicContentContainer>
  )
}
