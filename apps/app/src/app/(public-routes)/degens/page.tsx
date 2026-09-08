import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createLoader } from 'nuqs/server'

import { createAppQueryClient, queryKeys } from '@/query/app-query'
import {
  buildPublicDegensRequestQuery,
  degenSearchParsers,
  normalizeDegenSearchState,
} from '@/url/search-state'
import { getPublicDegenPageWire } from '@/utils/public-degen-query'
import DegenRoute from './DegenRoute'

const loadSearchState = createLoader(degenSearchParsers)

type DegensPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function DegensPage({ searchParams }: DegensPageProps) {
  const searchState = normalizeDegenSearchState(await loadSearchState(await searchParams))
  const requestQuery = buildPublicDegensRequestQuery(searchState, 12)
  const queryClient = createAppQueryClient()
  await queryClient.prefetchQuery({
    queryKey: queryKeys.publicDegens.list(requestQuery),
    queryFn: () => getPublicDegenPageWire(new URLSearchParams(requestQuery)),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DegenRoute />
    </HydrationBoundary>
  )
}
