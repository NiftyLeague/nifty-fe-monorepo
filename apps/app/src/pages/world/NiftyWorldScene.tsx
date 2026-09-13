import NiftyWorldEmbed from './NiftyWorldEmbed'
import { getNiftyWorldSceneUrl, type NiftyWorldScene } from '@/constants/niftyworld-scenes'

interface NiftyWorldSceneProps {
  scene: NiftyWorldScene
}

export default function NiftyWorldScene({ scene }: NiftyWorldSceneProps) {
  return (
    <NiftyWorldEmbed
      title={scene.title}
      eyebrow="Nifty World"
      backHref="/world"
      backLabel="Back to maps"
      frameTitle={`${scene.title} world scene`}
      canonicalUrl={getNiftyWorldSceneUrl(scene)}
      getEmbedUrl={(attempt, visitId) => getNiftyWorldSceneUrl(scene, true, attempt, visitId)}
    />
  )
}
