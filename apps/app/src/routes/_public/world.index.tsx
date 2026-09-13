import { createFileRoute } from '@tanstack/react-router'

import StaticSection from '@/components/sections/StaticSection'
import WorldSceneList from '@/pages/world/WorldSceneList'

export const Route = createFileRoute('/_public/world/')({
  component: WorldPage,
})

function WorldPage() {
  return (
    <StaticSection firstSection title="NIFTY WORLD">
      <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
        <WorldSceneList />
      </div>
    </StaticSection>
  )
}
