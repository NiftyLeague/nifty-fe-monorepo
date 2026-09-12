import { createFileRoute } from '@tanstack/react-router'

import DeferredMintPage from '@/components/providers/DeferredMintPage'
import { acceptSearch } from '@/url/search-schema'

export const Route = createFileRoute('/_public/mint-o-matic/')({
  validateSearch: acceptSearch,
  component: MintPage,
})

function MintPage() {
  return <DeferredMintPage />
}
