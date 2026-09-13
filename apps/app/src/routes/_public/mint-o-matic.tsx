import { Outlet, createFileRoute } from '@tanstack/react-router'

import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/mint-o-matic')({
  head: () => buildHead({ path: '/mint-o-matic', title: 'Mint-o-Matic' }),
  component: MintOMaticLayout,
})

function MintOMaticLayout() {
  return (
    <PublicContentContainer flush>
      <Outlet />
    </PublicContentContainer>
  )
}
