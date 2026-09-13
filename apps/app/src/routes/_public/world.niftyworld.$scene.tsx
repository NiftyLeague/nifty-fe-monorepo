import { createFileRoute, redirect } from '@tanstack/react-router'

import { getNiftyWorldScene } from '@/constants/niftyworld-scenes'
import NiftyWorldScene from '@/pages/world/NiftyWorldScene'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/world/niftyworld/$scene')({
  beforeLoad: ({ params }) => {
    if (!getNiftyWorldScene(params.scene)) {
      throw redirect({ href: '/world', replace: true })
    }
  },
  head: ({ params }) =>
    buildHead({ title: getNiftyWorldScene(params.scene)?.title ?? 'Nifty World' }),
  component: NiftyWorldSceneRoute,
})

function NiftyWorldSceneRoute() {
  const scene = getNiftyWorldScene(Route.useParams().scene)

  if (!scene) return null

  return <NiftyWorldScene key={scene.id} scene={scene} />
}
