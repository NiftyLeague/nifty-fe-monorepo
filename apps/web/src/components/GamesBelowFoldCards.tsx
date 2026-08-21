'use client'

import { NIFTY_GAMES } from '@/constants/games'
import GameCard from '@/components/GameCard'

export default function GamesBelowFoldCards() {
  return (
    <>
      {NIFTY_GAMES.slice(1).map((game, index) => (
        <GameCard key={game.name} game={game} index={index + 1} />
      ))}
    </>
  )
}
