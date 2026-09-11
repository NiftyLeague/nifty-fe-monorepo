import { createFileRoute } from '@tanstack/react-router'

import GameRoute from '@/components/wrapper/GameRoute'
import { cryptoWinterBuild } from '@/constants/unity-builds'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/games/crypto-winter')({
  head: () => buildHead({ title: 'Crypto Winter' }),
  component: CryptoWinterGame,
})

function CryptoWinterGame() {
  return <GameRoute unityConfig={cryptoWinterBuild.config} arcadeTokenRequired />
}
