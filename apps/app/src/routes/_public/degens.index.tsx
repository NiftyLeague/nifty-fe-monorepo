import { createFileRoute } from '@tanstack/react-router'
import { queryOptions } from '@tanstack/react-query'

import { queryKeys } from '@/query/app-query'
import { buildPublicDegensRequestQuery, normalizeDegenSearchState } from '@/url/search-state'
import { acceptSearch, parseDegenSearch } from '@/url/search-schema'
import { getPublicDegenPageWire } from '@/utils/public-degen-query'
import { buildHead } from '@/runtime/metadata'
import DegenRoute from '@/pages/degens/DegenRoute'

const DEGENS_PAGE_SIZE = 12

export const Route = createFileRoute('/_public/degens/')({
  head: () => buildHead({ title: 'DEGENs' }),
  // Pass the params through untouched; nuqs owns URL state for this route.
  validateSearch: acceptSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const searchState = normalizeDegenSearchState(parseDegenSearch(deps))
    const requestQuery = buildPublicDegensRequestQuery(searchState, DEGENS_PAGE_SIZE)

    // Prefetch on the server so the first paint already has the DEGEN grid.
    await context.queryClient.ensureQueryData(
      queryOptions({
        queryKey: queryKeys.publicDegens.list(requestQuery),
        queryFn: () => getPublicDegenPageWire(new URLSearchParams(requestQuery)),
      })
    )
  },
  component: DegensPage,
})

function DegensPage() {
  return <DegenRoute />
}
