import { createFileRoute } from '@tanstack/solid-router'
import { isServer } from 'solid-js/web'

import DeferredLeaderboards from '@/components/providers/DeferredLeaderboards'
import { Title } from '@nl/ui/custom/typography'
import { LEADERBOARD_GAME_LIST } from '@/constants/leaderboards'
import { queryKeys } from '@/query/app-query'
import { fetchScores } from '@/utils/leaderboard'
import { acceptSearch, parseLeaderboardSearch } from '@/url/search-schema'

const LEADERBOARD_PAGE_SIZE = 50

export const Route = createFileRoute('/_public/leaderboards/')({
  validateSearch: acceptSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    // The scores table is a client-only deferred component, so on the server
    // there is nothing to prefetch into — the component fetches after mount.
    // On the client (including 'intent' preloads on hover/focus) we warm the
    // exact page query so the request is already in flight before navigation.
    if (isServer) return

    const search = parseLeaderboardSearch(deps)
    const game =
      LEADERBOARD_GAME_LIST.find((entry) => entry.key === search.game) ?? LEADERBOARD_GAME_LIST[0]
    const table = game?.tables.find((entry) => entry.key === search.table) ?? game?.tables[0]
    const time =
      search.game === 'nftl_burner' && search.time === 'weekly' ? 'all_time' : search.time
    const offset = (Math.max(1, search.page) - 1) * LEADERBOARD_PAGE_SIZE

    if (!table) return

    void context.queryClient.prefetchQuery({
      queryKey: queryKeys.leaderboards.page(
        search.game,
        table.key,
        time,
        LEADERBOARD_PAGE_SIZE,
        offset
      ),
      queryFn: ({ signal }) =>
        fetchScores(search.game, table.key, time, LEADERBOARD_PAGE_SIZE, offset, signal),
    })
  },
  component: LeaderboardPage,
})

function LeaderboardPage() {
  return (
    <>
      <Title level={2} class="mb-4">
        Leaderboards (Archived)
      </Title>
      <DeferredLeaderboards />
    </>
  )
}
