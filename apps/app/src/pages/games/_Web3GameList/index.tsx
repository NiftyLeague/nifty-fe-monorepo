import NiftyWorldCard from '@/components/cards/NiftyWorldCard'
import { NIFTY_WORLD_GAMES } from '@/constants/niftyworld-games'

const Web3GameList = () => (
  <>
    {NIFTY_WORLD_GAMES.map((game) => (
      <NiftyWorldCard
        key={game.id}
        title={game.title}
        description={game.description}
        image={game.image}
        href={`/games/niftyworld/${game.id}`}
        hoverActionLabel="Play game"
      />
    ))}
  </>
)

export default Web3GameList
