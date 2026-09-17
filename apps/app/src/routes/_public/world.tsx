import { Outlet, createFileRoute } from '@tanstack/solid-router'

import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/world')({
  head: () => buildHead({ path: '/world', title: 'World' }),
  component: WorldLayout,
})

function WorldLayout() {
  return (
    <PublicContentContainer fill>
      <Outlet />
    </PublicContentContainer>
  )
}
