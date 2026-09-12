import { createFileRoute } from '@tanstack/react-router'

import GameRoute from '@/components/wrapper/GameRoute'
import { smashersBuild } from '@/constants/unity-builds'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/games/smashers')({
  head: () => buildHead({ title: 'Nifty Smashers' }),
  component: SmashersGame,
})

function SmashersGame() {
  return (
    <GameRoute unityConfig={smashersBuild.config}>
      <div style={{ marginBottom: 20 }}>
        <strong>
          Note: This is a deprecated version of Nifty Smashers. If you&apos;re looking for our
          latest mobile game please visit{' '}
          <a
            href="https://niftysmashers.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--color-blue)' }}
          >
            niftysmashers.com
          </a>
        </strong>
      </div>
    </GameRoute>
  )
}
