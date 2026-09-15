'use client'

import NativeImage from '@nl/ui/custom/native-image'

import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nl/ui/base/table'

import type { DataType } from '@/types/leaderboard'
import { LEADERBOARD_GAME_LIST } from '@/constants/leaderboards'
import CustomModal from './CustomModal'
import './modal-table.css'

import styles from './TopModal.module.css'
import { useLeaderboardScores } from '@/hooks/queries/useLeaderboardScores'
import QueryErrorState from '@/components/QueryErrorState'

interface TableModalProps {
  selectedGame: string
  flag: string
  selectedTimeFilter: string
  myRank?: number
}

const TableModal = ({
  selectedGame,
  flag,
  selectedTimeFilter,
  myRank,
}: TableModalProps): JSX.Element | null => {
  const offset = myRank && myRank >= 3 ? myRank - 3 : 0
  const {
    data: result,
    error,
    isPending,
    refetch,
  } = useLeaderboardScores(selectedGame, flag, selectedTimeFilter, 10, offset, Boolean(myRank))
  const data = result?.data as DataType[] | undefined

  const getTextStyleForRank = (rank: number) => {
    return rank === myRank ? { color: '#E49C8E' } : {}
  }

  // shorten user id letters
  const handleShareOnTwitter = () => {
    const currentGame = LEADERBOARD_GAME_LIST.filter((game) => game.key === selectedGame)?.[0]
    if (!currentGame) return
    const { display } = currentGame
    const obj = {
      original_referer: 'https://app.niftyleague.com/',
      ref_src: 'twsrc^tfw|twcamp^buttonembed|twterm^share|twgr^',
      text: `I ranked #${myRank} on the ${display} Top Score Leaderboard. Check out @niftyleague games: https://app.niftyleague.com/`,
      hashtags: 'NiftyLeague,NFT,NFTGaming',
    }
    if (typeof window !== 'undefined')
      window.open(`https://twitter.com/intent/tweet?${`${new URLSearchParams(obj)}`}`, '_blank')
  }

  return (
    <div class={styles.tableRoot}>
      {isPending && myRank && (
        <div class={styles.loadingBox} role="status" aria-label="Loading leaderboard">
          <CircularProgress />
        </div>
      )}
      {error && (
        <QueryErrorState
          error={error}
          onRetry={() => void refetch()}
          class="flex items-center justify-center gap-3 py-4 text-error"
        />
      )}
      <Table class="modal-table">
        <TableHeader class="header [&_tr]:border-0">
          <TableRow class="row border-0 hover:bg-transparent">
            <TableHead class="cell index" scope="col">
              <code>RANK</code>
            </TableHead>
            <TableHead class="cell ellipsis" scope="col">
              <code>USERNAME</code>
            </TableHead>
            {flag === 'win_rate' && (
              <TableHead class="cell ellipsis" scope="col">
                <code>WIN RATE</code>
              </TableHead>
            )}
            {flag === 'earnings' && (
              <TableHead
                class="cell ellipsis"
                scope="col"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>TOTAL NFTL EARNED</code>
              </TableHead>
            )}
            {selectedGame === 'nifty_smashers' && (
              <TableHead
                class="cell ellipsis"
                scope="col"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>MATCHES PLAYED</code>
              </TableHead>
            )}
            {flag === 'earnings' && (
              <TableHead
                class="cell ellipsis"
                scope="col"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>AVG,NFTL / MATCH</code>
              </TableHead>
            )}
            {flag !== 'win_rate' && selectedGame === 'nifty_smashers' && (
              <TableHead class="cell ellipsis" scope="col">
                <code>KILLS</code>
              </TableHead>
            )}
            {flag === 'score' && (
              <TableHead class="cell ellipsis" scope="col">
                <code>HIGH SCORE</code>
              </TableHead>
            )}
            {flag === 'burnings' && (
              <TableHead class="cell ellipsis" scope="col">
                <code>NFTL BURNED</code>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody class="body">
          {data?.map((i) => (
            <TableRow
              class="row first border-0 hover:bg-transparent"
              key={`${i.rank}-${i.user_id}`}
            >
              <TableCell class="cell index" style={{ color: '#9ba5bf' }}>
                <span class={styles.rankBody} style={getTextStyleForRank(i.rank)}>
                  {i.rank}
                </span>
                {i.rank === 1 && <div class={styles.lineTopBox} />}
                {i.rank === 10 && <div class={styles.lineBottomBox} />}
              </TableCell>
              <TableCell
                style={{ ...getTextStyleForRank(i.rank), fontSize: 14, background: '' }}
                class="cell ellipsis"
              >
                {i.user_id}
                {i.rank === 1 && <div class={styles.lineTopBox} />}
                {i.rank === 10 && <div class={styles.lineBottomBox} />}
              </TableCell>
              {flag === 'win_rate' && (
                <TableCell class="cell ellipsis">{i.stats.win_rate}</TableCell>
              )}
              {flag === 'earnings' && (
                <TableCell class="cell ellipsis end">
                  {i.stats.earnings}
                  {i.rank === 1 && flag === 'earnings' && <div class={styles.lineTopBox} />}
                  {i.rank === 10 && flag === 'earnings' && <div class={styles.lineBottomBox} />}
                </TableCell>
              )}
              {selectedGame === 'nifty_smashers' && (
                <TableCell
                  style={{ ...getTextStyleForRank(i.rank), fontSize: 14, background: '' }}
                  class="cell ellipsis end"
                >
                  {i.stats.matches}
                  {i.rank === 1 && flag === 'earnings' && <div class={styles.lineTopBox} />}
                  {i.rank === 10 && flag === 'earnings' && <div class={styles.lineBottomBox} />}
                </TableCell>
              )}
              {flag === 'earnings' && (
                <TableCell class="cell ellipsis end">
                  {i.stats['avg_NFTL/match']}
                  {i.rank === 1 && <div class={styles.lineTopBox} />}
                  {i.rank === 10 && <div class={styles.lineBottomBox} />}
                </TableCell>
              )}
              {flag !== 'win_rate' && selectedGame === 'nifty_smashers' && (
                <TableCell class="cell ellipsis end">{i.stats.kills}</TableCell>
              )}
              {selectedGame !== 'nifty_smashers' && (
                <TableCell
                  style={{ ...getTextStyleForRank(i.rank), fontSize: 14 }}
                  class="cell ellipsis end"
                >
                  {i.score}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data && (
        <button type="button" class={styles.twitterTypography} onClick={handleShareOnTwitter}>
          Share on twitter{' '}
          <NativeImage src="/icons/socials/twitter.svg" alt="Twitter Icon" width={22} height={20} />
        </button>
      )}
    </div>
  )
}

type TopModalProps = TableModalProps & {
  onOpenChange: (open: boolean) => void
  open: boolean
}

const TopModal = ({
  selectedGame,
  flag,
  onOpenChange,
  open,
  selectedTimeFilter,
  myRank,
}: TopModalProps): JSX.Element | null => {
  return (
    <CustomModal
      child={
        <TableModal
          selectedGame={selectedGame}
          flag={flag}
          selectedTimeFilter={selectedTimeFilter}
          myRank={myRank}
        />
      }
      flag={flag}
      onOpenChange={onOpenChange}
      open={open}
    />
  )
}
export default TopModal
