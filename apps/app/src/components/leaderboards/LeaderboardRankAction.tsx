'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import * as gtm from '@nl/ui/gtm/events'
import { EVENTS as GTM_EVENTS } from '@nl/ui/gtm/constants'

import useAuth from '@/hooks/useAuth'
import usePlayerProfile from '@/hooks/usePlayerProfile'
import { fetchRankByUserId } from '@/utils/leaderboard'
import { errorMsgHandler } from '@/utils/errorHandlers'

import LeaderboardProviders from '@/contexts/LeaderboardProviders'

const TopModal = dynamic(() => import('./TopModal'), { ssr: false })

export interface LeaderboardRankActionProps {
  selectedGame: string
  selectedTable: string
  selectedTimeFilter: string
}

const LeaderboardRankAction = ({
  selectedGame,
  selectedTable,
  selectedTimeFilter,
}: LeaderboardRankActionProps): React.ReactNode | null => {
  const [myRank, setMyRank] = useState<number>()
  const [isRankModalOpen, setIsRankModalOpen] = useState(false)
  const { isLoggedIn } = useAuth()
  const { profile } = usePlayerProfile()

  if (!isLoggedIn) return null

  const handleCheckYourRank = async () => {
    gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, {
      content_type: 'leaderboard_rank',
      content_id: selectedGame,
    })
    const errorMes =
      'You have not played the game yet! Play the game to see your rank on the leaderboard.'

    if (!profile?.id) {
      toast.error(errorMes)
      return
    }
    try {
      const result: unknown = await fetchRankByUserId(
        profile.id,
        selectedGame,
        selectedTable,
        selectedTimeFilter
      )
      if (!result || typeof result !== 'object' || !('ok' in result) || !(result as Response).ok) {
        const errMsg =
          result && typeof result === 'object' && 'text' in result
            ? await (result as Response).text()
            : 'Unknown error'
        toast.error(errMsg)
        return
      }
      const res = await (result as Response).json()
      if (res < 1) {
        toast.error(errorMes)
        return
      }
      setMyRank(res)
      setIsRankModalOpen(true)
    } catch (error) {
      toast.error(errorMsgHandler(error))
    }
  }

  return (
    <>
      <TopModal
        selectedGame={selectedGame}
        selectedTimeFilter={selectedTimeFilter}
        flag={selectedTable}
        myRank={myRank}
        onOpenChange={setIsRankModalOpen}
        open={isRankModalOpen}
      />
      {selectedGame !== 'crypto_winter' && (
        <button
          type="button"
          onClick={handleCheckYourRank}
          className="mb-4 flex cursor-pointer justify-end border-0 bg-transparent p-0 text-left lg:absolute lg:right-0 lg:mb-0 lg:translate-y-1/2"
          style={{ zIndex: 1000 }}
        >
          <span
            className="flex items-center justify-end text-base font-subheader font-bold text-[var(--color-purple)] underline"
            style={{ lineHeight: '24px' }}
          >
            <Image
              src="/icons/rank_icon.svg"
              alt="Rank Icon"
              width={25}
              height={20}
              style={{ marginRight: 4 }}
            />
            RANK
          </span>
        </button>
      )}
    </>
  )
}

export default function LeaderboardRankActionWithWallet(props: LeaderboardRankActionProps) {
  return (
    <LeaderboardProviders>
      <LeaderboardRankAction {...props} />
    </LeaderboardProviders>
  )
}
