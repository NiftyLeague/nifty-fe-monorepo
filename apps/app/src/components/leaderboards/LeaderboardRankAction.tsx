'use client'

import dynamic from '@/runtime/dynamic'
import NativeImage from '@nl/ui/custom/native-image'
import { createSignal, Show, type JSX } from 'solid-js'
import { toast } from 'solid-sonner'
import { useQueryClient } from '@tanstack/solid-query'

import * as gtm from '@nl/ui/gtm/events'
import { EVENTS as GTM_EVENTS } from '@nl/ui/gtm/constants'

import useAuth from '@/hooks/useAuth'
import usePlayerProfile from '@/hooks/usePlayerProfile'
import { fetchRankByUserId } from '@/utils/leaderboard'
import { errorMsgHandler } from '@/utils/errorHandlers'
import { AUTHENTICATED_STALE_TIME_MS, queryKeys } from '@/query/app-query'

import LeaderboardProviders from '@/contexts/LeaderboardProviders'

const TopModal = dynamic(() => import('./TopModal'), { ssr: false })

export interface LeaderboardRankActionProps {
  selectedGame: string
  selectedTable: string
  selectedTimeFilter: string
}

const LeaderboardRankAction = (props: LeaderboardRankActionProps): JSX.Element | null => {
  const [myRank, setMyRank] = createSignal<number>()
  const [isRankModalOpen, setIsRankModalOpen] = createSignal(false)
  const queryClient = useQueryClient()
  const auth = useAuth()
  const playerProfile = usePlayerProfile()

  const handleCheckYourRank = async () => {
    gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, {
      content_type: 'leaderboard_rank',
      content_id: props.selectedGame,
    })
    const errorMes =
      'You have not played the game yet! Play the game to see your rank on the leaderboard.'

    const profile = playerProfile.profile
    if (!profile?.id) {
      toast.error(errorMes)
      return
    }
    try {
      const rank = await queryClient.fetchQuery({
        queryKey: queryKeys.leaderboards.rank(
          profile.id,
          props.selectedGame,
          props.selectedTable,
          props.selectedTimeFilter
        ),
        queryFn: ({ signal }) =>
          fetchRankByUserId(
            profile.id,
            props.selectedGame,
            props.selectedTable,
            props.selectedTimeFilter,
            signal
          ),
        staleTime: AUTHENTICATED_STALE_TIME_MS,
      })
      if (rank < 1) {
        toast.error(errorMes)
        return
      }
      setMyRank(rank)
      setIsRankModalOpen(true)
    } catch (error) {
      toast.error(errorMsgHandler(error))
    }
  }

  return (
    <Show when={auth.isLoggedIn}>
      <TopModal
        selectedGame={props.selectedGame}
        selectedTimeFilter={props.selectedTimeFilter}
        flag={props.selectedTable}
        myRank={myRank()}
        onOpenChange={setIsRankModalOpen}
        open={isRankModalOpen()}
      />
      <Show when={props.selectedGame !== 'crypto_winter'}>
        <button
          type="button"
          onClick={() => void handleCheckYourRank()}
          class="mb-4 flex cursor-pointer justify-end border-0 bg-transparent p-0 text-left lg:absolute lg:right-0 lg:mb-0 lg:translate-y-1/2"
          style={{ 'z-index': 1000 }}
        >
          <span
            class="flex items-center justify-end text-base font-subheader font-bold text-[var(--color-purple)] underline"
            style={{ 'line-height': '24px' }}
          >
            <NativeImage
              src="/icons/rank_icon.svg"
              alt="Rank Icon"
              width={25}
              height={20}
              style={{ 'margin-right': '4px' }}
            />
            RANK
          </span>
        </button>
      </Show>
    </Show>
  )
}

export default function LeaderboardRankActionWithWallet(props: LeaderboardRankActionProps) {
  return (
    <LeaderboardProviders>
      <LeaderboardRankAction {...props} />
    </LeaderboardProviders>
  )
}
