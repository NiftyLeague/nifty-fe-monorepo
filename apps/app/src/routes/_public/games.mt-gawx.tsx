import { createFileRoute } from '@tanstack/react-router'

import GameRoute from '@/components/wrapper/GameRoute'
import { mtGawxBuild } from '@/constants/unity-builds'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/games/mt-gawx')({
  head: () => buildHead({ title: 'Mt. Gawx' }),
  component: MtGawxGame,
})

function MtGawxGame() {
  return <GameRoute unityConfig={mtGawxBuild.config} />
}
