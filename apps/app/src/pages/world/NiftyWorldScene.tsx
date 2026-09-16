import NiftyWorldEmbed from './NiftyWorldEmbed'
import { getNiftyWorldSceneUrl, type NiftyWorldScene } from '@/constants/niftyworld-scenes'

interface NiftyWorldSceneProps {
  scene: NiftyWorldScene
}

export default function NiftyWorldScene(props: NiftyWorldSceneProps) {
  return (
    <NiftyWorldEmbed
      title={props.scene.title}
      eyebrow="Nifty World"
      backHref="/world"
      backLabel="Back to maps"
      frameTitle={`${props.scene.title} world map`}
      canonicalUrl={getNiftyWorldSceneUrl(props.scene)}
      getEmbedUrl={(attempt, visitId) => getNiftyWorldSceneUrl(props.scene, true, attempt, visitId)}
    />
  )
}
