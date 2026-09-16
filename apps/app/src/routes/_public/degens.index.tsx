import { createFileRoute } from '@tanstack/solid-router'
import { queryOptions } from '@tanstack/solid-query'

import { queryKeys } from '@/query/app-query'
import { buildPublicDegensRequestQuery, normalizeDegenSearchState } from '@/url/search-state'
import { acceptSearch, parseDegenSearch } from '@/url/search-schema'
import { getPublicDegenPageWire } from '@/utils/public-degen-query'
import { buildHead } from '@/runtime/metadata'
import DegenRoute from '@/pages/degens/DegenRoute'

const DEGENS_PAGE_SIZE = 12
const LIST_VIEW_PAGE_SIZE = 18

export const Route = createFileRoute('/_public/degens/')({
  head: () => buildHead({ path: '/degens', title: 'DEGENs' }),
  // Pass the params through untouched; the typed parsers own URL state here.
  validateSearch: acceptSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const searchState = normalizeDegenSearchState(parseDegenSearch(deps))
    // Mirror AllDegensPage's pageSize formula: grid (the default) always
    // fetches 12; list view fetches 18 on wide screens. The viewport is not
    // known server-side, so the non-primary size is warmed without blocking
    // the server render — the client then finds its exact query already
    // cached whichever viewport it hydrates at.
    const primaryPageSize = searchState.layout === 'gridOn' ? LIST_VIEW_PAGE_SIZE : DEGENS_PAGE_SIZE
    const secondaryPageSize =
      primaryPageSize === DEGENS_PAGE_SIZE ? LIST_VIEW_PAGE_SIZE : DEGENS_PAGE_SIZE

    const queryFor = (pageSize: number) =>
      queryOptions({
        queryKey: queryKeys.publicDegens.list(buildPublicDegensRequestQuery(searchState, pageSize)),
        queryFn: () =>
          getPublicDegenPageWire(
            new URLSearchParams(buildPublicDegensRequestQuery(searchState, pageSize))
          ),
      })

    await context.queryClient.ensureQueryData(queryFor(primaryPageSize))
    void context.queryClient.prefetchQuery(queryFor(secondaryPageSize))
  },
  component: DegensPage,
})

function DegensPage() {
  return <DegenRoute />
}
