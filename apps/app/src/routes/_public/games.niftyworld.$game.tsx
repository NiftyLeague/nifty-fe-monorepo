import { createFileRoute, redirect } from '@tanstack/react-router'

import { getNiftyWorldGame } from '@/constants/niftyworld-games'
import NiftyWorldGame from '@/pages/games/NiftyWorldGame'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/games/niftyworld/$game')({
  beforeLoad: ({ params }) => {
    if (!getNiftyWorldGame(params.game)) {
      throw redirect({ href: '/games', replace: true })
    }
  },
  head: ({ params }) =>
    buildHead({ title: getNiftyWorldGame(params.game)?.title ?? 'Nifty World Mini Game' }),
  component: NiftyWorldGameRoute,
})

function NiftyWorldGameRoute() {
  const game = getNiftyWorldGame(Route.useParams().game)

  if (!game) return null

  return <NiftyWorldGame key={game.id} game={game} />
}
