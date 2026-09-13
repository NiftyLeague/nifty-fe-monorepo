import { Outlet, createFileRoute } from '@tanstack/react-router'

import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/mint-o-matic')({
  head: () => buildHead({ title: 'Mint-o-Matic' }),
  component: MintOMaticLayout,
})

function MintOMaticLayout() {
  return (
    <PublicContentContainer>
      <Outlet />
    </PublicContentContainer>
  )
}
