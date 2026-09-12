import { Outlet, createFileRoute } from '@tanstack/react-router'

import WalletAuthContextWrapper from '@/contexts/WalletAuthContextWrapper'
import { APP_TITLE, buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/verification')({
  // The original route declared no metadata, so it inherited the app defaults
  // and stayed indexable. Keep that behavior.
  head: () => buildHead({ title: APP_TITLE, absoluteTitle: true }),
  component: VerificationLayout,
})

function VerificationLayout() {
  return (
    <WalletAuthContextWrapper>
      <Outlet />
    </WalletAuthContextWrapper>
  )
}
