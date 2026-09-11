import { Outlet, createFileRoute } from '@tanstack/react-router'

import DeferredMintProviders from '@/components/providers/DeferredMintProviders'
import PublicContentContainer from '@/components/wrapper/PublicContentContainer'
import { buildHead } from '@/runtime/metadata'
import { getRequestCookieHeader } from '@/runtime/request-cookies'

export const Route = createFileRoute('/_public/mint-o-matic')({
  head: () => buildHead({ title: 'Mint-o-Matic' }),
  component: MintOMaticLayout,
})

function MintOMaticLayout() {
  // Read on the server during SSR and from `document.cookie` after hydration
  // so the wallet connection survives client-side navigations.
  const cookies = getRequestCookieHeader()

  return (
    <DeferredMintProviders cookies={cookies}>
      <PublicContentContainer>
        <Outlet />
      </PublicContentContainer>
    </DeferredMintProviders>
  )
}
