import { Outlet, createFileRoute } from '@tanstack/react-router'

import AppQueryProvider from '@/query/AppQueryProvider'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/degens')({
  head: () => buildHead({ title: 'DEGENs' }),
  component: DegensLayout,
})

function DegensLayout() {
  return (
    <AppQueryProvider>
      <Outlet />
    </AppQueryProvider>
  )
}
