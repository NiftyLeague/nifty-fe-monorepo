import NiftyWorldEmbed from '@/pages/world/NiftyWorldEmbed'
import { getNiftyWorldGameUrl, type NiftyWorldGame } from '@/constants/niftyworld-games'

interface NiftyWorldGameProps {
  game: NiftyWorldGame
}

export default function NiftyWorldGame({ game }: NiftyWorldGameProps) {
  return (
    <NiftyWorldEmbed
      title={game.title}
      eyebrow="Nifty League mini game"
      backHref="/games"
      backLabel="Back to games"
      frameTitle={`${game.title} mini game`}
      canonicalUrl={getNiftyWorldGameUrl(game)}
      getEmbedUrl={(attempt, visitId) => getNiftyWorldGameUrl(game, true, attempt, visitId)}
    />
  )
}
