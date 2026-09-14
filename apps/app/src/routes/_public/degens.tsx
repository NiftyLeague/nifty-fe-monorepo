import { Outlet, createFileRoute } from '@tanstack/react-router'

import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/degens')({
  head: () => buildHead({ path: '/degens', title: 'DEGENs' }),
  component: DegensLayout,
})

function DegensLayout() {
  return <Outlet />
}
