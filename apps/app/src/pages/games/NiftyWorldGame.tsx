import NiftyWorldEmbed from '@/pages/world/NiftyWorldEmbed'
import { getNiftyWorldGameUrl, type NiftyWorldGame } from '@/constants/niftyworld-games'

interface NiftyWorldGameProps {
  game: NiftyWorldGame
}

export default function NiftyWorldGame(props: NiftyWorldGameProps) {
  return (
    <NiftyWorldEmbed
      title={props.game.title}
      eyebrow="Nifty League mini game"
      backHref="/games"
      backLabel="Back to games"
      frameTitle={`${props.game.title} mini game`}
      canonicalUrl={getNiftyWorldGameUrl(props.game)}
      getEmbedUrl={(attempt, visitId) => getNiftyWorldGameUrl(props.game, true, attempt, visitId)}
    />
  )
}
