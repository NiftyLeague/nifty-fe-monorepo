import { For } from 'solid-js'
import NiftyWorldCard from '@/components/cards/NiftyWorldCard'
import { NIFTY_WORLD_GAMES } from '@/constants/niftyworld-games'

const Web3GameList = () => (
  <For each={NIFTY_WORLD_GAMES}>
    {(game) => (
      <NiftyWorldCard
        title={game.title}
        description={game.description}
        image={game.image}
        href={`/games/${game.id}`}
        hoverActionLabel="Play game"
      />
    )}
  </For>
)

export default Web3GameList
