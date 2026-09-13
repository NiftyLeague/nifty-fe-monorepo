import { Outlet, createFileRoute } from '@tanstack/react-router'

import AppQueryProvider from '@/query/AppQueryProvider'
import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/world')({
  head: () => buildHead({ path: '/world', title: 'World' }),
  component: WorldLayout,
})

function WorldLayout() {
  return (
    <AppQueryProvider>
      <PublicContentContainer>
        <Outlet />
      </PublicContentContainer>
    </AppQueryProvider>
  )
}
