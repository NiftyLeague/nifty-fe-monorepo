'use client'

import { For, Show, type JSX } from 'solid-js'
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

const TableModal = (props: TableModalProps): JSX.Element | null => {
  const offset = () => (props.myRank && props.myRank >= 3 ? props.myRank - 3 : 0)
  const query = useLeaderboardScores(
    () => props.selectedGame,
    () => props.flag,
    () => props.selectedTimeFilter,
    10,
    offset,
    () => Boolean(props.myRank)
  )
  const data = () => query.data?.data as DataType[] | undefined

  const getTextStyleForRank = (rank: number) => {
    return rank === props.myRank ? { color: '#E49C8E' } : {}
  }

  // shorten user id letters
  const handleShareOnTwitter = () => {
    const currentGame = LEADERBOARD_GAME_LIST.filter((game) => game.key === props.selectedGame)?.[0]
    if (!currentGame) return
    const { display } = currentGame
    const obj = {
      original_referer: 'https://app.niftyleague.com/',
      ref_src: 'twsrc^tfw|twcamp^buttonembed|twterm^share|twgr^',
      text: `I ranked #${props.myRank} on the ${display} Top Score Leaderboard. Check out @niftyleague games: https://app.niftyleague.com/`,
      hashtags: 'NiftyLeague,NFT,NFTGaming',
    }
    if (typeof window !== 'undefined')
      window.open(`https://twitter.com/intent/tweet?${`${new URLSearchParams(obj)}`}`, '_blank')
  }

  return (
    <div class={styles.tableRoot}>
      <Show when={query.isPending && props.myRank}>
        <div class={styles.loadingBox} role="status" aria-label="Loading leaderboard">
          <CircularProgress />
        </div>
      </Show>
      <Show when={query.error}>
        {(error) => (
          <QueryErrorState
            error={error()}
            onRetry={() => void query.refetch()}
            className="flex items-center justify-center gap-3 py-4 text-error"
          />
        )}
      </Show>
      <Table class="modal-table">
        <TableHeader class="header [&_tr]:border-0">
          <TableRow class="row border-0 hover:bg-transparent">
            <TableHead class="cell index" scope="col">
              <code>RANK</code>
            </TableHead>
            <TableHead class="cell ellipsis" scope="col">
              <code>USERNAME</code>
            </TableHead>
            <Show when={props.flag === 'win_rate'}>
              <TableHead class="cell ellipsis" scope="col">
                <code>WIN RATE</code>
              </TableHead>
            </Show>
            <Show when={props.flag === 'earnings'}>
              <TableHead
                class="cell ellipsis"
                scope="col"
                style={{ 'font-size': '10px', 'text-align': 'center' }}
              >
                <code>TOTAL NFTL EARNED</code>
              </TableHead>
            </Show>
            <Show when={props.selectedGame === 'nifty_smashers'}>
              <TableHead
                class="cell ellipsis"
                scope="col"
                style={{ 'font-size': '10px', 'text-align': 'center' }}
              >
                <code>MATCHES PLAYED</code>
              </TableHead>
            </Show>
            <Show when={props.flag === 'earnings'}>
              <TableHead
                class="cell ellipsis"
                scope="col"
                style={{ 'font-size': '10px', 'text-align': 'center' }}
              >
                <code>AVG,NFTL / MATCH</code>
              </TableHead>
            </Show>
            <Show when={props.flag !== 'win_rate' && props.selectedGame === 'nifty_smashers'}>
              <TableHead class="cell ellipsis" scope="col">
                <code>KILLS</code>
              </TableHead>
            </Show>
            <Show when={props.flag === 'score'}>
              <TableHead class="cell ellipsis" scope="col">
                <code>HIGH SCORE</code>
              </TableHead>
            </Show>
            <Show when={props.flag === 'burnings'}>
              <TableHead class="cell ellipsis" scope="col">
                <code>NFTL BURNED</code>
              </TableHead>
            </Show>
          </TableRow>
        </TableHeader>
        <TableBody class="body">
          <For each={data()}>
            {(i) => (
              <TableRow class="row first border-0 hover:bg-transparent">
                <TableCell class="cell index" style={{ color: '#9ba5bf' }}>
                  <span class={styles.rankBody} style={getTextStyleForRank(i.rank)}>
                    {i.rank}
                  </span>
                  <Show when={i.rank === 1}>
                    <div class={styles.lineTopBox} />
                  </Show>
                  <Show when={i.rank === 10}>
                    <div class={styles.lineBottomBox} />
                  </Show>
                </TableCell>
                <TableCell
                  style={{
                    ...getTextStyleForRank(i.rank),
                    'font-size': '14px',
                    background: '',
                  }}
                  class="cell ellipsis"
                >
                  {i.user_id}
                  <Show when={i.rank === 1}>
                    <div class={styles.lineTopBox} />
                  </Show>
                  <Show when={i.rank === 10}>
                    <div class={styles.lineBottomBox} />
                  </Show>
                </TableCell>
                <Show when={props.flag === 'win_rate'}>
                  <TableCell class="cell ellipsis">{i.stats.win_rate}</TableCell>
                </Show>
                <Show when={props.flag === 'earnings'}>
                  <TableCell class="cell ellipsis end">
                    {i.stats.earnings}
                    <Show when={i.rank === 1 && props.flag === 'earnings'}>
                      <div class={styles.lineTopBox} />
                    </Show>
                    <Show when={i.rank === 10 && props.flag === 'earnings'}>
                      <div class={styles.lineBottomBox} />
                    </Show>
                  </TableCell>
                </Show>
                <Show when={props.selectedGame === 'nifty_smashers'}>
                  <TableCell
                    style={{
                      ...getTextStyleForRank(i.rank),
                      'font-size': '14px',
                      background: '',
                    }}
                    class="cell ellipsis end"
                  >
                    {i.stats.matches}
                    <Show when={i.rank === 1 && props.flag === 'earnings'}>
                      <div class={styles.lineTopBox} />
                    </Show>
                    <Show when={i.rank === 10 && props.flag === 'earnings'}>
                      <div class={styles.lineBottomBox} />
                    </Show>
                  </TableCell>
                </Show>
                <Show when={props.flag === 'earnings'}>
                  <TableCell class="cell ellipsis end">
                    {i.stats['avg_NFTL/match']}
                    <Show when={i.rank === 1}>
                      <div class={styles.lineTopBox} />
                    </Show>
                    <Show when={i.rank === 10}>
                      <div class={styles.lineBottomBox} />
                    </Show>
                  </TableCell>
                </Show>
                <Show when={props.flag !== 'win_rate' && props.selectedGame === 'nifty_smashers'}>
                  <TableCell class="cell ellipsis end">{i.stats.kills}</TableCell>
                </Show>
                <Show when={props.selectedGame !== 'nifty_smashers'}>
                  <TableCell
                    style={{ ...getTextStyleForRank(i.rank), 'font-size': '14px' }}
                    class="cell ellipsis end"
                  >
                    {i.score}
                  </TableCell>
                </Show>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
      <Show when={data()}>
        <button type="button" class={styles.twitterTypography} onClick={handleShareOnTwitter}>
          Share on twitter{' '}
          <NativeImage src="/icons/socials/twitter.svg" alt="Twitter Icon" width={22} height={20} />
        </button>
      </Show>
    </div>
  )
}

type TopModalProps = TableModalProps & {
  onOpenChange: (open: boolean) => void
  open: boolean
}

const TopModal = (props: TopModalProps): JSX.Element | null => {
  return (
    <CustomModal
      child={
        <TableModal
          selectedGame={props.selectedGame}
          flag={props.flag}
          selectedTimeFilter={props.selectedTimeFilter}
          myRank={props.myRank}
        />
      }
      flag={props.flag}
      onOpenChange={props.onOpenChange}
      open={props.open}
    />
  )
}
export default TopModal
