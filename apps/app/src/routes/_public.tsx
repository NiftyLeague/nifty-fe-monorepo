import { Outlet, createFileRoute } from '@tanstack/react-router'

import PublicMainLayout from '@/layouts/_layout/_PublicMainLayout'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <PublicMainLayout>
      <Outlet />
    </PublicMainLayout>
  )
}
