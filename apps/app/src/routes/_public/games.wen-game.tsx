import { createFileRoute } from '@tanstack/react-router'

import GameRoute from '@/components/wrapper/GameRoute'
import { wenGameBuild } from '@/constants/unity-builds'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/games/wen-game')({
  head: () => buildHead({ title: 'WEN Game' }),
  component: WenGame,
})

function WenGame() {
  return <GameRoute unityConfig={wenGameBuild.config} arcadeTokenRequired />
}
