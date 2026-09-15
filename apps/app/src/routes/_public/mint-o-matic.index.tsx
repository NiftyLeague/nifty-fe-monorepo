import { createFileRoute } from '@tanstack/solid-router'

import NiftyWorldMintOMatic from '@/pages/mint-o-matic/NiftyWorldMintOMatic'
import { acceptSearch } from '@/url/search-schema'

export const Route = createFileRoute('/_public/mint-o-matic/')({
  validateSearch: acceptSearch,
  component: MintPage,
})

function MintPage() {
  return <NiftyWorldMintOMatic />
}
