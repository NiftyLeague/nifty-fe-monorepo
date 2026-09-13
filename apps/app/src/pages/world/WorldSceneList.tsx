import NiftyWorldCard from '@/components/cards/NiftyWorldCard'
import { NIFTY_WORLD_SCENES } from '@/constants/niftyworld-scenes'

const WorldSceneList = () => (
  <>
    {NIFTY_WORLD_SCENES.map((scene) => (
      <NiftyWorldCard
        key={scene.id}
        title={scene.title}
        description={scene.description}
        image={scene.image}
        href={`/world/niftyworld/${scene.id}`}
      />
    ))}
  </>
)

export default WorldSceneList
