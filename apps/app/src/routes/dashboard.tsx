import { Outlet, createFileRoute } from '@tanstack/react-router'

import AuthGuard from '@/utils/route-guard/AuthGuard'
import PrivateRoutesBoundary from '@/components/providers/PrivateRoutesBoundary'
import { buildHead } from '@/runtime/metadata'
import { getRequestCookieHeader } from '@/runtime/request-cookies'

export const Route = createFileRoute('/dashboard')({
  head: () => buildHead({ title: 'Dashboard' }),
  component: DashboardLayout,
})

function DashboardLayout() {
  // Wallet state is persisted in cookies. Reading them here lets the server
  // render the connected shell instead of flashing the disconnected one.
  const cookies = getRequestCookieHeader()

  return (
    <PrivateRoutesBoundary cookies={cookies}>
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    </PrivateRoutesBoundary>
  )
}
