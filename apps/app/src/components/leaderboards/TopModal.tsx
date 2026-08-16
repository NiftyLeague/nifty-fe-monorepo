'use client'

import { useEffect, useState } from 'react'
import NativeImage from '@nl/ui/custom/native-image'

import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nl/ui/base/table'

import { fetchScores } from '@/utils/leaderboard'
import type { DataType } from '@/types/leaderboard'
import { LEADERBOARD_GAME_LIST } from '@/constants/leaderboards'
import CustomModal from './CustomModal'
import './modal-table.css'

import styles from './TopModal.module.css'

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
}: TableModalProps): React.ReactNode | null => {
  const [data, setData] = useState<DataType[]>()

  useEffect(() => {
    if (!myRank) {
      setData(undefined)
      return
    }

    let active = true
    void fetchScores(selectedGame, flag, selectedTimeFilter, 10, myRank < 3 ? 0 : myRank - 3).then(
      (ret) => {
        if (active) setData(ret.data)
      }
    )

    return () => {
      active = false
    }
  }, [flag, myRank, selectedGame, selectedTimeFilter])

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
    <div className={styles.tableRoot}>
      {!data && (
        <div className={styles.loadingBox} role="status" aria-label="Loading leaderboard">
          <CircularProgress />
        </div>
      )}
      <Table className="modal-table">
        <TableHeader className="header [&_tr]:border-0">
          <TableRow className="row border-0 hover:bg-transparent">
            <TableHead className="cell index" scope="col">
              <code>RANK</code>
            </TableHead>
            <TableHead className="cell ellipsis" scope="col">
              <code>USERNAME</code>
            </TableHead>
            {flag === 'win_rate' && (
              <TableHead className="cell ellipsis" scope="col">
                <code>WIN RATE</code>
              </TableHead>
            )}
            {flag === 'earnings' && (
              <TableHead
                className="cell ellipsis"
                scope="col"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>TOTAL NFTL EARNED</code>
              </TableHead>
            )}
            {selectedGame === 'nifty_smashers' && (
              <TableHead
                className="cell ellipsis"
                scope="col"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>MATCHES PLAYED</code>
              </TableHead>
            )}
            {flag === 'earnings' && (
              <TableHead
                className="cell ellipsis"
                scope="col"
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                <code>AVG,NFTL / MATCH</code>
              </TableHead>
            )}
            {flag !== 'win_rate' && selectedGame === 'nifty_smashers' && (
              <TableHead className="cell ellipsis" scope="col">
                <code>KILLS</code>
              </TableHead>
            )}
            {flag === 'score' && (
              <TableHead className="cell ellipsis" scope="col">
                <code>HIGH SCORE</code>
              </TableHead>
            )}
            {flag === 'burnings' && (
              <TableHead className="cell ellipsis" scope="col">
                <code>NFTL BURNED</code>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="body">
          {data?.map((i) => (
            <TableRow
              className="row first border-0 hover:bg-transparent"
              key={`${i.rank}-${i.user_id}`}
            >
              <TableCell className="cell index" style={{ color: '#9ba5bf' }}>
                <span className={styles.rankBody} style={getTextStyleForRank(i.rank)}>
                  {i.rank}
                </span>
                {i.rank === 1 && <div className={styles.lineTopBox} />}
                {i.rank === 10 && <div className={styles.lineBottomBox} />}
              </TableCell>
              <TableCell
                style={{ ...getTextStyleForRank(i.rank), fontSize: 14, background: '' }}
                className="cell ellipsis"
              >
                {i.user_id}
                {i.rank === 1 && <div className={styles.lineTopBox} />}
                {i.rank === 10 && <div className={styles.lineBottomBox} />}
              </TableCell>
              {flag === 'win_rate' && (
                <TableCell className="cell ellipsis">{i.stats.win_rate}</TableCell>
              )}
              {flag === 'earnings' && (
                <TableCell className="cell ellipsis end">
                  {i.stats.earnings}
                  {i.rank === 1 && flag === 'earnings' && <div className={styles.lineTopBox} />}
                  {i.rank === 10 && flag === 'earnings' && <div className={styles.lineBottomBox} />}
                </TableCell>
              )}
              {selectedGame === 'nifty_smashers' && (
                <TableCell
                  style={{ ...getTextStyleForRank(i.rank), fontSize: 14, background: '' }}
                  className="cell ellipsis end"
                >
                  {i.stats.matches}
                  {i.rank === 1 && flag === 'earnings' && <div className={styles.lineTopBox} />}
                  {i.rank === 10 && flag === 'earnings' && <div className={styles.lineBottomBox} />}
                </TableCell>
              )}
              {flag === 'earnings' && (
                <TableCell className="cell ellipsis end">
                  {i.stats['avg_NFTL/match']}
                  {i.rank === 1 && <div className={styles.lineTopBox} />}
                  {i.rank === 10 && <div className={styles.lineBottomBox} />}
                </TableCell>
              )}
              {flag !== 'win_rate' && selectedGame === 'nifty_smashers' && (
                <TableCell className="cell ellipsis end">{i.stats.kills}</TableCell>
              )}
              {selectedGame !== 'nifty_smashers' && (
                <TableCell
                  style={{ ...getTextStyleForRank(i.rank), fontSize: 14 }}
                  className="cell ellipsis end"
                >
                  {i.score}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data && (
        <button type="button" className={styles.twitterTypography} onClick={handleShareOnTwitter}>
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
}: TopModalProps): React.ReactNode | null => {
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
