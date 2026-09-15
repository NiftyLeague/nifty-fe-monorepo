import { For } from 'solid-js'
import NiftyWorldCard from '@/components/cards/NiftyWorldCard'
import { NIFTY_WORLD_SCENES } from '@/constants/niftyworld-scenes'

const WorldSceneList = () => (
  <For each={NIFTY_WORLD_SCENES}>
    {(scene) => (
      <NiftyWorldCard
        title={scene.title}
        description={scene.description}
        image={scene.image}
        href={`/world/${scene.id}`}
        hoverActionLabel="Explore map"
      />
    )}
  </For>
)

export default WorldSceneList
