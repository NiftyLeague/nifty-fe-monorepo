import { Outlet, createFileRoute } from '@tanstack/react-router'

import WalletAuthContextWrapper from '@/contexts/WalletAuthContextWrapper'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/verification')({
  head: () => buildHead({ title: 'Wallet Verification', noindex: true }),
  component: VerificationLayout,
})

function VerificationLayout() {
  return (
    <WalletAuthContextWrapper>
      <Outlet />
    </WalletAuthContextWrapper>
  )
}
